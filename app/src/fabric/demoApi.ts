// A complete Fabric estate, invented, so the toolkit can be used and reviewed
// with nothing connected to it.
//
// Every capability in `FabricApi` is implemented here from fixtures. No
// network, no credentials, no Python, no tenant — open the app and the
// workspace tree, the notebook source, the sandbox and the integrations list
// all work.
//
// WHAT THIS IS FOR. Two things, and it is worth being precise because a demo
// mode that drifts into a product is how a tool starts lying:
//
//   1. Proving the application works end to end without any API. Every screen
//      is reachable and every interaction completes.
//   2. Reviewing and developing the UI against realistic shapes — a table with
//      no lineage, a cross-stage read, a run that disagrees with what really
//      happened — without waiting on a tenant.
//
// WHAT IT IS NOT. It is not a fallback and it is never on by default. Nothing
// here degrades into demo data when a real call fails: a real estate that
// cannot be read must report that it cannot be read, because the alternative
// is an engineer trusting an invented lineage for a table their pipeline
// really writes. It is switched on deliberately, by an env var, and the app
// says so on screen for as long as it is on — see `demoFlag.ts`.
//
// The estate mirrors `model/fabricSample.ts` — the same medallion, the same
// table and column names — so the demo Fabric side and the demo model tell one
// story rather than two.

import type {
  FabricApi,
  FabricColumn,
  FabricNotebookSource,
  FabricPipelineActivity,
  FabricTable,
  FabricWorkspace,
  FabricWorkspaceItems,
  Identity,
  Integration,
  ObservedRunRequest,
  SandboxColumn,
  SandboxObservedRun,
  SandboxRunRequest,
  SandboxRunResult,
  SandboxTableRef,
} from './api'
import { refParts } from './api'
import { setDemoActive } from './demoFlag'

const WS = 'Analytics'
const WS_ID = 'ws-analytics'

/** A second workspace, so cross-workspace reads are visible in the UI. */
const WS_FINANCE = 'Finance'
const WS_FINANCE_ID = 'ws-finance'

const LAKEHOUSES = {
  landing: { id: 'lh-landing', name: 'lh_landing' },
  bronze: { id: 'lh-bronze', name: 'lh_bronze' },
  silver: { id: 'lh-silver', name: 'lh_silver' },
  gold: { id: 'lh-gold', name: 'lh_gold' },
} as const

const ref = (lakehouse: string, table: string, workspace = WS) =>
  `${workspace}/${lakehouse}/${table}`

// --- schemas --------------------------------------------------------------
//
// Deliberately imperfect, mirroring the sample model: `bronze_invoices.currency`
// is landed and never mapped onward, so "which columns are untraced" has a real
// answer instead of a spotless estate that demonstrates nothing.

const SCHEMAS: Record<string, FabricColumn[]> = {
  [ref('lh_bronze', 'bronze_accounts')]: [
    { name: 'account_id', type: 'bigint' },
    { name: 'account_name', type: 'string' },
    { name: 'billing_country', type: 'string' },
  ],
  [ref('lh_bronze', 'bronze_invoices')]: [
    { name: 'invoice_id', type: 'bigint' },
    { name: 'account_id', type: 'bigint' },
    { name: 'amount', type: 'decimal(18,2)' },
    { name: 'invoice_date', type: 'date' },
    { name: 'currency', type: 'string' },
  ],
  [ref('lh_silver', 'silver_customer')]: [
    { name: 'customer_id', type: 'bigint' },
    { name: 'customer_name', type: 'string' },
    { name: 'region', type: 'string' },
  ],
  [ref('lh_silver', 'silver_invoice')]: [
    { name: 'invoice_id', type: 'bigint' },
    { name: 'customer_id', type: 'bigint' },
    { name: 'amount_usd', type: 'decimal(18,2)' },
    { name: 'invoice_date', type: 'date' },
  ],
  [ref('lh_gold', 'gold_customer_ltv')]: [
    { name: 'customer_id', type: 'bigint' },
    { name: 'lifetime_value', type: 'decimal(18,2)' },
    { name: 'invoice_count', type: 'bigint' },
    { name: 'region', type: 'string' },
  ],
  [ref('lh_gold', 'fx_rate', WS_FINANCE)]: [
    { name: 'currency', type: 'string' },
    { name: 'rate_to_usd', type: 'decimal(12,6)' },
  ],
}

