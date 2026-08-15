// The whole Explore surface (status/workspaces/items/tables/notebookSource/
// tableSchema), run through server/'s Fabric proxy instead of
// fabric/realApi.ts calling Fabric/OneLake with the signed-in user's own
// delegated token. `status` has to move with the rest — see its comment
// below — or Explore shows "not connected" before any of the others get a
// chance to run.
//
// This started as JUST notebookSource/tableSchema (Fabric's getDefinition
// needs Contributor+, and OneLake's data-plane ACLs don't follow a Fabric
// workspace role at all — see docs/azure-student-setup.md's Phase 2).
// Browsing (workspaces/items/tables) was meant to stay user-delegated so
// each person only saw their own real Fabric access. It doesn't, currently:
// delegated OAuth for the Fabric/Power BI resource hit an unresolved
// tenant-specific block in testing — real workspace role (Admin), real
// capacity, real tenant-wide consent, real license, all confirmed present,
// still refused at sign-in for that specific resource/scope. Rather than
// leave Explore broken chasing that further, browsing now goes through the
// SP too, the same way lineage-studio's prototype always did (its service
// principal has zero delegated permissions — it never did per-user
// browsing at all).
//
// Real cost, not hidden: every signed-in user now sees the SAME workspace
// list — whatever the SP has been granted, normally the whole tenant via
// fabricAccessSync.ts's daily reconciliation — not filtered to their own
// individual Fabric access. If the delegated-token block gets root-caused
// later, swapping workspaces/items/tables back to realApi.ts is a
// wiring.ts change, not a rewrite — every method here has a realApi.ts
// twin with the identical shape.
//
// Reuses the same server/ deployment and token scope as model/remoteStore.ts
// (acquireModelApiToken, VITE_MODEL_API_SCOPE) — same Function App, just
// different routes. Deliberately a SEPARATE env var from
// VITE_MODEL_API_URL, though: that one is model/wiring.ts's switch for the
// entire model-storage feature (localStorage vs. the Cosmos-backed remote
// store) — setting it flips Model Browser onto a backend that needs Cosmos
// wired, whether or not that's deployed. This proxy has nothing to do with
// model storage, so it gets its own on/off switch even when pointed at the
// same URL.
import { acquireModelApiToken } from '../auth/AuthProvider'
import type {
  FabricApi,
  FabricCallOptions,
  FabricColumn,
  FabricNotebookSource,
  FabricPage,
  FabricPipelineActivity,
  FabricTable,
  FabricWorkspace,
  FabricWorkspaceItems,
} from './api'

function baseUrl(): string {
  const url = import.meta.env['VITE_FABRIC_PROXY_URL']
  if (!url) throw new Error('VITE_FABRIC_PROXY_URL is not set — see docs/fabric-toolkit-wiring.md.')
  return url.replace(/\/+$/, '')
}

async function callProxy<T>(path: string, options?: FabricCallOptions): Promise<T> {
  const token = await acquireModelApiToken()
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    signal: options?.signal ?? null,
  })
  if (!res.ok) {
    const body = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
    const message = (body as { error?: string } | null)?.error ?? `request failed (${res.status}).`
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export function spFabricApi(): Pick<
  FabricApi,
  'status' | 'workspaces' | 'items' | 'tables' | 'notebookSource' | 'tableSchema' | 'pipelineDefinition'
> {
  return {
    // Explore's connected/not-connected gate. realApi.ts's status() proves
    // connectivity with a DELEGATED call — exactly the resource/scope that
    // hits the unresolved block this file's header describes. Getting that
    // wrong here means Explore shows "not connected" and never even
    // attempts workspaces() below, no matter how well the proxy itself
    // works — this capability has to move with the rest or the other five
    // are silently unreachable. "Configured" just means the proxy is wired
    // and reachable, proven by the same call workspaces() itself makes.
    async status(options) {
      try {
        await callProxy('/fabric/workspaces', options)
        return { configured: true }
      } catch {
        return { configured: false }
      }
    },

    // The server drains every page itself (lib/fabricSp.ts's drainListAsSp)
    // and returns one plain array — no cursor to hand back, so these always
    // report themselves as the last page.
    async workspaces(options): Promise<FabricPage<FabricWorkspace>> {
      const items = await callProxy<FabricWorkspace[]>('/fabric/workspaces', options)
      return { items }
    },

    async items(workspaceId, options): Promise<FabricWorkspaceItems> {
      return callProxy<FabricWorkspaceItems>(`/fabric/workspaces/${workspaceId}/items`, options)
    },

    async tables(workspaceId, lakehouseId, options): Promise<FabricPage<FabricTable>> {
      const items = await callProxy<FabricTable[]>(
        `/fabric/workspaces/${workspaceId}/lakehouses/${lakehouseId}/tables`,
        options,
      )
      return { items }
    },

    async notebookSource(workspaceId, itemId, name, options): Promise<FabricNotebookSource> {
      const { cells } = await callProxy<{ cells: string[] }>(
        `/fabric/workspaces/${workspaceId}/notebooks/${itemId}/source`,
        options,
      )
      return { name, lakehouse_default: null, cells }
    },

    async tableSchema(workspaceId, lakehouseId, tableName, options): Promise<FabricColumn[]> {
      return callProxy<FabricColumn[]>(
        `/fabric/workspaces/${workspaceId}/lakehouses/${lakehouseId}/tables/${encodeURIComponent(tableName)}/schema`,
        options,
      )
    },

    async pipelineDefinition(workspaceId, itemId, options): Promise<FabricPipelineActivity[]> {
      return callProxy<FabricPipelineActivity[]>(
        `/fabric/workspaces/${workspaceId}/pipelines/${itemId}/definition`,
        options,
      )
    },
  }
}
