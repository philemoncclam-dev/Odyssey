# Wiring up the Fabric Toolkit

The Fabric Toolkit ships **complete and disconnected**. Every screen, panel and
interaction is built; nothing reaches a network. This is the one page that says
how to connect it.

## What is here

| Screen | Path | State |
|---|---|---|
| Explore | `/fabric/explore` | Built. Workspace tree, detail panel, sandbox sequence builder. |
| Sandbox | inside Explore | Built. Sequence builder, run report, lineage canvas. |
| Integrations | `/fabric/integrations` | Built. Service inventory and identity header. |

The sandbox is not a page of its own — it is the third column of Explore and
the `Sandbox` / `Run report` tabs of its detail panel. That is deliberate:
browsing for a notebook and stacking it into a run is one motion.

Not salvaged: the prototype's Overview and item-level Lineage pages. They were
out of scope for this port and no tab points at them.

## The one seam

Everything the toolkit needs from the outside world is the `FabricApi`
interface in [`app/src/fabric/api.ts`](../app/src/fabric/api.ts). There is no
other network boundary and no hidden fetch.

**[`app/src/fabric/wiring.ts`](../app/src/fabric/wiring.ts) is where every
capability is assembled and the one file to edit when wiring a real one in.**
It is a comment-annotated list of all ten capabilities and what backs each
today — read it first; it is kept current on purpose so an agent picking this
up does not have to reconstruct wiring state from main.tsx or from this doc.
`main.tsx` just calls `wireFabricApi()` before render.

```ts
// app/src/fabric/wiring.ts
import { setFabricApi } from './api'

export function wireFabricApi(): void {
  setFabricApi({
    async status() {
      return { configured: true }
    },
    async workspaces() {
      const res = await fetch('/api/fabric/workspaces')
      if (!res.ok) throw new Error(`workspaces: ${res.status}`)
      return res.json()
    },
    // …
  })
}
```

**Current state, by default (no flags set):** `workspaces` is fixture data
from `app/src/auth/mockWorkspaces.ts`, filtered to the signed-in user's
email (see "Authentication" below). Every other read capability is unwired.
`runSandbox`/`observedRun` come from the local sandbox engine — see below.

**With `VITE_FABRIC_REAL=1`:** `status`, `workspaces`, `items`, `tables`,
`notebookSource`, `tableSchema`, `integrations`, and `identity` all call the
real Fabric REST API / OneLake (`fabric/realApi.ts`) — unverified against a
live tenant, see that file's header. `pipelineDefinition` is real but
partial (the activity graph, not Copy lineage). `observedRun` stays unwired
either way.

**Every method is optional and independent.** Supply `workspaces` alone and the
tree lists workspaces while opening one still reports itself unwired. The
toolkit can be brought up one endpoint at a time.

**Nothing requires HTTP.** The methods name capabilities, not URLs. Call the
Fabric REST API directly with a token from MSAL, proxy through a backend, or
return fixtures for a demo — the UI cannot tell the difference.

### What every capability must handle

Three things are part of the contract rather than optional polish, because
retrofitting any of them means editing every method you have written.

**Cancellation.** Every method takes an optional final `options` argument
carrying an `AbortSignal`. Pass it to `fetch`. The workspace tree fires a
request per branch opened, and without this, walking a large tenant leaves a
tail of requests nobody is waiting for against an API that throttles.

**Paging.** `workspaces` and `tables` return `{ items, cursor }`. Return a
`cursor` when there is more and omit it on the last page; you will be called
again with `options.cursor` set to whatever you returned. `items` is
deliberately not paged — its result is grouped into four lists by item type
and a page boundary falls across those groups, so drain Fabric's own paging
inside it.

The convenience functions (`fetchFabricWorkspaces`, `fetchFabricTables`) walk
every page for the UI. They **throw** rather than truncate if a cursor never
clears — a short list that looks complete is worse than an error.

**Error kinds.** Throw `FabricError` with a `kind` so the UI can say something
useful. `fabricErrorFromResponse(res, what)` does the mapping for you:

| status | kind | what the user is told |
|---|---|---|
| 401 | `unauthorized` | the session or token expired |
| 403 | `forbidden` | **not visible to you — not empty** |
| 404 | `not-found` | the workspace or item is gone |
| 429 | `throttled` | wait; `retryAfterSeconds` carries `Retry-After` |
| 5xx | `unavailable` | upstream is broken, retrying may work |

`forbidden` is the load-bearing one. This toolkit says everywhere that an empty
list means "no permission, not nothing there" — that is only true if a refusal
arrives as a refusal. An integration that collapses 401 and 403 sends people to
reset a token when the answer is "ask for access to that workspace".

