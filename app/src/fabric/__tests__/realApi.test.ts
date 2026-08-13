import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseIpynbCells, realFabricApi } from '../realApi'

vi.mock('../../auth/AuthProvider', () => ({
  acquireFabricToken: async () => 'test-token',
  acquireOneLakeToken: async () => 'test-token',
}))

const notebook = (cells: unknown[]) => JSON.stringify({ cells })

describe('parseIpynbCells', () => {
  it('extracts source from code cells, joining an array of lines', () => {
    const text = notebook([
      { cell_type: 'code', source: ['df = spark.table("orders")\n', 'df.show()'] },
    ])
    expect(parseIpynbCells(text)).toEqual(['df = spark.table("orders")\ndf.show()'])
  })

  it('accepts a plain string source too', () => {
    const text = notebook([{ cell_type: 'code', source: 'df.show()' }])
    expect(parseIpynbCells(text)).toEqual(['df.show()'])
  })

  it('drops markdown and raw cells', () => {
    const text = notebook([
      { cell_type: 'markdown', source: '# Title' },
      { cell_type: 'code', source: 'df.show()' },
      { cell_type: 'raw', source: 'ignore me' },
    ])
    expect(parseIpynbCells(text)).toEqual(['df.show()'])
  })

  it('drops a %%sql cell — the sandbox reads Python, not raw SQL text', () => {
    const text = notebook([
      { cell_type: 'code', source: '%%sql\nSELECT * FROM orders' },
      { cell_type: 'code', source: 'df.show()' },
    ])
    expect(parseIpynbCells(text)).toEqual(['df.show()'])
  })

  it('drops a cell whose metadata.language is not python/pyspark', () => {
    const text = notebook([
      { cell_type: 'code', source: 'println("hi")', metadata: { language: 'scala' } },
      { cell_type: 'code', source: 'df.show()', metadata: { language: 'python' } },
    ])
    expect(parseIpynbCells(text)).toEqual(['df.show()'])
  })

  it('keeps a %%pyspark cell but strips the magic line itself', () => {
    const text = notebook([{ cell_type: 'code', source: '%%pyspark\ndf = spark.table("orders")' }])
    expect(parseIpynbCells(text)).toEqual(['df = spark.table("orders")'])
  })

  it('treats an unmarked cell as python by default', () => {
    const text = notebook([{ cell_type: 'code', source: 'df.show()' }])
    expect(parseIpynbCells(text)).toEqual(['df.show()'])
  })

  it('handles a notebook with no cells at all', () => {
    expect(parseIpynbCells(notebook([]))).toEqual([])
  })
})

describe('pipelineDefinition', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const pipelinePart = (activities: unknown[]) => ({
    path: 'pipeline-content.json',
    payload: btoa(JSON.stringify({ properties: { activities } })),
    payloadType: 'InlineBase64',
  })

  it('follows a nested ExecutePipeline activity and flattens the child in, per the pipeline_id contract', async () => {
    const parentActivities = [
      {
        name: 'RunChild',
        type: 'ExecutePipeline',
        dependsOn: [],
        typeProperties: { pipeline: { referenceName: 'child-id' } },
      },
    ]
    const childActivities = [
      { name: 'Copy1', type: 'Copy', dependsOn: [] },
      { name: 'Copy2', type: 'Copy', dependsOn: [{ activity: 'Copy1' }] },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/items/parent-id/getDefinition')) {
          return new Response(JSON.stringify({ definition: { parts: [pipelinePart(parentActivities)] } }), {
            status: 200,
          })
        }
        if (url.includes('/items/child-id/getDefinition')) {
          return new Response(JSON.stringify({ definition: { parts: [pipelinePart(childActivities)] } }), {
            status: 200,
          })
        }
        throw new Error(`unexpected fetch: ${url}`)
      }),
    )

    const activities = await realFabricApi().pipelineDefinition!('ws', 'parent-id')

    expect(activities.map((a) => a.name)).toEqual(['RunChild', 'RunChild / Copy1', 'RunChild / Copy2'])
    expect(activities[0]?.pipeline_id).toBe('child-id')
    expect(activities[0]?.notebook_id).toBeNull()
    // The child's own dependsOn referenced a sibling by its unprefixed name —
    // flattening has to carry that prefix into the edge too, or the graph
    // disconnects.
    expect(activities.find((a) => a.name === 'RunChild / Copy2')?.depends_on).toEqual(['RunChild / Copy1'])
  })

  it('leaves a non-pipeline activity alone', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({ definition: { parts: [pipelinePart([{ name: 'CopyOrders', type: 'Copy', dependsOn: [] }])] } }),
          { status: 200 },
        ),
      ),
    )

    const activities = await realFabricApi().pipelineDefinition!('ws', 'solo-id')
    expect(activities).toEqual([
      {
        name: 'CopyOrders',
        type: 'Copy',
        depends_on: [],
        notebook_id: null,
        pipeline_id: null,
        workspace_id: 'ws',
        reads: [],
        writes: [],
        column_lineage: [],
      },
    ])
  })
})
