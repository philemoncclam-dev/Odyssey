// The signed-in user's email, readable outside React.
//
// `fabric/api.ts`'s FabricApi is wired once at boot, before sign-in
// resolves — this lets that wiring read "whoever is signed in right now" at
// call time instead of needing to be re-wired after login.
let email: string | null = null

export function setCurrentUserEmail(next: string | null): void {
  email = next
}

export function getCurrentUserEmail(): string | null {
  return email
}
