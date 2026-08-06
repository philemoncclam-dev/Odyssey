# ADR-0002 — Git-style model collaboration

- **Status:** Proposed
- **Date:** 2026-08-06
- **Deciders:** Philemon Lam
- **Relates to:** [ADR-0001](./0001-local-first-with-a-sync-path.md), which left
  sync conflict resolution explicitly unsolved. This is the answer to it.

## Context

Odyssey is an internal tool for one organisation. Models need multiple editors,
gated by role, and the collaboration model asked for is *git-style*: propose,
review, merge — rather than take-turns-overwriting or live co-editing.

That is a heavier commitment than "multiple editors", because it changes what a
model **is** in storage. Today a model is a mutable record that the open editor
overwrites on a debounce. Git-style means a model is an immutable history with
movable pointers into it, and editing means adding to that history rather than
replacing it.

This has to be decided before the first server-side table exists, because it
*is* the schema.

### What makes this tractable

Two properties of the existing model are load-bearing, and neither was designed
for this:

1. **Entities carry stable IDs, and `name` is an ordinary field.** `Layer`,
   `ModelObject` and `Attribute` are all `{ id, name, children }`. A rename is a
   field change on a surviving entity, not a delete plus an add — which is why
   `diffVersions` can report `renamed` at all. Merging a graph whose nodes have
   stable identity is a normal three-way merge. Merging one identified by name
   would be guesswork.
2. **Snapshot history already exists and is already tested.** `ModelVersion`
   stores whole-model snapshots; `diffVersions` computes added / removed /
   renamed between two of them and already drives the restore confirmation.
   A linear history is one parent pointer short of a branching one.

### What makes it hard

- **`Transition` references arbitrary entity IDs** (`source`, `target`, any of
  layer / object / attribute). Delete an entity on one side while the other
  side adds a line to it, and the merge produces an edge pointing at nothing.
  This is the central conflict case and most of the difficulty.
- **Array order is meaningful.** `layers` order is column order, left to right;
  object and attribute order is display order. Order is a property of the
  *parent*, not of the moved entity, so two people reordering the same list
  produce a change the diff cannot express as a per-entity fact.

## Decision

### 1. A model is an append-only DAG of snapshots

Each **snapshot** is a complete, immutable `LineageModel` plus metadata:
`{ id, modelId, parents: SnapshotId[], author, createdAt, message }`.

- `parents` is a list: one for an ordinary edit, two for a merge.
- Snapshots are never mutated or deleted. Undoing is a new snapshot.

**Snapshot IDs are opaque and server-issued, not content hashes.** Content
addressing buys deduplication and tamper evidence; neither is worth the
canonical-serialisation problem it creates (key order, float formatting,
`views` present-vs-undefined) for a tool inside one trusted org. Recorded here
so it is a decision rather than an oversight.

### 2. Branches are named pointers; `main` is the published state

A **branch** is `{ modelId, name, head: SnapshotId }`. Every model has `main`.
What everyone sees by default is `main`'s head.

### 3. The local store *is* an unpublished branch

This is the join with ADR-0001, and the reason the two models compose rather
than fight. Local edits accumulate as snapshots in `localStorage` on a working
branch. Nothing is sent anywhere until you publish. **Editing** offline is not
a special case — it is the normal case, and "offline edits" and "unpublished
commits" are the same thing.

Editing, not everything: decision 6 keeps the client's cache bounded, so
reading history and other people's proposals does need the network. The
guarantee is that the work you are doing right now never depends on it.

### 4. Publishing is a proposal; merging is role-gated

A **proposal** is `{ id, modelId, sourceBranch, targetBranch, base, state,
author, reviewers }` where `base` is the snapshot the branch diverged from —
stored explicitly so the three-way merge never has to search for it.

**Fast-forward without ceremony.** If `main`'s head still equals `base`, nobody
else changed anything, and an Editor's publish advances `main` directly with no
review step. Requiring a reviewer for an uncontested edit to your own model is
the fastest way to teach people to route around the process.

Roles, resolved from Entra group membership:

| Role | Can |
|---|---|
| Viewer | read `main`, read history and diffs |
| Editor | create branches, edit, open proposals, fast-forward |
| Maintainer | merge a contested proposal, delete branches, force-set `main` |

