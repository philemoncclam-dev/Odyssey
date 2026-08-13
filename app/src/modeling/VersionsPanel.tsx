// Snapshot history: save a version, see what changed, put one back.
//
// The store has had `saveVersion` / `listVersions` / `getVersion` since it was
// written, fully working and tested, and nothing ever called them — the whole
// feature was unreachable from the app. This is the missing half.
//
// Restoring is the dangerous bit and shapes the panel. It overwrites the model
// you have open, so a version is never restored from the list directly: you
// select one, read what restoring would change (`diffVersions`, phrased from
// the point of view of the model you are holding), and confirm. Undo covers it
// afterwards — restore goes through the same `onChange` every edit does — but a
// diff read beforehand is worth more than an undo discovered afterwards.
//
// Shares the Views dock's frame (.vw-panel), like the Properties dock does: two
// panels in the same slot that looked different would read as two places.
import { useEffect, useState } from 'react'
import {
  MAIN,
  checkout,
  commit,
  createBranch,
  currentBranch,
  getSnapshot,
  listBranches,
  listSnapshots,
  mergeBranch,
  type Branch,
  type MergeOutcome,
  type SnapshotMeta,
} from '../model/history'
import { localStore } from '../model/store'
import { diffHeadline, diffVersions, type VersionDiff } from '../model/versionDiff'
import type { LineageModel } from '../model/types'

type VersionMeta = SnapshotMeta

