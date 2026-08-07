import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './styles/tokens.css'
import { initTheme } from './shell/theme'
import { router } from './router'
import { setFabricApi } from './fabric/api'
import { localSandboxApi } from './fabric/localEngine'

// Restore a persisted theme choice before first paint — without this, the
// toggle's localStorage choice would not survive a reload.
initTheme()

// The sandbox engine, when one is running.
//
// Opt-in through an env var rather than always-on, because "Odyssey makes no
// network calls" is a promise the README makes and this is the one thing that
// would quietly break it. Unset — which is every default checkout, every
// build, and CI — nothing is installed and the toolkit reports itself unwired.
//
//     python -m sandbox.service
//     cd app && VITE_SANDBOX_URL=http://127.0.0.1:8765 npm run dev
//
// Only the sandbox half. Browsing Fabric needs credentials and is wired
// separately; see docs/fabric-toolkit-wiring.md.
const sandboxUrl = import.meta.env['VITE_SANDBOX_URL']
const engine = sandboxUrl ? localSandboxApi(sandboxUrl) : undefined

// Demo mode: a whole invented Fabric estate, so the toolkit works with nothing
// connected to it at all.
//
// Never a fallback and never automatic. Nothing degrades into demo data when a
// real call fails — a real estate that cannot be read must say so, because the
// alternative is someone trusting invented lineage for a table their pipeline
// really writes. It is asked for by name, and the app says so on screen for as
// long as it is on.
//
//     npm run dev:demo
//
// The real engine still wins inside it when one is running: analysing the code
// beats a staged answer, and demo mode passes the notebook's cells to it.
//
// Imported dynamically: the estate is ~18kB of fixtures, and a static import
// would put it in the boot graph of every production build for a mode nobody
// outside development ever switches on.
if (import.meta.env['VITE_FABRIC_DEMO']) {
  void import('./fabric/demoApi').then(({ demoFabricApi }) => setFabricApi(demoFabricApi(engine)))
} else if (engine) {
  setFabricApi(engine)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
