# ADR-0006 — History is never pruned; bindings reach column level

- **Status:** Accepted
- **Date:** 2026-08-05
- **Deciders:** Philemon Lam
- **Answers:** [ADR-0002](./0002-git-style-model-collaboration.md) open question 4,
  and [ADR-0004](./0004-asset-identity-and-binding.md) open question 2.

## Context

Two of the open questions left by the accepted records change the schema rather
than the code above it, which makes them expensive to defer. The rest do not,
and are better answered against a working implementation than in advance.

ADR-0002 stores a full snapshot per save and left retention open. ADR-0004
binds entities to real assets by URN and left the depth of that URN open. Both
have to be settled before the first server-side table exists, for the same
reason: retrofitting a retention boundary onto an immutable DAG, or a level of
granularity onto an identifier, means migrating every row already written.

## Decision

### 1. Snapshots are never pruned

History is kept in full, indefinitely. There is no retention window, no
compaction, and no archival tier.

ADR-0002 already argues the storage case — full snapshots of one model
compress well as `jsonb`, and the scale here is an internal tool, not a public
service. This record makes the *promise* explicit rather than leaving it as an
absence: **every state a model has ever held stays addressable and restorable
for as long as the model exists.**

That promise is the point. Retention is a governance answer as much as a
storage one — "who changed this mapping and who approved it" is worth little if
the answer expires — and half of ADR-0002's value is that the audit trail is a
by-product of storage rather than a second system. A retention window would
quietly reintroduce the need for that second system.

If storage ever does become a real cost, the first move is the one ADR-0002
already names: snapshot bodies to Blob Storage behind `ModelStore`, with the
row keeping metadata. That is a change of medium, not of promise. Pruning is a
last resort, and it should be a new record that supersedes this one, not a
config value someone lowers on a quiet afternoon.

### 2. Bindings reach column level, and stop there

An asset URN identifies, at its finest, a **column**. The hierarchy is
workspace → item → schema → table → column, and any prefix of it is a valid
binding target: a model object may bind to a table, and an attribute may bind
to a column within it.

Column is the floor. Nothing below it — no value ranges, no partitions, no
individual rows — is addressable, and a request for one should be a new record
rather than an extra segment quietly appended to the scheme.

The reason to pay for column depth now is that column-level impact analysis is
the question people actually have. "What breaks if I change this column" is the
one that justifies a lineage tool; "what breaks if I change this table" is the
one people settle for when the tool cannot answer the first. Table-only
bindings would make the settled-for answer the only answer, and the upgrade
later is not additive — it changes the shape of every URN already stored and
every index built on it.

The reason to stop at column is that below it, lineage stops being structural
and starts being about data, which is a different product with different
storage, different refresh characteristics, and different permissions.

## Consequences

### What this buys

- The two schema-shaping questions are settled, so ADR-0002's tables and
  ADR-0003's projection can be written without a placeholder in either.
- Column-level impact analysis is available from the first version rather than
  being a migration.
- Restore and audit have an unqualified answer: yes, always, however far back.

### What this costs

- **Storage grows without bound, deliberately.** Slowly, and cheaply, but
  monotonically. This is affordable at internal-tool scale and would not be at
  a different one — the decision is scoped to the scale in ADR-0002, and a
  change of scale invalidates it.
- **Nothing can ever be truly deleted from history**, which collides with a
  right-to-erasure request or a credential pasted into a model name. That is a
  real gap and it is not solved here: it needs a targeted redaction path, which
  is a different mechanism from retention and deserves its own record if the
  need appears.
- **Column bindings multiply the binding surface.** A table with 200 columns is
  200 potential bindings, and drift — ADR-0004's central cost — now applies per
  column rather than per table. Broken bindings must stay visible at that
  volume without becoming noise.
- **The URN scheme now has a mandatory shape.** Every future source system has
  to be expressible as workspace → item → schema → table → column or an honest
  subset of it, and one that genuinely does not fit will be awkward.

### Explicitly not in scope

Retention policy, archival tiers, sub-column identity, and redaction of
individual history entries.

## Open questions

The remaining open questions in ADR-0002, 0004 and 0005 are deliberately still
open. They sit above the schema — branch lifetime, who may publish, whether
`domain` is a controlled list — and are cheaper to answer once there is a
working implementation to answer them against.

## Alternatives considered

**A retention window with an escape hatch** — prune after N months, but pin
snapshots referenced by a published release. Rejected: it keeps the storage
saving only until releases accumulate, and it makes "can I restore this" a
question with a conditional answer. A conditional guarantee gets treated as no
guarantee.

**Table-level bindings, column later.** Rejected above: the later is a
migration of every URN and index, not an addition, and the column-level
question is the one that motivates the feature.

**Sub-column bindings now** — partitions, value ranges. Rejected: speculative,
and it pulls the design toward a data-observability product rather than a
lineage one.
