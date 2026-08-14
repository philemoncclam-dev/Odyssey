# Solidatus version 3

## 3.3.8 - 21st May 2020

* Can now filter multiple tags in the model list
* Various bug fixes
* Admin

> - Updates to LDAP integration

## 3.3.7 - 7th April 2020

* Minor release

## 3.3.6 - 6th April 2020

* Various bug fixes

## 3.3.5 - 25th March 2020

* Queries
  * Users can now export and import filters and display rules!
  * Split query list and query editor onto different pages to improve usability
  * Restored query description field
  * Improved rendering/sizing of display rule tags and long entity names
  * Add on/off indicators to display rules menu
* Importing
  * Remember data entered into import textarea when pressing back in the importing wizard
  * Add option to overwrite/delete properties which are being imported
* Users can now collapse/expand sections (e.g. groups) on the model list page
* More caching to speed up model loading
* Improved clickability of ports when creating transitions
* Improved mobile rendering of blue intro slides
* Prevent redundant dotted arrows being rendered
* Fix inconsistent behaviour when importing transitions from other models
* Fix copy & paste error
* Various other bug fixes and usability enhancements
* SPARQL integration
  * Automatically run SPARQL imports for all read-only models which have saved queries (previously was only on sharing links)
  * Fix missing SPARQL execution statistics
* Admin

  > * User creation time added to admin stats model
  > * Improve licence counter reporting
  > * Update to .NET Core 3.1

## 3.3.4 - 21st January 2020

* Minor bug fixes and performance improvements
* Server
  * Database schema migration
  * Content Security Policy tweaks

## 3.3.3 - 21st January 2020

* Importing performance improvements
* Various minor bug fixes
* Server
  * Improved startup
  * Improved behaviour when behind a reverse HTTP proxy
  * Improved SAML functionality

## 3.3.2 - 9th January 2020

* Minor bug fixes and performance improvements

## 3.3.0 - 3rd January 2020

* Importing
  * Importing wizard has been restyled
  * Can now import just a subset of a model into another
  * New customisation options when importing a file (e.g. import by property)
  * Updated preview page to show counts of added or modified entities
* Automapper
  * Improvements to automapping nested XML structures
  * Ability to create one-to-many and many-to-many mappings in automapper
* Trace
  * Transitions outside of filtered trace are now not shown
* API
  * New token capabilities for forking and sharing models
  * Existing tokens will not be able to fork or share models and will need to be recreated to do so
  * Updated endpoint for updating model name and description
* Misc
  * Able to edit model name and description within the model viewer
  * Create display rule from search bar
  * Various performance improvements
  * Various bug fixes
  * Option to display count of transitions on entities

## 3.2.0 - 24th September 2019

Highlights in Solidatus 3.2.0 include a redesigned rules/filters engine with many enhancements and improvements.

**Enhancements**

* Rules engine
  * Filters and display rules have been upgraded and replaced with a queries dialog for managing all queries
  * Improved toolbar menus for display rules and filters
  * Syntax highlighting and code folding in rules editor
  * Additional display rule options to change position of tags and choose colour based on a property value
  * Generate display rules directly from properties panel
  * Button to turn all display rules on/off
  * New emoji picker for tag display rules
  * Search for text in properties using the search bar
  * Can query on property keys & values with new $properties keyword
* Trace
  * Make trace flow through children entities
  * Source and target sidebar sections now show all transitions
* Right-click menu
  * Can now extract and re-import part of a model
  * New option to delete all transitions between selected entities
* Performance improvements
* API
  * New ReplaceTransitions API command to remove and replace all
* Misc
  * Clicking on the model name in the model list now opens the model viewer directly
  * Addition help slides on first time use of some pages
  * Group membership can be made private by group admins (group members will not be visible to other members)
  * Show total number of descendent entities in object/group header
  * Model description now viewable from the model viewer when set
  * New dialog to view metadata changes while diffing

*Some features in this release were also included in versions 3.1.12 and 3.1.13 below*

## 3.1.13 - 23rd August 2019

Version 3.1.13 improved upon the recently rewritten rules engine, as well as providing a number of other improvements and bug fixes.

**Enhancements**

* Now possible to use property-defined colouring for most display rule types
* Add emoji picker for tag display rules
* Can now search all property values from search bar
* Can query on property keys & values with new $properties keyword
* Clicking on the model name in the model list now opens the viewer

