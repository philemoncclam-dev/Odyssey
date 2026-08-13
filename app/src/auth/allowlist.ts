// Who may use this app, beyond having a valid account in the Entra tenant.
//
// App-side rather than Entra-side ("assignment required" on the app
// registration): editable here without an Entra admin, at the cost of only
// gating the app's own UI — this is not a substitute for Entra-side
// assignment if Fabric access itself needs restricting later.
//
// The list itself lives in organization.config.ts — the one file to edit
// for a real deployment.
import { ALLOWED_EMAIL_DOMAINS } from '../organization.config'

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = email.toLowerCase().split('@')[1]
  return domain !== undefined && ALLOWED_EMAIL_DOMAINS.includes(domain)
}
