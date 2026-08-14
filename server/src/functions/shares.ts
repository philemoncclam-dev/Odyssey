// GET    /api/models/{id}/shares         — who a model is shared with, owner only.
// POST   /api/models/{id}/shares         — grant or change a share, owner only.
// DELETE /api/models/{id}/shares/{email} — revoke a share, owner only.
//
// Owner-only for all three: an editor can change the model, not who else can
// see it.
import { app } from '@azure/functions'
import type { Container } from '@azure/cosmos'
import { getContainer, shareDocId, type ShareDoc } from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden, badRequest } from '../lib/http.js'
import { resolveAccess, isOwner } from '../lib/access.js'

async function requireOwner(container: Container, id: string, email: string) {
  const access = await resolveAccess(container, id, email)
  if (!access.exists) throw notFound('Model')
  if (!isOwner(access)) throw forbidden('manage sharing on this model')
}

app.http('shares-list', {
  methods: ['GET'],
  route: 'models/{id}/shares',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    await requireOwner(container, id, user.email)

    const { resources } = await container.items
      .query<ShareDoc>({
        query: 'SELECT * FROM c WHERE c.modelId = @id AND c.type = "share" ORDER BY c.email',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll()
    return json(200, resources.map((s) => ({ email: s.email, role: s.role })))
  }),
})

app.http('shares-upsert', {
  methods: ['POST'],
  route: 'models/{id}/shares',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    await requireOwner(container, id, user.email)

    const body = (await req.json().catch(() => null)) as { email?: string; role?: string } | null
    const email = body?.email?.trim().toLowerCase()
    const role = body?.role
    if (!email || (role !== 'viewer' && role !== 'editor')) {
      throw badRequest('A share needs an email and a role of "viewer" or "editor".')
    }
    if (email === user.email.toLowerCase()) throw badRequest('A model is already visible to its owner.')

    // Deterministic id (model + email), not a random one: upserting under it
    // means a second grant to the same email REPLACES the role instead of
    // creating a duplicate share document.
    const doc: ShareDoc = { id: shareDocId(id, email), modelId: id, type: 'share', email, role }
    await container.items.upsert(doc)

    return json(200, { email, role })
  }),
})

app.http('shares-delete', {
  methods: ['DELETE'],
  route: 'models/{id}/shares/{email}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const email = decodeURIComponent(req.params['email']!).toLowerCase()
    const container = getContainer()
    await requireOwner(container, id, user.email)

    await container.item(shareDocId(id, email), id).delete().catch(() => {
      // Deleting a share that doesn't exist is not an error — same
      // idempotent-DELETE convention as functions/model.ts.
    })
    return json(204, null)
  }),
})
