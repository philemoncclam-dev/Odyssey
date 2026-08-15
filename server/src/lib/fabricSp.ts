// Calls the Fabric REST API as this Function App's own Managed Identity,
// instead of a signed-in user's delegated token — the server-side half of
// the "run as SP so a Viewer can still run sandbox mode" design. See
// docs/azure-student-setup.md's Phase 2 for why this exists: browsing
// (app/src/fabric/realApi.ts, called from the browser) stays user-delegated
// so the Explore tree matches each person's real Fabric access; only
// notebookSource and tableSchema go through here — the two capabilities
// that need more than Viewer with the caller's own token (`getDefinition`
// needs Contributor+; OneLake's data-plane ACLs don't automatically follow
// a Fabric workspace role at all).
//
// UNVERIFIED against a live tenant, same caveat as app/src/fabric/realApi.ts
// — written from Fabric's public REST docs, first real call is the test.
import { DefaultAzureCredential } from '@azure/identity'

const FABRIC_SCOPE = 'https://api.fabric.microsoft.com/.default'
const ONELAKE_SCOPE = 'https://storage.azure.com/.default'
const BASE = 'https://api.fabric.microsoft.com/v1'

// One credential for the process — DefaultAzureCredential resolves to the
// Function App's system-assigned managed identity in Azure, and to `az
// login`'s cached credential locally, same pattern as lib/cosmos.ts.
const credential = new DefaultAzureCredential()

async function miToken(scope: string = FABRIC_SCOPE): Promise<string> {
  const result = await credential.getToken(scope)
  if (!result) throw new Error('Could not acquire a token for this Function App\'s managed identity.')
  return result.token
}

