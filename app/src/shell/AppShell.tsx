// Mode-based shell chrome: app-logo mode menu, per-mode data-driven icon rail,
// rail-bottom cluster, and the canvas region wrapping <Outlet/>.
import { type ReactNode, useEffect, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useRouterState } from '@tanstack/react-router'
import Rail from './Rail'
import RailBottomCluster from './RailBottomCluster'
import { isChromeless, isFullBleedPath, modeFromPathname, railConfig } from './railConfig'
import { requestSearch } from './searchBridge'
import { GlobalSearch } from './GlobalSearch'
import { OnboardingTour, hasSeenOnboarding, markOnboardingSeen } from './OnboardingTour'
import '../styles/components.css'
import '../styles/shell.css'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const mode = modeFromPathname(pathname)

  // Shown once, ever, wherever someone happens to land first — not gated to
  // /models, since Odyssey's other entry points (a shared model link, a
  // catalog link) are just as plausible a first page.
  const [onboardingOpen, setOnboardingOpen] = useState(() => !hasSeenOnboarding())
  const closeOnboarding = () => {
    markOnboardingSeen()
    setOnboardingOpen(false)
  }
  // Search belongs to whichever page is on screen first — the Model Browser
  // searches saved models, the Model Viewer searches the open one, and both
  // claim the trigger through searchBridge. GlobalSearch is the fallback for
  // everywhere neither does (the catalog views, Explore): one search across
  // every model and catalog entry, not scoped to whatever screen is up.
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const openSearch = () => {
    if (!requestSearch()) setGlobalSearchOpen(true)
  }

  // Global Cmd+K listener — the shell owns this once; the rail-bottom search
  // button is the second of the two triggers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (!requestSearch()) setGlobalSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Tooltip.Provider delayDuration={300}>
      {/* data-mode drives the rail's contents; data-fullbleed is what actually
          opts a route into the floating-rail canvas (see shell.css). They are
          separate because Modeling contains both the Model Viewer, which needs
          it, and the Model Browser, which is an ordinary page. */}
      <div className="shell" data-mode={mode} data-fullbleed={isFullBleedPath(pathname) || undefined}>
        {!isChromeless(pathname) && (
          <div className="shell-rail-col">
            {/* No mark at the top of the rail. Every screen that has one now
                carries it in its own top bar — the Model Viewer's, and the
                shared PageHeader on the Model Browser and the Fabric Toolkit —
                and that mark is the mode switch. A second one here would be
                two doors to the same room, sitting a few pixels apart. */}
            <Rail items={railConfig[mode]} />
            <RailBottomCluster onOpenSearch={openSearch} onOpenHelp={() => setOnboardingOpen(true)} />
          </div>
        )}
        <div className="shell-canvas">
          {children}
        </div>
      </div>
      <GlobalSearch open={globalSearchOpen} onClose={() => setGlobalSearchOpen(false)} />
      <OnboardingTour open={onboardingOpen} onClose={closeOnboarding} />
    </Tooltip.Provider>
  )
}
