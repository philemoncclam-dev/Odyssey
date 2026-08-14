# Solidatus 2026.1

Solidatus 2026.1 introduces the AI Assistant, a conversational AI tool built into the Model Viewer to help you explore, query, build, and update models faster and more easily while keeping people in control.

* Ask detailed questions
* Make complex, bulk changes
* Query models using natural language
* Build from diagrams, structured data, and code
* Use human-in-the-loop oversight with clear, reviewable changes
* Add external files to provide context or keep general rules in the model description

Our AI Assistant is designed to give deeper insights with less effort and to make lineage modelling quicker and more accessible, without compromising governance or control.

Read on to find out what else is in Solidatus 2026.1.

## New features

**The Solidatus AI Assistant**

The AI Assistant is a chat-based agentic AI tool. It can answer questions about your models and perform requested import, editing, and model-building tasks in the Model Viewer. It offers an entirely new way to work in Solidatus. For full documentation and details, visit the [AI Assistant section](/models/solidatus-ai-assistant-preview).

**New domain query predicates for lineage analysis**

New predicates let you query against characteristics of transitions in a Data Domain and Data Map, such as `TransitionFrom:`, `TransitionTo:`, `HasTransition:`, and `NumTransitions:`. These give you more ways to return domain items or build analytics reports based on fine-grained lineage criteria. See the [domain query language reference](/data-domains/explore-data-domains/query-data-domains) for full information.

## Usability enhancements

**Added direct parent/child predicates to the domain query language**

`HasParent:` and `HasChild:` now match only direct (one-level) parents and children in a Data Domain. Use `HasAncestor:` and `HasDescendant:` to traverse all levels up or down.

**Removed Global Search and Dashboards**

The planned deprecation of Global Search and Dashboards features has taken place in 2026.1. These features are no longer available through the top navigation bar and have been replaced by corresponding cross-model functionality in Data Domains: Domain search and Analytics reports.

**Removed redundant Model Viewer importers**

We removed the Google BigQuery importing tool from the Model Viewer, as we support extracting source metadata directly from BigQuery via our Database connector.

**Updated asset identity transition rendering**

The blue lines that connect identical data assets in a Data Map now appear only at the lowest level in a hierarchy of common assets, not at all levels. This declutters the Data Map and makes it easier to follow lineage paths across data assets.

**Aligned property counts in models and domains**

The count of entities with a property shown in the Model Viewer Property Manager now matches the behaviour of a Data Domain query for entities that have a property with any value. Both cases only count entities where the property has an assigned value, excluding cases where the property value is empty.

**Improved performance for models containing a large number of Data Assets**

Models with a large number of Data Assets (>800k) now load with minimal performance impact.

**New Type property convention for Data Asset column icons**

For Data Assets representing table columns, set the Type property to “Table column” (case-insensitive) to display the column symbol (instead of “column”).

**Notification for models containing more than one transition between the same source and target**

A new notification appears to alert users when a model contains source and target entities with more than one transition between them. The alert tells the user that the Model Viewer can only render one transition, but the model data stores all existing transitions.

**Users alerted when a domain display rule or metric exceeds the 50k matched-entity limit**

A new error message in the display rule alerts users when the number of entities matched by the query exceeds the 50k limit. Users are advised to refine the query scope to match fewer entities.

## Bug Fixes

**Improved performance of trace queries in Data Domains**

We improved the performance of trace queries (`HasDirectTrace:`, `HasDirectTraceTo:`, `HasDirectTraceFrom:`) to no longer mistakenly reach the scope limit (50k entities) when fewer entities are matched by the query.

**Two-factor authentication for non-SSO users**

We fixed the bug where users were still able to log in using only a username and password after enabling two-factor authentication or being required to enable it by a Solidatus administrator.

**Both entities and transitions imported from the downloadable spreadsheet template**

Importing the import-simple.xlsx Excel template file now successfully imports both entities and transitions in the separate spreadsheets contained in the file.

**Link to related entities on a term's page in a Data Domain**

Selecting an entity related to a reference term that appears in the Related Entities tab of a term's domain page successfully opens the entity's domain page.

**Disappearing transitions when expanding context boxes in Data Map**

We fixed situations where transitions would disappear from a Data Map when the "Untagged" box was expanded.

**New lines in text field expand the dialog vertically**

Across all text fields in the application, creating new lines in a text field no longer enlarges the dialog. Instead, if text length exceeds the visible dialog, a scrollbar is created.

**Save as a clone no longer produces corrupted model**

We fixed scenarios where saving a model as a clone produced a corrupted clone model that could not be opened.

**Improved performance of Data Asset sidebar tab**

The Data Asset sidebar tab now responds more quickly when browsing assets using the tree.

**Load full reference model button in the Reference Model Panel**

We fixed the red download button next to a reference model in the Reference Model Panel in the Model Viewer sidebar, which makes all terms in the reference model searchable and available for relationship assignment. Only currently assigned terms are loaded initially.

