import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './styles/tokens.css'
import { initTheme } from './shell/theme'
import { router } from './router'
import { wireFabricApi } from './fabric/wiring'
import { AuthProvider } from './auth/AuthProvider'
// import { AuthGate } from './auth/AuthGate'

// Restore a persisted theme choice before first paint — without this, the
// toggle's localStorage choice would not survive a reload.
initTheme()

// Every FabricApi capability and what backs it today — see fabric/wiring.ts.
wireFabricApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      {/* AuthGate disabled for now — sign-in has no real Entra app
          registration to authenticate against yet, so it was a wall nobody
          could get past. Restore the <AuthGate> wrapper (see git history /
          the commented import above) once real MSAL config exists, or use
          VITE_SKIP_AUTH=1 for a per-run bypass instead of leaving this off. */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
