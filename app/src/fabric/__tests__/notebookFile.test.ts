// Reading a notebook someone hands us. The rule throughout: be tolerant about
// what counts as code, and refuse rather than guess when a file claims to be a
// notebook and is not — analysing zero cells reports a notebook that touches
// nothing, which reads as a finding rather than as a bad file.
import { describe, expect, it } from 'vitest'

import { parseNotebook } from '../notebookFile'

const ipynb = (cells: unknown[]) => JSON.stringify({ nbformat: 4, cells })

describe('parseNotebook', () => {
  it('reads code cells out of a .ipynb', () => {
    const parsed = parseNotebook(
      ipynb([
        { cell_type: 'code', source: ['spark.sql("SELECT 1")'] },
        { cell_type: 'code', source: 'spark.sql("SELECT 2")' },
      ]),
      'build_silver.ipynb',
    )
    expect(parsed.name).toBe('build_silver')
    expect(parsed.cells).toEqual(['spark.sql("SELECT 1")', 'spark.sql("SELECT 2")'])
  })

  it('joins a source given as lines, which is what nbformat actually writes', () => {
    const parsed = parseNotebook(
      ipynb([{ cell_type: 'code', source: ['SELECT a,\n', '       b\n', 'FROM t'] }]),
      'q.ipynb',
    )
    expect(parsed.cells).toEqual(['SELECT a,\n       b\nFROM t'])
  })

  it('drops markdown, which carries no lineage', () => {
    // Left in, prose would pad the coverage numbers with cells that did nothing.
    const parsed = parseNotebook(
      ipynb([
        { cell_type: 'markdown', source: '# Notes' },
        { cell_type: 'code', source: 'SELECT 1' },
      ]),
      'n.ipynb',
    )
    expect(parsed.cells).toEqual(['SELECT 1'])
  })

  it('skips empty cells rather than running them', () => {
    const parsed = parseNotebook(
      ipynb([{ cell_type: 'code', source: '   \n' }, { cell_type: 'code', source: 'SELECT 1' }]),
      'n.ipynb',
    )
    expect(parsed.cells).toEqual(['SELECT 1'])
  })

  it('treats a plain SQL file as one cell', () => {
    // A .sql file is a perfectly good thing to want analysed.
    const parsed = parseNotebook('SELECT id FROM orders', 'daily.sql')
    expect(parsed).toEqual({ name: 'daily', cells: ['SELECT id FROM orders'] })
  })

  it('treats pasted text with no file name as one cell', () => {
    expect(parseNotebook('SELECT 1').cells).toEqual(['SELECT 1'])
    expect(parseNotebook('SELECT 1').name).toBe('pasted')
  })

  it('refuses a .ipynb that is not valid JSON, and says what to do instead', () => {
    expect(() => parseNotebook('{not json', 'broken.ipynb')).toThrow(/not valid JSON/)
    expect(() => parseNotebook('{not json', 'broken.ipynb')).toThrow(/paste the code/)
  })

  it('refuses JSON that is not a notebook', () => {
    expect(() => parseNotebook('{"hello":1}', 'config.ipynb')).toThrow(/no `cells` array/)
  })

  it('refuses a notebook with no code in it', () => {
    // Running this would report a notebook that touches nothing.
    expect(() => parseNotebook(ipynb([{ cell_type: 'markdown', source: '# hi' }]), 'prose.ipynb'))
      .toThrow(/no code cells/)
  })

  it('detects a notebook pasted as text, without a file name', () => {
    const parsed = parseNotebook(ipynb([{ cell_type: 'code', source: 'SELECT 1' }]))
    expect(parsed.cells).toEqual(['SELECT 1'])
  })
})
