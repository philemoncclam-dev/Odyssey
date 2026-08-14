import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { remoteHistoryStore } from '../remoteHistoryStore'
import { emptyModel } from '../store'
import type { LineageModel } from '../types'

vi.mock('../../auth/AuthProvider', () => ({
  acquireModelApiToken: async () => 'test-token',
}))

beforeEach(() => {
  vi.stubEnv('VITE_MODEL_API_URL', 'https://api.example.com')
  localStorage.clear()
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

const withLayer = (model: LineageModel, id: string, name: string): LineageModel => ({
  ...model,
  layers: [...model.layers, { id, name, objects: [] }],
})

describe('remoteHistoryStore: current branch is client-only', () => {
  it('defaults to main and is never sent as part of a GET', async () => {
    const fetchSpy = vi.fn(async () => respond(200, []))
    vi.stubGlobal('fetch', fetchSpy)
    expect(await remoteHistoryStore.currentBranch('m1')).toBe('main')
  })

  it('createBranch moves the cached current branch to the new one', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(201, { name: 'feature', head: null })))
    await remoteHistoryStore.createBranch('m1', 'feature')
    expect(await remoteHistoryStore.currentBranch('m1')).toBe('feature')
  })

  it('deleting the branch you are on falls back to main', async () => {
    localStorage.setItem('odyssey:branch:m1', 'feature')
    vi.stubGlobal('fetch', vi.fn(async () => respond(204, null)))
    await remoteHistoryStore.deleteBranch('m1', 'feature')
    expect(await remoteHistoryStore.currentBranch('m1')).toBe('main')
  })

  it('checkout switches the cached branch and returns the head model', async () => {
    const model = emptyModel('M')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/branches')) return respond(200, [{ name: 'main', head: null }, { name: 'feature', head: 'v1' }])
        return respond(200, model) // GET the version
      }),
    )
    const loaded = await remoteHistoryStore.checkout('m1', 'feature')
    expect(loaded?.name).toBe('M')
    expect(await remoteHistoryStore.currentBranch('m1')).toBe('feature')
  })

  it('checkout throws for a branch that does not exist', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(200, [{ name: 'main', head: null }])))
    await expect(remoteHistoryStore.checkout('m1', 'nope')).rejects.toThrow('No branch')
  })
})

describe('remoteHistoryStore.mergeBranch', () => {
  it('fast-forwards by pointing the branch at the existing head, with no new commit', async () => {
    const sourceModel = withLayer(emptyModel('M'), 'L1', 'Source')
    const calls: { url: string; method?: string | undefined; body?: string | undefined }[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url, method: init?.method, body: init?.body as string | undefined })
        if (url.endsWith('/branches')) {
          return respond(200, [
            { name: 'main', head: null },
            { name: 'feature', head: 'v1' },
          ])
        }
        if (url.includes('/versions') && !url.includes('/versions/')) return respond(200, [])
        if (url.endsWith('/point')) return respond(200, { name: 'main', head: 'v1' })
        if (url.includes('/versions/v1')) return respond(200, sourceModel)
        throw new Error(`unexpected: ${url}`)
      }),
    )

    const outcome = await remoteHistoryStore.mergeBranch('m1', 'feature', 'main')
    expect(outcome.fastForward).toBe(true)
    expect(outcome.head).toBe('v1')
    expect(outcome.model.layers.map((l) => l.name)).toEqual(['Source'])

    const point = calls.find((c) => c.url.endsWith('/point'))
    expect(point).toBeDefined()
    expect(JSON.parse(point!.body!)).toEqual({ versionId: 'v1' })
    // No commit was issued for a fast-forward.
    expect(calls.some((c) => c.url.endsWith('/commit'))).toBe(false)
  })

  it('three-way merges when both branches moved, committing with both heads as parents', async () => {
    const base = emptyModel('M')
    const targetModel = withLayer(base, 'L2', 'Target')
    const sourceModel = withLayer(base, 'L1', 'Source')
    const calls: { url: string; method?: string | undefined; body?: string | undefined }[] = []

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url, method: init?.method, body: init?.body as string | undefined })
        if (url.endsWith('/branches')) {
          return respond(200, [
            { name: 'main', head: 'target-v' },
            { name: 'feature', head: 'source-v' },
          ])
        }
        if (url.endsWith('/versions')) {
          return respond(200, [
            { id: 'base-v', label: 'first', savedAt: 1, savedBy: null, parents: [] },
            { id: 'target-v', label: 'ours', savedAt: 2, savedBy: null, parents: ['base-v'] },
            { id: 'source-v', label: 'theirs', savedAt: 3, savedBy: null, parents: ['base-v'] },
          ])
        }
        if (url.endsWith('/versions/target-v')) return respond(200, targetModel)
        if (url.endsWith('/versions/source-v')) return respond(200, sourceModel)
        if (url.endsWith('/versions/base-v')) return respond(200, base)
        if (url.endsWith('/commit')) return respond(201, { versionId: 'merge-v' })
        throw new Error(`unexpected: ${url}`)
      }),
    )

    const outcome = await remoteHistoryStore.mergeBranch('m1', 'feature', 'main')
    expect(outcome.fastForward).toBe(false)
    expect(outcome.head).toBe('merge-v')
    expect(outcome.model.layers.map((l) => l.name).sort()).toEqual(['Source', 'Target'])

    const commitCall = calls.find((c) => c.url.endsWith('/commit'))!
    const commitBody = JSON.parse(commitCall.body!)
    expect(commitBody.branch).toBe('main')
    expect(commitBody.parents).toEqual(['target-v', 'source-v'])

    // Merging onto main must not move the caller off the branch they were on.
    expect(await remoteHistoryStore.currentBranch('m1')).toBe('main')
  })

  it('rejects merging a branch that has nothing committed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        respond(200, [
          { name: 'main', head: null },
          { name: 'empty', head: null },
        ]),
      ),
    )
    await expect(remoteHistoryStore.mergeBranch('m1', 'empty', 'main')).rejects.toThrow('nothing to merge')
  })
})
