import { beforeEach, describe, expect, it } from 'vitest'
import { setFabricApi, type FabricColumn, type FabricTable } from '../api'
import { fetchSchemaBaseline } from '../schemaBaseline'

beforeEach(() => {
  setFabricApi({})
})

const LAKEHOUSE_TABLES: Record<string, FabricTable[]> = {
  'ws/lh_bronze': [{ name: 'raw_customers' }, { name: 'raw_orders' }],
}
const COLUMNS: Record<string, FabricColumn[]> = {
  'ws/lh_bronze/raw_customers': [{ name: 'id' }],
  'ws/lh_bronze/raw_orders': [{ name: 'order_id' }],
}

function install() {
  setFabricApi({
    async tables(workspaceId, lakehouseId) {
      return { items: LAKEHOUSE_TABLES[`${workspaceId}/${lakehouseId}`] ?? [] }
    },
    async tableSchema(workspaceId, lakehouseId, tableName) {
      const cols = COLUMNS[`${workspaceId}/${lakehouseId}/${tableName}`]
      if (!cols) throw new Error(`no fixture for ${tableName}`)
      return cols
    },
  })
}

describe('fetchSchemaBaseline', () => {
  it('walks every table in every lakehouse referenced, keyed by ref', async () => {
    install()
    const { schemas, unreadable } = await fetchSchemaBaseline(['ws/lh_bronze/raw_customers'])
    // `raw_orders` was never in the input refs directly, but it lives in the
    // SAME lakehouse — the whole point of the baseline is finding tables the
    // run never mentioned.
    expect([...schemas.keys()].sort()).toEqual(['ws/lh_bronze/raw_customers', 'ws/lh_bronze/raw_orders'])
    expect(schemas.get('ws/lh_bronze/raw_orders')).toEqual([{ name: 'order_id' }])
    expect(unreadable).toEqual([])
  })

  it('skips a file ref — there is no lakehouse schema for a raw file', async () => {
    install()
    const { schemas } = await fetchSchemaBaseline(['ws/lh_landing/Files/orders.csv'])
    expect(schemas.size).toBe(0)
  })

  it('records a table whose schema fetch fails, rather than dropping it silently', async () => {
    setFabricApi({
      async tables() {
        return { items: [{ name: 'raw_customers' }, { name: 'locked_table' }] }
      },
      async tableSchema(_ws, _lh, tableName) {
        if (tableName === 'locked_table') throw new Error('403')
        return [{ name: 'id' }]
      },
    })
    const { schemas, unreadable } = await fetchSchemaBaseline(['ws/lh_bronze/raw_customers'])
    expect(schemas.has('ws/lh_bronze/raw_customers')).toBe(true)
    expect(unreadable).toEqual(['ws/lh_bronze/locked_table'])
  })

  it('degrades to no baseline for a lakehouse whose table list now fails, without failing the rest', async () => {
    setFabricApi({
      async tables(_ws, lakehouseId) {
        if (lakehouseId === 'lh_gone') throw new Error('404')
        return { items: [{ name: 'raw_customers' }] }
      },
      async tableSchema() {
        return [{ name: 'id' }]
      },
    })
    const { schemas } = await fetchSchemaBaseline(['ws/lh_gone/x', 'ws/lh_bronze/raw_customers'])
    expect(schemas.has('ws/lh_bronze/raw_customers')).toBe(true)
    expect([...schemas.keys()].some((k) => k.includes('lh_gone'))).toBe(false)
  })

  it('never wired at all: degrades to an empty, non-throwing baseline', async () => {
    const baseline = await fetchSchemaBaseline(['ws/lh_bronze/raw_customers'])
    expect(baseline).toEqual({ schemas: new Map(), unreadable: [] })
  })
})
