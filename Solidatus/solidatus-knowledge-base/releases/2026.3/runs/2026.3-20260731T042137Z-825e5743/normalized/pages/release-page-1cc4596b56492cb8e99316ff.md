# Solidatus 5.4.1

Solidatus release 5.4.1 introduces early access to Search and Dashboards functionality. It also includes other minor improvements and bug fixes.

## Search

We have launched a new search feature which enables you to find data elements, data flows and properties using a store front-style filtering.

You can fine-tune your search results with dynamic filters. These let you find the models you need to understand and navigate your world.

## Dashboards

Dashboards show aggregated statistics as graphs and numbers. You decide what matters to you by defining the metrics you are interested in. There is no limit to the number of metrics you can define. Use them to shine a light on pain points and data mess.

The new analytics capabilities count metadata items and their properties across your entire Solidatus environment (access controls permitting!) and display them in colourful and meaningful charts.

Discover how your metadata conforms to internal standards and uncover cross-model statistics:

* how many applications there are in each sector of your business
* the percentage of applications that have been scanned by connectors and are included in the enterprise view
* how many objects have been scanned by connectors vs manually
* how many Critical Data Elements you have

## Other Changes

**CSV export preview**

If you select a **custom** CSV export, you can now see a preview of the output. See [Export to CSV (Spreadsheet)](/models/explore-and-analyse-models/export-model-content/export-to-csv-spreadsheet).

**Show number of unsync’d changes in model list**

If there are changes in a Fork that have not yet been submitted as a Pull Request, a number is added to the Fork icon next to the Model name in the Model Browser. The number tells you how many Revisions have been made to the Fork since the most recent Pull request was submitted.

**Minor UI changes in approvals workflow**

Previously, when an Activity was rejected by an Approver, whether or not the Activity state changed to *Changes requested* would depend on whether the Activity had still received the required minimum number of Approvals. This behaviour has been changed - if **any** approver rejects an Activity, the Activity state will always change to *Changes requested*.

**The old Model Browser has been removed**

The original Solidatus Model Browser was replaced by a new Browser in release 4.5; you were able to switch between the original and the ‘new’ Browser using icons at the top of the Browser screen.

The original Browser has now been completely removed.

**Filtering search results**

The search bar in the Model Viewer allows you to search for content in your Model. Solidatus automatically highlights Entities that match your search condition, but does not automatically filter the Model to make those matches really obvious.

There are two new query language predicates that you can use to create your own filter. See Filtering search results.

**New type of tag for Display Rules**

A new type of tag is available for Display Rules - the [Property Formula tag](/models/explore-and-analyse-models/filters-and-display-rules#property-formula-tags). This is a useful alternative to creating persistent [Formula properties](/models/understand-solidatus-models/understand-properties/property-types#formula-property-type).
