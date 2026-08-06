# ADR-0005 — Published models are releases; the catalogue reads them

- **Status:** Accepted
- **Date:** 2026-08-06
- **Deciders:** Philemon Lam
- **Amends:** [ADR-0003](./0003-queryable-projection.md) decision 3, which
  projects `main` only.

## Context

Users, teams, and data owners should be able to **publish** a model describing
their data product, and everyone else should be able to **browse** what has been
published. That is a catalogue: discovery first, editing incidental.

This is a different audience from every decision so far. ADR-0002 and 0003 serve
someone building a model. A catalogue serves someone who has never opened the
editor, wants to know what exists, who owns it, and whether they can trust it.

Two things follow immediately, and they pull against the design as it stands:

- **A consumer must not see work in progress.** ADR-0003 projects `main`, which
  moves every time someone merges. A catalogue entry that changes under a reader
  because an author was mid-thought is worse than no catalogue.
- **"Published" is a claim about quality and ownership**, not a storage state.
  Someone is putting their name to it.

There is prior art: `lineage-studio-v2` carried governance domains, data
products, and access requests, all removed in the port. It was built on a
Purview push that was itself dropped as stale, so the UI is worth mining and the
foundation is not.

## Decision

### 1. Publishing is tagging a snapshot, not a new storage concept

ADR-0002 already provides everything needed. A **release** is
`{ modelId, version, snapshotId, publishedBy, publishedAt, notes }` — a named,
immutable pointer into the existing snapshot DAG.

`main` keeps moving as work continues. The release does not. This is the whole
mechanism, and it costs one table.

### 2. The catalogue reads releases; it never reads `main`

A model with no release does not appear in the catalogue at all. Publishing is
the deliberate act that makes something discoverable, and until then a model is
someone's working document.

This is the amendment to ADR-0003 decision 3: the projection covers **the latest
release of every model** for catalogue queries, **and** `main` for the authoring
surface's own search. Two projected heads per model, distinguished by a column —
not two systems.

### 3. Product metadata lives on the model, and a model is the product entry

A published model carries `{ productName, description, owner, domain, status }`.

- **`owner`** is a user or an Entra group, so a team owns it rather than a
  person who may change roles.
- **`domain`** groups products for browsing.
- **`status`** is `published` or `deprecated`.

**No separate "data product" entity.** A model describing a data product *is*
the catalogue entry. Inventing a second object to point at the first buys
nothing today and would need reconciling forever. If a product ever genuinely
spans several models, that is a real change and gets its own record.

### 4. Metadata is discoverable to the whole org; the model body is not

Everyone can see that a product exists, who owns it, what domain it is in, and
how to ask for access. **Opening the model follows ADR-0002's roles.**

A catalogue that hides what you cannot read is useless — the entire point is
finding out that something exists so you can go and ask. Hiding the existence of
a data product from colleagues in the same organisation protects nothing and
defeats the feature.

### 5. Deprecate, never unpublish

A release is citable: people will link to it, reference it in documentation, and
build on it. Removing one breaks those links silently.

Marking `deprecated`, optionally pointing at a successor, keeps the link working
and tells the reader what changed. Releases are immutable in the same way and
for the same reason snapshots are.

### 6. Asset bindings make the catalogue answer the interesting question

This falls out of ADR-0004 for free. Because published models carry
`asset_ref` bindings, the catalogue can answer:

> **Which data product owns `lakehouse.gold.customers`?**

That is the query a data consumer actually has, and it is the same index lookup
as "which models contain this table", filtered to published releases.

## Consequences

### What this buys

- Consumers read something stable, owned, and dated.
- The publish step is a natural quality gate, without inventing a workflow
  engine to enforce one.
- "Who owns this table" becomes answerable across the estate.
- Release history is genuine version history for a data product, because
  ADR-0002 already made the underlying snapshots immutable.
- The catalogue needs no new storage engine — one table and one projection
  column.

### What this costs

- **Two projected heads per model.** ADR-0003's divergence risk applies twice,
  and the consistency check must cover both. A reader seeing a stale release is
  a more damaging bug than an author seeing a stale search result.
- **Publishing becomes a social process, not a technical one.** Nothing here
  stops a model being published once and rotting for a year. Freshness — "last
  published 14 months ago" — must be visible, because the alternative is a
  catalogue of confidently wrong documents, which is worse than an empty one.
- **The catalogue is a second product surface**, with its own navigation,
  search, and permissions, aimed at users who will never open the editor. That
  is a substantial amount of UI, and it is easy to underestimate because the
  data is already there.
- **`owner` as an Entra group needs group membership resolution**, which is
  more Graph API surface than sign-in alone.

### Explicitly not in scope

Access-request workflow, data contracts and SLAs, quality metrics, subscriptions
and change notifications, and cross-organisation publishing.

## Open questions

1. **Who may publish?** Maintainer is the natural fit, but publishing is a
   stronger claim than merging — it may deserve its own role, or an owner's
   explicit sign-off.
2. **Are access requests in scope later?** `lineage-studio-v2` had them. They
   are the obvious completion of decision 4, and they are also a workflow
   feature with notifications and state, which is a much larger thing than it
   looks.
3. **Does a data product ever span multiple models?** Decision 3 says no. If
   that proves wrong the fix is a grouping entity above models, and it should
   be a new record rather than a quiet reinterpretation of this one.
4. **Is `domain` free text, a controlled list, or synced from somewhere?**
   Free text is fastest and produces `Finance`, `finance`, and `FIN` within a
   month.
5. **Do unpublished models appear anywhere?** An internal "who is working on
   what" view is useful and is exactly the work-in-progress exposure decision 2
   exists to prevent, so it would need to be visibly separate.

## Alternatives considered

**Publish means "`main` is public".** No release table; the catalogue reads the
current head. Simplest possible thing. Rejected: consumers would see every
intermediate merge, an entry could contradict itself between two page loads, and
there would be nothing stable to cite. The gap between "I am working on this"
and "you may rely on this" is the feature.

**A separate data-product entity** that models attach to. Matches data-mesh
vocabulary and allows a product to span models. Rejected for now: it doubles the
objects with no capability today, and every product would need reconciling
against the model that describes it. Open question 3 is the trigger to revisit.

**Use Microsoft Purview as the catalogue** and publish into it. The strongest
alternative in a Microsoft shop — Purview is the organisation's catalogue, and
duplicating it invites the question of which one is authoritative. Rejected on
evidence rather than principle: the previous project's Purview integration was
among the first things dropped as stale, and Purview's model is asset-centric
where this is model-centric — it catalogues tables and columns, not the
hand-drawn transformations between them, which is precisely what Odyssey adds.
**Publishing published models to Purview is a good idea and a different one**,
belonging with the OneLake export in ADR-0003's rejected alternatives: an
integration, not a foundation.

**SharePoint or Confluence pages per data product.** What most organisations
actually do. Rejected for the reason the project exists: documentation
disconnected from the model drifts from it immediately, and none of it is
queryable by asset.
