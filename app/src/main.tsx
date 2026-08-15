import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './styles/tokens.css'
import { initTheme } from './shell/theme'
import { router } from './router'
import { wireFabricApi } from './fabric/wiring'
import { AuthProvider } from './auth/AuthProvider'
import { AuthGate } from './auth/AuthGate'

// Restore a persisted theme choice before first paint — without this, the
// toggle's localStorage choice would not survive a reload.
initTheme()

// Every FabricApi capability and what backs it today — see fabric/wiring.ts.
wireFabricApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </AuthProvider>
  </StrictMode>,
)
