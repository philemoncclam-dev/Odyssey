// A short, skippable first-run walkthrough — four cards, not a guided
// click-through. Odyssey has three modes that don't explain themselves from
// the landing screen alone (a blank canvas, a disconnected-looking toolkit,
// an empty catalog), so this is the five-sentence version of "what am I
// looking at" before someone has to guess.
//
// Shown once automatically (AppShell, on first mount ever — see
// ONBOARDED_KEY) and reachable afterwards from the rail-bottom "?" button.
import { useState } from 'react'
import './onboarding.css'

const ONBOARDED_KEY = 'lineage-studio:onboarded'

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === '1'
}

export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDED_KEY, '1')
}

interface Slide {
  title: string
  body: string
}

const SLIDES: Slide[] = [
  {
    title: 'Welcome to Odyssey',
    body: 'A local-first lineage modelling tool. Everything you build lives in this browser — no account, no server, nothing sent anywhere.',
  },
  {
    title: 'Models',
    body: 'A model is layers of objects and attributes, connected by transitions — draw the shape data moves in, from source to report.',
  },
  {
    title: 'Fabric Toolkit',
    body: 'Browse real Fabric workspaces, open a notebook, and run it in a sandbox to see the column-level lineage it actually produces.',
  },
  {
    title: 'Data Products catalog',
    body: 'Publish a model under a domain, a data product, and an application, so it can be found by browsing rather than by already knowing its name.',
  },
]

export function OnboardingTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  if (!open) return null

  const slide = SLIDES[index]!
  const last = index === SLIDES.length - 1

  const close = () => {
    setIndex(0)
    onClose()
  }

  return (
    <div className="ob-backdrop" onMouseDown={close}>
      <div
        className="ob-dialog"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Odyssey"
      >
        <button className="ob-x" onClick={close} aria-label="Close">
          ×
        </button>

        <h2 className="ob-title">{slide.title}</h2>
        <p className="ob-body">{slide.body}</p>

        <div className="ob-dots" role="tablist" aria-label="Slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              className="ob-dot"
              data-active={i === index || undefined}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>

        <div className="ob-actions">
          <button className="ob-btn" onClick={close}>
            {last ? 'Done' : 'Skip'}
          </button>
          {!last && (
            <button className="ob-btn primary" onClick={() => setIndex((i) => i + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
