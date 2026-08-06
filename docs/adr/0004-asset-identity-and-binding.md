# ADR-0004 — Asset identity: entities bind to real assets, they do not span models

- **Status:** Proposed
- **Date:** 2026-08-06
- **Deciders:** Philemon Lam
- **Answers:** [ADR-0003](./0003-queryable-projection.md) open question 1.

## Context

Two requirements, both from the same intent:

1. From the Fabric toolkit's explore mode, **append a real data asset to a
   model** — pick `lakehouse.gold.customers` out of a workspace and have it
   become an entity in the model you are drawing.
2. **Search a data asset and see every model that contains it.** Search a
   table, get the models that mention it, across the whole estate.

Today neither is possible in principle, not just in practice. Two models that
both describe `lakehouse.gold.customers` share nothing at all: each has its own
`EntityId`, generated locally, and the only thing connecting them is a display
name that either model is free to change.

"Entities can link across models" is the obvious framing and it is a trap. Read
literally it means one entity object appearing in two models — which would make
an edit in one model silently change another, break ADR-0002's merge (whose
whole basis is that a model snapshot is self-contained), and make the blast
radius of a rename unbounded. That is not what is being asked for.

## Decision

### 1. Binding, not sharing

**Entities remain strictly model-local. An entity may additionally carry a
reference to an external asset identity.** Two models describing the same table
have two entities that both *point at* the same asset; they are not the same
entity.

```
Model A ──▶ entity "customers"  ──┐
                                  ├──▶ asset  fabric:…/tables/gold.customers
Model B ──▶ entity "Customers"  ──┘
```

Everything ADR-0002 relies on survives untouched: a snapshot is still
self-contained, the merge is still a pure function over one model, and editing
model A still cannot affect model B. The link exists only in queries — which is
exactly where both requirements live.

### 2. The reference is a stable, namespaced identity

`assetRef` is a string URN identifying a real thing, not a display name:

```
fabric://workspace/{workspaceGuid}/item/{itemGuid}/table/{schema}.{table}
fabric://workspace/{workspaceGuid}/item/{itemGuid}/table/{schema}.{table}#{column}
```

GUIDs where Fabric gives them (workspace, item), names where it does not (schema,
table, column). Namespaced from the start so that kdb+ and other systems get
`kdb://…` later without redesign.

**Display names are never the identity.** A renamed workspace must not break a
binding, which rules out the naive approach of matching on qualified name.

### 3. Unbound entities stay first-class

Most entities will have no `assetRef`, and that is not a degraded state.
Odyssey is a *modelling* tool: conceptual entities, planned tables, and
whiteboard thinking are the point, and a binding is an optional claim that "this
one corresponds to a thing that exists."

Consequently `assetRef` is nullable, it is set deliberately, and nothing infers
it silently.

### 4. It is one more field, so it merges like one

`assetRef` is an ordinary optional field on an entity. ADR-0002's field-level
merge already covers it: binding on one side and renaming on the other is not a
conflict; binding the same entity to two different assets is.

No new merge machinery. This is the payoff for keeping entities model-local.

### 5. The projection carries it, and both queries are index lookups

ADR-0003's `entity` table gains a nullable, indexed `asset_ref`. That is the
entire schema change, and it turns both requirements into single queries:

- **Asset → models.** `SELECT DISTINCT model_id FROM entity WHERE asset_ref = $1`
  — "every model containing this table."
- **Model → assets.** The same table the other way, for "what real things does
  this model claim to describe."
- **Search → asset → models.** Searching a table name resolves to an
  `asset_ref`, then the query above. The name is how a human finds the asset;
  the URN is what the join uses.

### 6. Binding happens at import, or deliberately by hand

Appending assets from Fabric explore creates entities already bound — the
import knows the URN it fetched them from, so binding is free at that moment
and expensive to reconstruct later.

An existing hand-drawn entity can also be bound after the fact. Both paths are
explicit user actions.

