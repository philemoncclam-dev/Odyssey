// Shared rendering for all three catalog views — they differ only in how
// entries are grouped and filtered, not in how a group or a row looks.
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { taxonomyLabel } from '../catalog/taxonomy'
import type { CatalogEntry } from '../catalog/types'
import { PublishDialog } from './PublishDialog'

interface Group {
  label: string
  entries: CatalogEntry[]
}

interface Props {
  groups: Group[]
  onUnpublish: (entry: CatalogEntry) => void
  /** Refreshes the entry list — called after an edit is saved. */
  onChanged: () => void
}

const exact = (ms: number) => new Date(ms).toLocaleString()

export function CatalogList({ groups, onUnpublish, onChanged }: Props) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState<CatalogEntry | null>(null)

  if (groups.length === 0) {
    return <p className="pc-empty">Nothing published yet.</p>
  }

  return (
    <div className="pc-groups">
      {groups.map((group) => (
        <section key={group.label} className="pc-group">
          <h2 className="pc-group-title">
            {group.label} <span className="pc-group-count">{group.entries.length}</span>
          </h2>
          <ul className="pc-list">
            {group.entries.map((entry) => (
              <li key={entry.id} className="pc-row">
                <button
                  className="pc-row-name"
                  onClick={() => void navigate({ to: '/model/$modelId', params: { modelId: entry.modelId } })}
                >
                  {entry.name}
                </button>
                {entry.description && <p className="pc-row-desc">{entry.description}</p>}
                <div className="pc-row-meta">
                  <span title={taxonomyLabel(entry.domainPath)}>{taxonomyLabel(entry.domainPath)}</span>
                  <span>{entry.dataProduct}</span>
                  <span>{entry.application}</span>
                  {entry.owner && <span title="Who to ask about this">{entry.owner}</span>}
                  <span title={exact(entry.updatedAt)}>Published {exact(entry.publishedAt)}</span>
                </div>
                <div className="pc-row-actions">
                  <button className="pc-row-edit" onClick={() => setEditing(entry)}>
                    Edit…
                  </button>
                  <button className="pc-row-unpublish" onClick={() => onUnpublish(entry)}>
                    Unpublish
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {editing && (
        <PublishDialog
          modelId={editing.modelId}
          name={editing.name}
          initialDescription={editing.description}
          initialDomainPath={editing.domainPath}
          initialDataProduct={editing.dataProduct}
          initialApplication={editing.application}
          initialOwner={editing.owner}
          onClose={() => setEditing(null)}
          onPublished={() => {
            setEditing(null)
            onChanged()
          }}
        />
      )}
    </div>
  )
}
