# Solidatus version 2

## 2.2.208 - 14th December 2018

* Arbitrary JSON files can be imported into a model (file structure is converted to an object)

## 2.2.207 - 13th December 2018

* Add number of views label to views button in toolbar

## 2.2.206 - 11th December 2018

* Fix icons not being loaded for some users in Internet Explorer
* Fix unable to modify colours for certain display rules
* Add more loading indicators where appropriate
* Update styling to ensure cross-browser consistency

## 2.2.205 - 30th November 2018

* Significantly improve performance of SPARQL importer

## 2.2.203 - 9th November 2018

* Improved appearance of graph explorer
* IE11 styling updates
* Fixed bug preventing searching for untagged models
* Fixed bug on bug reporting page
* Fixed some cases of tabular importing failing

## 2.2.202 - 18th October 2018

* Improved styling of search bar in graph explorer
* Fixed bug related to default graphs when using SPARQL graph explorer

## 2.2.201 - 15th October 2018

* It is now possible to import groups using paths in a spreadsheet
* Fixed bug related to sharing tasks

## 2.2.200 - 11th October 2018

* The Excel templates for importing have been updated - find them in the Help tab of the Import (Tabular) dialog.
  * import-simple.xlsx
  * import-nested.xlsx
* Various bug fixes.

## 2.2.198 - 28th September 2018

**Enhancements**

* New tree layout options in the graph explorer, including top -> bottom and left -> right.
* Anonymous users can now open a link share in the graph explorer.
* Drag-and-drop grid report columns to reorder them.
* Show Solidatus metadata in new Model Info dialog to aid in crafting API requests.
* Improvements to the visuals in the graph explorer.
* Graph explorer now uses a different property to denote types of nodes (Attribute, Group etc) to avoid conflicts with Type properties.
* Added more documentation.

**Bug fixes**

* Dialogs no longer get extra space by the scrollbar when resized on macOS.
* Fix importing transitions where source or target have a comma.
* Fix graph explorer sidebar not working when using SPARQL endpoint with authorization.
* Fix query timings not shown in saved SPARQL dialog when importing and updating model.
* Close saved SPARQL dialog when clicking Save Queries.
* More useful error messages in the saved SPARQL dialog.
* Fix transition endpoint rendering artefact when diffing a model.
* Deleting an attribute with a self-transition then undoing now works.
* Admin: Fix javascript errors not logged to server.

## 2.2.197 - 20th August 2018

**Enhancements**

* The new model list design has exited beta testing and is now enabled for all users.
* Export all properties with their values to a CSV file.
* Sharing links can now have a maximum number of views set so they will expire after a configured number of views.
* Ability to create a new model from the current selection in the model viewer (access from right click menu)
* Added/Updated documentation.
* Admin: Can now set a site-wide max expiry time and/or number of views for link shares.
* Admin: Additional SSO functionality.

**Bug fixes**

* Fix error when trying to save copy of read-only model on a sharing link.
* Fix copy sharing link to clipboard button not working.
* Fix graph explorer not loading when opened from a model in some situations.
* Improve graph explorer style in IE.
* Can now tabular import transitions where source/target name contains a comma.
* Fix EULA page not loading.
* Admin: Fix stack trace not shown on logs page.
* Admin: Fix logs page not loading for some configurations.

## 2.2.194 - 1st August 2018

As work progresses on the Solidatus public API beta this release contains a large number of smaller UI improvements and bug fixes, some of which are highlighted here.

**Enhancements**

* Importing multisheet Excel workbooks
  * When importing Excel workbooks with multiple sheets, all the sheets will be imported in order.
  * For example, a spreadsheet can contain objects, attributes and properties in the first sheet and then mappings in the second sheet.
* QR codes for read-only sharing links
  * To download the QR code image, click the QR code icon next to the link name in the sharing dialog.
