// ============================================================================
// ORGANIZATION CONFIG — the one file to edit to deploy Odyssey for a real
// work environment.
// ============================================================================
//
// Everything below is a VALUE — names, ids, lists — not application logic.
// Whoever owns your Entra tenant, your data governance taxonomy, or your
// application inventory can fill this in without touching anything else in
// the codebase. Each value is re-exported from wherever it used to live
// hardcoded, so nothing else had to change to read from here instead.
//
// What is NOT here, on purpose:
//   - Real Fabric API implementations. Those are code, not values — see
//     app/src/fabric/realApi.ts and docs/fabric-toolkit-wiring.md.
//   - Feature toggles (VITE_FABRIC_DEMO, VITE_FABRIC_REAL, VITE_SANDBOX_URL,
//     VITE_SKIP_AUTH). Those are per-run environment variables, not
//     deploy-once values — set them when you start the app, documented in
//     app/src/fabric/wiring.ts and the README's Development section.

// ============================================================================
// 1. Sign-in — Entra ID / MSAL app registration
// ============================================================================
// From your Entra app registration (App registrations → New registration,
// platform "Single-page application"). Client ID and tenant ID are public
// identifiers, not secrets — safe in the browser bundle.
//
// Read from .env at build/run time (see .env.example) rather than hardcoded
// here, because these are the one thing in this file that differs between a
// local dev checkout and a real deployment of the SAME code — everything
// else below is safe to commit for your org.
export const MSAL_CLIENT_ID = import.meta.env['VITE_MSAL_CLIENT_ID'] || ''
export const MSAL_TENANT_ID = import.meta.env['VITE_MSAL_TENANT_ID'] || ''
export const MSAL_REDIRECT_URI = import.meta.env['VITE_MSAL_REDIRECT_URI'] || window.location.origin

// ============================================================================
// 2. Who may sign in
// ============================================================================
// Email domains allowed past the sign-in gate, once MSAL confirms who
// someone is. Deny-by-default: an empty list locks everyone out rather than
// silently opening the app to the whole tenant. See app/src/auth/allowlist.ts.
export const ALLOWED_EMAIL_DOMAINS: string[] = ['cclgroup.com']

// ============================================================================
// 3. Domain taxonomy
// ============================================================================
// The hierarchy the catalog's "Domains" view groups published models by —
// a domain can live under a domain, without limit (see `children`). An
// enterprise-provided hierarchy in a real deployment; a fixture until that
// source is wired. See app/src/catalog/taxonomy.ts.
import type { TaxonomyNode } from './catalog/types'

export const DOMAIN_TAXONOMY: TaxonomyNode[] = [
  {
    id: 'sales',
    name: 'Sales',
    children: [
      {
        id: 'sales-emea',
        name: 'EMEA',
        children: [{ id: 'sales-emea-retail', name: 'Retail' }],
      },
      { id: 'sales-amer', name: 'Americas' },
    ],
  },
  { id: 'finance', name: 'Finance' },
  { id: 'operations', name: 'Operations' },
]

// ============================================================================
// 4. Data product and application pick-lists
// ============================================================================
// What a model can be published under, in the catalog's "Data products" and
// "Applications" views. See app/src/catalog/fixtures.ts.
export const DATA_PRODUCTS: string[] = ['Customer 360', 'Order Fulfilment', 'Regulatory Reporting']

export const APPLICATIONS: string[] = ['Power BI', 'SAP', 'Salesforce', 'Internal ETL']
