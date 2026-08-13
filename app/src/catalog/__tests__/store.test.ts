import { beforeEach, describe, expect, it } from 'vitest'
import { localCatalogStore } from '../store'
import { findTaxonomyNode, flattenTaxonomy, taxonomyLabel } from '../taxonomy'
import type { PublishInput } from '../types'

const input = (over: Partial<PublishInput> = {}): PublishInput => ({
  modelId: 'model-1',
  name: 'Customer lineage',
  description: '',
  domainPath: ['sales', 'sales-emea'],
  dataProduct: 'Customer 360',
  application: 'Power BI',
  owner: 'someone@cclgroup.com',
  publishedBy: 'someone@cclgroup.com',
  ...over,
})

describe('localCatalogStore', () => {
  beforeEach(() => localStorage.clear())

  it('publishes a new entry', async () => {
    const entry = await localCatalogStore.publish(input())
    expect(entry.modelId).toBe('model-1')
    expect(await localCatalogStore.list()).toHaveLength(1)
  })

  it('republishing the same model replaces its entry rather than adding one', async () => {
    const first = await localCatalogStore.publish(input())
    const second = await localCatalogStore.publish(input({ dataProduct: 'Order Fulfilment' }))

    const all = await localCatalogStore.list()
    expect(all).toHaveLength(1)
    expect(second.id).toBe(first.id)
    expect(second.dataProduct).toBe('Order Fulfilment')
    expect(second.publishedAt).toBe(first.publishedAt)
  })

  it('unpublish removes the entry', async () => {
    const entry = await localCatalogStore.publish(input())
    await localCatalogStore.unpublish(entry.id)
    expect(await localCatalogStore.list()).toHaveLength(0)
  })
})

describe('taxonomy', () => {
  it('finds a nested node by its id path', () => {
    expect(findTaxonomyNode(['sales', 'sales-emea', 'sales-emea-retail'])?.name).toBe('Retail')
  })

  it('returns null for a path that does not resolve', () => {
    expect(findTaxonomyNode(['nope'])).toBeNull()
    expect(findTaxonomyNode(['sales', 'nope'])).toBeNull()
  })

  it('flattens every node with its depth and full path', () => {
    const flat = flattenTaxonomy()
    const retail = flat.find((n) => n.id === 'sales-emea-retail')
    expect(retail).toMatchObject({ depth: 2, path: ['sales', 'sales-emea', 'sales-emea-retail'] })
  })

  it('labels a path by joining node names', () => {
    expect(taxonomyLabel(['sales', 'sales-emea'])).toBe('Sales / EMEA')
  })
})
