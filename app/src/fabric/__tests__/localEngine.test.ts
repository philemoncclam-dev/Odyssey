// The browser half of the sandbox bridge. The engine and the HTTP endpoint are
// covered by tests/test_sandbox_service.py; what matters here is that this
// side installs cleanly as a FabricApi and that its two failure messages —
// which are the whole reason it is not a bare fetch — say the useful thing.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fabricErrorKind,
  fetchFabricWorkspaces,
  runSandbox,
  setFabricApi,
  type FabricError,
} from '../api'
import { DEFAULT_SANDBOX_URL, localSandboxApi } from '../localEngine'

const CELLS = { cells: ['spark.sql("SELECT 1")'] }

const ok = (body: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: async () => body } as unknown as Response)

/** A failed Response complete enough for the error mapper, which reads text and headers. */
const response = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  ({
    ok: false,
    status,
    text: async () => JSON.stringify(body),
    headers: { get: (k: string) => headers[k] ?? null },
  }) as unknown as Response

beforeEach(() => {
  setFabricApi(localSandboxApi())
})

afterEach(() => {
  vi.unstubAllGlobals()
  setFabricApi({})
})

describe('localSandboxApi', () => {
  it('wires only the sandbox, leaving the Fabric half unwired', async () => {
    // The engine holds no credential and browses nothing, so installing it
    // must not make the workspace tree look connected.
    await expect(fetchFabricWorkspaces()).rejects.toThrow(/not wired up/)
  })

  it('posts the run to the engine endpoint', async () => {
    const fetchMock = ok({ ok: true, engine: 'stub', reads: [], writes: [] })
    vi.stubGlobal('fetch', fetchMock)

    await runSandbox(CELLS)

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${DEFAULT_SANDBOX_URL}/sandbox/run`)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual(CELLS)
  })

  it('does not double the slash when the URL has a trailing one', async () => {
    const fetchMock = ok({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    setFabricApi(localSandboxApi('http://127.0.0.1:9999/'))

    await runSandbox(CELLS)

    expect(fetchMock.mock.calls[0]![0]).toBe('http://127.0.0.1:9999/sandbox/run')
  })

  it('says how to start the engine when nothing is listening', async () => {
    // `fetch` reports a dead endpoint as a bare "Failed to fetch", which sends
    // people looking at their notebook rather than at the terminal they forgot.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(runSandbox(CELLS)).rejects.toThrow(/python -m sandbox\.service/)
  })

  it('surfaces the endpoint’s own explanation of a bad request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(400, { error: 'This bridge runs cells you send it.' })))
    await expect(runSandbox(CELLS)).rejects.toThrow('This bridge runs cells you send it.')
  })

  // The reason a call failed, in the terms the UI has to act on differently.
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [429, 'throttled'],
    [503, 'unavailable'],
    [418, 'unknown'],
  ])('maps %i to %s', async (status, kind) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(status, { error: 'nope' })))
    const err = await runSandbox(CELLS).catch((e: unknown) => e)
    expect(fabricErrorKind(err)).toBe(kind)
  })

  it('carries Retry-After, because the answer to a 429 is how long to wait', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response(429, { error: 'slow down' }, { 'Retry-After': '30' })),
    )
    const err = (await runSandbox(CELLS).catch((e: unknown) => e)) as FabricError
    expect(err.kind).toBe('throttled')
    expect(err.retryAfterSeconds).toBe(30)
  })

  it('passes the abort signal to fetch, and names a cancellation as one', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn().mockImplementation(() => {
      controller.abort()
      return Promise.reject(new DOMException('aborted', 'AbortError'))
    })
    vi.stubGlobal('fetch', fetchMock)

    const err = (await runSandbox(CELLS, { signal: controller.signal }).catch(
      (e: unknown) => e,
    )) as FabricError
    // A request the caller cancelled is not a fault to report as one.
    expect(err.message).toMatch(/cancelled/i)
    expect((fetchMock.mock.calls[0]![1] as RequestInit).signal).toBe(controller.signal)
  })

  it('refuses a notebook id without a round trip', async () => {
    const fetchMock = ok({})
    vi.stubGlobal('fetch', fetchMock)

    // The engine analyses cells. Running a notebook by id means fetching it
    // from Fabric first, which is a different capability.
    await expect(runSandbox({ workspace_id: 'w1', item_id: 'n1' })).rejects.toThrow(
      /notebookSource/,
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
