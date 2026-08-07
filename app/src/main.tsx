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
if (sandboxUrl) setFabricApi(localSandboxApi(sandboxUrl))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
