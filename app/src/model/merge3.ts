// Three-way structural merge of two lineage models against a common base.
//
// ADR-0002 decision 5. Entities are matched by ID, never by name, so a rename
// on one side and a child added on the other are two independent facts rather
// than a conflict — the same property `versionDiff` already relies on.
//
// The merge is deliberately total: it always returns a model. Conflicts are
// reported alongside it with `ours` applied provisionally, so the UI can show
// a working graph while asking which side to keep (decision 7). A merge that
// refused to produce a result would leave the conflict UI with nothing to draw.

import type {
  Attribute,
  EntityId,
  EntityKind,
  Layer,
  LineageModel,
  ModelObject,
  PropertyBag,
  Transition,
} from './types'
import type { SavedView } from './views'

/** Parent key for entities that sit at the root (layers). */
const ROOT = '@root'

export interface MergeConflict {
  id: EntityId
  kind: EntityKind
  /** Entity name on our side, for display. */
  name: string
  /** `name`, `parent`, `deleted`, or `property:<key>`. */
  field: string
  ours: string | null
  theirs: string | null
}

export interface MergeResult {
  model: LineageModel
  conflicts: MergeConflict[]
  /** Losses and tie-breaks the user should be told about, in plain words. */
  warnings: string[]
}

interface Flat {
  kind: EntityKind
  name: string
  parent: EntityId | null
}

interface FlatModel {
  nodes: Map<EntityId, Flat>
  /** Ordered child ids, keyed by parent id (or ROOT). Order is display order. */
  order: Map<string, EntityId[]>
}

function flatten(model: LineageModel): FlatModel {
  const nodes = new Map<EntityId, Flat>()
  const order = new Map<string, EntityId[]>()
  const push = (parent: string, id: EntityId) => {
    const list = order.get(parent)
    if (list) list.push(id)
    else order.set(parent, [id])
  }

  const visitAttr = (attr: Attribute, parent: EntityId) => {
    nodes.set(attr.id, { kind: 'attribute', name: attr.name, parent })
    push(parent, attr.id)
    for (const child of attr.children) visitAttr(child, attr.id)
  }
  for (const layer of model.layers) {
    nodes.set(layer.id, { kind: 'layer', name: layer.name, parent: null })
    push(ROOT, layer.id)
    for (const obj of layer.objects) {
      nodes.set(obj.id, { kind: 'object', name: obj.name, parent: layer.id })
      push(layer.id, obj.id)
      for (const child of obj.children) visitAttr(child, obj.id)
    }
  }
  return { nodes, order }
}

type Pick<T> = { value: T; conflict: boolean }

/**
 * Field-level three-way choice. `ours` wins a genuine conflict provisionally,
 * which matters only for what the caller renders before the user chooses.
 */
function pick3<T>(base: T | undefined, ours: T, theirs: T, eq = Object.is): Pick<T> {
  if (eq(ours, theirs)) return { value: ours, conflict: false }
  if (base !== undefined && eq(ours, base)) return { value: theirs, conflict: false }
  if (base !== undefined && eq(theirs, base)) return { value: ours, conflict: false }
  return { value: ours, conflict: true }
}

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/**
 * Merges `ours` and `theirs`, both descended from `base`.
 *
 * The result carries our side's model metadata (id, name, tags): a merge is an
 * edit to our branch, not a new model, and the target's identity is the one
 * that survives.
 */
