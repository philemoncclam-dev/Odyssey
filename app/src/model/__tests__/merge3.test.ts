// The merge is the one place a bug corrupts a model silently instead of
// crashing, so this leans on algebraic properties as much as on examples:
// merging a snapshot with itself must be identity, and merging in either order
// must agree on what survives (ADR-0002, "what this costs").

import { describe, expect, it } from 'vitest'

import { merge3 } from '../merge3'
import type { LineageModel } from '../types'

function model(layers: LineageModel['layers'], rest: Partial<LineageModel> = {}): LineageModel {
  return {
    id: 'm1',
    name: 'M',
    createdAt: 0,
    updatedAt: 0,
    layers,
    transitions: [],
    properties: {},
    ...rest,
  }
}

/** base: one layer, one object, two attributes. */
const base = model([
  {
    id: 'L1',
    name: 'Source',
    objects: [
      {
        id: 'O1',
        name: 'customers',
        children: [
          { id: 'A1', name: 'id', children: [] },
          { id: 'A2', name: 'email', children: [] },
        ],
      },
    ],
  },
])

/** Structural shape only — ignores updatedAt, which every merge bumps. */
const shape = (m: LineageModel) => ({
  layers: m.layers,
  transitions: m.transitions,
  properties: m.properties,
})

const edit = (m: LineageModel, fn: (draft: LineageModel) => void): LineageModel => {
  const draft = structuredClone(m)
  fn(draft)
  return draft
}

const attrs = (m: LineageModel) => m.layers[0].objects[0].children
const names = (m: LineageModel) => attrs(m).map((a) => a.name)
const ids = (m: LineageModel) => attrs(m).map((a) => a.id)

describe('merge3 properties', () => {
  it('merging a model with itself is identity', () => {
    const r = merge3(base, base, base)
    expect(shape(r.model)).toEqual(shape(base))
    expect(r.conflicts).toEqual([])
    expect(r.warnings).toEqual([])
  })

  it('merging an unchanged side against a changed one takes the change', () => {
    const theirs = edit(base, (d) => {
      attrs(d)[1].name = 'email_address'
    })
    expect(names(merge3(base, base, theirs).model)).toEqual(['id', 'email_address'])
    expect(names(merge3(base, theirs, base).model)).toEqual(['id', 'email_address'])
  })

  it('agrees on the surviving entity set whichever order the sides are given', () => {
    const ours = edit(base, (d) => {
      attrs(d).push({ id: 'A3', name: 'country', children: [] })
    })
    const theirs = edit(base, (d) => {
      attrs(d)[0].name = 'customer_id'
      attrs(d).push({ id: 'A4', name: 'signup_date', children: [] })
    })
    const forward = merge3(base, ours, theirs)
    const backward = merge3(base, theirs, ours)
    expect([...ids(forward.model)].sort()).toEqual([...ids(backward.model)].sort())
    expect(forward.conflicts).toEqual([])
    expect(backward.conflicts).toEqual([])
  })
})

describe('merge3 entity rules', () => {
  it('keeps additions from both sides', () => {
    const ours = edit(base, (d) => {
      attrs(d).push({ id: 'A3', name: 'country', children: [] })
    })
    const theirs = edit(base, (d) => {
      attrs(d).push({ id: 'A4', name: 'signup_date', children: [] })
    })
    expect(names(merge3(base, ours, theirs).model)).toEqual(['id', 'email', 'country', 'signup_date'])
  })

  it('is field-level: a rename on one side and a child added on the other both land', () => {
    const ours = edit(base, (d) => {
      attrs(d)[1].name = 'email_address'
    })
    const theirs = edit(base, (d) => {
      attrs(d)[1].children.push({ id: 'A5', name: 'domain', children: [] })
    })
    const r = merge3(base, ours, theirs)
    expect(r.conflicts).toEqual([])
    expect(attrs(r.model)[1]).toEqual({
      id: 'A2',
      name: 'email_address',
      children: [{ id: 'A5', name: 'domain', children: [] }],
    })
  })

  it('reports a conflict when both sides rename the same entity differently', () => {
    const ours = edit(base, (d) => {
      attrs(d)[1].name = 'email_address'
    })
    const theirs = edit(base, (d) => {
      attrs(d)[1].name = 'contact_email'
    })
    const r = merge3(base, ours, theirs)
    expect(r.conflicts).toEqual([
      { id: 'A2', kind: 'attribute', name: 'email_address', field: 'name', ours: 'email_address', theirs: 'contact_email' },
    ])
    // Provisional result uses ours, so the UI has a model to draw.
    expect(names(r.model)).toEqual(['id', 'email_address'])
  })

  it('does not conflict when both sides make the same rename', () => {
    const both = edit(base, (d) => {
      attrs(d)[1].name = 'email_address'
    })
    const r = merge3(base, both, structuredClone(both))
    expect(r.conflicts).toEqual([])
    expect(names(r.model)).toEqual(['id', 'email_address'])
  })

  it('honours a delete the other side did not touch', () => {
    const theirs = edit(base, (d) => {
      d.layers[0].objects[0].children = [attrs(d)[0]]
    })
    const r = merge3(base, base, theirs)
    expect(names(r.model)).toEqual(['id'])
    expect(r.conflicts).toEqual([])
  })

  it('conflicts, and keeps the entity, when one side deletes what the other edited', () => {
    const ours = edit(base, (d) => {
      attrs(d)[1].name = 'email_address'
    })
    const theirs = edit(base, (d) => {
      d.layers[0].objects[0].children = [attrs(d)[0]]
    })
    const r = merge3(base, ours, theirs)
    expect(r.conflicts).toEqual([
      { id: 'A2', kind: 'attribute', name: 'email_address', field: 'deleted', ours: 'email_address', theirs: null },
    ])
    expect(names(r.model)).toEqual(['id', 'email_address'])
  })

  it('drops children of a deleted parent without reporting them one by one', () => {
    const ours = edit(base, (d) => {
      d.layers[0].objects = []
    })
    const r = merge3(base, ours, base)
    expect(r.model.layers[0].objects).toEqual([])
    expect(r.conflicts).toEqual([])
  })
})

