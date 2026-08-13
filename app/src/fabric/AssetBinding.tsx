// ADR-0004's second half, on a real table in Explore: see every model that
// already contains it.
//
// The first half — appending this table to a model — moved to Modeling's own
// "Bind asset" tool (model/edit.ts's bindAssetToEntity, modeling/AssetPickerDock.tsx).
// Binding now targets an entity already on the canvas, which only makes sense
// from inside the canvas; this panel went from "browse Fabric, act on a
// model" to "browse Fabric, read about a model", and read-only is what is
// left here.

import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { assetUrn, modelBindsTable, type AssetRef } from '../model/assets'
import { localStore } from '../model/store'
import type { ModelSummary } from '../model/types'

export function AssetBinding({
  workspaceId,
  itemId,
  table,
}: {
  workspaceId: string
  itemId: string
  table: string
}) {
  const ref: AssetRef = { workspaceId, itemId, table }
  const urn = assetUrn(ref)

  const [containing, setContaining] = useState<ModelSummary[] | null>(null)

  useEffect(() => {
    let alive = true
    void (async () => {
      const all = await localStore.list()
      // Loading every model to answer this is fine at the scale localStorage
      // holds. It is exactly the query ADR-0003 says belongs in a projection
      // once there is a server — the shape of the answer does not change.
      const hits: ModelSummary[] = []
      for (const summary of all) {
        const model = await localStore.get(summary.id)
        if (model && modelBindsTable(model, urn)) hits.push(summary)
      }
      if (alive) setContaining(hits)
    })()
    return () => {
      alive = false
    }
  }, [urn])

  return (
    <section className="fx-bind">
      <h3>Models</h3>
      {containing === null ? (
        <p className="fx-answers-quiet">Checking…</p>
      ) : containing.length > 0 ? (
        <div className="fx-bind-grid">
          {containing.map((m) => (
            <Link key={m.id} to="/model/$modelId" params={{ modelId: m.id }} className="fx-bind-card">
              <strong className="fx-bind-card-name">{m.name}</strong>
              {m.description && <p className="fx-bind-card-desc">{m.description}</p>}
              <span className="fx-bind-card-stats">
                {m.layerCount} layer{m.layerCount === 1 ? '' : 's'} · {m.entityCount} entit
                {m.entityCount === 1 ? 'y' : 'ies'}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="fx-answers-quiet">
          No model references this table yet. Bind it from a model's canvas — Modeling mode's
          "Bind asset" tool — rather than from here.
        </p>
      )}
    </section>
  )
}