export function merge3(base: LineageModel, ours: LineageModel, theirs: LineageModel): MergeResult {
  const b = flatten(base)
  const o = flatten(ours)
  const t = flatten(theirs)
  const conflicts: MergeConflict[] = []
  const warnings: string[] = []

  // --- 1. Which entities survive, and with what fields ---

  const merged = new Map<EntityId, Flat>()
  const ids = new Set([...o.nodes.keys(), ...t.nodes.keys()])

  for (const id of ids) {
    const bn = b.nodes.get(id)
    const on = o.nodes.get(id)
    const tn = t.nodes.get(id)

    if (on && tn) {
      const name = pick3(bn?.name, on.name, tn.name)
      const parent = pick3(bn?.parent, on.parent, tn.parent)
      if (name.conflict) {
        conflicts.push({
          id,
          kind: on.kind,
          name: on.name,
          field: 'name',
          ours: on.name,
          theirs: tn.name,
        })
      }
      if (parent.conflict) {
        conflicts.push({
          id,
          kind: on.kind,
          name: on.name,
          field: 'parent',
          ours: on.parent,
          theirs: tn.parent,
        })
      }
      merged.set(id, { kind: on.kind, name: name.value, parent: parent.value })
      continue
    }

    // Present on one side only. Absent from base means the other side added it;
    // present in base means the other side deleted it.
    const side = on ?? tn!
    if (!bn) {
      merged.set(id, side)
      continue
    }
    // Deleted on one side. Unchanged on the surviving side -> honour the delete.
    const changed = side.name !== bn.name || side.parent !== bn.parent
    if (!changed) continue
    // Changed here, deleted there: a real conflict. Keep the entity rather than
    // the delete — an edit recovered by hand is cheaper than an edit lost.
    conflicts.push({
      id,
      kind: side.kind,
      name: side.name,
      field: 'deleted',
      // The `null` side is the one that deleted it.
      ours: on ? side.name : null,
      theirs: on ? null : side.name,
    })
    merged.set(id, side)
  }

  // --- 2. Child order per parent ---
  //
  // Ours first, then anything only theirs knows about, then base leftovers.
  // ADR-0002: order is presentation, ours wins a genuine reorder and we say so.
  // ponytail: theirs-only entities append to the end of their parent's list
  // rather than landing next to the neighbour they were added beside. Position
  // them properly if users complain about where merged columns show up.
  const childOrder = new Map<string, EntityId[]>()
  const parentKey = (id: EntityId) => merged.get(id)!.parent ?? ROOT
  for (const id of merged.keys()) {
    const key = parentKey(id)
    if (!childOrder.has(key)) childOrder.set(key, [])
  }
  const rank = (flat: FlatModel, key: string) => {
    const list = flat.order.get(key) ?? []
    return new Map(list.map((id, i) => [id, i]))
  }
  for (const [key, list] of childOrder) {
    const ourRank = rank(o, key)
    const theirRank = rank(t, key)
    const baseRank = rank(b, key)
    const members = [...merged.keys()].filter((id) => parentKey(id) === key)
    const inOurs = members.filter((id) => ourRank.has(id)).sort((x, y) => ourRank.get(x)! - ourRank.get(y)!)
    const rest = members.filter((id) => !ourRank.has(id))
    const inTheirs = rest.filter((id) => theirRank.has(id)).sort((x, y) => theirRank.get(x)! - theirRank.get(y)!)
    const leftover = rest.filter((id) => !theirRank.has(id)).sort((x, y) => (baseRank.get(x) ?? 0) - (baseRank.get(y) ?? 0))
    list.push(...inOurs, ...inTheirs, ...leftover)

    // Both sides reordered the same list, relative to base: ours won silently
    // unless we say otherwise.
    const common = members.filter((id) => ourRank.has(id) && theirRank.has(id) && baseRank.has(id))
    const seq = (r: Map<EntityId, number>) => [...common].sort((x, y) => r.get(x)! - r.get(y)!).join(',')
    const baseSeq = seq(baseRank)
    if (common.length > 1 && seq(ourRank) !== baseSeq && seq(theirRank) !== baseSeq && seq(ourRank) !== seq(theirRank)) {
      warnings.push(`Both sides reordered the same list — kept our order.`)
    }
  }

  // --- 3. Rebuild the tree ---
  //
  // Building down from the root drops orphans for free: an entity whose parent
  // did not survive is simply never visited.
  const childrenOf = (id: EntityId): EntityId[] => childOrder.get(id) ?? []
  const buildAttr = (id: EntityId): Attribute => ({
    id,
    name: merged.get(id)!.name,
    children: childrenOf(id).filter(kindIs('attribute')).map(buildAttr),
  })
  function kindIs(kind: EntityKind) {
    return (id: EntityId) => merged.get(id)?.kind === kind
  }
  const layers: Layer[] = childrenOf(ROOT)
    .filter(kindIs('layer'))
    .map((layerId) => ({
      id: layerId,
      name: merged.get(layerId)!.name,
      objects: childrenOf(layerId)
        .filter(kindIs('object'))
        .map(
          (objId): ModelObject => ({
            id: objId,
            name: merged.get(objId)!.name,
            children: childrenOf(objId).filter(kindIs('attribute')).map(buildAttr),
          }),
        ),
    }))

  // A cycle or a move that reparents an entity under its own descendant would
  // leave nodes unreachable from the root. Neither is producible by the editor
  // today, but a silent partial model is the worst possible failure here.
  const reachable = new Set<EntityId>()
  const walk = (nodes: { id: EntityId; children?: unknown[]; objects?: unknown[] }[]) => {
    for (const n of nodes) {
      reachable.add(n.id)
      walk((n.objects ?? n.children ?? []) as typeof nodes)
    }
  }
  walk(layers as unknown as { id: EntityId }[])
  const lost = [...merged.keys()].filter((id) => !reachable.has(id))
  if (lost.length > 0) {
    warnings.push(`${lost.length} entity/entities were dropped — their parent did not survive the merge.`)
  }

  // --- 4. Transitions ---
  //
  // Identity is the endpoint pair, matching `versionDiff`: an edge redrawn
  // between the same two entities is the same edge.
  const edgeKey = (tr: Transition) => `${tr.source} ${tr.target}`
  const edgeMap = (m: LineageModel) => new Map(m.transitions.map((tr) => [edgeKey(tr), tr]))
  const be = edgeMap(base)
  const oe = edgeMap(ours)
  const te = edgeMap(theirs)
  const transitions: Transition[] = []
  let dangling = 0
  for (const [key, tr] of [...oe, ...te]) {
    if (transitions.some((x) => edgeKey(x) === key)) continue
    const inOurs = oe.has(key)
    const inTheirs = te.has(key)
    const inBase = be.has(key)
    // Present on one side only and present in base means the other side deleted
    // it; a delete of an edge nobody touched is honoured without ceremony.
    if (inBase && !(inOurs && inTheirs)) continue
    if (!reachable.has(tr.source) || !reachable.has(tr.target)) {
      dangling += 1
      continue
    }
    transitions.push(tr)
  }
  if (dangling > 0) {
    warnings.push(
      `${dangling} transition(s) were dropped because an endpoint was deleted on the other side.`,
    )
  }

  // --- 5. Properties ---
  //
  // Field-level, per entity. Bags whose entity lost the merge are left alone:
  // ADR-0002 and types.ts both say property values outlive their entity.
  const properties: Record<EntityId, PropertyBag> = {}
  const propIds = new Set([...Object.keys(ours.properties), ...Object.keys(theirs.properties)])
  for (const id of propIds) {
    const bb = base.properties[id] ?? {}
    const ob = ours.properties[id] ?? {}
    const tb = theirs.properties[id] ?? {}
    const bag: PropertyBag = {}
    for (const key of new Set([...Object.keys(ob), ...Object.keys(tb)])) {
      const chosen = pick3(bb[key], ob[key], tb[key])
      if (chosen.conflict) {
        const node = merged.get(id)
        conflicts.push({
          id,
          kind: node?.kind ?? 'attribute',
          name: node?.name ?? id,
          field: `property:${key}`,
          ours: ob[key] ?? null,
          theirs: tb[key] ?? null,
        })
      }
      if (chosen.value !== undefined) bag[key] = chosen.value
    }
    if (Object.keys(bag).length > 0) properties[id] = bag
  }

  // --- 6. Saved views: union by view id, same rules ---
  const viewList = (m: LineageModel) => new Map((m.views ?? []).map((v) => [v.id, v]))
  const bv = viewList(base)
  const ov = viewList(ours)
  const tv = viewList(theirs)
  const views: SavedView[] = []
  for (const id of new Set([...ov.keys(), ...tv.keys()])) {
    const ov1 = ov.get(id)
    const tv1 = tv.get(id)
    if (ov1 && tv1) {
      views.push(pick3(bv.get(id), ov1, tv1, sameJson).value)
    } else if (!bv.has(id)) {
      views.push((ov1 ?? tv1)!)
    } else if (!sameJson(ov1 ?? tv1, bv.get(id))) {
      views.push((ov1 ?? tv1)!) // edited here, deleted there — keep the edit
    }
  }

  const model: LineageModel = {
    ...ours,
    layers,
    transitions,
    properties,
    ...(ours.views !== undefined || theirs.views !== undefined ? { views } : {}),
    updatedAt: Date.now(),
  }

  return { model, conflicts, warnings }
}
