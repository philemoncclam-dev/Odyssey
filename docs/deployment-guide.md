# Deploying Odyssey — enterprise setup guide

What it takes to stand this app up against a real Entra tenant and a real
Fabric tenant, in the order that actually works. Written for whoever owns
Entra/Fabric admin rights in your organization; each step names the exact
portal blade or `az` command, and which file in this repo the resulting
value feeds into.

Two independent things get wired here, and they can be done in either order
but not skipped: **sign-in + browsing** (every user sees exactly what their
own Fabric permissions allow) and **service-principal-run sandbox mode**
(any signed-in user can execute a notebook they can see, even if their own
Fabric role wouldn't let them read its source directly). Skip Phase 2 if you
don't need Viewer-role users to run sandbox mode — Phase 1 alone is a
complete, correctly-permissioned app.

---

## Phase 1 — sign-in and Fabric browsing

Everything here is user-delegated: the browser calls Fabric with the
signed-in user's own token, so the Explore tree always matches their real
Fabric access. No server, no credential, nothing to deploy yet.

### 1. App registration for sign-in

**Entra ID → App registrations → New registration.**

- Supported account types: single tenant (or per your org's usual choice)
- Platform: **Single-page application**, redirect URI = your deployed
  origin (e.g. `https://odyssey.yourorg.com`) — add `http://localhost:5173`
  too if developers need local dev
- Record the **Application (client) ID** and **Directory (tenant) ID**

These go in `app/src/organization.config.ts` (or its `.env`-backed
equivalents `VITE_MSAL_CLIENT_ID` / `VITE_MSAL_TENANT_ID` — see that file's
header for which is meant to be committed vs. per-environment).

### 2. API permissions on that registration

**API permissions → Add a permission**, delegated, on this same
registration:

- **Power BI Service** → `Workspace.Read.All` (this is Fabric's REST API's
  permission surface in Entra, still under its historical name)
- **Azure Storage** → `user_impersonation` (OneLake rides on this — needed
  for table schema reads)
- Graph's `User.Read` is present by default; leave it

**Grant admin consent** for both — a tenant admin does this once, in the
same blade.

### 3. Who's allowed in

`app/src/organization.config.ts`'s `ALLOWED_EMAIL_DOMAINS` — app-side
allowlist, editable without touching Entra. List your organization's real
verified domain(s). This is separate from and in addition to whatever Entra
tenant membership already requires.

### 4. Build/deploy the frontend

Standard static-site deploy (`npm run build` in `app/`, ship `dist/` to your
static host of choice) with these set at build time:

```
VITE_MSAL_CLIENT_ID=<from step 1>
VITE_MSAL_TENANT_ID=<from step 1>
VITE_FABRIC_REAL=1
```

At this point sign-in works and Explore shows real workspaces, scoped
exactly to what each signed-in user's Fabric role actually grants —
including Fabric's own "you can see this workspace's name but not its
contents" distinction for admin accounts, which is Fabric's behavior, not
a bug to route around.

**A note if you're on `@azure/msal-browser` ^5.x specifically:** its popup
sign-in flow depends on a "bridge" handshake that does not resolve in a
plain browser tab in current releases — the popup gets a valid auth code but
never self-closes. `app/src/auth/AuthProvider.tsx` uses `loginRedirect` /
`acquireTokenRedirect` instead, which sidesteps it entirely. If you're on a
different msal-browser version, popup flow may work fine and you can revert
that choice — but redirect is the safer default until you've verified popup
actually completes.

---

## Phase 2 — service-principal-run sandbox mode

This lets a Viewer-role user still run sandbox mode, because *running* a
notebook (fetching its source, specifically) goes through a service
principal server-side, decoupled from that user's own Fabric role. Fabric's
`getDefinition` API requires Contributor+ — Viewer only covers
listing/metadata — so without this, sandbox mode is Contributor-only.

**Security implication, explicit and intentional:** once this is live, any
signed-in Odyssey user can run/read any notebook the service principal has
Contributor on, regardless of their own individual Fabric role on that
workspace. That is the point, not an accident — decide if that's the
trade-off you want before deploying this phase.

### 5. Host a small backend

`server/` in this repo is an Azure Functions app. For this phase alone you
need one Function App with an identity — not the full
`server/infra/main.bicep` stack (that provisions Cosmos DB + API Management
+ VNet for the *separate* model-storage feature; skip it if you don't need
that feature too).

```bash
az group create --name <rg> --location <region>
az storage account create --name <storage-name> --location <region> \
  --resource-group <rg> --sku Standard_LRS --allow-blob-public-access false
az functionapp create --name <function-app-name> --resource-group <rg> \
  --consumption-plan-location <region> --runtime node --runtime-version 24 \
  --functions-version 4 --storage-account <storage-name> \
  --assign-identity "[system]"
```

`--assign-identity "[system]"` gives it a system-assigned managed identity
in the same step — record the principal ID:

```bash
az functionapp identity show --name <function-app-name> --resource-group <rg>
```

### 6. Grant the identity tenant-wide workspace visibility

**Entra ID → Roles and administrators → Fabric Administrator → Add
assignments** → find the managed identity by the Function App's name (toggle
the picker to show service principals/managed identities if it's filtered
to users).

This grants **listing** rights via Fabric's Admin API — not content access.
Content access (step 8) is separate and per-workspace.

### 7. Allow service principals to call Fabric at all

**Fabric admin portal (app.fabric.microsoft.com → gear icon → Admin
portal) → Tenant settings → Developer settings → "Service principals can
use Fabric APIs."** Enable it, scoped either to the whole org or — better
practice at scale — a specific security group containing just this identity
and any others you explicitly want this capability.

### 8. Give the identity real access, and keep it current automatically

Fabric has no "grant this identity access to every workspace, including
future ones" setting — role assignments are per-workspace, permanently.
Rather than a one-time manual grant (which silently stops covering anything
created after that grant), this repo ships a **daily reconciliation job**
that grants the identity Contributor on every workspace it doesn't already
have, checked via the Admin API listing from step 6:

- `server/src/lib/fabricSp.ts` — `listAllWorkspaces` / `ensureContributorAccess`
- `server/src/functions/fabricAccessSync.ts` — the timer trigger
  (`FABRIC_SYNC_SCHEDULE` env var, NCRONTAB format, defaults to 03:00 UTC daily)

New workspace created → picked up automatically at the next run. No
per-workspace manual step, ever, after initial deploy.

### 9. A second app registration — the backend's own audience

The frontend needs to prove to your Function App *who's calling*, separate
from Fabric entirely — a confidential-client app registration for the API
itself.

**App registrations → New registration** → confidential client → **Expose
an API** → add a scope named `access_as_user`.

- Frontend (`VITE_MODEL_API_SCOPE` in `app/.env`): the full URI,
  `api://<this-app-id>/access_as_user` — this is what you request a token
  *for*.
- Backend (`ENTRA_API_AUDIENCE` app setting): the **bare Application
  (client) ID GUID**, not the URI. A v2.0 access token for a custom API's
  own scope carries `aud` as the client ID; the URI only appears in the
  token's `scp` claim. Setting this to the URI form passes silently at
  deploy time and fails every real request with "Invalid or expired
  token" — confirmed against a real issued token, see
  `docs/azure-student-setup.md`'s log for the chase.
- Backend also needs `ENTRA_TENANT_ID`.
- **Explicitly set `api.requestedAccessTokenVersion` to `2`** on this app
  registration — the Entra portal UI doesn't expose this field, use Graph:
  `az rest --method PATCH --url https://graph.microsoft.com/v1.0/applications/<object-id> --body '{"api":{"requestedAccessTokenVersion":2}}'`.
  Left unset (common for an app registration whose manifest was never
  touched), Entra can still issue a v1-shaped token that fails verification
  here regardless of the audience value being correct.

Back on the **sign-in** app registration from Phase 1, add an API
permission pointing at this new scope, and grant admin consent — same shape
as any first-party API delegation.

### 10. Set the Function App's configuration and deploy

```bash
az functionapp config appsettings set --name <function-app-name> \
  --resource-group <rg> --settings \
  SCM_DO_BUILD_DURING_DEPLOYMENT=true \
  FABRIC_SP_PRINCIPAL_ID=<principal ID from step 5> \
  ENTRA_TENANT_ID=<tenant ID> \
  ENTRA_API_AUDIENCE=<app-id-from-step-9>
```

Then deploy the code — preferably the CI/CD path
(`.github/workflows/deploy-server.yml`, OIDC federation, no stored
credential — see that file's header for the one-time `az ad sp
create-for-rbac` setup). For a manual first pass or a quick redeploy,
**build locally and ship the compiled output** rather than relying on a
remote build:

```bash
cd server && npm install && npm run build   # produces dist/
# zip dist/, node_modules/, package.json, host.json — everything except
# src/, .git, local.settings.json
```

Two things this repo's own first deploy learned the hard way, worth
avoiding:

- **Don't rely on Oryx's remote build** (`SCM_DO_BUILD_DURING_DEPLOYMENT=true`
  with source-only zip). On a Windows Consumption plan (the default unless
  you pass `--os-type linux` to `az functionapp create`), Kudu's `npm
  install` runs with `--production`, which skips `typescript` — a
  devDependency — so `tsc` isn't there to compile `dist/` even with a
  `postinstall: npm run build` script. Building locally sidesteps this
  entirely.
- **Don't deploy a `node_modules`-sized zip through plain `config-zip`** on
  Windows — Kudu's file-by-file `KuduSync` copy can take 10+ minutes for a
  few thousand small files, and looks indistinguishable from hung. Instead,
  upload the zip to a blob container (the Function App's own storage
  account works fine) and point `WEBSITE_RUN_FROM_PACKAGE` at its URL:

```bash
az storage container create --name deploy --account-name <storage-name> --auth-mode key
az storage blob upload --account-name <storage-name> --container-name deploy \
  --name deploy.zip --file <zip path> --auth-mode key --overwrite
SAS=$(az storage blob generate-sas --account-name <storage-name> \
  --container-name deploy --name deploy.zip --permissions r \
  --expiry <ISO8601, e.g. one week out> --auth-mode key -o tsv)
az functionapp config appsettings set --name <function-app-name> --resource-group <rg> \
  --settings "WEBSITE_RUN_FROM_PACKAGE=https://<storage-name>.blob.core.windows.net/deploy/deploy.zip?${SAS}"
az functionapp restart --name <function-app-name> --resource-group <rg>
```

This mounts the zip directly as a read-only filesystem instead of copying
files — seconds, not minutes. Verify it worked by calling a deployed route
directly rather than trusting `az functionapp function list`, which can lag
behind the live host by a couple of minutes after a restart.

### 11. Allow the frontend's origin to actually call it

Function Apps have **no CORS origins allowed by default** — without this,
the browser silently blocks every proxy call and it looks like a network
error, not a permissions error:

```bash
az functionapp cors add --name <function-app-name> --resource-group <rg> \
  --allowed-origins https://odyssey.yourorg.com
```

Add every origin the frontend is actually served from (production domain,
and `http://localhost:5173` too if developers test against this backend
locally).

### 12. Point the frontend at it

```
VITE_FABRIC_PROXY_URL=https://<function-app-name>.azurewebsites.net/api
VITE_MODEL_API_SCOPE=api://<app-id-from-step-9>/access_as_user
```

**Use `VITE_FABRIC_PROXY_URL`, not `VITE_MODEL_API_URL`** — the latter is a
different switch entirely (`model/wiring.ts`'s toggle for the whole
model-storage feature, localStorage vs. a Cosmos-backed remote store).
Setting it by mistake silently moves Model Browser onto a backend that
needs Cosmos wired, whether or not you deployed that — surfaces as "Request
failed (404)" the next time someone opens it. The two features can share
one Function App and one token scope, but each needs its own on/off switch.

Rebuild/redeploy the frontend. `app/src/fabric/wiring.ts` picks up
`workspaces`, `items`, `tables`, `notebookSource`, and `tableSchema` through
the proxy the moment `VITE_FABRIC_PROXY_URL` is set. `pipelineDefinition` is
the one capability left untouched, still user-delegated.

**Browsing through the SP is a real tradeoff, not free simplicity — decide
this deliberately, don't inherit it by default.** The original design kept
`workspaces`/`items`/`tables` user-delegated specifically so each signed-in
user's Explore tree matched *their own* real Fabric access — that's what
this repo's first deployment attempt did. It got abandoned there after a
delegated-token block that didn't resolve cleanly (real workspace role,
capacity, tenant-wide consent, and license all confirmed present, still
refused acquiring a token for that specific resource/scope — see
`docs/azure-student-setup.md`'s log for the full diagnostic trail, possibly
a Security Defaults / device-code-flow confound that was never fully
isolated). If delegated browsing works cleanly in your tenant, prefer
keeping `workspaces`/`items`/`tables` on `fabric/realApi.ts` (delegated) and
only route `notebookSource`/`tableSchema` through the proxy — that was
always the minimum needed for SP-run sandbox mode. Routing browsing through
the SP too means **every signed-in user sees the same tenant-wide list**
(whatever the SP has via the reconciliation job), not filtered per person —
acceptable for a small trusted team, a real regression for anything larger.
`app/src/fabric/spProxyApi.ts`'s header has the full comparison against
lineage-studio's prototype, which took the SP-for-everything approach from
the start.

---

## What's still not covered by either phase

- **`sandbox/service.py`** (the actual notebook-execution engine) is a
  separate piece — a loopback-only developer tool by design, not deployed
  by anything above. `docs/fabric-toolkit-wiring.md`'s "Deploying it"
  section covers what a real deployment of that needs (its own service,
  no secrets in the host environment, your own auth in front).
- **`observedRun`** (what a notebook's last real Fabric-triggered run
  actually did) needs a Spark History Server proxy this repo doesn't
  implement.
- **Copy-activity lineage** inside `pipelineDefinition` — the activity graph
  is real, but a Copy step's actual source/sink table references aren't
  resolved yet (see `server`-side and `fabric/realApi.ts`'s comments on
  `resolvePipelineActivities`).

## Verifying it actually worked

Both `realApi.ts` and the service-principal path in `fabricSp.ts` are
written from Fabric's public REST documentation, not tested against a live
tenant by whoever wrote them — treat exact response shapes (field names,
pagination envelopes) as best-effort until your first real call confirms
them. If something 404s or comes back with unexpected fields, that's the
expected first-contact adjustment, not a sign the whole approach is wrong.
