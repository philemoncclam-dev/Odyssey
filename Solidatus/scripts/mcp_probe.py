#!/usr/bin/env python3
"""Minimal standards-compliant Streamable HTTP MCP probe for Solidatus."""

from __future__ import annotations

import json
import sys
import urllib.request

ENDPOINT = "https://docs.solidatus.com/~gitbook/mcp"


def send(payload: dict) -> tuple[int, dict, bytes]:
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload, separators=(",", ":")).encode("utf-8"),
        method="POST",
        headers={
            "Accept": "application/json, text/event-stream",
            "Content-Type": "application/json",
            "User-Agent": "solidatus-kb-extractor/1.0.0",
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.status, dict(response.headers), response.read()


def main() -> int:
    calls = [
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-03-26",
                "capabilities": {},
                "clientInfo": {"name": "solidatus-kb-extractor", "version": "1.0.0"},
            },
        },
        {"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}},
        {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}},
    ]
    for payload in calls:
        status, headers, body = send(payload)
        print(f"\nMETHOD={payload['method']} STATUS={status}")
        print(f"CONTENT_TYPE={headers.get('Content-Type')}")
        print(f"SESSION={headers.get('Mcp-Session-Id')}")
        sys.stdout.buffer.write(body)
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
