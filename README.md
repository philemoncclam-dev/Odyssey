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
| Lineage engine (parked) | Not started |

## What this is not

Odyssey makes no network calls. There is no backend, no API, no
authentication, and no service configuration. Any feature requiring a remote
service was deliberately removed rather than stubbed, so that what ships is
what works.

The Spark-based lineage engine that derives column-level lineage from query
plans is kept in-tree and tested, but is not wired into the application. It is
a library here, not a feature.

## Development

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run test:run
```

See `CONTRIBUTING.md` for the branch, commit, and review conventions this
repository follows.

## License

Proprietary. See [LICENSE](./LICENSE).
