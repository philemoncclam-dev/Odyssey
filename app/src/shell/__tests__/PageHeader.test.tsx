// The mark in this header is the only way between the two landing screens —
// both are chromeless, so there is no rail and no mode menu to fall back on.
// If it stops being a link, or points at the screen it is already on, the two
// halves of the app become unreachable from each other.
import { render, screen } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { PageHeader } from '../PageHeader'

/** A router with both landing paths, so the links resolve rather than throw. */
function renderAt(mode: 'model' | 'fabric', title: string) {
  const rootRoute = createRootRoute()
  const page = () => <PageHeader mode={mode} title={title} />
  const routeTree = rootRoute.addChildren([
    createRoute({ getParentRoute: () => rootRoute, path: '/models', component: page }),
    createRoute({ getParentRoute: () => rootRoute, path: '/fabric', component: page }),
  ])
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [mode === 'model' ? '/models' : '/fabric'] }),
  })
  return render(<RouterProvider router={router as never} />)
}

describe('PageHeader', () => {
  it('points the mark at the Fabric Toolkit from Models', async () => {
    renderAt('model', 'Models')
    const toggle = await screen.findByRole('link', { name: 'Switch to Fabric Toolkit' })
    expect(toggle).toHaveAttribute('href', '/fabric')
  })

  it('points it back at Modeling from the Fabric Toolkit', async () => {
    renderAt('fabric', 'Fabric Toolkit')
    const toggle = await screen.findByRole('link', { name: 'Switch to Modeling' })
    expect(toggle).toHaveAttribute('href', '/models')
  })

  it('names where it goes, not what the app is called', async () => {
    renderAt('model', 'Models')
    // "Odyssey" would describe the logo, not the control — a screen-reader user
    // would have no idea it switches anything.
    expect(screen.queryByRole('link', { name: /Odyssey/ })).not.toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Models' })).toBeInTheDocument()
  })
})
