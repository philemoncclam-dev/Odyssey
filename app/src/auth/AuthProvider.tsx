import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from 'react'
import { InteractionRequiredAuthError, PublicClientApplication, type AccountInfo } from '@azure/msal-browser'
import { MsalProvider, useMsal } from '@azure/msal-react'
import { msalConfig, loginRequest, fabricLoginRequest, onelakeLoginRequest, remoteModelLoginRequest } from './config'
import { isAllowed } from './allowlist'
import { setCurrentUserEmail } from './currentUser'

// Popup rather than redirect: no `handleRedirectPromise` dance to get right,
// and this app has no server to bounce back to. Worth revisiting if a popup
// blocker turns out to be a real problem for real users.
const msalInstance = new PublicClientApplication(msalConfig)
void msalInstance.initialize()

/**
 * A token for the signed-in user, in a given scope — for fabric/realApi.ts.
 *
 * Outside React on purpose: the FabricApi implementation that calls this is a
 * plain module (fabric/wiring.ts wires it once at boot), not a component, so
 * it cannot use the `useAuth` hook below.
 *
 * Silent first, popup only on `InteractionRequiredAuthError` — consent not
 * yet granted, or the token genuinely expired mid-session — because a
 * background browse of the workspace tree popping a window on every call
 * would be unusable.
 */
async function acquireToken(request: { scopes: string[] }): Promise<string> {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in.')
  try {
    const result = await msalInstance.acquireTokenSilent({ ...request, account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const result = await msalInstance.acquireTokenPopup(request)
      return result.accessToken
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
      signIn: () => {
        void instance.loginPopup(loginRequest).then((result) => {
          instance.setActiveAccount(result.account)
        })
      },
      signOut: () => void instance.logoutPopup(),
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
