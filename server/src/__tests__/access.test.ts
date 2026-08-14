import { describe, expect, it } from 'vitest'
import { resolveAccess, canRead, canWrite, isOwner } from '../lib/access.js'
import type { Container } from '@azure/cosmos'
import type { ModelDoc, ShareDoc } from '../lib/cosmos.js'

/** A fake Container answering point reads by document id prefix — enough to
 *  exercise resolveAccess's two-read logic without a real Cosmos account. */
function fakeContainer(model?: Partial<ModelDoc>, share?: Partial<ShareDoc>): Container {
  return {
    item(id: string) {
      return {
        async read() {
          if (id.startsWith('model|')) return { resource: model }
          return { resource: share }
        },
      }
    },
  } as unknown as Container
}

describe('resolveAccess', () => {
  it('reports absent for a model that does not exist', async () => {
    const access = await resolveAccess(fakeContainer(undefined), 'x', 'a@b.com')
    expect(access).toEqual({ exists: false, role: null, doc: null })
  })

  it('is case-insensitive when matching the owner', async () => {
    const model = { owner: 'A@B.com' } as ModelDoc
    const access = await resolveAccess(fakeContainer(model), 'x', 'a@b.com')
    expect(access.role).toBe('owner')
  })

  it('falls through to a share doc when the caller is not the owner', async () => {
    const model = { owner: 'owner@b.com' } as ModelDoc
    const share = { role: 'editor' } as ShareDoc
    const access = await resolveAccess(fakeContainer(model, share), 'x', 'guest@b.com')
    expect(access.role).toBe('editor')
  })

  it('exists with no role when the model has no grant for this caller at all', async () => {
    const model = { owner: 'owner@b.com' } as ModelDoc
    const access = await resolveAccess(fakeContainer(model, undefined), 'x', 'stranger@b.com')
    expect(access).toMatchObject({ exists: true, role: null })
  })
})

describe('access predicates', () => {
  it('owner can read and write; editor can read and write; viewer can only read; null can do neither', () => {
    const at = (role: 'owner' | 'editor' | 'viewer' | null) => ({ exists: true, role, doc: null })
    expect(canRead(at('owner'))).toBe(true)
    expect(canWrite(at('owner'))).toBe(true)
    expect(isOwner(at('owner'))).toBe(true)

    expect(canRead(at('editor'))).toBe(true)
    expect(canWrite(at('editor'))).toBe(true)
    expect(isOwner(at('editor'))).toBe(false)

    expect(canRead(at('viewer'))).toBe(true)
    expect(canWrite(at('viewer'))).toBe(false)

    expect(canRead(at(null))).toBe(false)
    expect(canWrite(at(null))).toBe(false)
  })
})
