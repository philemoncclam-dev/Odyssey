// /products/history — the catalog's audit trail: who published, rebound, or
// unpublished what, and when. Read-only; nothing here can be undone from
// this screen — that would need restoring a specific classification, which
// the log doesn't keep enough of to do safely (see catalog/history.ts).
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { catalogHistory, type CatalogHistoryEntry } from '../../catalog/history'

export const Route = createFileRoute('/products/history')({
  component: HistoryView,
})

const exact = (ms: number) => new Date(ms).toLocaleString()

const ACTION_LABEL: Record<CatalogHistoryEntry['action'], string> = {
  published: 'Published',
  republished: 'Republished',
  unpublished: 'Unpublished',
}

function HistoryView() {
  const [entries, setEntries] = useState<CatalogHistoryEntry[] | null>(null)

  useEffect(() => {
    void catalogHistory().then(setEntries)
  }, [])

  return (
    <>
      <header className="pc-head">
        <h1>History</h1>
        <p className="pc-sub">Every publish, rebind, and unpublish in the catalog, newest first.</p>
      </header>

      {entries === null ? (
        <p className="pc-empty">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="pc-empty">Nothing published yet — see the log fill in once something is.</p>
      ) : (
        <ul className="pc-list">
          {entries.map((h) => (
            <li key={h.id} className="pc-row">
              <div className="pc-history-row">
                <span className="pc-history-action" data-action={h.action}>
                  {ACTION_LABEL[h.action]}
                </span>
                <Link className="pc-row-name" to="/model/$modelId" params={{ modelId: h.modelId }}>
                  {h.name}
                </Link>
                <span className="pc-history-meta">
                  {h.by ?? 'someone'} · {exact(h.at)}
                </span>
              </div>
              {h.summary && <p className="pc-row-desc">{h.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
