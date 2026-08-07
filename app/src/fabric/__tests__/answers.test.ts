// The four questions a table gets asked. The rule running through all of them:
// silence is never proof. "We have not looked" and "nothing is there" are
// different answers and must not collapse into one.
import { beforeEach, describe, expect, it } from 'vitest'

import { answersFor, codeChangedSinceRun } from '../answers'
import { saveRun } from '../runStore'
import type { SandboxRunResult } from '../api'
import type { Step, StepResult } from '../sequence'

const BRONZE = 'Analytics/lh_bronze/raw_customers'
const SILVER = 'Analytics/lh_silver/customers'

const step = (name: string): Step => ({ key: `k-${name}`, kind: 'notebook', ws: 'ws', itemId: name, name })

const run = (over: Partial<SandboxRunResult>): SandboxRunResult => ({
  ok: true,
  engine: 'stub',
  cells: [],
  reads: [],
  writes: [],
  table_schemas: {},
  column_lineage: [],
  log: [],
  saw_credentials: false,
  error: null,
  ...over,
})

const save = (name: string, result: SandboxRunResult) => {
  const stepResult: StepResult = { status: 'ok', runs: [{ name, status: 'ok', result }] }
  saveRun([step(name)], new Map([[`k-${name}`, stepResult]]))
}

beforeEach(() => {
  localStorage.clear()
})

describe('when nothing has been run', () => {
  it('says it has not looked, rather than that nothing feeds the table', () => {
    expect(answersFor({ table: 'customers' }).unexamined).toBe(true)
  })
})

describe('where a column comes from', () => {
  beforeEach(() => {
    save(
      'nb_silver',
      run({
        reads: [BRONZE],
        writes: [SILVER],
        column_lineage: [
          { to_table: SILVER, to_column: 'customer_id', from_table: BRONZE, from_column: 'id' },
          {
            to_table: SILVER,
            to_column: 'customer_name',
            from_table: BRONZE,
            from_column: 'name',
            transform: 'UPPER(name)',
          },
        ],
      }),
    )
  })

  it('names the source column and the step that made the link', () => {
    const answers = answersFor({ table: 'customers' })
    const id = answers.columns.find((c) => c.column === 'customer_id')!
    expect(id.sources).toEqual([
      { ref: BRONZE, column: 'id', transform: undefined, via: 'nb_silver' },
    ])
  })

  it('keeps the derivation, so a computed column is not shown as a copy', () => {
    const answers = answersFor({ table: 'customers' })
    expect(answers.columns.find((c) => c.column === 'customer_name')!.sources[0]!.transform).toBe(
      'UPPER(name)',
    )
  })

  it('prefers the newest run, so a removed derivation does not linger', () => {
    save(
      'nb_silver',
      run({
        writes: [SILVER],
        column_lineage: [
          { to_table: SILVER, to_column: 'customer_id', from_table: 'Other/lh/new_source', from_column: 'id' },
        ],
      }),
    )
    const sources = answersFor({ table: 'customers' }).columns.find(
      (c) => c.column === 'customer_id',
    )!.sources
    expect(sources.map((s) => s.ref)).toEqual(['Other/lh/new_source'])
  })
})

describe('who writes and reads it', () => {
  it('separates the two', () => {
    save('writer', run({ writes: [SILVER] }))
    save('reader', run({ reads: [SILVER] }))
    const answers = answersFor({ table: 'customers' })
    expect(answers.writtenBy.map((t) => t.name)).toEqual(['writer'])
    expect(answers.readBy.map((t) => t.name)).toEqual(['reader'])
  })

  it('narrows by lakehouse when the same table name exists twice', () => {
    save('silver', run({ writes: [SILVER] }))
    save('gold', run({ writes: ['Analytics/lh_gold/customers'] }))
    expect(answersFor({ table: 'customers', lakehouse: 'lh_gold' }).writtenBy.map((t) => t.name))
      .toEqual(['gold'])
    // And reports the ambiguity when it is not narrowed.
    expect(answersFor({ table: 'customers' }).refs).toHaveLength(2)
  })
})

describe('what reads it downstream', () => {
  it('reports consumers when something actually checked', () => {
    save(
      'writer',
      run({
        writes: [SILVER],
        downstream: {
          available: true,
          consumers: [{ id: 'r1', name: 'Exec dashboard', kind: 'report', via: 'lh_silver' }],
          notes: [],
        },
      }),
    )
    const answers = answersFor({ table: 'customers' })
    expect(answers.consumersChecked).toBe(true)
    expect(answers.consumers[0]!.name).toBe('Exec dashboard')
  })

  it('does not read "nobody checked" as "nothing depends on this"', () => {
    // An unconfigured tenant would otherwise look like a table nothing reads,
    // which is exactly the claim that gets a column dropped.
    save('writer', run({ writes: [SILVER], downstream: { available: false, consumers: [], notes: [] } }))
    const answers = answersFor({ table: 'customers' })
    expect(answers.consumersChecked).toBe(false)
    expect(answers.consumers).toEqual([])
  })
})

describe('the last real run', () => {
  const observed = (over: Record<string, unknown> = {}) => ({
    available: true,
    livy_id: 'l1',
    application_id: 'a1',
    state: 'success',
    submitted_at: '2026-08-01T09:00:00Z',
    code_changed_at: '',
    submitter: 'data.platform@contoso.com',
    reads: [],
    writes: [SILVER],
    statements: [],
    tables: {},
    statements_seen: 1,
    statements_resolved: 1,
    unrecognised: [],
    notes: [],
    ...over,
  })

  it('reports what Fabric said, not what the sandbox predicted', () => {
    save('writer', run({ writes: [SILVER], observed: observed() }))
    const last = answersFor({ table: 'customers' }).lastRealRun!
    expect(last.state).toBe('success')
    expect(last.submitter).toBe('data.platform@contoso.com')
    expect(last.via).toBe('writer')
  })

  it('is null when no run ever observed one', () => {
    // A sandbox analysis is not a run. Presenting one as the other is how a
    // pipeline that has not executed in a week looks healthy.
    save('writer', run({ writes: [SILVER] }))
    expect(answersFor({ table: 'customers' }).lastRealRun).toBeNull()
  })

  it('ignores a run history that found nothing', () => {
    save('writer', run({ writes: [SILVER], observed: { ...observed(), available: false } }))
    expect(answersFor({ table: 'customers' }).lastRealRun).toBeNull()
  })

  it('spots code edited since the run executed', () => {
    const last = {
      submittedAt: '2026-08-01T09:00:00Z',
      codeChangedAt: '2026-08-02T09:00:00Z',
      state: 'success',
      submitter: '',
      via: 'writer',
    }
    // The most confidently wrong thing this panel could say is "succeeded"
    // about code that no longer exists.
    expect(codeChangedSinceRun(last)).toBe(true)
    expect(codeChangedSinceRun({ ...last, codeChangedAt: '' })).toBe(false)
  })
})
