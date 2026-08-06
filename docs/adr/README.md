# Architecture decision records

One file per architecturally significant decision: what we chose, why, and what
it costs us.

A decision belongs here if reversing it would be expensive, if a newcomer would
otherwise ask "why on earth is it like this", or if we expect to be tempted to
change it later without remembering why it is the way it is.

## Rules

- **Numbered and never renumbered.** `0001-`, `0002-`, in the order decided.
- **Immutable once accepted.** A record is a snapshot of a decision and the
  reasoning available at the time. When the decision changes, write a NEW
  record that supersedes it and mark the old one `Superseded by ADR-000N`.
  Editing history to look wiser than we were defeats the point.
- **Record the alternatives and their costs**, not just the winner. The value
  is mostly in showing what was already considered and rejected.
- **Be honest about the downsides.** A record with no consequences section is
  advocacy, not documentation.

## Status values

`Proposed` · `Accepted` · `Superseded by ADR-000N` · `Deprecated`

## Index

| # | Title | Status |
|---|---|---|
| [0001](./0001-local-first-with-a-sync-path.md) | Local-first, with a sync path rather than a local-only ceiling | Accepted |
| [0002](./0002-git-style-model-collaboration.md) | Git-style model collaboration | Accepted |
| [0003](./0003-queryable-projection.md) | Models are queryable through a derived projection | Accepted |
| [0004](./0004-asset-identity-and-binding.md) | Asset identity: entities bind to real assets, they do not span models | Accepted |
| [0005](./0005-published-models-and-the-catalogue.md) | Published models are releases; the catalogue reads them | Accepted |
| [0006](./0006-history-retention-and-binding-depth.md) | History is never pruned; bindings reach column level | Accepted |