A plain `Error` still works and lands as `unknown`. Nothing breaks; the UI just
cannot be specific.

### Capabilities

`runSandbox` is the exception to "nothing implements it" — the engine ships in
this repo. See below.

| Method | Feeds | Prototype endpoint |
|---|---|---|
| `status` | Explore's connected/not-connected state | `GET /fabric/status` — **real, opt-in**, see below |
| `workspaces` | The workspace tree's roots | `GET /fabric/workspaces` — **real, opt-in**; **mocked** otherwise, see `auth/mockWorkspaces.ts` |
| `items` | Folders, notebooks, lakehouses in a workspace | `GET /fabric/workspaces/{id}/items` — **real, opt-in** |
| `tables` | A lakehouse's Delta tables | `GET …/lakehouses/{lh}/tables` — **real, opt-in** |
| `notebookSource` | The decoded cells in the detail panel | `GET …/notebooks/{id}/source` — **real, opt-in** |
| `tableSchema` | A table's columns | `GET …/tables/{name}/schema` — **real, opt-in**, reads OneLake's Delta log |
| `pipelineDefinition` | Pipeline activities and their order | `GET …/pipelines/{id}/definition` — **real, opt-in**, nested pipelines followed and flattened in — no Copy lineage yet |
| `runSandbox` | The sandbox run and all its lineage output | `POST /fabric/sandbox/run` |
| `observedRun` | "What did this actually do last night" | `GET /fabric/sandbox/observed` — not wired |
| `integrations` | The Integrations list | `GET /integrations` — **real, opt-in** |
| `identity` | The Integrations identity header | `GET /integrations/identity` — **real, opt-in** |

The response shapes are the exported types in the same file, carried over
unchanged from the prototype's backend. They are the contract — match them and
the UI works.

**`schemaBaseline.ts` calls `tables` + `tableSchema` in bulk.** "Turn into
model" (`SequenceCanvas.tsx`'s `ToModelBar`) walks every table in each
lakehouse the run already resolved a ref for — not just the ones a notebook
touched — so a table nothing wrote to still gets a node, tagged `Untouched`,
instead of being absent from the model with no way to tell "doesn't exist"
from "exists, nothing observed touches it" apart. One `tableSchema` request
per table, no batching or retry of its own — a lakehouse with real table
counts means real request counts, and a schema that can't be read is recorded
rather than blocking the export. See that file's header for the scoping
rule (only lakehouses the run touched, never a tenant-wide crawl).

## Authentication

Two separate things, easy to conflate:

**App sign-in** (`app/src/auth/`) exists. MSAL SSO gates the whole app behind
an Entra ID login (`AuthProvider.tsx`/`AuthGate.tsx`, popup flow) and an
app-side domain allowlist (`allowlist.ts`, currently `@cclgroup.com`). This
answers "who may open Odyssey at all" and has nothing to do with `FabricApi`
— it does not acquire a Fabric-scoped token or call Fabric.

**Fabric API access** has a real, user-delegated implementation now:
`fabric/realApi.ts`, behind the `VITE_FABRIC_REAL=1` opt-in flag in
`fabric/wiring.ts`. `auth/AuthProvider.ts`'s `acquireFabricToken()` gets a
Fabric-scoped token via MSAL's `acquireTokenSilent` (falling back to a popup
only on `InteractionRequiredAuthError`), separate from the `User.Read` scope
used for sign-in — see `fabricLoginRequest` in `auth/config.ts`. Every call in
`realApi.ts` runs as the signed-in user's own Fabric permissions; there is no
service principal and no credential in the bundle.

**Caveat: unverified.** `realApi.ts` was written against the publicly
documented Fabric REST surface with no live tenant available to test
against — treat exact response shapes (field names, the pagination envelope)
as a best-effort reading of the docs, not a guarantee. The first real call
against a tenant is the actual test; expect to adjust field names on contact.

Only capabilities with a simple, single-call REST shape are implemented:
`status`, `workspaces`, `items`, `tables`, `integrations`, `identity`.
`notebookSource` and `pipelineDefinition` both need Fabric's "get item
definition" long-running operation (202 + polling) plus format-specific
parsing of what comes back (decoded `.ipynb` JSON, or a pipeline's
activity/lineage graph) — real logic, not plumbing, and guessing at it without
a live payload to check against would be worse than leaving it unwired.
`tableSchema` has no simple REST equivalent at all; the prototype's backend
read it out of OneLake's Delta log directly. `observedRun` needs a notebook's
last real run id from the Spark History Server proxy, which nothing here
currently supplies.

