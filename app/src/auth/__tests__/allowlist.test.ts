import { describe, expect, it } from 'vitest'
import { isAllowed } from '../allowlist'

describe('isAllowed', () => {
  it('denies when nothing is signed in', () => {
    expect(isAllowed(null)).toBe(false)
    expect(isAllowed(undefined)).toBe(false)
  })

  it('allows an @cclgroup.com email', () => {
    expect(isAllowed('someone@cclgroup.com')).toBe(true)
  })

  it('is case-insensitive on the domain', () => {
    expect(isAllowed('someone@CCLGROUP.COM')).toBe(true)
  })

  it('denies other domains, including lookalikes', () => {
    expect(isAllowed('someone@example.com')).toBe(false)
    expect(isAllowed('someone@notcclgroup.com')).toBe(false)
    expect(isAllowed('someone@cclgroup.com.evil.com')).toBe(false)
  })

  it('denies a malformed address with no domain', () => {
    expect(isAllowed('not-an-email')).toBe(false)
  })
})