**Bug fixes**

* Fix draft being deleted when updating model imports
* Various bug fixes and performance improvements related to display rules and filters

## 3.1.12 - 1st August 2019

Version 3.1.12 introduces a rewritten rules backend, to facilitate further improvements to collaboration and sharing of rules and filters in the future.

**Enhancements**

* Improved toolbar menus for display rules and filters
* Queries manager for managing all your filters and display rules
* Create property display rules quickly from the sidebar
* Added new blue slides for model browser and read-only users
* Group membership can now be made private
* Model description now viewable from the model viewer
* New dialog to view metadata changes while diffing

**Bug fixes**

* Fix some bugs related to transitions
* Various fixes related to filters and display rules

## 3.1.11 - 16th July 2019

Version 3.1.11 introduces a redesigned registration page, as well as other incremental changes since version 3.1.10

**Enhancements**

* Improved registration page and process
* Solidatus JSON import now allows object and group transitions
* Help overlay can now be accessed from button in bottom left of viewer

**Bug fixes**

* Fix indentation of nested groups
* Fix long names of grid reports not wrapping correctly
* Improved error messages
* Various performance improvements

## 3.1.10 - 3rd July 2019

Version 3.1.10 contains incremental changes applied since version 3.1.9

**Enhancements**

* API users can now use match by path when using ReplaceModel or ReplaceEntity
* Improved registration process
* Updated some branding options

## 3.1.9 - 28th June 2019

Version 3.1.9 contains incremental changes applied since version 3.1.8

**Enhancements**

* Can now pick a view to apply when a link share is visited
* Link shares can now be opened in the graph view
* Expand all now only expands visible layers, objects and groups
* Users will now be warned when using outdated browsers

**Bug fixes**

* Fix error merging the draft
* Fix automap not detecting some transitions

## 3.1.8 - 17th June 2019

Version 3.1.8 contains incremental changes applied since version 3.1.7

**Enhancements**

* Performance improvements when saving models

**Bug fixes**

* Fix unable to open Graph Explorer on read-only links
* Fix tags on deleted models still shown in model browser tag list
* Sidebar now collapsed by default on small screens (e.g. mobile)
* Various minor bug fixes

## 3.1.7 - 4th June 2019

Version 3.1.7 introduces the ability to add Object -> Object and Group -> Group transitions through the Solidatus UI (previously only possible through the API). It also contains other incremental changes applied since version 3.1.6

**Enhancements**

* Can now add Object -> Object and Group -> Group transitions through the UI
* Improved automap by path algorithm
* Improved performance when many filters are active
* Improved performance for many Solidatus API calls
* Improved UI for generating API tokens

**Bug fixes**

* Fix “Add transitions to selection” option on right-click menu
* Various minor bug fixes

## 3.1.6 - 15th May 2019

Version 3.1.6 contains incremental changes applied since version 3.1.5

**Enhancements**

* Improve handling of out-of-sync models
* Returning changeset on model update through API now optional for improved performance
* Importing of large files is now quicker
* Models can now be tagged when created
* Various performance improvements

**Bug fixes**

* Fixed some cases where scrollbar was incorrectly positioned
* Various minor bug fixes

## 3.1.5 - 17th April 2019

Version 3.1.5 contains incremental changes applied since version 3.1.4

**Enhancements**

* Updated Swagger API docs to better support auto-generating clients
* New trace section providing greater control and intersection trace
* Improve sidebar information for search results
* Various performance improvements
* New admin permissions system

**Bug fixes**

* Various minor bug fixes
* Fix auto-loading SPARQL link shares not working with aliased endpoints

## 3.1.4 - 28th March 2019

Version 3.1.4 contains incremental changes applied since version 3.1.3

**Enhancements**

* New warning when a model is edited outside of the current browser window and so is out of sync
* Can now diff/compare any two models (access this from the actions menu on a model homepage)

**Bug fixes**

* Fixed error when undoing some actions
* Fixed problem where importing a model would display incorrect transitions
* Fixed a bug where the create model API route failed when no request body was provided
* Fixed a UI bug when renaming newly added entities
* Cancel merge when diffing a draft no longer deletes the draft
* Modify model loading logic for better server performance

## 3.1.3 - 14th March 2019

