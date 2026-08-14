// GET    /api/models/{id}/branches               — every branch and its head.
// POST   /api/models/{id}/branches                — create one, pointed at another's head.
// DELETE /api/models/{id}/branches/{name}          — remove one (not `main`).
// POST   /api/models/{id}/branches/{name}/point    — move a head to an EXISTING
//                                                     version with no new commit
//                                                     — the fast-forward case,
//                                                     where nothing diverged and
//                                                     there is nothing to merge.
//
// No server-side "current branch" — see cosmos.ts's BranchDoc: unlike the
// old local-only design, a shared model can have two different people
// looking at two different branches at once, so which one a given caller is
// "on" is client-side state (model/history.ts's remote implementation),
// never written here.
import { app } from '@azure/functions'
import { getContainer, branchDocId, versionDocId, type BranchDoc } from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden, badRequest } from '../lib/http.js'
import { resolveAccess, canRead, canWrite } from '../lib/access.js'

app.http('branches-list', {
  methods: ['GET'],
  route: 'models/{id}/branches',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canRead(access)) throw forbidden('this model')

    const { resources } = await container.items
      .query<BranchDoc>({
        query: 'SELECT * FROM c WHERE c.modelId = @id AND c.type = "branch"',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll()
    return json(
      200,
      resources
        .map((b) => ({ name: b.name, head: b.head }))
        .sort((a, b) => (a.name === 'main' ? -1 : b.name === 'main' ? 1 : a.name.localeCompare(b.name))),
    )
  }),
})

app.http('branches-create', {
  methods: ['POST'],
  route: 'models/{id}/branches',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('branch this model')

    const body = (await req.json().catch(() => null)) as { name?: string; from?: string } | null
    const name = body?.name?.trim()
    const from = body?.from?.trim() || 'main'
    if (!name) throw badRequest('A branch needs a name.')

    const { resource: existing } = await container.item(branchDocId(id, name), id).read<BranchDoc>()
    if (existing) throw badRequest(`Branch "${name}" already exists.`)

    const { resource: source } = await container.item(branchDocId(id, from), id).read<BranchDoc>()
    if (!source) throw notFound(`Branch "${from}"`)

    const doc: BranchDoc = { id: branchDocId(id, name), modelId: id, type: 'branch', name, head: source.head }
    await container.items.create(doc)
    return json(201, { name, head: source.head })
  }),
})

app.http('branches-delete', {
  methods: ['DELETE'],
  route: 'models/{id}/branches/{name}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const name = decodeURIComponent(req.params['name']!)
    if (name === 'main') throw badRequest('main cannot be deleted.')

    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('delete a branch of this model')

    await container.item(branchDocId(id, name), id).delete().catch(() => {})
    return json(204, null)
  }),
})

app.http('branches-point', {
  methods: ['POST'],
  route: 'models/{id}/branches/{name}/point',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const name = decodeURIComponent(req.params['name']!)
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('move a branch of this model')

    const body = (await req.json().catch(() => null)) as { versionId?: string } | null
    const versionId = body?.versionId
    if (!versionId) throw badRequest('A target version id is required.')

    const { resource: version } = await container.item(versionDocId(id, versionId), id).read()
    if (!version) throw notFound('Version')

    const { resource: branch } = await container.item(branchDocId(id, name), id).read<BranchDoc>()
    if (!branch) throw notFound(`Branch "${name}"`)

    await container.item(branchDocId(id, name), id).replace({ ...branch, head: versionId })
    return json(200, { name, head: versionId })
  }),
})
