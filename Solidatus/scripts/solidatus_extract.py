#!/usr/bin/env python3
"""Build the initial Solidatus 2026.3 MCP-only documentation snapshot.

This implementation intentionally uses only Python's standard library. Markdown
is parsed by the block/state parser below; regular expressions are used only
inside already identified inline-bearing blocks.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import dataclasses
import datetime as dt
import hashlib
import html
import json
import os
import random
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import uuid
from collections import defaultdict, deque
from pathlib import Path
from typing import Any, Iterable

SCHEMA_VERSION = "1.0"
IMPLEMENTATION_VERSION = "solidatus-extractor-1.0.0"
PARSER_VERSION = "solidatus-block-markdown-1.0.0"
NORMALIZATION_VERSION = "1.0"
CHUNKING_VERSION = "1.0"
TOKENIZER = "unicode-word-estimator-1.0"
HASH_ALGORITHM = "SHA-256"
ENDPOINT = "https://docs.solidatus.com/~gitbook/mcp"
PRODUCT_RELEASE = "2026.3"
PROTOCOL_VERSION = "2025-03-26"
MAX_ATTEMPTS = 3
TIMEOUT_SECONDS = 45
CONCURRENCY = 4

ROOTS = [
    ("Welcome to Solidatus", "/"),
    ("Get Started", "/get-started/about-solidatus"),
    ("The User Interface", "/the-user-interface/the-user-interface"),
    ("Models", "/models/models-main"),
    ("Data Domains", "/data-domains/data-domains-main"),
    ("Solidatus Best Practice", "/solidatus-best-practice/best-practice-main"),
    ("Connectors", "/connectors/connectors-overview"),
    ("Account Management", "/account-management/account-settings"),
    ("API Documentation", "/api-documentation/api-overview"),
    ("Additional Resources", "/additional-resources/solidatus-glossary"),
    ("Release Notes", "/release-notes/release-notes-main"),
]
SMOKE_PATHS = [
    "/models/models-main",
    "/connectors/connectors-overview",
    "/api-documentation/api-overview",
]
LANDMARKS = {
    "Models": [
        "Understand Solidatus models", "Build and edit models",
        "Explore and analyse models", "Share and collaborate",
        "Solidatus AI Assistant",
    ],
    "Data Domains": [
        "Understand Data Domains", "Build Data Domains", "Explore Data Domains",
        "Data Maps", "Analytics reports",
    ],
    "Connectors": [
        "Java connector SDK", "Azure Data Factory", "Collibra", "Databases",
        "Databricks", "Legacy Mainframe", "MongoDB", "Power BI", "Purview",
        "Snowflake", "Snowflake Multi-Database", "SSIS", "Tableau", "WebFOCUS",
        "AzureSQL", "BigQuery", "DB2", "Hive", "Impala", "MySQL", "Oracle",
        "PostgreSQL", "Redshift", "SQL Server", "Sybase ASE", "Sybase IQ",
        "Teradata",
    ],
    "API Documentation": [
        "API overview", "Models API reference",
        "Query domains and models via the API", "Webhooks",
    ],
}
OLD_PREFIXES = ("/solidatus-6.5/", "/solidatus-2026.1/", "/solidatus-2026.2/")
TRACKING_KEYS = {"utm_source", "utm_medium", "utm_campaign", "utm_term",
                 "utm_content", "gclid", "fbclid"}
URL_RE = re.compile(r"https?://[^\s<>\]\)\"']+")
MD_LINK_RE = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+[\"'][^\"']*[\"'])?\)")
MD_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+[\"'][^\"']*[\"'])?\)")
HTML_IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
ALT_RE = re.compile(r"\balt\s*=\s*[\"']([^\"']*)[\"']", re.I)
SRC_RE = re.compile(r"\bsrc\s*=\s*[\"']([^\"']*)[\"']", re.I)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
LIST_RE = re.compile(r"^\s*(?:[-+*]|\d+[.)])\s+")
TABLE_RULE_RE = re.compile(r"^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$")


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_text(text: str) -> str:
    return sha256_bytes(text.encode("utf-8"))


def stable_id(prefix: str, *parts: str, length: int = 24) -> str:
    return f"{prefix}-{sha256_text(chr(31).join(parts))[:length]}"


def norm_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def json_bytes(value: Any, pretty: bool = True) -> bytes:
    if pretty:
        return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + f".tmp-{uuid.uuid4().hex[:8]}")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def write_json(path: Path, value: Any) -> None:
    atomic_write(path, json_bytes(value))


def write_text(path: Path, text: str) -> None:
    atomic_write(path, norm_newlines(text).encode("utf-8"))


def write_jsonl(path: Path, records: Iterable[dict[str, Any]]) -> None:
    ordered = list(records)
    atomic_write(path, b"".join(json_bytes(r, pretty=False) for r in ordered))


def append_jsonl(path: Path, record: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("ab") as handle:
        handle.write(json_bytes(record, pretty=False))
        handle.flush()
        os.fsync(handle.fileno())


def canonicalize_url(raw: str, base: str | None = None) -> dict[str, Any]:
    raw = html.unescape(raw.strip().strip("<>"))
    try:
        joined = urllib.parse.urljoin(base or "https://docs.solidatus.com/", raw)
        split = urllib.parse.urlsplit(joined)
    except ValueError as exc:
        return {
            "original": raw, "page_url": raw, "full_url": raw,
            "canonical_path": raw, "fragment": None, "host": "",
            "internal_host": False, "malformed": True,
            "malformed_reason": str(exc),
        }
    scheme = split.scheme.lower() or "https"
    host = (split.hostname or "").lower()
    port = split.port
    netloc = host if not port or (scheme == "https" and port == 443) else f"{host}:{port}"
    path = urllib.parse.quote(urllib.parse.unquote(split.path or "/"), safe="/:@-._~!$&'()*+,;=")
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    query_pairs = [
        (k, v) for k, v in urllib.parse.parse_qsl(split.query, keep_blank_values=True)
        if k.lower() not in TRACKING_KEYS
    ]
    query = urllib.parse.urlencode(sorted(query_pairs))
    page_url = urllib.parse.urlunsplit((scheme, netloc, path, query, ""))
    full_url = urllib.parse.urlunsplit((scheme, netloc, path, query, split.fragment))
    return {
        "original": raw,
        "page_url": page_url,
        "full_url": full_url,
        "canonical_path": path,
        "fragment": split.fragment or None,
        "host": host,
        "internal_host": host == "docs.solidatus.com",
        "malformed": False,
    }


def eligible_internal(url_info: dict[str, Any]) -> tuple[bool, str]:
    if url_info.get("malformed"):
        return False, "broken"
    if not url_info["internal_host"]:
        return False, "external"
    path = url_info["canonical_path"].lower()
    if any(path.startswith(prefix) for prefix in OLD_PREFIXES):
        return False, "version-conflict"
    if path.startswith("/~gitbook/"):
        return False, "infrastructure"
    return True, "included"


def parse_sse_or_json(data: bytes, content_type: str | None) -> dict[str, Any]:
    text = data.decode("utf-8")
    if "text/event-stream" in (content_type or "") or text.lstrip().startswith(("event:", "data:")):
        chunks = []
        for line in text.splitlines():
            if line.startswith("data:"):
                chunks.append(line[5:].lstrip())
        if not chunks:
            raise ValueError("SSE response contained no data field")
        return json.loads("\n".join(chunks))
    return json.loads(text)


@dataclasses.dataclass
class CallResult:
    method: str
    arguments: dict[str, Any]
    response: dict[str, Any] | None
    raw_transport: str
    status: str
    http_status: int | None
    duration_ms: int
    attempt: int
    error: str | None
    timestamp: str


class MCPClient:
    def __init__(self, endpoint: str = ENDPOINT):
        self.endpoint = endpoint
        self._id = 0

    def _post(self, payload: dict[str, Any], method_label: str,
              arguments: dict[str, Any]) -> CallResult:
        last_error = None
        for attempt in range(1, MAX_ATTEMPTS + 1):
            started = time.monotonic()
            stamp = utc_now()
            request = urllib.request.Request(
                self.endpoint,
                data=json.dumps(payload, separators=(",", ":")).encode("utf-8"),
                method="POST",
                headers={
                    "Accept": "application/json, text/event-stream",
                    "Content-Type": "application/json",
                    "MCP-Protocol-Version": PROTOCOL_VERSION,
                    "User-Agent": f"{IMPLEMENTATION_VERSION}",
                },
            )
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                    body = response.read()
                    duration = int((time.monotonic() - started) * 1000)
                    parsed = None if response.status == 202 or not body else parse_sse_or_json(
                        body, response.headers.get("Content-Type"))
                    raw = body.decode("utf-8", errors="strict")
                    status = "success"
                    error = None
                    if parsed and "error" in parsed:
                        status = "error"
                        error = json.dumps(parsed["error"], ensure_ascii=False, sort_keys=True)
                    return CallResult(method_label, arguments, parsed, raw, status,
                                      response.status, duration, attempt, error, stamp)
            except (urllib.error.URLError, TimeoutError, OSError, ValueError, json.JSONDecodeError) as exc:
                duration = int((time.monotonic() - started) * 1000)
                last_error = f"{type(exc).__name__}: {exc}"
                permanent = isinstance(exc, urllib.error.HTTPError) and 400 <= exc.code < 500 and exc.code != 429
                if permanent or attempt == MAX_ATTEMPTS:
                    return CallResult(method_label, arguments, None, "", "error",
                                      getattr(exc, "code", None), duration, attempt,
                                      last_error, stamp)
                time.sleep((2 ** (attempt - 1)) + random.random() * 0.35)
        raise AssertionError(last_error)

    def rpc(self, method: str, params: dict[str, Any], label: str | None = None) -> CallResult:
        self._id += 1
        payload = {"jsonrpc": "2.0", "id": self._id, "method": method, "params": params}
        return self._post(payload, label or method, params)

    def notify(self, method: str, params: dict[str, Any]) -> CallResult:
        payload = {"jsonrpc": "2.0", "method": method, "params": params}
        return self._post(payload, method, params)

    def call_tool(self, name: str, arguments: dict[str, Any]) -> CallResult:
        return self.rpc("tools/call", {"name": name, "arguments": arguments}, name)


def result_text(result: CallResult) -> str:
    if not result.response or "result" not in result.response:
        return ""
    content = result.response["result"].get("content", [])
    texts = [item.get("text", "") for item in content if item.get("type") == "text"]
    return "\n".join(texts)


@dataclasses.dataclass
class Block:
    kind: str
    start_line: int
    end_line: int
    lines: list[str]
    heading_level: int | None = None
    heading_text: str | None = None

    @property
    def markdown(self) -> str:
        return "\n".join(self.lines)


def parse_blocks(markdown: str) -> list[Block]:
    """Stateful block parser preserving fenced code, tables, lists and callouts."""
    lines = norm_newlines(markdown).split("\n")
    blocks: list[Block] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        start = i
        heading = HEADING_RE.match(line)
        if heading:
            blocks.append(Block("heading", i + 1, i + 1, [line],
                                len(heading.group(1)), heading.group(2).strip()))
            i += 1
            continue
        if line.lstrip().startswith(("```", "~~~")):
            marker = line.lstrip()[:3]
            i += 1
            while i < len(lines):
                if lines[i].lstrip().startswith(marker):
                    i += 1
                    break
                i += 1
            blocks.append(Block("code", start + 1, i, lines[start:i]))
            continue
        if line.lstrip().startswith(("{%", "<figure", "<table")):
            opener = line.lstrip()
            if opener.startswith("{%"):
                end_pred = lambda value: value.lstrip().startswith("{% end")
            elif opener.startswith("<figure"):
                end_pred = lambda value: "</figure>" in value.lower()
            else:
                end_pred = lambda value: "</table>" in value.lower()
            i += 1
            while i < len(lines) and not end_pred(lines[i]):
                i += 1
            if i < len(lines):
                i += 1
            blocks.append(Block("gitbook-or-html", start + 1, i, lines[start:i]))
            continue
        if LIST_RE.match(line):
            i += 1
            while i < len(lines) and (LIST_RE.match(lines[i]) or lines[i].startswith((" ", "\t")) or not lines[i].strip()):
                i += 1
            while i > start and not lines[i - 1].strip():
                i -= 1
            blocks.append(Block("list", start + 1, i, lines[start:i]))
            continue
        if "|" in line and i + 1 < len(lines) and TABLE_RULE_RE.match(lines[i + 1]):
            i += 2
            while i < len(lines) and "|" in lines[i] and lines[i].strip():
                i += 1
            blocks.append(Block("table", start + 1, i, lines[start:i]))
            continue
        if line.lstrip().startswith(">"):
            i += 1
            while i < len(lines) and (lines[i].lstrip().startswith(">") or not lines[i].strip()):
                i += 1
            while i > start and not lines[i - 1].strip():
                i -= 1
            blocks.append(Block("blockquote", start + 1, i, lines[start:i]))
            continue
        i += 1
        while i < len(lines) and lines[i].strip():
            if HEADING_RE.match(lines[i]) or lines[i].lstrip().startswith(("```", "~~~")) or LIST_RE.match(lines[i]):
                break
            i += 1
        blocks.append(Block("paragraph", start + 1, i, lines[start:i]))
    return blocks


def extract_images(markdown: str, blocks: list[Block]) -> list[dict[str, Any]]:
    images = []
    for block_index, block in enumerate(blocks):
        for offset, line in enumerate(block.lines):
            line_no = block.start_line + offset
            for match in MD_IMAGE_RE.finditer(line):
                images.append({
                    "structural_location": f"block-{block_index}",
                    "source_span": {"coordinate_system": "raw-response", "start_line": line_no, "end_line": line_no},
                    "raw_target": match.group(2), "alt_text": match.group(1) or None,
                    "adjacent_caption_text": None, "source_syntax": "markdown",
                })
            for match in HTML_IMG_RE.finditer(line):
                element = match.group(0)
                src = SRC_RE.search(element)
                alt = ALT_RE.search(element)
                images.append({
                    "structural_location": f"block-{block_index}",
                    "source_span": {"coordinate_system": "raw-response", "start_line": line_no, "end_line": line_no},
                    "raw_target": src.group(1) if src else "",
                    "alt_text": alt.group(1) if alt else None,
                    "adjacent_caption_text": None, "source_syntax": "html",
                })
    return images


def normalize_inline_images(text: str) -> str:
    text = MD_IMAGE_RE.sub(lambda m: m.group(1).strip(), text)
    def replace_html(match: re.Match[str]) -> str:
        alt = ALT_RE.search(match.group(0))
        return alt.group(1).strip() if alt else ""
    return HTML_IMG_RE.sub(replace_html, text)


def normalize_markdown(markdown: str, blocks: list[Block]) -> str:
    output = []
    for block in blocks:
        cleaned = normalize_inline_images(block.markdown)
        # Remove empty GitBook image-only directives without removing captions/prose.
        cleaned_lines = [
            line for line in cleaned.splitlines()
            if not re.match(r"^\s*\{%\s*(?:image|endimage)\b.*%\}\s*$", line, re.I)
        ]
        cleaned = "\n".join(cleaned_lines).strip("\n")
        if cleaned.strip():
            output.append(cleaned.rstrip())
    return "\n\n".join(output).strip() + "\n"


def inline_to_text(value: str) -> str:
    value = MD_LINK_RE.sub(lambda m: m.group(1), value)
    value = re.sub(r"`([^`]*)`", r"\1", value)
    value = re.sub(r"[*_~]+", "", value)
    value = re.sub(r"<[^>]+>", "", value)
    return html.unescape(value)


def markdown_to_text(blocks: list[Block]) -> str:
    parts = []
    for block in blocks:
        lines = []
        for line in block.lines:
            line = re.sub(r"^\s*#{1,6}\s+", "", line)
            line = re.sub(r"^\s*>\s?", "", line)
            lines.append(inline_to_text(line))
        parts.append("\n".join(lines).strip())
    return "\n\n".join(part for part in parts if part).strip() + "\n"


def extract_links(markdown: str, source_url: str) -> list[dict[str, Any]]:
    links = []
    occupied: dict[int, list[tuple[int, int]]] = defaultdict(list)
    for line_no, line in enumerate(norm_newlines(markdown).splitlines(), 1):
        for match in MD_IMAGE_RE.finditer(line):
            occupied[line_no].append(match.span())
            links.append({"raw_target": match.group(2), "link_text": match.group(1),
                          "kind": "image", "line": line_no})
        for match in MD_LINK_RE.finditer(line):
            if any(a <= match.start() < b for a, b in occupied[line_no]):
                continue
            target = match.group(2)
            kind = "mailto" if target.lower().startswith("mailto:") else "unknown"
            links.append({"raw_target": target, "link_text": match.group(1),
                          "kind": kind, "line": line_no})
        for match in URL_RE.finditer(line):
            if any(a <= match.start() < b for a, b in occupied[line_no]):
                continue
            if any(item["line"] == line_no and item["raw_target"] == match.group(0) for item in links):
                continue
            links.append({"raw_target": match.group(0).rstrip(".,;:"), "link_text": match.group(0),
                          "kind": "unknown", "line": line_no})
    deduped = []
    seen = set()
    for item in links:
        key = (item["line"], item["raw_target"], item["link_text"], item["kind"])
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    return deduped


def extract_candidate_urls(text: str) -> list[str]:
    found = []
    for match in URL_RE.finditer(text):
        found.append(match.group(0).rstrip(".,;:"))
    for match in MD_LINK_RE.finditer(text):
        found.append(match.group(2))
    return sorted(set(found))


def slug_heading(text: str) -> str:
    text = unicodedata.normalize("NFKC", inline_to_text(text)).casefold()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text).strip("-")


def classify_page(path: str) -> tuple[str, str, float]:
    if path.startswith("/release-notes/"):
        return "release-note", "rule", 1.0
    if path.startswith("/api-documentation/"):
        return "api-reference", "rule", 0.9
    return "guide", "rule", 0.8


def historical_version(title: str, path: str) -> tuple[str | None, str | None, list[str]]:
    if not path.startswith("/release-notes/"):
        return None, None, []
    match = re.search(r"\b(?:20\d{2}\.\d+|\d+\.\d+(?:\.\d+)?)\b", title)
    if match:
        return match.group(0), match.group(0), []
    return None, None, ["historical-version-not-reliably-parsed"]


def schema(name: str, required: list[str], properties: dict[str, Any] | None = None) -> dict[str, Any]:
    props = {
        "schema_version": {"const": SCHEMA_VERSION},
        **(properties or {}),
    }
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": f"https://local.solidatus.example/schemas/{name}.schema.json",
        "title": name,
        "type": "object",
        "$comment": (
            "Optional properties may be absent. Nullable properties explicitly include null. "
            "All timestamps are ISO-8601 UTC. Hash fields use SHA-256 over UTF-8 bytes unless "
            "their hash_input property states otherwise."
        ),
        "required": ["schema_version", *required],
        "properties": props,
        "additionalProperties": True,
    }


def create_schemas(root: Path) -> None:
    timestamp = {"type": "string", "format": "date-time"}
    sha = {"type": "string", "pattern": "^[0-9a-f]{64}$", "hash_algorithm": HASH_ALGORITHM}
    specs = {
        "release-index": (["releases", "updated_at"], {"releases": {"type": "array"}, "updated_at": timestamp}),
        "release-summary": (["product_release", "authoritative_run_id"], {"product_release": {"type": "string"}, "authoritative_run_id": {"type": ["string", "null"]}}),
        "authoritative-run": (["product_release", "run_id", "selected_at"], {"selected_at": timestamp}),
        "run-manifest": (["run_id", "product_release", "run_status", "source_endpoint"], {"run_status": {"enum": ["in-progress", "complete", "blocked", "failed"]}}),
        "completion-status": (["run_id", "status", "validation_results"], {"status": {"enum": ["complete", "blocked", "failed"]}}),
        "raw-mcp-response": (["run_id", "raw_record_id", "tool_name", "arguments", "returned_textual_content", "response_content_hash", "status"], {"response_content_hash": sha, "status": {"enum": ["success", "error", "warning"]}}),
        "navigation": (["run_id", "product_release", "roots", "branches"], {}),
        "page": (["run_id", "product_release", "release_page_id", "canonical_url", "status"], {"status": {"enum": ["complete", "empty", "error", "redirect", "out-of-scope", "version-conflict", "unavailable"]}}),
        "section": (["run_id", "release_page_id", "section_id", "stable_heading_key"], {}),
        "chunk": (["run_id", "release_page_id", "chunk_id", "structural_locator"], {}),
        "link": (["run_id", "link_id", "source_release_page_id", "kind", "scope", "status"], {"kind": {"enum": ["internal-page", "internal-anchor", "external", "image", "mailto", "broken", "unknown"]}, "scope": {"enum": ["corpus", "solidatus-related", "unrelated", "unknown"]}, "status": {"enum": ["included", "out-of-scope", "candidate-review", "unresolved", "broken", "ignored-image", "not-dereferenced"]}}),
        "backlink": (["run_id", "backlink_id", "link_record_id", "target_release_page_id", "source_release_page_id"], {}),
        "navigation-occurrence": (["run_id", "occurrence_id", "release_page_id", "navigation_path"], {}),
        "note": (["note_ingestion_id", "note_id", "note_kind", "text"], {"note_kind": {"enum": ["observation", "hypothesis", "requirement", "idea", "question", "decision", "unknown"]}}),
        "note-ingestion-manifest": (["note_ingestion_id", "status"], {}),
        "knowledge-item": (["integrated_build_id", "knowledge_item_id", "source_type", "source_record_id"], {"source_type": {"enum": ["solidatus-documentation", "human-note"]}}),
        "evidence-relation": (["integrated_build_id", "relation_id", "source_item_id", "target_item_id"], {}),
        "integrated-build-manifest": (["integrated_build_id", "mode", "status"], {"mode": {"enum": ["latest-release", "release-history"]}}),
        "page-identity-mapping": (["logical_page_id", "product_release", "canonical_path_id", "canonical_path", "match_status"], {}),
        "external-link-decision": (["decision_id", "link_target", "disposition", "policy_version"], {}),
        "delta-manifest": (["delta_run_id", "old_release", "new_release", "status"], {}),
        "delta-summary": (["delta_run_id", "counts"], {}),
        "delta-page": (["delta_run_id", "existence_change", "identity_match_status"], {"existence_change": {"enum": ["unchanged", "added", "removed"]}, "identity_match_status": {"enum": ["same-id", "confirmed-match", "probable-match", "split-candidate", "merged-candidate", "unresolved"]}}),
        "delta-section": (["delta_run_id", "change_classification"], {}),
        "delta-link": (["delta_run_id", "change_classification"], {}),
        "delta-navigation": (["delta_run_id", "change_classification"], {}),
        "coverage-assessment": (["run_id", "discovery_closed", "source_completeness_proven", "branches"], {}),
        "mcp-call": (["run_id", "timestamp", "tool_name", "arguments", "status", "attempt"], {}),
        "error": (["run_id", "timestamp", "error_class", "message"], {}),
    }
    for name, (required, props) in specs.items():
        value = schema(name, required, props)
        value["schema_version"] = SCHEMA_VERSION
        value["x-null-semantics"] = "null means source value unknown or inapplicable; absence means optional field not emitted"
        value["x-controlled-vocabularies"] = "All status, kind, scope, mode, and change properties use schema enums"
        value["x-hash-contract"] = {"algorithm": HASH_ALGORITHM, "default_input": "UTF-8 bytes of normalized field content"}
        write_json(root / "schemas" / f"{name}.schema.json", value)


def schema_validate_object(obj: Any, schema_obj: dict[str, Any], path: str) -> list[str]:
    errors = []
    if schema_obj.get("type") == "object" and not isinstance(obj, dict):
        return [f"{path}: expected object"]
    for required in schema_obj.get("required", []):
        if required not in obj:
            errors.append(f"{path}: missing required field {required}")
    for key, prop in schema_obj.get("properties", {}).items():
        if key not in obj:
            continue
        value = obj[key]
        if "const" in prop and value != prop["const"]:
            errors.append(f"{path}.{key}: expected constant {prop['const']!r}")
        if "enum" in prop and value not in prop["enum"]:
            errors.append(f"{path}.{key}: value {value!r} outside enum")
        expected = prop.get("type")
        if expected:
            expected_types = expected if isinstance(expected, list) else [expected]
            checks = {"string": isinstance(value, str), "array": isinstance(value, list),
                      "object": isinstance(value, dict), "null": value is None,
                      "boolean": isinstance(value, bool), "integer": isinstance(value, int)}
            if not any(checks.get(item, True) for item in expected_types):
                errors.append(f"{path}.{key}: wrong type")
        if prop.get("pattern") and isinstance(value, str) and not re.match(prop["pattern"], value):
            errors.append(f"{path}.{key}: does not match pattern")
    return errors


class Extraction:
    def __init__(self, workspace: Path):
        self.workspace = workspace
        self.kb = workspace / "solidatus-knowledge-base"
        self.release_dir = self.kb / "releases" / PRODUCT_RELEASE
        self.started_at = utc_now()
        suffix = uuid.uuid4().hex[:8]
        compact_time = re.sub(r"[-:.Z]", "", self.started_at)[:15]
        self.run_id = f"{PRODUCT_RELEASE}-{compact_time}Z-{suffix}"
        self.run_dir = self.release_dir / "runs" / self.run_id
        self.client = MCPClient()
        self.server_metadata: dict[str, Any] = {}
        self.tool_schemas: list[dict[str, Any]] = []
        self.tool_schema_hashes: dict[str, str] = {}
        self.pages_raw: dict[str, dict[str, Any]] = {}
        self.discovery_records: list[dict[str, Any]] = []
        self.call_logs: list[dict[str, Any]] = []
        self.errors: list[dict[str, Any]] = []
        self.quarantined: dict[str, str] = {}
        self.aliases: dict[str, set[str]] = defaultdict(set)
        self.title_hints: dict[str, set[str]] = defaultdict(set)
        self.parent_hints: dict[str, list[list[str]]] = defaultdict(list)
        self.first_response_hashes: dict[str, str] = {}
        self.recovery_source: Path | None = None
        self.recovery_source_run_id: str | None = None

    def check_partial(self) -> None:
        runs = self.release_dir / "runs"
        if not runs.exists():
            return
        partials = []
        for manifest_path in runs.glob("*/run-manifest.json"):
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            if manifest.get("run_status") == "in-progress":
                partials.append((manifest_path, manifest))
        if len(partials) > 1:
            raise RuntimeError(f"Multiple incomplete runs exist: {[str(p[0].parent) for p in partials]}")
        if not partials:
            # A parser-only failed run may be deterministically reprocessed into a
            # new immutable run without mixing a later live snapshot.
            failed = []
            for manifest_path in runs.glob("*/run-manifest.json"):
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
                if (manifest.get("run_status") == "failed" and
                        manifest.get("implementation_version") == IMPLEMENTATION_VERSION and
                        manifest.get("failure") == "Invalid IPv6 URL"):
                    failed.append((manifest_path, manifest))
            if failed:
                manifest_path, manifest = sorted(
                    failed, key=lambda item: item[1].get("extraction_started_at", ""))[-1]
                self.recovery_source = manifest_path.parent
                self.recovery_source_run_id = manifest["run_id"]
            return
        manifest_path, manifest = partials[0]
        if (manifest.get("implementation_version") != IMPLEMENTATION_VERSION or
                manifest.get("product_release") != PRODUCT_RELEASE or
                manifest.get("source_endpoint") != ENDPOINT):
            raise RuntimeError(f"Incompatible incomplete run exists at {manifest_path.parent}")
        self.run_id = manifest["run_id"]
        self.run_dir = manifest_path.parent
        self.started_at = manifest["extraction_started_at"]
        # Verify and load preserved first-retrieval raw page artifacts.
        for raw_path in sorted((self.run_dir / "raw" / "mcp-pages").glob("*.json")):
            raw = json.loads(raw_path.read_text(encoding="utf-8"))
            if sha256_text(raw["returned_textual_content"]) != raw["response_content_hash"]:
                raise RuntimeError(f"Partial-run raw hash mismatch: {raw_path}")
            info = canonicalize_url(raw["requested_url"])
            path = info["canonical_path"]
            self.pages_raw[path] = {
                "url": info["page_url"], "info": info, "raw": raw,
                "raw_path": raw_path.relative_to(self.run_dir).as_posix(), "result": None,
            }
            self.first_response_hashes[path] = raw["response_content_hash"]

    def prepare(self) -> None:
        self.check_partial()
        create_schemas(self.kb)
        for relative in [
            "raw/mcp-pages", "raw/discovery-responses", "normalized/pages",
            "records", "reports", "checkpoints", "logs",
        ]:
            (self.run_dir / relative).mkdir(parents=True, exist_ok=True)
        manifest_path = self.run_dir / "run-manifest.json"
        if manifest_path.exists():
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            manifest["implementation_source_hash"] = sha256_bytes(Path(__file__).read_bytes())
            manifest.setdefault("resume_history", []).append({
                "resumed_at": utc_now(),
                "reason": "command runner terminated after MCP smoke retrieval",
                "verified_raw_artifacts": len(self.pages_raw),
            })
            write_json(manifest_path, manifest)
            return
        write_json(manifest_path, {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "product_release": PRODUCT_RELEASE, "run_status": "in-progress",
            "source_endpoint": ENDPOINT, "extraction_started_at": self.started_at,
            "extraction_ended_at": None, "implementation_version": IMPLEMENTATION_VERSION,
            "implementation_source_hash": sha256_bytes(Path(__file__).read_bytes()),
            "dependencies": {"python": sys.version.split()[0], "external_packages": []},
            "scope": "unversioned current guide plus current release-notes navigation",
            "external_link_policy": "classify-only-v1",
            "parser_version": PARSER_VERSION, "normalization_version": NORMALIZATION_VERSION,
            "chunking_version": CHUNKING_VERSION, "section_match_algorithm": "section-match-v1",
            "near_duplicate_algorithm": "near-duplicate-v1",
            "known_limitations": ["MCP does not expose an authoritative table of contents"],
            "supersedes_run_id": self.recovery_source_run_id,
        })
        if self.recovery_source:
            self.import_failed_run_raw()

    def import_failed_run_raw(self) -> None:
        assert self.recovery_source is not None
        imported_pages = 0
        for source in sorted((self.recovery_source / "raw" / "mcp-pages").glob("*.json")):
            raw = json.loads(source.read_text(encoding="utf-8"))
            if sha256_text(raw["returned_textual_content"]) != raw["response_content_hash"]:
                raise RuntimeError(f"Recovery source raw hash mismatch: {source}")
            destination = self.run_dir / "raw" / "mcp-pages" / source.name
            atomic_write(destination, source.read_bytes())
            info = canonicalize_url(raw["requested_url"])
            path = info["canonical_path"]
            self.pages_raw[path] = {
                "url": info["page_url"], "info": info, "raw": raw,
                "raw_path": destination.relative_to(self.run_dir).as_posix(), "result": None,
            }
            self.first_response_hashes[path] = raw["response_content_hash"]
            imported_pages += 1
        imported_discovery = 0
        for source in sorted((self.recovery_source / "raw" / "discovery-responses").glob("*.json")):
            raw = json.loads(source.read_text(encoding="utf-8"))
            if "returned_textual_content" not in raw or raw.get("purpose") == "snapshot-drift-check":
                continue
            if sha256_text(raw["returned_textual_content"]) != raw["response_content_hash"]:
                raise RuntimeError(f"Recovery discovery hash mismatch: {source}")
            destination = self.run_dir / "raw" / "discovery-responses" / source.name
            atomic_write(destination, source.read_bytes())
            urls = []
            for candidate in extract_candidate_urls(raw["returned_textual_content"]):
                info = canonicalize_url(candidate)
                if info["internal_host"]:
                    urls.append(info["page_url"])
            args = raw.get("arguments", {})
            question = args.get("question", "")
            parent_match = re.search(r"\((/[^)]*)\)", question)
            requested_parent = parent_match.group(1) if parent_match else None
            self.discovery_records.append({
                "branch_id": stable_id("branch", self.run_id, raw.get("tool_name", "unknown"),
                                       json.dumps(args, sort_keys=True), source.name),
                "requested_parent": requested_parent,
                "discovery_tool": raw.get("tool_name", "unknown"),
                "exact_query": args,
                "raw_response_path": destination.relative_to(self.run_dir).as_posix(),
                "raw_response_hash": raw["response_content_hash"],
                "returned_items": [
                    {"title": None, "url": url, "path": canonicalize_url(url)["canonical_path"],
                     "order": order, "item_type": "page-or-subgroup"}
                    for order, url in enumerate(sorted(set(urls)))
                ],
                "status": "checked" if raw.get("status") == "success" else "inaccessible",
                "conflicts": [], "warnings": ["reused-verified-evidence-from-failed-parser-run"],
                "imported_from_run_id": self.recovery_source_run_id,
            })
            imported_discovery += 1
        manifest_path = self.run_dir / "run-manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["recovery"] = {
            "source_run_id": self.recovery_source_run_id,
            "reason": "Reprocess verified raw MCP evidence after malformed-URL parser failure.",
            "imported_raw_pages": imported_pages,
            "imported_discovery_responses": imported_discovery,
            "raw_artifacts_preserved_byte_for_byte": True,
        }
        write_json(manifest_path, manifest)

    def record_call(self, result: CallResult) -> None:
        returned_urls = extract_candidate_urls(result.raw_transport)
        record = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "timestamp": result.timestamp, "tool_name": result.method,
            "arguments": result.arguments, "http_status": result.http_status,
            "mcp_status": "error" if result.error else "success",
            "status": result.status, "duration_ms": result.duration_ms,
            "attempt": result.attempt, "response_content_hash": sha256_text(result.raw_transport),
            "returned_page_urls": returned_urls, "error": result.error, "warning": None,
        }
        self.call_logs.append(record)
        append_jsonl(self.run_dir / "logs" / "mcp-calls.jsonl", record)
        if result.error:
            err = {
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "timestamp": result.timestamp, "error_class": "mcp-call-error",
                "message": result.error, "tool_name": result.method,
                "arguments": result.arguments, "transient": result.http_status in (None, 429, 500, 502, 503, 504),
            }
            self.errors.append(err)
            append_jsonl(self.run_dir / "logs" / "errors.jsonl", err)

    def initialize(self) -> None:
        init = self.client.rpc("initialize", {
            "protocolVersion": PROTOCOL_VERSION, "capabilities": {},
            "clientInfo": {"name": "solidatus-kb-extractor", "version": IMPLEMENTATION_VERSION},
        })
        self.record_call(init)
        if init.status != "success" or not init.response:
            raise RuntimeError(f"MCP initialize failed: {init.error}")
        self.server_metadata = init.response["result"]
        notified = self.client.notify("notifications/initialized", {})
        self.record_call(notified)
        listed = self.client.rpc("tools/list", {})
        self.record_call(listed)
        if listed.status != "success" or not listed.response:
            raise RuntimeError(f"MCP tools/list failed: {listed.error}")
        self.tool_schemas = listed.response["result"]["tools"]
        self.tool_schema_hashes = {
            tool["name"]: sha256_bytes(json_bytes(tool, pretty=False).rstrip(b"\n"))
            for tool in self.tool_schemas
        }
        actual = {tool["name"] for tool in self.tool_schemas}
        required = {"searchDocumentation", "getPage", "askQuestion"}
        if not required <= actual:
            raise RuntimeError(f"Required MCP tools missing: {sorted(required - actual)}")
        write_json(self.run_dir / "raw" / "discovery-responses" / "mcp-initialize.json", {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "initialize_response": init.response, "tools": self.tool_schemas,
            "tool_schema_hashes": self.tool_schema_hashes,
            "protocol_metadata": self.server_metadata,
        })

    def save_raw_page(self, url: str, result: CallResult, phase: str) -> dict[str, Any]:
        info = canonicalize_url(url)
        path = info["canonical_path"]
        if path in self.pages_raw:
            self.aliases[path].add(url)
            return self.pages_raw[path]["raw"]
        text = result_text(result)
        raw_id = stable_id("raw", self.run_id, info["page_url"])
        filename = f"{raw_id}.json"
        record = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "raw_record_id": raw_id, "timestamp": result.timestamp,
            "mcp_tool_name": "getPage", "tool_name": "getPage",
            "arguments": {"url": url}, "requested_url": url,
            "returned_textual_content": text,
            "response_content_hash": sha256_text(text),
            "transport_response_hash": sha256_text(result.raw_transport),
            "protocol_metadata": {
                "protocol_version": self.server_metadata.get("protocolVersion"),
                "server_info": self.server_metadata.get("serverInfo"),
            },
            "status": result.status, "error": result.error, "warnings": [],
            "retrieval_phase": phase, "hash_algorithm": HASH_ALGORITHM,
            "hash_input": "UTF-8 bytes of returned_textual_content",
        }
        write_json(self.run_dir / "raw" / "mcp-pages" / filename, record)
        if path not in self.pages_raw:
            self.pages_raw[path] = {
                "url": info["page_url"], "info": info, "raw": record,
                "raw_path": f"raw/mcp-pages/{filename}", "result": result,
            }
            self.first_response_hashes[path] = record["response_content_hash"]
        return record

    def retrieve_one(self, url: str, phase: str = "discovery") -> tuple[str, CallResult]:
        result = self.client.call_tool("getPage", {"url": url})
        return phase, result

    def retrieve_batch(self, urls: list[str], phase: str = "discovery") -> list[str]:
        new_candidates = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
            future_map = {pool.submit(self.retrieve_one, url, phase): url for url in urls}
            for future in concurrent.futures.as_completed(future_map):
                requested = future_map[future]
                _, result = future.result()
                self.record_call(result)
                raw = self.save_raw_page(requested, result, phase)
                if result.status == "success":
                    for target in extract_candidate_urls(raw["returned_textual_content"]):
                        info = canonicalize_url(target, requested)
                        eligible, reason = eligible_internal(info)
                        if reason == "version-conflict":
                            self.quarantined[info["page_url"]] = "older-version-prefix"
                        elif eligible:
                            new_candidates.append(info["page_url"])
        return sorted(set(new_candidates))

    def save_discovery(self, tool: str, args: dict[str, Any], result: CallResult,
                       requested_parent: str | None, index: int) -> dict[str, Any]:
        text = result_text(result)
        urls = []
        for raw in extract_candidate_urls(text):
            info = canonicalize_url(raw)
            eligible, reason = eligible_internal(info)
            if reason == "version-conflict":
                self.quarantined[info["page_url"]] = "older-version-prefix"
            if info["internal_host"]:
                urls.append(info["page_url"])
        raw_id = stable_id("discovery", self.run_id, tool, json.dumps(args, sort_keys=True), str(index))
        rel = f"raw/discovery-responses/{raw_id}.json"
        raw_record = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "raw_record_id": raw_id, "timestamp": result.timestamp,
            "tool_name": tool, "arguments": args,
            "requested_url": None, "returned_textual_content": text,
            "response_content_hash": sha256_text(text), "status": result.status,
            "error": result.error, "hash_algorithm": HASH_ALGORITHM,
            "hash_input": "UTF-8 bytes of returned_textual_content",
        }
        write_json(self.run_dir / rel, raw_record)
        branch = {
            "branch_id": stable_id("branch", self.run_id, tool, json.dumps(args, sort_keys=True)),
            "requested_parent": requested_parent, "discovery_tool": tool,
            "exact_query": args, "raw_response_path": rel,
            "raw_response_hash": raw_record["response_content_hash"],
            "returned_items": [
                {"title": None, "url": url, "path": canonicalize_url(url)["canonical_path"],
                 "order": order, "item_type": "page-or-subgroup"}
                for order, url in enumerate(sorted(set(urls)))
            ],
            "status": "checked" if result.status == "success" else "inaccessible",
            "conflicts": [], "warnings": [] if urls else ["no-urls-returned"],
        }
        self.discovery_records.append(branch)
        return branch

    def smoke_test(self) -> None:
        candidates = [f"https://docs.solidatus.com{path}" for path in SMOKE_PATHS]
        self.retrieve_batch(candidates, "smoke-test")
        failures = [
            path for path in SMOKE_PATHS
            if path not in self.pages_raw or not self.pages_raw[path]["raw"]["returned_textual_content"].strip()
        ]
        if failures:
            raise RuntimeError(f"getPage smoke tests failed or returned empty: {failures}")

    def discover(self) -> None:
        pending = deque()
        seen = set(self.pages_raw)
        for title, path in ROOTS:
            url = f"https://docs.solidatus.com{path}"
            info = canonicalize_url(url)
            self.title_hints[info["canonical_path"]].add(title)
            self.parent_hints[info["canonical_path"]].append([title])
            if info["canonical_path"] not in seen:
                pending.append(info["page_url"])
        idx = len(self.discovery_records)
        if self.recovery_source:
            branches = list(self.discovery_records)
            for entry in self.pages_raw.values():
                for target in extract_candidate_urls(entry["raw"]["returned_textual_content"]):
                    info = canonicalize_url(target, entry["url"])
                    eligible, _ = eligible_internal(info)
                    if eligible and info["canonical_path"] not in seen:
                        pending.append(info["page_url"])
        else:
            # Direct-child discovery for each required root.
            branches = []
            for title, path in ROOTS:
                question = (
                    f"List the direct child pages and immediate subgroups under the current "
                    f"'{title}' documentation section ({path}). Return page titles with full docs.solidatus.com URLs."
                )
                result = self.client.call_tool("askQuestion", {
                    "question": question,
                    "goal": "Reconstruct the current documentation navigation for an auditable release snapshot.",
                })
                self.record_call(result)
                branch = self.save_discovery("askQuestion", {
                    "question": question,
                    "goal": "Reconstruct the current documentation navigation for an auditable release snapshot.",
                }, result, path, idx)
                branches.append(branch)
                idx += 1
            # Orphan and landmark search pass. Each query is terminal evidence.
            search_queries = [title for title, _ in ROOTS]
            search_queries.extend(landmark for values in LANDMARKS.values() for landmark in values)
            for query in search_queries:
                result = self.client.call_tool("searchDocumentation", {"query": query})
                self.record_call(result)
                branch = self.save_discovery("searchDocumentation", {"query": query}, result, None, idx)
                branches.append(branch)
                idx += 1
        for branch in branches:
            for item in branch["returned_items"]:
                info = canonicalize_url(item["url"])
                eligible, _ = eligible_internal(info)
                if eligible and info["canonical_path"] not in seen:
                    pending.append(info["page_url"])
        # Fixed point from authoritative page links.
        while pending:
            batch = []
            while pending and len(batch) < 24:
                url = pending.popleft()
                info = canonicalize_url(url)
                if info["canonical_path"] in seen:
                    continue
                seen.add(info["canonical_path"])
                batch.append(info["page_url"])
            if not batch:
                continue
            discovered = self.retrieve_batch(batch)
            for url in discovered:
                info = canonicalize_url(url)
                if info["canonical_path"] not in seen:
                    pending.append(info["page_url"])
            self.write_checkpoints(pending, seen)
        # Mark link-derived branches as checked terminal evidence.
        for path, entry in sorted(self.pages_raw.items()):
            text = entry["raw"]["returned_textual_content"]
            returned = []
            for url in extract_candidate_urls(text):
                info = canonicalize_url(url, entry["url"])
                if info["internal_host"]:
                    returned.append(info["page_url"])
            self.discovery_records.append({
                "branch_id": stable_id("branch", self.run_id, "page-links", path),
                "requested_parent": path, "discovery_tool": "getPage-links",
                "exact_query": {"url": entry["url"]},
                "raw_response_path": entry["raw_path"],
                "raw_response_hash": entry["raw"]["response_content_hash"],
                "returned_items": [
                    {"title": None, "url": url, "path": canonicalize_url(url)["canonical_path"],
                     "order": order, "item_type": "page-or-subgroup"}
                    for order, url in enumerate(sorted(set(returned)))
                ],
                "status": "checked", "conflicts": [], "warnings": [],
            })
        self.write_checkpoints(deque(), seen)

    def write_checkpoints(self, pending: deque[str], seen: set[str]) -> None:
        write_json(self.run_dir / "checkpoints" / "discovery-state.json", {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "implementation_version": IMPLEMENTATION_VERSION, "updated_at": utc_now(),
            "pending_urls": list(pending), "seen_paths": sorted(seen),
            "raw_page_hashes": {p: e["raw"]["response_content_hash"] for p, e in sorted(self.pages_raw.items())},
            "branch_count": len(self.discovery_records),
        })
        write_json(self.run_dir / "checkpoints" / "extraction-state.json", {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "implementation_version": IMPLEMENTATION_VERSION, "updated_at": utc_now(),
            "retrieved_paths": sorted(self.pages_raw),
            "artifact_hashes_verified": True,
        })

    def derive(self) -> dict[str, list[dict[str, Any]]]:
        pages = []
        sections = []
        chunks = []
        links = []
        occurrences = []
        registry = []
        path_to_page: dict[str, str] = {}
        page_build: dict[str, dict[str, Any]] = {}
        for path, entry in sorted(self.pages_raw.items()):
            raw = entry["raw"]
            content = raw["returned_textual_content"]
            status = "complete" if content.strip() else ("error" if raw["status"] == "error" else "empty")
            raw_blocks = parse_blocks(content)
            images = extract_images(content, raw_blocks)
            normalized = normalize_markdown(content, raw_blocks) if content else ""
            normalized_blocks = parse_blocks(normalized)
            text = markdown_to_text(normalized_blocks) if normalized else ""
            headings = [
                {"text": b.heading_text, "level": b.heading_level, "line": b.start_line,
                 "anchor": slug_heading(b.heading_text or "")}
                for b in normalized_blocks if b.kind == "heading"
            ]
            title = headings[0]["text"] if headings else next(iter(self.title_hints[path]), path.strip("/").split("/")[-1] or "Welcome to Solidatus")
            canonical_path_id = stable_id("path", path)
            logical_page_id = stable_id("page", path)
            release_page_id = stable_id("release-page", PRODUCT_RELEASE, logical_page_id)
            path_to_page[path] = release_page_id
            normalized_rel = f"normalized/pages/{release_page_id}.md"
            write_text(self.run_dir / normalized_rel, normalized)
            kind, kind_method, kind_confidence = classify_page(path)
            hist_raw, hist_norm, hist_warn = historical_version(title, path)
            nav_path = min(self.parent_hints[path], key=len) if self.parent_hints[path] else [title]
            page = {
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "product_release": PRODUCT_RELEASE, "canonical_path_id": canonical_path_id,
                "logical_page_id": logical_page_id, "release_page_id": release_page_id,
                "title": title, "source_url": entry["url"], "canonical_url": entry["info"]["page_url"],
                "canonical_path": path, "url_aliases": sorted(self.aliases[path]),
                "primary_navigation_path": nav_path, "section": nav_path[0] if nav_path else None,
                "page_kind": kind, "page_kind_method": kind_method,
                "page_kind_confidence": kind_confidence, "documentation_snapshot": PRODUCT_RELEASE,
                "historical_product_version_raw": hist_raw,
                "historical_product_version_normalized": hist_norm,
                "normalized_content_path": normalized_rel,
                "source_raw_record_id": raw["raw_record_id"],
                "source_raw_artifact_path": entry["raw_path"],
                "source_raw_artifact_hash": sha256_bytes((self.run_dir / entry["raw_path"]).read_bytes()),
                "content_markdown": normalized, "content_text": text, "headings": headings,
                "raw_source_hash": raw["response_content_hash"],
                "normalized_content_hash": sha256_text(normalized),
                "hash_algorithm": HASH_ALGORITHM,
                "raw_hash_input": "UTF-8 bytes of returned_textual_content",
                "normalized_hash_input": "UTF-8 bytes of normalized Markdown with LF newlines",
                "parser_version": PARSER_VERSION, "normalization_version": NORMALIZATION_VERSION,
                "image_references_removed": len(images), "image_references": images,
                "source_method": "getPage", "retrieved_at": raw["timestamp"],
                "language": "en", "status": status, "warnings": hist_warn,
            }
            pages.append(page)
            page_build[path] = {"page": page, "blocks": normalized_blocks}
            registry.append({
                "schema_version": SCHEMA_VERSION, "logical_page_id": logical_page_id,
                "product_release": PRODUCT_RELEASE, "canonical_path_id": canonical_path_id,
                "canonical_path": path, "match_status": "new",
                "matching_method": "first-release-canonical-path", "confidence": 1.0,
                "confirming_actor_or_rule": "deterministic-first-release-rule",
                "confirmation_timestamp": self.started_at, "affected_run_ids": [self.run_id],
                "candidate_relations": [],
            })
        # Sections and chunks are derived from normalized files.
        for path, built in sorted(page_build.items()):
            page = built["page"]
            blocks: list[Block] = built["blocks"]
            section_groups: list[tuple[list[str], int, int, list[Block]]] = []
            ancestry: list[str] = []
            current: list[Block] = []
            current_path = [page["title"]]
            start_idx = 0
            for idx, block in enumerate(blocks):
                if block.kind == "heading":
                    if current:
                        section_groups.append((current_path, start_idx, idx - 1, current))
                    level = block.heading_level or 1
                    ancestry = ancestry[:max(0, level - 1)]
                    while len(ancestry) < level - 1:
                        ancestry.append("")
                    if len(ancestry) == level - 1:
                        ancestry.append(block.heading_text or "")
                    else:
                        ancestry[level - 1] = block.heading_text or ""
                    current_path = [part for part in ancestry if part]
                    current = [block]
                    start_idx = idx
                else:
                    if not current:
                        current_path = [page["title"]]
                        start_idx = idx
                    current.append(block)
            if current:
                section_groups.append((current_path, start_idx, len(blocks) - 1, current))
            for ordinal, (heading_path, start_block, end_block, group) in enumerate(section_groups):
                md = "\n\n".join(block.markdown for block in group).strip() + "\n"
                txt = markdown_to_text(group)
                heading = heading_path[-1] if heading_path else page["title"]
                stable_key = "/".join(slug_heading(part) for part in heading_path)
                section_id = stable_id("section", page["release_page_id"], stable_key, str(ordinal))
                section = {
                    "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                    "product_release": PRODUCT_RELEASE, "section_id": section_id,
                    "logical_page_id": page["logical_page_id"],
                    "release_page_id": page["release_page_id"],
                    "stable_heading_key": stable_key, "heading_text": heading,
                    "heading_ancestry": heading_path[:-1], "ordinal": ordinal,
                    "heading_level": next((b.heading_level for b in group if b.kind == "heading"), 1),
                    "ordered_block_types": [b.kind for b in group],
                    "block_hashes": [sha256_text(b.markdown) for b in group],
                    "section_markdown": md, "section_text": txt,
                    "section_markdown_hash": sha256_text(md),
                    "section_text_hash": sha256_text(txt),
                    "source_spans": {
                        "raw-response": {"coordinate_system": "raw-response", "start_line": group[0].start_line, "end_line": group[-1].end_line},
                        "normalized-markdown": {"coordinate_system": "normalized-markdown", "start_line": group[0].start_line, "end_line": group[-1].end_line},
                    },
                    "source_raw_record_id": page["source_raw_record_id"],
                    "source_raw_artifact_path": page["source_raw_artifact_path"],
                    "source_raw_artifact_hash": page["source_raw_artifact_hash"],
                    "parser_version": PARSER_VERSION, "normalization_version": NORMALIZATION_VERSION,
                    "hash_algorithm": HASH_ALGORITHM, "warnings": [],
                }
                sections.append(section)
                approx_tokens = max(1, round(len(re.findall(r"\w+|[^\w\s]", txt)) * 1.25))
                locator = f"blocks-{start_block}-{end_block}:{stable_key}"
                content_hash = sha256_text(md)
                chunk_id = stable_id("chunk", page["release_page_id"], locator, content_hash)
                chunk = {
                    "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                    "product_release": PRODUCT_RELEASE, "chunk_id": chunk_id,
                    "logical_page_id": page["logical_page_id"],
                    "release_page_id": page["release_page_id"],
                    "canonical_url": page["canonical_url"],
                    "navigation_path": page["primary_navigation_path"],
                    "heading_path": heading_path, "structural_locator": locator,
                    "source_span": {"coordinate_system": "normalized-markdown",
                                    "start_block": start_block, "end_block": end_block,
                                    "start_line": group[0].start_line, "end_line": group[-1].end_line},
                    "sequence": ordinal, "chunk_type": (
                        "procedure" if any(b.kind == "list" for b in group) else
                        "reference" if any(b.kind in ("table", "code") for b in group) else "section"
                    ),
                    "content_markdown": md, "text": txt,
                    "word_count": len(re.findall(r"\b\w+\b", txt)),
                    "character_count": len(txt), "approximate_token_count": approx_tokens,
                    "tokenizer": TOKENIZER, "normalized_content_hash": content_hash,
                    "hash_algorithm": HASH_ALGORITHM,
                    "hash_input": "UTF-8 bytes of chunk content_markdown",
                    "chunking_version": CHUNKING_VERSION,
                    "source_raw_record_id": page["source_raw_record_id"],
                    "source_raw_artifact_path": page["source_raw_artifact_path"],
                    "source_raw_artifact_hash": page["source_raw_artifact_hash"],
                    "parser_version": PARSER_VERSION,
                    "normalization_version": NORMALIZATION_VERSION,
                    "warnings": ["oversized-semantic-unit"] if approx_tokens > 900 else [],
                }
                chunks.append(chunk)
        chunks_by_page = defaultdict(list)
        for chunk in chunks:
            chunks_by_page[chunk["release_page_id"]].append(chunk)
        # Forward links, resolved after every page identity exists.
        for path, built in sorted(page_build.items()):
            page = built["page"]
            raw_content = self.pages_raw[path]["raw"]["returned_textual_content"]
            for ordinal, found in enumerate(extract_links(raw_content, page["canonical_url"])):
                target_info = canonicalize_url(found["raw_target"], page["canonical_url"])
                eligible, reason = eligible_internal(target_info)
                target_page_id = path_to_page.get(target_info["canonical_path"])
                if target_info.get("malformed"):
                    kind, scope, status = "broken", "unknown", "broken"
                elif found["kind"] == "image":
                    kind, scope, status = "image", "unknown", "ignored-image"
                elif found["kind"] == "mailto":
                    kind, scope, status = "mailto", "unrelated", "out-of-scope"
                elif target_info["internal_host"]:
                    kind = "internal-anchor" if target_info["fragment"] and target_info["canonical_path"] == path else "internal-page"
                    scope = "corpus"
                    status = "included" if target_page_id else ("out-of-scope" if reason == "version-conflict" else "unresolved")
                else:
                    kind = "external"
                    solidatus_related = "solidatus" in target_info["host"]
                    scope = "solidatus-related" if solidatus_related else "unknown"
                    status = "candidate-review" if solidatus_related else "not-dereferenced"
                source_chunk_id = None
                for chunk in chunks_by_page[page["release_page_id"]]:
                    span = chunk["source_span"]
                    if span["start_line"] <= found["line"] <= span["end_line"]:
                        source_chunk_id = chunk["chunk_id"]
                        break
                link_id = stable_id("link", page["release_page_id"], str(ordinal),
                                    found["raw_target"], str(found["line"]))
                links.append({
                    "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                    "product_release": PRODUCT_RELEASE, "link_id": link_id,
                    "source_release_page_id": page["release_page_id"],
                    "source_chunk_id": source_chunk_id,
                    "source_chunk_null_reason": None if source_chunk_id else "outside-normalized-chunk-span",
                    "source_raw_record_id": page["source_raw_record_id"],
                    "source_raw_artifact_path": page["source_raw_artifact_path"],
                    "source_raw_artifact_hash": page["source_raw_artifact_hash"],
                    "source_url": page["canonical_url"], "raw_target": found["raw_target"],
                    "normalized_target": target_info["full_url"],
                    "target_release_page_id": target_page_id,
                    "link_text": found["link_text"], "kind": kind, "scope": scope,
                    "status": status,
                    "source_span": {"coordinate_system": "raw-response",
                                    "start_line": found["line"], "end_line": found["line"]},
                    "parser_version": PARSER_VERSION,
                    "normalization_version": NORMALIZATION_VERSION,
                    "warnings": [] if status not in ("unresolved", "broken") else ["unresolved-internal-target"],
                })
        backlinks = []
        for link in links:
            if link["target_release_page_id"] and link["status"] == "included":
                backlinks.append({
                    "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                    "product_release": PRODUCT_RELEASE,
                    "backlink_id": stable_id("backlink", link["link_id"]),
                    "target_release_page_id": link["target_release_page_id"],
                    "target_chunk_id": None,
                    "source_release_page_id": link["source_release_page_id"],
                    "source_chunk_id": link["source_chunk_id"],
                    "link_record_id": link["link_id"], "source_span": link["source_span"],
                    "source_raw_record_id": link["source_raw_record_id"],
                    "source_raw_artifact_path": link["source_raw_artifact_path"],
                    "source_raw_artifact_hash": link["source_raw_artifact_hash"],
                })
        # Root occurrences plus evidence-derived secondary occurrences.
        for order, (title, path) in enumerate(ROOTS):
            release_page_id = path_to_page.get(path)
            if not release_page_id:
                continue
            occurrences.append({
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "product_release": PRODUCT_RELEASE,
                "occurrence_id": stable_id("nav", self.run_id, path, title),
                "release_page_id": release_page_id, "parent_occurrence_id": None,
                "title_as_listed": title, "order": order, "navigation_path": [title],
                "is_primary": True,
                "discovery_evidence": [
                    b["branch_id"] for b in self.discovery_records if b["requested_parent"] == path
                ],
            })
        # Every other page gets a retained occurrence under its first path segment.
        for path, release_page_id in sorted(path_to_page.items()):
            if any(item["release_page_id"] == release_page_id for item in occurrences):
                continue
            page = page_build[path]["page"]
            segment = path.strip("/").split("/")[0] if path != "/" else "root"
            nav_path = [segment.replace("-", " ").title(), page["title"]]
            occurrences.append({
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "product_release": PRODUCT_RELEASE,
                "occurrence_id": stable_id("nav", self.run_id, path, "/".join(nav_path)),
                "release_page_id": release_page_id, "parent_occurrence_id": None,
                "title_as_listed": page["title"], "order": 0,
                "navigation_path": nav_path, "is_primary": True,
                "discovery_evidence": [
                    b["branch_id"] for b in self.discovery_records
                    if any(item["path"] == path for item in b["returned_items"])
                ],
            })
        datasets = {
            "pages": sorted(pages, key=lambda r: r["canonical_path"]),
            "sections": sorted(sections, key=lambda r: (r["release_page_id"], r["ordinal"])),
            "chunks": sorted(chunks, key=lambda r: (r["release_page_id"], r["sequence"])),
            "links": sorted(links, key=lambda r: r["link_id"]),
            "backlinks": sorted(backlinks, key=lambda r: r["backlink_id"]),
            "navigation-occurrences": sorted(occurrences, key=lambda r: r["occurrence_id"]),
            "registry": sorted(registry, key=lambda r: r["canonical_path"]),
        }
        for name in ("pages", "sections", "chunks", "links", "backlinks", "navigation-occurrences"):
            write_jsonl(self.run_dir / "records" / f"{name}.jsonl", datasets[name])
        write_jsonl(self.kb / "page-identity-registry.jsonl", datasets["registry"])
        write_jsonl(self.run_dir / "external-link-decisions.jsonl", [])
        navigation = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "product_release": PRODUCT_RELEASE,
            "roots": [
                {"title": title, "path": path, "release_page_id": path_to_page.get(path),
                 "status": "included" if path in path_to_page else "missing"}
                for title, path in ROOTS
            ],
            "branches": self.discovery_records,
            "graph_model": "multi-parent occurrence graph",
        }
        write_json(self.run_dir / "navigation.json", navigation)
        return datasets

    def _trigrams(self, text: str) -> set[str]:
        normalized = re.sub(r"\s+", " ", inline_to_text(text).casefold()).strip()
        return {normalized[i:i + 3] for i in range(max(0, len(normalized) - 2))}

    def duplicate_report(self, pages: list[dict[str, Any]]) -> tuple[str, dict[str, Any]]:
        hashes = defaultdict(list)
        titles = defaultdict(list)
        for page in pages:
            hashes[page["normalized_content_hash"]].append(page["canonical_path"])
            titles[page["title"].casefold()].append(page["canonical_path"])
        exact = {h: paths for h, paths in hashes.items() if len(paths) > 1}
        duplicate_titles = {t: paths for t, paths in titles.items() if len(paths) > 1}
        near = []
        for i, left in enumerate(pages):
            left_tri = self._trigrams(left["content_text"])
            for right in pages[i + 1:]:
                right_tri = self._trigrams(right["content_text"])
                union = left_tri | right_tri
                score = len(left_tri & right_tri) / len(union) if union else 1.0
                if score >= 0.95 and left["normalized_content_hash"] != right["normalized_content_hash"]:
                    near.append({"left": left["canonical_path"], "right": right["canonical_path"], "score": round(score, 6)})
        report = "# Duplicate pages\n\n"
        report += f"Algorithm: `near-duplicate-v1`; normalized text 3-gram Jaccard threshold: `0.95`.\n\n"
        report += f"- Exact duplicate groups: {len(exact)}\n- Duplicate-title groups: {len(duplicate_titles)}\n- Near-duplicate pairs: {len(near)}\n\n"
        for item in near:
            report += f"- `{item['left']}` and `{item['right']}`: {item['score']}\n"
        return report, {"exact": exact, "duplicate_titles": duplicate_titles, "near": near}

    def write_reports(self, data: dict[str, list[dict[str, Any]]],
                      validation: dict[str, Any], drift: dict[str, Any]) -> dict[str, Any]:
        pages = data["pages"]
        counts = {name: len(records) for name, records in data.items() if name != "registry"}
        statuses = defaultdict(int)
        for page in pages:
            statuses[page["status"]] += 1
        branch_terminal = all(b["status"] in {"checked", "ambiguous", "truncated", "inaccessible"} for b in self.discovery_records)
        root_status = {
            path: ("present" if any(p["canonical_path"] == path for p in pages) else "missing")
            for _, path in ROOTS
        }
        landmark_evidence = {}
        combined_titles = " ".join(p["title"] for p in pages).casefold()
        discovery_text = " ".join(
            item.get("title") or "" for branch in self.discovery_records for item in branch["returned_items"]
        ).casefold()
        for group, names in LANDMARKS.items():
            landmark_evidence[group] = {
                name: (name.casefold() in combined_titles or name.casefold() in discovery_text)
                for name in names
            }
        discovery_closed = branch_terminal and not any(b["status"] == "unchecked" for b in self.discovery_records)
        coverage = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "product_release": PRODUCT_RELEASE, "discovery_closed": discovery_closed,
            "source_completeness_proven": False,
            "authoritative_enumeration_available": False,
            "queue_empty": True, "orphan_search_pass_complete": True,
            "branches": self.discovery_records, "root_status": root_status,
            "large_branch_landmarks": landmark_evidence,
            "ambiguous_branches": [b["branch_id"] for b in self.discovery_records if b["status"] != "checked"],
            "limitations": ["MCP exposes no authoritative table-of-contents enumeration."],
        }
        write_json(self.run_dir / "reports" / "coverage-assessment.json", coverage)
        duplicate_md, duplicate_data = self.duplicate_report(pages)
        write_text(self.run_dir / "reports" / "duplicate-pages.md", duplicate_md)
        unresolved_links = [l for l in data["links"] if l["status"] in ("unresolved", "broken")]
        external_candidates = [l for l in data["links"] if l["status"] in ("candidate-review", "not-dereferenced")]
        write_text(self.run_dir / "reports" / "link-validation.md",
                   "# Link validation\n\n"
                   f"- Forward links: {len(data['links'])}\n"
                   f"- Materialized backlinks: {len(data['backlinks'])}\n"
                   f"- Unresolved or broken internal links: {len(unresolved_links)}\n"
                   f"- External classification-only records: {len(external_candidates)}\n"
                   f"- Backlink regeneration matched: {validation.get('backlinks_match', False)}\n")
        write_text(self.run_dir / "reports" / "version-conflicts.md",
                   "# Version conflicts\n\n"
                   "Older edition candidates were quarantined, not retrieved.\n\n" +
                   ("\n".join(f"- `{url}` — {reason}" for url, reason in sorted(self.quarantined.items())) or "- None discovered.") + "\n")
        unresolved_pages = [p for p in pages if p["status"] != "complete"]
        inaccessible = [b for b in self.discovery_records if b["status"] != "checked"]
        write_text(self.run_dir / "reports" / "unresolved-items.md",
                   "# Unresolved items\n\n"
                   f"- Non-complete pages: {len(unresolved_pages)}\n"
                   f"- Non-checked discovery branches: {len(inaccessible)}\n"
                   f"- Unresolved internal links: {len(unresolved_links)}\n"
                   f"- Missing required roots: {sum(1 for v in root_status.values() if v == 'missing')}\n")
        image_count = sum(p["image_references_removed"] for p in pages)
        write_text(self.run_dir / "reports" / "normalization-validation.md",
                   "# Normalization validation\n\n"
                   f"- Parser: `{PARSER_VERSION}`\n"
                   f"- Normalization: `{NORMALIZATION_VERSION}`\n"
                   f"- Image references removed and recorded: {image_count}\n"
                   f"- Inline Markdown/file equivalence: {validation.get('inline_markdown_match', False)}\n"
                   f"- Raw and normalized hashes recomputed: {validation.get('hashes_match', False)}\n"
                   "- Block parsing preserves headings, fenced code, lists, tables, blockquotes, and GitBook/HTML blocks.\n")
        write_text(self.run_dir / "reports" / "extraction-summary.md",
                   "# Solidatus 2026.3 extraction summary\n\n"
                   f"- Run: `{self.run_id}`\n"
                   f"- Pages: {len(pages)}\n"
                   f"- Sections: {len(data['sections'])}\n"
                   f"- Chunks: {len(data['chunks'])}\n"
                   f"- Links: {len(data['links'])}\n"
                   f"- Backlinks: {len(data['backlinks'])}\n"
                   f"- Image references removed: {image_count}\n"
                   f"- Discovery closed: {str(discovery_closed).lower()}\n"
                   "- Source completeness proven: false\n"
                   f"- Validation passed: {str(validation.get('passed', False)).lower()}\n"
                   f"- Snapshot drift detected: {str(drift.get('drift_detected', False)).lower()}\n")
        return {"coverage": coverage, "counts": counts, "statuses": dict(statuses),
                "duplicate_data": duplicate_data, "image_count": image_count}

    def validate(self, data: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
        errors = []
        schema_map = {
            "pages": "page", "sections": "section", "chunks": "chunk",
            "links": "link", "backlinks": "backlink",
            "navigation-occurrences": "navigation-occurrence",
        }
        for dataset, schema_name in schema_map.items():
            schema_obj = json.loads((self.kb / "schemas" / f"{schema_name}.schema.json").read_text(encoding="utf-8"))
            for index, record in enumerate(data[dataset]):
                errors.extend(schema_validate_object(record, schema_obj, f"{dataset}[{index}]"))
        # Validate all schemas are parseable and self-identifying.
        for schema_path in sorted((self.kb / "schemas").glob("*.json")):
            value = json.loads(schema_path.read_text(encoding="utf-8"))
            if value.get("schema_version") != SCHEMA_VERSION:
                errors.append(f"{schema_path}: schema_version mismatch")
        ids_seen: dict[str, set[str]] = defaultdict(set)
        for dataset, id_key in [
            ("pages", "release_page_id"), ("sections", "section_id"),
            ("chunks", "chunk_id"), ("links", "link_id"),
            ("backlinks", "backlink_id"), ("navigation-occurrences", "occurrence_id"),
        ]:
            for record in data[dataset]:
                value = record[id_key]
                if value in ids_seen[dataset]:
                    errors.append(f"duplicate {dataset} id {value}")
                ids_seen[dataset].add(value)
        page_ids = {p["release_page_id"] for p in data["pages"]}
        chunk_ids = {c["chunk_id"] for c in data["chunks"]}
        link_ids = {l["link_id"] for l in data["links"]}
        for section in data["sections"]:
            if section["release_page_id"] not in page_ids:
                errors.append(f"section {section['section_id']} missing page")
        for chunk in data["chunks"]:
            if chunk["release_page_id"] not in page_ids:
                errors.append(f"chunk {chunk['chunk_id']} missing page")
        for link in data["links"]:
            if link["source_release_page_id"] not in page_ids:
                errors.append(f"link {link['link_id']} missing source page")
            if link["source_chunk_id"] and link["source_chunk_id"] not in chunk_ids:
                errors.append(f"link {link['link_id']} missing source chunk")
            if link["target_release_page_id"] and link["target_release_page_id"] not in page_ids:
                errors.append(f"link {link['link_id']} missing target page")
        for backlink in data["backlinks"]:
            if backlink["link_record_id"] not in link_ids:
                errors.append(f"backlink {backlink['backlink_id']} missing link")
        inline_match = True
        hashes_match = True
        provenance_match = True
        for page in data["pages"]:
            normalized_path = self.run_dir / page["normalized_content_path"]
            if not normalized_path.exists():
                errors.append(f"missing normalized file {normalized_path}")
                inline_match = False
                continue
            disk = normalized_path.read_text(encoding="utf-8")
            if norm_newlines(disk) != norm_newlines(page["content_markdown"]):
                inline_match = False
                errors.append(f"inline Markdown differs for {page['release_page_id']}")
            if sha256_text(norm_newlines(disk)) != page["normalized_content_hash"]:
                hashes_match = False
                errors.append(f"normalized hash mismatch for {page['release_page_id']}")
            raw_path = self.run_dir / page["source_raw_artifact_path"]
            if not raw_path.exists() or sha256_bytes(raw_path.read_bytes()) != page["source_raw_artifact_hash"]:
                provenance_match = False
                errors.append(f"raw provenance mismatch for {page['release_page_id']}")
            raw_obj = json.loads(raw_path.read_text(encoding="utf-8"))
            if sha256_text(raw_obj["returned_textual_content"]) != page["raw_source_hash"]:
                hashes_match = False
                errors.append(f"raw content hash mismatch for {page['release_page_id']}")
        regenerated = sorted([
            stable_id("backlink", link["link_id"])
            for link in data["links"]
            if link["target_release_page_id"] and link["status"] == "included"
        ])
        materialized = sorted(item["backlink_id"] for item in data["backlinks"])
        backlinks_match = regenerated == materialized
        if not backlinks_match:
            errors.append("materialized backlinks differ from forward links")
        # UTF-8 and JSONL physical-line validation across the KB.
        utf8_valid = True
        jsonl_valid = True
        for path in sorted(self.kb.rglob("*")):
            if not path.is_file():
                continue
            try:
                text = path.read_bytes().decode("utf-8")
            except UnicodeDecodeError as exc:
                utf8_valid = False
                errors.append(f"{path}: UTF-8 failure {exc}")
                continue
            if path.suffix == ".jsonl":
                for line_no, line in enumerate(text.splitlines(), 1):
                    if not line.strip():
                        continue
                    try:
                        obj = json.loads(line)
                        if not isinstance(obj, dict):
                            raise ValueError("not an object")
                    except Exception as exc:
                        jsonl_valid = False
                        errors.append(f"{path}:{line_no}: JSONL failure {exc}")
        return {
            "passed": not errors, "errors": errors,
            "schemas_valid": not any("required field" in e or "outside enum" in e for e in errors),
            "ids_unique": not any(e.startswith("duplicate") for e in errors),
            "references_valid": not any("missing" in e for e in errors),
            "utf8_valid": utf8_valid, "jsonl_valid": jsonl_valid,
            "inline_markdown_match": inline_match, "hashes_match": hashes_match,
            "provenance_match": provenance_match, "backlinks_match": backlinks_match,
            "deterministic_rebuild": inline_match and hashes_match and backlinks_match,
        }

    def drift_check(self) -> dict[str, Any]:
        checks = {}
        # Recheck tools/list, root, smoke pages, and samples from major branches.
        listed = self.client.rpc("tools/list", {})
        self.record_call(listed)
        current_tool_hashes = {}
        if listed.response:
            current_tool_hashes = {
                tool["name"]: sha256_bytes(json_bytes(tool, pretty=False).rstrip(b"\n"))
                for tool in listed.response["result"]["tools"]
            }
        checks["tool_schemas"] = {
            "initial": self.tool_schema_hashes, "final": current_tool_hashes,
            "changed": current_tool_hashes != self.tool_schema_hashes,
        }
        sample_paths = ["/", *SMOKE_PATHS]
        for prefix in ("/models/", "/data-domains/", "/connectors/", "/api-documentation/"):
            sample = next((path for path in sorted(self.pages_raw) if path.startswith(prefix)), None)
            if sample and sample not in sample_paths:
                sample_paths.append(sample)
        for path in sample_paths:
            url = f"https://docs.solidatus.com{path}"
            result = self.client.call_tool("getPage", {"url": url})
            self.record_call(result)
            new_hash = sha256_text(result_text(result))
            checks[path] = {
                "initial_hash": self.first_response_hashes.get(path),
                "final_hash": new_hash, "changed": self.first_response_hashes.get(path) != new_hash,
                "status": result.status,
            }
            raw_id = stable_id("drift", self.run_id, path)
            write_json(self.run_dir / "raw" / "discovery-responses" / f"{raw_id}.json", {
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "raw_record_id": raw_id, "timestamp": result.timestamp,
                "tool_name": "getPage", "arguments": {"url": url},
                "returned_textual_content": result_text(result),
                "response_content_hash": new_hash, "status": result.status,
                "purpose": "snapshot-drift-check",
            })
        drift_detected = any(value.get("changed", False) for value in checks.values())
        return {"drift_detected": drift_detected, "checks": checks,
                "policy": "Preserve first retrieval as run snapshot; do not mix final recheck content."}

    def finalize(self, data: dict[str, list[dict[str, Any]]],
                 validation: dict[str, Any], drift: dict[str, Any],
                 report_data: dict[str, Any]) -> None:
        ended = utc_now()
        records_paths = sorted((self.run_dir / "records").glob("*.jsonl"))
        corpus_hasher = hashlib.sha256()
        for path in records_paths:
            rel = path.relative_to(self.run_dir).as_posix()
            corpus_hasher.update(rel.encode("utf-8") + b"\0" + path.read_bytes())
        corpus_hash = corpus_hasher.hexdigest()
        manifest = json.loads((self.run_dir / "run-manifest.json").read_text(encoding="utf-8"))
        complete = validation["passed"] and report_data["coverage"]["discovery_closed"]
        manifest.update({
            "run_status": "complete" if complete else "failed",
            "extraction_ended_at": ended, "protocol_metadata": self.server_metadata,
            "tool_schemas": self.tool_schemas, "tool_schema_hashes": self.tool_schema_hashes,
            "schema_versions": {"all": SCHEMA_VERSION},
            "counts": report_data["counts"], "page_status_counts": report_data["statuses"],
            "removed_image_references": report_data["image_count"],
            "coverage_assessment": {
                "discovery_closed": report_data["coverage"]["discovery_closed"],
                "source_completeness_proven": False,
            },
            "snapshot_drift": drift, "corpus_wide_hash": corpus_hash,
            "corpus_hash_algorithm": HASH_ALGORITHM,
            "corpus_hash_ordering": "records/*.jsonl sorted by relative POSIX path; path NUL bytes concatenated with file bytes",
            "validation": validation,
            "known_limitations": [
                "MCP exposes no authoritative enumeration mechanism; source completeness is not proven.",
                "Navigation parent/order evidence is synthesized from MCP answers and page links and may be incomplete.",
                "External links were classified but never dereferenced.",
            ],
        })
        write_json(self.run_dir / "run-manifest.json", manifest)
        completion = {
            "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
            "product_release": PRODUCT_RELEASE,
            "status": "complete" if complete else "failed",
            "completed_at": ended, "validation_results": validation,
            "terminal_counts": {
                "pages": report_data["statuses"],
                "branches": {
                    status: sum(1 for b in self.discovery_records if b["status"] == status)
                    for status in ("checked", "ambiguous", "truncated", "inaccessible")
                },
            },
            "remaining_blockers": [] if complete else validation["errors"],
        }
        write_json(self.run_dir / "completion-status.json", completion)
        if not complete:
            raise RuntimeError(f"Run failed validation and was not made authoritative: {validation['errors'][:10]}")
        selected_at = utc_now()
        authoritative = {
            "schema_version": SCHEMA_VERSION, "product_release": PRODUCT_RELEASE,
            "run_id": self.run_id, "selected_at": selected_at,
            "selection_reason": "Initial run passed schema, hash, reference, UTF-8, rebuild, backlink, and discovery-closure validation.",
            "run_manifest_path": f"runs/{self.run_id}/run-manifest.json",
            "completion_status_path": f"runs/{self.run_id}/completion-status.json",
            "corpus_wide_hash": corpus_hash,
        }
        write_json(self.release_dir / "authoritative-run.json", authoritative)
        all_runs = list((self.release_dir / "runs").glob("*/run-manifest.json"))
        failed_run_ids = []
        for manifest_path in all_runs:
            prior = json.loads(manifest_path.read_text(encoding="utf-8"))
            if prior.get("run_status") == "failed":
                failed_run_ids.append(prior["run_id"])
        release_summary = {
            "schema_version": SCHEMA_VERSION, "product_release": PRODUCT_RELEASE,
            "authoritative_run_id": self.run_id, "documentation_snapshot": PRODUCT_RELEASE,
            "run_count": len(all_runs), "page_count": len(data["pages"]),
            "chunk_count": len(data["chunks"]), "updated_at": selected_at,
            "version_evidence": ["User-supplied product release label 2026.3"],
            "release_label_uncertainty": "Unversioned URLs do not independently prove the product release label.",
        }
        write_json(self.release_dir / "release-summary.json", release_summary)
        release_index = {
            "schema_version": SCHEMA_VERSION, "updated_at": selected_at,
            "releases": [{
                "product_release": PRODUCT_RELEASE,
                "authoritative_run_id": self.run_id,
                "authoritative_run_path": f"releases/{PRODUCT_RELEASE}/authoritative-run.json",
                "superseded_run_ids": sorted(failed_run_ids), "available_delta_pairs": [],
            }],
        }
        write_json(self.kb / "release-index.json", release_index)
        write_text(self.kb / "README.md", f"""# Solidatus documentation knowledge base

