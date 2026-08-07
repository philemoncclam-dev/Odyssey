// Staged data is only useful if it is honest about being staged and complete
// enough to exercise the screens. These pin both, plus the one rule that keeps
// a demo mode from becoming a liability: it never stands in for a real call.
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fetchFabricItems,
  fetchFabricNotebookSource,
  fetchFabricStatus,
  fetchFabricWorkspaces,
  fetchIdentity,
  fetchIntegrations,
  runSandbox,
  setFabricApi,
  type FabricApi,
} from '../api'
import { __demo, demoFabricApi } from '../demoApi'
import { isDemoActive } from '../demoFlag'

const WS = __demo.WS_ID

beforeEach(() => {
  setFabricApi(demoFabricApi())
})

describe('coverage', () => {
  it('implements every capability the toolkit calls', () => {
    // A demo estate with a hole in it fails exactly where a reviewer looks.
    const api = demoFabricApi()
    const required: (keyof FabricApi)[] = [
      'status',
      'workspaces',
      'items',
      'tables',
      'notebookSource',
      'tableSchema',
      'pipelineDefinition',
      'runSandbox',
      'observedRun',
      'integrations',
      'identity',
    ]
    expect(required.filter((k) => !api[k])).toEqual([])
  })

  it('announces itself so the UI can say so on screen', () => {
    expect(isDemoActive()).toBe(true)
  })

  it('reports as configured, and populates the tree', async () => {
    await expect(fetchFabricStatus()).resolves.toEqual({ configured: true })
    const workspaces = await fetchFabricWorkspaces()
    expect(workspaces.map((w) => w.name)).toEqual(['Analytics', 'Finance'])
    const items = await fetchFabricItems(WS)
    expect(items.notebooks.length).toBeGreaterThan(0)
    expect(items.lakehouses.length).toBeGreaterThan(0)
  })

  it('gives an unknown workspace an empty estate rather than throwing', async () => {
    // The tree opens whatever it is given; a throw here would be a broken
    // branch instead of an empty one.
    await expect(fetchFabricItems('nope')).resolves.toEqual({
      folders: [],
      notebooks: [],
      lakehouses: [],
      others: [],
    })
  })
})

describe('the staged estate is realistic on purpose', () => {
  it('serves notebook source that is real SQL', async () => {
    const source = await fetchFabricNotebookSource(WS, 'nb-silver-conform', 'nb_silver_conform')
    expect(source.cells.join('\n')).toContain('CREATE OR REPLACE TABLE lh_silver.silver_customer')
  })

  it('leaves a column untraced, so "which columns have no lineage" has an answer', async () => {
    const result = await runSandbox({ item_id: 'nb-bronze-load' })
    // bronze_invoices.currency is landed and never mapped onward — the same
    // deliberate gap the sample model carries.
    const bronze = __demo.NOTEBOOKS.find((n) => n.id === 'nb-bronze-load')!
    expect(bronze.flows).toEqual([])
    expect(result.coverage?.writes_without_column_lineage.length).toBeGreaterThan(0)
  })

  it('reads across workspaces, so the canvas has a cross-workspace case', async () => {
    const result = await runSandbox({ item_id: 'nb-silver-conform' })
    expect(result.reads.some((r) => r.startsWith('Finance/'))).toBe(true)
  })

  it('never claims a credential was reachable', async () => {
    const result = await runSandbox({ item_id: 'nb-silver-conform' })
    expect(result.saw_credentials).toBe(false)
  })

  it('says in the log that nothing ran', async () => {
    const result = await runSandbox({ item_id: 'nb-gold-aggregate' })
    expect(result.log.join(' ')).toContain('[demo]')
  })

  it('disagrees with the observed run, which is why the comparison exists', async () => {
    const result = await runSandbox({ item_id: 'nb-silver-conform', include_observed: true })
    expect(result.observed?.available).toBe(true)
    // The real run wrote something static analysis would not find.
    const extra = result.observed!.writes.filter((w) => !result.writes.includes(w))
    expect(extra.length).toBeGreaterThan(0)
  })
})

describe('honesty', () => {
  it('marks the identity as unauthenticated rather than inventing a principal', async () => {
    const identity = await fetchIdentity()
    expect(identity.mode).toBe('none')
    expect(identity.display_name).toMatch(/demo/i)
  })

  it('labels every integration detail as staged', async () => {
    const integrations = await fetchIntegrations()
    expect(integrations.length).toBeGreaterThan(0)
    for (const integration of integrations) {
      expect(integration.detail).toContain('[demo]')
    }
  })

  it('refuses a notebook it has no fixture for instead of inventing lineage', async () => {
    const result = await runSandbox({ item_id: 'nb-does-not-exist', name: 'mystery' })
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/No staged result/)
    expect(result.column_lineage).toEqual([])
  })
})

describe('the real engine wins when one is wired', () => {
  it('hands the notebook cells to it rather than serving the staged answer', async () => {
    const real = vi.fn().mockResolvedValue({ ok: true, engine: 'spark', reads: [], writes: [] })
    setFabricApi(demoFabricApi({ runSandbox: real }))

    await runSandbox({ item_id: 'nb-silver-conform' })

    expect(real).toHaveBeenCalledOnce()
    const body = real.mock.calls[0]![0] as { cells?: string[] }
    // Analysing the code for real beats a canned result, so demo mode supplies
    // the fixture's cells rather than short-circuiting.
    expect(body.cells?.join('\n')).toContain('CREATE OR REPLACE TABLE')
  })

  it('falls back to the staged result when the engine cannot be reached', async () => {
    const real = vi.fn().mockRejectedValue(new Error('engine down'))
    setFabricApi(demoFabricApi({ runSandbox: real }))

    // Demo mode's promise is that the app works with nothing running, and
    // "VITE_SANDBOX_URL is set but I forgot to start the service" is the
    // normal way to get here.
    const result = await runSandbox({ item_id: 'nb-silver-conform' })
    expect(result.ok).toBe(true)
    expect(result.column_lineage.length).toBeGreaterThan(0)
    // But it says so — quietly serving fixtures after a real engine failed
    // would hide a genuine fault, which is the one thing this must not do.
    expect(result.log[0]).toContain('could not be reached')
    expect(result.log[0]).toContain('engine down')
  })
})