const TABLES: Record<string, FabricTable[]> = {
  [LAKEHOUSES.landing.id]: [],
  [LAKEHOUSES.bronze.id]: [
    { name: 'bronze_accounts', type: 'Managed', format: 'delta' },
    { name: 'bronze_invoices', type: 'Managed', format: 'delta' },
  ],
  [LAKEHOUSES.silver.id]: [
    { name: 'silver_customer', type: 'Managed', format: 'delta' },
    { name: 'silver_invoice', type: 'Managed', format: 'delta' },
  ],
  [LAKEHOUSES.gold.id]: [{ name: 'gold_customer_ltv', type: 'Managed', format: 'delta' }],
  'lh-finance-gold': [{ name: 'fx_rate', type: 'Managed', format: 'delta' }],
}

// --- notebooks ------------------------------------------------------------
//
// Real SQL, not lorem ipsum. With the sandbox engine running these produce the
// lineage below by actually being analysed; without it, the canned results
// stand in — and they were written to match what the engine returns for this
// SQL, so the two agree.

interface DemoNotebook {
  id: string
  name: string
  lakehouse: string
  cells: string[]
  reads: string[]
  writes: string[]
  flows: { to: string; toCol: string; fromTable: string; fromCol: string; transform?: string }[]
}

const NOTEBOOKS: DemoNotebook[] = [
  {
    id: 'nb-land-sources',
    name: 'nb_land_sources',
    lakehouse: 'lh_landing',
    cells: [
      '# Land the raw extracts. Files, not tables — a landing folder has no\n'
        + '# schema to disclose, so the lineage out of it is table level.\n'
        + 'dbutils.fs.cp("abfss://source@crm/accounts/", "Files/salesforce/accounts/", True)\n'
        + 'dbutils.fs.cp("abfss://source@billing/invoices/", "Files/billing/invoices/", True)',
    ],
    reads: [],
    writes: [ref('lh_landing', 'Files/salesforce/accounts'), ref('lh_landing', 'Files/billing/invoices')],
    flows: [],
  },
  {
    id: 'nb-bronze-load',
    name: 'nb_bronze_load',
    lakehouse: 'lh_bronze',
    cells: [
      'spark.sql("""\n'
        + '  CREATE OR REPLACE TABLE lh_bronze.bronze_accounts AS\n'
        + '  SELECT AccountId AS account_id, Name AS account_name, BillingCountry AS billing_country\n'
        + '  FROM parquet.`Files/salesforce/accounts/`\n'
        + '""")',
      'spark.sql("""\n'
        + '  CREATE OR REPLACE TABLE lh_bronze.bronze_invoices AS\n'
        + '  SELECT InvoiceId AS invoice_id, AccountId AS account_id, Amount AS amount,\n'
        + '         InvoiceDate AS invoice_date, Currency AS currency\n'
        + '  FROM parquet.`Files/billing/invoices/`\n'
        + '""")',
    ],
    reads: [ref('lh_landing', 'Files/salesforce/accounts'), ref('lh_landing', 'Files/billing/invoices')],
    writes: [ref('lh_bronze', 'bronze_accounts'), ref('lh_bronze', 'bronze_invoices')],
    flows: [],
  },
  {
    id: 'nb-silver-conform',
    name: 'nb_silver_conform',
    lakehouse: 'lh_silver',
    cells: [
      'spark.sql("""\n'
        + '  CREATE OR REPLACE TABLE lh_silver.silver_customer AS\n'
        + '  SELECT account_id AS customer_id, account_name AS customer_name,\n'
        + '         upper(billing_country) AS region\n'
        + '  FROM lh_bronze.bronze_accounts\n'
        + '""")',
      '# Cross-workspace read: the FX table lives in Finance, and the canvas\n'
        + '# marks it as such rather than assuming it is ours.\n'
        + 'spark.sql("""\n'
        + '  CREATE OR REPLACE TABLE lh_silver.silver_invoice AS\n'
        + '  SELECT i.invoice_id, i.account_id AS customer_id,\n'
        + '         i.amount * f.rate_to_usd AS amount_usd, i.invoice_date\n'
        + '  FROM lh_bronze.bronze_invoices i\n'
        + '  JOIN Finance.lh_gold.fx_rate f ON f.currency = i.currency\n'
        + '""")',
    ],
    reads: [
      ref('lh_bronze', 'bronze_accounts'),
      ref('lh_bronze', 'bronze_invoices'),
      ref('lh_gold', 'fx_rate', WS_FINANCE),
    ],
    writes: [ref('lh_silver', 'silver_customer'), ref('lh_silver', 'silver_invoice')],
    flows: [
      { to: ref('lh_silver', 'silver_customer'), toCol: 'customer_id', fromTable: ref('lh_bronze', 'bronze_accounts'), fromCol: 'account_id' },
      { to: ref('lh_silver', 'silver_customer'), toCol: 'customer_name', fromTable: ref('lh_bronze', 'bronze_accounts'), fromCol: 'account_name' },
      { to: ref('lh_silver', 'silver_customer'), toCol: 'region', fromTable: ref('lh_bronze', 'bronze_accounts'), fromCol: 'billing_country', transform: 'UPPER(`bronze_accounts`.`billing_country`)' },
      { to: ref('lh_silver', 'silver_invoice'), toCol: 'invoice_id', fromTable: ref('lh_bronze', 'bronze_invoices'), fromCol: 'invoice_id' },
      { to: ref('lh_silver', 'silver_invoice'), toCol: 'customer_id', fromTable: ref('lh_bronze', 'bronze_invoices'), fromCol: 'account_id' },
      { to: ref('lh_silver', 'silver_invoice'), toCol: 'amount_usd', fromTable: ref('lh_bronze', 'bronze_invoices'), fromCol: 'amount', transform: '(`bronze_invoices`.`amount` * `fx_rate`.`rate_to_usd`)' },
      { to: ref('lh_silver', 'silver_invoice'), toCol: 'amount_usd', fromTable: ref('lh_gold', 'fx_rate', WS_FINANCE), fromCol: 'rate_to_usd', transform: '(`bronze_invoices`.`amount` * `fx_rate`.`rate_to_usd`)' },
      { to: ref('lh_silver', 'silver_invoice'), toCol: 'invoice_date', fromTable: ref('lh_bronze', 'bronze_invoices'), fromCol: 'invoice_date' },
    ],
  },
  {
    id: 'nb-gold-aggregate',
    name: 'nb_gold_aggregate',
    lakehouse: 'lh_gold',
    cells: [
      'spark.sql("""\n'
        + '  CREATE OR REPLACE TABLE lh_gold.gold_customer_ltv AS\n'
        + '  SELECT c.customer_id, sum(i.amount_usd) AS lifetime_value,\n'
        + '         count(*) AS invoice_count, c.region\n'
        + '  FROM lh_silver.silver_invoice i\n'
        + '  JOIN lh_silver.silver_customer c ON c.customer_id = i.customer_id\n'
        + '  GROUP BY c.customer_id, c.region\n'
        + '""")',
    ],
    reads: [ref('lh_silver', 'silver_invoice'), ref('lh_silver', 'silver_customer')],
    writes: [ref('lh_gold', 'gold_customer_ltv')],
    flows: [
      { to: ref('lh_gold', 'gold_customer_ltv'), toCol: 'customer_id', fromTable: ref('lh_silver', 'silver_customer'), fromCol: 'customer_id' },
      { to: ref('lh_gold', 'gold_customer_ltv'), toCol: 'lifetime_value', fromTable: ref('lh_silver', 'silver_invoice'), fromCol: 'amount_usd', transform: 'SUM(`silver_invoice`.`amount_usd`)' },
      { to: ref('lh_gold', 'gold_customer_ltv'), toCol: 'region', fromTable: ref('lh_silver', 'silver_customer'), fromCol: 'region' },
      // `invoice_count` comes from count(*), which has no source column. It is
      // absent on purpose: a derived column with no lineage is a real case and
      // the canvas has to show it as unresolved rather than inventing a parent.
    ],
  },
]

