# ADR-0003 — Models are queryable through a derived projection

- **Status:** Proposed
- **Date:** 2026-08-06
- **Deciders:** Philemon Lam
- **Relates to:** [ADR-0002](./0002-git-style-model-collaboration.md), which makes
  the snapshot DAG the source of truth. This decides how anything *asks
  questions* of it.

## Context

Odyssey becomes a web application: users sign in with SSO, browse models they
did not author, and search across them. That is a different access pattern from
the one the app has today, where a single user opens one model they already
hold locally.

ADR-0002 stores snapshots as `jsonb`. That is right for what it is for —
whole-model reads by ID, immutable, write-once. It is close to useless for
everything the catalogue view needs:

- "Which models contain a column called `customer_email`?"
- "Where else is this table used?"
- "Show me every column tagged PII across the estate."
- **"What breaks if I drop this column?"**

The last one is the reason a lineage tool exists, and it is the hardest: it is a
transitive traversal of the transition graph, not a lookup. Postgres can index
`jsonb` well (GIN, path queries) and would answer the first three adequately at
this scale. It cannot reasonably answer the fourth, because the edges are buried
in nested arrays inside documents and traversal means repeatedly parsing whole
models to find the next hop.

There is also a client-side forcing function. Today the browser loads a whole
model to show anything about it. A catalogue that lists, searches, and previews
models cannot ship every model to the client to do it.

## Decision

**The snapshot DAG stays the single source of truth. A relational *projection*
is derived from it, and every query runs against the projection.**

### 1. Shape

For each projected branch head, the model is flattened into ordinary tables:

| Table | Holds |
|---|---|
| `entity` | `(model_id, branch, entity_id, kind, parent_id, name, ordinal)` — one row per layer, object, and attribute, `parent_id` capturing nesting, `ordinal` capturing list order |
| `edge` | `(model_id, branch, edge_id, source_id, target_id)` — one row per transition |
| `entity_property` | `(model_id, branch, entity_id, key, value)` — the `PropertyBag` entries, unnested |

`kind` is the existing `EntityKind`. Nothing here is new information; it is the
same model with its nesting turned into rows.

### 2. The projection is derived, disposable, and never authoritative

- **Only the projector writes to it.** No feature reads a projection row,
  modifies it, and writes it back. If that rule is broken the projection stops
  being derivable and silently becomes a second source of truth.
- **It is rebuildable.** `rebuild-projection` reprojects from snapshots. Losing
  the projection entirely is an inconvenience, not a data-loss event, and that
  property is worth protecting deliberately.
- **It is written in the same transaction that moves the branch head.** Same
  database, so this is free, and it avoids eventual consistency for no benefit —
  nobody should ever see a merge that has landed but is not yet searchable.

### 3. What gets projected

`main` for every model. Nothing else, initially.

Branch and proposal heads are deliberately excluded: they multiply projection
work, and the review UI already has both snapshots in hand for a diff. If
"search my draft" turns out to matter it is an additive change.

### 4. Queries

- **Search** — `name` with a trigram index. At this scale that is enough and
  needs no search engine.
- **Impact analysis** — a recursive CTE over `edge`, in both directions, from
  any entity. This is the query the shape exists for.
- **Tag and property filters** — an index on `(key, value)` in
  `entity_property`.
- **Catalogue listing** — counts and summaries per model, without loading any
  model.

### 5. Access control is applied at query time, not baked into the projection

Role checks (ADR-0002) filter results by `model_id`. The projection stores no
permissions, so a role change takes effect immediately rather than waiting for
a reprojection.

## Consequences

### What this buys

- Impact analysis becomes a single indexed query rather than an application-side
  graph walk over parsed documents.
- The catalogue view stops needing whole models on the client, which is what
  makes a browsable multi-model web app viable at all.
- Search across the estate is ordinary SQL.
- The expensive properties of the snapshot store — immutability, simple whole-
  model reads, a merge that operates on plain objects — are preserved. The
  projection absorbs the query complexity instead of the source of truth
  contorting to serve two masters.

### What this costs

- **Two representations of the same data, which can diverge.** This is the
  central risk and it is a correctness risk, not a performance one. Mitigations:
  same-transaction writes, a rebuild command, and a periodic consistency check
  that reprojects a sample and diffs. Worth building the check early — a
  projection bug is invisible until someone trusts a wrong answer.
- **Write amplification.** Every merge reprojects a whole model. Fine at this
  scale, and bounded by model size rather than history depth. If it stops being
  fine, project incrementally from the merge diff, which `diffVersions` already
  computes.
- **A second schema to migrate.** Changing `LineageModel` now means changing the
  projection and reprojecting. The reprojection is the migration, which is
  simpler than most, but it is a step that will be forgotten at least once.
- **The rule in §2 is easy to break and hard to notice.** One feature writing
  directly to `entity` because it is convenient would be the beginning of the
  end, and it would pass review unless someone is watching for exactly it.

### Explicitly not in scope

Full-text search over property values, versioned query ("search the estate as of
last March"), and materialised transitive closure.

## Open questions

1. **Do entities link across models?** Two models both describing
   `lakehouse.gold.customers` currently share nothing — the same physical table
   is two unrelated entities with different IDs. Cross-model impact analysis is
   the obvious next thing to want, and it needs a notion of physical identity
   distinct from model-local `EntityId`.
   **Answered by [ADR-0004](./0004-asset-identity-and-binding.md):** entities
   stay model-local and carry an optional URN pointing at a real asset, so
   `entity` gains a nullable indexed `asset_ref` and "every model containing
   this table" becomes one lookup.
2. **Is history queryable, or only current state?** "What did this model look
   like in March" is answerable from snapshots today. "Which models had a PII
   column in March" is not, and would need projected history.
3. **Does search cross models by default,** or scope to the model in view?
   A permissions question as much as a UX one.

## Alternatives considered

**`jsonb` only, with GIN indexes.** No second representation, no divergence, no
projector. Genuinely sufficient for search and tag filtering, and the lazier
option — which normally wins. Rejected on the strength of one query: transitive
impact analysis means walking edges hop by hop, and in this shape every hop
re-parses documents. The traversal is the product, not a nice-to-have, so the
storage should serve it.

**Fully normalised as the source of truth**, with no snapshot blobs. One
representation, always queryable. Rejected: it makes the *cheap* operations
expensive. Reading a model becomes a multi-table join and reassembly;
ADR-0002's merge becomes SQL over rows rather than a pure function over plain
objects; and immutable history becomes an insert of every row of every version.
The merge being an ordinary testable function is worth protecting.

**A graph database** (Cosmos DB Gremlin, Neo4j) for the edges. The natural fit
for traversal. Rejected: a second datastore to run, secure, back up, and keep
consistent with Postgres, for a graph that comfortably fits a recursive CTE at
the scale of one organisation's models. Revisit if traversal depth or breadth
outgrows Postgres — that would be a good problem and a clean swap, since the
projection is already derived.

**Azure AI Search** in front of the models. Strong search, faceting for free.
Rejected for now: it solves the easy half (name search, which trigram already
handles) and not the hard half (traversal), while adding an index to keep in
sync. Reasonable later for full-text over property values and descriptions.
