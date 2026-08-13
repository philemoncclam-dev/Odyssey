// /products/new — publish a model to the catalog. Pick one from Model
// Browser's list, then the same PublishDialog used from a model row's menu.
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { localStore } from '../../model/store'
import { localCatalogStore } from '../../catalog/store'
import { PublishDialog } from '../../products/PublishDialog'
import type { ModelSummary } from '../../model/types'
import type { CatalogEntry } from '../../catalog/types'

export const Route = createFileRoute('/products/new')({
  component: NewProductView,
})

function NewProductView() {
  const navigate = useNavigate()
  const [models, setModels] = useState<ModelSummary[] | null>(null)
  const [published, setPublished] = useState<Set<string>>(new Set())
  const [publishing, setPublishing] = useState<ModelSummary | null>(null)

  useEffect(() => {
    void Promise.all([localStore.list(), localCatalogStore.list()]).then(([m, entries]) => {
      setModels(m)
      setPublished(new Set(entries.map((e: CatalogEntry) => e.modelId)))
    })
  }, [])

  return (
    <>
      <header className="pc-head">
        <h1>Publish a model</h1>
        <p className="pc-sub">Choose a model to publish to the catalog under a domain, data product, and application.</p>
      </header>

      {models === null ? (
        <p className="pc-empty">Loading…</p>
      ) : models.length === 0 ? (
        <p className="pc-empty">No models yet — create one in Modeling first.</p>
      ) : (
        <ul className="pc-list">
          {models.map((model) => (
            <li key={model.id} className="pc-row">
              <span className="pc-row-name" style={{ cursor: 'default' }}>
                {model.name}
              </span>
              {model.description && <p className="pc-row-desc">{model.description}</p>}
              <button className="pc-btn primary" onClick={() => setPublishing(model)}>
                {published.has(model.id) ? 'Republish…' : 'Publish…'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {publishing && (
        <PublishDialog
          modelId={publishing.id}
          name={publishing.name}
          initialDescription={publishing.description}
          onClose={() => setPublishing(null)}
          onPublished={() => {
            setPublishing(null)
            void navigate({ to: '/products' })
          }}
        />
      )}
    </>
  )
}
