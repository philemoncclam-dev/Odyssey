// Every FabricApi capability (src/fabric/api.ts) and what backs it — the one
// file to edit when wiring a real Fabric endpoint in. Each capability is
// independent (see api.ts), so they can be filled in one at a time; anything
// not listed here reports itself "not wired" rather than failing silently.
//
//   status, workspaces, items, tables,
//   notebookSource, tableSchema,
//   pipelineDefinition     — fabric/spProxyApi.ts (server/'s Fabric proxy,
//                          run as the server's Managed Identity) when
//                          VITE_FABRIC_PROXY_URL is set, TAKING PRIORITY over
//                          VITE_FABRIC_REAL for these seven — see
//                          spProxyApi.ts's header for why browsing (AND
//                          status — easy to miss: leaving status() on the
//                          delegated path means Explore shows "not
//                          connected" and the other six never even run,
//                          regardless of whether they work) moved off the
//                          user-delegated path too, not just
//                          notebookSource/tableSchema as originally scoped.
//                          pipelineDefinition followed the same road for the
//                          same reason: the delegated path it ran on hit the
//                          same unresolved tenant-specific auth block. Unlike
//                          realApi.ts's version it is PARTIAL the same way:
//                          the activity graph is real, Copy lineage
//                          (reads/writes/column_lineage) is not — see
//                          lib/fabricSp.ts's comment on this.
//                          Else fabric/realApi.ts when VITE_FABRIC_REAL is
//                          set (user-delegated); else auth/mockFabricApi.ts
//                          fixture data for workspaces specifically
//                          (auth/mockWorkspaces.ts), everything else not wired.
//   runSandbox, observedRun — fabric/localEngine.ts, when VITE_SANDBOX_URL
//                          points at a running `python -m sandbox.service`.
//   integrations, identity — fabric/realApi.ts when VITE_FABRIC_REAL is set,
//                          else not wired.
//
// See docs/fabric-toolkit-wiring.md for the shape each one expects back.
import { setFabricApi } from './api'
import { localSandboxApi } from './localEngine'
import { mockFabricWorkspaceApi } from '../auth/mockFabricApi'
import { realFabricApi } from './realApi'
import { spFabricApi } from './spProxyApi'

export function wireFabricApi(): void {
  // notebookSource and tableSchema specifically run through the server's
  // Managed Identity rather than the signed-in user's own token — see
  // spProxyApi.ts's header. Independent of VITE_FABRIC_REAL: browsing can be
  // real or mock while these are wired, or vice versa, since they are two
  // capabilities, not a mode.
  const spOverrides = import.meta.env['VITE_FABRIC_PROXY_URL'] ? spFabricApi() : undefined
  // Opt-in through an env var rather than always-on, because "Odyssey makes
  // no network calls" is a promise the README makes and this is the one
  // thing that would quietly break it. Unset — every default checkout,
  // every build, and CI — nothing is installed and the toolkit reports
  // itself unwired.
  //
  //     python -m sandbox.service
  //     cd app && VITE_SANDBOX_URL=http://127.0.0.1:8765 npm run dev
  const sandboxUrl = import.meta.env['VITE_SANDBOX_URL']
  const engine = sandboxUrl ? localSandboxApi(sandboxUrl) : undefined

  // Real Fabric access, explicitly opt-in and separate from a working MSAL
  // sign-in: it is UNVERIFIED against a live tenant (see fabric/realApi.ts's
  // file header) and must never activate for someone who hasn't chosen it.
  //
  //     VITE_FABRIC_REAL=1 npm run dev
  if (import.meta.env['VITE_FABRIC_REAL']) {
    setFabricApi({ ...engine, ...realFabricApi(), ...spOverrides })
    return
  }

  // Workspace browsing comes from the signed-in user's fixture role
  // assignments until real Fabric access is wired; the sandbox engine, when
  // running, still owns runSandbox/observedRun.
  setFabricApi({ ...engine, ...mockFabricWorkspaceApi(), ...spOverrides })
}
