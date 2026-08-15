# Wiring Odyssey to a student Azure account — running log

Working log for connecting this checkout to real Azure/Entra/Fabric resources
on a student subscription. Filled in as each step is done — check off, note
the actual value/resource name used (redact secrets, IDs are fine), so this
is resumable if the session breaks.

Order matters: sign-in has to work before Fabric access means anything, and
Fabric access has to work before there's real data to run the sandbox against.

## Plan

### Phase 1 — sign-in + user-delegated Fabric browsing (done)

1. [x] **App registration #1** — SPA, for sign-in (MSAL) — `app/src/auth/config.ts`
2. [x] **API permissions on #1** — Fabric `Workspace.Read.All`, OneLake `user_impersonation`, admin consent
3. [x] **`app/.env`** — client id / tenant id / `VITE_FABRIC_REAL=1`
4. [x] **`ALLOWED_EMAIL_DOMAINS`** (`organization.config.ts`) — tenant's real domain, not gmail.com
5. [x] Sign-in flow fixed: `AuthGate` restored in `main.tsx`; MSAL switched from
   popup to **redirect** (this `@azure/msal-browser` version's popup bridge
   never resolves in a plain tab — see `AuthProvider.tsx`'s header comment)

Explore now correctly shows exactly what the signed-in user's own Fabric
permissions allow — including the "forbidden, not empty" distinction for
workspaces they're not a member of. Confirmed working.

### Phase 2 — service-principal-run sandbox mode (in progress)

Goal: a Viewer-role user can still run sandbox mode, because *running* a
notebook goes through a service principal / managed identity server-side,
while *browsing* (Explore) stays user-delegated so visibility still matches
each person's real Fabric access. Mirrors how the lineage-studio prototype
worked (service principal underneath, app-level "Viewer" label on top) but
keeps the credential server-side per `fabric/realApi.ts`'s design note,
instead of in the browser bundle.

Hosting decision: extend the existing `server/` Azure Functions app (not a
new Container App) — it already has bearer-token auth (`server/src/lib/auth.ts`),
a deploy pipeline, and the keyless/Managed-Identity pattern this needs. A
Container App only earns its keep for something that needs to run
continuously or needs a runtime Functions can't host — true later for
`sandbox/service.py`, not for this.

6. [x] **Deploy a minimal Function App** (not the full `server/infra/main.bicep`
   stack — this feature needs no Cosmos/APIM/VNet, just one Function with
   an identity) — `odyssey-fabric-api` in resource group `odyssey-rg`,
   East US, consumption plan, Node 24
7. [x] **System-assigned managed identity** on the Function App —
   principal ID `64e0f44c-e65d-4261-b0f6-c92f8111955a`
8. [x] **Grant the MI "Fabric Administrator"** (Entra directory role) — tenant-wide
   workspace *listing* via Fabric's Admin API, not content access
9. [x] **Enable "service principals can use Fabric APIs"** in the Fabric admin
   portal, scoped to the entire organization
10. [x] **Timer-triggered reconciliation Function** —
    `server/src/functions/fabricAccessSync.ts`, daily (`0 0 3 * * *` UTC,
    overridable via `FABRIC_SYNC_SCHEDULE`), lists all workspaces via the
    Admin API (`lib/fabricSp.ts`'s `listAllWorkspaces`) and grants the MI
    Contributor wherever missing (`ensureContributorAccess`)
11. [x] **`notebookSource` proxy route** —
    `server/src/functions/notebookSource.ts` (`GET
    /api/fabric/workspaces/{workspaceId}/notebooks/{itemId}/source`), fetches
    the definition as the MI via `lib/fabricSp.ts`'s `fetchNotebookCellsAsSp`
12. [x] Wired in `app/src/fabric/wiring.ts` — `notebookSource` alone goes
    through `fabric/spProxyApi.ts` (reuses `VITE_MODEL_API_URL` /
    `acquireModelApiToken` from `model/remoteStore.ts`, same server, same
    token scope) whenever that env var is set; `workspaces`/`items`/`tables`
    are untouched, still user-delegated via `realApi.ts`
13. [x] **Deploy the updated `server/` code** to `odyssey-fabric-api` — see
    Log for what it took to actually get this working
14. [x] **Set `FABRIC_SP_PRINCIPAL_ID`** on the Function App to the MI's
    principal id (`64e0f44c-e65d-4261-b0f6-c92f8111955a`)
15. [x] **App registration #2** (confidential client, the server's own
    audience) — client id `e8392c71-7c42-4c5c-b09f-185c5e6803bd`, scope
    `access_as_user` exposed at `api://e8392c71-7c42-4c5c-b09f-185c5e6803bd/access_as_user`
16. [x] Set `VITE_FABRIC_PROXY_URL` / `VITE_MODEL_API_SCOPE` in `app/.env` —
    **not** `VITE_MODEL_API_URL`: that var is `model/wiring.ts`'s own switch
    for the entire model-storage feature (localStorage vs. Cosmos-backed
    remote store), unrelated to this proxy. Using it by mistake silently
    flipped Model Browser onto a backend with no Cosmos wired — "Couldn't
    open the model browser: Request failed (404)." `spProxyApi.ts` now
    reads its own `VITE_FABRIC_PROXY_URL` instead.
17. [x] **CORS**: Function App had zero allowed origins by default — the
    browser silently blocked every proxy call. Added
    `http://localhost:5173` via `az functionapp cors add`.
18. [x] **Extended the proxy to `tableSchema`, not just `notebookSource`** —
    opening a table showed the same "forbidden, not empty" wall, because
    OneLake's data-plane ACLs don't automatically follow a Fabric workspace
    role at all (separate from the getDefinition/Contributor+ issue
    notebookSource solves). `server/src/lib/fabricSp.ts`'s
    `fetchTableSchemaAsSp`, `server/src/functions/tableSchema.ts`,
    `spProxyApi.ts` updated, `wiring.ts` renamed `notebookSourceOverride` →
    `spOverrides` since it now covers two capabilities.
19. [x] **Extended the proxy to `workspaces`/`items`/`tables` too — browsing
    is no longer user-delegated.** Root cause chase before deciding this:
    dev@'s workspace role was confirmed real (Admin, the highest level, via
    the Admin API's role-assignments listing), every workspace had a
    capacity assigned, tenant-wide admin consent for `Workspace.Read.All`
    was confirmed present (`AllPrincipals` grant via Graph), and the account
    had a Power BI/Fabric license. A device-code token request for
    Odyssey's own app registration + that scope, signed in as dev@, still
    got "sign-in successful, but you don't have permission to access this
    resource" — refused before even reaching Fabric. Root cause not found
    (possibly Security Defaults blocking the device-code flow specifically,
    confounding that one diagnostic — genuinely unresolved). Checked
    lineage-studio's own service principal (`Lineage-Studio-Dev-2`) for
    comparison: it has **zero** delegated permissions granted at all —
    it never did per-user browsing either; it's SP-for-everything, same
    as the direction this went. `server/src/lib/fabricSp.ts`'s
    `fetchWorkspacesAsSp`/`fetchItemsAsSp`/`fetchTablesAsSp`,
    `server/src/functions/fabricBrowse.ts`, `spProxyApi.ts` and
    `wiring.ts` updated — `wiring.ts`'s existing "SP overrides spread last"
    pattern meant no wiring *logic* change was needed, just extending what
    `spFabricApi()` returns.
    **Real, deliberate cost:** every signed-in user now sees the same
    tenant-wide workspace list (whatever the SP has via
    `fabricAccessSync.ts`'s daily reconciliation), not filtered to their own
    individual Fabric access. `notebookSource`/`tableSchema`'s
    permission-widening was intentional from the start; this one wasn't the
    original plan, but is now the actual state — if the delegated-token
    block gets root-caused later, reverting browsing to `realApi.ts` is a
    `wiring.ts`-only change, every proxy method has an identical-shape twin.
20. [x] **`app/.env` was missing `VITE_FABRIC_PROXY_URL` entirely** — asked
    for it to be added twice, it never actually landed (only
    `VITE_MODEL_API_SCOPE` did). Without it, `wiring.ts`'s `spOverrides`
    check silently evaluated false and everything fell through to the old
    user-delegated path — same symptom as before, easy to mistake for "the
    fix didn't work." Verified by reading the file directly instead of
    trusting a report of "saved."
21. [x] **`ENTRA_API_AUDIENCE` was set to the wrong shape twice over** — this
    was a real pre-existing bug in `server/README.md`'s own documented setup
    steps, not something introduced this session: (a) the app registration's
    `api.requestedAccessTokenVersion` was `null`, which can produce a
    v1-shaped token; set explicitly to `2` via Graph. (b) Even after that,
    `ENTRA_API_AUDIENCE` was set to the App ID URI
    (`api://e8392c71.../access_as_user` per the README's own instructions)
    but a real v2.0 token for a custom API's own scope carries `aud` as the
    **bare client ID GUID** — the URI only shows up in `scp`. Diagnosed by
    decoding the actual browser-held token (Firefox console,
    `sessionStorage` → base64-decode the JWT payload) rather than guessing
    further; fixed by setting `ENTRA_API_AUDIENCE=e8392c71-7c42-4c5c-b09f-185c5e6803bd`
    (no `api://` prefix). `server/src/lib/auth.ts`, `server/README.md`, and
    `docs/deployment-guide.md` all corrected so this doesn't repeat for a
    real deployment.
22. [x] **`status()` was never moved to the SP proxy — the actual root cause
    of "still broken" after everything else checked out.** Every other
    capability's fix was real, confirmed via Application Insights request
    logs showing genuine `200`s on `fabric-workspaces`/`fabric-items`
    seconds before the user still saw nothing. `status()` gates whether
    Explore attempts anything at all (`explore.tsx`'s early return on
    `!status.data?.configured`), and it was still calling
    `realApi.ts`'s delegated `/workspaces` check — the exact call that hits
    the unresolved delegated-token block from item 19. A working proxy
    behind a broken gate looks identical to "nothing works." Added `status`
    to `spProxyApi.ts`'s `spFabricApi()` (reuses the same `/fabric/workspaces`
    proxy call, success = configured), updated `wiring.ts`'s header.
23. [ ] Retest — dev server restarted with the fix loaded.

**Security note, deliberate and worth remembering later:** once this ships,
any signed-in Odyssey user can run/read any notebook the MI has Contributor
on, regardless of their own individual Fabric role on that workspace — that
is the whole point (bypassing the Viewer restriction on `getDefinition`),
not an accidental widening.

## Log

- App registration #1 (SPA, sign-in): client id `23c36e03-8b63-4182-bc8a-13896f0d48e1`,
  tenant id `4e8dd919-a3da-4b30-8c63-7501a49b302c`. Redirect URI:
  `http://localhost:5173` (single-page application platform; port drifted
  from the original 5174 registration — both are registered now).
- API permissions granted + admin-consented: Graph `User.Read` (default),
  Power BI Service `Workspace.Read.All` (delegated), Azure Storage
  `user_impersonation` (delegated) — covers Fabric REST + OneLake per
  `app/src/auth/config.ts`'s `fabricLoginRequest`/`onelakeLoginRequest`.
- `ALLOWED_EMAIL_DOMAINS` set to `philemoncclamgmail.onmicrosoft.com` (the
  tenant's real default domain — gmail.com was a stale placeholder, removed).
- MSAL popup flow replaced with redirect flow in `AuthProvider.tsx` — this
  `@azure/msal-browser` version's popup "bridge" handshake
  (`waitForBridgeResponse`) never resolves in a plain browser tab, so the
  popup got the auth code but never self-closed. Redirect sidesteps it.
- Rail's "What is this?" help button + `OnboardingTour` deleted (unused
  once removed); replaced with a Sign in / Sign out button in
  `RailBottomCluster.tsx`, wired to `useAuth()`.
- Confirmed: seeing workspace *names* you're not a member of, with
  "forbidden" on their contents, is Fabric's own admin-visibility behavior
  for a Fabric/Global Administrator account — not an app bug. A non-admin
  test account only sees what it's actually been granted, correctly.
- Confirmed: a Viewer-role account getting "forbidden" running sandbox mode
  is Fabric's real authorization model — `getDefinition` needs Contributor+,
  Viewer only covers listing/metadata. This is what Phase 2 exists to work
  around, deliberately, via a service principal server-side.
- Code written and passing (typecheck + full test suite, both `server/` and
  `app/`): `server/src/lib/fabricSp.ts`,
  `server/src/functions/notebookSource.ts`,
  `server/src/functions/fabricAccessSync.ts`, `app/src/fabric/spProxyApi.ts`,
  `app/src/fabric/wiring.ts` updated. Not yet deployed — see items 13-16.
  New env vars: `FABRIC_SP_PRINCIPAL_ID`, `FABRIC_SYNC_SCHEDULE` (server,
  optional) — see `server/local.settings.json.example`.
- **Deploying this Function App was the hard part — three failed attempts
  before it worked, worth remembering for next time:**
  1. First zip deploy (source only, remote Oryx build): succeeded per Azure's
     own status, but `az functionapp function list` came back empty. Turned
     out Oryx's Node builder ran `npm install` but never ran `npm run build`,
     so `dist/` never existed and `package.json`'s `"main":
     "dist/src/functions/*.js"` glob matched nothing.
  2. Added a `postinstall: npm run build` script to trigger the build
     automatically — but this Function App landed on Windows (Consumption
     defaults to Windows unless `--os-type linux` is passed), and Windows
     Kudu's `npm install` runs with `--production`, which skips
     `typescript` (a devDependency) entirely. `tsc` wasn't there to run.
  3. Fix: stopped relying on server-side build. Built locally
     (`npm run build`), zipped `dist/` + full `node_modules` + `package.json`
     + `host.json` directly, `SCM_DO_BUILD_DURING_DEPLOYMENT=false`. But the
     ~28MB zip deployed via plain `config-zip` (KuduSync, file-by-file copy)
     hung for 10+ minutes copying thousands of small `node_modules` files —
     normal Windows App Service behavior, not a failure, just very slow.
  4. Actual fix: uploaded the zip to a blob container in the Function App's
     own storage account and set `WEBSITE_RUN_FROM_PACKAGE` to that blob's
     SAS URL, then restarted the app. This mounts the zip directly as a
     read-only filesystem instead of copying files — seconds, not minutes.
     Confirmed working by calling the deployed route directly (500 with
     "Internal error" — expected, since `ENTRA_TENANT_ID`/`ENTRA_API_AUDIENCE`
     aren't set until step 15) rather than trusting `az functionapp function
     list`, which lagged behind the live host.
  **For next time:** for a TypeScript Azure Functions app being zip-deployed
  to a Windows Consumption plan, skip remote build entirely — build locally,
  then deploy via a blob URL + `WEBSITE_RUN_FROM_PACKAGE` from the start.
- Function App deployed: `odyssey-fabric-api` (resource group `odyssey-rg`,
  subscription `22a189cc-473e-4b22-a4fd-0b54dcf5c5ad`, East US, consumption
  plan, Node 24, host `odyssey-fabric-api.azurewebsites.net`). Storage
  account `odysseyfuncsa86941` (required by Functions, not app data).
  System-assigned managed identity principal ID:
  `64e0f44c-e65d-4261-b0f6-c92f8111955a`.
- MI granted "Fabric Administrator" (Entra directory role) — confirmed
  assigned via the Entra portal picker.
- Fabric admin portal → Tenant settings → Developer settings → "Service
  principals can use Fabric APIs" enabled, scoped to the entire
  organization (not a security group — simplest for a single-SP student
  tenant; revisit if this tenant ever has more than one SP/app that
  shouldn't share this blanket grant).
