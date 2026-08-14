# Solidatus Multi-Release Documentation Extraction Execution Plan

## 1. Purpose

Build a durable, machine-readable knowledge base from the published Solidatus
documentation, beginning with the Solidatus 2026.3 release.

The knowledge base must:

- Preserve the published documentation faithfully.
- Support future Solidatus releases without overwriting earlier snapshots.
- Make added, removed, moved, and changed documentation easy to identify.
- Preserve internal links and generate backlinks for navigation and knowledge
  mapping.
- Accept human-written plain-text notes in a separate, traceable layer.
- Be portable to a generic LLM workflow without depending on a particular
  vector database or retrieval product.
- Retain enough raw source material and provenance to audit or rebuild derived
  records later.

This plan covers extraction, normalization, version comparison, and packaging.
It does not perform product ideation, feature-gap analysis, or product
reconstruction. Those activities belong to a later workflow that consumes this
knowledge base.

## 2. Initial release and future release model

The first snapshot is:

```text
2026.3
```

Here, `2026.3` means the third-quarter 2026 Solidatus product release. It is not
an extraction sequence number.

Each future release must receive its own immutable release directory, for
example:

```text
releases/2026.3/
releases/2026.4/
releases/2027.1/
```

Never update an older release snapshot in place merely because the live
documentation has changed. Corrections to extraction logic must be handled as
new extraction runs whose manifests point to the same product release and
explain the superseded run.

The documentation structure is expected to remain broadly stable, but the
system must support:

- New or removed pages.
- Moved or renamed pages.
- Changed page content.
- Changed headings or sections within a page.
- Changed navigation parents or ordering.
- Changed internal links.
- Release notes referring to historical product versions.

## 3. Working directory and preservation rules

Use:

```text
C:\Users\NN\Documents\Solidatus
```

Keep every generated script, schema, snapshot, checkpoint, log, and report
beneath this folder. Preserve the original
`SOLIDATUS_2026_3_EXTRACTION_PLAN.md` and all unrelated user files.

The output root is:

```text
solidatus-knowledge-base/
```

## 4. Permitted documentation source

Use only the published GitBook MCP endpoint for documentation discovery and
page retrieval:

```text
https://docs.solidatus.com/~gitbook/mcp
```

Do not use:

- HTML crawling or scraping.
- Browser automation.
- `sitemap.xml`.
- `llms.txt` or `llms-full.txt`.
- Search-engine caches.
- Version-control repositories as substitutes for MCP.
- Image downloads, OCR, image description, or image analysis.
- The MCP `sendFeedback` tool.

If MCP cannot provide a page or cannot prove complete navigation coverage,
record that limitation. Do not silently switch to another source.

## 5. Expected MCP tools

Previously observed tools are:

- `searchDocumentation`
  - Input: `{ "query": "..." }`
  - Use for candidate and orphan discovery only.
- `getPage`
  - Input: `{ "url": "..." }`
  - Use as the authoritative documentation content source.
- `askQuestion`
  - Input: `{ "question": "...", "goal": "..." }`
  - Use only for navigation discovery and reconciliation.
  - Keep `question` under 512 characters.
- `sendFeedback`
  - Never call.

The execution must call `initialize` and `tools/list` rather than assuming these
schemas remain unchanged.

## 6. Output architecture

Create:

```text
solidatus-knowledge-base/
  README.md
  release-index.json
  page-identity-registry.jsonl
  schemas/
    release-index.schema.json
    release-summary.schema.json
    authoritative-run.schema.json
    run-manifest.schema.json
    completion-status.schema.json
    raw-mcp-response.schema.json
    navigation.schema.json
    page.schema.json
    section.schema.json
    chunk.schema.json
    link.schema.json
    backlink.schema.json
    navigation-occurrence.schema.json
    note.schema.json
    note-ingestion-manifest.schema.json
    knowledge-item.schema.json
    evidence-relation.schema.json
    integrated-build-manifest.schema.json
    page-identity-mapping.schema.json
    external-link-decision.schema.json
    delta-manifest.schema.json
    delta-summary.schema.json
    delta-page.schema.json
    delta-section.schema.json
    delta-link.schema.json
    delta-navigation.schema.json
    coverage-assessment.schema.json
    mcp-call.schema.json
    error.schema.json
  releases/
    2026.3/
      authoritative-run.json
      release-summary.json
      runs/
        <run-id>/
          run-manifest.json
          completion-status.json
          navigation.json
          external-link-decisions.jsonl
          raw/
            mcp-pages/
            discovery-responses/
          normalized/
            pages/
          records/
            pages.jsonl
            sections.jsonl
            chunks.jsonl
            links.jsonl
            backlinks.jsonl
            navigation-occurrences.jsonl
          reports/
            extraction-summary.md
            coverage-assessment.json
            unresolved-items.md
            duplicate-pages.md
            link-validation.md
            version-conflicts.md
            normalization-validation.md
          checkpoints/
            discovery-state.json
            extraction-state.json
          logs/
            mcp-calls.jsonl
            errors.jsonl
  deltas/
    2026.3__2026.4/
      <delta-run-id>/
        delta-manifest.json
        summary.json
        pages.jsonl
        sections.jsonl
        links.jsonl
        navigation.jsonl
        report.md
  notes/
    ingestions/
      <note-ingestion-id>/
        manifest.json
        raw/
        records/
          notes.jsonl
  integrated/
    builds/
      <integrated-build-id>/
        manifest.json
        knowledge-items.jsonl
        evidence-relations.jsonl
```

