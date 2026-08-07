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

## Seeing it work with nothing connected

```bash
cd app && npm run dev:demo
```

A whole invented Fabric estate — two workspaces, four lakehouses, four
notebooks with real SQL in them, two pipelines, an integrations inventory.
Every screen works and every interaction completes: browse the tree, read a
notebook's source, stack it into the sandbox, run it, see column-level
lineage, turn it into a model. No network, no credentials, no Python, no
tenant.

It is for proving the application works end to end, and for developing the UI
against realistic shapes — a table with no lineage, a cross-workspace read, a
run that disagrees with what really happened — without waiting on a tenant.

Three rules keep it from becoming a liability, and they are worth preserving:

- **It is never a fallback.** Nothing degrades into demo data when a real call
  fails. A real estate that cannot be read must say it cannot be read, or
  someone will trust invented lineage for a table their pipeline really writes.
- **It says so on screen** — a "Demo data" badge in the title bar for as long
  as it is on, and every staged value is labelled `[demo]` where it is shown.
- **It never invents an answer it does not have.** Ask it about a notebook it
  has no fixture for and it says so rather than returning empty lineage, which
  would read as "this notebook touches nothing".

The estate mirrors `model/fabricSample.ts`, so the demo Fabric side and the
demo model tell one story. Fixtures live in `app/src/fabric/demoApi.ts`.

If the sandbox engine is also running, demo mode hands it the fixture's cells
and uses the real analysis instead — and falls back to the staged result, with
a line in the run log saying so, if the engine cannot be reached.

## The one seam

Everything the toolkit needs from the outside world is the `FabricApi`
interface in [`app/src/fabric/api.ts`](../app/src/fabric/api.ts). There is no
other network boundary, no second config file and no hidden fetch.

```ts
// app/src/main.tsx, before render
import { setFabricApi } from './fabric/api'

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
```

**Every method is optional and independent.** Supply `workspaces` alone and the
tree lists workspaces while opening one still reports itself unwired. The
toolkit can be brought up one endpoint at a time.

**Nothing requires HTTP.** The methods name capabilities, not URLs. Call the
Fabric REST API directly with a token from MSAL, proxy through a backend, or
return fixtures for a demo — the UI cannot tell the difference.

### Capabilities

`runSandbox` is the exception to "nothing implements it" — the engine ships in
this repo. See below.

| Method | Feeds | Prototype endpoint |
|---|---|---|
| `status` | Explore's connected/not-connected state | `GET /fabric/status` |
| `workspaces` | The workspace tree's roots | `GET /fabric/workspaces` |
| `items` | Folders, notebooks, lakehouses in a workspace | `GET /fabric/workspaces/{id}/items` |
| `tables` | A lakehouse's Delta tables | `GET …/lakehouses/{lh}/tables` |
| `notebookSource` | The decoded cells in the detail panel | `GET …/notebooks/{id}/source` |
| `tableSchema` | A table's columns | `GET …/tables/{name}/schema` |
| `pipelineDefinition` | Pipeline activities and their order | `GET …/pipelines/{id}/definition` |
| `runSandbox` | The sandbox run and all its lineage output | `POST /fabric/sandbox/run` |
| `observedRun` | "What did this actually do last night" | `GET /fabric/sandbox/observed` |
| `integrations` | The Integrations list | `GET /integrations` |
| `identity` | The Integrations identity header | `GET /integrations/identity` |

The response shapes are the exported types in the same file, carried over
unchanged from the prototype's backend. They are the contract — match them and
the UI works.

## Authentication is deliberately absent

The prototype held an Entra ID **service principal** and a token-source hook
(`setTokenSource` / `fabricFetch`). Both are gone, not stubbed.

That is a decision, not an omission. A half-present auth layer invites someone
to put client secrets in a browser bundle, which is where a service principal
must never live. Whoever implements `FabricApi` owns identity, and should
almost certainly terminate it server-side: the browser calls your API, your API
holds the credential.

If you want user-delegated access instead, MSAL in the browser and a token on
each call fits the same interface — the seam does not care.

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