const notebookById = new Map(NOTEBOOKS.map((n) => [n.id, n]))

const PIPELINES: Record<string, FabricPipelineActivity[]> = {
  'pl-ingest-daily': [
    { name: 'land_sources', type: 'TridentNotebook', depends_on: [], notebook_id: 'nb-land-sources', workspace_id: WS_ID, reads: [], writes: [], column_lineage: [] },
    { name: 'bronze_load', type: 'TridentNotebook', depends_on: ['land_sources'], notebook_id: 'nb-bronze-load', workspace_id: WS_ID, reads: [], writes: [], column_lineage: [] },
  ],
  'pl-transform-daily': [
    { name: 'silver_conform', type: 'TridentNotebook', depends_on: [], notebook_id: 'nb-silver-conform', workspace_id: WS_ID, reads: [], writes: [], column_lineage: [] },
    { name: 'gold_aggregate', type: 'TridentNotebook', depends_on: ['silver_conform'], notebook_id: 'nb-gold-aggregate', workspace_id: WS_ID, reads: [], writes: [], column_lineage: [] },
    // A Copy activity: no notebook to run, but it declares its own lineage,
    // which is the path that produces `engine: "definition"` in the report.
    {
      name: 'archive_gold',
      type: 'Copy',
      depends_on: ['gold_aggregate'],
      workspace_id: WS_ID,
      reads: [ref('lh_gold', 'gold_customer_ltv')],
      writes: [ref('lh_gold', 'gold_customer_ltv_archive')],
      column_lineage: [
        { to_table: ref('lh_gold', 'gold_customer_ltv_archive'), to_column: 'customer_id', from_table: ref('lh_gold', 'gold_customer_ltv'), from_column: 'customer_id' },
        { to_table: ref('lh_gold', 'gold_customer_ltv_archive'), to_column: 'lifetime_value', from_table: ref('lh_gold', 'gold_customer_ltv'), from_column: 'lifetime_value' },
      ],
    },
  ],
}

