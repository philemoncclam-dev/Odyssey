// Asset identity, ADR-0004. The URN is the one string that has to stay stable
// forever — a binding that breaks when a workspace is renamed is worse than no
// binding, because it fails silently and looks like the table was removed.
import { describe, expect, it } from 'vitest'

import {
  assetUrn,
  bindingsIn,
  boundObject,
  modelBindsTable,
  parseAssetUrn,
  tableUrnOf,
} from '../assets'
import type { LineageModel } from '../types'

const WS = '11111111-1111-1111-1111-111111111111'
const ITEM = '22222222-2222-2222-2222-222222222222'

const model = (layers: LineageModel['layers']): LineageModel => ({
  id: 'm1',
  name: 'M',
  createdAt: 0,
  updatedAt: 0,
  layers,
  transitions: [],
  properties: {},
})

describe('the URN', () => {
  it('uses GUIDs, never display names', () => {
    // A renamed workspace must not break a binding, which rules out matching
    // on qualified name.
    expect(assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' })).toBe(
      `fabric://workspace/${WS}/item/${ITEM}/table/customers`,
    )
  })

  it('carries a schema when the source reported one', () => {
    expect(assetUrn({ workspaceId: WS, itemId: ITEM, schema: 'gold', table: 'customers' })).toBe(
      `fabric://workspace/${WS}/item/${ITEM}/table/gold.customers`,
    )
  })

  it('omits the schema rather than inventing dbo', () => {
    // Guessing would bake a fiction into the identity, and two screens would
    // then produce different URNs for the same table.
    expect(assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' })).not.toContain('dbo')
  })

  it('names a column after the hash', () => {
    expect(
      assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers', column: 'customer_id' }),
    ).toBe(`fabric://workspace/${WS}/item/${ITEM}/table/customers#customer_id`)
  })

  it('round-trips', () => {
    const ref = { workspaceId: WS, itemId: ITEM, schema: 'gold', table: 'customers', column: 'id' }
    expect(parseAssetUrn(assetUrn(ref))).toEqual(ref)
  })

  it('splits on the first dot, since a table name may contain one', () => {
    const parsed = parseAssetUrn(`fabric://workspace/${WS}/item/${ITEM}/table/gold.cust.v2`)
    expect(parsed).toMatchObject({ schema: 'gold', table: 'cust.v2' })
  })

  it('refuses something that is not one of ours', () => {
    expect(parseAssetUrn('kdb://whatever')).toBeNull()
    expect(parseAssetUrn(`fabric://workspace/${WS}/nonsense`)).toBeNull()
  })

  it('reduces a column binding to its table', () => {
    const column = assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers', column: 'id' })
    expect(tableUrnOf(column)).toBe(assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' }))
  })
})

describe('bindings in a model', () => {
  const built = boundObject(
    { workspaceId: WS, itemId: ITEM, table: 'customers' },
    [{ name: 'customer_id' }, { name: 'email' }],
    (() => {
      let n = 0
      return () => `id-${(n += 1)}`
    })(),
  )

  it('binds the table and each of its columns', () => {
    expect(built.name).toBe('customers')
    expect(built.assetRef).toBe(assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' }))
    expect(built.children.map((c) => c.assetRef)).toEqual([
      assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers', column: 'customer_id' }),
      assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers', column: 'email' }),
    ])
  })

  it('finds every bound entity, at both levels', () => {
    const found = bindingsIn(model([{ id: 'L1', name: 'Layer', objects: [built] }]))
    expect(found.map((b) => b.name)).toEqual(['customers', 'customer_id', 'email'])
  })

  it('answers "does this model contain that table"', () => {
    const m = model([{ id: 'L1', name: 'Layer', objects: [built] }])
    expect(modelBindsTable(m, assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' }))).toBe(
      true,
    )
  })

  it('counts a model that bound only a column as containing the table', () => {
    // "Who uses this table" means the table, however deep the binding went.
    const columnOnly = model([
      {
        id: 'L1',
        name: 'Layer',
        objects: [
          {
            id: 'o1',
            name: 'anything',
            children: [
              {
                id: 'a1',
                name: 'id',
                children: [],
                assetRef: assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers', column: 'id' }),
              },
            ],
          },
        ],
      },
    ])
    expect(
      modelBindsTable(columnOnly, assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' })),
    ).toBe(true)
  })

  it('does not count a box that merely shares the name', () => {
    // The whole point of an identity: `customers` drawn by hand is not the
    // real `customers`, and claiming it is would invent lineage.
    const named = model([
      { id: 'L1', name: 'Layer', objects: [{ id: 'o1', name: 'customers', children: [] }] },
    ])
    expect(modelBindsTable(named, assetUrn({ workspaceId: WS, itemId: ITEM, table: 'customers' })))
      .toBe(false)
  })

  it('does not confuse the same table name in another workspace', () => {
    const m = model([{ id: 'L1', name: 'Layer', objects: [built] }])
    const elsewhere = assetUrn({ workspaceId: 'other-ws', itemId: ITEM, table: 'customers' })
    expect(modelBindsTable(m, elsewhere)).toBe(false)
  })
})