For the first release, create the schemas and one immutable run beneath
`releases/2026.3/runs/`.
Create empty notes or integrated datasets only when their schemas and README
clearly state that no notes have yet been supplied. Do not invent placeholder
notes.

All run artifacts are immutable after completion. The only mutable release-level
control file is `authoritative-run.json`, which is updated atomically and only
after a candidate run passes validation. A corrected rerun receives a new
`run_id`; it never overwrites an earlier run. Delta and integrated builds are
also immutable and identify their exact input runs.

## 7. Artifact layers and authority

There are four distinct layers:

1. **Raw source**
   - Immutable textual MCP responses and discovery responses.
   - Used for audit and reprocessing.
2. **Normalized source**
   - Deterministic Markdown with image assets removed.
   - The canonical human-readable source representation.
3. **Derived records**
   - Pages, chunks, links, navigation occurrences, and deltas.
   - Rebuildable from raw and normalized artifacts.
4. **Human and integrated knowledge**
   - Plain-text human notes converted into traceable note records.
   - A unified LLM ingestion view that retains source type and provenance.

Never blend interpretation into canonical documentation records.

Approved Solidatus-related material from outside the GitBook MCP, if ever
authorized, belongs in a separate supplemental-source layer with its own
provenance and authority label. It must not be inserted into a canonical MCP
release snapshot.

## 8. Encoding and machine-readable contracts

All text files must use UTF-8 without mojibake. All JSONL files must contain one
valid JSON object per physical line.

Every schema and record must specify:

- `schema_version`.
- Required and optional fields.
- Null semantics.
- Controlled vocabularies.
- ISO-8601 timestamps in UTC.
- Hash algorithm and hash input.
- Normalization or chunking algorithm version where relevant.

Schema validation is a completion requirement, not an optional report.

## 9. Run, release, and provenance identifiers

Define:

- `product_release`: user-supplied label such as `2026.3`.
- `run_id`: immutable extraction-run identifier containing the release and UTC
  start time, plus a short random or deterministic suffix.
- `canonical_path_id`: deterministic identity of a normalized documentation
  path.
- `logical_page_id`: registry-backed identity that persists across confirmed
  moves and renames.
- `release_page_id`: identity of a logical page within a product release.
- `chunk_id`: identity of a source chunk within a release.

### URL canonicalization

Before computing identifiers:

1. Lowercase scheme and host.
2. Require host `docs.solidatus.com` for corpus-internal pages.
3. Remove fragments for page identity but retain them in link records.
4. Remove tracking query parameters.
5. Normalize a trailing slash consistently.
6. Normalize percent encoding without changing path meaning.
7. Preserve the original returned URL separately.
8. Record aliases and redirects instead of discarding them.

Derive `canonical_path_id` from the normalized canonical path. For the first
release, create a new `logical_page_id` and register its path. For later
releases, reuse a `logical_page_id` only when the path is already registered or
a move or rename has been confirmed.

Maintain `page-identity-registry.jsonl` as an append-only, versioned identity
map. Each mapping must record the logical page ID, release, canonical path ID,
path, match status, matching method, confidence, confirming actor or rule,
confirmation timestamp, and affected run IDs. A probable match keeps separate
logical IDs until reviewed; it may be recorded as a candidate relation but must
not silently merge identities.

Derive `release_page_id` from:

```text
product_release + logical_page_id
```

Derive `chunk_id` from:

```text
release_page_id + stable structural locator + local normalized content hash
```

Do not use sequence number alone for chunk identity.

All extraction-derived records must contain `run_id` and a direct raw
provenance reference such as `source_raw_record_id`, raw artifact path, and raw
artifact hash. Source spans must name their coordinate system:
`raw-response`, `normalized-markdown`, or both. Records must also carry the
relevant parser, normalization, chunking, and schema versions.

## 10. Release scope

For the initial run, extract the documentation snapshot associated with
Solidatus 2026.3.

Current guide pages generally use unversioned paths such as:

```text
https://docs.solidatus.com/models/models-main
```

