// GET /api/fabric/workspaces
// GET /api/fabric/workspaces/{workspaceId}/items
// GET /api/fabric/workspaces/{workspaceId}/lakehouses/{lakehouseId}/tables
//
// Browsing, run as this Function App's managed identity — same mechanism as
// notebookSource.ts/tableSchema.ts, extended to cover the whole Explore tree.
//
// This replaces per-user delegated browsing (app/src/fabric/realApi.ts's
// workspaces/items/tables), not just supplements it — see fabric/wiring.ts's
// header for why: delegated OAuth for the Fabric/Power BI resource hit an
// unresolved tenant-specific block (real workspace role, real capacity, real
// consent all confirmed present, still refused at sign-in) that going
// through the SP sidesteps entirely, the same way lineage-studio's prototype
// always did. The real cost, worth remembering: every signed-in user now
// sees the SAME list — whatever the SP has been granted (normally the whole
// tenant, via fabricAccessSync.ts) — not filtered to their own individual
// Fabric access. If the delegated-token issue gets root-caused later,
// swapping workspaces/items/tables back to realApi.ts is a wiring.ts change,
// not a rewrite.
import { app } from '@azure/functions'
import { withAuth, json, badRequest } from '../lib/http.js'
import { fetchWorkspacesAsSp, fetchItemsAsSp, fetchTablesAsSp } from '../lib/fabricSp.js'

app.http('fabric-workspaces', {
  methods: ['GET'],
  route: 'fabric/workspaces',
  authLevel: 'anonymous',
  handler: withAuth(async () => json(200, await fetchWorkspacesAsSp())),
})

app.http('fabric-items', {
  methods: ['GET'],
  route: 'fabric/workspaces/{workspaceId}/items',
  authLevel: 'anonymous',
  handler: withAuth(async (req) => {
    const workspaceId = req.params['workspaceId']
    if (!workspaceId) throw badRequest('workspaceId is required.')
    return json(200, await fetchItemsAsSp(workspaceId))
  }),
})

app.http('fabric-tables', {
  methods: ['GET'],
  route: 'fabric/workspaces/{workspaceId}/lakehouses/{lakehouseId}/tables',
  authLevel: 'anonymous',
  handler: withAuth(async (req) => {
    const workspaceId = req.params['workspaceId']
    const lakehouseId = req.params['lakehouseId']
    if (!workspaceId || !lakehouseId) throw badRequest('workspaceId and lakehouseId are required.')
    return json(200, await fetchTablesAsSp(workspaceId, lakehouseId))
  }),
})
