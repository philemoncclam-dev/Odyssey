// Access control, checked in application code.
//
// A model that EXISTS but the caller can't see returns 403, not 404 —
// deliberately, matching this codebase's existing stance on the same
// question for Fabric access (docs/fabric-toolkit-wiring.md: "forbidden is
// the load-bearing one... an integration that collapses 401 and 403 sends
// people to reset a token when the answer is 'ask for access'"). The
// trade-off is the same one made there: a model's existence is not treated
// as secret, because "ask the owner for access" is a more useful answer than
// an indistinguishable-from-deleted 404.
//
// Both reads below are Cosmos POINT READS (exact id + partition key), the
// cheapest possible operation in RU terms — this runs on every request, so
// it is worth it staying that cheap rather than becoming a query.
import type { Container } from '@azure/cosmos'
import { modelDocId, shareDocId, type ModelDoc, type ShareDoc } from './cosmos.js'

export type Role = 'owner' | 'editor' | 'viewer'

export interface Access {
  exists: boolean
  /** null when the model exists but this caller has no grant on it at all. */
  role: Role | null
  /** The model document, when it exists — handlers that already need it avoid a second read. */
  doc: ModelDoc | null
}

export async function resolveAccess(container: Container, modelId: string, email: string): Promise<Access> {
  const { resource: model } = await container.item(modelDocId(modelId), modelId).read<ModelDoc>()
  if (!model) return { exists: false, role: null, doc: null }
  if (model.owner?.toLowerCase() === email.toLowerCase()) return { exists: true, role: 'owner', doc: model }

  const { resource: share } = await container
    .item(shareDocId(modelId, email), modelId)
    .read<ShareDoc>()
  return { exists: true, role: share?.role ?? null, doc: model }
}

export const canRead = (access: Access): boolean => access.role !== null
export const canWrite = (access: Access): boolean => access.role === 'owner' || access.role === 'editor'
export const isOwner = (access: Access): boolean => access.role === 'owner'
