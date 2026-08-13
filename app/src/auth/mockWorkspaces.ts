import type { FabricWorkspace } from '../fabric/api'

export type FabricRole = 'read' | 'member' | 'contributor'

export interface RoleWorkspace extends FabricWorkspace {
  role: FabricRole
}

// Fixture Fabric estate, per signed-in user, until real Fabric access is
// wired (docs/fabric-toolkit-wiring.md). Swap for a real call — Fabric's
// `GET /v1/workspaces` filtered to the caller's `GET .../roleAssignments` —
// without touching anything else: this is the same shape `mockFabricApi`
// hands to `setFabricApi`.
const WORKSPACES_BY_USER: Record<string, RoleWorkspace[]> = {
  // 'you@yourtenant.com': [
  //   { id: 'ws-sales', name: 'Sales Analytics', role: 'contributor' },
  //   { id: 'ws-finance', name: 'Finance Reporting', role: 'read' },
  // ],
}

export function mockWorkspacesFor(email: string | null | undefined): RoleWorkspace[] {
  if (!email) return []
  return WORKSPACES_BY_USER[email.toLowerCase()] ?? []
}

/** Whether the role can do more than browse — gates "run in sandbox". */
export function canRun(role: FabricRole): boolean {
  return role === 'member' || role === 'contributor'
}