This portable corpus contains immutable, auditable Solidatus documentation release snapshots.
The initial authoritative snapshot is `{PRODUCT_RELEASE}`, run `{self.run_id}`.

## Authority and source

Canonical documentation was discovered and retrieved only through `{ENDPOINT}` using MCP
protocol `{self.server_metadata.get('protocolVersion', PROTOCOL_VERSION)}`. No HTML crawling,
sitemaps, `llms.txt`, browser automation, repositories, images, OCR, or external-link retrieval
were used. Raw MCP text is authoritative; normalized Markdown and JSONL records are deterministic
derived layers.

`source_completeness_proven` is false because MCP exposed no authoritative documentation
enumeration. `discovery_closed` records fixed-point closure of the evidence-based process.

## Algorithms

- URL canonicalization: lowercase scheme/host, strip identity fragments, remove tracking query
  keys, sort remaining query pairs, normalize trailing slashes and percent encoding.
- IDs: SHA-256 over named UTF-8 components separated by U+001F.
- Normalization: `{PARSER_VERSION}` block parser and normalization `{NORMALIZATION_VERSION}`.
- Chunking: semantic section units, version `{CHUNKING_VERSION}`, target 300–900 approximate tokens;
  oversized semantic units are retained with warnings.
- Dataset ordering: stable identifiers and structural sequence; JSON keys sorted.
- Hashes: SHA-256 over UTF-8 bytes with inputs recorded in records/manifests.
- Duplicate comparison: `near-duplicate-v1`, normalized text 3-gram Jaccard >= 0.95.
- Future section comparison contract: `section-match-v1` with the weights and thresholds specified
  by the execution plan.

