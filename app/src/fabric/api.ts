// The Fabric Toolkit's data boundary — types, pure helpers, and ONE seam.
//
// Salvaged from the `datalineage` prototype, where every function below was a
// `fetch` against a FastAPI backend that held an Entra ID service principal.
// Odyssey has no backend and no credentials (ADR-0001), so the calls are gone
// and the shapes they returned are not: the UI, the sandbox sequence builder
// and the model conversion are all intact and all still typed against this
// contract.
//
// ============================================================================
// WIRING THIS UP
// ============================================================================
//
// Implement `FabricApi` and hand it over once, before the app renders:
//
//     // main.tsx
//     import { setFabricApi } from './fabric/api'
//
//     setFabricApi({
//       async status() { return { configured: true } },
//       async workspaces() {
//         const res = await fetch('/api/fabric/workspaces')
//         return res.json()
//       },
//       // ...the rest
//     })
//
// Every method is independent. Supply `workspaces` alone and the tree lists
// workspaces while opening one still reports "not wired" — so the toolkit can
// be brought up an endpoint at a time rather than all at once.
//
// The methods are deliberately transport-agnostic. The prototype's REST paths
// are quoted on each one as a starting point, but nothing here requires HTTP:
// an implementation may call the Fabric REST API directly from the browser
// with a token from MSAL, proxy through a backend, or return fixtures.
//
// WHAT IS NOT HERE, ON PURPOSE
//
// No auth. No token acquisition, no MSAL, no service principal, no token
// refresh. The prototype's `setTokenSource` / `fabricFetch` pair is gone
// rather than stubbed, because a half-present auth layer is worse than an
// absent one: it invites wiring credentials into a browser bundle. Whoever
// implements `FabricApi` owns identity, and should almost certainly terminate
// it server-side.

// Read-only walk of the live Fabric REST surface: workspaces → items → tables.
// A refused call throws via detail() (empty-means-no-permission), so callers
// can show "couldn't read" distinctly from a genuinely empty workspace.

export interface FabricWorkspace {
  id: string
  name: string
  description?: string | null
}

export interface FabricFolder {
  id: string
  name: string
  parent_id: string | null
}

export interface FabricItem {
  id: string
  name: string
  type: string
  folder_id: string | null
  description?: string | null
}

export interface FabricWorkspaceItems {
  folders: FabricFolder[]
  notebooks: FabricItem[]
  lakehouses: FabricItem[]
  others: FabricItem[]
}

export interface FabricTable {
  name: string
  type?: string | null
  format?: string | null
}

export type FabricCatalogKind = 'workspace' | 'notebook' | 'lakehouse' | 'table' | 'item'

export interface FabricCatalogEntry {
  kind: FabricCatalogKind
  workspace_id: string
  workspace_name: string
  id: string
  name: string
  item_type?: string | null
  lakehouse_id?: string | null
  lakehouse_name?: string | null
}

/** One external service this app calls. */
export interface Integration {
  key: string
  name: string
  vendor: string
  host: string
  configured: boolean
  purpose: string
  degrades: string
  needs: string
  detail: string
  caveats: string[]
}

/** Who the deployment calls Microsoft as. */
export interface Identity {
  mode: 'service-principal' | 'user' | 'none'
  client_id: string
  tenant_id: string
  display_name: string
  note: string
}

export interface FabricNotebookSource {
  name: string
  lakehouse_default: string | null
  cells: string[]
}

export interface FabricPipelineActivity {
  name: string
  type: string
  depends_on: string[]
  notebook_id?: string | null
  /**
   * For a step that runs another pipeline: the child's item id.
   *
   * The backend has already followed it — the child's activities arrive in this
   * same list, named `<invoke step> / <child step>` and wired into the
   * dependency order — so this is here to identify the step, not to fetch
   * anything. A step with this set and no `notebook_id` is a grouping node with
   * nothing to run, which is exactly what a master pipeline is made of.
   */
  pipeline_id?: string | null
  workspace_id?: string | null
  /**
   * Lineage a Copy activity declares inline, parsed from the definition.
   *
   * A pipeline is not Spark, so there is nothing to execute for one — but a
   * Copy states its source and sink datasets and, when it has a translator, a
   * literal column-to-column mapping. Empty for every other activity type.
   */
  reads: string[]
  writes: string[]
  column_lineage: SandboxColumnFlow[]
}

