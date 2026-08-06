// Branching history over the local snapshot store — ADR-0002 decisions 1-3,
// with no server involved.
//
// The ADR's third decision is the load-bearing one here: **the local store IS
// an unpublished branch**. So this does not introduce a parallel "local
// version" of the snapshot model that later has to be reconciled with a real
// one — it is the real one, running against `localStorage` instead of
// Postgres. When the server exists, publishing sends these snapshots; it does
// not translate them.
//
// Snapshots reuse the store's existing `lineage-studio:versions:<id>` key
// rather than a second history alongside it. `ModelVersion` was already a
// whole-model immutable snapshot with an id; the only thing a linear history
// was missing is a parent pointer.
//
//   lineage-studio:versions:<id>   -> ModelVersion[]   (snapshots, unchanged key)
//   lineage-studio:branches:<id>   -> BranchState      (pointers into them)

import { merge3, type MergeResult } from './merge3'
import { localStore, type ModelVersion } from './store'
import type { LineageModel } from './types'

const versionsKey = (id: string) => `lineage-studio:versions:${id}`
const branchesKey = (id: string) => `lineage-studio:branches:${id}`

export const MAIN = 'main'

export interface Branch {
  name: string
  /** Snapshot id, or null for a branch with no commits yet. */
  head: string | null
}

interface BranchState {
  current: string
  heads: Record<string, string | null>
}

/** Snapshot metadata without the model payload — what a history list needs. */
export type SnapshotMeta = Omit<ModelVersion, 'model'> & { parents: string[] }

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

/** Snapshots written before branching existed have no `parents`. */
function readSnapshots(modelId: string): (ModelVersion & { parents: string[] })[] {
  return (readJson<ModelVersion[]>(versionsKey(modelId)) ?? []).map((v) => ({
    ...v,
    parents: v.parents ?? [],
  }))
}

/**
 * A model with pre-existing linear history gets `main` pointed at its most
 * recent snapshot, so upgrading does not look like losing the history.
 */
function readBranches(modelId: string): BranchState {
  const stored = readJson<BranchState>(branchesKey(modelId))
  if (stored) return stored
  const snapshots = readSnapshots(modelId)
  // `>=` so a tie resolves to the later-appended snapshot, matching the order
  // `listSnapshots` reports.
  const latest = snapshots.length
    ? snapshots.reduce((a, b) => (b.savedAt >= a.savedAt ? b : a)).id
    : null
  return { current: MAIN, heads: { [MAIN]: latest } }
}

export async function listBranches(modelId: string): Promise<Branch[]> {
  const state = readBranches(modelId)
  return Object.entries(state.heads)
    .map(([name, head]) => ({ name, head }))
    // `main` first, the rest alphabetical — the default branch is the one
    // people look for, not the one that happens to sort first.
    .sort((a, b) => (a.name === MAIN ? -1 : b.name === MAIN ? 1 : a.name.localeCompare(b.name)))
}

export async function currentBranch(modelId: string): Promise<string> {
  return readBranches(modelId).current
}

/**
 * Newest first.
 *
 * Insertion order breaks a `savedAt` tie: two commits inside the same
 * millisecond is not a hypothetical — undo/redo and any scripted edit produce
 * it — and sorting on the timestamp alone would order them arbitrarily, which
 * reads as history shuffling itself between page loads. Snapshots are only
 * ever appended, so position in the array is the true commit order.
 */
export async function listSnapshots(modelId: string): Promise<SnapshotMeta[]> {
  return readSnapshots(modelId)
    .map(({ model: _model, ...meta }, i) => ({ meta, i }))
    .sort((a, b) => b.meta.savedAt - a.meta.savedAt || b.i - a.i)
    .map(({ meta }) => meta)
}

export async function getSnapshot(modelId: string, snapshotId: string): Promise<LineageModel | null> {
  return readSnapshots(modelId).find((s) => s.id === snapshotId)?.model ?? null
}

/**
 * Appends a snapshot of `model` to the current branch and advances its head.
 *
 * The snapshot's parent is whatever the branch pointed at, so committing on a
 * branch someone else has since advanced is not possible here — there is only
 * one writer. That changes when the server arrives, and it is exactly what
 * ADR-0002's `base` field on a proposal exists to detect.
 */
export async function commit(
  modelId: string,
  model: LineageModel,
  label: string,
  parents?: string[],
): Promise<string> {
  const state = readBranches(modelId)
  const head = state.heads[state.current] ?? null
  const snapshot: ModelVersion = {
    id: crypto.randomUUID(),
    savedAt: Date.now(),
    label,
    model: structuredClone(model),
    parents: parents ?? (head ? [head] : []),
  }
  writeJson(versionsKey(modelId), [...readSnapshots(modelId), snapshot])
  state.heads[state.current] = snapshot.id
  writeJson(branchesKey(modelId), state)
  return snapshot.id
}

