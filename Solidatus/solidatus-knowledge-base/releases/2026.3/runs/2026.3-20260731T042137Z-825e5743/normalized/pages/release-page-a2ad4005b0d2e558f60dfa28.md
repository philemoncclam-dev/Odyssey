# Solidatus version 4

This page includes a summary of changes per release. For more detailed information, click a link in the table below or at the foot of each summary.

| [4.4 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.4-release-notes) | [4.5 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.5-release-notes) |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [4.2 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.2-release-notes) | [4.3 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.3-release-notes) |
| [4.0 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.0-release-notes) | [4.1 Release Notes](/release-notes/release-notes-main/solidatus-v4-change-summary/4.1-release-notes) |

## 4.5 - July 2021

With release 4.5, Solidatus streamlines our collaboration capabilities by introducing the Practitioner licence, creating a new class of users who can view models like everyone else can, and participate in model development at the request of other users, via [Tasks](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/models/share-and-collaborate/activities-and-activity-types/tasks.md).

Continuing with the collaboration theme, you now have more control over the scope of a Task you create. If you want to ask someone to review all the attributes in your model, with or without the ability to create new ones, now you can.

To help everyone keep track of their workload we’ve introduced the [My Activities](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/resources/the-user-interface/models-ui/activities-interface.md#the-my-activities-list) page, where you can see the status of everything you’re personally involved with. The new page will be familiar to you already, as it works in the same way as the Activities tab in the [Model Overview](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/resources/the-user-interface/models-ui/model-overview.md), offering mostly the same functionality and allowing click-through to the detail page for an activity.

Model tags are a great way to categorise your own models - as well using your own private tags, you can now use tags [that are shared](/the-user-interface/models-ui/model-tags) across the organisation.

Lastly, but by no means least, we have introduced a new, improved, [Model Browser](/the-user-interface/models-ui/model-browser). If you prefer the old model browser don’t worry, it’s still available.

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.5-release-notes) to read the full release notes!

## 4.4 - May 2021

Solidatus 4.4 is an important release, further boosting our collaboration capabilities with a streamlined workflow for managing collaboration among users, facilitating effective development of models. Solidatus also allows any user with visibility of the model to start a discussion about the model, ask a question, or just make a comment.

The Model Overview now contains an [Activities](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/models/share-and-collaborate/activities-and-activity-types/activities.md) tab, which provides a single location for managing discussions and up-and-coming model changes, such as changes made to an imported model or the parent model for a Fork, or changes submitted via a Task or a Fork. Users who only have *Viewer* access to a model can contribute to the discussion.

We have also simplified the process for cloning a model and enabled the creation of a model fork or clone containing only selected content.

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.4-release-notes) to read the full release notes!

## 4.3 - April 2021

This is a maintenance update with some minor improvements.

* Improve entity selection interface when importing entities from large models into other models
* Prevent large saves from failing in the browser in some environments
* Various bug fixes and stability improvements
* Various smaller usability improvements

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.3-release-notes) to read the full release notes!

## 4.2 - March 2021

**Version Control and Model Roles**

* Model roles can be assigned to multiple users and/or groups
* A model can now be edited by two (or more) users simultaneously
* “Drafts” system has been revamped

**Model Overview**

The Model Overview has been given a makeover, splitting the content onto separate tabs

**Documentation**

Enhanced content has been created

**Query Language**

A new property is available, providing access to a list of currently selected objects

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.2-release-notes) to read the full release notes!

## 4.1 - 20th January 2021

**Features**

* Query modules
  * Queries can now be organised into modules for better organisation
  * Query modules can be shared across multiple models and with other users
  * Queries in query modules can be updated and these changes propagated across the models which use them
  * Queries can be now be administered through a new API
  * This could be used to provide a library of standard or example queries to users
* Query autocomplete – Get query suggestions when typing your query
* The query language has been extended with additional special properties for writing queries about traces and transitions of entities; finding entities which are imported from other models; and when querying based on reference model relationships
* Visualise entity connectivity on the model entity page
* When viewing a reference model in the model editor, you can now see incoming relationships from other models in the relationships sidebar section
* You can now detach a fork from a parent. This can be useful when using forking to clone a model and you do not want to synchronise changes between the fork and parent model

**Bug fixes and improvements**

* Resolve issue where trace traversal was not symmetric when traversing outgoing vs incoming flows. There is now an option in the trace section of the sidebar to toggle whether the parent/child hierarchy is travers when building a trace for use with the show trace and focus trace tools
* Improvements to the Collibra connector
* Various bug fixes and other minor enhancements

**Administration**

* You can now further secure your account using two factor authentication. You will need a TOTP authenticator app on your mobile device, e.g. Microsoft Authenticator or Google Authenticator (both available in the app stores)
* There is now an Event Viewer in the Admin area for browsing users’ actions for auditability and debugging

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.1-release-notes) to read the full release notes!

## 4.0.9 - 6th November 2020

**Bug fixes and improvements**

