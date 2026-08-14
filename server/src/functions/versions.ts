// GET /api/models/{id}/versions              — snapshot metadata, WITH parents
//                                                (needed for the client-side
//                                                merge algorithm's ancestor
//                                                walk — see model/mergeEngine.ts).
//                                                No graph payload; cheap.
// GET /api/models/{id}/versions/{versionId}   — one snapshot's full graph.
//
// There is no POST here — see functions/commit.ts. A version is never
// created on its own; it is always one half of an atomic commit (the other
// half being the branch-head pointer that moves to it), so the "create a
// version" verb lives with the operation that is actually atomic, not
// split across two endpoints the way the SQL-backed design here used to be.
import { app } from '@azure/functions'
import { getContainer, type VersionDoc } from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden } from '../lib/http.js'
import { resolveAccess, canRead } from '../lib/access.js'

app.http('versions-list', {
  methods: ['GET'],
  route: 'models/{id}/versions',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canRead(access)) throw forbidden('this model')

    const { resources } = await container.items
      .query<VersionDoc>({
        query: 'SELECT * FROM c WHERE c.modelId = @id AND c.type = "version" ORDER BY c.createdAt DESC',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll()

    return json(
      200,
      resources.map((v) => ({
        id: v.versionId,
        label: v.label,
        savedAt: v.createdAt,
        savedBy: v.createdByEmail,
        parents: v.parents,
      })),
    )
  }),
})

app.http('version-get', {
  methods: ['GET'],
  route: 'models/{id}/versions/{versionId}',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const versionId = req.params['versionId']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canRead(access)) throw forbidden('this model')

    const { resources } = await container.items
      .query<VersionDoc>({
        query: 'SELECT * FROM c WHERE c.modelId = @id AND c.type = "version" AND c.versionId = @vid',
        parameters: [
          { name: '@id', value: id },
          { name: '@vid', value: versionId },
        ],
      })
      .fetchAll()
    const version = resources[0]
    if (!version) throw notFound('Version')
    return json(200, version.data)
  }),
})
