# Odyssey model-storage API

A shared `ModelStore` + `HistoryStore` backend — Cosmos DB behind Azure
Functions, fronted by API Management, on a private VNet — so models AND
their branching history can be shared between users instead of living in
one browser's `localStorage`.

**UNVERIFIED.** Written against the documented Cosmos DB, Azure Functions
v4, APIM, and Entra ID shapes with no deployed instance to test end-to-end.
Every Bicep file here compiles clean (`az bicep build`) — that's syntax, not
a guarantee the resources behave exactly as commented. Treat the first real
deployment as the actual test.

```
Internet ──> APIM (public gateway, JWT-validated, rate-limited)
               │  (over the VNet, never the internet)
               ▼
           Function App (locked to APIM's subnet only)
               │  (over the VNet, via Private Endpoint)
               ▼
           Cosmos DB (public network access OFF)
```

## Design, and why it isn't a straight port

An earlier draft of this backend just translated `lineage-studio`'s
Supabase/Postgres schema into Azure SQL, table for table. That's the wrong
call here:

1. **A `LineageModel` is a document, not a set of rows** — layers nesting
   objects nesting attributes, plus a properties side-table. Cosmos DB's
   NoSQL API stores that shape natively.
2. **A commit has to be atomic.** `POST /models/{id}/commit`
   (`src/functions/commit.ts`) updates the model's current state, creates a
   version snapshot, AND moves a branch's head pointer — all three or none.
   Cosmos's `TransactionalBatch` gives that for free, as long as everything
   shares a partition key — every document belonging to one model is
   partitioned by `/modelId`. See `src/lib/cosmos.ts`'s header.

The three-way merge algorithm (`app/src/model/merge3.ts`) still runs in the
**browser** — real, already-tested logic; porting it server-side would mean
maintaining it in two languages. See `app/src/model/remoteHistoryStore.ts`'s
header.

## What this is not

It does not implement multi-branch presence/locking — two people committing
to the same branch at the same moment can still race (the second commit
becomes a merge candidate against the first, same as two git pushes racing
a remote). Real-time collaboration (live cursors, presence) is not
attempted.

It has no sharing UI on the frontend yet. `LineageModel.owner`/`sharedWith`
round-trip through this API and `POST /api/models/{id}/shares` works, but
nothing in the app calls it.

## Architecture

- **Cosmos DB (NoSQL API, serverless, public access OFF)** — one container,
  `Models`, four document shapes (`ModelDoc`/`ShareDoc`/`BranchDoc`/`VersionDoc`
  in `src/lib/cosmos.ts`), all partitioned by `/modelId`. Reachable only via
  Private Endpoint (`infra/main.bicep`) — there is no public network path to
  it at all, from anywhere, once deployed.
- **Azure Functions (Node/TypeScript, v4 model, Flex Consumption)** — one
  HTTP function per route in `src/functions/`. VNet-integrated for outbound
  (reaches Cosmos privately) and access-restricted for inbound (refuses
  everything except traffic from APIM's own subnet — see
  `ipSecurityRestrictions` in `infra/main.bicep`).
- **API Management (`infra/modules/apim.bicep`)** — the only public door.
  Validates the Entra JWT a second time at the gateway (defense in depth,
  not redundant with `src/lib/auth.ts` — the gateway check rejects bad
  tokens before they cost a Function invocation), rate-limits
  (120 calls/60s per token), and applies CORS for the SPA's origin.
- **Auth**: bearer tokens from a **second, separate** Entra app
  registration — this API's own, not the Fabric/Graph ones.
- **Monitoring (`infra/modules/monitoring.bicep`)** — one Log Analytics
  workspace every resource's diagnostics flow into, one Action Group, and
  two alert rules on day one: Function 5xx errors, Cosmos request
  throttling (429s) — a capacity problem worth knowing about before someone
  reports it as a bug.
- **Keyless everywhere.** No connection string, no Cosmos primary key, no
  storage account key, no APIM subscription key, anywhere in this package's
  config or in Bicep. Every service talks to every other service as its own
  Managed Identity, granted the minimum RBAC role it needs.
- **Tags** (`tags` param, default `{application: odyssey, environment:
  production}`) on every resource, for cost allocation — pass your own via
  the Bicep parameter if your org has a chargeback convention.

## Entra setup (the one fully-manual step)

Bicep can't create Entra app registrations — that needs Microsoft Graph
permissions most deployment identities don't carry:

1. **The SPA's registration already exists** (`app/src/auth/config.ts`) —
   nothing about it changes.
