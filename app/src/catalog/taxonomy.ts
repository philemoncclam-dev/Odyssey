// The domain taxonomy — an enterprise-provided hierarchy in reality, a fixture
// here until that source is wired (same shape as auth/mockWorkspaces.ts).
// The tree itself lives in organization.config.ts — the one file to edit for
// a real deployment; nothing else in the catalog reads anything but node
// ids, names, and nesting.
import { DOMAIN_TAXONOMY } from '../organization.config'
import type { TaxonomyNode } from './types'

export const TAXONOMY: TaxonomyNode[] = DOMAIN_TAXONOMY

/** A node flattened into the path of ids from the taxonomy root down to it. */
export interface FlatNode {
  id: string
  name: string
  depth: number
  path: string[]
}

/** Every node, depth-first, each carrying its full path from the root. */
export function flattenTaxonomy(nodes: TaxonomyNode[] = TAXONOMY): FlatNode[] {
  const out: FlatNode[] = []
  const walk = (list: TaxonomyNode[], depth: number, parents: string[]) => {
    for (const node of list) {
      const path = [...parents, node.id]
      out.push({ id: node.id, name: node.name, depth, path })
      if (node.children?.length) walk(node.children, depth + 1, path)
    }
  }
  walk(nodes, 0, [])
  return out
}

/** The node at the end of a path, or null if the path doesn't resolve. */
export function findTaxonomyNode(path: string[], nodes: TaxonomyNode[] = TAXONOMY): TaxonomyNode | null {
  let level = nodes
  let node: TaxonomyNode | null = null
  for (const id of path) {
    const next = level.find((n) => n.id === id)
    if (!next) return null
    node = next
    level = next.children ?? []
  }
  return node
}

/** "Sales / EMEA / Retail" — for display, given a path of ids. */
export function taxonomyLabel(path: string[]): string {
  const flat = flattenTaxonomy()
  const byId = new Map(flat.map((f) => [f.id, f.name]))
  return path.map((id) => byId.get(id) ?? id).join(' / ')
}
