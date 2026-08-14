#!/usr/bin/env python3
"""Independent integrity audit for the authoritative Solidatus snapshot."""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import sys
import uuid
from collections import Counter
from pathlib import Path
from typing import Any


SCHEMA_VERSION = "1.0"
ALLOWED_MCP_TOOLS = {
    "initialize", "notifications/initialized", "tools/list",
    "getPage", "askQuestion", "searchDocumentation",
}
TERMINAL_BRANCH = {"checked", "ambiguous", "truncated", "inaccessible"}


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha_text(text: str) -> str:
    return sha(text.encode("utf-8"))


def stable_id(prefix: str, *parts: str, length: int = 24) -> str:
    return f"{prefix}-{sha_text(chr(31).join(parts))[:length]}"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    output = []
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"{path}:{number}: JSONL value is not an object")
        output.append(value)
    return output


def validate_required(value: dict[str, Any], schema: dict[str, Any], label: str) -> list[str]:
    errors = []
    for key in schema.get("required", []):
        if key not in value:
            errors.append(f"{label}: missing required field {key}")
    for key, contract in schema.get("properties", {}).items():
        if key not in value:
            continue
        if "const" in contract and value[key] != contract["const"]:
            errors.append(f"{label}.{key}: const mismatch")
        if "enum" in contract and value[key] not in contract["enum"]:
            errors.append(f"{label}.{key}: enum mismatch")
    return errors