export interface FabricColumn {
  name: string
  type?: string | null
}
// --- Fabric toolkit: notebook sandbox (backend/app/sandbox/router.py) ------
// Runs a notebook in an isolated subprocess — scrubbed env, no Fabric creds,
// no writes to real Fabric. M2a returns a stub (static) result; M2b swaps in
// real local-Spark execution behind the same shape.

export interface SandboxCellResult {
  index: number
  status: 'ok' | 'error' | 'skipped'
  reads: string[]
  writes: string[]
  stdout: string
  error: string | null
}

/** A BI object downstream of a table the run wrote. */
export interface SandboxBiConsumer {
  id: string
  name: string
  kind: 'semanticmodel' | 'report' | 'dashboard'
  /** The lakehouse it reaches through — why it is in the list. */
  via: string
}

/**
 * Who is looking at what this run produced.
 *
 * `available: false` is NOT the same as an empty `consumers` list: the first
 * means nothing was checked (no scanner, no permission, nothing written), the
 * second means it was checked and nothing reads this. Collapsing the two would
 * let an unconfigured tenant read as a notebook nobody depends on.
 */
export interface SandboxDownstream {
  available: boolean
  consumers: SandboxBiConsumer[]
  notes: string[]
}

export interface SandboxColumn {
  name: string
  type?: string | null
}

export interface SandboxColumnFlow {
  to_table: string
  to_column: string
  from_column: string
  /**
   * The source column's owning table, when the deriving engine knew it.
   *
   * The Spark path resolves attributes by name and cannot say; the sqlglot path
   * qualifies every column against the schemas and knows exactly. Absent means
   * "not known" — never "no table" — so the reader falls back to matching on
   * the column name rather than dropping the flow.
   */
  from_table?: string | null
  transform?: string | null
}

/**
 * The parts behind a table ref.
 *
 * `reads`, `writes` and `table_schemas` are keyed by an opaque canonical ref,
 * because a notebook can read and write across workspaces and a bare table name
 * is therefore not an identity. This is the side table that turns a ref back
 * into something displayable — and `resolved: false` means the workspace could
 * not be determined, which must render as unknown rather than as the notebook's
 * own.
 */
export interface SandboxTableRef {
  workspace: string
  lakehouse: string
  table: string
  resolved: boolean
  /**
   * `file` for the raw layer — a `Files/…` path rather than a Delta table.
   *
   * The landing layer is files, and it must not be drawn as a table: it has no
   * schema to disclose, and a landing folder named `orders` is not the table
   * named `orders`. Optional so a model saved before the raw layer was tracked
   * still renders; absent means `table`.
   */
  kind?: 'table' | 'file'
}

/**
 * What the run could and could not analyse — the code-side counterpart to
 * `schema_resolution` (backend/app/sandbox/_coverage.py).
 *
 * An empty `column_lineage` has four causes and the result could not tell them
 * apart: nothing to find; the DataFrame API on an engine that reads only SQL
 * (the stub — which is production); a query built from an f-string or variable,
 * skipped because its text is unknowable without running the cell; a cell that
 * would not parse. Only the first is a finding; the rest are missing answers.
 */
export interface SandboxCoverage {
  cells: number
  sql_cells: number
  sql_statements: number
  /** Cells writing via the DataFrame API and issuing no SQL — the stub's blind spot. */
  dataframe_write_cells: number
  dynamic_sql_cells: number
  unparsable_cells: number
  writes: number
  writes_with_column_lineage: number
  /** The load-bearing field: a run can look healthy with every write bare. */
  writes_without_column_lineage: string[]
}

