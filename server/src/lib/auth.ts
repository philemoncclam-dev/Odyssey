// Bearer-token verification for the Entra-ID-issued access token the SPA
// sends — NOT the Fabric or Graph tokens; this one is scoped to THIS API's
// own app registration (`api://<app-id>/access_as_user`), acquired by the
// client via `auth/remoteApiLoginRequest` (see app/src/auth/config.ts).
//
// `ENTRA_API_AUDIENCE` is the app registration's Application (client) ID —
// the bare GUID, NOT the `api://<id>` App ID URI. A v2.0 access token for a
// custom API's own scope carries `aud` as the client ID; the App ID URI
// only shows up in `scp` (e.g. `access_as_user`). Confirmed against a real
// issued token — see docs/azure-student-setup.md's log for the "Invalid or
// expired token" chase this came out of. Also confirm the app registration's
// `api.requestedAccessTokenVersion` is explicitly `2` (Graph:
// `PATCH /applications/{id}` `{"api":{"requestedAccessTokenVersion":2}}`) —
// left `null` (common for an app registration created before "Expose an
// API" existed, or one whose manifest was never touched), Entra can still
// hand out a v1-shaped token that fails verification here regardless of the
// audience value.
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'

export interface AuthenticatedUser {
  /** The signed-in user's email — what `Models.Owner`/`ModelShares.InvitedEmail` are keyed by. */
  email: string
  /** Entra's stable per-user id, kept alongside email for auditing/logging — never used as a key today. */
  oid: string
}

export class AuthError extends Error {}

let cachedJwks: JWTVerifyGetKey | null = null
let cachedTenant: string | null = null

/** The tenant's signing-key set, fetched once and reused — a new one per
 *  request would mean a network round trip on every single API call. */
function jwksFor(tenantId: string): JWTVerifyGetKey {
  if (cachedJwks && cachedTenant === tenantId) return cachedJwks
  cachedJwks = createRemoteJWKSet(
    new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`),
  )
  cachedTenant = tenantId
  return cachedJwks
}

/**
 * Verifies an Entra ID v2.0 access token and extracts the identity this API
 * cares about. Throws `AuthError` with a message safe to put in a 401 body —
 * never the underlying `jose` error, which can echo back parts of the token.
 *
 * `getKey` is injectable so tests can verify against a locally generated
 * keypair instead of a real tenant's JWKS endpoint.
 */
export async function verifyBearerToken(
  authorizationHeader: string | null | undefined,
  config: { tenantId: string; audience: string },
  getKey: JWTVerifyGetKey = jwksFor(config.tenantId),
): Promise<AuthenticatedUser> {
  const token = bearerToken(authorizationHeader)
  if (!token) throw new AuthError('Missing bearer token.')

  let payload
  try {
    ;({ payload } = await jwtVerify(token, getKey, {
      issuer: `https://login.microsoftonline.com/${config.tenantId}/v2.0`,
      audience: config.audience,
    }))
  } catch {
    // Every jose failure mode (bad signature, expired, wrong audience, wrong
    // issuer, malformed) collapses to one message — which of those it was is
    // not information a caller who failed auth should get back.
    throw new AuthError('Invalid or expired token.')
  }

  const email = typeof payload['preferred_username'] === 'string' ? payload['preferred_username'] : undefined
  const oid = typeof payload['oid'] === 'string' ? payload['oid'] : undefined
  if (!email || !oid) throw new AuthError('Token is missing the claims this API needs.')

  return { email: email.toLowerCase(), oid }
}

function bearerToken(header: string | null | undefined): string | null {
  if (!header) return null
  const [scheme, token] = header.split(' ')
  return scheme?.toLowerCase() === 'bearer' && token ? token : null
}
