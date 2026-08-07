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

## The sandbox needs an engine

`runSandbox` is the largest thing to supply, and it is worth being clear about
what it was.

The prototype ran a notebook's cells in an **isolated subprocess** — scrubbed
environment, no Fabric credentials, no writes to real Fabric — and derived
column-level lineage from Spark's analyzed plans, falling back to static SQL
analysis. That engine is not part of this repository.

Everything downstream of it is: the sequence builder, the run report, the
coverage verdicts, the observed-vs-predicted diff, the lineage canvas, and the
conversion into an Odyssey model. They are all typed against `SandboxRunResult`
and work as soon as something returns one.

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