Exclude older product-guide editions beneath prefixes such as:

```text
/solidatus-6.5/
/solidatus-2026.1/
/solidatus-2026.2/
```

Quarantine version-prefixed candidates for reporting rather than deleting
their discovery evidence.

Historical release-note pages reached through the current `/release-notes/`
navigation are in scope. Their record must retain:

- The containing documentation snapshot, such as `2026.3`.
- The raw historical version label found on the page.
- A normalized historical product version when it can be parsed reliably.
- `null` plus a warning when it cannot be parsed reliably.

An unversioned URL is not sufficient proof of release identity. The manifest
must record:

- The user-supplied product release.
- Any version evidence supplied by MCP content or navigation.
- Extraction start and end times.
- Any uncertainty about release labeling.

## 11. Starting navigation roots

Use these discovery seeds:

1. Welcome to Solidatus - `/`
2. Get Started - `/get-started/about-solidatus`
3. The User Interface - `/the-user-interface/the-user-interface`
4. Models - `/models/models-main`
5. Data Domains - `/data-domains/data-domains-main`
6. Solidatus Best Practice - `/solidatus-best-practice/best-practice-main`
7. Connectors - `/connectors/connectors-overview`
8. Account Management - `/account-management/account-settings`
9. API Documentation - `/api-documentation/api-overview`
10. Additional Resources - `/additional-resources/solidatus-glossary`
11. Release Notes - `/release-notes/release-notes-main`

Treat them as seeds, not proof of the complete or current structure.

## 12. Discovery strategy: iterative closure

The MCP endpoint has no authoritative table-of-contents method. Consequently,
discovery must be evidence-based and must not claim completeness that the tools
cannot prove.

Use a queue-driven fixed-point process:

1. Seed the queue with the 11 known roots.
2. Ask for one root or subgroup's direct children at a time.
3. Retrieve validated pages with `getPage`.
4. Extract internal documentation links from each retrieved page and enqueue
   previously unseen eligible targets.
5. Recursively ask about newly discovered subgroups.
6. Use `searchDocumentation` for orphan candidates and expected landmarks.
7. Reconcile conflicting titles, paths, parents, and navigation order.
8. Repeat until a full pass adds no new validated candidates.

For every discovery branch, record:

- Requested parent.
- Discovery tool and exact query.
- Raw response path and response hash.
- Returned titles, paths, and order.
- Whether each item appears to be a page or subgroup.
- Status: `unchecked`, `checked`, `ambiguous`, `truncated`, or `inaccessible`.
- Conflicting parents, titles, paths, or orders.

### Discovery stopping rule

Discovery reaches closure only when:

- The queue contains no unchecked eligible page or subgroup.
- Every known branch has a terminal discovery status.
- A complete orphan-search pass produces no new validated page.
- Known large-branch landmarks have been reconciled.

Report this as `discovery_closed: true`. Separately report
`source_completeness_proven: false` unless MCP exposes an authoritative
enumeration mechanism during execution.

## 13. Retrieval strategy

Before broad discovery, confirm `getPage` works for:

- `/models/models-main`
- `/connectors/connectors-overview`
- `/api-documentation/api-overview`

For every validated page:

1. Call `getPage`.
2. Save the raw textual MCP response before normalization.
3. Parse the returned content.
4. Record title, headings, canonical URL, aliases, and source metadata.
5. Extract links and image references before removing image markup.
6. Normalize Markdown deterministically.
7. Generate plain text from the normalized Markdown.
8. Compute raw-source and normalized-content hashes.
9. Write or update checkpoint state atomically.

Use bounded concurrency, initially two to four simultaneous requests. Respect
server behavior and reduce concurrency on slowdowns or rate limits.

Retries must use:

- Per-call timeouts.
- A fixed maximum attempt count.
- Exponential backoff with jitter.
- `Retry-After` when supplied.
- Clear permanent versus transient error classification.

Never retry indefinitely.

## 14. Raw source preservation

Save enough of each MCP response to reconstruct the page and audit
normalization without calling the server again.

Raw records must include:

- `run_id`.
- Timestamp.
- MCP tool name and arguments.
- Requested URL.
- Returned textual content.
- Response content hash.
- Protocol and server metadata when available.
- Success, error, or warning status.

Do not store credentials, authorization headers, cookies, or sensitive
transport metadata.

## 15. Image handling

Do not download, OCR, describe, embed, or analyze images.

Before removing image markup, record:

- The source page.
- Its structural location.
- Raw link target.
- Existing alt text, if present.
- Existing adjacent caption text, if present.

Alt text and captions already present as source text may be preserved, but do
not generate new descriptions.

Normalization must handle:

- Markdown images.
- Images wrapped in links.
- HTML `<img>` elements.
- GitBook image blocks.
- Images in tables.
- Image reference definitions.

Preserve:

