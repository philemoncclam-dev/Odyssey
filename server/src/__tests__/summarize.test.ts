import { describe, expect, it } from 'vitest'
import { countGraph } from '../lib/summarize.js'

describe('countGraph', () => {
  it('counts layers, transitions, and every nested entity', () => {
    const data = {
      layers: [
        { objects: [{ children: [{ children: [{ children: [] }] }] }] },
        { objects: [] },
      ],
      transitions: [{}, {}, {}],
    }
    const s = countGraph(data)
    expect(s.layerCount).toBe(2)
    expect(s.transitionCount).toBe(3)
    // 2 layers + 1 object (the second layer has none) + 1 attribute + 1 nested attribute = 5
    expect(s.entityCount).toBe(5)
  })

  it('defaults to zero for an empty graph', () => {
    expect(countGraph({})).toEqual({ layerCount: 0, entityCount: 0, transitionCount: 0 })
  })
})
