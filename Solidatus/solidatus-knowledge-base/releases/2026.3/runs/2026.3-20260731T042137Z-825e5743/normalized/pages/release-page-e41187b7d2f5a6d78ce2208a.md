# Solidatus 6.2

**Solidatus 6.2 Release Notes – October 2024**

The updates in 6.2 focus on Data Domains and Data Maps, advancing both our industry-leading fine-grained lineage and our business-oriented capabilities.

*\* These notes contain changes since the last release notes for version 6.1. Please see the final sections for customer requested fixes, deprecated features, and information on how to upgrade.*

## New Features

**Improved Data Domains Interface**

The Data Domains UI has been given a fresh, modern redesign, offering a sleek and intuitive user experience. We aimed to make sure all information that matters is clear and easy to find.

**Customisable Display Settings for Data Maps**

Enhance your Data Maps with visual tags that surface key metadata and highlight critical information directly on the map. You can use a simple dialog interface or the Domain Query Language to match entities that will display a tag, and you can customise tag text and colour.

**Advanced metric creation using the Domain Query Language**

Analytics reports now allow you to use the Domain Query Language to define a set of items in a Data Domain that you wish to count. You can still configure a metric using a simple dialog interface with menus and buttons, but the Domain Query Language is available for fine-grained analytical needs.

## Usability enhancements

**New Relationship Predicates in the Domain Query Language (DQL)**

Use new HasDirectRelationship: and HasRelationship: predicates to retrieve entities by relationship to Reference terms in a Data Domain. The new relationship predicates can be combined with sub-predicates Term= and Label= to retrieve entities based on specific relationship characteristics.

**Improved Navigation Tools for Data Maps**

Navigate Data Maps more easily with new tools for recentering and zooming that are accessible via intuitive buttons in the top-right corner of a Data Map.

**New Model Name and Model ID columns for Grid Reports**

Make your grid report exports for composite models easier to interpret by adding columns with the original model name and original model ID of all imported entities.

**Entity links now appear on Model Overview when viewing related Reference Terms**

In the Terms tab of the Model Overview of a Reference Model, the “Entities Relating to this Term” section now lists entities related to the selected term. Entity names in the list are clickable links that open the entity in its original model in a new browser tab with a focused trace applied to show its lineage.

**Tabular importer can import entities with duplicate paths**

You can now import distinct entities that have the same path by adding square brackets with numbers (i.e., \[1], \[2]) at the end of each path. The importer will parse these bracketed values rather than adding them to the entity name.

**Exporting and reimporting entities by path in tabular now works with special characters**

You can now export and directly reimport entities with special characters in their names (`/` , `[` , `]`) using their path. Special characters can be escaped using a `\` before the character, and exports automatically add the `\` to entity names in a path that contain a special character.

## Bug Fixes

`hasProperty()` **query in Model Viewer matches entities that have a property with no assigned value** – `hasProperty()` no longer requires that entities have an assigned value for the specific property to match the query.

**We updated the collapse/expand icon for the Model Viewer toolbar from one arrow to two** – The collapse/expand icon for the Model Viewer is now two arrows to make it easier to see.

**Fixed auto-mapping using “Path” as the comparison criterion** – Fixed inability to expand suggested mappings when using “Path” as the comparison criterion in the Auto Mapper.

**Group dialog on admin page now identical to group dialog on groups page** – We’ve made these dialogs look and behave the same for better usability and to ensure service accounts show up in admin groups.

**Fixed API tokens not appearing after creation for Service Accounts** – You can now view an API token created for a service account immediately after it is created, so you can copy it and save it.

**Tiles saved on an Analytics report no longer appear on other reports** – New tiles created and saved on an Analytics Report no longer appear on another report’s summary page.

**Dragging and dropping to move entities in a model has been fixed** – Dragging and dropping no longer results in entities moving into unintended positions in a model.

**We fixed copying and pasting data from the import-simple.xlsx to import transitions** – We removed the empty column in the import-simple.xlsx template that caused an error copying and pasting data into the tabular import dialog.

**Properties are added to the correct entity when importing by path in tabular** – We fixed the issue where properties are added to the Layer when an entity is imported using its path and properties are also defined. Properties are now added to the lowest level entity in the path.

**Fixed error message when sources and targets of imported transitions do not exist in the model** – The error message no longer contains the number of times the error occurred as this is captured by the number of times the row number is listed.

**Fixed menu for adding multi-select property values** – The menu for adding multi-select property values no longer closes after adding the first value, allowing you to add multiple values at once.

**History page for a domain entry no longer causes entry page to stop working** – The History page for a domain entry no longer fails to load, and if it encounters an error, the rest of the entry page continues to function.

**Fixed the dialog for requesting to resend an email to register an account** – The dialog opens when you click “I have not received email” and allows you to resend the registration email.

**Fixed loading error for Reference model pages in a Data Domain** – Reference model pages in Data Domains show an error and can be refreshed if they are stuck when loading.

## Customer requested fixes

**15334** – The default timeout for ElasticSearch was 60 seconds, but it is now configurable.

**15406** – Fixed the error when importing JSON with the key name “length”. You can now import the JSON object “length” with a value type “int”.

**15545** – When the number of activities exceeds 1,000, you can access a tooltip to view the exact number of Activities or the exact number of a specific Activity.

## Deprecated Features

Although Dashboards and Global Search are still available in 6.2, they will be deprecated in future versions. Dashboards are moving into your Data Domains and will be replaced by Analytics Reports, and Global Search will be replaced by the search and query capabilities in Data Domains.

## How to Upgrade

SaaS environments will automatically upgrade to 6.2 during the week of 28 October – 1 November 2024. Please contact [support@solidatus.com](mailto:support%40solidatus.com) if you have any questions or specific needs.

On-prem customers should contact [support@solidatus.com](mailto:support%40solidatus.com) to inquire about upgrading to Solidatus 6.2.

*\* Operational Release Notes with infrastructure changes since the last release are also available upon request.*
