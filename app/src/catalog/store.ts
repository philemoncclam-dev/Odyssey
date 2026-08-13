// Catalog persistence. One localStorage key holding the full entry list —
// unlike model/store.ts's per-model keys, entries are small metadata rows
// (no entity graph), so there's nothing to gain from splitting an index out.
import { logPublish, logUnpublish } from './history'
import type { CatalogEntry, PublishInput } from './types'

const KEY = 'lineage-studio:catalog'

export interface CatalogStore {
  list(): Promise<CatalogEntry[]>
  get(id: string): Promise<CatalogEntry | null>
  /** The published entry for a model, if it has one — at most one per model. */
  byModel(modelId: string): Promise<CatalogEntry | null>
  /** Creates the entry for this model, or replaces it if already published. */
  publish(input: PublishInput): Promise<CatalogEntry>
  unpublish(id: string): Promise<void>
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
  } catch (err) {
    throw new Error(
      `Could not save to local storage — it is full or unavailable. ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
  }
}

function readAll(): CatalogEntry[] {
  return readJson<CatalogEntry[]>(KEY) ?? []
}

export const localCatalogStore: CatalogStore = {
  async list() {
    return readAll().sort((a, b) => b.updatedAt - a.updatedAt)
  },

  async get(id) {
    return readAll().find((e) => e.id === id) ?? null
  },

  async byModel(modelId) {
    return readAll().find((e) => e.modelId === modelId) ?? null
  },

  async publish(input) {
    const all = readAll()
    const existing = all.find((e) => e.modelId === input.modelId)
    const now = Date.now()
    const entry: CatalogEntry = existing
      ? { ...existing, ...input, updatedAt: now }
      : { id: crypto.randomUUID(), ...input, publishedAt: now, updatedAt: now }
    writeJson(
      KEY,
      [...all.filter((e) => e.modelId !== input.modelId), entry],
    )
    logPublish(entry, existing ?? null, input)
    return entry
  },

  async unpublish(id) {
    const entry = readAll().find((e) => e.id === id)
    writeJson(
      KEY,
      readAll().filter((e) => e.id !== id),
    )
    if (entry) logUnpublish(entry)
  },
}