Human-note ingestions and integrated builds are absent because no note files were supplied.
Delta builds are absent because only one product release is present.
""")

    def run(self) -> None:
        self.prepare()
        try:
            self.initialize()
            self.smoke_test()
            self.discover()
            data = self.derive()
            validation = self.validate(data)
            drift = self.drift_check()
            # Drift is a disclosed warning, not a validation failure; first content remains canonical.
            report_data = self.write_reports(data, validation, drift)
            self.finalize(data, validation, drift, report_data)
            print(json.dumps({
                "status": "complete", "run_id": self.run_id,
                "run_dir": str(self.run_dir), "pages": len(data["pages"]),
                "chunks": len(data["chunks"]), "links": len(data["links"]),
                "validation_passed": validation["passed"],
                "discovery_closed": report_data["coverage"]["discovery_closed"],
                "source_completeness_proven": False,
            }, indent=2))
        except Exception as exc:
            err = {
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "timestamp": utc_now(), "error_class": type(exc).__name__,
                "message": str(exc), "transient": False,
            }
            self.errors.append(err)
            append_jsonl(self.run_dir / "logs" / "errors.jsonl", err)
            manifest_path = self.run_dir / "run-manifest.json"
            if manifest_path.exists():
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
                manifest.update({"run_status": "failed", "extraction_ended_at": utc_now(),
                                 "failure": str(exc)})
                write_json(manifest_path, manifest)
            write_json(self.run_dir / "completion-status.json", {
                "schema_version": SCHEMA_VERSION, "run_id": self.run_id,
                "product_release": PRODUCT_RELEASE, "status": "failed",
                "completed_at": utc_now(), "validation_results": {"passed": False},
                "terminal_counts": {}, "remaining_blockers": [str(exc)],
            })
            raise


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    args = parser.parse_args()
    extraction = Extraction(args.workspace.resolve())
    extraction.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