const ITEMS: Record<string, FabricWorkspaceItems> = {
  [WS_ID]: {
    folders: [
      { id: 'fold-ingest', name: 'ingest', parent_id: null },
      { id: 'fold-transform', name: 'transform', parent_id: null },
    ],
    notebooks: [
      { id: 'nb-land-sources', name: 'nb_land_sources', type: 'Notebook', folder_id: 'fold-ingest' },
      { id: 'nb-bronze-load', name: 'nb_bronze_load', type: 'Notebook', folder_id: 'fold-ingest' },
      { id: 'nb-silver-conform', name: 'nb_silver_conform', type: 'Notebook', folder_id: 'fold-transform' },
      { id: 'nb-gold-aggregate', name: 'nb_gold_aggregate', type: 'Notebook', folder_id: 'fold-transform' },
    ],
    lakehouses: [
      { id: LAKEHOUSES.landing.id, name: LAKEHOUSES.landing.name, type: 'Lakehouse', folder_id: null },
      { id: LAKEHOUSES.bronze.id, name: LAKEHOUSES.bronze.name, type: 'Lakehouse', folder_id: null },
      { id: LAKEHOUSES.silver.id, name: LAKEHOUSES.silver.name, type: 'Lakehouse', folder_id: null },
      { id: LAKEHOUSES.gold.id, name: LAKEHOUSES.gold.name, type: 'Lakehouse', folder_id: null },
    ],
    others: [
      { id: 'pl-ingest-daily', name: 'pl_ingest_daily', type: 'DataPipeline', folder_id: 'fold-ingest' },
      { id: 'pl-transform-daily', name: 'pl_transform_daily', type: 'DataPipeline', folder_id: 'fold-transform' },
      { id: 'sm-customer-360', name: 'Customer 360', type: 'SemanticModel', folder_id: null },
    ],
  },
  [WS_FINANCE_ID]: {
    folders: [],
    notebooks: [],
    lakehouses: [{ id: 'lh-finance-gold', name: 'lh_gold', type: 'Lakehouse', folder_id: null }],
    others: [],
  },
}

