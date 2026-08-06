// The rule every host of a canvas has to follow, checked statically.
//
// The model canvas sizes itself with `flex: 1; min-height: 0` and holds
// absolutely-positioned content — it has no height of its own. So the element
// it is mounted into must be a flex column, or the canvas lays out at zero
// height and the page renders blank with no error and nothing in the console.
//
// jsdom has no layout engine, so this cannot be caught by rendering. Reading
// the stylesheets is the next best thing: it pins the contract at the point a
// new host is added, which is the moment it gets forgotten.

// The stylesheets are pulled in with Vite's `?raw`, NOT `node:fs`. The app's
// `types` field is `["vite/client"]` only — so Node builtins are untyped here
// and importing them fails the production build while passing a local one.
import { describe, expect, it } from 'vitest'
import modelingCss from '../modeling.css?raw'
import shellCss from '../../styles/shell.css?raw'

/** The declarations inside one rule, by exact selector. */
function block(css: string, selector: string): string {
  const at = css.indexOf(`\n${selector} {`)
  expect(at, `no rule for ${selector}`).toBeGreaterThan(-1)
  return css.slice(at, css.indexOf('}', at))
}

/**
 * Every element a self-sizing canvas is mounted into, as
 * `[label, stylesheet, selector]`. Add a row when you mount one somewhere new —
 * that is the point.
 */
const HOSTS: [string, string, string][] = [
  ['the shell canvas region', shellCss, '.shell-canvas'],
]

describe('hosts of a self-sizing canvas', () => {
  it('.mv-host still relies on flex rather than a height of its own', () => {
    // If this changes, the rule below stops being the thing that matters and
    // this whole file needs rethinking.
    const rule = block(modelingCss, '.mv-host')
    expect(rule).toContain('flex: 1')
    expect(rule).toContain('min-height: 0')
  })

  it.each(HOSTS)('%s is a flex column', (_label, sheet, selector) => {
    const rule = block(sheet, selector)
    expect(rule).toContain('display: flex')
    expect(rule).toContain('flex-direction: column')
    // A percentage height here is the specific bug: the shell canvas has no
    // definite height, so it resolves to auto and collapses.
    expect(rule).not.toContain('height: 100%')
  })
})
