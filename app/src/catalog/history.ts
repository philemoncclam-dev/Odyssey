// A log of what happened to the catalog — published, rebound, unpublished —
// kept separately from the entries themselves (catalog/store.ts) so a
// deleted entry's history survives it. `CatalogEntry`'s own
// publishedAt/updatedAt say WHEN something last changed; this says WHAT
// changed and WHO.
import { getCurrentUserEmail } from '../auth/currentUser'
import type { CatalogEntry, PublishInput } from './types'

const KEY = 'lineage-studio:catalog-history'
/** FIFO cap, newest kept — an unbounded log is not what an audit trail needs to be. */
const MAX_ENTRIES = 500

export type CatalogAction = 'published' | 'republished' | 'unpublished'

export interface CatalogHistoryEntry {
  id: string
  catalogEntryId: string
  modelId: string
  name: string
  action: CatalogAction
  at: number
  by: string | null
  /** What changed, as a sentence. Empty for a first publish or an unpublish — there's nothing to diff. */
  summary: string
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // History is a record OF the catalog, not the record of truth — a full
    // quota should not stop the publish it would have logged.
  }
}

function readAll(): CatalogHistoryEntry[] {
  return readJson<CatalogHistoryEntry[]>(KEY) ?? []
}

export async function catalogHistory(): Promise<CatalogHistoryEntry[]> {
  return readAll().sort((a, b) => b.at - a.at)
}

export async function catalogHistoryFor(catalogEntryId: string): Promise<CatalogHistoryEntry[]> {
  return (await catalogHistory()).filter((h) => h.catalogEntryId === catalogEntryId)
}

/** What changed between a republish and what came before it, as one sentence. */
function diffSummary(from: CatalogEntry, to: PublishInput): string {
  const changed: string[] = []
  if (from.domainPath.join('/') !== to.domainPath.join('/')) changed.push('domain')
  if (from.dataProduct !== to.dataProduct) changed.push('data product')
  if (from.application !== to.application) changed.push('application')
  if (from.owner !== to.owner) changed.push('owner')
  if (from.description !== to.description) changed.push('description')
  if (from.name !== to.name) changed.push('name')
  return changed.length ? `Changed ${changed.join(', ')}` : 'Republished with no classification changes'
}

export function logPublish(entry: CatalogEntry, previous: CatalogEntry | null, input: PublishInput): void {
  const record: CatalogHistoryEntry = {
    id: crypto.randomUUID(),
    catalogEntryId: entry.id,
    modelId: entry.modelId,
    name: entry.name,
    action: previous ? 'republished' : 'published',
    at: entry.updatedAt,
    by: input.publishedBy,
    summary: previous ? diffSummary(previous, input) : '',
  }
  writeJson(KEY, [record, ...readAll()].slice(0, MAX_ENTRIES))
}

export function logUnpublish(entry: CatalogEntry): void {
  const record: CatalogHistoryEntry = {
    id: crypto.randomUUID(),
    catalogEntryId: entry.id,
    modelId: entry.modelId,
    name: entry.name,
    action: 'unpublished',
    at: Date.now(),
    by: getCurrentUserEmail(),
    summary: '',
  }
  writeJson(KEY, [record, ...readAll()].slice(0, MAX_ENTRIES))
}
