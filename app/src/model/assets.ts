// Asset identity — ADR-0004.
//
// An entity in a model is a thing someone drew. An ASSET is a real table in a
// real estate. Binding one to the other is what lets two models that both
// describe `lakehouse.gold.customers` be recognised as describing the same
// table, and it is what makes "which models contain this table" answerable at
// all.
//
// THE ENTITY STAYS MODEL-LOCAL. Nothing here makes entities shared: a bound
// entity is still owned by its model, still has its own id, and is still
// editable without touching anyone else's work. The binding is a reference OUT
// to the estate, not a merge — see ADR-0004's rejected alternative, where one
// shared entity referenced by many models made a rename in one model an edit
// to another.
//
// DISPLAY NAMES ARE NEVER THE IDENTITY. A renamed workspace must not break a
// binding, so the URN carries GUIDs everywhere Fabric gives them.

import type { Attribute, LineageModel, ModelObject } from './types'

/** The parts of a Fabric asset reference. */
export interface AssetRef {
  workspaceId: string
  itemId: string
  /** Schema name, when the source told us one. */
  schema?: string | undefined
  table: string
  /** Present on a column binding; absent on a table binding. */
  column?: string | undefined
}

const PREFIX = 'fabric://'

/**
 * Build the URN ADR-0004 specifies.
 *
 * The schema segment is OMITTED when unknown rather than defaulted to `dbo`.
 * The ADR writes `{schema}.{table}` because it assumes a source that reports a
 * schema, and Fabric's lakehouse table listing does not — inventing `dbo`
 * would bake a guess into the one string that has to stay stable forever, and
 * two bindings for the same table would then disagree depending on which
 * screen made them.
 */
export function assetUrn(ref: AssetRef): string {
  const table = ref.schema ? `${ref.schema}.${ref.table}` : ref.table
  const base = `${PREFIX}workspace/${ref.workspaceId}/item/${ref.itemId}/table/${table}`
  return ref.column ? `${base}#${ref.column}` : base
}

/** Parse a URN back into its parts, or null when it is not one of ours. */
export function parseAssetUrn(urn: string): AssetRef | null {
  if (!urn.startsWith(PREFIX)) return null
  const [path, column] = urn.slice(PREFIX.length).split('#')
  const parts = (path ?? '').split('/')
  if (parts.length !== 6 || parts[0] !== 'workspace' || parts[2] !== 'item' || parts[4] !== 'table') {
    return null
  }
  const [, workspaceId, , itemId, , qualified] = parts as [
    string, string, string, string, string, string,
  ]
  // Split on the FIRST dot only: a table name may contain one, a schema name
  // conventionally may not.
  const dot = qualified.indexOf('.')
  const schema = dot > 0 ? qualified.slice(0, dot) : undefined
  const table = dot > 0 ? qualified.slice(dot + 1) : qualified
  return {
    workspaceId,
    itemId,
    ...(schema ? { schema } : {}),
    table,
    ...(column ? { column } : {}),
  }
}

/** The table-level URN behind a column binding. Identity for "same table". */
export function tableUrnOf(urn: string): string {
  const hash = urn.indexOf('#')
  return hash < 0 ? urn : urn.slice(0, hash)
}

/** Every bound entity in a model, with the entity that carries the binding. */
export interface Binding {
  entityId: string
  name: string
  assetRef: string
}

export function bindingsIn(model: LineageModel): Binding[] {
  const out: Binding[] = []
  const visitAttribute = (attribute: Attribute) => {
    if (attribute.assetRef) {
      out.push({ entityId: attribute.id, name: attribute.name, assetRef: attribute.assetRef })
    }
    attribute.children.forEach(visitAttribute)
  }
  for (const layer of model.layers) {
    for (const object of layer.objects) {
      if (object.assetRef) {
        out.push({ entityId: object.id, name: object.name, assetRef: object.assetRef })
      }
      object.children.forEach(visitAttribute)
    }
  }
  return out
}

/**
 * Does this model reference that table?
 *
 * Compared at TABLE level, so a model that binds only a column still counts as
 * containing the table — which is what someone asking "who uses this table"
 * means. Comparison is on the URN, never on the display name.
 */
export function modelBindsTable(model: LineageModel, tableUrn: string): boolean {
  const wanted = tableUrnOf(tableUrn)
  return bindingsIn(model).some((b) => tableUrnOf(b.assetRef) === wanted)
}

/** Build a model object for a real table, with its columns bound. */
export function boundObject(
  ref: AssetRef,
  columns: { name: string }[],
  newId: () => string,
): ModelObject {
  return {
    id: newId(),
    name: ref.table,
    assetRef: assetUrn({ ...ref, column: undefined }),
    children: columns.map((column) => ({
      id: newId(),
      name: column.name,
      children: [],
      assetRef: assetUrn({ ...ref, column: column.name }),
    })),
  }
}
