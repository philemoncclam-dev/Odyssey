import { beforeEach, describe, expect, it } from 'vitest'

import {
  MAIN,
  checkout,
  commit,
  commonAncestor,
  createBranch,
  currentBranch,
  deleteBranch,
  listBranches,
  listSnapshots,
  mergeBranch,
} from '../history'
import { emptyModel } from '../store'
import type { LineageModel } from '../types'

beforeEach(() => {
  localStorage.clear()
})

const withLayer = (model: LineageModel, id: string, name: string): LineageModel => ({
  ...structuredClone(model),
  layers: [...structuredClone(model).layers, { id, name, objects: [] }],
})

const layerNames = (m: LineageModel) => m.layers.map((l) => l.name)

describe('branches', () => {
  it('starts on main with no commits', async () => {
    const model = emptyModel('M')
    expect(await currentBranch(model.id)).toBe(MAIN)
    expect(await listBranches(model.id)).toEqual([{ name: MAIN, head: null }])
  })

  it('advances the current branch head on commit', async () => {
    const model = emptyModel('M')
    const first = await commit(model.id, model, 'first')
    const second = await commit(model.id, withLayer(model, 'L1', 'Source'), 'second')
    expect(await listBranches(model.id)).toEqual([{ name: MAIN, head: second }])
    const snaps = await listSnapshots(model.id)
    expect(snaps.map((s) => s.parents)).toEqual([[first], []])
  })

  it('adopts a pre-existing linear history onto main', async () => {
    const model = emptyModel('M')
    // A snapshot written before branching existed: no `parents` field at all.
    localStorage.setItem(
      `lineage-studio:versions:${model.id}`,
      JSON.stringify([{ id: 'old', savedAt: 5, label: 'legacy', model }]),
    )
    expect(await listBranches(model.id)).toEqual([{ name: MAIN, head: 'old' }])
    expect((await listSnapshots(model.id))[0].parents).toEqual([])
  })

  it('branches from the current head and switches to the new branch', async () => {
    const model = emptyModel('M')
    const head = await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    expect(await currentBranch(model.id)).toBe('feature')
    expect(await listBranches(model.id)).toEqual([
      { name: MAIN, head },
      { name: 'feature', head },
    ])
  })

  it('refuses a duplicate or blank branch name', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    await expect(createBranch(model.id, 'feature')).rejects.toThrow('already exists')
    await expect(createBranch(model.id, '  ')).rejects.toThrow('needs a name')
  })

  it('checkout returns the model at that head', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    await commit(model.id, withLayer(model, 'L1', 'Source'), 'on feature')
    expect(layerNames((await checkout(model.id, MAIN))!)).toEqual([])
    expect(layerNames((await checkout(model.id, 'feature'))!)).toEqual(['Source'])
  })

  it('will not delete main, and falls back to main when deleting what you are on', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    await expect(deleteBranch(model.id, MAIN)).rejects.toThrow('cannot be deleted')
    await deleteBranch(model.id, 'feature')
    expect(await currentBranch(model.id)).toBe(MAIN)
  })
})

describe('commonAncestor', () => {
  const dag = [
    { id: 'a', savedAt: 1, label: '', model: emptyModel('x'), parents: [] },
    { id: 'b', savedAt: 2, label: '', model: emptyModel('x'), parents: ['a'] },
    { id: 'c', savedAt: 3, label: '', model: emptyModel('x'), parents: ['a'] },
    { id: 'd', savedAt: 4, label: '', model: emptyModel('x'), parents: ['b'] },
  ]

  it('finds the fork point of two diverged lines', () => {
    expect(commonAncestor(dag, 'd', 'c')).toBe('a')
  })

  it('returns the ancestor itself when one side is behind the other', () => {
    expect(commonAncestor(dag, 'd', 'b')).toBe('b')
  })

  it('returns null for unrelated or missing history', () => {
    expect(commonAncestor(dag, 'd', null)).toBeNull()
    expect(commonAncestor([...dag, { id: 'z', savedAt: 9, label: '', model: emptyModel('x'), parents: [] }], 'd', 'z')).toBeNull()
  })
})

describe('mergeBranch', () => {
  it('fast-forwards when the target has not moved', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    const head = await commit(model.id, withLayer(model, 'L1', 'Source'), 'work')

    const out = await mergeBranch(model.id, 'feature', MAIN)
    expect(out.fastForward).toBe(true)
    expect(out.head).toBe(head)
    expect(layerNames(out.model)).toEqual(['Source'])
    // No merge snapshot manufactured for an uncontested edit.
    expect(await listSnapshots(model.id)).toHaveLength(2)
  })

  it('three-way merges when both sides moved, and keeps you where you were', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    await commit(model.id, withLayer(model, 'L1', 'Source'), 'theirs')

    await checkout(model.id, MAIN)
    await commit(model.id, withLayer(model, 'L2', 'Target'), 'ours')

    await createBranch(model.id, 'somewhere-else')
    const out = await mergeBranch(model.id, 'feature', MAIN)

    expect(out.fastForward).toBe(false)
    expect(out.conflicts).toEqual([])
    expect(layerNames(out.model).sort()).toEqual(['Source', 'Target'])
    // The merge snapshot records both parents.
    const merged = (await listSnapshots(model.id)).find((s) => s.id === out.head)!
    expect(merged.parents).toHaveLength(2)
    // Merging onto main should not silently move you off the branch you were on.
    expect(await currentBranch(model.id)).toBe('somewhere-else')
  })

  it('still produces a merge when there are conflicts, and reports them', async () => {
    const model = withLayer(emptyModel('M'), 'L1', 'Source')
    await commit(model.id, model, 'first')
    await createBranch(model.id, 'feature')
    const theirs = structuredClone(model)
    theirs.layers[0].name = 'Bronze'
    await commit(model.id, theirs, 'theirs')

    await checkout(model.id, MAIN)
    const ours = structuredClone(model)
    ours.layers[0].name = 'Raw'
    await commit(model.id, ours, 'ours')

    const out = await mergeBranch(model.id, 'feature', MAIN)
    expect(out.conflicts).toEqual([
      { id: 'L1', kind: 'layer', name: 'Raw', field: 'name', ours: 'Raw', theirs: 'Bronze' },
    ])
    expect(layerNames(out.model)).toEqual(['Raw'])
    expect(out.head).toBeTruthy()
  })

  it('rejects merging a branch that does not exist or has no commits', async () => {
    const model = emptyModel('M')
    await commit(model.id, model, 'first')
    await expect(mergeBranch(model.id, 'nope', MAIN)).rejects.toThrow('No branch')
    await createBranch(model.id, 'empty')
    // `empty` branched from a head, so give it a genuinely empty peer to test.
    localStorage.setItem(
      `lineage-studio:branches:${model.id}`,
      JSON.stringify({ current: MAIN, heads: { [MAIN]: null, blank: null } }),
    )
    await expect(mergeBranch(model.id, 'blank', MAIN)).rejects.toThrow('nothing to merge')
  })
})