**Incomplete property export in Model Viewer default CSV exports**

We fixed scenarios where default CSV exports from the Model Viewer did not include all properties in the model.

**Import of term-to-term reference relationships when importing a SOL file**

We fixed the issue where importing a SOL file of a lineage model along with related reference models failed to import relationships between terms in the carried-over reference models.

**Ability to delete non-imported descendant of imported entity**

We fixed the error that occurred in limited scenarios when attempting to delete the non-imported descendant of an imported entity.

**Queries not returning reference term results in a Data Domain**

We fixed the issue where queries that matched reference terms in a Data Domain did not return them in the results.

**Graph engine section shown on admin page by default**

The Graph engine section of the admin page, which is used for monitoring and interacting with the graph engine used to support Data Assets, is now visible by default even if Data Assets is not switched on in your environment.

**Domain sync error when a model is published to multiple Data Domains**

We fixed the domain synchronisation error that occurred when a model published to more than one domain was modified and a new revision was created.

**Data Map loading when reference terms are updated in a published reference model**

We fixed the issue where a Data Map failed to load after the properties of a reference term were modified in a reference model published to the domain.

**Trace query count results in metrics**

We fixed the issue where using queries involving trace predicates in a metric did not return any count of matching entities in the domain.

**Server error on sources/targets list in Data Map side panel**

We fixed the Solidatus server error that occurred in the list of Sources and Targets of transitions in the Data Map side panel when a top-level entity was selected in the "Untagged" context box.

**Overflowed deletion toast for Data Map views and Analytics reports**

When deleting a Data Map view or Analytics report with a long name, the toast confirming successful deletion truncates the name and no longer overflows the browser window.

**Model dropdown UI in Analytics reports drill-down dialog**

In the Location column, the three-dots dropdown that shows the name of a model containing an item counted by a metric now has a fixed width and truncates long model names, and the icons for lineage and reference models are aligned.

**Confirmation toast for deleted metrics and tiles**

There is now a toast that appears to confirm successful deletion of metrics and tiles in an Analytics report.

**Intermittent flickering on the Data Asset page in domains**

We fixed situations where an Asset's page in a Data Domain would flicker continuously in the browser window.

**Data Assets caret is expanded even though sub-assets are not visible**

When searching for Data Assets via the Data Assets section in a Data Domain, matching assets in the search results no longer appear expanded when they are not.

**UI rendering for Data Assets in a domain when the sidebar is collapsed**

We fixed the issue where collapsing the browse tree sidebar in a Data Domain while viewing Data Assets would cause parts of the interface to appear cut off.

**Asset relationship tab in domains missing model name for reference terms**

The path of reference terms appearing in the Asset relationship tab on an Asset's domain page now shows the Reference model name.

**Creating a new fork now redirects to the fork's Model Overview**

When you fork a model, you are now taken directly to the Model Overview page of the fork you just created.

**Various UI issues when special characters are used in Data Assets**

We fixed several issues where asset search in domains and asset information were not working correctly when special characters were in an Asset ID.

**Create model dialog reappears when creating a model from an entity**

When using the Create model from entity option in the Model Viewer context menu, the create model dialog no longer reappears after initiating the new model creation.

**Show usage tooltip blinks and shifts**

The tooltip that appears under the SHOW USAGE button in the Reference Model Panel in the Model Viewer no longer blinks and shifts position.

**$incomingTrace and $outgoingTrace removed from Model Viewer grid reports**

$incomingTrace and $outgoingTrace are no longer available to use to define column values in grid reports, as there isn't anything that can be displayed in a column to represent an entity's trace.

**Transitions can't be selected in Model Viewer**

We fixed specific situations in which transitions in the Model Viewer could not be selected with a mouse click.

**Clearing checkboxes in Filters menu on Activities page**

We fixed the issue where selected checkboxes in the Filters menu on the Activities page would clear when the page was refreshed.

**Sent/Unsent changes register correctly when PR is submitted**

The Sent/Unsent changes box updates immediately after a PR is submitted, without having to refresh the page.

**Closing/re-opening Imported model update sets it to incorrect state**

Closing and then re-opening an imported model update activity now returns its state to "Ready to merge", rather than "Submitted" and requiring approval.

**Scrollbars overlapping properties in Asset relationship tab**

We fixed the issue where scrollbars in the properties section showing properties of a related reference term overlapped and obscured the property information.

## Customer requested fixes

* **#18412** - We fixed the issue where invalid property types were created on entities that were cut and pasted in a model.
* **#18742** - We fixed the issue where connector API job summaries would exceed the maximum 16MB BSON size.
* **#18732** - We fixed the tile drill-down showing a list of matched entities for metrics involving trace queries
* **#18457** - We fixed the error that occurred when a fork had auto-generate PRs enabled, its parent had auto-merge PRs enabled, and multiple changes to the fork were made and saved in succession.
