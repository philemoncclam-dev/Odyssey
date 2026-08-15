import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from 'react'
import { InteractionRequiredAuthError, PublicClientApplication, type AccountInfo } from '@azure/msal-browser'
import { MsalProvider, useMsal } from '@azure/msal-react'
import { msalConfig, loginRequest, fabricLoginRequest, onelakeLoginRequest, remoteModelLoginRequest } from './config'
import { isAllowed } from './allowlist'
import { setCurrentUserEmail } from './currentUser'

// Redirect rather than popup: this @azure/msal-browser version's popup flow
// waits on a "bridge" handshake (waitForBridgeResponse in PopupClient) that
// never completes in a plain browser tab — the popup gets the auth code
// (visible in its URL) but times out instead of closing itself. Redirect
// sidesteps that path entirely: full navigation away and back, handled by
// handleRedirectPromise() below.
const msalInstance = new PublicClientApplication(msalConfig)
const msalReady = msalInstance.initialize().then(() => msalInstance.handleRedirectPromise())
msalReady.then((result) => {
  if (result) msalInstance.setActiveAccount(result.account)
})

/**
 * A token for the signed-in user, in a given scope — for fabric/realApi.ts.
 *
 * Outside React on purpose: the FabricApi implementation that calls this is a
 * plain module (fabric/wiring.ts wires it once at boot), not a component, so
 * it cannot use the `useAuth` hook below.
 *
 * Silent first, a full redirect only on `InteractionRequiredAuthError` —
 * consent not yet granted, or the token genuinely expired mid-session.
 */
async function acquireToken(request: { scopes: string[] }): Promise<string> {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in.')
  try {
    const result = await msalInstance.acquireTokenSilent({ ...request, account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      // Full navigation away, same reason signIn below uses loginRedirect:
      // this msal-browser version's popup bridge never resolves. The caller
      // (a Fabric call mid-browse) simply doesn't get its answer this tick —
      // the page comes back signed in and the user retries the action.
      await msalInstance.acquireTokenRedirect(request)
      throw err
    }
    throw err
  }
}

export function acquireFabricToken(): Promise<string> {
  return acquireToken(fabricLoginRequest)
}

/** A token scoped to OneLake (ADLS Gen2 surface) — a different audience from the Fabric REST API. */
export function acquireOneLakeToken(): Promise<string> {
  return acquireToken(onelakeLoginRequest)
}

/** A token for the model-storage API (server/) — for model/remoteStore.ts. */
export function acquireModelApiToken(): Promise<string> {
  return acquireToken(remoteModelLoginRequest)
}

interface AuthState {
  account: AccountInfo | null
  allowed: boolean
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function AuthBridge({ children }: PropsWithChildren) {
  const { instance, accounts } = useMsal()
  const account = accounts[0] ?? null
  const email = account?.username ?? null

  useEffect(() => {
    setCurrentUserEmail(email)
  }, [email])

  const value = useMemo<AuthState>(
    () => ({
      account,
      allowed: isAllowed(email),
      signIn: () => void instance.loginRedirect(loginRequest),
      signOut: () => void instance.logoutRedirect(),
    }),
    [account, email, instance],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthBridge>{children}</AuthBridge>
    </MsalProvider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
