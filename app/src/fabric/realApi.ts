// A real FabricApi backed by the Fabric REST API, called with a
// user-delegated token acquired through MSAL (auth/AuthProvider.ts). This is
// the implementation docs/fabric-toolkit-wiring.md describes wiring in —
// written against the publicly documented Fabric REST surface, but UNVERIFIED
// against a live tenant: there is no Fabric access available to test it in
// this environment. Treat exact response shapes (field names, pagination
// envelope, the LRO/definition-part parsing below) as the best-effort
// reading of the docs, not a guarantee — the first real call against a
// tenant is the actual test.
//
// Left unwired, on purpose, rather than guessed at:
//
//   observedRun — proxies the Spark History Server API per notebook, which
//     needs the notebook's last real run id, not just the workspace.
//
// `pipelineDefinition` is a partial implementation, not an absent one: it
// returns the real activity graph — name, type, dependsOn, and nested
// pipelines followed and flattened in (an ExecutePipeline step's child
// activities arrive in the same list, per api.ts's contract on
// `pipeline_id`) — but leaves `reads`/`writes`/`column_lineage` empty. A
// Copy activity's dataset references need to be resolved against the
// pipeline's linked services to become real table refs, and doing that from
// documentation alone — with no live pipeline definition to check the shape
// against — is exactly the kind of guess this file otherwise refuses to
// make. See resolvePipelineActivities and that field's comment in api.ts.
//
// Each throws FabricNotWiredError by simply not being on the object below.
import { acquireFabricToken, acquireOneLakeToken } from '../auth/AuthProvider'
import { getCurrentUserEmail } from '../auth/currentUser'
import {
  FabricError,
  fabricErrorFromResponse,
  type FabricApi,
  type FabricCallOptions,
  type FabricColumn,
  type FabricFolder,
  type FabricItem,
  type FabricNotebookSource,
  type FabricPage,
  type FabricPipelineActivity,
  type FabricTable,
  type FabricWorkspace,
  type FabricWorkspaceItems,
  type Identity,
  type Integration,
} from './api'

const BASE = 'https://api.fabric.microsoft.com/v1'

/** Envelope Fabric's list endpoints use — `value` plus an opaque continuation token. */
interface FabricListResponse<T> {
  value: T[]
  continuationToken?: string
}

async function fabricGet<T>(path: string, what: string, options?: FabricCallOptions): Promise<T> {
  const token = await acquireFabricToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: options?.signal ?? null,
  })
  if (!res.ok) throw await fabricErrorFromResponse(res, what)
  return res.json() as Promise<T>
}

/** How many pages a single call will walk before giving up — mirrors api.ts's `drain`. */
const MAX_PAGES = 100

async function drainList<T>(path: string, what: string, options?: FabricCallOptions): Promise<T[]> {
  const out: T[] = []
  let cursor: string | undefined
  for (let i = 0; i < MAX_PAGES; i++) {
    const qs = cursor ? `?continuationToken=${encodeURIComponent(cursor)}` : ''
    const page = await fabricGet<FabricListResponse<T>>(`${path}${qs}`, what, options)
    out.push(...page.value)
    if (!page.continuationToken) return out
    cursor = page.continuationToken
  }
  throw new FabricError('unknown', `${what} did not stop paging after ${MAX_PAGES} pages.`)
}

// ============================================================================
// Item definitions — notebookSource and pipelineDefinition both go through
// Fabric's "get item definition" API, a long-running operation: 200 with the
// body immediately, or 202 with a Location header to poll until the result
// is ready. Documented, standard Fabric REST shape — the part that stays
// unverified is what's INSIDE a definition part once decoded (see below).
// ============================================================================

