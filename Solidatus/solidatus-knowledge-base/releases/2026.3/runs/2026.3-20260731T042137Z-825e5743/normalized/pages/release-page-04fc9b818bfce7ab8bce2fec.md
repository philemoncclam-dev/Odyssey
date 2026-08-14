# Solidatus 2026.3

Solidatus 2026.3 makes the AI Assistant more capable and easier to govern, speeds the path from analytics to action, and gives Data Domains a clearer, more consistent home.

* Return to AI Assistant conversations across sessions
* Carry context forward with Chat Rollup
* Use quick actions and queued follow-up requests
* Save and reuse prompts with the Prompt Library
* Bring your own LLM provider and keys
* Connect external tools through MCP support
* Export drill-down results to CSV
* Manage Analytics Reports from the domain home page
* Navigate domains with the new Domain Spine
* Explore Lineage Models, Reference Hub, and entity hierarchies in context
* Save Data Maps without reloading and keep display rules persisted
* Benefit from broader performance, navigation, and UI fixes

Solidatus 2026.3 also continues platform modernisation work, improving performance, compatibility, and maintainability across large models and everyday workflows.

Read on to find out what else is in Solidatus 2026.3.

### New features

**Persistent conversation history**

AI Assistant conversations now persist across browser sessions. You can return to earlier chats directly from the assistant panel.

Conversations are organised by recency. You can search, rename, or delete them to keep your workspace tidy. Administrators can also disable conversation history when needed.

<figure><figcaption><p>Search, rename, and resume past conversations from the assistant panel.</p></figcaption></figure>

**Chat Rollup for long conversations**

When a conversation reaches its context limit, the AI Assistant now creates a Chat Rollup. This carries forward active states, filters, traces, and key entities into a fresh conversation.

Your progress stays intact while the old chat history clears. This restores context capacity and keeps the session responsive.

<figure><figcaption><p>Start a new chat with Chat Rollup when a session reaches its context limit.</p></figcaption></figure>

<figure><figcaption><p>Carry active state and key findings into the new session.</p></figcaption></figure>

**Quick Actions and queued follow-up requests**

The AI Assistant now surfaces contextual Quick Actions based on the current session. These help you move into the next step with fewer manual prompts.

You can also queue a follow-up request while the assistant is still generating a response. The next request runs automatically when the assistant is ready.

<figure><figcaption><p>Run contextual next steps in one click and queue a follow-up while a response is still generating.</p></figcaption></figure>

**Prompt Library for the AI Assistant**

The AI Assistant now includes a built-in Prompt Library. You can create, store, and manage reusable prompts directly in the assistant panel, then apply them to any conversation.

The Prompt Library supports personal prompts and shared model prompts. You can tag prompts, scope them to a model or all sessions, and set them to auto-include in new conversations.

<figure><figcaption><p>Save, scope, and reuse prompts from the Prompt Library.</p></figcaption></figure>

**Bring Your Own LLM**

BYOLLM lets organisations use the AI Assistant with their own model provider and keys. This supports teams with stricter governance, sovereignty, or model preference requirements.

The setup also includes clearer error handling for misconfigured LLM settings.

<figure><figcaption><p>Configure the AI Assistant against your own provider and keys.</p></figcaption></figure>

**Model Context Protocol support**

Solidatus now exposes an MCP server. This opens access to a broader ecosystem of AI-powered tools and agents through the Model Context Protocol.

External tools can read and write model data through MCP. Support includes basic and extended MCP capabilities. Contact your Account Manager to gain access.

**CSV export for Analytics report drill-down**

You can now export metric drill-down results to CSV from the drill-down panel in Analytics reports. This gives teams direct access to the underlying records behind a metric for reporting or offline analysis.

<figure><figcaption><p>Export the records behind any metric straight to CSV.</p></figcaption></figure>

**Domain Spine in Data Domains**

Data Domains now include the Domain Spine. It stays visible as you move through a domain, keeping the most important domain content one click away.

The Domain Spine gives direct access to Home, AI Assistant, Reference Hub, Lineage Models, saved Data Maps, and related domain content.

<figure><figcaption><p>The Domain Spine keeps Home, AI Assistant, Reference Hub, models, and more one click away.</p></figcaption></figure>

**Lineage Models and Reference Hub in Domain**

Lineage and reference models now have a clearer home inside Data Domains. A dedicated Lineage Models page lists all connected lineage models, and the domain home page now includes a consolidated Lineage Models section.

The Reference Hub is also available directly from the Domain Spine, making in-domain model navigation faster and more consistent.

<figure><figcaption><p>Lineage models now live inside the domain, with model details a click away.</p></figcaption></figure>

**Entity Hierarchy on entity pages**

Entity and sub-entity pages now include an entity hierarchy table. This gives a searchable, paginated view of nested structure without leaving the domain context.

You can move into sub-entities and terms more easily from domain pages, and property folders help organise entity properties more cleanly.

<figure><figcaption><p>A searchable, paginated hierarchy table makes nested structure easy to navigate in context.</p></figcaption></figure>

### Usability enhancements

**AI Assistant fixes and polish**

The AI Assistant is now more stable in large or complex sessions. Auto-include prompts apply more consistently, uploaded files display correctly, and markdown code rendering is cleaner.

Opening and closing the AI panel is smoother, previous sessions retain continuity more reliably, button behaviour is more consistent, and error handling now keeps the original message visible.

**Analytics workflow improvements**

Analytics Reports can now be edited and deleted directly from the report list on the Data Domain home page. This removes the need to open a report before managing it.

The tile metric editor also keeps the full list of metrics visible while you scroll. This makes report setup easier.

**Smoother Data Map exploration**

Data Maps now use a smoother save flow. Saving a view no longer reloads the page, and a snackbar confirms when the save completes.

Display-rule editing is also more reliable, including for rules created with manual selection. Display rules now persist correctly on saved Data Map views.

**General platform polish and fixes**

Continued modernisation work improves long-term performance, compatibility, and maintainability. Large models now load and navigate more consistently, and browsing and analysis see fewer interruptions.

* **Navigation and consistency** — Agents within a group now paginate correctly, tab titles are cleaner across Data Domains, Models, and Data Maps, guided tours have been removed, and Focus Trace now remembers depth and adjusts more intelligently.
* **UI polish** — Model Viewer layout is improved, long entity names are handled better, Reference Models search works more reliably with special characters, and multi-select values in Data Domain views now show full text on hover.
* **Data Map experience** — lineage highlighting is more accurate on direct upstream and downstream paths, display-rule match counts are clearer, and synonymous transitions now render with fewer overlapping arrows.
* **Import, export, and links** — SOL import errors are clearer, asset lists now exclude `/`-only asset IDs, Grid Reports remember values in the last row without adding a new row, and the `Forked from` link now opens the correct parent model dashboard.

### Upgrade notes

For on-prem upgrades, check the Ops Release Notes before planning your rollout. For questions about your environment, BYOLLM, or MCP access, contact your Account Manager or Customer Success Manager.