* Improvements to the graph explorer
  * Graph explorer can now be accessed from the model viewer (click the Graph button in the navigation bar at the top of the page).
  * Can optionally preload the objects and their connectivity into the graph (select from the navigation bar).
  * Can optionally preload the current trace into the graph explorer (e.g. select an attribute, right-click and choose\`\`View trace in graph explorer\`\`\`).
  * Visualisation has been tweaked to improve readability of node labels.
* Transitions can be reversed by selecting them, right-clicking and choosing `Reverse transitions`.
* When creating a new display rule, the property key now displays property suggestions when typing.
* Added documentation page for display rules.
* Updated snippets and reference in the query builder dialog.
* Minor visual tweaks to filters and display rules in the menus to make it clearer when they are enabled or disabled.
* Solidatus version is now visible in the application (in the footer of each page).
* Admin: Added a Solidatus EULA (configurable for on-premise installations).

**Bug fixes**

* Fix poor alignment of entities when renaming in Safari
* Fix tags not being set correctly on tasks
* Fix inability to load very old models in the graph explorer
* Fix failure to load transitions sometimes when importing SPARQL in IE
* Fix styling of tasks list
* Remove old/redundant documentation
* Admin: Speed improvements for statistics model and statistics export

## 2.2.183 - 10th July 2018

Whilst work continues on the Solidatus public API beta, this maintenance release includes a selection of enhancements and bug fixes and also includes a bunch of under-the-hood refactoring to enable a faster development cycle going forward and support new features when the new public API lands.

**Enhancements**

* SPARQL: Configure auto-loading of SPARQL to sort new objects/attributes (new options in the saved SPARQL dialog)
* Copy to clipboard button next to link share URL
* See active display rules of current selection in the sidebar
* Right-click an entity and choose `Search for this` to find other entities with the same name
* More configuration when auto-mapping transitions and ability to auto-map using properties
* JSON exporter UI now exports JSON in a format suitable for importing with the ReplaceModel API command

**Bug fixes**

* Make loading indicator clearer in IE when expanding large objects
* SPARQL: Restore more helpful error messages When SPARQL queries fail
* Restore missing creation time on revision list
* Correctly merge property metadata (saved property definitions)
* Fix incorrect diff visualisation when property existed but had no value and was then changed
* Admin: Fix stats model timing out
* Admin: Fix excessively large stats exports
* Admin: When requesting access to edit a sharing link, display the configured Solidatus admin email address

## 2.2.180 - 14th June 2018

* New display rule type to show a link icon on entities, taking the link URL from a property
  * Automatic link icon for URI property now uses this display rule
* SSO improvements, SAML authentication now supported

## 2.2.175 - 29th May 2018

* Property values which are Markdown-style links will be rendered as hyperlinks in the sidebar
* Can now open link shares in the graph explorer by adding /graph to the link share link

## 2.2.173 - 16th May 2018

**Bug fixes**

* Fix `Are you sure` prompt when leaving a task after submitting
* Fix forks appearing in recent tasks list
* Fix incorrectly styled create model dialog
* Fix issue with missing attributes in some situations when opening models
* Admin
  * Fix excessive logging of HTTP liveness checks

## 2.2.168 - 8th May 2018

* Public API early access
  * A subset of Solidatus functionality is now accessible through a public API
  * Read more at the API [documentation](https://github.com/pjwsolidatus/Gitbook-test/blob/rc-gitbook-test/release-notes/solidatus-change-log/broken-reference/README.md)
* Users viewing a read-only link share can now clone the data into a new model for editing
* Fully redesigned model browser list available for adoption
  * Solidatus administrator can set new model browser as the default for all users
  * If it is not set as site-wide default users can opt-in on the account settings page
  * User can now select multiple models to bulk delete, share or tag them
* Improve how data is loaded from XML imports
* Add extra excel template with nested structure example
* Improve multiline properties display in sidebar
* Tasks can now have tags added to them
* Add loading indicator when expanding a large object or group
* Editor can copy object into another object to convert to a group
* Graph explorer
  * Delete key now hides selected node
* Administration
  * Administrator can now permanently delete users
  * Administrator can now export usage stats
  * Administrator can set new model browser as the default for all users
* Bugfixes
  * Fix link share users not able to run some SPARQL queries
  * Fix case where user could edit properties in read-only mode
  * Disable toolbar buttons which cannot be used
  * Fix tags having leading or trailing whitespace
  * Fix SPARQL queries being lost when merging models or tasks
  * Fix bug causing models list to fail to load
  * Updating model imports no longer overwrites filters or display rules
  * Fix some keyboard shortcuts not working
  * Transitions are hidden warning is less annoying
  * Minor bugfixes

## 2.1.161 - 3rd April 2018

* Add additional configuration for loading users from LDAP
* Add admin command for testing LDAP configuration
* Fix missing images in docs

## 2.1.157 - 28th March 2018

* Respect Source\_Path and Target\_Path columns properly when importing transitions from CSV/Excel
* Modernise CSV exporting - it now downloads directly on the client and so is faster
* Fix issue connecting to authenticate SPARQL endpoints with basic HTTP authentication in /graph-explorer beta viewer
* Fix long (single-lined) property values not correctly wrapping in the sidebar
* Fix issue where dialog sizes were reset when the window was resized
* Fix search results not updating when using the query builder from the search bar

## 2.1.152 - 21st March 2018

* Add more targeted error pages (e.g. when not authorised to view a model)
* Display a warning when importing tabular rows in a non-standard order which could affect the result
* Fix model’s task list not displaying any tasks
* Fix model tags not being removed from tag list when deleting a model
* Fix error when merging saved SPARQL between two models

## 2.1.151 - 16th March 2018

* Ability to view and edit multiline properties with simple text formatting
* Updated model editor splash/about screen
* Bugfixes
  * Fixed case where adding a user could cause server error
  * Fixed JavaSciprt error in IE when loading a model
  * LDAP/SSO enhancements

## 2.1.134 - 9th March 2018

* New `Grid Reports` feature
  * Grid reports are a useful way to display data stored within a model in a grid format. You can customise the columns of the report and also export a grid to a spreadsheet.
* The number of child attributes/groups is now displayed next to object and group names
* SPARQL integration changes
  * SPARQL queries can be proxied through the Solidatus server
  * (On-prem only) SPARQL aliases configurable on the Solidatus server with credentials
  * Model title can be tweaked on read-only link share using title=The%20Title in the URL
* Preview of new models list
* Performance tweaks when expanding/collapsing entities
* Display rule tags are now ordered consistently
* Query builder dialog now autocompletes property names
* Further improvements to beta graph-explorer
* Minor bug fixes

## 2.1.127 - 2nd March 2018

* Performance improvement when when rendering a visibility change (e.g. expanding all objects)
* Fix group indentation rendering bug
* Fix diff mode rendering bug

## 2.1.99 - 7th February 2018

* New documentation hub - Click `Help` in the top right of any page.
* Improved configuration and handling of saved SPARQL
  * Be able to disable individual queries
  * Be able to reorder queries
  * Show the time taken in miliseconds for each SPARQL query
* Improved performance for models with very large objects
* Minor bug fixes

## 2.1.89 - 19th December 2017

**Rendering performance update**

A very large under-the-hood rewrite of the rendering logic of Solidatus significantly improves the rendering performance of large models. This feature is already enabled and will be enhanced during the next update.

**Sidebar**

We have added a new collapsible sidebar on the right-hand-side of the model editor which displays a wealth of information while using Solidatus, including:

* Model name, number of revisions & access to previous versions
* The number of unsaved changes that have been made
* The number of active filters in place and the ability to disable them
* Contents of selection and the option to remove entities of a specific type
* Trace isolation - Ability to isolate the trace of the selection and the option to control the direction and number of hops
* A list of the source and target attributes (or objects) of the selected attribute (or object)
* Properties & access to ‘Property Manager’
* Undo/Redo log - The ability to see the history of commands executed on the model

**Customisable trace & entity isolation**

With this update comes additional flexibility when focusing the trace. After focusing a trace, you can now choose the number of hops which are displayed and in which direction to traverse the trace. For example, you can choose to see just the downstream trace for 1, 2 and 3, or you can see all hops. You could also select zero hops, which simply isolates the selection and is useful when mapping between two objects in large models.

**Smooth zooming and panning (beta)**

Significant updates to the Solidatus rendering backend bring a new zooming and scrolling interaction to the model editor. This can be enabled in user account settings by selection the ‘beta viewer’ option.

To move around the model:

* Click and drag to pan around the model
* Use the scroll wheel to zoom in and out
* Use the reset button on the toolbar to get back to the start position
* Use the keyboard shortcut `ctrl + shift + o` to zoom and centre the model into the view

**Centred model alignment (beta)**

Instead of aligning objects to the top of the screen, it is now possible to centre align them. This can be enabled in user account settings by selection the beta viewer option and centre alignment option.

**RDF importer**

You can now import Solidatus object and attributes from triples in RDF XML and Turtle files.

**Other enhancements**

* Single sign-on with LDAP and secure HTTP for on-premise installations
* Bug fixes
