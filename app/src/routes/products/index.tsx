// /products — the catalog grouped by data product.
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CatalogList } from '../../products/CatalogList'
import { useCatalog } from '../../products/useCatalog'
import { matchesCatalogQuery } from '../../catalog/search'
import type { CatalogEntry } from '../../catalog/types'

export const Route = createFileRoute('/products/')({
  component: ProductsView,
})

function ProductsView() {
  const { entries, reload, unpublish } = useCatalog()
  const [query, setQuery] = useState('')

  const filtered = (entries ?? []).filter((e) => matchesCatalogQuery(e, query))
  const groups = Object.entries(
    filtered.reduce<Record<string, CatalogEntry[]>>((acc, e) => {
      ;(acc[e.dataProduct] ??= []).push(e)
      return acc
    }, {}),
  )
    .map(([label, list]) => ({ label, entries: list }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <>
      <header className="pc-head">
        <h1>Data products</h1>
        <p className="pc-sub">Published models, grouped by the data product they belong to.</p>
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