export interface SandboxRunResult {
  ok: boolean
  /**
   * How the lineage was derived.
   *
   * `spark` — Catalyst's analyzed plans. `stub` — static analysis plus sqlglot
   * over the SQL cells. `definition` — nothing ran at all: a pipeline Copy
   * activity declares its datasets and column mapping inline, so the lineage is
   * read out of the JSON. Synthesized on the client (see `copyActivityRun`),
   * which is why this value never comes back from `/sandbox/run`.
   */
  engine: 'stub' | 'spark' | 'definition'
  cells: SandboxCellResult[]
  downstream?: SandboxDownstream | null
  reads: string[]
  writes: string[]
  /**
   * Schema per touched table.
   *
   * The Spark engine fills both sides from the analyzer. The stub engine echoes
   * back the schemas it was given (so read tables carry real columns and types)
   * and derives a written table's columns from the projection that produced it
   * (names only — nothing off-engine knows their types).
   */
  table_schemas: Record<string, SandboxColumn[]>
  /**
   * Whether the input schemas the run needed were readable from OneLake.
   *
   * Off-engine column lineage is derived by resolving each column against
   * these, so an unreadable OneLake — a service principal without workspace
   * access, most often — yields empty `column_lineage` that looks exactly like
   * a notebook with no SQL in it. `unresolved` is how the two are told apart.
   *
   * Undefined when no fetch was attempted (cells or schemas supplied by the
   * caller), which is a third state and not the same as "found nothing".
   */
  schema_resolution?: {
    requested: string[]
    resolved: string[]
    unresolved: string[]
    /** Refs whose columns came from an earlier step of the sequence, not OneLake. */
    carried?: string[]
    /** Empty with a non-empty `unresolved` means not-found, not refused. */
    failures: string[]
  } | null
  /** Column-level lineage from the analyzed plans (Spark engine only). */
  column_lineage: SandboxColumnFlow[]
  /**
   * What the run could and could not analyse. Undefined from a backend deployed
   * before it existed — which must not read as "coverage was total".
   */
  coverage?: SandboxCoverage | null
  /**
   * ref → its parts, for every ref named anywhere in this result.
   *
   * Optional because a backend deployed before workspace-qualified refs does
   * not send it (or `workspace`). Consumers fall back to the leaf name and an
   * unresolved workspace, so an older API degrades instead of breaking.
   */
  tables?: Record<string, SandboxTableRef>
  /** The notebook's own workspace, for spotting cross-workspace access. */
  workspace?: string
  /**
   * What the notebook ACTUALLY did, last time it ran for real in Fabric.
   *
   * Everything else on this result describes what the notebook *would* do.
   * Fabric proxies the Spark History Server API, so a past run's physical plans
   * are readable retroactively — which is table-level ground truth, and the one
   * thing no amount of static analysis can supply.
   *
   * Undefined when the caller did not ask (`include_observed`). That is a third
   * state, distinct from asking and finding nothing — see `available`.
   */
  observed?: SandboxObservedRun | null
  /** The prediction against the observation. Only when `observed.available`. */
  comparison?: SandboxRunComparison | null
  log: string[]
  saw_credentials: boolean
  error: string | null
}

/** One SQL execution from a real run, and the tables it touched. */
export interface SandboxObservedStatement {
  execution_id: number
  /** Spark's own description — usually the call site, e.g. `save at <cell>:12`. */
  description: string
  status: string
  submitted: string
  duration_ms?: number | null
  reads: string[]
  writes: string[]
}

/**
 * A notebook's last real Fabric run (backend/app/fabric/runs.py).
 *
 * Table-level only, on purpose: the plan is a *rendering*, and Spark truncates
 * long column lists before they reach us. The sandbox derives columns from live
 * Catalyst objects, so this fills the gap it cannot — which tables really moved
 * — rather than competing with it.
 *
 * `available: false` with populated `notes` is the honest empty: no run found,
 * no permission, or nothing analysable. It must never render like a run that
 * genuinely touched nothing.
 */
export interface SandboxObservedRun {
  available: boolean
  livy_id: string
  application_id: string
  state: string
  submitted_at: string
  /**
   * When the notebook was last edited, `''` when Fabric would not say.
   *
   * Newer than `submitted_at` means the analysis describes code the run never
   * executed, which explains every predicted-but-unseen table on its own. The
   * panel says so instead of reporting a discrepancy.
   */
  code_changed_at: string
  /** Who ran it. A real run has a submitter; a sandbox run does not. */
  submitter: string
  reads: string[]
  writes: string[]
  statements: SandboxObservedStatement[]
  tables: Record<string, SandboxTableRef>
  /** Seen vs resolved tells "the run did nothing" from "we could not read it". */
  statements_seen: number
  statements_resolved: number
  /** Plan node types the parser did not know, so a thin answer is diagnosable. */
  unrecognised: string[]
  notes: string[]
}

