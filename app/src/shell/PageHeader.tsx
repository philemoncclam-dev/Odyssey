// The top bar shared by the two landing screens, Models and Fabric Toolkit.
//
// Both are "chromeless" routes — they render without the shell's rail column
// and are therefore responsible for offering their own way to the other mode
// (see railConfig's isChromeless). One component rather than two headers so
// that responsibility is discharged the same way on both, and so the mark
// cannot drift between them.
//
// The mark is a BUTTON here, not the decorative span it used to be in the
// Model Browser. It is the only mode switch these two screens have, so it
// carries an accessible name saying where it goes rather than the app's name:
// "Odyssey" tells a screen-reader user nothing about what the control does.
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LogoMark } from './Logo'
import { MODE_LABEL, type ModeKey } from './railConfig'
import './pageHeader.css'

/** Where each mode's toggle sends you. Two modes, so it is the other one. */
const OTHER: Record<'model' | 'fabric', 'model' | 'fabric'> = {
  model: 'fabric',
  fabric: 'model',
}

const LANDING: Record<'model' | 'fabric', string> = {
  model: '/models',
  fabric: '/fabric',
}

export function PageHeader({
  mode,
  title,
  children,
}: {
  /** The screen this header sits on — decides which way the toggle points. */
  mode: 'model' | 'fabric'
  title: string
  /** Page actions, right-aligned. */
  children?: ReactNode
}) {
  const other = OTHER[mode]
  return (
    <header className="ph-top">
      <Link
        to={LANDING[other] as never}
        className="ph-brand"
        aria-label={`Switch to ${MODE_LABEL[other as ModeKey]}`}
        title={`Switch to ${MODE_LABEL[other as ModeKey]}`}
      >
        <LogoMark />
      </Link>
      <h1 className="ph-title">{title}</h1>
      <div className="ph-spacer" />
      {children}
    </header>
  )
}