The prototype's Entra ID **service principal** and token-source hook
(`setTokenSource` / `fabricFetch`) are still gone, not resurrected — if
service-principal identity turns out to be what you want instead of
user-delegated access, that is a different implementation of the same
`FabricApi` seam, and should almost certainly terminate server-side: the
browser calls your API, your API holds the credential.

## The sandbox engine is in this repository

`runSandbox` is the one capability that already has an implementation.

The engine is `sandbox/` at the repository root — about 3,700 lines of Python
with its own test suite. It runs a notebook's cells in an **isolated
subprocess** (scrubbed environment, throwaway home and working directory, no
Fabric credentials, killed as a process tree on timeout) and derives
column-level lineage from Spark's analyzed plans, falling back to static SQL
analysis through sqlglot when there is no JVM.

It is a library, not a service. To reach it from the browser:

```bash
python -m sandbox.service                                   # 127.0.0.1:8765
cd app && VITE_SANDBOX_URL=http://127.0.0.1:8765 npm run dev
```

`sandbox/service.py` is one stdlib HTTP endpoint in front of `run_sandbox`, and
`app/src/fabric/localEngine.ts` is the `FabricApi` that posts to it. With
`VITE_SANDBOX_URL` unset — every default checkout, every production build —
neither is installed and nothing makes a network call.

### Two engines, and which one you get

`spark_available()` decides, and `GET /sandbox/status` reports which is live.

**Stub** (`engine: "stub"`) is the default and needs no JVM. It is a symbolic
reader, not a toy: it recovers columns from `spark.sql(...)` text with sqlglot
and walks DataFrame chains through a shared variable environment. What it
cannot do is evaluate — a query built from an f-string, or a chain it will not
guess at, it abstains on and reports in `coverage` rather than guessing.

**Spark** (`engine: "spark"`) analyses the code for real and takes the lineage
off Catalyst's analyzed plans. Nothing is read or written: tables are
registered as empty temp views, so the plans resolve without data moving.

Turning Spark on locally:

```bash
.venv/Scripts/pip install pyspark==4.0.0     # ~400MB, needs Java 17+
.venv/Scripts/python -m pytest tests/ -q     # the 14 Spark tests stop skipping
```

That is all — `run_sandbox` picks it up with no configuration. Two paths are
tried, in order: a pinned `.venv312` beside the repo's own venv (for keeping a
400MB dependency out of the main interpreter), then PySpark in the current
interpreter.

Cold start is around 15 seconds for the first run in a process and a few
seconds after; the stub is near-instant. Both share the 240-second per-step
timeout.

### What the bridge cannot do

It runs **cells you send it**. Running a notebook by `workspace_id`/`item_id`
means fetching its source from Fabric first, which needs a credential the
engine deliberately does not hold — so wire `notebookSource` and send the cells
it returns.

The same gap is why the sandbox is not fully drivable from the UI on its own:
sequence steps are added from the Explore tree, and that tree needs `items`
wired. With only the engine installed, the sandbox works from code and the tree
is empty.

`schema_resolution`, `observed` and `downstream` are also left unfilled. The
prototype's backend attached them *after* the engine returned, because each
takes a Fabric call the child process cannot make.

### Deploying it

Do not deploy `sandbox/service.py`. It is a developer's loopback tool: no
authentication, no rate limiting, and an endpoint whose purpose is executing
submitted code. Call `run_sandbox` from your own service instead — it is a
dozen lines — and put your own auth in front.

One constraint carries over from `runner.py`'s docstring and is easy to miss:
scrubbing the child's environment does not hide the **parent's**. On Linux the
child runs as the same uid, so `/proc/1/environ` is readable and every variable
the host process holds is one `open()` away from any submitted cell. **A host
that runs this engine must hold no secrets in its environment.** Closing that
properly means running the executor as a different uid, which means it wants to
be its own service rather than a subprocess of your API.

### If you replace it

`SandboxRunResult` is heavily commented in `api.ts`, and those comments are the
specification — particularly the fields that distinguish "we checked and found
nothing" from "we could not check". The UI renders that distinction, so an
implementation that collapses the two will make the toolkit lie.

## What "not wired" looks like

A missing capability throws `FabricNotWiredError` naming the method and the
call to make. The surrounding screen still renders — the tree, the panels, the
sequence builder are all there and empty.

Two properties are pinned by tests in `app/src/fabric/__tests__/api.test.ts`
and should stay true:

- the wrappers **reject**, never throw synchronously; a synchronous throw
  escapes `.catch()` and takes out the whole route through React's error
  boundary rather than showing the view's own empty state;
- `setFabricApi` **replaces** rather than merges, so a capability can be taken
  back out for testing.
