// Every FabricApi capability (src/fabric/api.ts) and what backs it — the one
// file to edit when wiring a real Fabric endpoint in. Each capability is
// independent (see api.ts), so they can be filled in one at a time; anything
// not listed here reports itself "not wired" rather than failing silently.
//
//   status                 — fabric/realApi.ts when VITE_FABRIC_REAL is set,
//                          else not wired.
//   workspaces             — fabric/realApi.ts when VITE_FABRIC_REAL is set
//                          (real, user-delegated); auth/mockFabricApi.ts
//                          otherwise, fixture data keyed by the signed-in
//                          user's email (auth/mockWorkspaces.ts).
//   items, tables           — fabric/realApi.ts when VITE_FABRIC_REAL is set,
//                          else not wired.
//   notebookSource, tableSchema — fabric/realApi.ts when VITE_FABRIC_REAL is
//                          set, else not wired. tableSchema reads OneLake's
//                          Delta log directly (a separate token scope — see
//                          auth/config.ts's onelakeLoginRequest).
//   pipelineDefinition     — fabric/realApi.ts when VITE_FABRIC_REAL is set,
//                          but PARTIAL: the activity graph is real, Copy
//                          lineage (reads/writes/column_lineage) is not —
//                          see that function's comment.
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

export function wireFabricApi(): void {
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
    setFabricApi({ ...engine, ...realFabricApi() })
    return
  }

  // Workspace browsing comes from the signed-in user's fixture role
  // assignments until real Fabric access is wired; the sandbox engine, when
  // running, still owns runSandbox/observedRun.
  setFabricApi({ ...engine, ...mockFabricWorkspaceApi() })
}
