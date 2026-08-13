// A single entity's comment — see model/comments.ts for why this is a
// reserved property rather than a new side table. Shares TagPanel's dialog
// skin (`.ms-backdrop`/`.imp-panel`), the viewer's own, not the browser's —
// see that file's header for why crossing stylesheets is the wrong fix.
import { useEffect, useRef, useState } from 'react'
import { buildIndex } from '../model/index'
import { commentOf, isCommentResolved } from '../model/comments'
import type { EntityId, LineageModel } from '../model/types'

export function CommentDialog({
  model,
  entityId,
  onSubmit,
  onClose,
}: {
  model: LineageModel
  entityId: EntityId
  onSubmit: (comment: string, resolved: boolean) => void
  onClose: () => void
}) {
  const [comment, setComment] = useState(() => commentOf(model, entityId))
  const [resolved, setResolved] = useState(() => isCommentResolved(model, entityId))
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const name = buildIndex(model).entries.get(entityId)?.name ?? 'Entity'

  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  return (
    <div className="ms-backdrop" onMouseDown={onClose}>
      <div className="imp-panel tg-panel" onMouseDown={(e) => e.stopPropagation()}>
        <header className="imp-head">
          <h2 className="imp-title">Comment</h2>
          <span className="tg-subject">{name}</span>
          <button className="tg-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="tg-body">
          <textarea
            ref={inputRef}
            className="cm-textarea"
            rows={4}
            value={comment}
            placeholder="Context worth leaving here — why this is the way it is, what to use instead, who to ask…"
            onChange={(e) => setComment(e.target.value)}
          />
          {comment.trim() && (
            <label className="cm-resolved">
              <input type="checkbox" checked={resolved} onChange={(e) => setResolved(e.target.checked)} />
              Resolved — addressed, kept for the record rather than deleted
            </label>
          )}
        </div>

        <footer className="tg-foot">
          <button className="imp-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="imp-btn primary" onClick={() => onSubmit(comment, resolved)}>
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}
