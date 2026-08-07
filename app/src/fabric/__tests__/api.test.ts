// The wiring seam. These are the promises `src/fabric/api.ts` makes to whoever
// plugs a real Fabric backend in, so they are worth pinning down.
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  FabricError,
  FabricNotWiredError,
  fetchFabricStatus,
  fetchFabricWorkspaces,
  isFabricWired,
  isNotWired,
  fabricErrorKind,
  fetchFabricTables,
  refKind,
  refLabel,
  refParts,
  setFabricApi,
  type FabricWorkspace,
} from '../api'

beforeEach(() => {
  setFabricApi({})
})

describe('the seam', () => {
  it('reports itself unwired until something is installed', () => {
    expect(isFabricWired()).toBe(false)
    setFabricApi({ async workspaces() { return { items: [] } } })
    expect(isFabricWired()).toBe(true)
  })

  it('rejects rather than throwing synchronously', async () => {
    // Load-bearing: the views call these as `fn().then().catch()`, and a
    // synchronous throw escapes that entirely and takes out the whole route
    // through React's error boundary. This is that regression.
    let threw = false
    try {
      const promise = fetchFabricStatus()
      expect(promise).toBeInstanceOf(Promise)
      await promise
    } catch {
      threw = true
    }
    expect(threw).toBe(true)
  })

  it('names the missing capability and how to supply it', async () => {
    const err = await fetchFabricWorkspaces().catch((e: unknown) => e)
    expect(isNotWired(err)).toBe(true)
    expect((err as FabricNotWiredError).capability).toBe('workspaces')
    expect((err as Error).message).toContain('setFabricApi')
  })

  it('lets capabilities be wired one at a time', async () => {
    const only: FabricWorkspace[] = [{ id: 'w1', name: 'Analytics' }]
    setFabricApi({ async workspaces() { return { items: only } } })

    await expect(fetchFabricWorkspaces()).resolves.toEqual(only)
    // The one nobody supplied still reports itself, rather than the whole
    // toolkit being all-or-nothing.
    await expect(fetchFabricStatus()).rejects.toThrow(/not wired up/)
  })

  it('replaces the implementation instead of merging into it', async () => {
    setFabricApi({ async status() { return { configured: true } } })
    setFabricApi({ async workspaces() { return { items: [] } } })
    // A merging setter would leave `status` installed and make it impossible
    // to take a capability back out.
    await expect(fetchFabricStatus()).rejects.toThrow(/not wired up/)
  })
})

// The ref helpers are pure and came across untouched, but the whole toolkit
// reads table identity through them, so the shapes they have to survive are
// worth stating.
describe('ref helpers', () => {
  it('splits a fully qualified ref', () => {
    expect(refParts('Analytics/lh_bronze/orders')).toEqual({
      workspace: 'Analytics',
      lakehouse: 'lh_bronze',
      table: 'orders',
      resolved: true,
      kind: 'table',
    })
  })

  it('treats a bare name as unresolved rather than guessing a workspace', () => {
    expect(refParts('orders').resolved).toBe(false)
  })

  it('recognises the raw file layer, which is not a table', () => {
    expect(refKind('Analytics/lh_land/Files%2Forders%2F2024.csv')).toBe('file')
    expect(refKind('Analytics/lh_bronze/orders')).toBe('table')
  })

  it('unescapes a file path back into something readable', () => {
    // `split('/').pop()` returned this still escaped, which is the bug the
    // parsing fallback exists for.
    expect(refLabel('Analytics/lh_land/Files%2Forders%2F2024.csv')).toBe('Files/orders/2024.csv')
  })
})

// Pagination. The convenience functions promise a complete list, and this is
// the part an implementation is most likely to get half right — the shape
// looks fine with one page, which is every demo and every small tenant.
describe('paging', () => {
  const page = (items: string[], cursor?: string) => ({
    items: items.map((id) => ({ id, name: id })),
    ...(cursor ? { cursor } : {}),
  })

  it('walks every page rather than returning the first', async () => {
    setFabricApi({
      async workspaces(options) {
        if (!options?.cursor) return page(['a', 'b'], '1')
        if (options.cursor === '1') return page(['c', 'd'], '2')
        return page(['e'])
      },
    })
    expect((await fetchFabricWorkspaces()).map((w) => w.id)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('stops at the page that carries no cursor', async () => {
    const workspaces = vi.fn().mockResolvedValue(page(['only']))
    setFabricApi({ workspaces })
    await fetchFabricWorkspaces()
    expect(workspaces).toHaveBeenCalledOnce()
  })

  it('passes the caller’s signal through on every page', async () => {
    const controller = new AbortController()
    const workspaces = vi
      .fn()
      .mockResolvedValueOnce(page(['a'], '1'))
      .mockResolvedValueOnce(page(['b']))
    setFabricApi({ workspaces })

    await fetchFabricWorkspaces({ signal: controller.signal })

    expect(workspaces).toHaveBeenCalledTimes(2)
    for (const call of workspaces.mock.calls) {
      expect((call[0] as { signal?: AbortSignal }).signal).toBe(controller.signal)
    }
  })

  it('throws rather than silently truncating an endless cursor', async () => {
    // A service that echoes the same token forever is a bug. Returning what we
    // have would be a short list that looks complete, and someone would act on
    // it — the one failure mode this codebase refuses everywhere else.
    setFabricApi({ async workspaces() { return page(['x'], 'always') } })
    await expect(fetchFabricWorkspaces()).rejects.toThrow(/did not stop paging/)
  })

  it('pages tables too, keyed by the lakehouse asked for', async () => {
    setFabricApi({
      async tables(_ws, lakehouse, options) {
        if (!options?.cursor) return { items: [{ name: `${lakehouse}_1` }], cursor: '1' }
        return { items: [{ name: `${lakehouse}_2` }] }
      },
    })
    expect((await fetchFabricTables('ws', 'lh_gold')).map((t) => t.name)).toEqual([
      'lh_gold_1',
      'lh_gold_2',
    ])
  })
})

describe('error kinds', () => {
  it('reports a missing capability as not-wired, not as a fault', async () => {
    setFabricApi({})
    const err = await fetchFabricWorkspaces().catch((e: unknown) => e)
    expect(fabricErrorKind(err)).toBe('not-wired')
    // And it is a FabricError, so a caller that handles those handles this.
    expect(err).toBeInstanceOf(FabricError)
    expect(err).toBeInstanceOf(FabricNotWiredError)
  })

  it('calls an unrecognised failure unknown rather than guessing', () => {
    expect(fabricErrorKind(new Error('boom'))).toBe('unknown')
  })

  it('keeps forbidden distinct from an empty result', async () => {
    // The distinction the whole toolkit rests on: no permission must never
    // render as "this workspace is empty".
    setFabricApi({
      async workspaces() {
        throw new FabricError('forbidden', 'no access to that workspace', { status: 403 })
      },
    })
    const err = await fetchFabricWorkspaces().catch((e: unknown) => e)
    expect(fabricErrorKind(err)).toBe('forbidden')
    expect((err as FabricError).status).toBe(403)
  })
})