def main() -> int:
    workspace = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    kb = workspace / "solidatus-knowledge-base"
    errors: list[str] = []
    warnings: list[str] = []
    checks: dict[str, Any] = {}

    auth = read_json(kb / "releases" / "2026.3" / "authoritative-run.json")
    run_id = auth["run_id"]
    run = kb / "releases" / "2026.3" / "runs" / run_id
    manifest = read_json(run / "run-manifest.json")
    completion = read_json(run / "completion-status.json")
    release_index = read_json(kb / "release-index.json")
    release_summary = read_json(kb / "releases" / "2026.3" / "release-summary.json")
    navigation = read_json(run / "navigation.json")
    coverage = read_json(run / "reports" / "coverage-assessment.json")

    checks["authority"] = (
        auth["run_id"] == manifest["run_id"] == completion["run_id"] and
        manifest["run_status"] == completion["status"] == "complete" and
        release_index["releases"][0]["authoritative_run_id"] == run_id and
        release_summary["authoritative_run_id"] == run_id
    )
    if not checks["authority"]:
        errors.append("Authoritative pointer, manifest, completion, release index, or summary disagree")

    schema_files = sorted((kb / "schemas").glob("*.schema.json"))
    checks["schema_count"] = len(schema_files)
    if len(schema_files) != 29:
        errors.append(f"Expected 29 schemas enumerated by the execution plan, found {len(schema_files)}")
    schemas = {}
    for path in schema_files:
        value = read_json(path)
        name = path.name.removesuffix(".schema.json")
        schemas[name] = value
        if value.get("schema_version") != SCHEMA_VERSION:
            errors.append(f"{path}: missing schema version")

    datasets = {
        name: read_jsonl(run / "records" / f"{name}.jsonl")
        for name in ("pages", "sections", "chunks", "links", "backlinks", "navigation-occurrences")
    }
    mapping = {
        "pages": "page", "sections": "section", "chunks": "chunk",
        "links": "link", "backlinks": "backlink",
        "navigation-occurrences": "navigation-occurrence",
    }
    for dataset_name, records in datasets.items():
        for index, record in enumerate(records):
            errors.extend(validate_required(record, schemas[mapping[dataset_name]],
                                            f"{dataset_name}[{index}]"))
    control_objects = [
        (auth, "authoritative-run", "authoritative-run.json"),
        (manifest, "run-manifest", "run-manifest.json"),
        (completion, "completion-status", "completion-status.json"),
        (release_index, "release-index", "release-index.json"),
        (release_summary, "release-summary", "release-summary.json"),
        (navigation, "navigation", "navigation.json"),
        (coverage, "coverage-assessment", "coverage-assessment.json"),
    ]
    for value, schema_name, label in control_objects:
        errors.extend(validate_required(value, schemas[schema_name], label))
    checks["schema_required_fields"] = not any("missing required field" in e for e in errors)

    # Decode every file and enforce one JSON object per physical JSONL line.
    utf8_count = 0
    jsonl_lines = 0
    for path in sorted(kb.rglob("*")):
        if not path.is_file():
            continue
        try:
            text = path.read_bytes().decode("utf-8")
            utf8_count += 1
        except UnicodeDecodeError as exc:
            errors.append(f"{path}: invalid UTF-8: {exc}")
            continue
        if path.suffix == ".jsonl":
            for line_no, line in enumerate(text.splitlines(), 1):
                if not line.strip():
                    continue
                jsonl_lines += 1
                try:
                    if not isinstance(json.loads(line), dict):
                        raise ValueError("not an object")
                except Exception as exc:
                    errors.append(f"{path}:{line_no}: invalid JSONL: {exc}")
    checks["utf8_files"] = utf8_count
    checks["jsonl_objects"] = jsonl_lines

    pages = datasets["pages"]
    sections = datasets["sections"]
    chunks = datasets["chunks"]
    links = datasets["links"]
    backlinks = datasets["backlinks"]
    occurrences = datasets["navigation-occurrences"]
    registry = read_jsonl(kb / "page-identity-registry.jsonl")

    id_specs = [
        (pages, "release_page_id"), (sections, "section_id"),
        (chunks, "chunk_id"), (links, "link_id"),
        (backlinks, "backlink_id"), (occurrences, "occurrence_id"),
    ]
    for records, key in id_specs:
        values = [record[key] for record in records]
        if len(values) != len(set(values)):
            errors.append(f"Duplicate IDs in {key}")
    checks["unique_ids"] = not any(e.startswith("Duplicate IDs") for e in errors)

    page_ids = {page["release_page_id"] for page in pages}
    chunk_ids = {chunk["chunk_id"] for chunk in chunks}
    link_ids = {link["link_id"] for link in links}
    raw_record_ids = set()
    cross_run_raw = Counter()
    normalized_matches = 0
    raw_matches = 0
    identity_matches = 0
    for page in pages:
        expected_path_id = stable_id("path", page["canonical_path"])
        expected_logical = stable_id("page", page["canonical_path"])
        expected_release = stable_id("release-page", "2026.3", expected_logical)
        if (page["canonical_path_id"], page["logical_page_id"], page["release_page_id"]) != (
                expected_path_id, expected_logical, expected_release):
            errors.append(f"Page identity mismatch: {page['canonical_path']}")
        else:
            identity_matches += 1
        normalized_path = run / page["normalized_content_path"]
        if not normalized_path.exists():
            errors.append(f"Missing normalized file: {page['normalized_content_path']}")
        else:
            normalized = normalized_path.read_text(encoding="utf-8").replace("\r\n", "\n")
            if normalized != page["content_markdown"].replace("\r\n", "\n"):
                errors.append(f"Inline/file Markdown mismatch: {page['canonical_path']}")
            elif sha_text(normalized) != page["normalized_content_hash"]:
                errors.append(f"Normalized hash mismatch: {page['canonical_path']}")
            else:
                normalized_matches += 1
        raw_path = run / page["source_raw_artifact_path"]
        if not raw_path.exists() or sha(raw_path.read_bytes()) != page["source_raw_artifact_hash"]:
            errors.append(f"Raw artifact hash mismatch: {page['canonical_path']}")
        else:
            raw_obj = read_json(raw_path)
            raw_record_ids.add(raw_obj["raw_record_id"])
            cross_run_raw[raw_obj["run_id"]] += 1
            if (sha_text(raw_obj["returned_textual_content"]) != raw_obj["response_content_hash"] or
                    raw_obj["response_content_hash"] != page["raw_source_hash"]):
                errors.append(f"Raw content hash mismatch: {page['canonical_path']}")
            else:
                raw_matches += 1
    checks["page_identity_matches"] = identity_matches
    checks["normalized_hash_matches"] = normalized_matches
    checks["raw_hash_matches"] = raw_matches
    checks["raw_provenance_run_counts"] = dict(cross_run_raw)
    if any(source != run_id for source in cross_run_raw):
        warnings.append("Verified raw evidence from the superseded parser-failed run is intentionally retained byte-for-byte")

    for section in sections:
        if section["release_page_id"] not in page_ids:
            errors.append(f"Section missing page: {section['section_id']}")
        if sha_text(section["section_markdown"]) != section["section_markdown_hash"]:
            errors.append(f"Section Markdown hash mismatch: {section['section_id']}")
        if sha_text(section["section_text"]) != section["section_text_hash"]:
            errors.append(f"Section text hash mismatch: {section['section_id']}")
    for chunk in chunks:
        if chunk["release_page_id"] not in page_ids:
            errors.append(f"Chunk missing page: {chunk['chunk_id']}")
        expected = stable_id("chunk", chunk["release_page_id"],
                             chunk["structural_locator"], chunk["normalized_content_hash"])
        if expected != chunk["chunk_id"]:
            errors.append(f"Chunk ID mismatch: {chunk['chunk_id']}")
        if sha_text(chunk["content_markdown"]) != chunk["normalized_content_hash"]:
            errors.append(f"Chunk content hash mismatch: {chunk['chunk_id']}")
    for link in links:
        if link["source_release_page_id"] not in page_ids:
            errors.append(f"Link missing source page: {link['link_id']}")
        if link["source_chunk_id"] and link["source_chunk_id"] not in chunk_ids:
            errors.append(f"Link missing source chunk: {link['link_id']}")
        if link["target_release_page_id"] and link["target_release_page_id"] not in page_ids:
            errors.append(f"Link missing target page: {link['link_id']}")

    expected_backlinks = {
        stable_id("backlink", link["link_id"]): (
            link["link_id"], link["source_release_page_id"],
            link["source_chunk_id"], link["target_release_page_id"])
        for link in links
        if link["target_release_page_id"] and link["status"] == "included"
    }
    actual_backlinks = {
        item["backlink_id"]: (
            item["link_record_id"], item["source_release_page_id"],
            item["source_chunk_id"], item["target_release_page_id"])
        for item in backlinks
    }
    checks["backlinks_exact"] = expected_backlinks == actual_backlinks
    if not checks["backlinks_exact"]:
        errors.append("Materialized backlinks do not exactly match forward links")
    if any(item["link_record_id"] not in link_ids for item in backlinks):
        errors.append("Backlink references a missing link")

    registry_paths = {(item["canonical_path"], item["logical_page_id"]) for item in registry}
    expected_registry = {(page["canonical_path"], page["logical_page_id"]) for page in pages}
    checks["identity_registry_exact"] = registry_paths == expected_registry
    if not checks["identity_registry_exact"]:
        errors.append("Identity registry does not exactly cover authoritative pages")

    branch_statuses = Counter(branch["status"] for branch in navigation["branches"])
    checks["branch_statuses"] = dict(branch_statuses)
    checks["all_branches_terminal"] = all(
        branch["status"] in TERMINAL_BRANCH for branch in navigation["branches"])
    checks["all_roots_present"] = all(root["status"] == "included" for root in navigation["roots"])
    checks["all_pages_terminal"] = all(
        page["status"] in {"complete", "empty", "error", "redirect", "out-of-scope",
                           "version-conflict", "unavailable"} for page in pages)
    if not checks["all_branches_terminal"]:
        errors.append("A navigation branch is nonterminal")
    if not checks["all_roots_present"]:
        errors.append("A required root is missing")
    if not checks["all_pages_terminal"]:
        errors.append("A page is nonterminal")
    if not coverage["discovery_closed"] or coverage["source_completeness_proven"]:
        errors.append("Coverage closure/completeness flags are inconsistent with the plan")

    call_log = read_jsonl(run / "logs" / "mcp-calls.jsonl")
    called_tools = Counter(call["tool_name"] for call in call_log)
    checks["mcp_called_tools"] = dict(called_tools)
    prohibited = sorted(set(called_tools) - ALLOWED_MCP_TOOLS)
    if prohibited:
        errors.append(f"Unexpected or prohibited MCP tools called: {prohibited}")
    if "sendFeedback" in called_tools:
        errors.append("sendFeedback was called")

    image_files = [
        str(path.relative_to(kb)) for path in kb.rglob("*")
        if path.is_file() and path.suffix.lower() in {
            ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff"
        }
    ]
    checks["downloaded_image_files"] = image_files
    if image_files:
        errors.append(f"Image files unexpectedly present: {image_files[:5]}")

    corpus_hasher = hashlib.sha256()
    for path in sorted((run / "records").glob("*.jsonl")):
        rel = path.relative_to(run).as_posix()
        corpus_hasher.update(rel.encode("utf-8") + b"\0" + path.read_bytes())
    checks["corpus_hash_recomputed"] = corpus_hasher.hexdigest()
    checks["corpus_hash_matches"] = checks["corpus_hash_recomputed"] == manifest["corpus_wide_hash"]
    if not checks["corpus_hash_matches"]:
        errors.append("Corpus-wide hash mismatch")

    manifest_counts = manifest["counts"]
    actual_counts = {name: len(records) for name, records in datasets.items()}
    checks["record_counts"] = actual_counts
    checks["manifest_counts_match"] = all(
        manifest_counts.get(name) == count for name, count in actual_counts.items())
    if not checks["manifest_counts_match"]:
        errors.append("Manifest record counts disagree with datasets")
    checks["snapshot_drift_detected"] = manifest["snapshot_drift"]["drift_detected"]

    audit_id = f"integrity-{re.sub(r'[-:.Z]', '', now())[:15]}Z-{uuid.uuid4().hex[:8]}"
    audit_dir = kb / "integrity-checks" / audit_id
    audit_dir.mkdir(parents=True, exist_ok=False)
    result = {
        "schema_version": SCHEMA_VERSION, "integrity_check_id": audit_id,
        "checked_at": now(), "authoritative_run_id": run_id,
        "status": "passed" if not errors else "failed",
        "checks": checks, "errors": errors, "warnings": warnings,
        "hash_algorithm": "SHA-256",
        "scope": "independent schema-contract, encoding, identity, hash, provenance, reference, backlink, navigation, MCP-policy, image-policy, count, and corpus-hash audit",
    }
    (audit_dir / "integrity-check.json").write_text(
        json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2) + "\n",
        encoding="utf-8", newline="\n")
    summary = [
        "# Integrity check", "",
        f"- Audit: `{audit_id}`",
        f"- Authoritative run: `{run_id}`",
        f"- Status: **{result['status']}**",
        f"- Pages / sections / chunks: {len(pages)} / {len(sections)} / {len(chunks)}",
        f"- Links / backlinks: {len(links)} / {len(backlinks)}",
        f"- Schema files: {len(schema_files)}",
        f"- UTF-8 files checked: {utf8_count}",
        f"- JSONL objects parsed: {jsonl_lines}",
        f"- Errors: {len(errors)}",
        f"- Warnings: {len(warnings)}", "",
        "Source completeness remains explicitly unproven because MCP exposes no authoritative enumeration.",
    ]
    (audit_dir / "README.md").write_text("\n".join(summary) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": result["status"], "audit_dir": str(audit_dir),
                      "errors": errors, "warnings": warnings, "checks": checks}, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