/**
 * The sandbox's prediction against the observed run.
 *
 * Neither side is a superset of the other, which is why the diff is worth
 * showing rather than one number:
 *
 * - the sandbox intercepts the write verb, so it sees writes whether or not an
 *   action would have forced one, and reads branches that never ran;
 * - the real run only has plans where an action executed, but it sees through
 *   everything the static readers abstain on — an f-string query, a chain they
 *   would not guess at, a write inside a loop.
 *
 * So `predicted_only` is not automatically a false positive, and
 * `observed_only` is not automatically a miss. It is usually the more
 * interesting half: something really happened that the static picture missed.
 */
export interface SandboxRunComparison {
  agreed_reads: string[]
  agreed_writes: string[]
  predicted_only_reads: string[]
  predicted_only_writes: string[]
  observed_only_reads: string[]
  observed_only_writes: string[]
}

/** Whether prediction and observation agreed on every table. */
export function comparisonAgrees(c: SandboxRunComparison): boolean {
  return (
    c.predicted_only_reads.length === 0 &&
    c.predicted_only_writes.length === 0 &&
    c.observed_only_reads.length === 0 &&
    c.observed_only_writes.length === 0
  )
}

/** Display name for a ref, falling back to the ref when it is unknown to us. */
export function refLabel(ref: string, tables?: Record<string, SandboxTableRef>): string {
  // The fallback parses rather than splitting on the last separator: a leaf may
  // legitimately contain an escaped `/` — every raw file path does — and
  // `split('/').pop()` returns it still escaped, so the card read
  // `Files%2Forders%2F*.csv`. Only refs with no side table were affected, which
  // is a pipeline Copy activity and any model saved before one was sent.
  return tables?.[ref]?.table || refParts(ref).table || ref
}

/**
 * Whether a ref names the raw file layer or a Delta table.
 *
 * Prefers what the run said; falls back to the ref's own shape for lineage that
 * never went through the sandbox (a pipeline Copy activity, a model saved
 * before the raw layer was tracked).
 */
export function refKind(ref: string, tables?: Record<string, SandboxTableRef>): 'table' | 'file' {
  return tables?.[ref]?.kind ?? refParts(ref).kind ?? 'table'
}

/** The workspace a ref belongs to, or `''` when it could not be resolved. */
export function refWorkspace(ref: string, tables?: Record<string, SandboxTableRef>): string {
  // Falls back to the ref's own shape, like `refLabel` and `refKind`: a ref
  // that arrived without a side table (a pipeline Copy activity) still names
  // its workspace, and returning '' for it read as "unresolved" when it was
  // only unaccompanied.
  const t = tables?.[ref] ?? refParts(ref)
  return t.resolved ? t.workspace : ''
}

/**
 * The lakehouse a ref belongs to, or `''` when the ref does not name one.
 *
 * NOT gated on `resolved`, which means the WORKSPACE is known — and that is a
 * different question. `lh_bronze.orders` in a notebook yields `/lh_bronze/orders`:
 * unresolved workspace, perfectly good lakehouse. Gating the two together threw
 * the lakehouse away for every such ref, which is most of them on a run whose
 * notebooks address their own lakehouse by name — and left the semantic views
 * with nothing to group by, so every table fell into one band called `Tables`.
 */
export function refLakehouse(ref: string, tables?: Record<string, SandboxTableRef>): string {
  return tables?.[ref]?.lakehouse || refParts(ref).lakehouse || ''
}

/**
 * A canonical ref → its parts, mirroring `_refs.parse_ref`/`table_refs`.
 *
 * The backend normally sends this side table with a run, so this exists for
 * lineage that never went through the sandbox — a pipeline Copy activity, whose
 * refs are built from its definition on the client. Kept in step with the
 * Python: segments escape only `%` and `/`, and `resolved` means the WORKSPACE
 * is known, not that all three parts are.
 */
