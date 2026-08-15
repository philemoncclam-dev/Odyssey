// Rail-bottom cluster: the Cmd+K search trigger, and sign-in/sign-out.
import { type ReactNode } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useAuth } from '../auth/AuthProvider'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
  )
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
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

export default function RailBottomCluster({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { account, signIn, signOut } = useAuth()
  return (
    <div className="rail-bottom">
      <RailBottomButton label="Search (⌘K)" onClick={onOpenSearch}>
        <SearchIcon />
      </RailBottomButton>
      <RailBottomButton label={account ? `Sign out (${account.username})` : 'Sign in'} onClick={account ? signOut : signIn}>
        <AccountIcon />
      </RailBottomButton>
    </div>
  )
}
