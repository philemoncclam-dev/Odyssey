"""The HTTP bridge in front of the engine.

The engine itself is covered by test_sandbox.py. What is worth pinning here is
the boundary: the request translation, and the fact that a bad request is
answered rather than crashed on. Both are the things a browser sees.

The server is started for real on an ephemeral port rather than mocked — it is
a dozen lines of stdlib and the interesting failures (CORS, a 404, a body it
cannot parse) only exist over a socket.
"""

from __future__ import annotations

import json
import threading
import urllib.error
import urllib.request
from collections.abc import Iterator
from http.server import ThreadingHTTPServer

import pytest

from sandbox.service import Handler, _to_run_request

VITE = "http://localhost:5173"


@pytest.fixture(scope="module")
def base_url() -> Iterator[str]:
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


def _post(url: str, payload: dict, origin: str | None = None):
    body = json.dumps(payload).encode()
    headers = {"Content-Type": "application/json"}
    if origin:
        headers["Origin"] = origin
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    return urllib.request.urlopen(req, timeout=60)  # noqa: S310 — fixed localhost URL


class TestTranslation:
    """Browser request shape → engine request shape."""

    def test_carries_the_sequence_schemas_through(self) -> None:
        req = _to_run_request(
            {
                "name": "build_silver",
                "cells": ["SELECT 1"],
                "workspace": "Analytics",
                "lakehouse": "lh_silver",
                "carried_schemas": {"Analytics/lh_bronze/orders": [{"name": "id"}]},
            }
        )
        assert req.notebook_name == "build_silver"
        assert req.workspace == "Analytics"
        assert req.lakehouse == "lh_silver"
        # The browser's `carried_schemas` are simply the engine's `schemas`.
        assert "Analytics/lh_bronze/orders" in req.schemas

    def test_names_an_unnamed_run_rather_than_leaving_it_blank(self) -> None:
        assert _to_run_request({"cells": []}).notebook_name == "sandbox"

    def test_refuses_a_notebook_id_instead_of_guessing(self) -> None:
        # Running zero cells would report a notebook that touches nothing,
        # which is a wrong answer rather than a missing one.
        with pytest.raises(ValueError, match="cells"):
            _to_run_request({"workspace_id": "w1", "item_id": "n1"})


class TestEndpoint:
    def test_status_reports_which_executor_would_run(self, base_url: str) -> None:
        with urllib.request.urlopen(f"{base_url}/sandbox/status", timeout=10) as res:  # noqa: S310
            body = json.load(res)
        assert body["configured"] is True
        assert isinstance(body["spark"], bool)

    def test_runs_a_cell_and_derives_column_lineage(self, base_url: str) -> None:
        with _post(
            f"{base_url}/sandbox/run",
            {
                "name": "build_silver",
                "workspace": "Analytics",
                "lakehouse": "lh_silver",
                "cells": [
                    'spark.sql("CREATE TABLE lh_silver.customers AS '
                    "SELECT id AS customer_id FROM lh_bronze.raw_customers\")"
                ],
                "carried_schemas": {
                    "Analytics/lh_bronze/raw_customers": [{"name": "id", "type": "bigint"}]
                },
            },
        ) as res:
            body = json.load(res)

        assert body["ok"] is True
        assert body["reads"] == ["Analytics/lh_bronze/raw_customers"]
        assert body["writes"] == ["Analytics/lh_silver/customers"]

        # The column mapping, WITHOUT `transform`. This is a test of the bridge,
        # and both engines legitimately describe the same edge differently: the
        # stub reports None for a plain passthrough, Spark reports Catalyst's
        # expression text (`raw_customers.id AS customer_id`). Asserting the
        # exact string pinned whichever engine happened to be installed, so the
        # suite broke the moment PySpark appeared — with the lineage correct.
        assert [
            (f["from_table"], f["from_column"], f["to_table"], f["to_column"])
            for f in body["column_lineage"]
        ] == [
            (
                "Analytics/lh_bronze/raw_customers",
                "id",
                "Analytics/lh_silver/customers",
                "customer_id",
            )
        ]
        # The isolation assertion, made visible. This must never be true.
        assert body["saw_credentials"] is False

    def test_explains_a_request_it_cannot_serve(self, base_url: str) -> None:
        with pytest.raises(urllib.error.HTTPError) as exc:
            _post(f"{base_url}/sandbox/run", {"workspace_id": "w1", "item_id": "n1"})
        assert exc.value.code == 400
        # The message has to name the way out, not just the refusal.
        assert "notebookSource" in json.load(exc.value)["error"]

    def test_rejects_a_body_that_is_not_an_object(self, base_url: str) -> None:
        req = urllib.request.Request(
            f"{base_url}/sandbox/run",
            data=b"[1, 2, 3]",
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with pytest.raises(urllib.error.HTTPError) as exc:
            urllib.request.urlopen(req, timeout=10)  # noqa: S310
        assert exc.value.code == 400

    def test_unknown_route_is_a_404_not_a_traceback(self, base_url: str) -> None:
        with pytest.raises(urllib.error.HTTPError) as exc:
            urllib.request.urlopen(f"{base_url}/nope", timeout=10)  # noqa: S310
        assert exc.value.code == 404


class TestCors:
    def test_allows_the_vite_dev_server(self, base_url: str) -> None:
        with _post(f"{base_url}/sandbox/run", {"cells": ["x = 1"]}, origin=VITE) as res:
            assert res.headers["Access-Control-Allow-Origin"] == VITE

    @pytest.mark.parametrize(
        "origin",
        ["http://localhost:5180", "http://127.0.0.1:4321", "http://localhost"],
    )
    def test_allows_any_port_on_loopback(self, base_url: str, origin: str) -> None:
        # Vite takes the next free port when 5173 is busy. Pinning the port
        # here turned an ordinary second checkout into a blocked request that
        # surfaced as "could not reach the sandbox engine".
        with _post(f"{base_url}/sandbox/run", {"cells": ["x = 1"]}, origin=origin) as res:
            assert res.headers["Access-Control-Allow-Origin"] == origin

    @pytest.mark.parametrize(
        "origin",
        [
            "https://evil.example",
            "http://evil.example",
            # The prefix tricks a naive startswith or "in" check would pass.
            "http://localhost.evil.example",
            "http://127.0.0.1.evil.example:5173",
        ],
    )
    def test_does_not_allow_anything_else(self, base_url: str, origin: str) -> None:
        # This endpoint executes what it is sent. A wildcard — or a sloppy
        # match — would let any tab in the browser submit code to it.
        with _post(f"{base_url}/sandbox/run", {"cells": ["x = 1"]}, origin=origin) as res:
            assert res.headers.get("Access-Control-Allow-Origin") is None
