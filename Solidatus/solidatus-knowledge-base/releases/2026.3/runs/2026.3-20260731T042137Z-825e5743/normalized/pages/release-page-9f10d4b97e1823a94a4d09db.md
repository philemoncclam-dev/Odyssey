# Solidatus 6.5

We're excited to share what's coming in Solidatus 6.5! This release delivers powerful enhancements to existing functions and introduces a game-changing new capability: [**Data Assets**](/models/understand-solidatus-models/data-assets-101).

**Data Assets** enables Solidatus to recognise when the same data elements appear across multiple models, so it can automatically consolidate their lineage into unified views. This unlocks the ability to generate Data Maps that automatically stitch end-to-end data flows across a set of models.

With the 6.5 release, we’re also launching this new Solidatus documentation site – docs.solidatus.com – to improve the self-service support experience on your Solidatus journey.

## What’s new in 6.5

**Cross-model lineage simplified with Data Assets**

Assign *Asset properties* to entities that represent the same data element across multiple models. Data Maps can then automatically consolidate lineage for the asset across models, eliminating the work of mapping in large composite models.

**Unified views of Data Assets in Data Domains**

New dedicated pages for Data Assets in Data Domains enable you to see everything about a data asset in one place. You don’t have to jump between models to piece together the full picture of a data element across your estate.

**Lineage-based queries in Data Domains**

New query predicates retrieve entities in the lineage trace of a focal entity in a Data Domain. Match entities flexibly and precisely by hierarchy, properties, or relationships and quickly identify upstream sources and downstream targets.

**Query lineage via the API**

Leverage the new domain trace queries through the API to integrate lineage data directly into your automated processes, eliminating manual UI interactions and enabling better integration with your existing tools and workflows.

**Time and date interval queries in the Model Viewer**

Find data elements with time- and date-based properties within or exceeding specific time intervals. New date and time math supports flexible matching across intervals, making it easier to identify data by temporal characteristics.

**Colours for Context grouping boxes in Data Maps**

You can now customise the colour of context grouping boxes in a Data Map. With colour-coded high-level data groupings, you can make the business context of data flows easier to understand.

**New documentation site with enhanced search: docs.solidatus.com**

We now have a single, easy to remember hub for Solidatus user and technical documentation. The site has an AI enhanced search function to help you find the information you need, and connector-specific documentation can now be accessed from the main documentation site.

## Usability enhancements

**Label column added to Related Entities tab in Data Domains** The Related Entities tab on the pages of reference terms in a Data Domain now shows the label of listed relationships, making it easier to understand them without navigating to another page.

**Related term name and properties added to default CSV exports**\
A column containing the name of a related term has been added to default CSV exports, making it easier to identify and interpret exported reference relationships.

**Query option easier to find in grid reports**\
The option to enter a query to define the entities included in a grid report has been moved to the top of the dropdown menu, making it easier to find and select the most used option.

**Empty rows skipped for tabular imports** Empty rows in tabular imports are now skipped and no longer generate an error message in the import dialog.

**Empty rows removed from tabular exports**\
Empty rows representing entities with no values for columns included in a tabular export are now removed, making it more efficient to work with exported data.

**Reference model panel performance improvements**\
We improved how reference models are loaded in the Reference Models sidebar tab in the Model Viewer to improve performance when deleting all existing relationships to a model.

**Fuzzy search for Data Assets in Data Domains**\
The search for Data Assets in a domain by Asset ID matches IDs that *contain* the provided search text, so you can find the assets you are looking for without knowing their exact IDs.

**$originatingModelId available as a column value in CSV exports and grid reports**\
You can now include the original model ID for imported entities in the model in a designated column when using CSV exporting or grid reports.

**New predicates in Model query language**\
New inFocusedTrace() and inHighlightedTrace() predicates match entities in a focused or highlighted trace currently applied to a model. You can use these to create display rules or filters that apply only to entities in currently applied traces.

**Renamed predicates in Domain query language**\
The Domain query language predicates HasParent and HasChild have been renamed to HasAncestor and HasDescendant to make their function clearer and to make room for new parent and child only predicates in future releases.

**New admin commands buttons on admin console**\
New buttons for common admin commands have been added to the console on the admin page, making it easier to find and execute them through the UI.

**New admin command to fix import id inconsistency**\
There is a new admin command that allows an administrator to fix inconsistencies in import ids across a model and forks, clones, and drafts of the model without access to the database.

**Pressing ENTER in a text field adds a new line rather than closing the dialog**\
In text fields throughout the application, pressing ENTER adds a new line rather than executing the command prompted by the dialog or closing the dialog. To execute an action button using your keyboard, press Tab until the button is highlighted, then press ENTER.