// --- sandbox --------------------------------------------------------------

const tablesFor = (refs: string[]): Record<string, SandboxTableRef> =>
  Object.fromEntries(refs.map((r) => [r, refParts(r)]))

const asSandboxColumns = (columns: FabricColumn[] | undefined): SandboxColumn[] =>
  (columns ?? []).map((c) => ({ name: c.name, type: c.type ?? null }))

/** A run of one demo notebook, shaped exactly as the engine would return it. */
function demoRun(notebook: DemoNotebook): SandboxRunResult {
  const touched = [...notebook.reads, ...notebook.writes]
  const table_schemas: Record<string, SandboxColumn[]> = {}
  for (const r of touched) {
    const columns = asSandboxColumns(SCHEMAS[r])
    if (columns.length) table_schemas[r] = columns
  }

  const writesWithout = notebook.writes.filter(
    (w) => !notebook.flows.some((f) => f.to === w),
  )

  return {
    ok: true,
    engine: 'stub',
    workspace: WS,
    cells: notebook.cells.map((_, i) => ({
      index: i,
      status: 'ok' as const,
      reads: notebook.reads,
      writes: notebook.writes,
      stdout: '',
      error: null,
    })),
    reads: notebook.reads,
    writes: notebook.writes,
    table_schemas,
    column_lineage: notebook.flows.map((f) => ({
      to_table: f.to,
      to_column: f.toCol,
      from_table: f.fromTable,
      from_column: f.fromCol,
      transform: f.transform ?? null,
    })),
    tables: tablesFor(touched),
    coverage: {
      cells: notebook.cells.length,
      sql_cells: notebook.flows.length ? notebook.cells.length : 0,
      sql_statements: notebook.cells.length,
      // The landing notebook copies files with the filesystem API and issues no
      // SQL — the stub engine's blind spot, reported rather than hidden.
      dataframe_write_cells: notebook.flows.length ? 0 : notebook.cells.length,
      dynamic_sql_cells: 0,
      unparsable_cells: 0,
      writes: notebook.writes.length,
      writes_with_column_lineage: notebook.writes.length - writesWithout.length,
      writes_without_column_lineage: writesWithout,
    },
    schema_resolution: {
      requested: notebook.reads,
      resolved: notebook.reads.filter((r) => SCHEMAS[r]),
      unresolved: notebook.reads.filter((r) => !SCHEMAS[r]),
      failures: [],
    },
    log: [
      `[demo] ${notebook.name} — staged result, no code was executed.`,
      `[demo] ${notebook.reads.length} read(s), ${notebook.writes.length} write(s).`,
    ],
    saw_credentials: false,
    error: null,
  }
}

/**
 * What the notebook "really" did last night.
 *
 * Deliberately NOT identical to the prediction: the real run also wrote a
 * `_rejects` table, which no static reading of the code would find. That
 * disagreement is the reason the comparison exists, and a demo where the two
 * always agree would suggest the feature has nothing to say.
 */
function demoObserved(notebook: DemoNotebook): SandboxObservedRun {
  const extra = ref(notebook.lakehouse, `${notebook.name.replace(/^nb_/, '')}_rejects`)
  return {
    available: true,
    livy_id: 'demo-livy-4821',
    application_id: 'application_1731000000000_0042',
    state: 'success',
    submitted_at: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    code_changed_at: '',
    submitter: 'data.platform@contoso.com',
    reads: notebook.reads,
    writes: [...notebook.writes, extra],
    statements: notebook.cells.map((_, i) => ({
      execution_id: i + 1,
      description: `save at ${notebook.name}:${(i + 1) * 12}`,
      status: 'COMPLETED',
      submitted: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
      duration_ms: 4200 + i * 900,
      reads: notebook.reads,
      writes: notebook.writes,
    })),
    tables: tablesFor([...notebook.reads, ...notebook.writes, extra]),
    statements_seen: notebook.cells.length + 1,
    statements_resolved: notebook.cells.length,
    unrecognised: [],
    notes: ['[demo] staged run history.'],
  }
}

