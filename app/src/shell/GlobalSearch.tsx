// Cmd+K's fallback when nothing on screen claims it (searchBridge.ts) — one
// search across every model and every catalog entry, from anywhere in the
// app. A page that registers its own handler (Model Browser's search box,
// eventually Explore's) still wins; this only fires where nothing did.
//
// Built on `cmdk`, already a dependency and unused since the old palette
// that searched a remote Fabric catalog was removed (see AppShell's note) —
// its filtering, keyboard nav, and focus trap are exactly what this needs,
// so this is that same library aimed at what still exists to search.
import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from '@tanstack/react-router'
import { activeStore as localStore } from '../model/wiring'
import { localCatalogStore } from '../catalog/store'
import { taxonomyLabel } from '../catalog/taxonomy'
import type { ModelSummary } from '../model/types'
import type { CatalogEntry } from '../catalog/types'
import './globalSearch.css'

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [models, setModels] = useState<ModelSummary[]>([])
  const [entries, setEntries] = useState<CatalogEntry[]>([])

  useEffect(() => {
    if (!open) return
    void localStore.list().then(setModels)
    void localCatalogStore.list().then(setEntries)
  }, [open])

  const openModel = (modelId: string) => {
    onClose()
    void navigate({ to: '/model/$modelId', params: { modelId } })
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => !next && onClose()}
      label="Search models and the catalog"
      // `Command.Dialog` forwards `className` to the inner Command root, not
      // to Radix's Dialog.Content — these two props are how the actual
      // overlay/positioned box get styled.
      overlayClassName="gs-overlay"
      contentClassName="gs-content"
      className="gs-root"
      shouldFilter
    >
      <Command.Input autoFocus placeholder="Search models and the catalog…" className="gs-input" />
      <Command.List className="gs-list">
        <Command.Empty className="gs-empty">No matches.</Command.Empty>

        {models.length > 0 && (
          <Command.Group heading="Models" className="gs-group">
            {models.map((m) => (
              <Command.Item
                key={m.id}
                // cmdk filters on `value` — folding in the description lets
                // "customer" find a model whose name doesn't say it but
                // whose description does.
                value={`${m.name} ${m.description}`}
                onSelect={() => openModel(m.id)}
                className="gs-item"
              >
                <span className="gs-item-name">{m.name}</span>
                {m.description && <span className="gs-item-desc">{m.description}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {entries.length > 0 && (
          <Command.Group heading="Catalog" className="gs-group">
            {entries.map((e) => (
              <Command.Item
                key={e.id}
                value={`${e.name} ${e.dataProduct} ${e.application} ${e.owner} ${taxonomyLabel(e.domainPath)}`}
                onSelect={() => openModel(e.modelId)}
                className="gs-item"
              >
                <span className="gs-item-name">{e.name}</span>
                <span className="gs-item-desc">
                  {e.dataProduct} · {e.application}
                  {e.owner ? ` · ${e.owner}` : ''}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  )
}