- Ordinary caption text.
- Numbered and lettered annotation explanations.
- Lists and tables explaining screenshot callouts.
- Surrounding prose.

Use a Markdown parser or abstract syntax tree rather than regular expressions
alone. Validate block counts and neighboring text so image removal does not
silently delete explanations.

## 16. Page record

Each `records/pages.jsonl` record should include:

```json
{
  "schema_version": "1.0",
  "run_id": "2026.3-...",
  "product_release": "2026.3",
  "canonical_path_id": "path-...",
  "logical_page_id": "page-...",
  "release_page_id": "release-page-...",
  "title": "Page title",
  "source_url": "URL requested or returned",
  "canonical_url": "normalized URL",
  "canonical_path": "/models/...",
  "url_aliases": [],
  "primary_navigation_path": ["Models", "Build and edit models"],
  "section": "Models",
  "page_kind": "guide",
  "page_kind_method": "rule|source-metadata|manual|unknown",
  "page_kind_confidence": 1.0,
  "documentation_snapshot": "2026.3",
  "historical_product_version_raw": null,
  "historical_product_version_normalized": null,
  "normalized_content_path": "normalized/pages/page-....md",
  "source_raw_record_id": "raw-...",
  "source_raw_artifact_path": "raw/mcp-pages/raw-....json",
  "content_markdown": "normalized Markdown",
  "content_text": "plain text preserving structure",
  "headings": [],
  "raw_source_hash": "SHA-256",
  "normalized_content_hash": "SHA-256",
  "parser_version": "named parser and version",
  "normalization_version": "1.0",
  "image_references_removed": 0,
  "source_method": "getPage",
  "retrieved_at": "ISO-8601 UTC timestamp",
  "language": "en",
  "status": "complete",
  "warnings": []
}
```

Allowed terminal statuses must include at least:

```text
complete
empty
error
redirect
out-of-scope
version-conflict
unavailable
```

Generate `pages.jsonl` from normalized source artifacts rather than maintaining
two independently editable copies. Verify the inline Markdown is byte-equivalent
to the referenced normalized file after newline normalization.

## 17. Navigation records

`navigation.json` must have a defined schema and represent the release's
navigation tree or graph.

Because a page can appear under more than one parent, store each occurrence in
`navigation-occurrences.jsonl`:

```json
{
  "schema_version": "1.0",
  "run_id": "2026.3-...",
  "product_release": "2026.3",
  "occurrence_id": "nav-...",
  "release_page_id": "release-page-...",
  "parent_occurrence_id": null,
  "title_as_listed": "Models",
  "order": 0,
  "navigation_path": ["Models"],
  "is_primary": true,
  "discovery_evidence": []
}
```

Do not force a single parent when evidence shows multiple occurrences.

## 18. Link and backlink records

Extract links before normalization removes image markup.

Each `records/links.jsonl` record should include:

```json
{
  "schema_version": "1.0",
  "run_id": "2026.3-...",
  "product_release": "2026.3",
  "source_release_page_id": "release-page-...",
  "source_chunk_id": null,
  "source_raw_record_id": "raw-...",
  "source_url": "canonical source URL",
  "raw_target": "...",
  "normalized_target": "...",
  "target_release_page_id": null,
  "link_text": "visible text",
  "kind": "internal-page",
  "scope": "corpus|solidatus-related|unrelated|unknown",
  "status": "included",
  "source_span": {
    "coordinate_system": "normalized-markdown",
    "start_line": 12,
    "end_line": 12
  },
  "parser_version": "named parser and version",
  "warnings": []
}
```

Allowed link kinds should include:

```text
internal-page
internal-anchor
external
image
mailto
broken
unknown
```

Allowed statuses should include:

```text
included
out-of-scope
candidate-review
unresolved
broken
ignored-image
not-dereferenced
```

### Backlinks

Do not rely only on backlinks printed on documentation pages. Generate a
reverse-link index from resolved internal link records:

```text
target page <- all source pages and chunks that link to it
```

After chunking, deterministically enrich each link with `source_chunk_id` by
matching its normalized-Markdown source span to the chunk spans. Links outside
chunk content may retain `null` with an explicit reason.

Materialize the reverse index as `records/backlinks.jsonl` using its own schema.
Each backlink must contain `run_id`, target page or chunk, source page and
chunk, link record ID, and source span. It must be regenerated
deterministically from `links.jsonl`, and validation must prove that the
materialized view matches the forward-link records.

### External-link policy

Use this default policy:

- Links to eligible `docs.solidatus.com` pages are internal candidates.
- Solidatus-related external links are recorded as `candidate-review`.
- Clearly unrelated external links are not retrieved and are marked
  `out-of-scope`.