export function refParts(ref: string): SandboxTableRef {
  const unescape = (s: string) => s.replace(/%2F/gi, '/').replace(/%25/g, '%')
  const parts = ref.split('/')
  const [workspace, lakehouse, ...rest] =
    parts.length >= 3 ? parts : ['', ...(parts.length === 2 ? parts : ['', ...parts])]
  const table = unescape(rest.join('/'))
  // `?? ''` rather than `!`: the padding above guarantees both slots exist for
  // every shape this is called with, but a ref is untrusted input and an empty
  // string is already this function's answer for "not named".
  return {
    workspace: unescape(workspace ?? ''),
    lakehouse: unescape(lakehouse ?? ''),
    table,
    resolved: Boolean(workspace && table),
    // Mirrors `_refs.is_file_ref` — the leaf keeps its `Files/` head precisely
    // so the distinction survives the ref round-trip.
    kind: table === 'Files' || table.toLowerCase().startsWith('files/') ? 'file' : 'table',
  }
}

// ============================================================================
// The seam
// ============================================================================

/**
 * Everything the Fabric Toolkit needs from the outside world.
 *
 * Every method is optional. An absent one is not an error in itself — it
 * becomes `FabricNotWiredError` at the moment the UI asks for it, which is
 * what lets the toolkit be wired incrementally and still render honestly in
 * between.
 *
 * Method names are the CAPABILITY, not the prototype's URL, so an
 * implementation is free to satisfy them however it likes. The old REST path
 * is quoted on each purely as a hint about the shape expected back.
 */
export interface FabricApi {
  /** Whether Fabric access is configured at all. `GET /fabric/status` */
  status?(): Promise<{ configured: boolean }>

  /** Workspaces the caller can see. `GET /fabric/workspaces` */
  workspaces?(): Promise<FabricWorkspace[]>

  /** One workspace's folders and items. `GET /fabric/workspaces/{id}/items` */
  items?(workspaceId: string): Promise<FabricWorkspaceItems>

  /** Delta tables in a lakehouse. `GET /fabric/workspaces/{ws}/lakehouses/{lh}/tables` */
  tables?(workspaceId: string, lakehouseId: string): Promise<FabricTable[]>

  /** A notebook's decoded cells. `GET /fabric/workspaces/{ws}/notebooks/{id}/source` */
  notebookSource?(
    workspaceId: string,
    itemId: string,
    name: string,
  ): Promise<FabricNotebookSource>

  /** A table's columns from OneLake. `GET …/lakehouses/{lh}/tables/{name}/schema` */
  tableSchema?(
    workspaceId: string,
    lakehouseId: string,
    tableName: string,
  ): Promise<FabricColumn[]>

  /** A pipeline's activities and their declared lineage. `GET …/pipelines/{id}/definition` */
  pipelineDefinition?(workspaceId: string, itemId: string): Promise<FabricPipelineActivity[]>

  /**
   * Analyse a notebook without running it against real Fabric.
   *
   * The prototype ran the cells in an isolated subprocess with scrubbed
   * credentials and returned the lineage Catalyst produced. That engine is not
   * part of Odyssey — this is the seam where one is plugged back in, whether
   * that is Spark, static SQL analysis, or a service that already knows.
   *
   * `POST /fabric/sandbox/run`
   */
  runSandbox?(body: SandboxRunRequest): Promise<SandboxRunResult>

  /** What a notebook actually did when it last ran for real. `GET /fabric/sandbox/observed` */
  observedRun?(params: ObservedRunRequest): Promise<SandboxObservedRun>

  /** The external services this deployment calls. `GET /integrations` */
  integrations?(): Promise<Integration[]>

  /** Who the deployment calls Microsoft as. `GET /integrations/identity` */
  identity?(): Promise<Identity>
}

/** Arguments to {@link FabricApi.runSandbox}. */
export interface SandboxRunRequest {
  name?: string
  workspace_id?: string
  item_id?: string
  cells?: string[]
  /** The notebook's own workspace/lakehouse — the defaults bare names resolve against. */
  workspace?: string
  lakehouse?: string
  /**
   * Schemas observed by earlier steps of the same sequence. They fill gaps a
   * OneLake read could not answer — a table an upstream notebook just created
   * may not exist there yet — and never override what it did answer.
   */
  carried_schemas?: Record<string, SandboxColumn[]>
  /** Also fetch what this notebook actually did last time, and diff it. */
  include_observed?: boolean
}

