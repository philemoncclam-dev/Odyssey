import type { FabricApi, FabricPage, FabricWorkspace } from '../fabric/api'
import { getCurrentUserEmail } from './currentUser'
import { mockWorkspacesFor } from './mockWorkspaces'

/** `FabricApi.workspaces`, backed by the signed-in user's fixture roles. */
export function mockFabricWorkspaceApi(): Pick<FabricApi, 'workspaces'> {
  return {
    async workspaces(): Promise<FabricPage<FabricWorkspace>> {
      return { items: mockWorkspacesFor(getCurrentUserEmail()) }
    },
  }
}