const INTEGRATIONS: Integration[] = [
  {
    key: 'fabric',
    name: 'Microsoft Fabric REST',
    vendor: 'Microsoft',
    host: 'api.fabric.microsoft.com',
    configured: true,
    purpose: 'Lists workspaces and items, and reads notebook and pipeline definitions.',
    degrades: 'Explore is empty and nothing can be sent to the sandbox.',
    needs: 'A principal with Viewer on each workspace you want to browse.',
    detail: '[demo] Staged. Nothing is called.',
    caveats: ['An empty workspace list means no permission, not an empty tenant.'],
  },
  {
    key: 'onelake',
    name: 'OneLake',
    vendor: 'Microsoft',
    host: 'onelake.dfs.fabric.microsoft.com',
    configured: true,
    purpose: 'Reads Delta table schemas so column lineage can be resolved.',
    degrades: 'Column lineage thins out to table level.',
    needs: 'Read access to the lakehouse files, which is separate from item permission.',
    detail: '[demo] Staged. Nothing is called.',
    caveats: ['Unreadable input schemas look exactly like a notebook with no SQL in it.'],
  },
  {
    key: 'sandbox',
    name: 'Sandbox engine',
    vendor: 'Odyssey',
    host: '127.0.0.1:8765',
    configured: false,
    purpose: 'Analyses a notebook and derives column-level lineage from it.',
    degrades: 'Runs return staged results instead of analysing the code.',
    needs: 'python -m sandbox.service, and VITE_SANDBOX_URL pointing at it.',
    detail: '[demo] Not called in demo mode — results below are staged.',
    caveats: ['A host running the engine must hold no secrets in its environment.'],
  },
  {
    key: 'entra',
    name: 'Microsoft Entra ID',
    vendor: 'Microsoft',
    host: 'login.microsoftonline.com',
    configured: false,
    purpose: 'Issues the tokens every call above would carry.',
    degrades: 'Nothing can be read from Fabric at all.',
    needs: 'A registered application, and a secret held server-side.',
    detail: '[demo] Odyssey holds no credential. See docs/fabric-toolkit-wiring.md.',
    caveats: ['A client secret must never reach the browser bundle.'],
  },
]

const IDENTITY: Identity = {
  mode: 'none',
  client_id: '00000000-0000-0000-0000-000000000000',
  tenant_id: '00000000-0000-0000-0000-000000000000',
  display_name: 'Demo data — no principal',
  note: 'Nothing is authenticated. Every response on this screen is staged.',
}

/** A short pause, so loading states are visible rather than skipped past. */
const settle = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120))

/**
 * The whole estate as a `FabricApi`.
 *
 * `runSandbox` prefers a real engine when one is wired: a staged result is for
 * proving the app works, and analysing the code for real is strictly better
 * when it is available. It falls back to the staged result so demo mode needs
 * no Python at all.
 */
