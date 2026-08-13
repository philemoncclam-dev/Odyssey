// The schema baseline: a table the run never touched still has to exist in
// the exported model, tagged as untouched rather than silently absent.
import { describe, expect, it } from 'vitest'

import { sequenceToModel } from '../toModel'
import type { SchemaBaseline } from '../schemaBaseline'
import type { SandboxRunResult } from '../api'
import type { Step, StepResult } from '../sequence'
import { TAGS_KEY } from '../../model/tags'

const BRONZE = 'Analytics/lh_bronze/raw_customers'
const SILVER = 'Analytics/lh_silver/customers'
// Same lakehouse as BRONZE — a real table the run never read or wrote.
const UNTOUCHED = 'Analytics/lh_bronze/raw_orders'

const step: Step = { key: 'k1', kind: 'notebook', ws: 'ws', itemId: 'n1', name: 'nb_silver' }

const result = (over: Partial<SandboxRunResult> = {}): StepResult => ({
  status: 'ok',
  runs: [
    {
      name: 'nb_silver',
      status: 'ok',
      result: {
        ok: true,
        engine: 'stub',
        cells: [],
        reads: [BRONZE],
        writes: [SILVER],
        table_schemas: { [BRONZE]: [{ name: 'id' }], [SILVER]: [{ name: 'customer_id' }] },
        column_lineage: [],
        log: [],
        saw_credentials: false,
        error: null,
        ...over,
      },
    },
  ],
})

const results = new Map([['k1', result()]])

function tagsOf(model: ReturnType<typeof sequenceToModel>['model'], name: string): string {
  for (const layer of model.layers)
    for (const object of layer.objects) {
      if (object.name === name) return model.properties[object.id]?.[TAGS_KEY] ?? ''
      for (const child of object.children) if (child.name === name) return model.properties[child.id]?.[TAGS_KEY] ?? ''
    }
  return ''
}

describe('schema baseline', () => {
  it('without a baseline, a table the run never touched does not exist', () => {
    const { model } = sequenceToModel([step], results, 'm', 'flow', undefined)
    expect(tagsOf(model, 'raw_orders')).toBe('')
  })

  it('seeds a node for a baseline table the run never touched, tagged Untouched', () => {
    const baseline: SchemaBaseline = {
      schemas: new Map([[UNTOUCHED, [{ name: 'order_id' }]]]),
      unreadable: [],
    }
    const { model } = sequenceToModel([step], results, 'm', 'flow', undefined, baseline)
    expect(tagsOf(model, 'raw_orders')).toContain('Untouched')
    // A table the run DID write to must not be tagged untouched, even though
    // it is also in the baseline (the merge only fills gaps, and the touch
    // check runs off the run's own links, not the baseline).
    expect(tagsOf(model, 'customers')).not.toContain('Untouched')
  })

  it('a baseline table already covered by the run keeps the run’s schema', () => {
    const baseline: SchemaBaseline = {
      schemas: new Map([[SILVER, [{ name: 'stale_column' }]]]),
      unreadable: [],
    }
    const { model } = sequenceToModel([step], results, 'm', 'flow', undefined, baseline)
    const names: string[] = []
    for (const layer of model.layers)
      for (const object of layer.objects)
        for (const child of object.children) if (child.name === 'customers') names.push(...child.children.map((c) => c.name))
    expect(names).toContain('customer_id')
    expect(names).not.toContain('stale_column')
  })
})
