import { describe, expect, it, beforeAll } from 'vitest'
import { SignJWT, generateKeyPair, type JWTVerifyGetKey, type KeyLike } from 'jose'
import { AuthError, verifyBearerToken } from '../lib/auth.js'

const TENANT = '11111111-1111-1111-1111-111111111111'
const AUDIENCE = 'api://22222222-2222-2222-2222-222222222222'
const CONFIG = { tenantId: TENANT, audience: AUDIENCE }

let privateKey: KeyLike
let getKey: JWTVerifyGetKey

beforeAll(async () => {
  const pair = await generateKeyPair('RS256')
  privateKey = pair.privateKey
  // Injected in place of the real JWKS fetch — see verifyBearerToken's getKey param.
  getKey = (async () => pair.publicKey) as JWTVerifyGetKey
})

function sign(claims: Record<string, unknown>, opts: { expired?: boolean } = {}) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer(`https://login.microsoftonline.com/${TENANT}/v2.0`)
    .setAudience(AUDIENCE)
    .setExpirationTime(opts.expired ? '-1h' : '1h')
    .sign(privateKey)
}

describe('verifyBearerToken', () => {
  it('accepts a well-formed token and extracts email + oid', async () => {
    const token = await sign({ preferred_username: 'Person@Contoso.com', oid: 'abc-123' })
    const user = await verifyBearerToken(`Bearer ${token}`, CONFIG, getKey)
    // Lower-cased: it is the key Models.Owner/ModelShares.InvitedEmail are compared by.
    expect(user).toEqual({ email: 'person@contoso.com', oid: 'abc-123' })
  })

  it('rejects a missing header', async () => {
    await expect(verifyBearerToken(null, CONFIG, getKey)).rejects.toThrow(AuthError)
  })

  it('rejects a non-bearer scheme', async () => {
    await expect(verifyBearerToken('Basic xyz', CONFIG, getKey)).rejects.toThrow(AuthError)
  })

  it('rejects an expired token', async () => {
    const token = await sign({ preferred_username: 'a@b.com', oid: 'x' }, { expired: true })
    await expect(verifyBearerToken(`Bearer ${token}`, CONFIG, getKey)).rejects.toThrow(AuthError)
  })

  it('rejects a token for the wrong audience', async () => {
    const token = await new SignJWT({ preferred_username: 'a@b.com', oid: 'x' })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(`https://login.microsoftonline.com/${TENANT}/v2.0`)
      .setAudience('api://someone-else')
      .setExpirationTime('1h')
      .sign(privateKey)
    await expect(verifyBearerToken(`Bearer ${token}`, CONFIG, getKey)).rejects.toThrow(AuthError)
  })

  it('rejects a token missing the claims this API needs', async () => {
    const token = await sign({ /* no preferred_username, no oid */ })
    await expect(verifyBearerToken(`Bearer ${token}`, CONFIG, getKey)).rejects.toThrow(
      'missing the claims',
    )
  })
})