### 7. Cross-model lineage is NOT composed implicitly

If model A says `customers → orders` and model B says `orders → revenue`, it is
tempting to answer "what is downstream of customers" with `revenue`.

**Do not**, by default. That composes two people's separate assertions into a
claim neither of them made, and presents it with the same confidence as a line
someone actually drew. Traversal stays within a model unless the user explicitly
asks to cross boundaries, and when they do, the result must show which model
each hop came from.

This is a trust decision, not a technical one. A lineage tool that quietly
invents edges is worse than one that finds fewer.

## Consequences

### What this buys

- Both requirements become index lookups on one nullable column.
- ADR-0002's merge is completely unaffected — no new conflict types, no new
  machinery.
- Models stay independent, so one team's edit cannot damage another's model.
- The path to cross-system lineage (kdb+, and whatever follows) is a new URN
  scheme rather than a new design.

### What this costs

- **Bindings drift.** A table renamed or dropped in Fabric leaves a binding
  pointing at something that no longer exists. This is unavoidable — the
  alternative is coupling to a catalogue we do not control — so it needs to be
  *visible*: a broken binding should be shown as broken, and never silently
  dropped or silently rebound.
- **Identity is only partly stable.** Workspace and item are GUIDs; schema,
  table and column are names. A renamed table breaks its bindings while a
  renamed workspace does not, which is an inconsistency users will notice and
  we cannot fix from outside Fabric.
- **It needs the Fabric API layer back**, server-side. Explore mode was deleted
  in the port and requirement 1 cannot exist without it. This ADR describes a
  future state that depends on that work, and says so rather than implying the
  capability is nearer than it is.
- **A tempting shortcut sits right next to it**: matching entities by name when
  no binding exists. It would appear to work and would be wrong constantly —
  every model has a `customers`, and most of them are different tables.

### Explicitly not in scope

Automatic binding by name, syncing entity names from the bound asset, importing
schema changes back into a model, and asset-level permissions distinct from
model permissions.

## Open questions

1. **May two entities in the *same* model bind to the same asset?** Legitimate
   when a table appears in two layers of one diagram; a mistake most other
   times. Leaning: allow, and surface it in the model rather than block it.
2. **Do bindings extend below column level**, or is a column the floor?
3. **Who may bind?** Binding is a factual claim about the estate rather than a
   drawing decision, so it may deserve a stricter role than Editor.
4. **What does the asset side look like when nothing is bound to it?** Is there
   a catalogue of known assets independent of models — which is most of a data
   catalogue product — or do assets exist only as URNs mentioned by models?
   The second is far cheaper and is the assumption here; the first is a
   different product and should be a separate decision if it is ever wanted.

## Alternatives considered

**One shared entity referenced by many models.** The literal reading of "link
across models". Rejected: it breaks snapshot self-containment, so ADR-0002's
merge would need to reason about entities it does not own, and an edit in one
model would change another with no review. The blast radius of a rename becomes
the whole estate.

**Match entities by qualified name at query time**, with no stored binding.
Zero schema change, works retroactively on every existing model. Rejected: a
name is not an identity. It produces false positives constantly (`customers` in
two lakehouses), false negatives on any rename, and — worst — it is *silently*
wrong, so the failure looks like an answer.

**A global entity registry** that every model's entities are created from,
making all identity global by construction. Clean in theory. Rejected: it makes
sketching impossible. You would have to register a table before you could draw
it, which inverts how the tool is actually used, and it turns Odyssey into a
catalogue with a diagram feature rather than a modelling tool that knows about
real assets.

**Bind to Microsoft Purview identities** instead of Fabric URNs. Attractive —
Purview already solves cross-system identity. Rejected for now: it makes Purview
a hard dependency for a capability that mostly concerns Fabric, and the previous
project's Purview integration was among the first things dropped as stale. Worth
revisiting if Purview becomes the organisation's system of record; the URN
scheme in decision 2 leaves room for a `purview://` namespace.
