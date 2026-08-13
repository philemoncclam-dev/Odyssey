// The run checklist. The animation is CSS and not worth asserting; the status
// derivation and what gets announced are, because they are what a reader —
// and a screen reader — actually receives.
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TaskSteps, useTaskSteps, type TaskStepStatus } from '../TaskSteps'

const STEPS = [
  { id: 'a', label: 'Bronze', meta: '1.2s' },
  { id: 'b', label: 'Silver' },
  { id: 'c', label: 'Gold' },
]

const byId = (map: Record<string, TaskStepStatus>) => (id: string) => map[id] ?? 'pending'

const statuses = (map: Record<string, TaskStepStatus>) =>
  renderHook(() => useTaskSteps({ steps: STEPS, statusOf: byId(map) })).result.current.rows.map(
    (r) => r.status,
  )

describe('status derivation', () => {
  it('reflects each step exactly as reported', () => {
    expect(statuses({ a: 'done', b: 'active', c: 'pending' })).toEqual(['done', 'active', 'pending'])
  })

  it('has nothing active before the run starts moving', () => {
    expect(statuses({ a: 'active' })).toEqual(['active', 'pending', 'pending'])
  })

  it('marks every step done once the whole run has finished', () => {
    expect(statuses({ a: 'done', b: 'done', c: 'done' })).toEqual(['done', 'done', 'done'])
  })

  it('marks the failed step as the failure, leaving a step that never ran pending', () => {
    expect(statuses({ a: 'done', b: 'error' })).toEqual(['done', 'error', 'pending'])
  })

  it('marks a step that failed even when a LATER step went on to run and succeed', () => {
    // The bug this replaced: status used to come from a single "how far did
    // the run get" index, on the assumption a run stops at its first
    // failure. `sequence.ts`'s runAll doesn't stop — a later step can
    // complete after an earlier one errors — and the old derivation had the
    // index moving past the failed step, which made it read as "done"
    // (a green tick) instead of "error". Each step's status now comes
    // straight from the caller, so this can't happen again.
    expect(statuses({ a: 'done', b: 'error', c: 'done' })).toEqual(['done', 'error', 'done'])
  })
})

describe('what gets announced', () => {
  const sentence = (map: Record<string, TaskStepStatus>) =>
    renderHook(() => useTaskSteps({ steps: STEPS, statusOf: byId(map) })).result.current.sentence

  it('names the step and its position while running', () => {
    expect(sentence({ a: 'done', b: 'active' })).toBe('Silver, step 2 of 3')
  })

  it('says the run finished', () => {
    expect(sentence({ a: 'done', b: 'done', c: 'done' })).toBe('All 3 steps complete')
  })

  it('names where it failed', () => {
    expect(sentence({ a: 'done', b: 'error' })).toBe('Failed at Silver')
  })

  it('names the failure even when a later step still finished', () => {
    expect(sentence({ a: 'done', b: 'error', c: 'done' })).toBe('Failed at Silver')
  })
})

describe('rendering', () => {
  it('marks the running step as the current one for assistive tech', () => {
    render(<TaskSteps steps={STEPS} statusOf={byId({ a: 'done', b: 'active' })} />)
    expect(screen.getByText('Silver').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('keeps the terminal announcement silent until it is terminal', () => {
    const { container, rerender } = render(
      <TaskSteps steps={STEPS} statusOf={byId({ a: 'done', b: 'active' })} />,
    )
    const live = () => container.querySelector('[aria-live]')
    // Mid-run this region must not interrupt; the step-by-step region does the
    // ordinary commentary.
    expect(live()).toHaveAttribute('aria-live', 'off')

    rerender(<TaskSteps steps={STEPS} statusOf={byId({ a: 'done', b: 'done', c: 'done' })} />)
    expect(live()).toHaveAttribute('aria-live', 'polite')
    expect(live()).toHaveTextContent('Run complete')
  })

  it('announces a failure as a failure', () => {
    const { container } = render(<TaskSteps steps={STEPS} statusOf={byId({ a: 'done', b: 'error' })} />)
    expect(container.querySelector('[aria-live]')).toHaveTextContent('Run failed')
  })

  it('hides a step’s timing from assistive tech until the step is done', () => {
    // The meta is held in the layout the whole time so the row does not shift
    // when it appears, which means it has to be hidden some other way.
    render(<TaskSteps steps={STEPS} statusOf={byId({ a: 'active' })} />)
    expect(screen.getByText('1.2s')).toHaveAttribute('aria-hidden', 'true')

    render(<TaskSteps steps={STEPS} statusOf={byId({ a: 'done', b: 'active' })} />)
    expect(screen.getAllByText('1.2s')[1]).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('labels the list, so it is not an anonymous group of items', () => {
    render(
      <TaskSteps steps={STEPS} statusOf={byId({ a: 'active' })} label="Sandbox run progress" />,
    )
    expect(screen.getByRole('list', { name: 'Sandbox run progress' })).toBeInTheDocument()
  })
})
