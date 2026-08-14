// Which ModelStore backs the app — the one thing to change to point
// everything at a real backend instead of localStorage.
//
// `VITE_MODEL_API_URL` set -> server/'s Azure SQL-backed API. Unset -> the
// original localStorage store, which is every default checkout, every build,
// and CI. Mirrors fabric/wiring.ts's shape for the same reason: one file
// decides, everything else asks for "the active store" without knowing which
// one it got.
import { localStore } from './store'
import { remoteStore } from './remoteStore'
import { localHistoryStore } from './history'
import { remoteHistoryStore } from './remoteHistoryStore'
import type { ModelStore } from './store'
import type { HistoryStore } from './history'

const remote = Boolean(import.meta.env['VITE_MODEL_API_URL'])

export const activeStore: ModelStore = remote ? remoteStore : localStore

/**
 * Branching/versions. Distinct from `activeStore` because "shared model
 * storage" and "shared branching" used to be two different scope decisions
 * (ADR-0002 kept the latter local-only) — they're wired together now, but
 * kept as two exports so that isn't hidden: `remoteHistoryStore`'s header
 * explains what changes about branching specifically once this is on.
 */
export const activeHistory: HistoryStore = remote ? remoteHistoryStore : localHistoryStore