/** Arguments to {@link FabricApi.observedRun}. */
export interface ObservedRunRequest {
  workspace_id: string
  item_id: string
  workspace?: string
  lakehouse?: string
}

/**
 * Thrown when the UI reaches for a capability nobody has supplied.
 *
 * A distinct type rather than a bare Error so a caller can tell "not wired yet"
 * from "wired, and the call failed" — the first is a setup state, the second is
 * a fault. The salvaged views do not currently draw them differently: they
 * surface the message, which names the missing capability and the call to make,
 * and that is the more useful thing while the toolkit is being wired up. Use
 * `isNotWired` to separate them once real failures are possible.
 */
export class FabricNotWiredError extends Error {
  readonly capability: keyof FabricApi

  constructor(capability: keyof FabricApi) {
    super(
      `The Fabric Toolkit is not wired up: no "${capability}" implementation was provided. ` +
        `Call setFabricApi({ ${capability}: … }) at startup — see src/fabric/api.ts.`,
    )
    this.name = 'FabricNotWiredError'
    this.capability = capability
  }
}

export function isNotWired(err: unknown): err is FabricNotWiredError {
  return err instanceof FabricNotWiredError
}

let current: FabricApi = {}

/**
 * Installs the implementation. Call once at startup, before rendering.
 *
 * Replaces rather than merges: partial wiring is expressed by omitting
 * methods from the object you pass, and a merging setter would make it
 * impossible to take a capability back out for testing.
 */
export function setFabricApi(api: FabricApi): void {
  current = api
}

/** The installed implementation. Mostly useful for tests and diagnostics. */
export function getFabricApi(): FabricApi {
  return current
}

/** True when at least one capability is available — drives the empty state. */
export function isFabricWired(): boolean {
  return Object.keys(current).length > 0
}

/** Resolves a capability or throws the explaining error. */
function need<K extends keyof FabricApi>(key: K): NonNullable<FabricApi[K]> {
  const fn = current[key]
  if (!fn) throw new FabricNotWiredError(key)
  return fn as NonNullable<FabricApi[K]>
}

// ============================================================================
// The functions the views call
// ============================================================================
//
// Same names and signatures the prototype exported, so the salvaged views did
// not have to be rewritten around a new shape. Each is a one-line delegation
// to the installed adapter.
//
// Every one is `async`, and that is load-bearing rather than stylistic. A
// missing capability throws, and a plain function that throws does so
// SYNCHRONOUSLY — before any promise exists — so a caller written as
// `fn().then(...).catch(...)` never catches it and React's error boundary
// eats the whole page instead of the view showing its own empty state.
// `async` turns the throw into a rejected promise, which is what every
// caller here is written against.

export async function fetchFabricStatus(): Promise<{ configured: boolean }> {
  return need('status')()
}

export async function fetchFabricWorkspaces(): Promise<FabricWorkspace[]> {
  return need('workspaces')()
}

export async function fetchFabricItems(workspaceId: string): Promise<FabricWorkspaceItems> {
  return need('items')(workspaceId)
}

export async function fetchFabricTables(
  workspaceId: string,
  lakehouseId: string,
): Promise<FabricTable[]> {
  return need('tables')(workspaceId, lakehouseId)
}

export async function fetchFabricNotebookSource(
  workspaceId: string,
  itemId: string,
  name: string,
): Promise<FabricNotebookSource> {
  return need('notebookSource')(workspaceId, itemId, name)
}

export async function fetchFabricTableSchema(
  workspaceId: string,
  lakehouseId: string,
  tableName: string,
): Promise<FabricColumn[]> {
  return need('tableSchema')(workspaceId, lakehouseId, tableName)
}

export async function fetchFabricPipelineDefinition(
  workspaceId: string,
  itemId: string,
): Promise<FabricPipelineActivity[]> {
  return need('pipelineDefinition')(workspaceId, itemId)
}

export async function runSandbox(body: SandboxRunRequest): Promise<SandboxRunResult> {
  return need('runSandbox')(body)
}

export async function fetchObservedRun(params: ObservedRunRequest): Promise<SandboxObservedRun> {
  return need('observedRun')(params)
}

export async function fetchIntegrations(): Promise<Integration[]> {
  return need('integrations')()
}

export async function fetchIdentity(): Promise<Identity> {
  return need('identity')()
}
