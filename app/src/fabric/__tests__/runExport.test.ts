// Taking a run somewhere else. The rule these all protect: an export must not
// be a tidier document than the run it came from. If three tables had no
// lineage, the file says so.
import { describe, expect, it } from 'vitest'

import { columnLineageCsv, lineageGaps, runReportMarkdown } from '../runExport'
import type { SandboxRunResult } from '../api'
import type { Step, StepResult } from '../sequence'

const BRONZE = 'Analytics/lh_bronze/raw_customers'
const SILVER = 'Analytics/lh_silver/customers'

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
        column_lineage: [
          { to_table: SILVER, to_column: 'customer_id', from_table: BRONZE, from_column: 'id' },
        ],
        log: [],
        saw_credentials: false,
        error: null,
        ...over,
      },
    },
  ],
})

const results = (over: Partial<SandboxRunResult> = {}) => new Map([['k1', result(over)]])

describe('column lineage CSV', () => {
  it('writes a header and one row per flow', () => {
    const csv = columnLineageCsv([step], results())
    const [header, row] = csv.split('\n')
    expect(header).toBe('step,from_table,from_column,to_table,to_column,transform')
    expect(row).toBe(`nb_silver,${BRONZE},id,${SILVER},customer_id,`)
  })

  it('quotes a transform containing commas, which SQL routinely does', () => {
    // `concat(a, ', ', b)` unquoted turns one column into three and corrupts
    // every row after it.
    const csv = columnLineageCsv(
      [step],
      results({
        column_lineage: [
          {
            to_table: SILVER,
            to_column: 'label',
            from_table: BRONZE,
            from_column: 'name',
            transform: "concat(first, ', ', last)",
          },
        ],
      }),
    )
    expect(csv.split('\n')[1]).toContain('"concat(first, \', \', last)"')
  })

  it('escapes a quote inside a transform', () => {
    const csv = columnLineageCsv(
      [step],
      results({
        column_lineage: [
          { to_table: SILVER, to_column: 'c', from_table: BRONZE, from_column: 'n', transform: 'x = "y"' },
        ],
      }),
    )
    expect(csv).toContain('"x = ""y"""')
  })

  it('is just a header when nothing was resolved', () => {
    expect(columnLineageCsv([step], results({ column_lineage: [] })).split('\n')).toHaveLength(1)
  })
})

describe('markdown report', () => {
  it('names what ran, what it touched, and that nothing was executed', () => {
    const md = runReportMarkdown([step], results())
    expect(md).toContain('# Sandbox run')
    expect(md).toContain('**nb_silver** — ok')
    expect(md).toContain('raw_customers')
    // The caveat that keeps the whole document honest.
    expect(md).toContain('Nothing was executed against real Fabric')
  })

  it('carries the gaps, so the export is not a stronger claim than the run', () => {
    const md = runReportMarkdown([step], results({ column_lineage: [] }))
    expect(md).toContain('## Gaps')
    expect(md).toMatch(/customers/)
  })

  it('says so plainly when everything traced', () => {
    const md = runReportMarkdown([step], results())
    expect(md).toContain('Every table the run wrote has column-level lineage.')
  })

  it('reports a failed step rather than omitting it', () => {
    const failed: StepResult = { status: 'error', runs: [], error: 'boom' }
    expect(runReportMarkdown([step], new Map([['k1', failed]]))).toContain('error: boom')
  })
})

describe('the gaps worklist', () => {
  it('is empty when every written table has lineage', () => {
    expect(lineageGaps(results())).toEqual([])
  })

  it('lists a written table with no column lineage', () => {
    const gaps = lineageGaps(results({ column_lineage: [] }))
    expect(gaps.map((g) => g.ref)).toEqual([SILVER])
  })

  it('leaves out a table the run only read, whose columns are known', () => {
    // Not a gap: lineage is a property of what was written, and that table's
    // own lineage belongs to whatever wrote it. Listed, it would bury the
    // actionable rows under a normal state.
    const gaps = lineageGaps(results({ column_lineage: [] }))
    expect(gaps.map((g) => g.ref)).not.toContain(BRONZE)
  })

  it('puts a table with no schema above one that merely lacks lineage', () => {
    // A table whose schema would not resolve is the bigger problem, and
    // usually the cause of the others.
    const mixed = new Map([
      ['k1', result({ column_lineage: [], table_schemas: { [SILVER]: [{ name: 'customer_id' }] }, reads: [] })],
      [
        'k2',
        {
          status: 'ok' as const,
          runs: [
            {
              name: 'nb_gold',
              status: 'ok' as const,
              result: {
                ok: true,
                engine: 'stub' as const,
                cells: [],
                reads: [],
                writes: ['Analytics/lh_gold/ltv'],
                table_schemas: {},
                column_lineage: [],
                log: [],
                saw_credentials: false,
                error: null,
              },
            },
          ],
        },
      ],
    ])
    expect(lineageGaps(mixed).map((g) => g.level)).toEqual(['bare', 'columns-only'])
  })
})
