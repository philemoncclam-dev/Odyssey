# Solidatus documentation knowledge base

This portable corpus contains immutable, auditable Solidatus documentation release snapshots.
The initial authoritative snapshot is `2026.3`, run `2026.3-20260731T042137Z-825e5743`.

## Authority and source

Canonical documentation was discovered and retrieved only through `https://docs.solidatus.com/~gitbook/mcp` using MCP
protocol `2025-03-26`. No HTML crawling,
sitemaps, `llms.txt`, browser automation, repositories, images, OCR, or external-link retrieval
were used. Raw MCP text is authoritative; normalized Markdown and JSONL records are deterministic
derived layers.

`source_completeness_proven` is false because MCP exposed no authoritative documentation
enumeration. `discovery_closed` records fixed-point closure of the evidence-based process.

## Algorithms

- URL canonicalization: lowercase scheme/host, strip identity fragments, remove tracking query
  keys, sort remaining query pairs, normalize trailing slashes and percent encoding.
- IDs: SHA-256 over named UTF-8 components separated by U+001F.
- Normalization: `solidatus-block-markdown-1.0.0` block parser and normalization `1.0`.
- Chunking: semantic section units, version `1.0`, target 300–900 approximate tokens;
  oversized semantic units are retained with warnings.
- Dataset ordering: stable identifiers and structural sequence; JSON keys sorted.
- Hashes: SHA-256 over UTF-8 bytes with inputs recorded in records/manifests.
- Duplicate comparison: `near-duplicate-v1`, normalized text 3-gram Jaccard >= 0.95.
- Future section comparison contract: `section-match-v1` with the weights and thresholds specified
  by the execution plan.

Human-note ingestions and integrated builds are absent because no note files were supplied.
Delta builds are absent because only one product release is present.
