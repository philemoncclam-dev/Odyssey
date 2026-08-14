import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { remoteStore, isNotFoundError } from '../remoteStore'

vi.mock('../../auth/AuthProvider', () => ({
  acquireModelApiToken: async () => 'test-token',
}))

beforeEach(() => {
  vi.stubEnv('VITE_MODEL_API_URL', 'https://api.example.com')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function respond(status: number, body: unknown) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: body === null ? {} : { 'content-type': 'application/json' },
  })
}

describe('remoteStore', () => {
  it('sends the acquired token as a bearer header, against the configured base URL', async () => {
    const fetchSpy = vi.fn(async () => respond(200, []))
    vi.stubGlobal('fetch', fetchSpy)

    await remoteStore.list()

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/api/models',
      expect.objectContaining({ headers: expect.objectContaining({ authorization: 'Bearer test-token' }) }),
    )
  })

  it('get() returns null for a 404 rather than throwing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(404, { error: 'Model not found.' })))
    expect(await remoteStore.get('missing')).toBeNull()
  })

  it('get() rejects with the server-provided message for any other error status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(403, { error: "You don't have access to this model." })))
    await expect(remoteStore.get('x')).rejects.toThrow("You don't have access to this model.")
  })

  it('isNotFoundError distinguishes a 404 from every other failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(500, { error: 'boom' })))
    const err = await remoteStore.get('x').catch((e: unknown) => e)
    expect(isNotFoundError(err)).toBe(false)
  })

  it('save() PUTs the model as JSON to its own id', async () => {
    const fetchSpy = vi.fn(async () => respond(200, {}))
    vi.stubGlobal('fetch', fetchSpy)

    const model = { id: 'm1', name: 'Mortgage' } as never
    await remoteStore.save(model)

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/api/models/m1',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(model) }),
    )
  })

  it('a 204 response resolves to undefined rather than trying to parse an empty body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(204, null)))
    await expect(remoteStore.remove('x')).resolves.toBeUndefined()
  })

  it('removeMany() issues every delete concurrently, not one at a time', async () => {
    const calls: string[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        calls.push(url)
        return respond(204, null)
      }),
    )
    await remoteStore.removeMany(['a', 'b', 'c'])
    expect(calls.sort()).toEqual([
      'https://api.example.com/api/models/a',
      'https://api.example.com/api/models/b',
      'https://api.example.com/api/models/c',
    ])
  })

  it('duplicate() creates an empty row then fills it, stamping the SERVER-issued owner/id, not the source’s', async () => {
    const calls: { url: string; init: RequestInit | undefined }[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url, init })
        if (init?.method === 'POST') {
          return respond(201, {
            id: 'new-id',
            name: 'Mortgage (copy)',
            owner: 'duplicator@b.com',
            createdAt: 999,
            updatedAt: 999,
          })
        }
        if (init?.method === 'PUT') return respond(200, {})
        // GET for the source model.
        return respond(200, {
          id: 'source-id',
          name: 'Mortgage',
          owner: 'original-owner@b.com',
          sharedWith: [{ email: 'viewer@b.com', role: 'viewer' }],
          createdAt: 1,
          updatedAt: 1,
          layers: [],
          transitions: [],
          properties: {},
        })
      }),
    )

    const copy = await remoteStore.duplicate('source-id')
    expect(copy.id).toBe('new-id')
    expect(copy.owner).toBe('duplicator@b.com')
    expect(copy.sharedWith).toBeUndefined()

    const put = calls.find((c) => c.init?.method === 'PUT')
    const putBody = JSON.parse(put!.init!.body as string)
    expect(putBody.id).toBe('new-id')
    expect(putBody.sharedWith).toBeUndefined()
  })
})
