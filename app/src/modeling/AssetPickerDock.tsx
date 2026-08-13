// "Bind asset" — ADR-0004's entry point from Modeling mode, not Explore.
//
// A read-only browse of the same Fabric tree Explore shows (workspaces →
// lakehouses → tables → columns), trimmed to just what picking an asset
// needs: no notebooks, no pipelines, no sandbox integration. Picking a table
// or column hands its AssetRef back to the Model Viewer, which then arms
// "click something on the canvas to bind it" — see ModelViewer's `binding`
// state and the `mv-status` bar.
import { useEffect, useState } from 'react'
import {
  fabricErrorKind,
  fetchFabricItems,
  fetchFabricTableSchema,
  fetchFabricTables,
  fetchFabricWorkspaces,
  type FabricColumn,
  type FabricItem,
  type FabricTable,
  type FabricWorkspace,
} from '../fabric/api'
import type { AssetRef } from '../model/assets'

type Async<T> = { status: 'loading' | 'error' | 'ok'; data?: T; error?: string }

function useAsync<T>(fn: () => Promise<T>, deps: unknown[], enabled = true): Async<T> {
  const [state, setState] = useState<Async<T>>({ status: 'loading' })
  useEffect(() => {
    if (!enabled) return
    let alive = true
    setState({ status: 'loading' })
    fn()
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch((e: unknown) => {
        if (!alive) return
        const message =
          fabricErrorKind(e) === 'not-wired'
            ? 'Fabric is not wired up — see docs/fabric-toolkit-wiring.md.'
            : e instanceof Error
              ? e.message
              : String(e)
        setState({ status: 'error', error: message })
      })
    return () => {
      alive = false
    }
    // `enabled` is a real dependency, not just `deps` — leaving it out (a
    // bug caught after shipping) means expanding a branch after mount never
    // re-runs the effect, and the row shows "Loading…" forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is the caller's contract
  }, [...deps, enabled])
  return state
}

function Note({ state }: { state: Async<unknown> }) {
  if (state.status === 'loading') return <div className="ap-note">Loading…</div>
  if (state.status === 'error') return <div className="ap-note" data-error="true">{state.error}</div>
  return null
}

export function AssetPickerDock({
  onPick,
  onClose,
}: {
  onPick: (ref: AssetRef, label: string, level: 'table' | 'column') => void
  onClose: () => void
}) {
  const workspaces = useAsync(() => fetchFabricWorkspaces(), [])
  const [openWs, setOpenWs] = useState<string | null>(null)

  return (
    <aside className="vw-panel ap-panel" aria-label="Bind asset">
      <header className="vw-head">
        <h2 className="vw-title">Bind asset</h2>
        <button className="tg-x" onClick={onClose} aria-label="Close bind asset">
          ×
        </button>
      </header>
      <div className="vw-body ap-body">
        <p className="ap-hint">
          Pick a table or column, then click something on the canvas to bind it there.
        </p>
        <Note state={workspaces} />
        {workspaces.status === 'ok' && workspaces.data!.length === 0 && (
          <p className="ap-note">No workspaces visible.</p>
        )}
        <ul className="ap-tree" role="tree">
          {workspaces.status === 'ok' &&
            workspaces.data!.map((ws) => (
              <WorkspaceNode
                key={ws.id}
                workspace={ws}
                open={openWs === ws.id}
                onToggle={() => setOpenWs((cur) => (cur === ws.id ? null : ws.id))}
                onPick={onPick}
              />
            ))}
        </ul>
      </div>
    </aside>
  )
}

function WorkspaceNode({
  workspace,
  open,
  onToggle,
  onPick,
}: {
  workspace: FabricWorkspace
  open: boolean
  onToggle: () => void
  onPick: (ref: AssetRef, label: string, level: 'table' | 'column') => void
}) {
  const items = useAsync(() => fetchFabricItems(workspace.id), [workspace.id], open)
  return (
    <li role="treeitem" aria-expanded={open}>
      <button className="ap-row ap-row--branch" onClick={onToggle}>
        <Chevron open={open} />
        {workspace.name}
      </button>
      {open && (
        <ul>
          <Note state={items} />
          {items.status === 'ok' && items.data!.lakehouses.length === 0 && (
            <li className="ap-note">No lakehouses.</li>
          )}
          {items.status === 'ok' &&
            items.data!.lakehouses.map((lh) => (
              <LakehouseNode key={lh.id} workspaceId={workspace.id} lakehouse={lh} onPick={onPick} />
            ))}
        </ul>
      )}
    </li>
  )
}

function LakehouseNode({
  workspaceId,
  lakehouse,
  onPick,
}: {
  workspaceId: string
  lakehouse: FabricItem
  onPick: (ref: AssetRef, label: string, level: 'table' | 'column') => void
}) {
  const [open, setOpen] = useState(false)
  const tables = useAsync(() => fetchFabricTables(workspaceId, lakehouse.id), [workspaceId, lakehouse.id], open)
  return (
    <li role="treeitem" aria-expanded={open}>
      <button className="ap-row ap-row--branch" onClick={() => setOpen((o) => !o)}>
        <Chevron open={open} />
        {lakehouse.name}
      </button>
      {open && (
        <ul>
          <Note state={tables} />
          {tables.status === 'ok' && tables.data!.length === 0 && <li className="ap-note">No tables.</li>}
          {tables.status === 'ok' &&
            tables.data!.map((t) => (
              <TableNode
                key={t.name}
                workspaceId={workspaceId}
                lakehouseId={lakehouse.id}
                table={t}
                onPick={onPick}
              />
            ))}
        </ul>
      )}
    </li>
  )
}

function TableNode({
  workspaceId,
  lakehouseId,
  table,
  onPick,
}: {
  workspaceId: string
  lakehouseId: string
  table: FabricTable
  onPick: (ref: AssetRef, label: string, level: 'table' | 'column') => void
}) {
  const [open, setOpen] = useState(false)
  const schema = useAsync<FabricColumn[]>(
    () => fetchFabricTableSchema(workspaceId, lakehouseId, table.name),
    [workspaceId, lakehouseId, table.name],
    open,
  )
  const ref: AssetRef = { workspaceId, itemId: lakehouseId, table: table.name }

  return (
    <li role="treeitem" aria-expanded={open}>
      <div className="ap-row ap-row--table">
        <button className="ap-toggle" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Collapse' : 'Expand'}>
          <Chevron open={open} />
        </button>
        <span className="ap-label">{table.name}</span>
        <button className="ap-pick" onClick={() => onPick(ref, table.name, 'table')}>
          Pick table
        </button>
      </div>
      {open && (
        <ul>
          <Note state={schema} />
          {schema.status === 'ok' && schema.data!.length === 0 && <li className="ap-note">No columns.</li>}
          {schema.status === 'ok' &&
            schema.data!.map((col) => (
              <li key={col.name} role="treeitem" className="ap-row ap-row--column">
                <span className="ap-label">{col.name}</span>
                <button
                  className="ap-pick"
                  onClick={() => onPick({ ...ref, column: col.name }, `${table.name}.${col.name}`, 'column')}
                >
                  Pick column
                </button>
              </li>
            ))}
        </ul>
      )}
    </li>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden className="ap-chevron" data-open={open || undefined}>
      <path d="M4 2.5 8 6l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