**Activities in Model Overview can be sorted by activity number**\
The list of activities in the Activities tab of the Model Overview can now be sorted by activity number, making it easier for you to work with long lists of activities.

**Groups are now links in PEOPLE section of Model Overview summary tab**\
If you’ve shared a model with a group, the group name that appears in the PEOPLE section of the Model Overview summary tab is now a link that takes you to the group page.

**Link to developer API docs now available through the help menu**\
You can access our comprehensive developer API reference through a new option in the help menu. Just click the **?** in the top-right of Solidatus and select “API Documentation”.

## Bug fixes

**Unedited transitions in imported model update diff no longer appear as edited**\
When reviewing an imported model update activity in Diff mode, all transitions from imported model are no longer recorded as edited. Edited transitions do appear and are recorded as edited.

**Fixed behaviour when display rules are edited or deleted**\
When a display rule in the Model Viewer is edited or deleted, the effect is immediately registered in the model.

**Fixed performance when deleting imported entities in Model Viewer** We fixed situations in which large scale deletions of imported entities took several minutes in the Model Viewer. Deletions are targeted to take no more than 10 seconds.

**Pipe delimiter for tabular imports is fixed**\
The pipe character `|` for separating elements in a path now works as intended when importing entities by path in tabular format.

**Fixed search error when entities are in both atomic and composite models**\
Fixed error when Data Domain or Global search scope includes atomic and composite models that contain the same matched entities.

**Fixed dry run option for remove duplicate entities admin command**\
The “dry run” option when using the remove duplicate entities admin command no longer executes the command, instead executing a dry run as intended.

**SSO users cannot reset their passwords locally**\
SSO users who try to reset their password locally now encounter a message encouraging them to contact their Solidatus administrator.

**Fixed the error when reenabling “Subscribe to” settings for imported model updates**\
Re-activating “Subscribe to” for import update activities in the Model settings no longer causes the activities settings tab to close without saving the updated setting.

**Fixed behaviour of “Hide unchanged” in Diff mode toolbar**\
Hide unchanged in Diff mode toolbar hides entities that were not changed, instead of entities that were changed, allowing you to inspect changes more easily.

**Fixed filter and sorting behaviour in domain permissions settings**\
The list of owners and members of a Data Domain registers filtering and sorting selections immediately.

**Fixed error when fork and parent models import from the same model**\
Fixed error with revision history and viewing changes at revision on parent models when a pull request is merged from a fork that imported entities from the same model.

**Removed blank white dialog when exporting Control-M XML, YAML, or JSON**\
The blank white dialog that appeared when exporting a model in CONTROL-M XML, YAML, or JSON has been removed. Note that the dialog did not affect functionality and exports succeeded as intended.

**Fixed limited scenarios when Control-M XML exports would fail**\
We identified and fixed the source of Control-M XML exports failing on specific models.

**Fixed error when viewing Admin “Events” page**\
An error is no longer encountered when attempting to view Events on the Admin page.

**Fixed BACK button when previewing contents of a Grid report**\
The BACK button when previewing a Grid report now takes you back to the report editing dialog, where you can modify the report, rather than to the list of existing Grid reports.

**Fixed access limit behaviour for read-only sharing links**\
Access limit restrictions placed on read-only sharing links now work as intended to limit number of times the link is used to the number entered when the link is created.

**Fixed “Create metric” and “Create tile” buttons in Analytics reports settings**\
The “Create metric” and “Create tile” buttons at the top of the Analytics reports interface now work when clicked from the Settings page of an Analytics report.

**Fixed context menu behaviour in Model Viewer when using Shift + Right-click**\
When using Shift + Right-click to open the context menu in the Model Viewer, the menu now closes after selecting an option.

**Appropriate group membership automatically added for new SSO users**\
When a new SSO user logs in, they are automatically added to appropriate Groups in Solidatus, without having to log out and log back in.

**Fixed counts of imported entities in tabular format**\
We fixed the count of imported transitions in the tabular importer when using the “Match by ID” option to compare incoming and existing transition data. We also fixed count numbers to update immediately when the “Match by” option is changed.

**Fixed behaviour of “Cancel changes” when reviewing imported model updates in Diff mode**\
Using “Cancel changes” to reject changes to imported content now returns you to the Model Viewer, registering the rejection, rather than remaining in Diff mode.

**Lineage highlighting in a Data Map extends beyond one hop**\
Selecting an entity in a Data Map highlights its full lineage with all hops included, rather than extending to one hop only.

