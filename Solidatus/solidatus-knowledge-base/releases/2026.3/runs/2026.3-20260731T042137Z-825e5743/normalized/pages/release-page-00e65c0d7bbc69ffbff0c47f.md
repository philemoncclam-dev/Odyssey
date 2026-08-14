# Solidatus version 5

This page includes a summary of changes per release. For more detailed information, click a link in the table below or at the foot of each summary.

| [5.6 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.6-release-notes)     | [5.6.8 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.6.8-release-notes) |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [5.4.1 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.4.1-release-notes) | [5.5 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.5-release-notes)     |
| [5.2 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.2-release-notes)     | [5.3 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.3-release-notes)     |
| [5.1 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.1-release-notes)     | [5.1.1 Release Notes](/release-notes/release-notes-main/solidatus-v5-change-summary/5.1.1-release-notes) |

## 5.6.8 - September 2023

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.6.8-release-notes) to read the full release notes.

## 5.6 - July 2023

This is a maintenance update with some usability improvements and bug fixes.

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.6-release-notes) to read the full release notes.

## 5.5 - March 2023

Solidatus 5.5 brings a new look and feel to the application as well as new Webhooks functionality that can be used to integrate Solidatus into other applications’ APIs.

This release also includes a number of bug fixes, performance improvements, and enhancements. Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.5-release-notes) to read the full release notes!

## 5.4.1 - December 2022

#### Search

We have launched a new search feature which enables you to find data elements, data flows and properties using a store front-style filtering.

You can fine-tune your search results with dynamic filters. These let you find the models you need to understand and navigate your world.

#### Dashboards

Dashboards show aggregated statistics as graphs and numbers. You decide what matters to you by defining the metrics you are interested in. There is no limit to the number of metrics you can define. Use them to shine a light on pain points and data mess.

The new analytics capabilities count metadata items and their properties across your entire Solidatus environment (access controls permitting!) and display them in colourful and meaningful charts.

Discover how your metadata conforms to internal standards and uncover cross-model statistics:

* how many applications there are in each sector of your business
* the percentage of applications that have been scanned by connectors and are included in the enterprise view
* how many objects have been scanned by connectors vs manually
* how many Critical Data Elements you have

This release also includes a number of bug fixes, performance improvements, and enhancements. Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.4.1-release-notes) to read the full release notes!

## 5.3 - June 2022

This is a maintenance update with some minor improvements.

* New context menu option to select all descendants of an Entity
* In the Property Manager, imported properties are shown separately from local properties of the same name
* Now two options for saving a view, allowing you to update basic information about the View (such as the name) without changing the View’s configuration settings
* CSV export options now have explanatory tooltips
* Change to what happens when attempting to import a Model into a restricted area in a Task Model
* Model import dialogue now shows Models that have already been imported even if the current user doesn’t have access to them
* New model setting for Forks, to automatically create Pull Requests when saving a Fork
* An Admin user can access a list of Service Accounts
* Can no longer save a Model draft if a property name includes one or more new lines

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.3-release-notes) to read the full release notes!

## 5.2 - March 2022

Solidatus release 5.2 provides increased governance capabilities for Entity properties, introducing eight distinct property types, each of which has its own validation rules and visualisation. The query language has been enhanced to enable Display Rules and Filters to assess the validity of properties.

Assigning property types helps users to enter data more quickly and easily in a standardised way to improve metadata quality, reducing the probability of errors and omissions.

Solidatus can infer the appropriate property type for a property from the existing values.

The *Properties* and *Relationships* panels in the Sidebar have been merged, and provide new capabilities for creating and editing relationships, as well as providing access to the Term itself and the usage features that the Reference Model tab provides.

Also, the Activity Settings page has been redesigned, and commit messages supplied when merging an Activity are also recorded as Activity comments.

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.2-release-notes) to read the full release notes!

## 5.1.1 - March 2022

* Can now provide Approval / Rejection messages via Model Overview
* New API Commands

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.1.1-release-notes) to read the full release notes!

## 5.1 - January 2022

This is a maintenance update with some minor improvements.

**Visibility of Tasks on the Group Overview**

Allows you to see the Tasks shared with the group.

**Additional filters for My Activities**

Allows you to focus on Activities within Models that have been shared with you or with Groups you’re a member of, and on Activities in Models that you own.

Click [here](/release-notes/release-notes-main/solidatus-v5-change-summary/5.1-release-notes) to read the full release notes!

## 5.0 - November 2021

Solidatus release 5 makes your metadata accessible more quickly and more easily, with more control over how and when it is discovered, making metadata management more productive, more automated, and more reliable.

**Connectors**

The Solidatus discovery capabilities have been combined into a coherent automation framework, enabling Connectors to be developed and deployed in an agile strategy, suiting complex technology landscapes, providing centralised control and decentralised execution of metadata discovery, reducing the potential for human error or delay.

The framework is supported by the new [service accounts](/connectors/connectors-overview/service-accounts), synthetic accounts which have permissions and roles like any other user, but do not represent a real person. Ideally, people run Connector Jobs through the user interface, while service accounts are responsible for the results.

With the introduction of [agents](/connectors/connectors-overview/agents) and [jobs](/connectors/connectors-overview/jobs) you can configure, run, and monitor Connectors using the Solidatus user interface.

**Approval Process & Auto-Merge**

We have added a more formal [approval process](/models/share-and-collaborate/approvals-workflow) to our Activities functionality so that we can track and discuss approvals, support “multiple pairs of eyes” approvals and delegate approval duties to users who may not be authors on the Model. This boosts our workflow capabilities and simplifies large-team collaboration.

Activities can be [automatically merged](/models/share-and-collaborate/activities-and-activity-types/auto-merge) (after Approvals, if required) so users don’t have to manually merge changes in through multiple hops (e.g., propagating changes through a Fork of a Fork, which imports a Fork of a different Model… and so on…).

Click [here](#id-5.0-november-2021) to read the full release notes!
