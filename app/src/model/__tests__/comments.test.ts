import { describe, expect, it } from 'vitest'
import {
  commentOf,
  isCommentResolved,
  setComment,
  setCommentResolved,
  COMMENT_KEY,
  COMMENT_RESOLVED_KEY,
} from '../comments'
import { sampleModel } from '../sample'

describe('comments', () => {
  it('is empty for an entity with no comment', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    expect(commentOf(model, id)).toBe('')
  })

  it('sets and reads a comment', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const next = setComment(model, id, 'Deprecated — use the gold table instead.')
    expect(commentOf(next, id)).toBe('Deprecated — use the gold table instead.')
  })

  it('trims whitespace', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const next = setComment(model, id, '  spaced  ')
    expect(commentOf(next, id)).toBe('spaced')
  })

  it('clearing to an empty string removes the property entirely, not just its value', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const withComment = setComment(model, id, 'note')
    const cleared = setComment(withComment, id, '   ')
    expect(commentOf(cleared, id)).toBe('')
    expect(cleared.properties[id]?.[COMMENT_KEY]).toBeUndefined()
  })

  it('does not disturb other properties on the same entity', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const withOther = { ...model, properties: { ...model.properties, [id]: { Classification: 'PII' } } }
    const next = setComment(withOther, id, 'note')
    expect(next.properties[id]?.Classification).toBe('PII')
    expect(commentOf(next, id)).toBe('note')
  })

  it('leaves other entities untouched', () => {
    const model = sampleModel()
    const [a, b] = [model.layers[0].objects[0].id, model.layers[0].objects[1]?.id]
    const next = setComment(model, a, 'note')
    if (b) expect(commentOf(next, b)).toBe('')
  })
})

describe('resolve/dismiss', () => {
  it('is unresolved by default', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    expect(isCommentResolved(model, id)).toBe(false)
  })

  it('marks and clears resolved without touching the comment text', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const withComment = setComment(model, id, 'note')
    const resolved = setCommentResolved(withComment, id, true)
    expect(isCommentResolved(resolved, id)).toBe(true)
    expect(commentOf(resolved, id)).toBe('note')

    const unresolved = setCommentResolved(resolved, id, false)
    expect(isCommentResolved(unresolved, id)).toBe(false)
    expect(commentOf(unresolved, id)).toBe('note')
  })

  it('is a no-op when there is no comment to resolve', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const next = setCommentResolved(model, id, true)
    expect(next).toBe(model)
  })

  it('clearing the comment also clears resolved, not just the text', () => {
    const model = sampleModel()
    const id = model.layers[0].objects[0].id
    const resolved = setCommentResolved(setComment(model, id, 'note'), id, true)
    const cleared = setComment(resolved, id, '')
    expect(commentOf(cleared, id)).toBe('')
    expect(isCommentResolved(cleared, id)).toBe(false)
    expect(cleared.properties[id]?.[COMMENT_RESOLVED_KEY]).toBeUndefined()
  })
})