interface FabricDefinitionPart {
  path: string
  /** Base64. */
  payload: string
  payloadType: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** How many times to poll an LRO before giving up — a definition fetch is not the sandbox's 240s notebook run. */
const MAX_LRO_POLLS = 30

async function getItemDefinition(
  workspaceId: string,
  itemId: string,
  what: string,
  options?: FabricCallOptions,
): Promise<FabricDefinitionPart[]> {
  const token = await acquireFabricToken()
  const headers = { Authorization: `Bearer ${token}` }
  const signal = options?.signal ?? null

  const res = await fetch(`${BASE}/workspaces/${workspaceId}/items/${itemId}/getDefinition`, {
    method: 'POST',
    headers,
    signal,
  })

  if (res.status === 200) {
    const body = (await res.json()) as { definition: { parts: FabricDefinitionPart[] } }
    return body.definition.parts
  }
  if (res.status !== 202) throw await fabricErrorFromResponse(res, what)

  const location = res.headers.get('Location')
  if (!location) throw new FabricError('unknown', `${what}: 202 response carried no Location header to poll.`)
  let retryAfter = Number(res.headers.get('Retry-After')) || 2

  for (let i = 0; i < MAX_LRO_POLLS; i++) {
    await sleep(retryAfter * 1000)
    const poll = await fetch(location, { headers, signal })
    if (!poll.ok) throw await fabricErrorFromResponse(poll, what)
    retryAfter = Number(poll.headers.get('Retry-After')) || retryAfter
    const status = (await poll.json()) as { status: string; error?: { message?: string } }

    if (status.status === 'Succeeded') {
      const result = await fetch(`${location}/result`, { headers, signal })
      if (!result.ok) throw await fabricErrorFromResponse(result, what)
      const body = (await result.json()) as { definition: { parts: FabricDefinitionPart[] } }
      return body.definition.parts
    }
    if (status.status === 'Failed') {
      throw new FabricError(
        'unknown',
        `${what}: the operation failed${status.error?.message ? ` — ${status.error.message}` : '.'}`,
      )
    }
    // Running / NotStarted — poll again.
  }
  throw new FabricError('unknown', `${what}: definition was not ready after ${MAX_LRO_POLLS} polls.`)
}

/** Base64 → UTF-8 text. `atob` alone mishandles anything outside Latin-1. */
function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

/** A cell's own language: its metadata, or a leading `%%lang` magic line. */
function cellLanguage(metaLanguage: string | undefined, source: string): string | undefined {
  if (metaLanguage) return metaLanguage.toLowerCase()
  const magic = /^%%(\w+)/.exec(source.trimStart())
  return magic?.[1]?.toLowerCase()
}

/** Drops a cell's leading `%%lang` magic line, if it has one — never valid Python on its own. */
function stripMagic(source: string): string {
  return source.replace(/^%%\w+[^\n]*\n?/, '')
}

/**
 * Every Python/PySpark code cell's source, from a `.ipynb`-shaped definition
 * part — the path that actually matters here, since the sandbox only reads
 * Python (sandbox/_dflineage.py, sandbox/_sqllineage.py's job is SQL TEXT
 * found *inside* Python, not a notebook cell that is SQL outright).
 *
 * A Fabric notebook mixes languages per cell — `%%sql`, `%%pyspark`,
 * `%%csharp` — marked either in the cell's own `metadata.language` or a
 * leading magic line. A `%%sql` or `%%scala` cell handed to the sandbox as
 * if it were Python either fails to parse (noise in `unparsable_cells`) or,
 * worse, half-parses garbage from whatever the first line happens to
 * resemble — so those are filtered out here rather than passed through.
 * `%%pyspark` cells ARE included, with the magic line itself stripped: it
 * isn't valid Python syntax either, even though everything below it is.
 */
export function parseIpynbCells(text: string): string[] {
  const notebook = JSON.parse(text) as {
    cells?: { cell_type?: string; source?: string | string[]; metadata?: { language?: string } }[]
  }
  const cells: string[] = []
  for (const cell of notebook.cells ?? []) {
    if (cell.cell_type !== 'code') continue
    const source = Array.isArray(cell.source) ? cell.source.join('') : (cell.source ?? '')
    const lang = cellLanguage(cell.metadata?.language, source)
    if (lang && lang !== 'python' && lang !== 'pyspark') continue
    cells.push(stripMagic(source))
  }
  return cells
}

/**
 * Fallback for a plain `.py` notebook source part, split on Synapse/Fabric's
 * `# CELL ********************` marker.
 *
 * More uncertain than the `.ipynb` path above: every public sample of a
 * Fabric notebook definition this was written against carries `.ipynb`, so
 * this exists for the case a tenant hands back `.py` instead, on a format
 * read from documentation rather than a real payload.
 */
function parseFabricPySourceCells(text: string): string[] {
  return text
    .split(/^# CELL \*+\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean)
}

// ============================================================================
// Pipelines — including nested ones. A pipeline can invoke another with an
// ExecutePipeline activity (a "master pipeline"), and api.ts's
// FabricPipelineActivity.pipeline_id contract says that gets FOLLOWED: the
// child's activities arrive flattened into the same list, named
// `<invoke step> / <child step>`, not left for the caller to fetch.
// ============================================================================

type RawActivity = {
  name: string
  type: string
  dependsOn?: { activity: string }[]
  typeProperties?: Record<string, unknown>
}

async function fetchPipelineActivities(
  workspaceId: string,
  itemId: string,
  options: FabricCallOptions | undefined,
): Promise<RawActivity[]> {
  const parts = await getItemDefinition(workspaceId, itemId, 'pipelineDefinition', options)
  const part = parts.find((p) => p.path === 'pipeline-content.json')
  if (!part) {
    throw new FabricError(
      'unknown',
      `pipelineDefinition: no pipeline-content.json part in the definition (got: ${parts.map((p) => p.path).join(', ') || 'none'}).`,
    )
  }
  const raw = JSON.parse(decodeBase64Utf8(part.payload)) as { properties?: { activities?: RawActivity[] } }
  return raw.properties?.activities ?? []
}

/** How many ExecutePipeline hops to follow before a chain stops expanding — guards a pipeline that invokes itself, directly or through others, from recursing forever. */
const MAX_PIPELINE_DEPTH = 8

async function resolvePipelineActivities(
  workspaceId: string,
  itemId: string,
  options: FabricCallOptions | undefined,
  depth = 0,
): Promise<FabricPipelineActivity[]> {
  const raw = await fetchPipelineActivities(workspaceId, itemId, options)
  const out: FabricPipelineActivity[] = []

  for (const activity of raw) {
    const notebookId = activity.typeProperties?.['notebookId']
    // UNVERIFIED shape: assumed to mirror ADF's `typeProperties.pipeline.referenceName`
    // (Fabric items are referenced by GUID within a workspace, not by name).
    const pipelineRef = activity.typeProperties?.['pipeline'] as { referenceName?: string } | undefined
    const childId = activity.type === 'ExecutePipeline' ? pipelineRef?.referenceName : undefined

    out.push({
      name: activity.name,
      type: activity.type,
      depends_on: (activity.dependsOn ?? []).map((d) => d.activity),
      notebook_id: typeof notebookId === 'string' ? notebookId : null,
      // Identified even past the depth guard below — a step that invokes a
      // pipeline is still a grouping node with nothing of its own to run,
      // whether or not this call also expanded it.
      pipeline_id: typeof childId === 'string' ? childId : null,
      workspace_id: workspaceId,
      // A Copy activity's source/sink are dataset references that need
      // resolving against the pipeline's linked services to become real
      // table refs — see this file's header for why that stays undone
      // rather than guessed at from documentation alone.
      reads: [],
      writes: [],
      column_lineage: [],
    })

    if (typeof childId !== 'string' || depth >= MAX_PIPELINE_DEPTH) continue

    let children: FabricPipelineActivity[]
    try {
      children = await resolvePipelineActivities(workspaceId, childId, options, depth + 1)
    } catch {
      // A child that can't be read — deleted, no permission, cross-workspace
      // reference this best-effort reading doesn't resolve — leaves the
      // invoke step as a plain leaf rather than failing the whole pipeline.
      continue
    }
    for (const child of children) {
      out.push({
        ...child,
        name: `${activity.name} / ${child.name}`,
        depends_on: child.depends_on.map((d) => `${activity.name} / ${d}`),
      })
    }
  }
  return out
}

type RealCapabilities = Pick<
  FabricApi,
  | 'status'
  | 'workspaces'
  | 'items'
  | 'tables'
  | 'notebookSource'
  | 'tableSchema'
  | 'pipelineDefinition'
  | 'integrations'
  | 'identity'
>

export function realFabricApi(): RealCapabilities {
  return {
    async status(options) {
      try {
        await fabricGet('/workspaces', 'status', options)
        return { configured: true }
      } catch {
        return { configured: false }
      }
    },

    async workspaces(options): Promise<FabricPage<FabricWorkspace>> {
      const qs = options?.cursor ? `?continuationToken=${encodeURIComponent(options.cursor)}` : ''
      const page = await fabricGet<
        FabricListResponse<{ id: string; displayName: string; description?: string | null }>
      >(`/workspaces${qs}`, 'workspaces', options)
      return {
        items: page.value.map((w) => ({ id: w.id, name: w.displayName, description: w.description ?? null })),
        cursor: page.continuationToken,
      }
    },

    async items(workspaceId, options): Promise<FabricWorkspaceItems> {
      type RawItem = {
        id: string
        displayName: string
        type: string
        folderId?: string | null
        description?: string | null
      }
      type RawFolder = { id: string; displayName: string; parentFolderId?: string | null }

      const [items, folders] = await Promise.all([
        drainList<RawItem>(`/workspaces/${workspaceId}/items`, 'items', options),
        drainList<RawFolder>(`/workspaces/${workspaceId}/folders`, 'folders', options),
      ])

      const toItem = (i: RawItem): FabricItem => ({
        id: i.id,
        name: i.displayName,
        type: i.type,
        folder_id: i.folderId ?? null,
        description: i.description ?? null,
      })

      return {
        folders: folders.map((f) => ({ id: f.id, name: f.displayName, parent_id: f.parentFolderId ?? null }) as FabricFolder),
        notebooks: items.filter((i) => i.type === 'Notebook').map(toItem),
        lakehouses: items.filter((i) => i.type === 'Lakehouse').map(toItem),
        others: items.filter((i) => i.type !== 'Notebook' && i.type !== 'Lakehouse').map(toItem),
      }
    },

    async tables(workspaceId, lakehouseId, options): Promise<FabricPage<FabricTable>> {
      const qs = options?.cursor ? `?continuationToken=${encodeURIComponent(options.cursor)}` : ''
      const page = await fabricGet<FabricListResponse<{ name: string; type?: string | null; format?: string | null }>>(
        `/workspaces/${workspaceId}/lakehouses/${lakehouseId}/tables${qs}`,
        'tables',
        options,
      )
      return {
        items: page.value.map((t) => ({ name: t.name, type: t.type ?? null, format: t.format ?? null })),
        cursor: page.continuationToken,
      }
    },

    async notebookSource(workspaceId, itemId, name, options): Promise<FabricNotebookSource> {
      const parts = await getItemDefinition(workspaceId, itemId, 'notebookSource', options)
      const part = parts.find((p) => p.path.endsWith('.ipynb')) ?? parts.find((p) => p.path.endsWith('.py'))
      if (!part) {
        throw new FabricError(
          'unknown',
          `notebookSource: no notebook content part in the definition (got: ${parts.map((p) => p.path).join(', ') || 'none'}).`,
        )
      }
      const text = decodeBase64Utf8(part.payload)
      const cells = part.path.endsWith('.ipynb') ? parseIpynbCells(text) : parseFabricPySourceCells(text)
      return { name, lakehouse_default: null, cells }
    },

    async tableSchema(workspaceId, lakehouseId, tableName, options): Promise<FabricColumn[]> {
      // OneLake's Delta log, read directly — Fabric has no REST endpoint for
      // a table's columns. Reads only the FIRST log segment
      // (00000000000000000000.json), which carries the table's schema at
      // creation: a table altered or schema-evolved afterwards needs the
      // LATEST metaData entry, which means walking the log forward (or
      // reading the newest checkpoint) instead of assuming segment zero —
      // undone here, a real gap for any table whose schema has changed since
      // it was created.
      const token = await acquireOneLakeToken()
      const url = `https://onelake.dfs.fabric.microsoft.com/${workspaceId}/${lakehouseId}/Tables/${encodeURIComponent(tableName)}/_delta_log/00000000000000000000.json`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: options?.signal ?? null,
      })
      if (!res.ok) throw await fabricErrorFromResponse(res, 'tableSchema')
      const text = await res.text()
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        let entry: { metaData?: { schemaString?: string } }
        try {
          entry = JSON.parse(line) as { metaData?: { schemaString?: string } }
        } catch {
          continue
        }
        if (entry.metaData?.schemaString) {
          const schema = JSON.parse(entry.metaData.schemaString) as { fields?: { name: string; type?: unknown }[] }
          return (schema.fields ?? []).map((f) => ({
            name: f.name,
            type: typeof f.type === 'string' ? f.type : null,
          }))
        }
      }
      throw new FabricError('unknown', `tableSchema: no schema found in ${tableName}'s first Delta log segment.`)
    },

