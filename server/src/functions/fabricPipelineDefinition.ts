// GET /api/fabric/workspaces/{workspaceId}/pipelines/{itemId}/definition
//
// A pipeline's activity graph, run as this Function App's managed identity —
// same reason notebookSource.ts exists (see lib/fabricSp.ts's header):
// getDefinition needs Contributor+, which a Viewer legitimately doesn't have.
// Previously this stayed on the user-delegated path (fabric/realApi.ts) and
// hit an unresolved tenant-specific auth block — see app/src/fabric/wiring.ts's
// header for the history.
import { app } from '@azure/functions'
import { withAuth, json, badRequest } from '../lib/http.js'
import { fetchPipelineDefinitionAsSp } from '../lib/fabricSp.js'

app.http('fabric-pipeline-definition', {
  methods: ['GET'],
  route: 'fabric/workspaces/{workspaceId}/pipelines/{itemId}/definition',
  authLevel: 'anonymous',
  handler: withAuth(async (req) => {
    const workspaceId = req.params['workspaceId']
    const itemId = req.params['itemId']
    if (!workspaceId || !itemId) throw badRequest('workspaceId and itemId are required.')

    const activities = await fetchPipelineDefinitionAsSp(workspaceId, itemId)
    return json(200, activities)
  }),
})
