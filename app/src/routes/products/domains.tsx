// /products/domains — the catalog grouped by domain, in taxonomy order so a
// nested domain (a domain under a domain) renders indented under its parent
// rather than as an unrelated flat group. An entry appears under the exact
// node it was published to, not duplicated into every ancestor.
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CatalogList } from '../../products/CatalogList'
import { useCatalog } from '../../products/useCatalog'
import { flattenTaxonomy } from '../../catalog/taxonomy'
import { matchesCatalogQuery } from '../../catalog/search'

export const Route = createFileRoute('/products/domains')({
  component: DomainsView,
})

function DomainsView() {
  const { entries, reload, unpublish } = useCatalog()
  const [query, setQuery] = useState('')

  const filtered = (entries ?? []).filter((e) => matchesCatalogQuery(e, query))
  const groups = flattenTaxonomy()
    .map((node) => ({
      label: `${'—'.repeat(node.depth)} ${node.name}`.trim(),
      entries: filtered.filter((e) => e.domainPath.join('/') === node.path.join('/')),
    }))
    .filter((g) => g.entries.length > 0)

  return (
    <>
      <header className="pc-head">
        <h1>Domains</h1>
        <p className="pc-sub">Published models, grouped by the domain taxonomy — nested domains indent under their parent.</p>
      </header>
      <input
        className="pc-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, domain, product, application…"
        aria-label="Search the catalog"
      />
      {entries === null ? <p className="pc-empty">Loading…</p> : <CatalogList groups={groups} onUnpublish={unpublish} onChanged={reload} />}
    </>
  )
}