/** Creates a branch at the current branch's head and leaves you on it. */
export async function createBranch(modelId: string, name: string): Promise<void> {
  const clean = name.trim()
  if (!clean) throw new Error('A branch needs a name.')
  const state = readBranches(modelId)
  if (state.heads[clean] !== undefined) throw new Error(`Branch "${clean}" already exists.`)
  state.heads[clean] = state.heads[state.current] ?? null
  state.current = clean
  writeJson(branchesKey(modelId), state)
}

/**
 * Switches branches and returns the model at that branch's head.
 *
 * The caller is responsible for saving uncommitted work first — this
 * deliberately does not stash. A branch with no commits yet returns null and
 * the caller should keep showing what it has.
 */
export async function checkout(modelId: string, name: string): Promise<LineageModel | null> {
  const state = readBranches(modelId)
  const head = state.heads[name]
  if (head === undefined) throw new Error(`No branch "${name}".`)
  state.current = name
  writeJson(branchesKey(modelId), state)
  return head ? await getSnapshot(modelId, head) : null
}

export async function deleteBranch(modelId: string, name: string): Promise<void> {
  if (name === MAIN) throw new Error('main cannot be deleted.')
  const state = readBranches(modelId)
  if (state.heads[name] === undefined) return
  delete state.heads[name]
  if (state.current === name) state.current = MAIN
  writeJson(branchesKey(modelId), state)
}

/**
 * The most recent snapshot both `a` and `b` descend from — ADR-0002's `base`.
 *
 * Walks `a`'s ancestry in full, then breadth-first from `b`, so the first hit
 * is the nearest common ancestor by distance from `b` rather than an arbitrary
 * one. History here is small enough that a full walk costs nothing; the
 * server-side version of this is a recursive CTE.
 */
export function commonAncestor(
  snapshots: readonly (ModelVersion & { parents: string[] })[],
  a: string | null,
  b: string | null,
): string | null {
  if (!a || !b) return null
  const byId = new Map(snapshots.map((s) => [s.id, s]))
  const ancestorsOfA = new Set<string>()
  const stack = [a]
  while (stack.length) {
    const id = stack.pop()!
    if (ancestorsOfA.has(id)) continue
    ancestorsOfA.add(id)
    stack.push(...(byId.get(id)?.parents ?? []))
  }
  const queue = [b]
  const seen = new Set<string>()
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id)) continue
    seen.add(id)
    if (ancestorsOfA.has(id)) return id
    queue.push(...(byId.get(id)?.parents ?? []))
  }
  return null
}

export interface MergeOutcome extends MergeResult {
  /** True when nothing had diverged and the pointer simply moved forward. */
  fastForward: boolean
  /** The snapshot `target` now points at, or null if there was nothing to do. */
  head: string | null
}

/**
 * Merges `source` into `target`. Conflicts do NOT block the merge snapshot —
 * they come back on the outcome with our side applied, per ADR-0002 decision 7.
 *
 * "Ours" is `target`, matching git: you are merging someone else's work into
 * the branch you are on, and your branch's version is the one that wins a tie.
 */
export async function mergeBranch(
  modelId: string,
  source: string,
  target: string = MAIN,
): Promise<MergeOutcome> {
  const state = readBranches(modelId)
  const sourceHead = state.heads[source]
  const targetHead = state.heads[target]
  if (sourceHead === undefined) throw new Error(`No branch "${source}".`)
  if (targetHead === undefined) throw new Error(`No branch "${target}".`)
  if (!sourceHead) throw new Error(`Branch "${source}" has nothing to merge.`)

  const snapshots = readSnapshots(modelId)
  const byId = new Map(snapshots.map((s) => [s.id, s]))
  const sourceModel = byId.get(sourceHead)!.model

  // Fast-forward: target has not moved since source branched off it, so there
  // is nothing to merge and no reason to manufacture a merge snapshot for it
  // (ADR-0002 decision 4 — ceremony for an uncontested edit teaches people to
  // route around the process).
  const base = commonAncestor(snapshots, targetHead, sourceHead)
  if (!targetHead || base === targetHead) {
    state.heads[target] = sourceHead
    writeJson(branchesKey(modelId), state)
    return {
      model: sourceModel,
      conflicts: [],
      warnings: [],
      fastForward: true,
      head: sourceHead,
    }
  }

  const targetModel = byId.get(targetHead)!.model
  // No common ancestor means unrelated histories; an empty base makes every
  // entity on both sides an addition, which is the only sane reading.
  const baseModel = base ? byId.get(base)!.model : { ...targetModel, layers: [], transitions: [], properties: {} }

  const result = merge3(baseModel, targetModel, sourceModel)

  const previous = state.current
  state.current = target
  writeJson(branchesKey(modelId), state)
  const head = await commit(modelId, result.model, `Merge ${source} into ${target}`, [
    targetHead,
    sourceHead,
  ])
  const after = readBranches(modelId)
  after.current = previous
  writeJson(branchesKey(modelId), after)

  return { ...result, fastForward: false, head }
}

/** Convenience: commit the model as it stands and persist it as the open model. */
export async function commitCurrent(model: LineageModel, label: string): Promise<string> {
  await localStore.save(model)
  return commit(model.id, model, label)
}