Roles attach to a model, defaulting from an organisation-wide role.

### 5. Merge is a structural three-way merge, by entity ID

Given `base`, `ours`, `theirs`, index all three by entity ID and decide per
entity:

| base | ours | theirs | Result |
|---|---|---|---|
| absent | present | absent | keep ours (added) |
| absent | absent | present | keep theirs (added) |
| present | changed | unchanged | keep ours |
| present | unchanged | changed | keep theirs |
| present | changed | changed, same value | keep either |
| present | changed | changed, different value | **conflict** |
| present | deleted | unchanged | delete |
| present | deleted | changed | **conflict** |

Field-level, not entity-level: one side renaming a column while the other adds a
child to it is not a conflict.

Specific resolutions for the hard parts:

- **Dangling transitions.** A transition whose endpoint was deleted on the other
  side is **dropped, with a warning in the merge summary** — not raised as a
  conflict. Deleting an entity is an unambiguous statement that its edges go
  with it, and the alternative is blocking a merge on an edge the user cannot
  see. It is reported because silently discarding an edge someone drew is
  exactly the kind of loss that erodes trust.
- **Ordering.** Order is merged per parent list. If both sides reordered the
  same list, **ours wins and the merge summary says so.** Order is presentation,
  and a conflict prompt over column order costs more attention than it is worth.
- **Orphaned property bags** need no rule: `properties` entries are already
  documented as able to outlive their entity, so a bag whose entity lost the
  merge is harmless and is left alone.
- **Saved views** are merged as a union by view ID, same rules as entities.

### 6. Snapshots live in Postgres; the client caches a bounded working set

History is a server-side concern. Azure Database for PostgreSQL Flexible Server
(per ADR-0001) holds snapshots as `jsonb` rows keyed by snapshot ID, with
branches and proposals as ordinary tables — `parents` is an array column, so
walking the DAG is a recursive CTE rather than application code.

Storage there is not a constraint worth designing around. An internal tool that
accumulated 10,000 snapshots averaging 1 MB is 10 GB before compression, which
is unremarkable for a managed Postgres instance and costs less per month than
an hour of the time spent optimising it. `jsonb` compresses well, and snapshots
of one model are highly repetitive.

**If snapshot bodies later prove large, they move to Azure Blob Storage** with
the row keeping metadata and a pointer. This is deliberately *not* being built
now: it is a change behind `ModelStore`, it costs a round trip, and it should
follow a measurement rather than a hunch.

Snapshots are stored whole and opaque, which is right for reading a model by ID
and wrong for asking questions across models. Search and impact analysis run
against a derived relational projection instead — see
[ADR-0003](./0003-queryable-projection.md).

**The client caches a working set, not the history.** `localStorage` holds only:

- the head snapshot of the branch you are on,
- its `base`, so a diff can be shown offline,
- your own unpublished snapshots.

Everything else — old versions, other branches, other people's proposals — is
fetched on demand. Browsing history is a server query, and a lineage model is
read far more than its history is browsed.

The consequence is the important part: **local storage is bounded by how many
models you have open, not by how long the project has existed.** Deep history
costs nothing on the client.

### 7. Conflicts are resolved in the UI, per entity, and produce a merge snapshot

A conflicted proposal presents each conflict as a choice — ours, theirs, or an
edited value — reusing the diff presentation that already exists. The result is
a snapshot with two parents. There is no textual conflict-marker format; there
is no text.

## Consequences

### What this buys

- No edit is ever silently overwritten. Every state the model has held is
  addressable and restorable.
- Offline work stops being a special case.
- Review before publish, which for a lineage catalogue is the actual governance
  requirement — "who changed this mapping, and who approved it" is answerable
  from the history rather than from an audit log bolted alongside it.
- The audit trail is a by-product of the storage model, not a second system.

### What this costs

- **The merge is the hardest code in the product**, and it is correctness-
  critical: a bug silently corrupts a model rather than crashing. It needs
  property-based tests, not just examples — merging a snapshot with itself must
  be identity, and merging in either order must agree.
- **Storage grows with full snapshots, and that is affordable.** Every save is a
  complete copy of the model. On managed Postgres this is a cost question with
  an obvious answer at this scale, not a design constraint — see decision 6.
  Structural sharing and delta encoding are both available later, behind
  `ModelStore`, and neither should be built before a measurement asks for it.
