// One Cosmos DB container, `Models`, holding four document shapes
// distinguished by `type` — a model's current state, its branches, its
// version snapshots, and its shares — all sharing partition key `/modelId`.
//
// WHY ONE CONTAINER, ONE PARTITION KEY PER MODEL: a commit has to update a
// version document AND a branch-head pointer atomically, or a crash between
// the two leaves a branch pointing at nothing. Cosmos's TransactionalBatch
// gives exactly that — a single all-or-nothing write across several
// documents — but ONLY across documents that share a partition key. Keeping
// every document belonging to one model under that model's id as the
// partition key is what makes "commit" and "merge" atomic without a SQL
// transaction. See lib/history.ts's commit() for the batch itself.
//
// AUTH IS KEYLESS: `DefaultAzureCredential` resolves to the Function App's
// Managed Identity in Azure, and to `az login`'s cached credential locally —
// the same pattern the earlier Azure SQL design used, and the reason there is
// no primary key or connection string anywhere in this package's config.
// Cosmos's data-plane RBAC (`Microsoft.DocumentDB/databaseAccounts/*/sqlRoleAssignments`)
// is what actually grants that identity read/write; see infra/main.bicep.
import { CosmosClient, type Container } from '@azure/cosmos'
import { DefaultAzureCredential } from '@azure/identity'

let container: Container | null = null

export function getContainer(): Container {
  if (container) return container
  const endpoint = process.env['COSMOS_ENDPOINT']
  if (!endpoint) throw new Error('COSMOS_ENDPOINT is not set — see local.settings.json.example.')
  const client = new CosmosClient({ endpoint, aadCredentials: new DefaultAzureCredential() })
  container = client.database('odyssey').container('Models')
  return container
}

// --- Document shapes ---------------------------------------------------
//
// `id` is Cosmos's own uniqueness key WITHIN a partition, not a semantic
// field — each type below builds its own to keep the four kinds from
// colliding inside one model's partition (a model doc and a branch named
// after it must not share an id).

export interface ModelDoc {
  id: string
  modelId: string
  type: 'model'
  name: string
  description: string
  tags: string[]
  starred: boolean
  owner?: string
  createdAt: number
  updatedAt: number
  lastViewedAt: number
  /** The graph: layers, transitions, properties, views, assistantInstructions. */
  data: Record<string, unknown>
}

export interface ShareDoc {
  id: string
  modelId: string
  type: 'share'
  email: string
  role: 'viewer' | 'editor'
}

export interface BranchDoc {
  id: string
  modelId: string
  type: 'branch'
  name: string
  head: string | null
}

export interface VersionDoc {
  id: string
  modelId: string
  type: 'version'
  versionId: string
  label: string
  parents: string[]
  createdAt: number
  createdByEmail: string | null
  data: Record<string, unknown>
}

export const modelDocId = (modelId: string) => `model|${modelId}`
export const shareDocId = (modelId: string, email: string) => `share|${modelId}|${email.toLowerCase()}`
export const branchDocId = (modelId: string, name: string) => `branch|${modelId}|${name}`
export const versionDocId = (modelId: string, versionId: string) => `version|${modelId}|${versionId}`
