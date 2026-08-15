// Daily timer: grants this Function App's managed identity Contributor on
// every workspace in the tenant that it doesn't already have access to.
//
// Why this exists instead of a one-time manual grant: Fabric has no "give
// this identity access to every workspace, including ones created later"
// setting — role assignments are per-workspace. Without this job, someone
// has to remember to add the MI by hand every time a new workspace shows up,
// and sandbox mode quietly breaks for it until they do. This runs daily and
// catches up automatically instead. See docs/azure-student-setup.md's Phase 2.
//
// CRON here is a NCRONTAB expression (Azure Functions' timer format, six
// fields including seconds) — "0 0 3 * * *" is 03:00 UTC daily. Change via
// FABRIC_SYNC_SCHEDULE rather than editing this file if a deployment wants a
// different cadence.
import { app, type InvocationContext, type Timer } from '@azure/functions'
import { listAllWorkspaces, ensureContributorAccess } from '../lib/fabricSp.js'

app.timer('fabric-access-sync', {
  schedule: process.env['FABRIC_SYNC_SCHEDULE'] || '0 0 3 * * *',
  handler: async (_timer: Timer, context: InvocationContext) => {
    const workspaces = await listAllWorkspaces()
    let granted = 0
    let alreadyHad = 0
    let failed = 0

    for (const ws of workspaces) {
      const result = await ensureContributorAccess(ws.id)
      if (result === 'granted') granted++
      else if (result === 'already-had') alreadyHad++
      else {
        failed++
        context.warn(`fabric-access-sync: could not grant access to workspace ${ws.id} (${ws.name}).`)
      }
    }

    context.log(
      `fabric-access-sync: ${workspaces.length} workspaces — ${granted} newly granted, ${alreadyHad} already had access, ${failed} failed.`,
    )
  },
})
