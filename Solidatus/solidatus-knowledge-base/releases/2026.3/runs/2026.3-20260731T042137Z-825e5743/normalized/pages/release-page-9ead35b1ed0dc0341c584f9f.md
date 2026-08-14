# Filters and display rules

[Filters](#filters-show-and-hide-model-content) and [Display Rules](#display-rules) change how entities that match **queries** are displayed in a model. Together, they transform models from a complex technical diagrams into a powerful tools for simplifying complexity and finding critical information easily.

In addition to affecting what entities are visible or decorating them with tags or alerts, you can add URL links, change the appearance and style of Transitions, replace technical names with business names, and more.

Here are a few examples of what you can do with Filters and Display Rules:

* Create an underlying logic that changes the colour of entities with DQ issues
* Change the colour of Transitions whose source does not have sufficient checks
* Only show entities that do not have an assigned Owner
* Decorate entities that represent Critical Data Elements
* Place a link on entities that takes you to a web resource with background information

**Filters, display rules, and queries**

The analytical power of Filters and Display Rules comes from the [Model Query Language](/models/explore-and-analyse-models/model-query-language), which allows you to match entities in a model based on precise logical conditions and characteristics.

Every Filter or Display Rule is based on an underlying query that defines the set of model entities to be affected when the Filter or Rule is switched on.

While Filters show or hide entities that match a query, Display Rules modify their appearance or add a useful tags and links to them.

**Get started**

The simplest way to create a Filter or Display Rule is to enter a search or query in the [search bar](/models/explore-and-analyse-models/search-and-query-in-a-model).

You can then use the three-dots menu on the right-hand side to create a Filter or Display Rule directly from the results.

<figure>../_images/create-filter-rule.png<figcaption></figcaption></figure>

Filters and Display Rules can be used to build a sophisticated library of use-case-specific snapshots of the data ecosystem represented in a model that we call [Views](/models/explore-and-analyse-models/views).

## Essential facts

The Model Viewer toolbar provides access to `Rules`, `Filters`, and `Views`. In the example below, there are currently three **active** Rules and four **active** Filters. There are also twelve [Views](/models/explore-and-analyse-models/views) available.

<figure><figcaption><p>Filters, Rules, and Views in the toolbar<a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/use/filters-and-rules.html#id2">¶</a></p></figcaption></figure>

***

* **Filters** allow you to hide or show Entities that match the conditions set by a query.

> `A Filter can exist without a Display Rule`
>
> Filters can be accessed and edited by clicking [Filters](#show-and-hide-with-filters) on the toolbar. To manage Filters, Rules and the underlying queries, use the [Queries Manager](#using-the-queries-manager).

***

* Adding a **Display Rule** to a Filter allows you to change the way the matching Entities are presented in the model.

> `A Display Rule can` always `be used as a Filter`
>
> Display Rules can be accessed and edited by clicking `Rules` in the toolbar. To manage Filters, Rules and the underlying queries, use the [Queries Manager](#using-the-queries-manager).

***

* A new model does not contain any Filters or Display Rules, unless it was created by a Solidatus connector that provided a default set of Filters and Display Rules in the form of a [SOLQ file](#exporting-queries-to-an-export-file).

***

* Filters and Display Rules can be used independently of each other:

> - enabling or disabling a Display Rule is not affected by the state of the associated Filter
> - showing or hiding Entities matched to a Filter does not affect any tags, etc, created by Display Rules - of course, it does affect whether or not you can actually see the Entities

***

* Filters and Display Rules only affect the display of a Model when they are **Active**. All active Filters and Display Rules are evaluated every time you change the Model. For example, changing the value of a property could result in that Entity matching the query for an active Filter, and then being hidden.

***

* Filters and Rules can be shared with other users and with other Models. See [Exporting queries to an export file](#exporting-queries-to-an-export-file) and [Importing queries from another model](#importing-queries-from-another-model).

***

* The Model Viewer toolbar provides access to Rules, Filters, and Views. In the example below, there are currently three **active** Rules and four **active** Filters. There are also twelve [Views](/models/explore-and-analyse-models/views) available.

<figure><figcaption><p>Filters and Rules on the toolbar</p></figcaption></figure>

***

* The **number of entities matched by a query** is displayed in the search bar when a query is executed, in the dialogs for creating and editing Filters and Display Rules, and in the Queries Manager when a Filter or Display Rule is switched on.

## **Create a filter or display rule**

There are several ways to open the simple dialogue for creating a filter or display rule:

* using the **Filters** or **Rules** menus in the toolbar - click `New filter` or `New display rule`
* using the three-dots menu on the [Search bar](/models/explore-and-analyse-models/search-and-query-in-a-model) - click `Create a filter from search results` or `Create a display rule from search results`
* from a [property in the Sidebar](#creating-a-filter-or-display-rule) - click the paintbrush next to a property name to create a display rule
* from the [Queries Manager](#using-the-queries-manager) - click the `Create query` button

{% hint style="success" %}
By default, all new Filters and Rules are placed in the *Unclassified* Module - to store them directly in a different Module, click the Module name in the Modules tab in the Queries Manager before you click on `Create query`
{% endhint %}

## Filters

Filters control which parts of the model are visible.

Every Filter requires a [query](/models/explore-and-analyse-models/model-query-language) that determines which entities the Filter applies to.

A query can be as simple as matching a type of Entity (e.g. `isObject()`) or a given string in an Entity name (e.g. `contains($name, 'customer')`). They can also be very complex, possibly examining the full trace for an entity.

### Show and hide with filters

When a filter is activated, the query is assessed against the current display of the model, which may result in visible Entities being hidden, or previously-hidden Entities being shown. Exactly which Entities are affected depends on the query, whether you clicked on the *Show* button or the *Hide* button, and other Filters that are currently active.

If only **one** Filter is active, this is what happens:

<table data-header-hidden><thead><tr><th width="120"></th><th></th></tr></thead><tbody><tr><td><em>Show</em></td><td>‘Show’ only the Entities that match the query conditions - everything in the model will be hidden, and then all Entities (if any) that match the query conditions will be shown. If no entities match the query conditions, everything in the model will be hidden.</td></tr><tr><td><em>Hide</em></td><td><em>Hide</em> any Entities that match the query conditions.</td></tr></tbody></table>

{% hint style="success" %}
If a higher-level entity matches the query underlying a filter, all descendant entities will be **shown** or **hidden** even if they do not match the query.

For example, if an Object matches a filter, all descendant attributes and groups will be shown or hidden when the filter is active even if they do not match.

To show only entities that match a query and not all descendants, reverse the logic of the query and set the filter to **Hide**.

For example, if the query picked out all entities that have the property “Owner”, formulate a query to pick out all entities that **do not** have the property “Owner”, and then **Hide** these entities.
{% endhint %}

Filters can be viewed and activated in the Filters menu (accessible from the toolbar) or the [Queries Manager](#using-the-queries-manager). In the example below, the Filters have been grouped into [query modules](#organising-queries-into-modules), such as “Data Quality” and “GDPR”.

<figure><figcaption><p>Filters menu</p></figcaption></figure>

| To create a new Filter, click the *New filter* button. Filters can also be created and edited in the Queries Manager dialogue.    |
| --------------------------------------------------------------------------------------------------------------------------------- |
| To activate a Filter, click on its name, the *Show* button, or the *Hide* button.                                                 |
| Toggle the state (Show or Hide) for a Filter by clicking on the Filter name (you can turn the Filter off using the *Off* button). |
| Click the pencil button to edit a Filter (and the Display Rule).                                                                  |
| Click *Edit Filters* to open the Queries Manager.                                                                                 |

{% hint style="success" %}
The order in which filters and display rules appear in the toolbar menu is determined by their order in the [Queries Manager](#using-the-queries-manager). You can drag-and-drop to rearrange them in the Queries Manager, and you can organise them into Modules, which will group them together in the toolbar menu.
{% endhint %}

### Filtering search results

The [search bar in the Model Viewer](/models/explore-and-analyse-models/search-and-query-in-a-model) allows you to search for content in your Model.

Solidatus automatically highlights Entities that match your search condition, but does not automatically filter the Model to make those matches really obvious. There are options on the search bar to create Filters and Display Rules that match your query, which is great if you really need a permanent Filter or Display Rule.

However, you often just want to tag Entities that match your search, and/or hide Entities that *don’t* match your search.

There are two query language predicates that make this possible - you just create a permanent Filter and/or Display Rule that you switch on or off when you need it.

<table data-header-hidden><thead><tr><th width="196"></th><th></th></tr></thead><tbody><tr><td><strong>isSearchResult()</strong></td><td>If an Entity is highlighted when you search, this predicate will be true</td></tr><tr><td><strong>isSearchActive()</strong></td><td>If there is any text in the search bar, this predicate is true for every Entity in the Model</td></tr></tbody></table>

There are several ways in which these two predicates can be combined, but here are the two situations where you’re most likely to need them.

> 1. **Making the search results more obvious, by adding a tag**
>
> > This requires a Display Rule with a simple query - **isSearchResult()**.

<figure><figcaption><p>Tagging search results</p></figcaption></figure>

> 2. **Hiding all Entities that do not match the search**
>
> > This requires a Filter with a slightly more complex query - to activate it you must **Show** the Filter (in the [list of Filters](#show-and-hide-with-filters) or in the [Queries manager](#using-the-queries-manager)).
> >
> > > **isSearchResult() or not isSearchActive()**
> > >
> > > (if the search bar is empty, the filter has no effect - the filter is applied as soon as you type something into the search bar)
> >
> > You can combine the Filter with a Display Rule if you want to make your search results really stand out!

<figure><figcaption><p>Showing only search results (with a Filter and the Display Rule)</p></figcaption></figure>

### Multiple filters

More than one filter can be active at the same time. This enables you to create a complex set of conditions (one per Filter) for analysing a model. It’s important to understand how this works to avoid misinterpreting the results.

There are a few simple rules you need to know:

> 1. The logic of multiple **Show** filters is additive: entities that match **any** (not **all**) of the active filters are shown.
> 2. If there are *any* **Show** Filters active, everything in the model is hidden, and then the *Show* Filters take effect, followed by the *Hide* Filters
> 3. If only **Hide** Filters are active, nothing is hidden unless it matches the conditions expressed in the Filters
> 4. If an entity matches both active *Hide* and *Show* Filters, it is hidden
> 5. If a higher-level entity matches the query underlying a filter, all descendant entities are **shown** or **hidden** even if they do not match the query.

For example, the model below has four filters. Display Rules are currently active to show the characteristics used to define filters, making it easier to see what happens when we apply them in succession.

<figure><figcaption><p>Four Display Rules are active</p></figcaption></figure>

The visible display of the Model changes as we apply the Filters - Entities disappear and then reappear:

<table data-header-hidden><thead><tr><th width="421.9388427734375"></th><th></th></tr></thead><tbody><tr><td>Original Model with four Display Rules active</td><td></td></tr><tr><td><p><strong>Show</strong> <em>DQ Score available</em></p><p>Every attribute that matches the query is visible.</p><p>(every attribute without a DQ Score is hidden)</p></td><td></td></tr><tr><td><p><strong>Hide</strong> <em>DQ Score Good</em></p><p>Every attribute that matches the query has been hidden.</p><p>(every attribute with a ‘good’ DQ Score has been hidden)</p></td><td></td></tr><tr><td><p><strong>Show</strong> <em>No DQ rule</em></p><p>Every attribute that matches the query is visible.</p><p>(some were not visible previously)</p></td><td></td></tr></tbody></table>

*The following message will be displayed at the foot of the Filters menu:*

```
Hiding everything then showing 2 filters then hiding 1 filter.
```

***

See [Creating a Filter or Display Rule](#creating-a-filter-or-display-rule) for more information about creating Filters.

## Display rules

Display Rules can be used to decorate a model in the Model Viewer in order to highlight Entities and expose additional metadata. For example, if a model’s Attributes have a *Data Type* property, this can be easily visualised as a tag alongside the Attribute name using a Display Rule. Property values can also be used to replace an Entity name - this is very useful if a model contains multiple names for each Entity, perhaps in different languages.

| **Display Rule Examples**                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- |
| [Example 1: Set the highlight colour for a Layer](#example-1-set-the-highlight-colour-for-a-layer)                           |
| [Example 2: Format Transitions that represent Synonyms](#example-2-format-transitions-that-represent-synonyms)               |
| [Example 3: Tag entities with an insufficient Description](#example-3-tag-entities-with-an-insufficient-description)         |
| [Example 4: Tag entities with a Reference Term property value](#example-4-tag-entities-with-a-reference-term-property-value) |
| [Example 5: Quickly tag entities linked to a Reference Term](#example-5-quickly-tag-entities-linked-to-a-reference-term)     |
| [Example 6: A complex Filter](#example-6-a-complex-filter)                                                                   |

Display Rules can be applied from the *Rules* menu in the Toolbar or from [the Inspector tab in the Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab). In the example below, the Display Rules have been organised into [Modules](#organising-queries-into-modules).

Multiple Display Rules can be active at the same time and the impact is cumulative. Where two Rules affect the same display element (e.g. the name, highlight, or background colour) the first Display Rule applied will take precedence. If multiple tags are displayed on an Entity, the position of each tag depends on its position in the ‘All queries’ view in the Queries Manager.

<figure><figcaption><p>Multiple tags are sorted by their position in the list of queries</p></figcaption></figure>

***

<figure><figcaption><p>Display Rules menu</p></figcaption></figure>

| Click anywhere in the row for a Display Rule to turn the rule on or off.                                             |
| -------------------------------------------------------------------------------------------------------------------- |
| Click the *Enable all Display Rules* button to switch all Display Rules on.                                          |
| Click the *Disable all Display Rules* button to switch all Display Rules off.                                        |
| Click the pencil button for a Display Rule to [edit](#editing-a-filter-or-display-rule) the Filter and Display Rule. |
| To remove a Display Rule from a Filter, see [Editing a Filter or Display Rule](#editing-a-filter-or-display-rule).   |

{% hint style="success" %}
When you have multiple active display rules that show tags on an entity, the tags are sorted by their position in the list of Queries. In the [Queries Manager](#using-the-queries-manager), you can sort Queries within a Module or in the *All queries* view using drag-and-drop. Drag-and-drop also works for multiple selections.

* Drag Queries into a module on the left to group them
* If the Modules tab is open you will also see the name of the Module that owns a query
  {% endhint %}

***

Click *New Display Rule* to create a new Display Rule and Filter; Display Rules can also be created and edited in [the Queries Manager](#using-the-queries-manager) dialogue which can be opened by clicking *Edit Rules*.

***

A Display Rule can be added to an existing Filter - click the `Create` button next to the name of the Filter to edit the Filter, and choose the type of Display Rule. See [Creating a Filter or Display Rule](#creating-a-filter-or-display-rule) for more information about creating Display Rules.

<figure><figcaption><p>Click to create a Rule for this Filter</p></figcaption></figure>

***

The [Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab) on the Model Sidebar lists active Display Rules that match a selected Entity. Click a Rule name to edit the rule.

<figure><figcaption><p>Filters and Rules in the Inspector panel</p></figcaption></figure>

{% hint style="success" %}
Click on the name of a Display Rule in the Selection panel to edit the rule.
{% endhint %}

You can create a Display Rule by clicking on the paintbrush icon next to a property name in the Inspector panel. If a rule already exists, clicking the paintbrush is a speedy way to turn the rule on or off.

<figure><figcaption><p>Create or toggle a rule in the Inspector panel</p></figcaption></figure>

***

### **Types of display rule**

A Display Rule can set text colour, tags, highlight colour, or Transition style. Alternatively, a rule can display components that contain a property value or a relationship label. The six types of Display Rule follow a common pattern:

* they must have a name
* they can be added to a [module](#organising-queries-into-modules) (after the rule has been created)
* they should have a description so users know why they exist
* they must have a query (to select the Entities to apply the rule to), which can also be used as a Filter
* you can choose the style of the decoration that the rule adds to the model
  * the style can be defined by the user, or managed by Solidatus.

<table data-header-hidden><thead><tr><th width="159"></th><th width="301"></th><th></th></tr></thead><tbody><tr><td><strong>Rule type</strong></td><td><strong>Notes</strong></td><td><strong>Sample</strong></td></tr><tr><td>Tag</td><td>Display a tag on matched Entities; the tag can display fixed text, a property value, the results as property formula, the name of a related Term in a Reference Model, or a property value of a related Term. The tag can be displayed to the left or to the right of the Entity name.</td><td></td></tr><tr><td>Name replacement</td><td>Replace the name of matched Entities with a property value. Simply choose a property and the query statement and name are automatically created for you - feel free to edit them.</td><td></td></tr><tr><td>Text</td><td>Modify the text colour, style (bold, italic, underline), and background colour on matched Entities.</td><td></td></tr><tr><td>Highlight</td><td>Display an outline on matched Objects, or change the colour of layer backgrounds for matched Layers. The colour can be either fixed, or generated according to property values. <strong>Important - does NOT highlight Groups or Attributes</strong></td><td></td></tr><tr><td>Link</td><td>Display a clickable link on matched Entities to a fixed URL or to the URL contained within a specified property value. Note that if the specified property does not contain a URL, the link icon will not appear on the entity. If your aim is to indicate whether a property has a value - whether or not the value is a valid URL - consider using a Tag display rule instead.</td><td></td></tr><tr><td>Transition</td><td>Modify the styling of matched Transitions (colour and line style).</td><td></td></tr></tbody></table>

{% hint style="success" %}
Some tags allow you to add a “prefix” or “suffix” - this is fixed text added at the beginning or end of each tag created by the rule. For example, if you added the prefix “Owned by” to a tag set to display the value of the property “Owner”, each tag would display “Owned by \[Owner]”, instead of just “\[Owner]”.
{% endhint %}

### Property formula tags

You can display tags that contain the result of a *property formula*, using the same formulas as [Formula properties](/models/understand-solidatus-models/understand-properties/property-types#formula-property-type) - the key advantage here is the ability to display the results of a formula without creating a property to hold it.

A formula is effectively a template that allows you to combine text with one or more property values, and the results of one or more functions.

These formulas are all valid:

> * `= Property 1 min value is min(property_1)` Displays the words ‘Property 1 min value is ‘, followed by the smallest value from the `property_1` property in the child Entities.
> * `=avg(descendants.property-2)` Calculates the average value of `property-2` properties on all Entities below the current Entity in the hierarchy.
> * `=max(children[another property key])` Finds the largest value of the `another property key` property in the direct children of the current Entity.

{% hint style="warning" %}
**Any change you make to the formula will cause the query to be overwritten with a default query, intended to ensure that the tag is only displayed if every reference property is present on the current Entity.**

You may need to change the query to suit your circumstances e.g. `isLayer()` or `isObject`. Consider storing the query in the description box so you don’t completely lose it.
{% endhint %}

In this example, the tag will be a mixture of plain text, the value of a single property (`DataType`) and an emoticon (:eyes:).

<figure><figcaption><p>Display a simple formula with one property and emoticon</p></figcaption></figure>

In this example, the tag will just contain the results of a single function, `sum(descendants[DPIA rating])`, and will only appear for Layers.

<figure><figcaption><p>Display a more complex formula</p></figcaption></figure>

### Example 1: Set the highlight colour for a Layer

Here’s a simple Display Rule, which sets the background colour for every Layer called “Category”:

<figure><figcaption><p>Rule to change colour for a Layer</p></figcaption></figure>

### Example 2: Format Transitions that represent *Synonyms*

If the Transitions in your Model represent different types of lineage, it is good practice to add a property to identify the type of lineage for each Transition. In the example below, a property called *Label* is used for this purpose, and the Display Rule makes *Synonym* links look different to other *types* of Transition. The associated Filter can be used to show or hide matching Transitions.

<figure><figcaption><p>Rule to change format for synonym links</p></figcaption></figure>

### Example 3: Tag entities with an insufficient *Description*

This Display Rule adds a tag to all Entities that have a description of less than the minimum required length, or no description at all.

<figure><figcaption><p>Rule to tag insufficient Descriptions - with an emoticon (the eyes)</p></figcaption></figure>

### Example 4: Tag entities with a reference term property value

Tags can be used to display the value of a Reference Term property directly on an entity that has a Reference Relationship to the Term.

For example, we have a Reference Term called *1.02 4 Eyes Checks* that has a property called *Control Type*, and we want to display the value of that property as a tag on every Attribute related to the Term.

<figure><figcaption><p>A Reference Term and its linked Entities</p></figcaption></figure>

To create the required Display Rule, you need to identify the term and the property.

<figure><figcaption><p>Rule to tag Attributes with the value of the Reference Term property ‘Control Type’</p></figcaption></figure>

Using this example query and tag, all Attributes related to the Term *1.02 4 Eyes Checks* will display the value for the the property *Control Type*.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
If multiple Reference Models with the same names, the same Term name(s), and the same Property name(s) are related to entities in your Model, you will see these listed separately in the dropdown menus for the Reference Term Property Value tag.

Since you are not able to distinguish these Models by name, it is best to distinguish them by activating the display rule and checking which entities are tagged.
{% endhint %}

### Example 5: Quickly tag entities linked to a reference term

Use the Reference model panel to select a term whose property values you would like to display on related entities. Then, use the `Search` button to select all entities related to the term.

<figure><figcaption></figcaption></figure>

When you click `Search` from the Reference model panel, a query is automatically entered in the search bar that identifies all entities related to the selected Term. You can then click the three dots on the right-hand side of the search bar and `Create a display rule from search results` to tag these entities with a property value from your selected Term.

<figure><figcaption><p>Create a display rule from results of a search using the Reference Model panel</p></figcaption></figure>

### Example 6: A complex filter

This query looks for Attributes linked to the current selection, their sources and targets, and for linked Attributes in various named Layers.

<figure><figcaption><p>Complex nested and alternative conditions</p></figcaption></figure>

## Use the Queries Manager

The Queries Manager dialogue combines and enhances the capabilities provided by the *Filters* and *Display Rules* menus. Much of the dialogue will be familiar to you from those menus.

The Queries Manager can be accessed from the *Display Rules* and *Filters* menus - click on *Edit Rules* or *Edit Filters* button at the bottom of each list. It is also automatically opened after editing a Display Rule or Filter.

<figure><figcaption><p>List of queries in the Queries Manager</p></figcaption></figure>

The modules pane is open by default - it has been closed here for clarity.

{% hint style="success" %}
When you have multiple active display rules that show tags on an entity, the tags are sorted by their position in the list of Queries. In the [Queries Manager](#using-the-queries-manager), you can sort Queries within a Module or in the *All queries* view using drag-and-drop. Drag-and-drop also works for multiple selections.

* Drag Queries into a module on the left to group them
* If the Modules tab is open you will also see the name of the Module that owns a query
  {% endhint %}

### Add and use sample queries

You can add a set of sample queries by clicking on *Add sample queries* in the [Queries Manager](#using-the-queries-manager).

<figure><figcaption><p>Adding sample queries</p></figcaption></figure>

This will result in the following queries appearing in Queries Manager:

<figure><figcaption><p>Sample Queries</p></figcaption></figure>

### Organise queries into modules

A complex model that satisfies multiple use cases would probably include a large number of queries to enable different users to visualise and filter the model in many different ways.

The ability to group related queries into **modules** and **submodules** enables model builders to make their models easier to use, by allocating each query to a module or submodule.

When you look at your list of Display Rules or list of Filters, the list is organised using your query modules.

<figure><figcaption><p>Listing Display Rules within query modules</p></figcaption></figure>

Click on the *Modules* tab in the Queries Manager dialogue to open the **modules pane**, if necessary.

To transfer queries into a module, drag queries from the queries list on the right into a module on the left.

Multiple queries can be selected using Cmd-click (Mac) or Ctrl-click (Windows), or you can select queries consecutively with Shift-click, as you would in a file explorer. Alternatively, click in the *select* boxes - they turn blue when selected - and then drag the entities into a module.

You can create sub-modules that contain queries relevant to similar general purposes by clicking the “three dots” on the right-hand side of a module.

For example, you can have a module for Data Quality Display Rules that contains sub-modules with queries for passes and fails on different dimensions of Data Quality, such as completeness, validity, and uniqueness.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The three dots menu to the right of a module has options to enable or disable all Filters and Display Rules in the module.

You can easily activate a set of Filters and Display Rules that are designed to work together using this menu.
{% endhint %}

If you close the Modules tab (using the `X` in the corner), Module names will disappear from the list of queries.

<figure><figcaption><p>Using the modules panel</p></figcaption></figure>

{% hint style="success" %}
If you need to edit an imported query, click on the ellipsis next to the list of imported queries, then select `Open model in a new tab`
{% endhint %}

### Create a filter or display rule (extended)

From the [Queries Manager](#using-the-queries-manager) - click on the `Create query` button

{% hint style="info" %}
By default, all new Filters and Rules are placed in the *Unclassified* Module - to store them directly in a different Module, click the Module name in the Modules tab in the Queries Manager before you click on `Create query`
{% endhint %}

All new queries are placed in the *Uncategorised* module initially - to avoid this, create your queries using the [Queries Manager](#using-the-queries-manager), and select a module before you click on *Create query*. This will ensure that the query is created in the correct module (so you don’t have to move it afterwards).

The first part of the ‘Create query’ dialogue enables you to create a Filter (by entering the query) - to add a Display Rule, click on one of the Rule types (you can change your mind in the next step).

<figure><figcaption><p>Creating a query - this is <strong>not</strong> presented when creating a Display Rule via the Inspector tab</p></figcaption></figure>

What should you complete?

> * the query must have a name - you should replace the default name with something more meaningful.
> * the query should have a description so users know why it exists - click on the triangle to the right of the name to open the *Description* box.
> * you must provide a valid query language statement - see [here](/models/explore-and-analyse-models/search-and-query-in-a-model) for more information, or click the [The Query Builder](/models/explore-and-analyse-models/search-and-query-in-a-model#the-query-builder) button to construct a query with assistance.

If you only need a Filter, not a Display Rule, click *Save* to save the query. Otherwise, click on the type of Display Rule you want to add. You can always add the Display Rule later.

After selecting the type of Display Rule, the full form of the query editor appears - it allows you to define the Display Rule. This dialogue also appears when you edit an existing query, Filter or Display Rule.

<figure><figcaption><p>Editing a query</p></figcaption></figure>

{% hint style="success" %}
Clicking any button (apart from the `X` to close the dialog) will **always** take you to the Queries Manager.
{% endhint %}

## **Display rule properties**

<table data-header-hidden><thead><tr><th width="283"></th><th></th></tr></thead><tbody><tr><td>Rule type</td><td>Properties</td></tr><tr><td>Tag</td><td><p></p><p>You can choose between a fixed colour and colours based on the property values. The colours will be generated by Solidatus, subject to any specific colours you may have set for individual values - see <a href="/pages/uybxEmHbCnnirtJxoafs">Characteristics of property types</a>.</p></td></tr><tr><td>Name replacement</td><td>../_images/rule-name.png</td></tr><tr><td>Text</td><td>../_images/rule-text.png</td></tr><tr><td>Highlight</td><td>../_images/rule-highlight.png</td></tr><tr><td>Link</td><td>../_images/rule-link.png</td></tr><tr><td>Transition</td><td>../_images/rule-transitions.png</td></tr></tbody></table>

{% hint style="success" %}
Some tags allow you to add a “prefix” or “suffix” - this is fixed text added at the beginning or end of each tag created by the rule. For example, if you added the prefix “Owned by” to a tag set to display the value of the property “Owner”, each tag would display “Owned by \[Owner]”, instead of just “\[Owner]”.
{% endhint %}

## Edit a filter or display rule

You can access the Query Editor to edit a Filter or Rule in several ways:

* clicking on a paintbrush icon in the list of Rules or list of Filters
* clicking on the name of a Display Rule in the *Applied Display Rules* section of the [Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab) in the Sidebar
* clicking on an entry in the [Queries Manager](#using-the-queries-manager)

## Export queries to an export file

Click on the vertical ellipsis `...` at the top of the Queries Manager and select *Export to .solq file*. This will export queries to a JSON format file - the location will depend on your browser settings.

The file name will be constructed as follows: `queries-[model name with dashes]-[date].solq`.

{% hint style="success" %}
If you select a module first, the export file will only contain the queries in that module (and any submodules)
{% endhint %}

## Import queries from an export file

Click on the vertical ellipsis `...` at the top of the Queries Manager and select *Import .solq file*. This will import all modules and queries found in the file. This may result in duplicate modules and queries being created.

{% hint style="success" %}
The .solq file includes the Solidatus ID for each query - if you import the same file twice, it will not create duplicates
{% endhint %}

## Import queries from another model

To import queries from another model, click the “Import” button in the Modules tab of the Queries Manager. Now select a model from the resulting dialogue box:

<figure><figcaption><p>Importing queries</p></figcaption></figure>

If you change your mind about importing the queries, click on the `Undo` button at the bottom of the Queries Manager. If you’ve already closed the Queries Manager, you can use the standard [undo](/models/build-and-edit-models/add-and-edit-entities#undo-and-redo) features.

Imported queries have their own dedicated location in the Modules pane, and will be kept up-to-date automatically as the Queries change in the source model.

{% hint style="success" %}
You can access a Model using the drop-down menu next to the Model name - by default this will open in the same tab.
{% endhint %}

{% hint style="success" %}
In the example above, the final two Models in the list were incompatible with queries import - you will need to update the Models to make them compatible, or use the file export/import approach.
{% endhint %}

<figure><figcaption></figcaption></figure>