- Unknown links are not dereferenced automatically.
- Each reviewed external candidate receives a record in
  `external-link-decisions.jsonl` containing disposition, rationale, reviewer,
  review timestamp, and policy version.
- The initial MCP corpus classifies external links only; it never retrieves
  them.
- Any future external retrieval requires explicit authorization and must be
  stored as a separate supplemental source, not as part of the canonical MCP
  snapshot.

External network checks are not required for completion of the initial
MCP-only corpus.

## 19. Chunking strategy

Chunk from the parsed Markdown structure, not arbitrary character windows.

Each chunk should include:

```json
{
  "schema_version": "1.0",
  "run_id": "2026.3-...",
  "product_release": "2026.3",
  "chunk_id": "chunk-...",
  "logical_page_id": "page-...",
  "release_page_id": "release-page-...",
  "canonical_url": "...",
  "navigation_path": [],
  "heading_path": ["Page title", "Section", "Subsection"],
  "structural_locator": "block-based stable locator",
  "source_span": {
    "start_block": 0,
    "end_block": 4,
    "start_line": 1,
    "end_line": 30
  },
  "sequence": 0,
  "chunk_type": "procedure",
  "content_markdown": "...",
  "text": "...",
  "word_count": 0,
  "character_count": 0,
  "approximate_token_count": 0,
  "tokenizer": "named tokenizer and version",
  "normalized_content_hash": "SHA-256",
  "chunking_version": "1.0",
  "warnings": []
}
```

Target roughly 300 to 900 tokens, but keep meaningful units intact:

- Procedures and prerequisites.
- Ordered steps.
- Tables with headings.
- Warnings and qualified content.
- Examples and explanations.
- Annotation explanations.
- Code blocks, API examples, and command descriptions.

An intact semantic unit may exceed 900 tokens. Record an oversized-chunk
warning rather than splitting it unsafely.

Canonical chunks should not overlap. Any retrieval-time overlap is a later
consumer concern and must not alter the canonical source dataset.

### Section inventory for fast release comparison

Create `records/sections.jsonl` before chunk aggregation. Each record must
contain:

- `schema_version`, `run_id`, product release, logical page ID, and release page
  ID.
- A stable heading key based on normalized heading text and ancestry.
- Heading text, heading ancestry, ordinal, and heading level.
- Ordered Markdown block types and per-block hashes.
- Section Markdown and text hashes.
- Raw and normalized source spans with named coordinate systems.
- Parser and normalization versions.

Delta algorithm `section-match-v1` is:

1. Skip section comparison when page hashes are identical.
2. Match exact stable heading keys within an already matched logical page.
3. Match remaining sections by identical section content hash.
4. Score remaining candidates using:
   - 70% normalized text 3-gram Jaccard similarity.
   - 20% normalized heading-token Jaccard similarity.
   - 10% heading-ancestry similarity.
5. Scores at or above `0.92` are probable matches; scores from `0.75` through
   `0.919999` are review candidates; lower scores remain unmatched.
6. Exact redirects or reviewed registry mappings may confirm an identity.
   Similarity alone may not.

Record the algorithm name, weights, thresholds, and implementation version in
both input manifests and delta manifests. A future algorithm change creates a
new delta build; it does not rewrite an old one.

## 20. Human plain-text notes

Human notes will arrive as plain-text files. Preserve each original file
unchanged beneath:

```text
notes/ingestions/<note-ingestion-id>/raw/
```

Each ingestion is immutable and has a manifest listing its source files,
hashes, ingestion rules, and completion status. If the same file hash is
encountered again, reference the existing ingestion rather than silently
duplicating it.

Convert notes into
`notes/ingestions/<note-ingestion-id>/records/notes.jsonl` without rewriting the
author's meaning.

A note record should include:

```json
{
  "schema_version": "1.0",
  "note_ingestion_id": "notes-...",
  "note_id": "note-...",
  "source_file": "raw/example.txt",
  "source_relative_path": "example.txt",
  "source_file_hash": "SHA-256",
  "source_span": {
    "coordinate_system": "plain-text-file",
    "start_line": 1,
    "end_line": 12
  },
  "title": null,
  "author": null,
  "created_at": null,
  "ingested_at": "ISO-8601 UTC timestamp",
  "note_kind": "observation",
  "product_release": null,
  "applies_to_releases": [],
  "text": "original note text or deterministic segment",
  "sequence": 0,
  "tags": [],
  "cited_release_page_ids": [],
  "cited_chunk_ids": [],
  "status": "unreviewed",
  "metadata_inference": [],
  "warnings": []
}
```

Do not invent missing author or creation dates. Use `null`. Any inferred
metadata must be labeled as inferred and must not replace the original text.

Allowed note kinds should include:

```text
observation
hypothesis
requirement
idea
question
decision
unknown
```

If the plain-text format does not explicitly distinguish these, use `unknown`
unless a later user-approved classification step is run.

