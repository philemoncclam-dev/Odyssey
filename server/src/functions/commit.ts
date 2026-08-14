// POST /api/models/{id}/commit — save the current graph AND snapshot it onto
// a branch, atomically.
//
// This replaces what used to be two unguarded calls (PUT the model, then
// POST a version) with one TransactionalBatch: replace the model document,
// create the version document, and move the branch's head — all three or
// none. The old two-step version left a real gap: a crash (or a second
// writer) between the two calls could save the model without ever
// snapshotting it, silently breaking "restore this version" for an edit
// nobody meant to lose. See lib/cosmos.ts's header for why a batch is even
// possible here (everything for one model shares its partition key).
import { app } from '@azure/functions'
import type { ItemDefinition } from '@azure/cosmos'
import { randomUUID } from 'node:crypto'
import {
  getContainer,
  modelDocId,
  branchDocId,
  versionDocId,
  type ModelDoc,
  type BranchDoc,
  type VersionDoc,
} from '../lib/cosmos.js'
import { withAuth, json, notFound, forbidden, badRequest } from '../lib/http.js'
import { resolveAccess, canWrite } from '../lib/access.js'

app.http('model-commit', {
  methods: ['POST'],
  route: 'models/{id}/commit',
  authLevel: 'anonymous',
  handler: withAuth(async (req, user) => {
    const id = req.params['id']!
    const container = getContainer()
    const access = await resolveAccess(container, id, user.email)
    if (!access.exists) throw notFound('Model')
    if (!canWrite(access)) throw forbidden('commit to this model')

    const body = (await req.json().catch(() => null)) as {
      model?: Record<string, unknown>
      label?: string
      branch?: string
      /** Explicit for a merge commit (two parents); omitted for an ordinary one (the branch's current head, or none). */
      parents?: string[]
    } | null
    const label = body?.label?.trim()
    const branchName = body?.branch?.trim() || 'main'
    if (!body?.model || typeof body.model['name'] !== 'string') throw badRequest('Not a valid model document.')
    if (!label) throw badRequest('A commit needs a label.')

    const { resource: branch } = await container.item(branchDocId(id, branchName), id).read<BranchDoc>()
    if (!branch) throw notFound(`Branch "${branchName}"`)

    const now = Date.now()
    const versionId = randomUUID()
    const { layers, transitions, properties, views, assistantInstructions, ...meta } = body.model
    const data = { layers, transitions, properties, views, assistantInstructions }

    const nextModel: ModelDoc = {
      ...access.doc!,
      name: body.model['name'] as string,
      description: typeof meta['description'] === 'string' ? meta['description'] : access.doc!.description,
      tags: Array.isArray(meta['tags']) ? (meta['tags'] as string[]) : access.doc!.tags,
      starred: typeof meta['starred'] === 'boolean' ? meta['starred'] : access.doc!.starred,
      updatedAt: now,
      data,
    }
    const version: VersionDoc = {
      id: versionDocId(id, versionId),
      modelId: id,
      type: 'version',
      versionId,
      label,
      parents: body.parents ?? (branch.head ? [branch.head] : []),
      createdAt: now,
      createdByEmail: user.email,
      data,
    }
    const nextBranch: BranchDoc = { ...branch, head: versionId }

    await container.items.batch(
      [
        { operationType: 'Replace', id: modelDocId(id), resourceBody: nextModel as unknown as ItemDefinition },
        { operationType: 'Create', resourceBody: version as unknown as ItemDefinition },
        {
          operationType: 'Replace',
          id: branchDocId(id, branchName),
          resourceBody: nextBranch as unknown as ItemDefinition,
        },
      ],
      id,
    )

    return json(201, { versionId, branch: branchName, savedAt: now })
  }),
})