- **`localStorage` bounds the working set, not the history** — but the working
  set is still whole models, and a large one can approach the ~5 MB origin
  limit on its own. That is the pressure `store.ts` already anticipates with an
  async interface, and this design does not make it worse. IndexedDB when a
  real model gets close, not before.
- **Offline is degraded, not absent.** You can edit, diff against your base, and
  queue snapshots with no network. You cannot browse history or open someone
  else's proposal. That is a deliberate trade for a bounded client, and it is
  the right one for an internal tool on a corporate network — but it is a
  trade, and a genuinely disconnected user will notice it.
- **Process friction if applied too broadly.** The fast-forward rule exists to
  contain this, and it should be treated as load-bearing rather than an
  optimisation.
- Users will expect git vocabulary to behave like git. It will not: there is no
  rebase, no cherry-pick, no partial staging.

### Explicitly not in scope

Rebase, cherry-pick, staging a subset of changes, per-attribute blame,
real-time presence, and merging across different models.

## Open questions

These are unresolved and should not be answered by whoever writes the code
first without saying so:

1. **Does an entity added independently on both sides with the same name merge
   or duplicate?** IDs are generated locally, so both sides produce different
   IDs and the rules above keep both. That is correct per the algorithm and
   probably wrong per the user's intent. Leaning: keep both, flag as a warning,
   let the user delete one.
2. **What is a branch's lifetime?** Automatic per edit session, or explicitly
   named by the user? Automatic is less ceremony but produces branch clutter.
3. **Can a proposal be opened against a branch other than `main`?** Allowing it
   is nearly free structurally, but doubles the review surface.
4. **How far back is history kept?** Never pruning is simplest and defensible
   for an internal tool at this scale, but is a promise worth making knowingly.
5. **Is there a "take this model offline" mode** that caches full history
   deliberately, for someone about to lose connectivity? Decision 6 bounds the
   client by default; an explicit opt-in is a different feature and should be
   driven by whether anyone actually works disconnected.

## Alternatives considered

**Last-write-wins with optimistic locking.** A version column; a stale write is
rejected and the user re-applies. Cheap, well understood, no merge code.
Rejected: the loser retypes their work, and for a model with hundreds of
entities "your copy is stale, start again" is a data-loss event with a polite
message.

**Pessimistic locking (check-out / check-in).** One editor at a time. Simplest
correct answer and used by plenty of modelling tools. Rejected: it serialises
work that is naturally parallel — two people editing different layers of the
same model conflict on nothing — and lock ownership becomes an administrative
chore the moment someone goes on holiday holding one.

**CRDTs with real-time co-editing.** Strongest UX, no conflicts by
construction. Rejected: it would dominate the roadmap for months, it makes
review-before-publish unnatural (edits land as you type, so there is nothing to
approve), and review is the actual requirement here. It is also the harder
thing to retreat from — snapshots plus merge can gain live presence later far
more easily than a CRDT can gain governance.

**Store snapshots in OneLake / a Fabric lakehouse** rather than Postgres. The
obvious question in a Microsoft shop, where OneLake is already provisioned,
already governed, and already where the data lives. Rejected: it is analytics
storage, and this is a transactional workload. Advancing a branch pointer is a
read-modify-write that needs a real transaction and row-level concurrency
control; Delta gives table-level optimistic concurrency and is built for
throughput on large scans, not for a single-row update taking hundreds of
milliseconds while a user waits. Small-file overhead makes it worse — each
snapshot is a small write, which is the access pattern lakehouses are least
suited to.

Publishing models *to* OneLake for downstream consumption — so the lineage
catalogue is queryable alongside the data it describes — is a genuinely good
idea and the natural bridge back to Fabric. It is a **feature**, not a storage
engine, and does not belong in this decision.

**Use git itself**, serialising models to files in a real repository. Free
merge machinery, real tooling. Rejected: JSON three-way merge is *textual*, so
it conflicts on formatting and reorders while missing semantic conflicts
entirely — precisely inverted from what this model needs. It also drags a git
server, working copies, and git's mental model into a product whose users are
data analysts.
