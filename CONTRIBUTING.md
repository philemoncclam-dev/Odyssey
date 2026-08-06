# Contributing

Conventions this repository follows. They exist so that `main` is always
releasable and every change is reviewable on its own.

## Branches

Never commit directly to `main`. Branch for every unit of work:

```
feat/model-versioning      a new capability
fix/undo-drops-selection   a defect
chore/upgrade-vite         tooling, deps, config
docs/readme-status         documentation only
refactor/extract-layout    behaviour-preserving change
```

Keep branches short-lived. A branch open for a week is a merge conflict
waiting to happen.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

Optional body explaining WHY. The diff already shows what.
```

- Subject completes the sentence *"If applied, this commit will…"* — so
  imperative mood: `add`, not `added` or `adds`.
- No trailing period. Aim for 50 characters, hard limit 72.
- One logical change per commit. If the subject needs an "and", split it.
- Every commit leaves the repository working. `main` must be bisectable.

Separate mechanical changes from meaningful ones. A commit that moves a file
*and* edits it produces a diff nobody can review — move in one commit, edit in
the next.

## Pull requests

Every change goes through a PR, including solo work. The PR is the review
surface and the changelog.

- The description says why the change exists and how it was verified.
- CI must be green before merge. A red build that gets merged teaches everyone
  to ignore red builds.
- Squash-merge, then delete the branch.

New CI checks land in the same PR as the code they test. Never add a workflow
that references code which does not exist yet.

## Tests

Non-trivial logic ships with a test — the smallest thing that fails if the
logic breaks. Bug fixes ship with a test that fails before the fix.

Tests assert on behaviour, not implementation. A test that breaks when you
rename a private function is a liability.

## Code

- TypeScript strict. Python typed.
- Comments explain *why*, never *what*. If a comment restates the code, delete
  the comment.
- Delete dead code rather than commenting it out. Git remembers.
- No feature flags, abstractions, or configuration for needs that do not exist
  yet.

## Secrets

Never commit a secret, and never commit a `.env`. If one is committed, it is
compromised — rotate it, do not just remove the file. Git remembers that too.
