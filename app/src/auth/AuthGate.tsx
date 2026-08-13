import type { CSSProperties, PropsWithChildren } from 'react'
import { useAuth } from './AuthProvider'

const wrap: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  height: '100vh',
  textAlign: 'center',
  gap: '0.75rem',
}

/** Blocks the app behind sign-in, then behind the allowlist. */
export function AuthGate({ children }: PropsWithChildren) {
  const { account, allowed, signIn, signOut } = useAuth()

  // Explicit opt-in only, never the default: lets someone view the app
  // locally before a real Entra app registration exists. Never set this in
  // a deployed build.
  if (import.meta.env['VITE_SKIP_AUTH']) return <>{children}</>

  if (!account) {
    return (
      <div style={wrap}>
        <h1>Odyssey</h1>
        <p>Sign in with your work account to continue.</p>
        <button onClick={signIn}>Sign in</button>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div style={wrap}>
        <h1>Access not granted</h1>
        <p>
          {account.username} is signed in but not on the allowlist for this app.
          <br />
          Ask an admin to add you in <code>src/auth/allowlist.ts</code>.
        </p>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }

  return <>{children}</>
}
