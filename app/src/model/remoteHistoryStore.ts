// The branching surface (model/history.ts's `HistoryStore`), backed by the
// server API instead of localStorage.
//
// UNVERIFIED, same caveat as model/remoteStore.ts.
//
// NO SERVER-SIDE "CURRENT BRANCH". Local history stores one `current` pointer
// per model because there is only ever one person editing it. A shared model
// has no such thing — two people can legitimately be looking at two
// different branches of the same model at once — so "which branch am I on"
// lives ONLY in this browser's localStorage (`odyssey:branch:<modelId>`,
// namespaced away from history.ts's own keys so the two never collide even
// if both stores are somehow live at once), never synced, never read by the
// server. This is a real behavior difference from the local store, not an
// oversight: it is what "current branch" can honestly mean once a model is
// shared.
//
// MERGE STILL RUNS IN THE BROWSER. The three-way merge algorithm
// (model/merge3.ts) is real, tested logic already written once; porting it
// to run server-side would mean maintaining it in two languages. Instead the
// server exposes cheap primitives — branch heads, snapshot metadata with
// parent pointers, fetch-one-snapshot, atomic-commit — and this file runs
// the same ancestor walk and merge computation the local store does,
// fed by fetched data instead of a localStorage read.
import { merge3 } from './merge3'
import { commonAncestor, MAIN, type Branch, type HistoryStore, type MergeOutcome, type SnapshotMeta } from './history'
import { acquireModelApiToken } from '../auth/AuthProvider'
import type { LineageModel } from './types'

function baseUrl(): string {
  const url = import.meta.env['VITE_MODEL_API_URL']
  if (!url) throw new Error('VITE_MODEL_API_URL is not set — see server/README.md.')
  return url.replace(/\/+$/, '')
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await acquireModelApiToken()
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
  if (res.status === 204) return undefined as T
  const body = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
  if (!res.ok) throw new Error((body as { error?: string } | null)?.error ?? `Request failed (${res.status}).`)
  return body as T
}

const branchCacheKey = (modelId: string) => `odyssey:branch:${modelId}`
const getCachedBranch = (modelId: string) => localStorage.getItem(branchCacheKey(modelId)) ?? MAIN
const setCachedBranch = (modelId: string, name: string) => localStorage.setItem(branchCacheKey(modelId), name)

async function listBranches(modelId: string): Promise<Branch[]> {
  return call<Branch[]>(`/api/models/${modelId}/branches`)
}

async function currentBranch(modelId: string): Promise<string> {
  return getCachedBranch(modelId)
}

async function listSnapshots(modelId: string): Promise<SnapshotMeta[]> {
  return call<SnapshotMeta[]>(`/api/models/${modelId}/versions`)
}

async function getSnapshot(modelId: string, snapshotId: string): Promise<LineageModel | null> {
  try {
    return await call<LineageModel>(`/api/models/${modelId}/versions/${snapshotId}`)
  } catch (err) {
    // The plain HTTP client here doesn't distinguish 404 from other errors
    // (unlike remoteStore.ts's isNotFoundError) because every caller of this
    // one already treats "not found" and "gone" the same way: nothing to show.
    if (err instanceof Error && /not found/i.test(err.message)) return null
    throw err
  }
}

async function commit(
  modelId: string,
  model: LineageModel,
  label: string,
  parents?: string[],
): Promise<string> {
  const branch = getCachedBranch(modelId)
  const result = await call<{ versionId: string }>(`/api/models/${modelId}/commit`, {
    method: 'POST',
    body: JSON.stringify({ model, label, branch, parents }),
  })
  return result.versionId
}

async function createBranch(modelId: string, name: string): Promise<void> {
  const clean = name.trim()
  if (!clean) throw new Error('A branch needs a name.')
  await call(`/api/models/${modelId}/branches`, {
    method: 'POST',
    body: JSON.stringify({ name: clean, from: getCachedBranch(modelId) }),
  })
  setCachedBranch(modelId, clean)
}

async function checkout(modelId: string, name: string): Promise<LineageModel | null> {
  const branches = await listBranches(modelId)
  const branch = branches.find((b) => b.name === name)
  if (!branch) throw new Error(`No branch "${name}".`)
  setCachedBranch(modelId, name)
  return branch.head ? await getSnapshot(modelId, branch.head) : null
}

async function deleteBranch(modelId: string, name: string): Promise<void> {
  if (name === MAIN) throw new Error('main cannot be deleted.')
  await call(`/api/models/${modelId}/branches/${encodeURIComponent(name)}`, { method: 'DELETE' })
  if (getCachedBranch(modelId) === name) setCachedBranch(modelId, MAIN)
}

async function mergeBranch(modelId: string, source: string, target: string = MAIN): Promise<MergeOutcome> {
  const branches = await listBranches(modelId)
  const sourceBranch = branches.find((b) => b.name === source)
  const targetBranch = branches.find((b) => b.name === target)
  if (!sourceBranch) throw new Error(`No branch "${source}".`)
  if (!targetBranch) throw new Error(`No branch "${target}".`)
  if (!sourceBranch.head) throw new Error(`Branch "${source}" has nothing to merge.`)

  const snapshots = await listSnapshots(modelId)
  const base = commonAncestor(
    snapshots.map((s) => ({ id: s.id, parents: s.parents })),
    targetBranch.head,
    sourceBranch.head,
  )

  // Fast-forward: nothing to merge, just move the pointer to an EXISTING
  // version rather than manufacturing a merge commit for an uncontested edit.
  if (!targetBranch.head || base === targetBranch.head) {
    await call(`/api/models/${modelId}/branches/${encodeURIComponent(target)}/point`, {
      method: 'POST',
      body: JSON.stringify({ versionId: sourceBranch.head }),
    })
    const sourceModel = (await getSnapshot(modelId, sourceBranch.head))!
    return { model: sourceModel, conflicts: [], warnings: [], fastForward: true, head: sourceBranch.head }
  }

  const [targetModel, sourceModel, baseModel] = await Promise.all([
    getSnapshot(modelId, targetBranch.head),
    getSnapshot(modelId, sourceBranch.head),
    base ? getSnapshot(modelId, base) : Promise.resolve(null),
  ])
  const baseGraph = baseModel ?? { ...targetModel!, layers: [], transitions: [], properties: {} }
  const result = merge3(baseGraph, targetModel!, sourceModel!)

  // commit() reads the cached "current branch" (see this file's header) to
  // decide where a commit lands — swap it to `target` for the duration of
  // this one commit, then put it back, the same trick the local store's
  // mergeBranch uses for the same reason.
  const previous = getCachedBranch(modelId)
  setCachedBranch(modelId, target)
  const head = await commit(modelId, result.model, `Merge ${source} into ${target}`, [
    targetBranch.head,
    sourceBranch.head,
  ])
  setCachedBranch(modelId, previous)

  return { ...result, fastForward: false, head }
}

export const remoteHistoryStore: HistoryStore = {
  listBranches,
  currentBranch,
  listSnapshots,
  getSnapshot,
  commit,
  createBranch,
  checkout,
  deleteBranch,
  mergeBranch,
}