Version 3.1.3 contains incremental changes applied since version 3.1.2

**Enhancements**

* Tabular importer now uses formatted values for cells in excel spreadsheets where appropriate (e.g. dates)

**Bug fixes**

* Fixed layers not displayed when model loaded in some situations
* UI tweaks

## 3.1.2 - 27th February 2019

Version 3.1.2 includes incremental changes and bugfixes applied since version 3.1.0

**Enhancements**

* SQL Importer now imports tables from CREATE\_TABLE statements as objects instead of layers
* Improved centered layout in the viewer, which no longer needs beta viewer to be active
* Removed beta viewer and scroll to zoom options from user settings page

**Bug fixes**

* UI tweaks
* Fixed inability to import very large models
* Fixed some cases where saving models failed
* Fixed error removing property matched by a link display rule
* Fixed error redoing add attribute (convert to group)
* Fixed updating model imports not showing any changes
* Fixed bad handling of user-defined IDs when sending commands to the API
* Fixed left/right scrolling sometimes not selecting the correct entity
* Fixed link shares always loading current model view state rather than saved version
* Fixed sometimes unable to create new display rules

## 3.1.0 - 14th February 2019

These release notes for version 3.1 contain many of the incremental changes which have been applied during the past month since the release of 3.0.0.

**Enhancements**

* Copy/Paste: more flexibility of where entities can be pasted (they are automatically converted to objects/groups/layers where necessary)
* Documentation: New documentation engine which enables an easier to use layout and better searchability
* Enabled GZIP compression for API requests
* Improved information about when a model was last saved in the sidebar
* All entities now show whether they were imported from another model (not just objects)
* Implement a more optimal diffing algorithm for detecting reshuffling of attributes
* Deployment:
  * Improve safeguards around the upgrade procedure
* Performance:
  * Significant performance improvement when rendering very large models (upwards of 100,000 entities)
  * Transitions are now more sensibly hidden when there are thousands on screen
  * Improve page load times in some scenarios by lazy loading some dependencies
  * Improved expand/collapse all speed
  * Improved API performance when updating models
* Added more documentation about properties and the property manager

**Bug fixes**

* CSV exporting tweaks
* UI tweaks
* Restore missing clear button from entity search bar
* Fixed inability to cleanly cancel merging of a draft
* Fixed inability to save a model with more than 32 levels of children
* Fixed error when importing Informatica mappings
* Fixed error when importing sample JSON files
* Fixed rendering artefacts where arrows were not correctly joining up with their sources/targets
* Fixed query formatter in the advanced query editor
* Fixed loading indicator being incorrectly sized on groups when expanding them
* Fixed the intro/guide slides not scaling to fullscreen properly
* Fixed position of some of the toolbar popout menus when opened
* Fixed property value suggestions not being displayed in the query builder
* Better error message reporting
* Minor improvements to automapper when mapping by path
* Copy/Paste:
  * Fixed errors when undoing and redoing copy and paste operations
  * Fixed inability to copy very large objects to the clipboard
* Views:
  * Fixed collapsed layers not being respected in views when loading model
  * Fixed views not being correctly upgraded as part of the 3.0.0 release
  * Fix views sometimes not fully applying
* Performance:
  * Fixed very slow selection of large objects
  * Fixed cutting large objects from being very slow
  * Fixed very slow rendering in large models
* Trace:
  * Fixed trace not correctly updating when new transitions are added

## 3.0.0 - 14th January 2019

This update includes improvements under the hood. The changes are mainly focussed around the new public API and so you shouldn’t notice any huge changes in day-to-day use initially.

The development team have been working solidly on this update which has some very necessary improvements to the Solidatus core and will allow us to push the boundaries in 2019 in terms of integrations, automation and scale.

The main changes you will see include:

* A cosmetic update to the loading and login screens.
* An interface update to the model comparison (diff) view.
* An “upgrade model” button or screen. When accessing your models for the first time after this update, Solidatus needs to do a little work to upgrade the models storage format and so we may ask you to click a button to confirm this on some workflows. Your model history will continue to work and so this amounts to no real change in functionality.
* Attributes now automatically change to groups when child attributes are added to them (there is no difference between an attribute and an empty group).

If you come across any issues or see something which isn’t quite right, please let us know at [support@solidatus.com](mailto:support%40solidatus.com).