    async pipelineDefinition(workspaceId, itemId, options): Promise<FabricPipelineActivity[]> {
      return resolvePipelineActivities(workspaceId, itemId, options)
    },

    async integrations(): Promise<Integration[]> {
      return [
        {
          key: 'fabric',
          name: 'Microsoft Fabric',
          vendor: 'Microsoft',
          host: 'api.fabric.microsoft.com',
          configured: true,
          purpose: 'Workspace, item, and table listing for the Explore tree; notebook source; table schemas.',
          degrades: 'The workspace tree reports itself unwired and shows nothing.',
          needs: 'A signed-in user with at least Viewer on the workspaces they want to browse.',
          detail: 'Calls the Fabric REST API and OneLake with a user-delegated token acquired through MSAL.',
          caveats: [
            "User-delegated: what's visible is exactly what the signed-in user can already see in Fabric.",
            "pipelineDefinition returns the activity graph but not Copy lineage — see fabric/realApi.ts's header.",
            'observedRun is not wired here — see the file header of fabric/realApi.ts.',
          ],
        },
      ]
    },

    async identity(): Promise<Identity> {
      return {
        mode: 'user',
        client_id: '',
        tenant_id: '',
        display_name: getCurrentUserEmail() ?? 'signed-in user',
        note: 'Calls Fabric as the signed-in user’s own permissions, not a service principal.',
      }
    },
  }
}