## 21. Generic LLM ingestion view

Build each portable unified view as an immutable, versioned build in:

```text
integrated/builds/<integrated-build-id>/
```

Its manifest must list the exact authoritative documentation run or runs,
note-ingestion runs, build rules, schema versions, and completion status.

Each knowledge item must retain its source type:

```json
{
  "schema_version": "1.0",
  "integrated_build_id": "build-...",
  "knowledge_item_id": "knowledge-...",
  "source_type": "solidatus-documentation|human-note",
  "product_release": null,
  "applies_to_releases": [],
  "source_record_id": "chunk-... or note-...",
  "title": "...",
  "context_path": [],
  "content_markdown": "...",
  "text": "...",
  "source_locator": {},
  "provenance": {},
  "tags": [],
  "content_hash": "SHA-256"
}
```

This file is a convenience layer for generic LLM ingestion. It must be
deterministically rebuildable from canonical documentation chunks and note
records.

At minimum, support two explicitly labeled build modes:

- `latest-release`: one authoritative documentation run plus selected note
  ingestions.
- `release-history`: selected authoritative runs across releases plus selected
  note ingestions and delta records.

Never expose an unlabeled mixture of current and superseded documentation to an
LLM. Documentation knowledge items set `product_release`; notes may leave it
`null` and use `applies_to_releases` or explicit citations.

Relationships and citations belong in:

```text
integrated/builds/<integrated-build-id>/evidence-relations.jsonl
```

Do not infer product requirements or create relationships merely because two
items are semantically similar during the extraction phase. Explicit links,
citations, and user-approved relationships are allowed.

Do not create embeddings during extraction. Downstream consumers may generate
their own embeddings from the portable records.

## 22. Multi-release comparison

After two or more release snapshots exist, compare each new release with the
immediately preceding release and optionally any explicitly requested earlier
release.

Record page changes across independent dimensions because a page may be moved,
renamed, and modified in the same release:

```text
existence_change: unchanged|added|removed
path_changed: true|false
title_changed: true|false
content_changed: true|false
navigation_changed: true|false
links_changed: true|false
identity_match_status: same-id|confirmed-match|probable-match|split-candidate|merged-candidate|unresolved
```

A convenience `primary_summary` such as `unchanged`, `added`, `removed`,
`modified`, `moved`, `renamed`, `split`, `merged`, or `unresolved` may also be
generated, but it must not replace the orthogonal fields.

### Comparison order

1. Match identical logical page IDs.
2. Match canonical URL aliases and recorded redirects.
3. Compare normalized content hashes.
4. Compare titles, headings, navigation paths, internal links, and block-level
   content.
5. Identify probable moves or renames using the versioned
   `section-match-v1` fingerprints and thresholds, supplemented by page-level
   hashes, links, titles, and navigation evidence.
6. Require review for uncertain split, merge, or probable-move classifications.

### Delta artifacts

For each release pair and immutable delta run, create:

- `summary.json`: machine-readable counts and release metadata.
- `pages.jsonl`: page-level classifications.
- `sections.jsonl`: heading- or block-level changes.
- `links.jsonl`: added and removed internal relationships.
- `navigation.jsonl`: moves, parent changes, and order changes.
- `report.md`: concise human-readable explanation.

Every delta record must retain:

- Old and new release IDs.
- Old and new authoritative extraction run IDs.
- Delta run ID, delta schema version, algorithm version, and generation time.
- Old and new page or chunk IDs.
- Old and new hashes.
- Change classification.
- Matching method.
- Similarity score when applicable.
- Review status.
- References to exact source spans.

Do not let probable matches masquerade as confirmed moves.
Do not promote a candidate identity mapping without user or designated reviewer
confirmation. Record the reviewer and time in the page-identity registry.

## 23. Duplicate handling

Report:

- Exact duplicates by normalized content hash.
- Duplicate titles with different paths.
- Identical paths discovered under conflicting parents.
- Near duplicates using normalized text 3-gram Jaccard similarity under
  `near-duplicate-v1`: `0.95` or greater is reported as a near duplicate.

Record similarity scores and thresholds. Do not automatically delete near
duplicates or assume they represent moved pages.

## 24. Validation

### Navigation validation

- All expected top-level roots exist or are explicitly reported missing.
- Every discovery branch has a terminal status.
- Every discovered page has a terminal extraction status.
- Multi-parent occurrences are retained.
- Large branches were expanded in smaller subtrees.
- Closure and source-completeness claims are separately reported.

### Content validation

- Successful pages are not unexpectedly empty.
- Titles and headings reconcile with discovery evidence or are flagged.
- Ordered procedures retain numbering.
- Tables, code, JSON, warnings, and examples remain readable.
- Image removal preserves adjacent explanatory text.
- Raw and normalized hashes recompute correctly.
- Inline JSONL Markdown matches referenced normalized Markdown.

