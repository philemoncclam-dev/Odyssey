import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { OnboardingTour, hasSeenOnboarding, markOnboardingSeen } from '../OnboardingTour'

describe('hasSeenOnboarding / markOnboardingSeen', () => {
  beforeEach(() => localStorage.clear())

  it('is false until marked seen', () => {
    expect(hasSeenOnboarding()).toBe(false)
    markOnboardingSeen()
    expect(hasSeenOnboarding()).toBe(true)
  })
})

describe('OnboardingTour', () => {
  it('renders nothing when closed', () => {
    render(<OnboardingTour open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('starts on the first slide and advances with Next', () => {
    render(<OnboardingTour open onClose={() => {}} />)
    expect(screen.getByText('Welcome to Odyssey')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Models')).toBeInTheDocument()
  })

  it('shows Done only on the last slide', () => {
    render(<OnboardingTour open onClose={() => {}} />)
    expect(screen.getByText('Skip')).toBeInTheDocument()
    expect(screen.queryByText('Done')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })

  it('closing calls onClose', () => {
    let closed = false
    render(<OnboardingTour open onClose={() => (closed = true)} />)
    fireEvent.click(screen.getByLabelText('Close'))
    expect(closed).toBe(true)
  })

  it('a dot jumps straight to its slide', () => {
    render(<OnboardingTour open onClose={() => {}} />)
    fireEvent.click(screen.getByLabelText('Slide 3: Fabric Toolkit'))
    expect(screen.getByText('Fabric Toolkit')).toBeInTheDocument()
  })
})