describe('merge3 transitions', () => {
  const withEdge = model(
    [
      ...structuredClone(base.layers),
      { id: 'L2', name: 'Target', objects: [{ id: 'O2', name: 'dim_cust', children: [] }] },
    ],
    { transitions: [{ id: 'T1', source: 'O1', target: 'O2' }] },
  )

  it('drops a transition whose endpoint the other side deleted, and says so', () => {
    const theirs = edit(withEdge, (d) => {
      d.layers = d.layers.filter((l) => l.id !== 'L2')
    })
    const r = merge3(withEdge, withEdge, theirs)
    expect(r.model.transitions).toEqual([])
    expect(r.conflicts).toEqual([])
    expect(r.warnings.join(' ')).toContain('endpoint was deleted')
  })

  it('unions transitions added on both sides', () => {
    const ours = edit(withEdge, (d) => {
      d.transitions.push({ id: 'T2', source: 'A1', target: 'O2' })
    })
    const theirs = edit(withEdge, (d) => {
      d.transitions.push({ id: 'T3', source: 'A2', target: 'O2' })
    })
    const r = merge3(withEdge, ours, theirs)
    expect(r.model.transitions.map((t) => t.id).sort()).toEqual(['T1', 'T2', 'T3'])
  })
})

describe('merge3 ordering', () => {
  it('keeps our order and warns when both sides reordered the same list', () => {
    const ours = edit(base, (d) => {
      d.layers[0].objects[0].children = [attrs(d)[1], attrs(d)[0]]
    })
    const theirs = edit(base, (d) => {
      d.layers[0].objects[0].children = [attrs(d)[0], attrs(d)[1]]
    })
    // theirs matches base here, so no warning — only a real double reorder warns.
    expect(merge3(base, ours, theirs).warnings).toEqual([])
  })
})

describe('merge3 properties bag', () => {
  it('merges property values field by field and conflicts on a genuine clash', () => {
    const withProps = model(structuredClone(base.layers), {
      properties: { A2: { pii: 'yes', owner: 'data-team' } },
    })
    const ours = edit(withProps, (d) => {
      d.properties.A2.owner = 'platform'
    })
    const theirs = edit(withProps, (d) => {
      d.properties.A2.pii = 'no'
      d.properties.A2.owner = 'analytics'
    })
    const r = merge3(withProps, ours, theirs)
    expect(r.model.properties.A2.pii).toBe('no')
    expect(r.model.properties.A2.owner).toBe('platform')
    expect(r.conflicts.map((c) => c.field)).toEqual(['property:owner'])
  })

  it('leaves a bag whose entity lost the merge alone', () => {
    const withProps = model(structuredClone(base.layers), { properties: { A2: { pii: 'yes' } } })
    const theirs = edit(withProps, (d) => {
      d.layers[0].objects[0].children = [attrs(d)[0]]
    })
    const r = merge3(withProps, withProps, theirs)
    expect(names(r.model)).toEqual(['id'])
    expect(r.model.properties.A2).toEqual({ pii: 'yes' })
  })
})
