import { useCallback, useEffect, useState } from 'react'
import { localCatalogStore } from '../catalog/store'
import type { CatalogEntry } from '../catalog/types'

/** Loads every published entry and exposes an unpublish action, shared by all three views. */
export function useCatalog() {
  const [entries, setEntries] = useState<CatalogEntry[] | null>(null)

  const reload = useCallback(() => {
    void localCatalogStore.list().then(setEntries)
  }, [])

  useEffect(() => reload(), [reload])

  const unpublish = useCallback(
    (entry: CatalogEntry) => {
      void localCatalogStore.unpublish(entry.id).then(reload)
    },
    [reload],
  )

  return { entries, reload, unpublish }
}
