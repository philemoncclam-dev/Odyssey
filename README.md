# Odyssey

A local-first data lineage modeling tool. Build, edit, version, and visualize
lineage models in the browser — no server, no account, no configuration.

Models live in your browser's local storage. Nothing is sent anywhere.

## Status

Early. The repository is being ported from an earlier full-stack prototype,
stripped down to the application itself. This table is the honest state, and
it gets updated as each piece lands, not before.

| Piece | State |
|---|---|
| Repository scaffold | Done |
| Modeling core | Done |
| App shell and model viewer | Done |
| Lineage engine | Done |
| Branching history and merge (local) | Done |
| Sign-in and access control (MSAL / Entra ID, app-side allowlist) | Done — gates the whole app |
| Data Product catalog (taxonomy, data product, application views) | Done, local only |
| Fabric Toolkit UI (Explore, sandbox, integrations) | Built; Fabric browsing wired to the real API behind an opt-in flag, unverified against a live tenant — see below |
| Sandbox engine | Done, runs locally |
| Server, shared models | Not started |

## What this is not

There is no backend, no API, and no service configuration. Models and the
catalog live in your browser's local storage; nothing about them is sent
anywhere.

**"Odyssey makes no network calls" is no longer true by default**, and this
line is being kept honest rather than quietly dropped. Sign-in
(`app/src/auth/`) gates the whole app behind MSAL, which calls Entra ID before
anything else renders. That is the one change to this claim — everything else
below still holds. For local development without a real Entra app
registration, `VITE_SKIP_AUTH=1 npm run dev` bypasses the gate entirely (never
set this in a deployed build).

The Fabric Toolkit is the other deliberate exception to "removed rather than
stubbed". Its screens — Explore, the notebook sandbox, Integrations — are
built and reachable, and every call they would make goes through a single
injectable interface (`app/src/fabric/api.ts`). By default the Fabric half —
browsing workspaces, reading a notebook, fetching a schema — runs on fixture
data, not a real call. A real, user-delegated implementation exists
(`app/src/fabric/realApi.ts`) for workspace/item/table listing and turns on
with `VITE_FABRIC_REAL=1`; it is unverified against a live tenant, so treat it
as a first draft, not a guarantee. Reading a notebook's source and fetching a
table's schema are not implemented at all yet — see that file's header for
why. See [docs/fabric-toolkit-wiring.md](docs/fabric-toolkit-wiring.md) for
the full picture.

The Spark-based lineage engine that derives column-level lineage from query
plans lives in `sandbox/` and is tested. It is a library, not a running
service: `python -m sandbox.service` puts one loopback HTTP endpoint in front
of it for development, and the app connects only when `VITE_SANDBOX_URL` is
set. Unset — every default checkout and every build — it is not wired in and
the app still makes no network calls.

## Deploying for a real organization

[`app/src/organization.config.ts`](app/src/organization.config.ts) is the one
file to edit: the Entra app registration, who's allowed to sign in, the
domain taxonomy, and the data product/application lists all live there, each
re-exported from wherever it used to be hardcoded so nothing else had to
change. It does not cover wiring real Fabric API calls in — that's code, not
values, and stays in `app/src/fabric/realApi.ts` (see
[docs/fabric-toolkit-wiring.md](docs/fabric-toolkit-wiring.md)).

## Development

```bash
# the app
cd app
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run test:run

# the lineage engine (Python 3.12)
py -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/python -m pytest tests/ -q

# the engine, reachable from the Fabric Toolkit's sandbox
.venv/Scripts/python -m sandbox.service          # 127.0.0.1:8765
cd app && VITE_SANDBOX_URL=http://127.0.0.1:8765 npm run dev

# local dev without a real Entra app registration
VITE_SKIP_AUTH=1 npm run dev

# real Fabric browsing (workspaces/items/tables), unverified — see the README's
# "What this is not" section and docs/fabric-toolkit-wiring.md
VITE_FABRIC_REAL=1 npm run dev
```

The engine's Spark suite skips unless PySpark is installed; the stub engine
covers the same contract without a JVM and is what CI runs. To analyse code
with real Catalyst plans instead, `.venv/Scripts/pip install pyspark==4.0.0`
(~400MB, needs Java 17+) — the runner picks it up with no configuration and
the 14 skipped tests start running.

See `CONTRIBUTING.md` for the branch, commit, and review conventions this
repository follows, and [`docs/adr/`](./docs/adr/) for the architectural
decisions and why they were made.

## License

Proprietary. See [LICENSE](./LICENSE).
