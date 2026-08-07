// The two things ADR-0004 asked for, both on a real table in Explore:
//
//   1. append this table to a model, bound to the real asset;
//   2. see every model that already contains it.
//
// This is the join between the two halves of the app. Before it, Explore and
// your models were separate worlds — you could look at a real table, and you
// could draw a box called `customers`, and nothing connected the two.
//
// The binding goes one way only. A model that references a table still owns
// its own entities: nothing here is shared, so a rename in one model cannot
// reach into another. That is ADR-0004's central decision and the reason
// "link across models" is implemented as a reference out rather than as a
// shared entity.

import { useEffect, useState } from 'react'

import {
  assetUrn,
  boundObject,
  modelBindsTable,
  type AssetRef,
} from '../model/assets'
import { localStore } from '../model/store'
import type { LineageModel, ModelSummary } from '../model/types'

export function AssetBinding({
  workspaceId,
  itemId,
  table,
  columns,
}: {
  workspaceId: string
  itemId: string
  table: string
  columns: { name: string }[]
}) {
  const ref: AssetRef = { workspaceId, itemId, table }
  const urn = assetUrn(ref)

  const [models, setModels] = useState<ModelSummary[] | null>(null)
  const [containing, setContaining] = useState<ModelSummary[]>([])
  const [picking, setPicking] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const refresh = async () => {
    const all = await localStore.list()
    setModels(all)
    // Loading every model to answer this is fine at the scale localStorage
    // holds. It is exactly the query ADR-0003 says belongs in a projection
    // once there is a server — the shape of the answer does not change.
    const hits: ModelSummary[] = []
    for (const summary of all) {
      const model = await localStore.get(summary.id)
      if (model && modelBindsTable(model, urn)) hits.push(summary)
    }
    setContaining(hits)
  }

  useEffect(() => {
    void refresh()
    setNote(null)
    setPicking(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the asset is the input
  }, [urn])

  const appendTo = async (model: LineageModel) => {
    const layer = model.layers[0]
    if (!layer) {
      setNote('That model has no layers yet — add one first, then append here.')
      return
    }
    if (modelBindsTable(model, urn)) {
      // Not an error, and not silently duplicated either: ADR-0004 leaves
      // "may two entities bind the same asset" open, and the safe reading is
      // to say so and let the user decide.
      setNote(`${model.name} already contains this table.`)
      return
    }

    const object = boundObject(ref, columns, () => crypto.randomUUID())
    await localStore.save({
      ...model,
      layers: model.layers.map((l) =>
        l.id === layer.id ? { ...l, objects: [...l.objects, object] } : l,
      ),
    })
    setNote(`Added ${table} to ${model.name}, bound to the real table.`)
    setPicking(false)
    void refresh()
  }

  return (
    <section className="fx-bind">
      <div className="fx-bind-head">
        <h3>Models</h3>
        <button
          className="fx-btn"
          onClick={() => setPicking((v) => !v)}
          disabled={!models || models.length === 0}
          title={
            models && models.length === 0
              ? 'Create a model first'
              : 'Append this table to a model, bound to the real asset'
          }
        >
          {picking ? 'Cancel' : 'Add to a model'}
        </button>
      </div>

      {containing.length > 0 ? (
        <ul className="fx-bind-list">
          {containing.map((m) => (
            <li key={m.id}>
              <strong>{m.name}</strong>
              <span className="fx-answers-quiet"> contains this table</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fx-answers-quiet">
          No model references this table yet. Models that merely have a box with the same
          name do not count — a binding is to the asset, not to a display name.
        </p>
      )}

      {picking && models && (
        <ul className="fx-bind-list fx-bind-pick">
          {models.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => {
                  void localStore.get(m.id).then((model) => model && appendTo(model))
                }}
              >
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {note && (
        <p className="fx-bind-note" role="status">
          {note}
        </p>
      )}
    </section>
  )
}