### Link validation

- Internal links resolve to included, out-of-scope, version-conflict, broken, or
  unresolved states.
- Anchors are checked against parsed headings when possible.
- Reverse backlinks can be regenerated from the link records.
- External links follow the recorded case-by-case policy.
- Malformed references such as `broken://spaces/...` are preserved in reports.

### Referential-integrity validation

- All JSON and JSONL validate against their versioned schemas.
- All IDs are unique within their defined scope.
- All referenced pages and chunks exist or carry an allowed unresolved state.
- All files decode as UTF-8.
- All expected normalized files exist.
- Rebuilding derived records from canonical inputs produces identical output.

### Snapshot drift validation

At the end of extraction, recheck:

- MCP tool schemas.
- The documentation root.
- The three smoke-test pages.
- A sample from each large branch.

If hashes changed during the run, record the drift. Preserve the first
retrieval as the run snapshot by default, and do not silently mix versions.
Because Solidatus releases change slowly, drift is expected to be rare.

## 25. Known large-branch landmarks

Use these as reconciliation checks, not as a complete table of contents.

### Models

- Understand Solidatus models
- Build and edit models
- Explore and analyse models
- Share and collaborate
- Solidatus AI Assistant

### Data Domains

- Understand Data Domains
- Build Data Domains
- Explore Data Domains
- Data Maps
- Analytics reports

### Connector-specific documentation

- Java connector SDK
- Azure Data Factory
- Collibra
- Databases
- Databricks
- Legacy Mainframe
- MongoDB
- Power BI
- Purview
- Snowflake
- Snowflake Multi-Database
- SSIS
- Tableau
- WebFOCUS

### Database-specific connector pages

- AzureSQL
- BigQuery
- DB2
- Hive
- Impala
- MySQL
- Oracle
- PostgreSQL
- Redshift
- SQL Server
- Sybase ASE
- Sybase IQ
- Teradata

### API documentation

- API overview
- Models API reference
- Query domains and models via the API
- Webhooks

## 26. Logging, checkpoints, and recovery

Log each MCP call with:

- `schema_version`.
- `run_id`.
- UTC timestamp.
- Tool name and arguments.
- HTTP and MCP status.
- Duration.
- Attempt number.
- Response content hash.
- Returned page URLs.
- Error or warning.

Never log secrets.

Use atomic checkpoint writes: write a complete temporary checkpoint, validate
it, then replace the prior checkpoint. Logs may be append-only, but final JSONL
datasets must be deterministically rebuilt from validated state so interrupted
appends cannot corrupt the corpus.

Resume by reading checkpoints and verifying existing artifact hashes before
issuing repeated calls.

Before creating a run, inspect the target release for incomplete runs. Resume a
compatible partial run only when its run manifest, implementation version, and
checkpoints validate. Otherwise stop and report the conflict rather than
starting a competing run or overwriting it.

## 27. Manifest and release index

Each immutable run manifest must include:

- Product release label.
- Run ID and run status.
- Source endpoint.
- MCP protocol, server name, server version, and tool schema hashes.
- Extraction start and end times.
- Implementation commit or source hash and dependency versions.
- Scope and external-link policy.
- Normalization and chunking versions.
- Schema versions.
- Counts by section and terminal status.
- Total pages, chunks, links, and removed image references.
- Coverage assessment.
- Snapshot drift results.
- Corpus-wide hash and its deterministic ordering algorithm.
- Known limitations.

Each run must also end with a schema-validated `completion-status.json`
containing `complete`, `blocked`, or `failed`, validation results, terminal
counts, and remaining blockers.

`authoritative-run.json` identifies the single validated run selected for a
release. Never create or change this pointer until the candidate run has
completed and passed validation. `release-index.json` must list all harvested
product releases, authoritative run pointers, superseded runs, and available
delta pairs.

## 28. Reports

Create:

- `extraction-summary.md`
  - Counts, statuses, sections, chunks, links, and image references removed.
- `coverage-assessment.json`
  - Machine-readable closure evidence, ambiguous branches, landmark coverage,
    and whether source completeness was provable.
- `unresolved-items.md`
  - Failed pages, inaccessible branches, ambiguities, and orphan candidates.
- `duplicate-pages.md`
  - Exact and near duplicates with methods and scores.
- `link-validation.md`
  - Internal failures, external candidates, ignored links, and backlinks.
- `version-conflicts.md`
  - Older-edition paths or conflicting version evidence.
- `normalization-validation.md`
  - Parser behavior, image removal checks, and structural preservation results.

Reports must describe corpus quality and extraction limitations. They must not
perform product coverage analysis.

## 29. First-run execution phases

### Phase 0: Establish contracts

