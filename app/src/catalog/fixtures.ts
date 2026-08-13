// Data product and application pick-lists — enterprise-provided lists in
// reality, fixtures here (same decision as the taxonomy). The lists
// themselves live in organization.config.ts — the one file to edit for a
// real deployment; the catalog only ever reads the strings.
import { DATA_PRODUCTS as _DATA_PRODUCTS, APPLICATIONS as _APPLICATIONS } from '../organization.config'

export const DATA_PRODUCTS: string[] = _DATA_PRODUCTS

export const APPLICATIONS: string[] = _APPLICATIONS