interface FabricDefinitionPart {
  path: string
  /** Base64. */
  payload: string
  payloadType: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Mirrors app/src/fabric/realApi.ts's MAX_LRO_POLLS — a definition fetch, not the sandbox's 240s run. */
const MAX_LRO_POLLS = 30

/**
 * Fabric's "get item definition" long-running operation, called as the MI.
 * See app/src/fabric/realApi.ts's getItemDefinition for the browser-side
 * twin of this — kept separate rather than shared because the two run in
 * different modules (Node vs. browser) with different fetch/base64 primitives.
 */
async function getItemDefinition(workspaceId: string, itemId: string): Promise<FabricDefinitionPart[]> {
  const token = await miToken()
  const headers = { Authorization: `Bearer ${token}` }

  const res = await fetch(`${BASE}/workspaces/${workspaceId}/items/${itemId}/getDefinition`, {
    method: 'POST',
    headers,
  })

  if (res.status === 200) {
    const body = (await res.json()) as { definition: { parts: FabricDefinitionPart[] } }
    return body.definition.parts
  }
  if (res.status !== 202) {
    throw new Error(`notebookSource: Fabric returned ${res.status} fetching the item definition.`)
  }

  const location = res.headers.get('Location')
  if (!location) throw new Error('notebookSource: 202 response carried no Location header to poll.')
  let retryAfter = Number(res.headers.get('Retry-After')) || 2

  for (let i = 0; i < MAX_LRO_POLLS; i++) {
    await sleep(retryAfter * 1000)
    const poll = await fetch(location, { headers })
    if (!poll.ok) throw new Error(`notebookSource: Fabric returned ${poll.status} polling the operation.`)
    retryAfter = Number(poll.headers.get('Retry-After')) || retryAfter
    const status = (await poll.json()) as { status: string; error?: { message?: string } }

    if (status.status === 'Succeeded') {
      const result = await fetch(`${location}/result`, { headers })
      if (!result.ok) throw new Error(`notebookSource: Fabric returned ${result.status} fetching the result.`)
      const body = (await result.json()) as { definition: { parts: FabricDefinitionPart[] } }
      return body.definition.parts
    }
    if (status.status === 'Failed') {
      throw new Error(`notebookSource: the operation failed${status.error?.message ? ` — ${status.error.message}` : '.'}`)
    }
  }
  throw new Error(`notebookSource: definition was not ready after ${MAX_LRO_POLLS} polls.`)
}

function decodeBase64Utf8(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8')
}

function cellLanguage(metaLanguage: string | undefined, source: string): string | undefined {
  if (metaLanguage) return metaLanguage.toLowerCase()
  const magic = /^%%(\w+)/.exec(source.trimStart())
  return magic?.[1]?.toLowerCase()
}

function stripMagic(source: string): string {
  return source.replace(/^%%\w+[^\n]*\n?/, '')
}

/** Same filtering rule as app/src/fabric/realApi.ts's parseIpynbCells — see that file's comment. */
function parseIpynbCells(text: string): string[] {
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

function parseFabricPySourceCells(text: string): string[] {
  return text
    .split(/^# CELL \*+\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** The cells a Fabric notebook holds, fetched and decoded as the MI rather than the caller. */
export async function fetchNotebookCellsAsSp(workspaceId: string, itemId: string): Promise<string[]> {
  const parts = await getItemDefinition(workspaceId, itemId)
  const part = parts.find((p) => p.path.endsWith('.ipynb')) ?? parts.find((p) => p.path.endsWith('.py'))
  if (!part) {
    throw new Error(
      `notebookSource: no notebook content part in the definition (got: ${parts.map((p) => p.path).join(', ') || 'none'}).`,
    )
  }
  const text = decodeBase64Utf8(part.payload)
  return part.path.endsWith('.ipynb') ? parseIpynbCells(text) : parseFabricPySourceCells(text)
}

// ============================================================================
// tableSchema — OneLake has no REST endpoint for a table's columns; this
// reads the FIRST Delta log segment directly, same approach and same gap as
// app/src/fabric/realApi.ts's tableSchema (a table altered since creation
// needs the latest metaData entry, not segment zero — see that file's
// comment). Kept separate from that browser-side twin for the same reason
// getItemDefinition above is: different fetch/token primitives, same logic.
// ============================================================================

export interface FabricColumn {
  name: string
  type: string | null
}

export async function fetchTableSchemaAsSp(
  workspaceId: string,
  lakehouseId: string,
  tableName: string,
): Promise<FabricColumn[]> {
  const token = await miToken(ONELAKE_SCOPE)
  const url = `https://onelake.dfs.fabric.microsoft.com/${workspaceId}/${lakehouseId}/Tables/${encodeURIComponent(tableName)}/_delta_log/00000000000000000000.json`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`tableSchema: OneLake returned ${res.status} reading ${tableName}'s Delta log.`)
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
  throw new Error(`tableSchema: no schema found in ${tableName}'s first Delta log segment.`)
}

// ============================================================================
// Browsing (workspaces/items/tables) as the SP — see wiring.ts's header on
// why this exists alongside the user-delegated path in realApi.ts rather
// than replacing it outright.
// ============================================================================

interface FabricListResponse<T> {
  value: T[]
  continuationToken?: string
}

async function fabricGetAsSp<T>(path: string): Promise<T> {
  const token = await miToken()
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Fabric returned ${res.status} calling ${path}: ${body.slice(0, 500)}`)
  }
  return res.json() as Promise<T>
}

async function drainListAsSp<T>(path: string): Promise<T[]> {
  const out: T[] = []
  let cursor: string | undefined
  for (let i = 0; i < 100; i++) {
    const qs = cursor ? `?continuationToken=${encodeURIComponent(cursor)}` : ''
    const page = await fabricGetAsSp<FabricListResponse<T>>(`${path}${qs}`)
    out.push(...page.value)
    if (!page.continuationToken) return out
    cursor = page.continuationToken
  }
  throw new Error(`drainListAsSp: ${path} did not stop paging after 100 pages.`)
}

export interface FabricWorkspaceOut {
  id: string
  name: string
  description: string | null
}

/** Every workspace the SP is a member of — normally the whole tenant, since
 *  fabricAccessSync.ts keeps it Contributor everywhere. */
export async function fetchWorkspacesAsSp(): Promise<FabricWorkspaceOut[]> {
  const raw = await drainListAsSp<{ id: string; displayName: string; description?: string | null }>('/workspaces')
  return raw.map((w) => ({ id: w.id, name: w.displayName, description: w.description ?? null }))
}

export interface FabricItemOut {
  id: string
  name: string
  type: string
  folder_id: string | null
  description: string | null
}
export interface FabricWorkspaceItemsOut {
  folders: { id: string; name: string; parent_id: string | null }[]
  notebooks: FabricItemOut[]
  lakehouses: FabricItemOut[]
  others: FabricItemOut[]
}

export async function fetchItemsAsSp(workspaceId: string): Promise<FabricWorkspaceItemsOut> {
  type RawItem = { id: string; displayName: string; type: string; folderId?: string | null; description?: string | null }
  type RawFolder = { id: string; displayName: string; parentFolderId?: string | null }

  const [items, folders] = await Promise.all([
    drainListAsSp<RawItem>(`/workspaces/${workspaceId}/items`),
    drainListAsSp<RawFolder>(`/workspaces/${workspaceId}/folders`),
  ])

  const toItem = (i: RawItem): FabricItemOut => ({
    id: i.id,
    name: i.displayName,
    type: i.type,
    folder_id: i.folderId ?? null,
    description: i.description ?? null,
  })

  return {
    folders: folders.map((f) => ({ id: f.id, name: f.displayName, parent_id: f.parentFolderId ?? null })),
    notebooks: items.filter((i) => i.type === 'Notebook').map(toItem),
    lakehouses: items.filter((i) => i.type === 'Lakehouse').map(toItem),
    others: items.filter((i) => i.type !== 'Notebook' && i.type !== 'Lakehouse').map(toItem),
  }
}

export interface FabricTableOut {
  name: string
  type: string | null
  format: string | null
}

export async function fetchTablesAsSp(workspaceId: string, lakehouseId: string): Promise<FabricTableOut[]> {
  const raw = await drainListAsSp<{ name: string; type?: string | null; format?: string | null }>(
    `/workspaces/${workspaceId}/lakehouses/${lakehouseId}/tables`,
  )
  return raw.map((t) => ({ name: t.name, type: t.type ?? null, format: t.format ?? null }))
}

// ============================================================================
// Tenant-wide workspace access reconciliation — see fabricAccessSync.ts.
// ============================================================================

interface AdminWorkspace {
  id: string
  name: string
  type: string
}

/** Every workspace in the tenant, via the Admin API — works off the MI's
 *  "Fabric Administrator" Entra role, no workspace membership required. */
export async function listAllWorkspaces(): Promise<AdminWorkspace[]> {
  const token = await miToken()
  const out: AdminWorkspace[] = []
  let continuationToken: string | undefined

  for (let i = 0; i < 100; i++) {
    const qs = continuationToken ? `?continuationToken=${encodeURIComponent(continuationToken)}` : ''
    const res = await fetch(`${BASE}/admin/workspaces${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`listAllWorkspaces: Fabric admin API returned ${res.status}.`)
    const page = (await res.json()) as { workspaces: AdminWorkspace[]; continuationToken?: string }
    out.push(...page.workspaces)
    if (!page.continuationToken) return out
    continuationToken = page.continuationToken
  }
  throw new Error('listAllWorkspaces: did not stop paging after 100 pages.')
}

/** The MI's own principal id (its Entra object id) — the id Fabric role
 *  assignments reference. Read from the environment rather than looked up at
 *  runtime: the Function App's identity doesn't change, and the alternative
 *  (calling Graph's /me equivalent for a service principal) is one more
 *  permission to grant for a value that's already known at deploy time. */
function servicePrincipalId(): string {
  const id = process.env['FABRIC_SP_PRINCIPAL_ID']
  if (!id) throw new Error('FABRIC_SP_PRINCIPAL_ID is not set — see local.settings.json.example.')
  return id
}

/** The MI's own existing role assignment on a workspace, if any — reconciliation
 *  compares the role itself, not just presence: an assignment added by hand at
 *  a lower role (Viewer, from early manual testing) must still be upgraded, not
 *  treated as "already done" forever. */
async function existingAssignment(workspaceId: string): Promise<{ id: string; role: string } | undefined> {
  const token = await miToken()
  const res = await fetch(`${BASE}/workspaces/${workspaceId}/roleAssignments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return undefined // deleted / no access to check — treated as "try to add"
  const body = (await res.json()) as { value: { id: string; principal: { id: string }; role: string }[] }
  const spId = servicePrincipalId()
  return body.value.find((a) => a.principal.id === spId)
}

/** Grants the MI Contributor on one workspace, if it doesn't already have it
 *  at Contributor or above (Admin also satisfies this — never downgraded).
 *  An existing lower-role assignment (e.g. Viewer, from early manual testing)
 *  is upgraded via PATCH on its own id — POSTing a new assignment for a
 *  principal that already has one is a duplicate, not an upgrade. */
export async function ensureContributorAccess(workspaceId: string): Promise<'granted' | 'already-had' | 'failed'> {
  const existing = await existingAssignment(workspaceId)
  if (existing?.role === 'Contributor' || existing?.role === 'Admin') return 'already-had'
  const token = await miToken()
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const res = existing
    ? await fetch(`${BASE}/workspaces/${workspaceId}/roleAssignments/${existing.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ role: 'Contributor' }),
      })
    : await fetch(`${BASE}/workspaces/${workspaceId}/roleAssignments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ principal: { id: servicePrincipalId(), type: 'ServicePrincipal' }, role: 'Contributor' }),
      })
  return res.ok ? 'granted' : 'failed'
}