2. **Create a second app registration for this API** — a confidential
   client. Under "Expose an API", add a scope named `access_as_user`; the
   full URI (`api://<this-app-id>/access_as_user`) is what
   `VITE_MODEL_API_SCOPE` on the frontend requests. **`entraApiAudience` is
   different: the bare Application (client) ID GUID, not the URI.** A v2.0
   access token for a custom API's own scope carries `aud` as the client ID
   — the App ID URI only shows up in the token's `scp` claim — so setting
   `entraApiAudience` to the URI form makes every real request fail
   token verification with "Invalid or expired token" even though the
   token itself is fine. Confirmed against a real issued token; see
   `docs/azure-student-setup.md`'s log. Also explicitly set this
   registration's **`api.requestedAccessTokenVersion` to `2`** (Entra
   portal doesn't expose this field directly — use Graph:
   `az rest --method PATCH --url https://graph.microsoft.com/v1.0/applications/<object-id> --body '{"api":{"requestedAccessTokenVersion":2}}'`)
   — left unset, Entra can still issue a v1-shaped token that fails
   verification regardless of the audience value. Back on the **SPA's**
   registration, add an "API permission" pointing at the `access_as_user`
   scope and grant admin consent.

## Deploying

**Via CI/CD (recommended)** — `.github/workflows/deploy-server.yml` builds,
tests, deploys the infrastructure, then deploys the code, on every push to
`main` that touches `server/`. It uses OIDC federation (no stored Azure
credential, no secret in GitHub) — see that file's header for the one-time
`az ad sp create-for-rbac` + `az ad app federated-credential create` setup,
and set these as GitHub repository **variables** (not secrets — none of
them are passwords): `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,
`AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `ENTRA_TENANT_ID`,
`ENTRA_API_AUDIENCE`, `ALERT_EMAIL`, `CORS_ALLOWED_ORIGINS_JSON` (a JSON
array string, e.g. `["https://odyssey.yourorg.com"]`). The `production`
GitHub Environment referenced in the workflow is where you'd add a required
reviewer if deploys should need a human approval — that's a repo setting,
not something Bicep or the workflow file controls.

**Manually, for a first deployment or local testing of the template:**

```bash
az group create --name odyssey-rg --location eastus2

az deployment group create \
  --resource-group odyssey-rg \
  --template-file infra/main.bicep \
  --parameters entraTenantId=<tenant-id> \
               entraApiAudience=<api-app-id> \
               alertEmail=<team-email> \
               corsAllowedOrigins='["https://<spa-hostname>"]'

npm install && npm run build
func azure functionapp publish <functionAppName-from-the-deployment-output>
```

## Local development — the network lockdown changes this

Cosmos has `publicNetworkAccess: Disabled` and the Function App only
accepts traffic from APIM's subnet. That's correct for production and
genuinely inconvenient for a laptop outside the VNet. Pick one:

- **A separate dev deployment** (recommended): deploy `main.bicep` a second
  time with a different `namePrefix` into a dev resource group, and either
  pass a parameter override to leave that Cosmos account's
  `publicNetworkAccess` enabled, or — simplest — just don't apply the
  Private Endpoint / access-restriction pieces for the dev copy. Standard
  practice: dev/test resources carry a looser network policy than
  production ones, not the same template with a flag.
- **VPN/ExpressRoute into the VNet**, if your org already has one, then
  local dev works exactly as before (`az login`, `local.settings.json`
  filled in, `func start`) because your machine is now network-adjacent.
- **A temporary IP allow rule** on Cosmos for active development only,
  removed afterward — the least clean option, mentioned for completeness,
  not as the recommended path.

Once reachable, the rest of local dev is unchanged: copy
`local.settings.json.example` to `local.settings.json`, fill in a real
tenant id / audience / Cosmos endpoint, `az login`. Your own account still
needs the Cosmos "Data Contributor" data-plane role (the Bicep only grants
it to the deployed Function App's identity):

```bash
az cosmosdb sql role assignment create \
  --account-name <cosmos-account-name> --resource-group odyssey-rg \
  --role-definition-id 00000000-0000-0000-0000-000000000002 \
  --principal-id $(az ad signed-in-user show --query id -o tsv) \
  --scope /
```

## Pointing the frontend at it

Add to `app/.env` (not `.env.example` — these are real values):

```
VITE_MODEL_API_URL=<apiGatewayUrl from the deployment output>   # APIM, not the raw Function App hostname
VITE_MODEL_API_SCOPE=api://<api-app-id>/access_as_user
```

Pointing the SPA at the Function App's own hostname directly would work
today but bypasses the rate limiting and gateway-level auth check — always
use the APIM gateway URL. `app/src/model/wiring.ts` picks up
`VITE_MODEL_API_URL` automatically and switches BOTH `activeStore` (models)
and `activeHistory` (branches/versions) to their remote implementations.

## Testing

```bash
npm install && npm run typecheck && npm test

# validate the Bicep compiles, without deploying anything
az bicep build --file infra/main.bicep --stdout > /dev/null
```

Tests cover the pure/testable logic — token verification against a locally
generated keypair, access-control resolution against a fake Cosmos
container, the graph-summary math. Nothing here talks to a real Cosmos
account or a real Azure deployment; there is no integration test against a
live environment. The frontend's `remoteStore.test.ts` and
`remoteHistoryStore.test.ts` (`app/src/model/__tests__/`) cover the client
side the same way — mocked `fetch`, no real API.
