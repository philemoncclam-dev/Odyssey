# Solidatus 6.1

## **Solidatus 6.1 - August 2024**

We’re thrilled to announce exciting updates to Solidatus with version 6.1!

We enhanced the integration between our Lineage and Reference model capabilities and the Data Domains interface, so you can move seamlessly between technical model content and your Data Domains.

We’ve also added new features that boost your ability to analyse the contents of a Data Domain:

* A Data Domain Query Language and Query Helper
* Quantitative Analytics Reports for Data Domains
* An updated information structure for domain entries

Additionally, we improved Data Map navigation, enhanced Reference relationship analysis capabilities, and added new filters for refining the results of a Data Domain search.

**Special note** : We changed the path structure for importing entities in tabular format from`/Object/Group/Attribute` to `/Layer/Object/Group/Attribute` to make it consistent with the exportformat. You can now export and reimport without altering entity paths, but the previous path format for importing no longer functions.

Read below for more information about all new features, usability enhancements, and bug fixes in this release.

*These notes contain changes since version 6.0. Please see the final sections for customer requested fixes, deprecated features, and tips on how to upgrade.*

## New Features

**Data Domain Query Language and Query Helper**

*Facilitates advanced retrieval of metadata and lineage contained in a Data Domain*

With the new Data Domain Query Language (DQL), you can perform advanced metadata retrieval in a Data Domain based on entity names, models, and properties. Query predicates can be combined using logical operators to form more complex conditions. An integrated Query Helper offers examples of valid syntax that you can use to build your own queries, and a full CQL reference is available in the platform documentation.

**Analytics Reports in Data Domains**

*Derive and display figures that give insight into your metadata and lineage*

You can now calculate key metrics representing the contents of your Data Domains, and you can build interactive charts and infographics to display them. These charts can help you keep track of quantitative targets or demonstrate compliance using numbers, and they can be shared easily across your organisation.

## Usability Enhancements

**Consistent PATH format for tabular importing and exporting** – The format of entity paths for importing has been changed from `/Object/Group/Attribute` to `/Layer/Object/Group/Attribute`. The new format is consistent with the CSV export format, so you can export and reimport without additional editing. Importing by path from a spreadsheet is now one of the easiest ways to import any type of entity.

**Improved Data Map navigational tools** – You can now recenter a Data Map and zoom in and out using buttons at the top-right of the Data Map window.

**Properties on the landing page of a Data Domain entry** – To make the information you need more readily available, properties are now listed on the landing page of a Data Domain entry.

**Expandable Saved Data Maps and Analytics Reports dialogs** – To find the Saved Data Maps and Analytics Reports you need, you can click tiles on a Domain homepage to open an expanded dialog with full descriptions.

**Improved Relationship filters for Data Domain search** – Active relationship filters refine search results to show entities directly related to a filter term, as well as entities that inherit a relationship from their parent entities.

**More relevant search results in Data Domains** – When searching by text in a Data Domain (i.e., not using a query), results now prioritise text matches in entity names over text matches in entity properties.

**Show entities in Model Viewer that are related to the intersection of multiple Reference terms** – When you switch on “Show Usage” for multiple Reference terms in the Reference Model Panel, you can now choose whether to show entities related to any selected term or all selected terms.

**Flexible tag display rule options for Reference term property values** – You can now specify a relationship label and create a tag to display a property value of all related Reference terms with that label.

**Efficient bulk selection of entities when importing from a model** – You can now hold SHIFT on your keyboard to select an entire range of entities when importing a subset of entities from another model.

## Bug Fixes

**Name Replacement and Fixed Text display rules function correctly** – Name Replacement and Fixed Text display rules now appear properly in the Model Viewer when switched on.

**Attributes no longer hidden when modifying the Focused Trace Depth** – Fixed hiding of Attributes when changing the focused trace depth in the Tools sidebar tab.

**Fixed query when searching for assignments of multi-select property values** – When you search for assignments of a multi-select property value through the Properties Manager, the auto-populated query in the search bar is now correct: contains(property, ‘value’).

**Imports can contain nested entities at a maximum of 27 levels deep** – If you attempt to import nested entities more than 27 levels deep in any format, you now receive an error message in the import UI.

**You can delete relationships of imported entities without refreshing your browser** – We fixed the issue that relationships belonging to imported entities could not be deleted without a browser refresh.

