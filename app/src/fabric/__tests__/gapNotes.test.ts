import { beforeEach, describe, expect, it } from 'vitest'
import { getGapNote, setGapNote } from '../gapNotes'

describe('gap notes', () => {
  beforeEach(() => localStorage.clear())

  it('is empty for a table with no note', () => {
    expect(getGapNote('ws/lh/orders')).toBeNull()
  })

  it('stores and retrieves a note', () => {
    setGapNote('ws/lh/orders', 'DataFrame API, known blind spot')
    expect(getGapNote('ws/lh/orders')?.note).toBe('DataFrame API, known blind spot')
  })

  it('trims whitespace', () => {
    setGapNote('ws/lh/orders', '  spaced  ')
    expect(getGapNote('ws/lh/orders')?.note).toBe('spaced')
  })

  it('clearing to an empty string removes the note rather than storing blank', () => {
    setGapNote('ws/lh/orders', 'something')
    setGapNote('ws/lh/orders', '   ')
    expect(getGapNote('ws/lh/orders')).toBeNull()
  })

  it('notes are independent per table ref', () => {
    setGapNote('a', 'note a')
    setGapNote('b', 'note b')
    expect(getGapNote('a')?.note).toBe('note a')
    expect(getGapNote('b')?.note).toBe('note b')
  })
})
