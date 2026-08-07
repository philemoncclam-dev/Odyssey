"""A local HTTP bridge from the browser to the sandbox engine.

The engine (`runner.run_sandbox`) is a library that takes a `RunRequest` and
returns a `RunResult`. The Fabric Toolkit runs in a browser and cannot call a
Python function. This is the smallest thing that joins them.

STDLIB ONLY, deliberately. `requirements.txt` says the engine is pure and that
dropping the prototype's router removed FastAPI, uvicorn and httpx with it.
One JSON endpoint does not justify bringing them back, and a dependency added
here would be installed by everyone who only wants to run the tests.

DEVELOPMENT TOOL, not a deployment. `ThreadingHTTPServer` on loopback with a
permissive CORS header for the Vite dev server is right for one developer on
one machine and wrong for anything else: no authentication, no rate limiting,
no request size cap beyond the one below, and an endpoint whose entire purpose
is executing code you hand it. Do not put this on a network. An enterprise
deployment should call `run_sandbox` from its own service, which is a dozen
lines, and apply its own auth — see docs/fabric-toolkit-wiring.md.

READ THIS BEFORE RUNNING IT ANYWHERE SHARED
-------------------------------------------
`runner`'s own docstring is explicit that scrubbing the child's environment
does not hide the PARENT's: on Linux the child runs as the same uid, so
`/proc/1/environ` is one open() away and every variable this process holds is
readable by any notebook cell submitted to it. **A host that runs this must
hold no secrets in its environment.** That is exactly why the bridge is
separate from the app and why nothing here reads a credential: there is
nothing for it to leak while it stays a developer's local process.

Usage:

    python -m sandbox.service            # 127.0.0.1:8765
    python -m sandbox.service --port 9000

Then point the browser at it:

    cd app && VITE_SANDBOX_URL=http://127.0.0.1:8765 npm run dev
"""

from __future__ import annotations

import argparse
import json
import logging
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from sandbox.protocol import RunRequest
from sandbox.runner import run_sandbox, spark_available

log = logging.getLogger("sandbox.service")

#: Cap on a request body. A notebook is text; anything past this is a mistake
#: or an attack, and reading it into memory first is how a dev tool becomes a
#: denial of service against the developer running it.
MAX_BODY = 4 * 1024 * 1024

#: Hosts a dev server may be served from. CORS is granted to these and nothing
#: else — `*` would let any page open in the browser submit code to this
#: process, and this process runs what it is sent.
#:
#: The PORT is deliberately not pinned. Vite defaults to 5173 and silently
#: takes the next free port when it is busy, which is normal on a machine
#: running two checkouts; pinning it produced a "could not reach the sandbox
#: engine" that was really a blocked cross-origin request, and pointed at the
#: wrong thing entirely.
LOOPBACK_HOSTS = frozenset({"localhost", "127.0.0.1", "[::1]"})


def _origin_allowed(origin: str) -> bool:
    """True for an http origin on a loopback host, any port."""
    if not origin.startswith("http://"):
        # https on loopback is possible but not what a dev server does, and
        # every other scheme (file://, an extension) has no business here.
        return False
    host = origin[len("http://") :]
    hostname = host.rsplit(":", 1)[0] if ":" in host and not host.endswith("]") else host
    return hostname in LOOPBACK_HOSTS


def _to_run_request(body: dict[str, Any]) -> RunRequest:
    """Translate the browser's request shape into the engine's.

    The two differ because the prototype's backend sat between them and did
    work this bridge cannot: given `workspace_id`/`item_id` it fetched the
    notebook's cells from Fabric and its input schemas from OneLake, then
    called the engine. Both need a Fabric credential, which is the thing
    Odyssey deliberately does not have.

    So `cells` is required here. A request naming a notebook instead is not
    something to guess at — it is answered with an explanation, because
    silently running zero cells would report a notebook that touches nothing.
    """
    cells = body.get("cells")
    if not isinstance(cells, list) or not all(isinstance(c, str) for c in cells):
        raise ValueError(
            "This bridge runs cells you send it. Provide `cells: string[]`.\n"
            "Running a notebook by workspace_id/item_id means fetching its source "
            "from Fabric first, which needs a credential this process does not "
            "have — wire the `notebookSource` capability in the browser and send "
            "the cells it returns."
        )
    return RunRequest(
        notebook_name=body.get("name") or "sandbox",
        cells=cells,
        # The browser calls these `carried_schemas`: schemas observed by earlier
        # steps of the same sequence. To the engine they are simply the schemas
        # to stand the run up against.
        schemas=body.get("carried_schemas") or {},
        workspace=body.get("workspace") or "",
        lakehouse=body.get("lakehouse") or "",
    )


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "OdysseySandbox/1.0"

    # --- plumbing ---------------------------------------------------------

    def _cors(self) -> None:
        origin = self.headers.get("Origin", "")
        if origin and _origin_allowed(origin):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

    def _json(self, status: int, payload: Any) -> None:
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self._cors()
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, fmt: str, *args: Any) -> None:
        log.info("%s - %s", self.address_string(), fmt % args)

    # --- routes -----------------------------------------------------------

    def do_OPTIONS(self) -> None:  # noqa: N802 — BaseHTTPRequestHandler's naming
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path.rstrip("/") != "/sandbox/status":
            self._json(404, {"error": f"no route {self.path}"})
            return
        # Which executor a run would actually use. Worth exposing: a result
        # labelled `stub` when the developer believed Spark was installed is
        # the single most confusing thing about this engine.
        self._json(200, {"configured": True, "spark": spark_available()})

    def do_POST(self) -> None:  # noqa: N802
        if self.path.rstrip("/") != "/sandbox/run":
            self._json(404, {"error": f"no route {self.path}"})
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY:
            self._json(413, {"error": f"request body over {MAX_BODY} bytes"})
            return
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError as exc:
            self._json(400, {"error": f"invalid JSON: {exc}"})
            return
        if not isinstance(body, dict):
            self._json(400, {"error": "expected a JSON object"})
            return

        try:
            request = _to_run_request(body)
        except ValueError as exc:
            self._json(400, {"error": str(exc)})
            return

        try:
            result = run_sandbox(request)
        except Exception as exc:  # noqa: BLE001 — the boundary reports, never crashes
            # A 500 here would be a bare browser error. The engine's own failure
            # shape is a RunResult with `ok: false`, and the UI already renders
            # that, so an unexpected crash is reported the same way.
            log.exception("sandbox run failed")
            self._json(200, {"ok": False, "engine": "stub", "error": str(exc), "cells": [],
                             "reads": [], "writes": [], "table_schemas": {},
                             "column_lineage": [], "log": [], "saw_credentials": False})
            return

        self._json(200, json.loads(result.model_dump_json()))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    # Loopback by default and an explicit flag to change it, so exposing this
    # is always a deliberate act rather than a default nobody noticed.
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    log.info(
        "sandbox engine on http://%s:%d  (executor: %s)",
        args.host,
        args.port,
        "spark" if spark_available() else "stub",
    )
    if args.host not in ("127.0.0.1", "localhost", "::1"):
        log.warning(
            "Listening beyond loopback. This endpoint executes code it is sent "
            "and has no authentication — do not do this on a shared network."
        )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log.info("stopping")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
