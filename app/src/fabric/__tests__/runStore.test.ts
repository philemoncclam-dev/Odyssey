// Run history. The interesting parts are the limits: what gets evicted, what
// is refused, and what happens when storage is full — all of which fail
// silently if they fail at all.
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearRuns, lastTwoRuns, listRuns, saveRun } from '../runStore'
import {
  __resetSequence,
  addStep,
  clearSteps,
  getSequence,
  hydrateSequence,
  type Step,
  type StepResult,
} from '../sequence'

const step = (name: string): Step => ({
  key: `k-${name}`,
  kind: 'notebook',
  ws: 'ws',
  itemId: `id-${name}`,
  name,
})

const result = (padding = 0): StepResult => ({
  status: 'ok',
  runs: [
    {
      name: 'run',
      status: 'ok',
      result: {
        ok: true,
        engine: 'stub',
        cells: [],
        reads: ['Analytics/lh_bronze/orders'],
        writes: ['Analytics/lh_silver/orders'],
        table_schemas: padding ? { big: Array.from({ length: padding }, (_, i) => ({ name: `c${i}` })) } : {},
        column_lineage: [],
        log: [],
        saw_credentials: false,
        error: null,
      },
    },
  ],
})

const save = (name: string, padding = 0) =>
  saveRun([step(name)], new Map([[`k-${name}`, result(padding)]]))

beforeEach(() => {
  localStorage.clear()
})

describe('saving and reading back', () => {
  it('round-trips a run, newest first', () => {
    save('one')
    save('two')
    expect(listRuns().map((r) => r.steps[0]!.name)).toEqual(['two', 'one'])
  })

  it('rebuilds the results map from entries, since a Map does not survive JSON', () => {
    save('one')
    const run = listRuns()[0]!
    expect(new Map(run.results).get('k-one')?.status).toBe('ok')
  })

  it('refuses to save a sequence with no steps', () => {
    // Nothing ran, so there is nothing to come back to — and an empty record
    // would evict a real one.
    expect(saveRun([], new Map())).toBe(false)
    expect(listRuns()).toEqual([])
  })

  it('hands Diff the last two runs, which is what it compares', () => {
    save('one')
    save('two')
    save('three')
    const { latest, previous } = lastTwoRuns()
    expect(latest?.steps[0]!.name).toBe('three')
    expect(previous?.steps[0]!.name).toBe('two')
  })

  it('reports no previous run when only one exists', () => {
    save('only')
    expect(lastTwoRuns().previous).toBeNull()
  })
})

describe('limits', () => {
  it('keeps the newest few and drops the rest', () => {
    for (const n of ['1', '2', '3', '4', '5', '6', '7']) save(n)
    const names = listRuns().map((r) => r.steps[0]!.name)
    expect(names).toEqual(['7', '6', '5', '4', '3'])
  })

  it('refuses a single run bigger than the whole budget', () => {
    // And crucially does not evict anything on its way to failing: one huge
    // run must not cost you every ordinary one you had.
    save('small')
    expect(save('enormous', 60_000)).toBe(false)
    expect(listRuns().map((r) => r.steps[0]!.name)).toEqual(['small'])
  })

  it('evicts older runs to make room for a large one', () => {
    for (const n of ['a', 'b', 'c']) save(n, 2_000)
    const names = listRuns().map((r) => r.steps[0]!.name)
    // The newest survives whatever else goes.
    expect(names[0]).toBe('c')
    expect(names.length).toBeLessThanOrEqual(3)
  })
})

describe('when storage misbehaves', () => {
  it('treats a corrupt entry as no history rather than throwing', () => {
    localStorage.setItem('lineage-studio:sandbox-runs', '{not json')
    expect(listRuns()).toEqual([])
    expect(lastTwoRuns()).toEqual({ latest: null, previous: null })
  })

  it('drops its own history rather than competing with models for quota', () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem')

    // Run history is the most disposable thing in this origin; a model is not.
    expect(() => save('one')).not.toThrow()
    expect(removeItem).toHaveBeenCalledWith('lineage-studio:sandbox-runs')

    setItem.mockRestore()
    removeItem.mockRestore()
  })

  it('clears on request', () => {
    save('one')
    clearRuns()
    expect(listRuns()).toEqual([])
  })
})

// Restoring. This is the half that makes history useful: coming back to a
// result, and Diff having something to compare against from yesterday.
describe('hydrating the sequence', () => {
  beforeEach(() => {
    __resetSequence()
  })

  it('puts the last run back, marked as restored', () => {
    save('one')
    hydrateSequence()

    const state = getSequence()
    expect(state.steps.map((s) => s.name)).toEqual(['one'])
    expect(state.results.get('k-one')?.status).toBe('ok')
    // Not presented as live — the notebook may have changed since.
    expect(state.restoredAt).toBeGreaterThan(0)
  })

  it('fills previous from the run before, so Diff works across sessions', () => {
    save('older')
    save('newer')
    hydrateSequence()

    const state = getSequence()
    expect(state.steps[0]!.name).toBe('newer')
    expect(state.previous?.get('k-older')?.status).toBe('ok')
  })

  it('does nothing when there is no history', () => {
    hydrateSequence()
    expect(getSequence().steps).toEqual([])
    expect(getSequence().restoredAt).toBeNull()
  })

  it('never restores over a sequence someone is already stacking', () => {
    save('saved')
    addStep({ kind: 'notebook', ws: 'ws', itemId: 'live', name: 'live' })
    hydrateSequence()
    expect(getSequence().steps.map((s) => s.name)).toEqual(['live'])
  })

  it('only restores once', () => {
    save('one')
    hydrateSequence()
    clearSteps()
    hydrateSequence()
    // A second call after the user cleared would put the old run straight back.
    expect(getSequence().steps).toEqual([])
  })
})