* All dialogs should now close when escape key pressed
* Deleting large entities from a model is now quicker
* Improved feedback when importing/auto-importing SPARQL
* Fixed bug causing trace depth to be incorrectly limited when a view is applied
* Fixed various bugs related to model importing
* Various issues fixed related to diff sidebar section
* Various minor UI improvements
* Improved admin workflow for inviting multiple users

## 4.0.8 - 16th October 2020

**Features**

* A new notes section is now available in the sidebar for storing and sharing notes about the model with other users

**Bug fixes and improvements**

* Various bug fixes in the property manager
* Improved detection of the correct column separator in tabular imported CSV files
* Deleting a fork will now auto-delete unmerged pull requests from that fork
* Improved notification when the highlighted trace depth is reduced for performance reasons on large models
* Spanning arrow maximum length limit has been removed on small models
* Improved user experience when importing a large .SOL file
* Improved performance when loading models through the API
* Various minor bug fixes

**Administration**

* Improved functionality for inviting multiple users at once

## 4.0.7 - 30th September 2020

* Load model API endpoints now support the MessagePack format. This is enabled by using the Accept header when making the request
* Users will now be warned when they try to delete a forked model which has either forks or open pull requests
* Improve performance of the “Delete layer (preserve transitions)” operation on large models
* Option to hide spanning/dotted arrows when a layer is collapsed
* Export property keys/values moved to property manager (instead of CSV exporter)
* Various usability enhancements
* Fixed large models failing to load in some browsers
* Various minor bug fixes

## 4.0.6 - 14th September 2020

* Properties are now sortable from the property manager
* Various bug fixes and usability enhancements

## 4.0.5 - 27th August 2020

**Features**

* New Model Overview page has been fully released
* Properties are now grouped by path (/); controllable from the property sidebar section
* Properties for the current selection are now searchable in the sidebar
* Prevent other users from forking models in the model settings
* See which models have pending changes (unmerged Pull Requests, Import updates etc)

**Bug fixes and improvements**

* isSelected predicate for the query language
* Updating model imports preserves layer order for new layers
* Fix SPARQL bug when non-URI entities are imported
* Can now unimport a model which only imported transitions
* Resolved some diffing and merging issues
* Various other minor improvements

**Admin**

* Fix some issues with statistics generation

## 4.0.4 - 17th August 2020

**Features**

* View properties of related glossary terms in a model
* Manage group models from the Group Overview

**Bug fixes and improvements**

* SPARQL importing now supports group and object level transitions
* Fix moving of imported layers
* Fix some causes of models failing to open
* Forks and parents should no longer be constantly out-of-sync
* Various other minor improvements

**Admin**

* UI to manage group membership from admin area
* View and manage all groups
* Generate user invite links

## 4.0.3 - 23rd July 2020

**Features**

* Diff between any two revisions (not just compare with current)
* Suggest aggregation properties when starting property with *=* character

**Bug fixes and improvements**

* Performance improvements for large models
* Fix cut-off colour picker when creating display rules
* Prevent property values with square brackets being incorrectly rendered as links
* Layer headers not highlighting correctly in search result
* Branches and forks are clickable in the Model Overview
* Fix transitions sometimes not loading from imported models
* Various other minor improvements

**Admin**

* Config option to prevent password reuse
* Config option to force password reset after number of days
* Config options to set password complexity rules
* New option to set number of forwarded originating IP headers to use when running behind HTTP proxy
* Additional logging during startup
* Improved user management APIs
* Don’t require migration confirmation for first-time startup

## 4.0.2 - 26th June 2020

* Various bug fixes, tweaks and enhancements building on the 4.0.0 release
* New and refreshed interface on the Group Overview
* Enhanced group permissions configurability with new roles assignable to members ([Read more](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/models/share-and-collaborate/groups.md))
  * *Group Admin* - Admins can invite members to the group and change group settings
  * *Group Approver* - If the group has is set to require approval before a model is accepted, when a user publishes a model to the group, it will need accepting by an approver before being visible to a viewer
  * *Group Viewer* - Viewers can view a model if it is published (and approved) into the group
  * *Group Publisher* - Publishers can publish a model to the group (ready for approval if required)
* Admin
  * New admin APIs for user and group management

## 4.0.0 - 23rd May 2020

After many months of development, we are pleased to announce the general availability of Solidatus version 4.0.0. The Data Catalog functionality introduces a new type of model which can be used as references by other lineage models. These new reference models define data dictionaries, business glossaries, asset inventories and other taxonomies. Physical entities in lineage models can refer to one or many terms in these references.

This release includes new functionality, interface enhancements and performance improvements.

Highlights include:

* **Business glossary and data dictionary** - Define glossaries and relate terms to Solidatus entities
* **Model catalogue** - Browse Solidatus models and their entities
* **Property maths** - Embed mathematical aggregations in properties and display rules
* **Lineage explorer** - Selective (filtered) visualisation of a model
* **Property view** - View a model through the lens of a property
* **Customisable sidebar** - Multiple sidebars, reorderable, site-wide settings

We look forward to building on this and enhancing each of the features in the coming months.

Click [here](/release-notes/release-notes-main/solidatus-v4-change-summary/4.0-release-notes) to read the full release notes!
