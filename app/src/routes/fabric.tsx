// Fabric Toolkit.
//
// The mode has existed in the shell's config since the port — `railConfig`
// still lists Overview, Explore, Lineage and Integrations for it — but the
// pages behind those entries were never ported. They were the half of the
// prototype that talked to the Fabric REST API with a service account, and
// ADR-0001 removed that rather than stubbing it. So the mode menu and the rail
// have been pointing at /fabric/overview, a route that does not exist.
//
// This route is the honest floor under that: it exists, it is reachable, and
// it says what is not here rather than pretending. It is NOT a stub of the
// toolkit's features — a fake Explore tree showing invented workspaces would
// be worse than an empty page, because the first thing anyone would do is
// trust it.
//
// What has to come back before this page has content is written down in
// ADR-0004's consequences: the server-side Fabric API layer. Explore mode is
// where "append a real data asset to a model" starts, and that requires
// credentials this app deliberately does not hold.
import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../shell/PageHeader'
import './fabric.css'

export const Route = createFileRoute('/fabric')({
  component: FabricToolkit,
})

function FabricToolkit() {
  return (
    <div className="fx">
      <PageHeader mode="fabric" title="Fabric Toolkit" />
      <div className="fx-body">
        <div className="fx-empty">
          <h2 className="fx-empty-title">Nothing here yet</h2>
          <p>
            The Fabric Toolkit browses a real Microsoft Fabric estate — workspaces,
            lakehouses, tables and their columns — so a model can be drawn against
            assets that actually exist rather than typed from memory.
          </p>
          <p>
            None of it can run in the browser alone. Reading a Fabric workspace
            needs credentials, and Odyssey holds none by design: there is no
            server, no sign-in and no service account today. The toolkit returns
            when that server does.
          </p>
        </div>
      </div>
    </div>
  )
}