export function VersionsPanel({
  model,
  onRestore,
  onCheckout,
  onDiffPreview,
  onClose,
}: {
  model: LineageModel
  /** Hands back the snapshot's graph; the caller applies it as one edit. */
  onRestore: (restored: LineageModel) => void
  /**
   * Same shape as `onRestore`, but for switching branches — which is not a
   * destructive act and should not close the panel you are working in. The
   * caller keeps both on the same undo path.
   */
  onCheckout?: (loaded: LineageModel) => void
  /**
   * The diff being examined, so the canvas can paint it — added entities
   * exist on the live model already and can be coloured directly; removed
   * ones only exist in the snapshot and stay text-only below. Fires with
   * `null` whenever nothing is being examined any more.
   */
  onDiffPreview?: (diff: VersionDiff | null) => void
  onClose: () => void
}) {
  const [versions, setVersions] = useState<VersionMeta[]>([])
  const [label, setLabel] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** The version being examined, with the diff against what is on screen. */
  const [preview, setPreview] = useState<{ meta: VersionMeta; diff: VersionDiff } | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [branch, setBranch] = useState<string>(MAIN)
  /** Non-null while naming a new branch — the input is not always on screen. */
  const [newBranch, setNewBranch] = useState<string | null>(null)
  const [merge, setMerge] = useState<(MergeOutcome & { source: string }) | null>(null)

  const refresh = async () => {
    try {
      setVersions(await listSnapshots(model.id))
      setBranches(await listBranches(model.id))
      setBranch(await currentBranch(model.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  useEffect(() => {
    void refresh()
    // Reset when switching models — a preview of another model's snapshot is
    // a diff against the wrong thing, and a merge report belongs to the model
    // it was produced from.
    setPreview(null)
    onDiffPreview?.(null)
    setMerge(null)
    setNewBranch(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is recreated per render; model.id is the real input.
  }, [model.id])

  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      // Snapshot what is PERSISTED, so the open model has to be saved first or
      // the snapshot silently captures the previous state.
      await localStore.save(model)
      await commit(model.id, model, label.trim() || defaultLabel())
      setLabel('')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const addBranch = async (name: string) => {
    setBusy(true)
    setError(null)
    try {
      await createBranch(model.id, name)
      setNewBranch(null)
      setMerge(null)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const switchTo = async (name: string) => {
    setBusy(true)
    setError(null)
    try {
      // Commit-then-switch, not stash-then-switch: uncommitted work belongs to
      // the branch it was done on, and losing it to a dropdown would be the
      // worst possible surprise in a panel whose whole job is not losing work.
      await localStore.save(model)
      await commit(model.id, model, `Work in progress on ${branch}`)
      const loaded = await checkout(model.id, name)
      if (loaded) (onCheckout ?? onRestore)({ ...model, ...graphOf(loaded) })
      setPreview(null)
      onDiffPreview?.(null)
      setMerge(null)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const mergeInto = async (target: string) => {
    setBusy(true)
    setError(null)
    try {
      const outcome = await mergeBranch(model.id, branch, target)
      setMerge({ ...outcome, source: branch })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const examine = async (meta: VersionMeta) => {
    setError(null)
    try {
      const snapshot = await getSnapshot(model.id, meta.id)
      if (!snapshot) {
        setError('That version could no longer be read.')
        return
      }
      // `from` is the snapshot, `to` is what is open — so "added" means
      // "you added this since, and restoring takes it away".
      const diff = diffVersions(snapshot, model)
      setPreview({ meta, diff })
      onDiffPreview?.(diff)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const restore = async (meta: VersionMeta) => {
    setBusy(true)
    try {
      const snapshot = await getSnapshot(model.id, meta.id)
      if (!snapshot) {
        setError('That version could no longer be read.')
        return
      }
      // Keep the model's IDENTITY and its browser metadata; take only the
      // graph. Restoring must not rename the model or resurrect an old
      // description, and it must never change the id the route is on.
      onRestore({ ...model, ...graphOf(snapshot) })
      setPreview(null)
      onDiffPreview?.(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="vw-panel" aria-label="Version history">
      <header className="vw-head">
        <h2 className="vw-title">History</h2>
        {versions.length > 0 && <span className="vw-badge">{versions.length}</span>}
        <button className="tg-x" onClick={onClose} aria-label="Close version history">
          ×
        </button>
      </header>

      <div className="vw-body">
        {/* Branches sit above the save box because which branch you are on
            changes what saving means. Putting it below would let someone
            snapshot onto a branch they had not noticed they were on. */}
        <div className="vh-branch">
          <label className="vh-branch-label" htmlFor="vh-branch-select">
            Branch
          </label>
          <select
            id="vh-branch-select"
            className="vh-branch-select"
            value={branch}
            disabled={busy}
            onChange={(e) => void switchTo(e.target.value)}
          >
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
                {b.head ? '' : ' (empty)'}
              </option>
            ))}
          </select>
          <button
            className="vh-branch-new"
            onClick={() => setNewBranch('')}
            disabled={busy || newBranch !== null}
            aria-label="New branch"
            title="New branch"
          >
            +
          </button>
        </div>

        {newBranch !== null && (
          <div className="vh-save">
            <input
              className="vh-label"
              autoFocus
              value={newBranch}
              placeholder="Branch name…"
              onChange={(e) => setNewBranch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void addBranch(newBranch)
                if (e.key === 'Escape') setNewBranch(null)
              }}
              aria-label="New branch name"
            />
            <button onClick={() => void addBranch(newBranch)} disabled={busy}>
              Create
            </button>
          </div>
        )}

        {branch !== MAIN && (
          <button
            className="vh-merge"
            onClick={() => void mergeInto(MAIN)}
            disabled={busy}
          >
            Merge {branch} into {MAIN}
          </button>
        )}

        {merge && <MergeReport report={merge} />}

        <div className="vh-save">
          <input
            className="vh-label"
            value={label}
            placeholder="Name this version…"
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void save()
            }}
            aria-label="Version name"
          />
          <button onClick={() => void save()} disabled={busy}>
            Save
          </button>
        </div>

        {error && <p className="vh-error">{error}</p>}

        {versions.length === 0 ? (
          <p className="vh-empty">
            No versions yet. Saving one snapshots the whole model, so you can come back
            to it after a change you are not sure about.
          </p>
        ) : (
          <ul className="vh-list">
            {versions.map((v) => (
              <li key={v.id} className="vh-item" data-open={preview?.meta.id === v.id || undefined}>
                <button className="vh-item-main" onClick={() => void examine(v)}>
                  <span className="vh-item-label">{v.label}</span>
                  <span className="vh-item-when">{when(v.savedAt)}</span>
                </button>

                {/* The diff and the restore button appear together, never
                    apart: this is the one place in the app where a click
                    overwrites everything, and it should not be reachable
                    without having been shown what it costs. */}
                {preview?.meta.id === v.id && (
                  <div className="vh-diff">
                    <p className="vh-diff-line">{diffHeadline(preview.diff)}</p>
                    {!preview.diff.empty && (
                      <ul className="vh-diff-detail">
                        {preview.diff.added.slice(0, 5).map((e) => (
                          <li key={`a${e.id}`}>
                            <span data-change="add">+</span> {e.name} <em>{e.kind}</em> — restoring removes it
                          </li>
                        ))}
                        {preview.diff.removed.slice(0, 5).map((e) => (
                          <li key={`r${e.id}`}>
                            <span data-change="del">−</span> {e.name} <em>{e.kind}</em> — restoring brings it back
                          </li>
                        ))}
                        {preview.diff.renamed.slice(0, 5).map((e) => (
                          <li key={`n${e.id}`}>
                            <span data-change="mod">~</span> {e.was} → {e.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      className="vh-restore"
                      onClick={() => void restore(v)}
                      disabled={busy || preview.diff.empty}
                    >
                      {preview.diff.empty ? 'Nothing to restore' : 'Restore this version'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

/**
 * What a merge did, in words.
 *
 * Conflicts and warnings are shown together and never collapsed, because both
 * describe something the merge decided FOR you: a conflict took our side, a
 * warning dropped an edge or a reordering. Hiding either behind a toggle is how
 * a tool loses the trust that ADR-0002's whole review model is built on.
 */
function MergeReport({ report }: { report: MergeOutcome & { source: string } }) {
  const { conflicts, warnings, fastForward, source } = report
  return (
    <div className="vh-merge-report" role="status">
      <p className="vh-merge-line">
        {fastForward
          ? `Fast-forwarded — nothing had changed on ${MAIN}, so ${source} moved straight across.`
          : conflicts.length === 0
            ? `Merged ${source} into ${MAIN}.`
            : `Merged ${source} into ${MAIN} with ${conflicts.length} conflict${
                conflicts.length === 1 ? '' : 's'
              } — your side was kept.`}
      </p>
      {conflicts.length > 0 && (
        <ul className="vh-merge-detail">
          {conflicts.map((c) => (
            <li key={`${c.id}${c.field}`}>
              <strong>{c.name}</strong> <em>{c.kind}</em> — {describeConflict(c.field)}:{' '}
              kept <span data-change="mod">{c.ours ?? 'deleted'}</span>, discarded{' '}
              <span data-change="del">{c.theirs ?? 'deleted'}</span>
            </li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className="vh-merge-detail">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function describeConflict(field: string): string {
  if (field === 'name') return 'both sides renamed it'
  if (field === 'parent') return 'both sides moved it'
  if (field === 'deleted') return 'one side deleted it, the other edited it'
  return `both sides set ${field.replace('property:', '')}`
}

/** The graph, without the model's identity or browser metadata. */
function graphOf(m: LineageModel) {
  return {
    layers: m.layers,
    transitions: m.transitions,
    properties: m.properties,
    views: m.views,
  }
}

/** "3 Aug, 14:05" — a snapshot is found by when it was taken. */
function when(at: number): string {
  return new Date(at).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const defaultLabel = () => `Snapshot ${when(Date.now())}`
