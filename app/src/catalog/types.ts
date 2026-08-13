// The catalog — published models, browsable by domain taxonomy, data product,
// or application. Separate from `model/` the same way `model/` is separate
// from `modeling/`: this is the data shape and persistence, `products/` is
// the UI that reads it.
//
// A CatalogEntry is a REFERENCE to a model plus classification, not a copy of
// the model's graph. Publishing snapshots name/description at that moment
// (so the catalog reads sensibly even if the model is later renamed without
// being republished) but the live model stays the editable thing in Model
// Browser — publishing again just replaces this entry's snapshot.

/**
 * One node in the domain taxonomy. `children` lets a domain live under a
 * domain, without limit — see `catalog/taxonomy.ts` for the fixture tree.
 */
export interface TaxonomyNode {
  id: string
  name: string
  children?: TaxonomyNode[]
}

export interface CatalogEntry {
  id: string
  /** The model this entry publishes. One entry per model — publishing again updates it. */
  modelId: string
  /** Snapshot at publish time. */
  name: string
  description: string
  /** Taxonomy node ids from root to the assigned node, e.g. `['sales', 'sales-emea']`. */
  domainPath: string[]
  dataProduct: string
  application: string
  /**
   * Who to ask about this — a name, an email, a team. Defaults to whoever
   * published it, but is independently editable: the publisher is often not
   * who ends up fielding questions about a domain long-term.
   */
  owner: string
  /** Epoch ms of the first publish. Never changes on republish. */
  publishedAt: number
  /** Epoch ms of the most recent publish. */
  updatedAt: number
  /** Email of whoever published, when known. */
  publishedBy: string | null
}

export interface PublishInput {
  modelId: string
  name: string
  description: string
  domainPath: string[]
  dataProduct: string
  application: string
  owner: string
  publishedBy: string | null
}
