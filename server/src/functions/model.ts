// GET    /api/models/{id} — the full model, read access required.
// PUT    /api/models/{id} — plain autosave of the current graph/metadata,
//                           write access required. Does NOT touch versions
//                           or branches — see functions/commit.ts for that.
// DELETE /api/models/{id} — remove the model AND every doc in its partition
//                           (shares, branches, versions), owner required.
import { app } from '@azure/functions'
import { getContainer, modelDocId, type ModelDoc } from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden, badRequest } from '../lib/http.js'
import { resolveAccess, canRead, canWrite, isOwner } from '../lib/access.js'

function toWire(m: ModelDoc) {
  return {
    id: m.modelId,
    name: m.name,
    description: m.description,
    tags: m.tags,
    starred: m.starred,
    owner: m.owner,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    lastViewedAt: m.lastViewedAt,
    ...m.data,
  }
}

app.http('model-get', {
  methods: ['GET'],
  route: 'models/{id}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canRead(access)) throw forbidden('this model')
    return json(200, toWire(access.doc!))
  }),
})

app.http('model-put', {
  methods: ['PUT'],
  route: 'models/{id}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('edit this model')

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
    if (!body || typeof body['name'] !== 'string') throw badRequest('Not a valid model document.')

    const now = Date.now()
    const { layers, transitions, properties, views, assistantInstructions, ...meta } = body
    const next: ModelDoc = {
      ...access.doc!,
      name: body['name'] as string,
      description: typeof meta['description'] === 'string' ? meta['description'] : access.doc!.description,
      tags: Array.isArray(meta['tags']) ? (meta['tags'] as string[]) : access.doc!.tags,
      starred: typeof meta['starred'] === 'boolean' ? meta['starred'] : access.doc!.starred,
      updatedAt: now,
      data: { layers, transitions, properties, views, assistantInstructions },
    }
    await container.item(modelDocId(id), id).replace(next)
    return json(200, toWire(next))
  }),
})

app.http('model-delete', {
  methods: ['DELETE'],
  route: 'models/{id}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    // Sharing a model grants viewing/editing it, never deleting it.
    if (!isOwner(access)) throw forbidden('delete this model')

    // Every document in the partition — model, shares, branches, versions —
    // goes with it. One call because they all share partition key = id.
    await container.deleteAllItemsForPartitionKey(id)
    return json(204, null)
  }),
})
