// Fabric Toolkit layout — the shared top bar, the tab strip, and the outlet.
//
// The toolkit's pages used to be reached from the shell's icon rail. They are
// not any more: the Fabric pages are chromeless like the Model Browser, so the
// bar below is the only navigation they have, and it carries the same mark
// that toggles back to Modeling. One bar in the layout rather than one per
// page — a tab strip that disagreed with itself between tabs would be worse
// than no tab strip.
//
// Only the two salvaged pages are listed. The prototype also had Overview and
// item-level Lineage; neither was brought across, and a tab pointing at a
// route that does not exist is the bug this replaced.
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { PageHeader } from '../../shell/PageHeader'
import './fabricShell.css'

export const Route = createFileRoute('/fabric')({
  component: FabricLayout,
})

const TABS = [
  { to: '/fabric/explore', label: 'Explore' },
  { to: '/fabric/integrations', label: 'Integrations' },
] as const

function FabricLayout() {
  return (
    <div className="fxs">
      <PageHeader mode="fabric" title="Fabric Toolkit">
        <nav className="fxs-tabs" aria-label="Fabric Toolkit sections">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to as never}
              className="fxs-tab"
              // activeProps rather than a pathname comparison: the router
              // already knows, and a hand-rolled startsWith is how the
              // /models vs /model/<id> prefix bug gets written a second time.
              activeProps={{ 'data-current': true }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <div className="fxs-body">
        <Outlet />
      </div>
    </div>
  )
}
