// The history dock. The diff itself is covered in versionDiff.test.ts; this
// covers the part that makes restoring safe — that you cannot reach the button
// without first being shown what it will change.
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VersionsPanel } from '../VersionsPanel'
import { localStore } from '../../model/store'
import type { LineageModel } from '../../model/types'

const model = (over: Partial<LineageModel> = {}): LineageModel => ({
  id: 'm1',
  name: 'Sales',
  createdAt: 0,
  updatedAt: 0,
  layers: [{ id: 'L1', name: 'Raw', objects: [{ id: 'o1', name: 'orders', children: [] }] }],
  transitions: [],
  properties: {},
  ...over,
})

beforeEach(() => {
  localStorage.clear()
})

async function seed(snapshot: LineageModel, label = 'before the big change') {
  await localStore.save(snapshot)
  await localStore.saveVersion(snapshot.id, label)
}

describe('VersionsPanel', () => {
  it('explains itself when there is no history yet', async () => {
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)
    expect(await screen.findByText(/No versions yet/)).toBeInTheDocument()
  })

  it('saves a snapshot under a name', async () => {
    const user = userEvent.setup()
    await localStore.save(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('Version name'), 'v1')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(async () =>
      expect(await localStore.listVersions('m1')).toHaveLength(1),
    )
    expect(await screen.findByText('v1')).toBeInTheDocument()
  })

  it('does not offer to restore until the diff has been shown', async () => {
    const user = userEvent.setup()
    await seed(model())
    // The open model has an object the snapshot does not.
    const current = model({
      layers: [
        {
          id: 'L1',
          name: 'Raw',
          objects: [
            { id: 'o1', name: 'orders', children: [] },
            { id: 'o2', name: 'items', children: [] },
          ],
        },
      ],
    })
    render(<VersionsPanel model={current} onRestore={vi.fn()} onClose={vi.fn()} />)

    // Nothing to restore with until a version is examined.
    expect(screen.queryByRole('button', { name: /Restore/ })).not.toBeInTheDocument()

    await user.click(await screen.findByText('before the big change'))

    // The diff is phrased as what restoring COSTS.
    expect(await screen.findByText(/1 added since/)).toBeInTheDocument()
    expect(screen.getByText(/restoring removes it/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Restore this version/ })).toBeEnabled()
  })

  it('hands back the snapshot graph but keeps the model identity', async () => {
    const user = userEvent.setup()
    await seed(model())
    const current = model({
      name: 'Sales renamed',
      layers: [{ id: 'L1', name: 'Raw', objects: [] }],
    })
    const onRestore = vi.fn()
    render(<VersionsPanel model={current} onRestore={onRestore} onClose={vi.fn()} />)

    await user.click(await screen.findByText('before the big change'))
    await user.click(screen.getByRole('button', { name: /Restore this version/ }))

    await waitFor(() => expect(onRestore).toHaveBeenCalled())
    const restored = onRestore.mock.calls[0][0] as LineageModel
    // The graph comes from the snapshot...
    expect(restored.layers[0].objects.map((o) => o.id)).toEqual(['o1'])
    // ...but the id and the current name are untouched: restoring must not move
    // the route or resurrect an old title.
    expect(restored.id).toBe('m1')
    expect(restored.name).toBe('Sales renamed')
  })

  it('refuses to restore a version identical to what is open', async () => {
    const user = userEvent.setup()
    await seed(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)
    await user.click(await screen.findByText('before the big change'))
    expect(await screen.findByText(/Identical to the model you have open/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Nothing to restore/ })).toBeDisabled()
  })
})

// Branching. The rule these all circle is that nothing the panel does may lose
// work you can see — switching away commits first, and a merge reports what it
// decided rather than deciding quietly.
describe('VersionsPanel branches', () => {
  const withLayer = (name: string) =>
    model({ layers: [{ id: 'L1', name, objects: [{ id: 'o1', name: 'orders', children: [] }] }] })

  it('starts on main', async () => {
    await localStore.save(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)
    expect(await screen.findByLabelText('Branch')).toHaveValue('main')
    // Nothing to merge from main into itself.
    expect(screen.queryByRole('button', { name: /Merge/ })).not.toBeInTheDocument()
  })

  it('creates a branch and switches onto it', async () => {
    const user = userEvent.setup()
    await seed(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)

    await user.click(await screen.findByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByLabelText('Branch')).toHaveValue('rework')
    expect(screen.getByRole('button', { name: /Merge rework into main/ })).toBeInTheDocument()
  })

  it('surfaces a duplicate branch name instead of failing silently', async () => {
    const user = userEvent.setup()
    await seed(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onClose={vi.fn()} />)

    await user.click(await screen.findByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    await screen.findByLabelText('Branch')

    await user.click(screen.getByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText(/already exists/)).toBeInTheDocument()
  })

  it('commits work in progress before switching away, so nothing is stranded', async () => {
    const user = userEvent.setup()
    await seed(model())
    render(<VersionsPanel model={model()} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />)

    await user.click(await screen.findByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(screen.getByLabelText('Branch')).toHaveValue('rework'))

    await user.selectOptions(screen.getByLabelText('Branch'), 'main')

    expect(await screen.findByText(/Work in progress on rework/)).toBeInTheDocument()
    expect(screen.getByLabelText('Branch')).toHaveValue('main')
  })

  it('reports a fast-forward rather than inventing a merge', async () => {
    const user = userEvent.setup()
    await seed(model())
    const { rerender } = render(
      <VersionsPanel model={model()} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )

    await user.click(await screen.findByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(screen.getByLabelText('Branch')).toHaveValue('rework'))

    // Do some work on the branch, then merge back into an untouched main.
    rerender(
      <VersionsPanel model={withLayer('Bronze')} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )
    await user.type(screen.getByLabelText('Version name'), 'renamed the layer')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await screen.findByText('renamed the layer')

    await user.click(screen.getByRole('button', { name: /Merge rework into main/ }))
    expect(await screen.findByText(/Fast-forwarded/)).toBeInTheDocument()
  })

  it('names what a conflicting merge kept and what it discarded', async () => {
    const user = userEvent.setup()
    await seed(model())
    const { rerender } = render(
      <VersionsPanel model={model()} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )

    // Branch, rename the layer there.
    await user.click(await screen.findByRole('button', { name: 'New branch' }))
    await user.type(screen.getByLabelText('New branch name'), 'rework')
    await user.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(screen.getByLabelText('Branch')).toHaveValue('rework'))

    rerender(
      <VersionsPanel model={withLayer('Bronze')} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )
    await user.type(screen.getByLabelText('Version name'), 'bronze')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await screen.findByText('bronze')

    // Back on main, rename the same layer differently.
    await user.selectOptions(screen.getByLabelText('Branch'), 'main')
    await waitFor(() => expect(screen.getByLabelText('Branch')).toHaveValue('main'))
    rerender(
      <VersionsPanel model={withLayer('Landing')} onRestore={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )
    await user.type(screen.getByLabelText('Version name'), 'landing')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await screen.findByText('landing')

    // Merge the branch in from the branch itself.
    await user.selectOptions(screen.getByLabelText('Branch'), 'rework')
    await waitFor(() => expect(screen.getByLabelText('Branch')).toHaveValue('rework'))
    await user.click(screen.getByRole('button', { name: /Merge rework into main/ }))

    expect(await screen.findByText(/with 1 conflict/)).toBeInTheDocument()
    expect(screen.getByText(/both sides renamed it/)).toBeInTheDocument()
  })
})
