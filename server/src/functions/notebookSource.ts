// GET /api/fabric/workspaces/{workspaceId}/notebooks/{itemId}/source
//
// The one endpoint in this API that talks to Fabric, not Cosmos. Fetches a
// notebook's cells as this Function App's managed identity rather than the
// caller's own Fabric permissions — see lib/fabricSp.ts's header for why:
// Fabric's getDefinition needs Contributor+, and a Viewer legitimately can't
// call it with their own token. Auth here only checks "is this a signed-in
// Odyssey user" (withAuth) — not their Fabric role on this workspace — which
// is the deliberate widening docs/azure-student-setup.md's Phase 2 exists
// for: sandbox mode should run for anyone who can see the notebook in
// Explore (a user-delegated call, unaffected by this), not only Contributors.
import { app } from '@azure/functions'
import { withAuth, json, badRequest } from '../lib/http.js'
import { fetchNotebookCellsAsSp } from '../lib/fabricSp.js'

app.http('fabric-notebook-source', {
  methods: ['GET'],
  route: 'fabric/workspaces/{workspaceId}/notebooks/{itemId}/source',
  authLevel: 'anonymous',
  handler: withAuth(async (req) => {
    const workspaceId = req.params['workspaceId']
    const itemId = req.params['itemId']
    if (!workspaceId || !itemId) throw badRequest('workspaceId and itemId are required.')

    const cells = await fetchNotebookCellsAsSp(workspaceId, itemId)
    return json(200, { cells })
  }),
})
