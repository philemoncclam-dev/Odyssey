# ADR-0001 — Local-first, with a sync path rather than a local-only ceiling

- **Status:** Accepted
- **Date:** 2026-08-05
- **Deciders:** Philemon Lam

## Context

Odyssey is a port of an earlier full-stack prototype (`lineage-studio-v2`) that
carried a FastAPI backend, live Microsoft Fabric REST integration, Entra ID
sign-in, an LLM assistant, server-side share links, and a Postgres-backed
product catalogue. Roughly 60,000 lines were removed to reach a browser-only
application with no server, no `.env`, and no service account.

That was the right call for the port — a prototype's accumulated integrations
are the hardest part to keep working and the least valuable to carry — but it
leaves an obvious question that will be asked repeatedly: *is browser-only the
architecture, or a waypoint?*

The answer matters now rather than later because it determines whether the code
we write next is throwaway. Two constraints make it urgent:

1. **Lineage is organisational knowledge.** Its value is that a colleague sees
   the same model. A tool where every person holds a private copy is a notepad,
   not a catalogue.
2. **The Spark lineage engine cannot run in a browser.** It needs a JVM. It is
   parked in-tree, tested in CI, and unwired — and wiring it requires a server
   no matter what else we decide.

`localStorage` also has hard technical ceilings that no amount of frontend work
removes: roughly 5 MB per origin, no sync, no backup, no audit trail, and total
loss when a user clears site data.

## Decision

**Odyssey is local-first, not local-only.** The browser is the primary,
fully-functional runtime. A server is added later for what genuinely requires
one — sharing, durability, identity, audit, and the Spark engine — and never
becomes a prerequisite for the app working.

Concretely:

1. **The app talks to interfaces, never to `fetch`.** `ModelStore` is the model
   of this: an async interface with a `localStorage` implementation behind it.
   Adding a server means writing a second implementation, not rewriting call
   sites.
2. **Persistence stays swappable.** `ModelStore`'s methods are already `async`
   despite `localStorage` being synchronous, precisely so the swap is one file.
3. **No feature is stubbed.** A capability that needs a service is absent until
   the service exists, rather than present-but-broken. A status light that can
   only read "disconnected" teaches users to ignore status lights.
4. **The server, when it arrives, is Azure-native** — Container Apps for the
   API and the JVM sandbox, Azure Database for PostgreSQL, Entra ID for
   identity, Key Vault and managed identity for secrets. Not preference:
   Fabric and Entra already live there, and an enterprise security review will
   ask about network isolation and data residency at that boundary.

## Consequences

### What this buys

- Today's app is genuinely useful, installable as static files, and reviewable
  with no infrastructure at all.
- The test suite runs with no fixtures, no containers, and no network.
- Every enterprise feature lands behind an interface that already exists, so it
  arrives as an implementation rather than a refactor.
- The engine that is the commercial differentiator stays in-tree and green
  instead of rotting in a branch.

### What this costs

- **The current product is not enterprise-ready and should not be sold as
  such.** No sharing, no RBAC, no audit, no backup, ~5 MB ceiling.
- Building an interface before its second implementation exists is speculative
  generality — normally a smell. It is accepted here for `ModelStore` only,
  because the second implementation is a stated commitment rather than a
  possibility, and because the interface already exists and is already paid for.
- Two persistence implementations will have to agree on semantics, and the
  local one will be the easier place to hide a divergence.
- Offline-capable plus synced is materially harder than either alone. Conflict
  resolution when two people edit one model is a real design problem that this
  record does not solve, and it should get its own ADR before that work starts.

### The failure mode to watch for

The previous project's `api.ts` reached 1,300 lines and was imported by 42
files. That is how a clean architecture dies: not in one decision, but in
forty call sites reaching past the seam because it was quicker.

The rule that prevents it is the one above — **components talk to interfaces,
never to `fetch`** — and it is worth failing a code review over.

## Alternatives considered

**Stay local-only forever.** Simplest, cheapest, no server to run or secure.
Rejected: it caps the product below its own purpose. Shared lineage is the
product; the Spark engine cannot run at all; and the ~5 MB ceiling is reachable
with one real Fabric workspace.

**Keep the existing backend and strip only the stale parts.** Preserves the
Fabric integration and the assistant. Rejected: it keeps 25,000 lines of
prototype infrastructure whose integrations are the hardest thing to keep
working, and makes local development require credentials on day one. The parts
worth keeping — the lineage engine — were separable, and were kept.

**Backend-first, browser as a thin client.** The conventional enterprise shape,
and simplest for audit and RBAC. Rejected for now: it makes every contributor
provision infrastructure before rendering a screen, it puts a network round
trip inside canvas interactions that are currently instant, and it forecloses
the offline case for no present benefit. It remains a legitimate destination if
sync proves harder than expected.

**Stub the removed features behind fixtures.** Keeps the UI intact. Rejected:
it produces an app that demos well and works badly, and it makes "is this
wired up?" unanswerable without reading the source — the single most expensive
question a codebase can pose.
