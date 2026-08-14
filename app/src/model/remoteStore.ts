// A `ModelStore` backed by the server/ API — Azure SQL behind Azure
// Functions, validated Entra tokens, owner/editor/viewer sharing.
//
// UNVERIFIED, same caveat as fabric/realApi.ts: written against the server/
// contract with no deployed instance to test against end-to-end. The shapes
// are pinned down on both sides (server/src/functions/*.ts return exactly
// what this file expects), but the first real round trip is the actual test.
//
// This is a straight `ModelStore` implementation — see model/store.ts's
// header for why that is the whole story: nothing else in the app needs to
// change to use this, only which store the twelve call sites import.
import { acquireModelApiToken } from '../auth/AuthProvider'
import { normalize } from './store'
import type { LineageModel, ModelSummary } from './types'
import type { MetaPatch, ModelStore, ModelVersion } from './store'

function baseUrl(): string {
  const url = import.meta.env['VITE_MODEL_API_URL']
  if (!url) throw new Error('VITE_MODEL_API_URL is not set — see server/README.md.')
  return url.replace(/\/+$/, '')
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** True for the one status every caller here treats as "not there" rather than an error. */
export const isNotFoundError = (err: unknown): boolean => err instanceof ApiError && err.status === 404

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await acquireModelApiToken()
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
  if (res.status === 204) return undefined as T
  const body = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null
  if (!res.ok) {
    const message = (body as { error?: string } | null)?.error ?? `Request failed (${res.status}).`
    throw new ApiError(res.status, message)
  }
  return body as T
}

export const remoteStore: ModelStore = {
  async list() {
    return call<ModelSummary[]>('/api/models')
  },

  async get(id) {
    try {
      return normalize(await call<LineageModel>(`/api/models/${id}`))
    } catch (err) {
      if (isNotFoundError(err)) return null
      throw err
    }
  },

  async save(model) {
    await call(`/api/models/${model.id}`, { method: 'PUT', body: JSON.stringify(model) })
  },

  async remove(id) {
    await call(`/api/models/${id}`, { method: 'DELETE' })
  },

  async removeMany(ids) {
    // Concurrent, not sequential: this is N independent DELETEs, and a shop
    // deleting a batch of models is exactly the case where waiting on each
    // one in turn is felt.
    await Promise.all(ids.map((id) => remoteStore.remove(id)))
  },

  async create(name) {
    return call<LineageModel>('/api/models', { method: 'POST', body: JSON.stringify({ name }) })
  },

  async duplicate(id, name) {
    const source = await remoteStore.get(id)
    if (!source) throw new Error(`No model ${id} to duplicate`)
    // Two round trips, not a dedicated endpoint: POST creates an empty row
    // (so it gets a fresh id and an owner stamp from the server, not the
    // client), and PUT fills it with the copied graph. A third endpoint just
    // to skip one request is not worth the API surface for an action nobody
    // does in a loop.
    const created = await remoteStore.create(name ?? `${source.name} (copy)`)
    const now = Date.now()
    const copy: LineageModel = {
      ...structuredClone(source),
      id: created.id,
      name: created.name,
      owner: created.owner,
      sharedWith: undefined,
      createdAt: created.createdAt,
      updatedAt: now,
      lastViewedAt: now,
    }
    await remoteStore.save(copy)
    return copy
  },

  async patchMeta(id, patch) {
    const clean: MetaPatch = { ...patch }
    await call(`/api/models/${id}/meta`, { method: 'PATCH', body: JSON.stringify(clean) })
  },

  async touch(id) {
    await call(`/api/models/${id}/touch`, { method: 'POST' })
  },

  async listVersions(id) {
    return call<Omit<ModelVersion, 'model'>[]>(`/api/models/${id}/versions`)
  },

  async saveVersion(id, label) {
    await call(`/api/models/${id}/versions`, { method: 'POST', body: JSON.stringify({ label }) })
  },

  async getVersion(modelId, versionId) {
    try {
      return await call<LineageModel>(`/api/models/${modelId}/versions/${versionId}`)
    } catch (err) {
      if (isNotFoundError(err)) return null
      throw err
    }
  },
}
