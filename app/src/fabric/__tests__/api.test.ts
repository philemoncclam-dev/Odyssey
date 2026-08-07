// The wiring seam. These are the promises `src/fabric/api.ts` makes to whoever
// plugs a real Fabric backend in, so they are worth pinning down.
import { beforeEach, describe, expect, it } from 'vitest'

import {
  FabricNotWiredError,
  fetchFabricStatus,
  fetchFabricWorkspaces,
  isFabricWired,
  isNotWired,
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
    setFabricApi({ async workspaces() { return [] } })
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
    setFabricApi({ async workspaces() { return only } })

    await expect(fetchFabricWorkspaces()).resolves.toEqual(only)
    // The one nobody supplied still reports itself, rather than the whole
    // toolkit being all-or-nothing.
    await expect(fetchFabricStatus()).rejects.toThrow(/not wired up/)
  })

  it('replaces the implementation instead of merging into it', async () => {
    setFabricApi({ async status() { return { configured: true } } })
    setFabricApi({ async workspaces() { return [] } })
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