**Owner permissions not required to cancel a Connector job** – Jobs can now be cancelled by anyone with permission to execute them, whereas previously only Owners of the Agent could cancel a job.

**Reference Model Panel loads related terms when “Filter based on selection” is switched on** – Fixed Reference Model Panel behaviour when “Filter based on selection” is on and an entity is selected.

**Fixed Diff mode when loading large Reference Models** – When in Diff mode, loading a large Reference model in the Reference Model Panel no longer causes the Inspector diff display to error.

**Fixed performance issue when exporting large models by path** – Exporting large models using a PATH column through the exporter or Grid Reports no longer causes high-memory usage.

**Related Entities tab in Data Domains showing all related entities** – Fixed scenarios in which entities related to a term did not appear in the Related Entities tab in a Data Domain.

**Fixed performance issues with bulk model updates** – Fixed speed when bulk deleting entities in version 6.0.

**Functioning “Fetch Model Changes” button in read-only mode** – When viewing a model in read-only mode, the “Fetch Model Changes” button successfully updates model content that has been edited during the viewing session.

**Consistent row indexing for importing transitions** – Row numbers in error messages and warnings are now consistent between “Upload file” and “Enter data” when importing transitions in tabular format.

**Notifications are no longer cleared after logging out and back in** – Fixed issue with clearing notifications list when a user logs out and back in that affected instances using SSO.

**Data Map Context Model settings are saved without requiring browser refresh** – Chosen Context models in the Data Domain settings for a Data Map are now saved without requiring a browser refresh.

**Fixed console error when removing all roles for multiple users through Admin page** – You can now remove all roles from multiple users simultaneously through the Admin page without a console error.

**LOAD HISTORY working correctly in Entity History panel** – The LOAD HISTORY button on the Entity History panel in the Inspector tab successfully loads an entity’s history without error.

### User Interface Fixes

**Button for editing Job Name and Description are no longer visible to users without editing permissions** – Buttons for editing a Connector Job name and description are no longer visible to Job Viewers.

**Highlight display rules render colours correctly for Layers** – Fixed issue with highlight display rules applied to Layers not displaying the chosen colour.

**Changed breadcrumbs display on Data Domain search results** – If breadcrumbs are too long to fit in the window, the middle of the path is truncated, but the first, second, and final entities are shown.

**Fixed hidden buttons on Activity page when using Safari** – When using Solidatus in Safari, buttons on the Model Overview Activity Page are now visible and clickable.

**UI now shows an error message rather than a spinner for failed API calls** – Failed API calls now result in an error message in the UI, rather than a spinner indicating that processing is still working.

**Browse tree does not show carets when there is nothing to expand** – Carets that indicate an expansion action no longer appear in the Browse Tree next to entities that do not contain sub-entities.

**UI shows when non-registered user is added to a Data Domain** – Users added to a Data Domain by typing an email address now appear correctly in the Data Domain permissions settings.

## Customer Requested Fixes

**13611** – You can select range of entities in bulk by holding down the SHIFT key when importing a subset of entities from another model. Additionally, you can add to your current selection by holding SHIFT and selecting a separate range of entities.

**14545** – Deleting a relationship now registers immediately in the user interface, without requiring a refresh of the Model Viewer or your web browser.

**14716** – Properties now show correctly in the Properties and Relationships panel when switching back and forth between selected entities.

**15005** – Fixed API error encountered when using the ReplaceModel command to delete a transition and modify the order of entities that are sources and targets of the transition.

## Deprecated Features

Although Dashboards and Global Search are still available in 6.1, they will be deprecated in future versions. Dashboards are moving into your Data Domains and will be replaced by Analytics Reports, and Global Search will be replaced by the search and query capabilities in Data Domains.

## How to Upgrade

SaaS environments will automatically upgrade to 6.1 as soon as it is ready for deployment. Please contact [support@solidatus.com](mailto:support%40solidatus.com) if you have any questions or specific needs.

On-prem customers should contact [support@solidatus.com](mailto:support%40solidatus.com) to inquire about upgrading to Solidatus 6.1.

*NOTE: More information on all changes in 6.1 is available in the platform documentation. Operational Release Notes with infrastructure changes since the last release are also available upon request.*

***
