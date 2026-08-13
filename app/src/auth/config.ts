// Entra ID app registration for MSAL sign-in.
//
// A public client (SPA) registration — client ID and tenant ID are not
// secrets, so this is safe in the bundle. Real values live in
// organization.config.ts (the one file to edit for a real deployment,
// itself reading them from `.env` — see .env.example) once an Entra admin
// creates the app registration; the placeholders below just mean "not
// configured yet" and fail sign-in with a clear MSAL error rather than a
// mystery one.
import type { Configuration } from '@azure/msal-browser'
import { MSAL_CLIENT_ID, MSAL_TENANT_ID, MSAL_REDIRECT_URI } from '../organization.config'

export const msalConfig: Configuration = {
  auth: {
    clientId: MSAL_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    authority: `https://login.microsoftonline.com/${MSAL_TENANT_ID || 'common'}`,
    redirectUri: MSAL_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
}

export const loginRequest = { scopes: ['User.Read'] }

// Separate from `loginRequest`: sign-in only needs Graph's `User.Read`, and
// asking for Fabric scopes on every login would fail for anyone whose Entra
// app registration hasn't been granted them yet — including everyone before
// fabric/realApi.ts's first real tenant. Acquired lazily, only when a Fabric
// call is actually made (see auth/AuthProvider.tsx's acquireFabricToken).
//
// Unverified: the exact scope a Fabric REST call needs depends on what the
// app registration exposes and what an admin has consented to. This is the
// commonly documented default; change it if your tenant uses another.
export const fabricLoginRequest = { scopes: ['https://api.fabric.microsoft.com/Workspace.Read.All'] }

// OneLake is a SEPARATE resource from the Fabric REST API — a different
// audience, so it needs its own token even though both calls are made in
// the same request (fabric/realApi.ts's tableSchema, reading a Delta table's
// schema out of its transaction log). `user_impersonation` is the
// ADLS-Gen2-compatible scope OneLake documents; unverified for the same
// reason fabricLoginRequest is.
export const onelakeLoginRequest = { scopes: ['https://storage.azure.com/user_impersonation'] }
