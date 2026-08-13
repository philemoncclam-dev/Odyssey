// The one publish/edit flow — opened from a Model Browser row's menu, from
// /products/new (pick-a-model-first), or from a catalog row's "Edit…" to
// reclassify an already-published entry. Same dialog either way: it only
// needs a modelId/name and optional starting values, not a full model or
// entry object.
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { DATA_PRODUCTS, APPLICATIONS } from '../catalog/fixtures'
import { flattenTaxonomy } from '../catalog/taxonomy'
import { localCatalogStore } from '../catalog/store'
import { getCurrentUserEmail } from '../auth/currentUser'

interface Props {
  modelId: string
  name: string
  initialDescription?: string
  initialDomainPath?: string[]
  initialDataProduct?: string
  initialApplication?: string
  initialOwner?: string
  onPublished: () => void
  onClose: () => void
}

export function PublishDialog({
  modelId,
  name,
  initialDescription = '',
  initialDomainPath = [],
  initialDataProduct = DATA_PRODUCTS[0] ?? '',
  initialApplication = APPLICATIONS[0] ?? '',
  initialOwner = getCurrentUserEmail() ?? '',
  onPublished,
  onClose,
}: Props) {
  const editing = initialDomainPath.length > 0
  const [domainPath, setDomainPath] = useState(initialDomainPath.join('/'))
  const [dataProduct, setDataProduct] = useState(initialDataProduct)
  const [application, setApplication] = useState(initialApplication)
  const [owner, setOwner] = useState(initialOwner)
  const [description, setDescription] = useState(initialDescription)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const taxonomy = useMemo(() => flattenTaxonomy(), [])
  const nameRef = useRef<HTMLSelectElement | null>(null)
  const domainId = useId()
  const productId = useId()
  const appId = useId()
  const ownerId = useId()
  const descId = useId()

  useEffect(() => nameRef.current?.focus(), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async () => {
    if (!domainPath) {
      setError('Choose a domain.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await localCatalogStore.publish({
        modelId,
        name,
        description,
        domainPath: domainPath.split('/'),
        dataProduct,
        application,
        owner: owner.trim(),
        publishedBy: getCurrentUserEmail(),
      })
      onPublished()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  return (
    <div className="pc-backdrop" onMouseDown={onClose}>
      <div
        className="pc-dialog"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={editing ? 'Edit catalog classification' : 'Publish to catalog'}
      >
        <header className="pc-dialog-head">
          <h2>{editing ? 'Edit classification' : 'Publish to catalog'}</h2>
          <button className="pc-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="pc-dialog-body">
          <p className="pc-lede">{name}</p>

          <label className="pc-field-label" htmlFor={domainId}>
            Domain
          </label>
          <select
            id={domainId}
            ref={nameRef}
            className="pc-input"
            value={domainPath}
            onChange={(e) => setDomainPath(e.target.value)}
          >
            <option value="" disabled>
              Choose a domain…
            </option>
            {taxonomy.map((node) => (
              <option key={node.id} value={node.path.join('/')}>
                {'—'.repeat(node.depth)} {node.name}
              </option>
            ))}
          </select>

          <label className="pc-field-label" htmlFor={productId}>
            Data product
          </label>
          <select
            id={productId}
            className="pc-input"
            value={dataProduct}
            onChange={(e) => setDataProduct(e.target.value)}
          >
            {DATA_PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label className="pc-field-label" htmlFor={appId}>
            Application
          </label>
          <select
            id={appId}
            className="pc-input"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          >
            {APPLICATIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <label className="pc-field-label" htmlFor={ownerId}>
            Owner <span className="pc-optional">who to ask about this</span>
          </label>
          <input
            id={ownerId}
            className="pc-input"
            value={owner}
            placeholder="a name, an email, a team"
            onChange={(e) => setOwner(e.target.value)}
          />

          <label className="pc-field-label" htmlFor={descId}>
            Description <span className="pc-optional">optional</span>
          </label>
          <textarea
            id={descId}
            className="pc-input pc-textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="pc-error">{error}</p>}
        </div>

        <footer className="pc-dialog-foot">
          <button className="pc-btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="pc-btn primary" onClick={() => void submit()} disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save' : 'Publish'}
          </button>
        </footer>
      </div>
    </div>
  )
}
