// A comment on a single entity — free text for context a teammate would want
// right where they'd look for it: "deprecated, use X instead", "confirmed
// with finance on 2026-03-01". Same reserved-property-key mechanism tags use
// (model/tags.ts) and for the same three reasons: the property bag is
// already the per-entity side table, already persisted, already survives a
// delete/restore, and the viewer already renders badges off properties.
import type { EntityId, LineageModel } from './types'

/** The reserved property key. Nothing else may write it. */
export const COMMENT_KEY = 'Comment'
/** Whether the comment has been addressed — a second reserved key, not a delete. */
export const COMMENT_RESOLVED_KEY = 'CommentResolved'

export function commentOf(model: LineageModel, id: EntityId): string {
  return model.properties[id]?.[COMMENT_KEY] ?? ''
}

export function isCommentResolved(model: LineageModel, id: EntityId): boolean {
  return model.properties[id]?.[COMMENT_RESOLVED_KEY] === 'true'
}

/**
 * Empty clears both keys entirely, matching setTags — an empty-string
 * property is noise in the manager, and a "resolved" flag with no comment
 * left to resolve is meaningless.
 *
 * `resolved` defaults to false on a brand NEW comment (editing the text
 * starts a fresh round, in effect) but is left untouched when the text is
 * merely being re-saved — see `setCommentResolved` for toggling it without
 * touching the text.
 */
export function setComment(model: LineageModel, id: EntityId, comment: string): LineageModel {
  const trimmed = comment.trim()
  const properties = { ...model.properties }
  const bag = { ...(properties[id] ?? {}) }
  if (trimmed) {
    bag[COMMENT_KEY] = trimmed
  } else {
    delete bag[COMMENT_KEY]
    delete bag[COMMENT_RESOLVED_KEY]
  }
  if (Object.keys(bag).length) properties[id] = bag
  else delete properties[id]
  return { ...model, properties }
}

/** Toggles resolved without touching the comment text. A no-op if there's no comment to resolve. */
export function setCommentResolved(model: LineageModel, id: EntityId, resolved: boolean): LineageModel {
  if (!commentOf(model, id)) return model
  const properties = { ...model.properties }
  const bag = { ...(properties[id] ?? {}) }
  if (resolved) bag[COMMENT_RESOLVED_KEY] = 'true'
  else delete bag[COMMENT_RESOLVED_KEY]
  properties[id] = bag
  return { ...model, properties }
}
