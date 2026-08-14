# Solidatus 5.6.8

Solidatus 5.6.8 brings several usability enhancements and bug fixes. We’ve improved features, including Dashboards and the Document Viewer, and functionality, including Display Rules, Filters, Views, and Exporting.

## Usability Enhancements

### Dashboards

**Drill down into metric values through Tiles**

Clicking on a metric value displayed in a Tile now opens a list of entities that were counted by the metric, along with the Model those entities belong to. You can click entities in the list to view more information in the Entities tab of the Model Overview.

**Default Model Scope for metrics and Tiles**

You can now set a Default Model Scope for a Dashboard, so your metrics always execute over the same set of Models for all Dashboard users. The Default Model Scope is active whenever the Dashboard is accessed or refreshed.

**Customise Tile size and position**

You can now resize Tiles and move them around to build a customised Dashboard homepage that will help you keep track of key metrics.

**Dashboard UI improvements**

The Dashboards homepage now displays charts and infographics, you can add a description for metrics, and the look and feel of the Dashboards UI has been refreshed.

### Document Viewer

**More options for customising a document in the Document Viewer**

You can now show or hide entity types in the Document Viewer, and you can display the value of a property only under specific entity types.

### Filters, Display Rules, and Views

**New Tag Display Rule for Reference Term property values**

You can now create a tag that displays a property value of a Reference Term on an entity to which the Term is related.

**Display full lineage with all hops when activating a View**

You can now display full lineage when activating and sharing a View that has “Show Trace” enabled, even for large models. All active lineage settings can now be saved when creating or editing a View, including number of hops displayed.

### Importing/Exporting

**Removed data from “SOURCE” and “TARGET” columns for entities other than Transitions**

When exporting Model content as a CSV, entities that are not Transitions no longer have data entered in the “SOURCE” and “TARGET” columns.

**Removed data from “PATH” column for Transitions**

When exporting Model content as a CSV, Transitions no longer have data entered in the “PATH” column.

### Administration

**Force password change when resetting password**

When resetting user passwords, administrators now have the option to force users to change their password upon next login.

**Ability to Download Monthly Usage Stats via Admin Page**

On-prem Solidatus administrators will now receive a monthly banner message to download usage statistics. This can be done in the Statistics tab of the Admin page, where there is also an “Email Solidatus” button to share the results in one click.

## Bug Fixes

### User Interface

**Fixed hidden property name and tabs**

Scrolling has been improved when editing a property with a long property value.

**Fixed “Expand filtered or focussed entities” option**

The “Expand filtered or focused entities” option now applies any enabled filters.

**Improved look of action buttons**

The look and shadowing on sidebar, Activities, and Admin buttons has been fixed.

**Fixed UI of Edit Group Dialogue Box**

The proportionality of the Edit Group dialog window has been fixed and the size has been increased.

**Fixed text appearance in the Queries Manager**

Fixed the appearance of fuzzy text in the Queries Manager.

**Fixed text appearance in Property Manager**

Text for properties with long names no longer overlaps in the Property Manager.

**Fixed proportionality of the Queries Manager**

When resizing the Queries Manager, the proportionality of buttons in the dialog remains fixed.

**Improved Relationship Label size**

Long relationship labels are now truncated in the Reference Model Panel.

**Fixed the “Format Query” Button for Grid Reports**

The “Format Query” button in the Grid Reports dialog window has been fixed.

**Fixed the UI of the Permissions section**

The search bar, adding users/groups field, and error messages in the Permissions section have been fixed.

### Other

**Fixed display rules that generate highlight color from a property**

Deleting a property used in a display rule to generate highlight color no longer impacts the display rule.

**Fixed SOL export for nested reference relationships**

SOL Exports now include nested Reference Models (Reference Models referenced by other Reference Models).

**Fixed automatic pull request creation for Forks**

When “Automatically create pull requests” is selected on a Fork, importing Model updates from the parent model generates a pull request.

**Fixed “Create Model from Layer ” for Reference Models**

Creating a Model from a Layer in a Reference Model now creates a new Reference Model instead of a Lineage Model.

**Fixed “Entities relating to this term” section when relationship is to a Transition**

The load time has been fixed for the “Entities relating to this Term” section in the Model Overview when Reference Terms are related to Transitions.

**Fixed changes to the highlight color of Modules**

Changes to the highlight color of modules in the Queries Manager can now be saved.

**Fixed the “Expand All” button in the Reference Model Panel**

The “Expand All” button next to a Reference Model in the Reference Model Panel now expands all contents.

**Fixed Deleted User permissions**

Deleted users no longer appear as members of Groups or owners of Models.

**Fixed expansion of Objects at the bottom of Viewer**

Fixed the ability to increase the size of the Model Viewer window to expand objects at the bottom of a Model.

**Fixed SOL file imports for Author and Read-only licences**

Fixed the ability to import a SOL file when a user has been assigned both Read-only and Author licences.