export function demoFabricApi(realEngine?: FabricApi): FabricApi {
  setDemoActive(true)
  return {
    async status() {
      return settle({ configured: true })
    },

    async workspaces(): Promise<FabricWorkspace[]> {
      return settle([
        { id: WS_ID, name: WS, description: 'Demo — the medallion estate.' },
        { id: WS_FINANCE_ID, name: WS_FINANCE, description: 'Demo — reference data.' },
      ])
    },

    async items(workspaceId: string): Promise<FabricWorkspaceItems> {
      return settle(
        ITEMS[workspaceId] ?? { folders: [], notebooks: [], lakehouses: [], others: [] },
      )
    },

    async tables(_workspaceId: string, lakehouseId: string): Promise<FabricTable[]> {
      return settle(TABLES[lakehouseId] ?? [])
    },

    async notebookSource(
      _workspaceId: string,
      itemId: string,
      name: string,
    ): Promise<FabricNotebookSource> {
      const notebook = notebookById.get(itemId)
      if (!notebook) throw new Error(`No demo notebook "${name}".`)
      return settle({
        name: notebook.name,
        lakehouse_default: notebook.lakehouse,
        cells: notebook.cells,
      })
    },

    async tableSchema(
      workspaceId: string,
      lakehouseId: string,
      tableName: string,
    ): Promise<FabricColumn[]> {
      const lakehouse =
        Object.values(LAKEHOUSES).find((l) => l.id === lakehouseId)?.name ?? 'lh_gold'
      const workspace = workspaceId === WS_FINANCE_ID ? WS_FINANCE : WS
      return settle(SCHEMAS[ref(lakehouse, tableName, workspace)] ?? [])
    },

    async pipelineDefinition(
      _workspaceId: string,
      itemId: string,
    ): Promise<FabricPipelineActivity[]> {
      return settle(PIPELINES[itemId] ?? [])
    },

    async runSandbox(body: SandboxRunRequest): Promise<SandboxRunResult> {
      const notebook =
        (body.item_id ? notebookById.get(body.item_id) : undefined) ??
        NOTEBOOKS.find((n) => n.name === body.name)

      // A real engine, given real cells, beats a staged answer every time.
      //
      // But an engine that is wired and not running must not break demo mode:
      // its whole promise is that the app works with nothing running, and
      // "VITE_SANDBOX_URL is set but I forgot to start the service" is the
      // normal way to arrive here. So a failure falls back to the staged
      // result and SAYS SO in the log — silently serving fixtures after a real
      // engine failed would hide a genuine fault, which is the one thing demo
      // mode must never do.
      let engineNote: string | null = null
      if (realEngine?.runSandbox) {
        const cells = body.cells ?? notebook?.cells
        if (cells?.length) {
          try {
            return await realEngine.runSandbox({
              ...body,
              cells,
              workspace: body.workspace ?? WS,
              lakehouse: body.lakehouse ?? notebook?.lakehouse ?? '',
            })
          } catch (err) {
            engineNote = `[demo] The sandbox engine could not be reached, so this result is staged. ${
              err instanceof Error ? err.message : String(err)
            }`
          }
        }
      }

      if (!notebook) {
        return settle({
          ok: false,
          engine: 'stub',
          cells: [],
          reads: [],
          writes: [],
          table_schemas: {},
          column_lineage: [],
          log: [],
          saw_credentials: false,
          error:
            'No staged result for this notebook. Demo mode covers the notebooks in the ' +
            'demo workspace; wire the sandbox engine to analyse anything else.',
        })
      }

      const result = demoRun(notebook)
      return settle({
        ...result,
        ...(engineNote ? { log: [engineNote, ...result.log] } : {}),
        ...(body.include_observed ? { observed: demoObserved(notebook) } : {}),
      })
    },

    async observedRun(params: ObservedRunRequest): Promise<SandboxObservedRun> {
      const notebook = notebookById.get(params.item_id)
      if (!notebook) {
        return settle({
          available: false,
          livy_id: '',
          application_id: '',
          state: '',
          submitted_at: '',
          code_changed_at: '',
          submitter: '',
          reads: [],
          writes: [],
          statements: [],
          tables: {},
          statements_seen: 0,
          statements_resolved: 0,
          unrecognised: [],
          notes: ['[demo] No staged run history for this item.'],
        })
      }
      return settle(demoObserved(notebook))
    },

    async integrations(): Promise<Integration[]> {
      return settle(INTEGRATIONS)
    },

    async identity(): Promise<Identity> {
      return settle(IDENTITY)
    },
  }
}

/** Exposed for tests and for anyone building fixtures on top of these. */
export const __demo = { NOTEBOOKS, SCHEMAS, ITEMS, PIPELINES, WS, WS_ID }
