// Rail-bottom cluster: the Cmd+K search trigger. It opens the same palette the
// global Cmd+K listener (owned by AppShell) opens.
//
// This used to also carry a connection-status dot and an identity chip. Both
// reported on a backend and a signed-in account, neither of which exists —
// Odyssey runs entirely in the browser. A status light that is always off
// teaches users to ignore status lights, so it is gone rather than stubbed.
import { type ReactNode } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RailBottomButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button type="button" className="rail-bottom-btn" onClick={onClick}>
          {children}
          <VisuallyHidden>{label}</VisuallyHidden>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="rail-tooltip" side="right" sideOffset={8}>
          {label}
          <Tooltip.Arrow className="rail-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export default function RailBottomCluster({
  onOpenSearch,
  onOpenHelp,
}: {
  onOpenSearch: () => void
  onOpenHelp: () => void
}) {
  return (
    <div className="rail-bottom">
      <RailBottomButton label="Search (⌘K)" onClick={onOpenSearch}>
        <SearchIcon />
      </RailBottomButton>
      <RailBottomButton label="What is this?" onClick={onOpenHelp}>
        <HelpIcon />
      </RailBottomButton>
    </div>
  )
}
