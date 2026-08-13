import { beforeEach, describe, expect, it } from 'vitest'
import { localCatalogStore } from '../store'
import { catalogHistory, catalogHistoryFor } from '../history'
import type { PublishInput } from '../types'

const input = (over: Partial<PublishInput> = {}): PublishInput => ({
  modelId: 'model-1',
  name: 'Customer lineage',
  description: '',
  domainPath: ['sales'],
  dataProduct: 'Customer 360',
  application: 'Power BI',
  owner: 'someone@cclgroup.com',
  publishedBy: 'someone@cclgroup.com',
  ...over,
})

describe('catalog history', () => {
  beforeEach(() => localStorage.clear())

  it('logs a first publish', async () => {
    await localCatalogStore.publish(input())
    const log = await catalogHistory()
    expect(log).toHaveLength(1)
    expect(log[0]?.action).toBe('published')
    expect(log[0]?.summary).toBe('')
  })

  it('logs a republish as a rebind, with a summary of what changed', async () => {
    await localCatalogStore.publish(input())
    await localCatalogStore.publish(input({ dataProduct: 'Order Fulfilment' }))

    const log = await catalogHistory()
    expect(log).toHaveLength(2)
    // Newest first.
    expect(log[0]?.action).toBe('republished')
    expect(log[0]?.summary).toBe('Changed data product')
    expect(log[1]?.action).toBe('published')
  })

  it('logs an unpublish, keyed to the entry it removed', async () => {
    const entry = await localCatalogStore.publish(input())
    await localCatalogStore.unpublish(entry.id)

    const log = await catalogHistory()
    expect(log[0]?.action).toBe('unpublished')
    expect(log[0]?.catalogEntryId).toBe(entry.id)
  })

  it('filters to one entry’s history', async () => {
    const a = await localCatalogStore.publish(input({ modelId: 'a' }))
    await localCatalogStore.publish(input({ modelId: 'b', name: 'Other' }))

    const forA = await catalogHistoryFor(a.id)
    expect(forA).toHaveLength(1)
    expect(forA[0]?.modelId).toBe('a')
  })
})
