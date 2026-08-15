// GET /api/fabric/workspaces/{workspaceId}/lakehouses/{lakehouseId}/tables/{tableName}/schema
//
// Same design as notebookSource.ts: reads OneLake as this Function App's
// managed identity rather than the caller's own token. OneLake's data-plane
// ACLs don't automatically follow a Fabric workspace role, so a Viewer who
// can legitimately see a table in Explore can still be refused reading its
// Delta log directly — this exists for the same reason notebookSource does.
import { app } from '@azure/functions'
import { withAuth, json, badRequest } from '../lib/http.js'
import { fetchTableSchemaAsSp } from '../lib/fabricSp.js'

app.http('fabric-table-schema', {
  methods: ['GET'],
  route: 'fabric/workspaces/{workspaceId}/lakehouses/{lakehouseId}/tables/{tableName}/schema',
  authLevel: 'anonymous',
  handler: withAuth(async (req) => {
    const workspaceId = req.params['workspaceId']
    const lakehouseId = req.params['lakehouseId']
    const tableName = req.params['tableName']
    if (!workspaceId || !lakehouseId || !tableName) {
      throw badRequest('workspaceId, lakehouseId, and tableName are required.')
    }

    const columns = await fetchTableSchemaAsSp(workspaceId, lakehouseId, tableName)
    return json(200, columns)
  }),
})
