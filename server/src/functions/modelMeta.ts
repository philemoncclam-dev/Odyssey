// PATCH /api/models/{id}/meta  — browser metadata only (name/description/tags/starred).
// POST  /api/models/{id}/touch — records that the model was opened.
//
// Neither bumps ModelDoc.updatedAt, mirroring model/store.ts's client
// implementation: starring a model or fixing a typo in its tags is not a
// change to the model, and letting either reorder the "recently modified"
// list would make that sort useless.
import { app } from '@azure/functions'
import { getContainer, modelDocId, type ModelDoc } from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden, badRequest } from '../lib/http.js'
import { resolveAccess, canRead, canWrite } from '../lib/access.js'

app.http('model-meta-patch', {
  methods: ['PATCH'],
  route: 'models/{id}/meta',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('edit this model')

    const patch = (await req.json().catch(() => null)) as Partial<
      Pick<ModelDoc, 'name' | 'description' | 'tags' | 'starred'>
    > | null
    if (!patch) throw badRequest('Not a valid metadata patch.')

    const next: ModelDoc = { ...access.doc!, ...patch }
    await container.item(modelDocId(id), id).replace(next)
    return json(200, patch)
  }),
})

app.http('model-touch', {
  methods: ['POST'],
  route: 'models/{id}/touch',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    // Viewing (not just editing) counts as "touched" — a viewer needs to be
    // able to open a model without that failing as a write they don't have.
    if (!canRead(access)) throw forbidden('view this model')

    const next: ModelDoc = { ...access.doc!, lastViewedAt: Date.now() }
    await container.item(modelDocId(id), id).replace(next)
    return json(204, null)
  }),
})