**Fixed Name Replacement display rules with formula property types**\
Name Replacement display rules that use a formula property type now show the formula calculation result, rather than showing the raw formula itself.

**Console error when more than 1 transition between source and target**\
In rare scenarios, there can be more than one transition between the same source and target in a model. If this occurs, a console warning now appears in the browser developer tools so users are aware of how the transitions are handled.

**No longer have to click Back in browser twice to go back to Model Browser** After saving changes to a model, clicking the Back button once in your browser returns you to the Model Browser.

**Fixed incoming transitions API endpoint when path names parameter is included** The `/api/v1/models/{modelId}/load/{entityId}/transitions/incoming` endpoint no longer returns an error when the `includePathNames` parameter is set to true.

## User interface bug fixes

**Empty “Untagged” context boxes removed from Data Maps**\
“Untagged” context boxes that are empty when context is applied to a Data Map have been removed. They only appear when active context groupings do not apply to one or more entities in the Data Map.

**Fixed disappearing transitions in Data Maps** We fixed scenarios where collapsing and expanding entities in a Data Map caused transitions between them to disappear.

**Fixed ability to delete all model tags via the Model Overview** You can now remove all tags or a single, final tag via the Description box on the Summary tab of the Model Overview.

**Fixed position and function of link to model in Data Map popout sidebar**\
The link in the Data Map popout sidebar to the original source model containing a selected entity now works and is positioned directly to the right of the model’s name.

**Fixed placement of loading spinner when importing SOL file**\
The loading spinner when importing a SOL file no longer appears underneath the import dialog.

**Acknowledgement toast appears when final Data Map display rule is deleted**\
The toast popup that appears to confirm successful deletion of a Data Map display rule has been fixed so that it appears when a single remaining display rule is deleted.

**UI fixes to Entity History panel in INSPECTOR sidebar tab**\
The “LOAD ENTITY HISTORY” button no longer displays the name of the selected entity, and long entity names no longer overflow in the panel.

**New tooltip showing exact model count for models over 1K**\
A new tooltip in the Model Browser shows the exact model count when the number of total Lineage or Reference models exceeds 1K.

**Fixed display of long group names in model share dialog**\
We fixed the tendency of long group names to flow over the boundary of the text field in the dialog for sharing a model that can be accessed through three-dots menus in the Model Browser.

**Fixed display of long entity names in Tiles entity list**\
Long entity names are now truncated and followed by an ellipsis in the list of entities counted by a metric that is included in a chart.

**Fixed cursor resolution in advanced query builder**\
We fixed situations in which the cursor in the advanced query builder in Analytics reports and Data Map display rules became blurred.

**Fixed display of transition counts in Model Viewer**\
When the “Show transition counts” option is enabled in the Options menu of the Model Viewer toolbar, transition counts display consistently when hovering over the right or left side of entities in a model.

**New warning when “Quick query” is disabled in Model Viewer query builder**\
A new warning appears in the Model Viewer query builder when the “Quick query” mode is disabled due to a complex query in the Advanced mode that cannot be rendered in “Quick query” mode.

**Model owners displayed in “Most Changed Models” admin stats**\
Model owners are now displayed correctly in the list of “Most Changed Models” in the statistics section of the Admin page.

**Fixed SAVE button in Data Map settings**\
The SAVE button in the Data Map tab of Data Domain settings now remains disabled until changes have been made to context model selections.

**Fixed pagination of search results in Admin groups section**\
When searching for groups in the Groups section of the Admin page, the pagination reflects the list of search results.

**Fixed behaviour of Property panel interface for long property values**\
Fixed the visibility of the “Show more” button for long property values, fixed warning icon appearance, and fixed scroll bar position in the Properties and Relationships panel in the Model Viewer.

## Customer requested fixes

* **#16581** – New error message when corruption is detected during model loading. Users are prompted to contact support and can still open the model in read-only mode.
* **#17672** – Fixed null import ID on revisions created from import model updates
* **#17795** – Fixed error when retrieving activity created or last modified by deleted user via the API
* **#6952** – $originatingModelId available as a column value in CSV exports and grid reports
* **#17862** – Global search with no models in scope no longer causes error
* **#18015** – Fixed incorrect inactive icon for active connector

## How to upgrade

SaaS environments will automatically upgrade to 6.5 during the week of December 6-7, 2025. Please contact [support@solidatus.com](mailto:support%40solidatus.com) if you have any questions or specific requirements.

For on-premises customers, contact [support@solidatus.com](mailto:support%40solidatus.com) to upgrade or for any other questions.

{% hint style="success" %}
Operational Release Notes with infrastructure changes since the last release are also available upon request.
{% endhint %}
