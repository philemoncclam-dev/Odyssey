// GET  /api/models — every model the caller owns or has been shared.
// POST /api/models — create an empty model + its `main` branch, atomically.
import { app } from '@azure/functions'
import type { ItemDefinition } from '@azure/cosmos'
import { randomUUID } from 'node:crypto'
import { getContainer, modelDocId, branchDocId, type ModelDoc, type BranchDoc } from '../lib/cosmos.js'
import { withAuth, json, badRequest } from '../lib/http.js'
import { countGraph } from '../lib/summarize.js'

app.http('models-list', {
  methods: ['GET'],
  route: 'models',
  authLevel: 'anonymous', // withAuth does the real check — see its header.
  handler: withAuth(async (_req, user) => {
    const container = getContainer()
    // Cross-partition by necessity — "every model I can see" spans every
    // model's own partition. ARRAY_CONTAINS's third argument (true) does a
    // partial-object match, so this matches a sharedWith entry on email
    // alone, ignoring its role.
    const { resources } = await container.items
      .query<ModelDoc>({
        query:
          'SELECT * FROM c WHERE c.type = "model" AND (c.owner = @email OR ARRAY_CONTAINS(c.sharedWith, {"email": @email}, true))',
        parameters: [{ name: '@email', value: user.email }],
      })
      .fetchAll()

    return json(
      200,
      resources.map((m) => ({
        id: m.modelId,
        name: m.name,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        lastViewedAt: m.lastViewedAt,
        description: m.description,
        tags: m.tags,
        starred: m.starred,
        owner: m.owner,
        ...countGraph(m.data),
      })),
    )
  }),
})

app.http('models-create', {
  methods: ['POST'],
  route: 'models',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const body = (await req.json().catch(() => null)) as { name?: string } | null
    const name = body?.name?.trim()
    if (!name) throw badRequest('A model needs a name.')

    const id = randomUUID()
    const now = Date.now()
    const model: ModelDoc = {
      id: modelDocId(id),
      modelId: id,
      type: 'model',
      name,
      description: '',
      tags: [],
      starred: false,
      owner: user.email,
      createdAt: now,
      updatedAt: now,
      lastViewedAt: now,
      data: { layers: [], transitions: [], properties: {} },
    }
    const mainBranch: BranchDoc = {
      id: branchDocId(id, 'main'),
      modelId: id,
      type: 'branch',
      name: 'main',
      head: null,
    }

    const container = getContainer()
    // Atomic: a model that exists without its `main` branch (or vice versa)
    // is a state nothing downstream expects — TransactionalBatch means a
    // failure here leaves neither half written, not one orphaned.
    await container.items.batch(
      [
        { operationType: 'Create', resourceBody: model as unknown as ItemDefinition },
        { operationType: 'Create', resourceBody: mainBranch as unknown as ItemDefinition },
      ],
      id,
    )

    return json(201, {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      lastViewedAt: now,
      description: '',
      tags: [],
      starred: false,
      owner: user.email,
      layers: [],
      transitions: [],
      properties: {},
    })
  }),
})
