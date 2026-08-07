// A FabricApi implementation backed by the in-tree sandbox engine.
//
// `sandbox/` at the repo root is the real thing: it spawns an isolated
// subprocess with a scrubbed environment, runs a notebook's cells, and derives
// column-level lineage from Spark's analyzed plans (or, without a JVM, from
// the SQL text via sqlglot). What it is not is reachable from a browser, so
// `sandbox/service.py` puts one HTTP endpoint in front of it and this connects
// to that.
//
// ONLY the sandbox capabilities are implemented here. Nothing in this file
// talks to Microsoft Fabric, because the engine does not: it analyses cells it
// is handed and holds no credential. Browsing workspaces, reading a notebook's
// source and fetching table schemas are all still unwired, and deliberately
// separate — see `setFabricApi` in api.ts and docs/fabric-toolkit-wiring.md.
//
// The practical consequence, stated plainly because it is easy to be surprised
// by: with only this installed, the sandbox will RUN but the Explore tree has
// nothing in it, and the tree is where sequence steps come from. To drive the
// sandbox from the UI you also need `items` and `notebookSource` wired against
// a real Fabric. To drive it from code — a test, a script, a fixture — this is
// enough on its own.

import {
  FabricError,
  fabricErrorFromResponse,
  type FabricApi,
  type FabricCallOptions,
  type SandboxRunRequest,
  type SandboxRunResult,
} from './api'

/** Default endpoint of `python -m sandbox.service`. */
export const DEFAULT_SANDBOX_URL = 'http://127.0.0.1:8765'

async function postJson<T>(
  url: string,
  body: unknown,
  options?: FabricCallOptions,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...(options?.signal ? { signal: options.signal } : {}),
    })
  } catch (cause) {
    // An aborted request is not a failure to report — the caller asked for it,
    // usually by navigating away — so it keeps its own kind and its own words.
    if (options?.signal?.aborted) {
      throw new FabricError('network', 'The sandbox run was cancelled.', { cause })
    }
    // A dead endpoint is the overwhelmingly likely failure here and `fetch`
    // reports it as a bare "Failed to fetch", which sends people looking at
    // their notebook rather than at the terminal they forgot to start.
    throw new FabricError(
      'network',
      `Could not reach the sandbox engine at ${url}. Start it with ` +
        '`python -m sandbox.service` from the repository root.',
      { cause },
    )
  }
  // The bridge answers a bad request with `{ error }`, and the mapping from
  // status to reason lives in one place for every implementation to share.
  if (!res.ok) throw await fabricErrorFromResponse(res, 'sandbox run')
  return res.json() as Promise<T>
}

/**
 * The sandbox capabilities, pointed at a running `sandbox.service`.
 *
 * Spread it into whatever else is wired, so the Fabric half can be added
 * independently:
 *
 *     setFabricApi({ ...localSandboxApi(), ...myFabricApi })
 */
export function localSandboxApi(baseUrl: string = DEFAULT_SANDBOX_URL): FabricApi {
  const base = baseUrl.replace(/\/+$/, '')
  return {
    async runSandbox(
      body: SandboxRunRequest,
      options?: FabricCallOptions,
    ): Promise<SandboxRunResult> {
      if (!body.cells?.length) {
        // The engine analyses cells. Asking it to run a notebook by id means
        // fetching that notebook from Fabric first, which is a different
        // capability and a credential this side does not hold. Saying so beats
        // a run that reports a notebook touching nothing.
        throw new FabricError(
          'not-found',
          'The local sandbox engine runs cells, not notebook ids. Wire the ' +
            '`notebookSource` capability so the toolkit can fetch a notebook’s ' +
            'source, or send cells directly.',
        )
      }
      return postJson<SandboxRunResult>(`${base}/sandbox/run`, body, options)
    },
  }
}