1. Read this file completely.
2. Inspect the workspace without modifying unrelated files.
3. Create versioned JSON Schemas.
4. Define URL canonicalization, ID generation, deterministic file ordering,
   hashing, Markdown normalization, and chunking rules in code and README.
5. Record implementation and dependency versions.
6. Detect and resume a compatible partial run, or stop on an incompatible
   competing run.
7. If no compatible partial run exists, create a new `2026.3` run ID and run
   manifest.

### Phase 1: Initialize MCP

1. Connect using a standards-compliant HTTP MCP client.
2. Call `initialize`.
3. Call `tools/list`.
4. Record protocol and server metadata and tool schemas.
5. Run the three `getPage` smoke tests.
6. Stop and report if MCP is unavailable.

### Phase 2: Discover and retrieve iteratively

1. Seed the 11 roots.
2. Discover direct children in bounded subtrees.
3. Retrieve validated pages and preserve raw responses.
4. Enqueue internal documentation links.
5. Continue until the discovery stopping rule is satisfied.
6. Persist checkpoints throughout.

### Phase 3: Normalize and derive records

1. Parse Markdown structurally.
2. Extract links and image metadata.
3. Remove image assets while preserving source text.
4. Write normalized Markdown and plain text.
5. Build page, section, navigation, link, and chunk records deterministically.
6. Enrich links with chunk provenance and generate materialized backlinks.

### Phase 4: Validate and reconcile

1. Validate schemas, hashes, IDs, references, encoding, and rebuild stability.
2. Reconcile version conflicts, duplicates, orphans, and ambiguous navigation.
3. Stop for user or designated-reviewer confirmation before accepting uncertain
   cross-release identity matches or harvesting any external source.
4. Run snapshot drift checks.
5. Produce reports and coverage assessment.

### Phase 5: Finalize

1. Write the immutable run manifest and machine-readable completion status.
2. If and only if validation passes, atomically set `authoritative-run.json`.
3. Update `release-index.json`.
4. Write the knowledge-base README.
5. Confirm every discovered page and branch has a terminal status.
6. Leave resumable checkpoints and complete logs.

Human-note ingestion begins only when note files are supplied. Multi-release
deltas begin when a second documentation snapshot exists.

## 30. Completion criteria for the 2026.3 run

The initial extraction is complete when:

1. MCP initialization and tool discovery are recorded.
2. Discovery has reached its defined fixed point.
3. Coverage limitations are explicitly represented.
4. Every discovered page has a terminal status.
5. Raw textual responses are preserved for successful pages.
6. Every successful page has normalized Markdown and a valid page record.
7. Every chunk is traceable to a release, page, structural locator, and source
   span.
8. Internal links and generated backlinks are auditable.
9. Version conflicts, duplicates, broken links, unresolved pages, and failures
   are reported.
10. Schemas, hashes, referential integrity, UTF-8 encoding, and deterministic
    rebuilds pass validation.
11. The run manifest, completion status, authoritative-run pointer, and release
    index accurately describe the snapshot.
12. Checkpoints and logs support safe resumption.

Do not claim that MCP exposed the complete documentation universe unless the
server provides authoritative enumeration evidence.

## 31. Future-release procedure

For each future Solidatus release:

1. Supply the new product release label explicitly.
2. Create a new release directory when needed and a new immutable run ID.
3. Repeat discovery rather than copying the prior navigation as fact.
4. Use the prior release spine as a reconciliation aid and orphan-search list.
5. Extract and validate the new snapshot independently.
6. Compare it with the prior release using the delta rules.
7. Review probable moves, splits, merges, and version conflicts.
8. Confirm accepted cross-release identity mappings in the append-only registry.
9. Set the authoritative-run pointer and update `release-index.json` only after
   validation passes.
10. Never overwrite or silently reinterpret the prior release.

## 32. Fresh-session instruction

Start the extraction session with:

```text
Work from C:\Users\NN\Documents\Solidatus. Read
SOLIDATUS_MULTI_RELEASE_EXTRACTION_EXECUTION_PLAN.md completely and execute the
initial Solidatus 2026.3 run exactly as specified. Use only
https://docs.solidatus.com/~gitbook/mcp for documentation discovery and page
retrieval. Do not scrape HTML, use sitemap or llms files, download images, call
sendFeedback, or perform product reconstruction or feature analysis. Preserve
raw textual MCP responses, build the versioned machine-readable corpus, create
internal link and backlink records, validate all schemas and references, and
continue until every discovered page and discovery branch has a terminal status
or a genuine blocker requires user input. Detect and resume a compatible
partial run instead of creating a competing run, and do not mark any run
authoritative until validation passes. Stop for review before confirming
uncertain cross-release page identities or retrieving any external source. Do
not ingest human notes unless plain-text note files have been supplied.
```
