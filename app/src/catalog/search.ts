import { taxonomyLabel } from './taxonomy'
import type { CatalogEntry } from './types'

/** Substring match across every field a catalog view groups or displays by. */
export function matchesCatalogQuery(entry: CatalogEntry, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    entry.name.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.dataProduct.toLowerCase().includes(q) ||
    entry.application.toLowerCase().includes(q) ||
    entry.owner.toLowerCase().includes(q) ||
    taxonomyLabel(entry.domainPath).toLowerCase().includes(q)
  )
}
