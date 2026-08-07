// The run checklist. The animation is CSS and not worth asserting; the status
// derivation and what gets announced are, because they are what a reader —
// and a screen reader — actually receives.
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TaskSteps, useTaskSteps } from '../TaskSteps'

const STEPS = [
  { id: 'a', label: 'Bronze', meta: '1.2s' },
  { id: 'b', label: 'Silver' },
  { id: 'c', label: 'Gold' },
]

const statuses = (current: number, failed = false) =>
  renderHook(() => useTaskSteps({ steps: STEPS, current, failed })).result.current.rows.map(
    (r) => r.status,
  )

describe('status derivation', () => {
  it('marks everything before the current step done, and the rest pending', () => {
    expect(statuses(1)).toEqual(['done', 'active', 'pending'])
  })

  it('has nothing active before the run starts moving', () => {
    expect(statuses(0)).toEqual(['active', 'pending', 'pending'])
  })

  it('marks every step done once current passes the end', () => {
    expect(statuses(3)).toEqual(['done', 'done', 'done'])
  })

  it('marks the current step as the failure, leaving later ones pending', () => {
    // Not "everything after a failure failed": the sequence stops, so the
    // later steps never ran and claiming they failed would be wrong.
    expect(statuses(1, true)).toEqual(['done', 'error', 'pending'])
  })
})

describe('what gets announced', () => {
  const sentence = (current: number, failed = false) =>
    renderHook(() => useTaskSteps({ steps: STEPS, current, failed })).result.current.sentence

  it('names the step and its position while running', () => {
    expect(sentence(1)).toBe('Silver, step 2 of 3')
  })

  it('says the run finished', () => {
    expect(sentence(3)).toBe('All 3 steps complete')
  })

  it('names where it failed', () => {
    expect(sentence(1, true)).toBe('Failed at Silver')
  })

  it('does not run off the end when a failure is reported past the last step', () => {
    expect(sentence(9, true)).toBe('Failed at Gold')
  })
})

describe('rendering', () => {
  it('marks the running step as the current one for assistive tech', () => {
    render(<TaskSteps steps={STEPS} current={1} />)
    expect(screen.getByText('Silver').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('keeps the terminal announcement silent until it is terminal', () => {
    const { container, rerender } = render(<TaskSteps steps={STEPS} current={1} />)
    const live = () => container.querySelector('[aria-live]')
    // Mid-run this region must not interrupt; the step-by-step region does the
    // ordinary commentary.
    expect(live()).toHaveAttribute('aria-live', 'off')

    rerender(<TaskSteps steps={STEPS} current={3} />)
    expect(live()).toHaveAttribute('aria-live', 'polite')
    expect(live()).toHaveTextContent('Run complete')
  })

  it('announces a failure as a failure', () => {
    const { container } = render(<TaskSteps steps={STEPS} current={1} failed />)
    expect(container.querySelector('[aria-live]')).toHaveTextContent('Run failed')
  })

  it('hides a step’s timing from assistive tech until the step is done', () => {
    // The meta is held in the layout the whole time so the row does not shift
    // when it appears, which means it has to be hidden some other way.
    render(<TaskSteps steps={STEPS} current={0} />)
    expect(screen.getByText('1.2s')).toHaveAttribute('aria-hidden', 'true')

    render(<TaskSteps steps={STEPS} current={1} />)
    expect(screen.getAllByText('1.2s')[1]).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('labels the list, so it is not an anonymous group of items', () => {
    render(<TaskSteps steps={STEPS} current={0} label="Sandbox run progress" />)
    expect(screen.getByRole('list', { name: 'Sandbox run progress' })).toBeInTheDocument()
  })
})
