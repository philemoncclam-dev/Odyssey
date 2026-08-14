// ponytail: duplicates app/src/model/store.ts's summarize()/countEntities()
// logic in a second runtime, because the frontend and this API are two
// separate npm packages with no shared package configured between them.
// Upgrade path if the two drift: a small `@odyssey/model-shape` package both
// import types and this function from, rather than hand-copying again.

interface RawEntity {
  children?: RawEntity[]
}
interface RawLayer {
  objects?: { children?: RawEntity[] }[]
}
interface RawData {
  layers?: RawLayer[]
  transitions?: unknown[]
}

function countChildren(entities: RawEntity[] | undefined): number {
  if (!entities) return 0
  let n = 0
  for (const e of entities) n += 1 + countChildren(e.children)
  return n
}

export interface GraphCounts {
  layerCount: number
  entityCount: number
  transitionCount: number
}

/** Counts derived from a model's graph — takes the parsed object directly, since Cosmos returns `data` as JSON already, not a string to re-parse. */
export function countGraph(data: RawData): GraphCounts {
  let entityCount = 0
  for (const layer of data.layers ?? []) {
    entityCount += 1
    for (const obj of layer.objects ?? []) {
      entityCount += 1 + countChildren(obj.children)
    }
  }
  return {
    layerCount: data.layers?.length ?? 0,
    entityCount,
    transitionCount: data.transitions?.length ?? 0,
  }
}
