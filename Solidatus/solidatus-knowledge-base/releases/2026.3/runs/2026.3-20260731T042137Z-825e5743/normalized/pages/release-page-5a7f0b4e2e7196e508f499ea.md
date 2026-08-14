# Data Map display rules

With Data Map Display Settings, you can create tags that decorate a Data Map with valuable information and surface additional metadata for quick and easy visual analysis.

Release `2026.3` improves display-rule editing, including rules created with manual selection. Saved Data Map views now also preserve display rules when you reopen them.

{% hint style="success" %}
Only Owners of a Data Domain can create and edit Display Setting tags. Members can turn tags on or off, but they cannot create, edit, or delete them.
{% endhint %}

A tag operates on the basis of an underlying query that matches entities in the Data Map based on characteristics you select, like type, name, property, and relationship. Tags have two key ingredients:

1. Match criteria that determine which entities display the tag when it is turned on
2. Specification of the colour of the tag and the text to appear on it

## Tags, match criteria, and queries

Tags appear on entities that match a set of conditions, called **match criteria**, that you define when creating the tag.

**Match Criteria** are identifying features like entity type, name, properties, and Reference relationships. If entities possess the features you specify, they **match**.

Setting match criteria involves building a **query**, which you can do using a simple interface with menus and buttons (Basic mode), or you can write a query in the Domain Query Language (Advanced mode).

<table data-header-hidden><thead><tr><th width="128.30194091796875"></th><th></th></tr></thead><tbody><tr><td>Basic</td><td>Set match criteria using a simple interface with menus and buttons.</td></tr><tr><td>Advanced</td><td>Set match criteria by writing a query in the <a href="/pages/8TPcuB1I1cP0GCFgAnbw">Domain Query Language</a>.</td></tr></tbody></table>

{% hint style="success" %}
You can use all available predicates in the [Domain Query Language](/data-domains/explore-data-domains/query-data-domains) to define which entities a tag appears on in a Data Map.
{% endhint %}

While Basic mode is a simple dialog interface for setting match criteria, essentially it too involves creating a query that matches items in a Data Domain based on conditions (logical, comparative, or otherwise) expressed in the query.

## Create and edit display settings

To open Display Settings, click the `paintbrush` button at the top left of the Data Map.

<figure><figcaption><p>Click the paintbrush to create new Display Settings</p></figcaption></figure>

If you’ve already created some Display Settings, you can view them, activate them, and edit them through the `paintbrush` menu.

Editing is now more reliable, especially when working with rules that were originally created through manual selection.

<figure><figcaption></figcaption></figure>

## Step 1: Name your tag

Give your tag a name and description, and when you’re done click `NEXT` at bottom right corner of the dialog.

{% hint style="success" %}
The name you enter here describes what the tag represents. It helps others with access to the domain understand its purpose, so they can also understand why they might want to turn it on.
{% endhint %}

## Step 2: Set match criteria

This is the most important step, as this is where you specify which entities in your Data Map a tag appears on.

You can define match criteria using simple dialog menus and buttons (Basic mode), or you can use the Domain Query Language (Advanced mode).

Each mode is explained here, and we give examples of configuring the same tags in both modes.

### Basic mode

In Basic mode, an intuitive interface provides options for specifying the characteristics of Data Map entities the tag appears on.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
Tags can only appear on entities derived from Lineage models; they cannot appear on visual *Context* grouping boxes in a Data Map.
{% endhint %}

The basic workflow for defining a tag in Basic mode is shown in the following image, and the sections below provide more detail on the interface options available at each step.

<figure><figcaption></figcaption></figure>

#### Simple match criteria in Basic mode

Simple queries involve only one or two match criteria, and they do not include more than one **include/exclude** condition.

You can familiarise yourself with the basic options for setting match criteria here before looking at more complex queries with more than one **include/exclude** condition.

#### **Include or exclude criteria**

For each characteristic or group of characteristics you set as match criteria, the Basic mode dialog allows you to specify an **include** or **exclude** condition.

<table data-header-hidden><thead><tr><th width="115.95269775390625"></th><th></th></tr></thead><tbody><tr><td><strong>Include</strong></td><td>Including characteristics means the tag appears on items with those characteristics (i.e., names, properties, or relationships)</td></tr><tr><td><strong>Exclude</strong></td><td>Excluding characteristics means the tag does not <strong>not</strong> appear on items with those characteristics, but does appear on items that satisfy other provided criteria.</td></tr></tbody></table>

<figure><figcaption></figcaption></figure>

Additionally, you can choose whether to include or exclude items that have **all** of a set of defined characteristics, or **any** of a set of characteristics.

#### **Match by entity type and name**

The first, required, step of defining match criteria is to add or remove matching entity types using the dropdown menu or by clicking the `x` on an entity type.

Tags can appear on all model entity types (except Transitions) that appear on a Data Map: Layers, Objects, Groups, Attributes.

{% hint style="success" %}
Depending on how a *Context* model in a domain was configured, some entity types might not appear on the Data Map when the context is applied. For example, if relationships to a *Context* model were created at the Object level, when you apply that context, Layers will not appear.
{% endhint %}

<figure><figcaption></figcaption></figure>

For example, let’s say you want a tag to appear on all of the systems in your Data Map. If Objects represent Systems in all models published to a domain, you can select Object in the `Entity type` dropdown menu to tag your systems.

Wait! Let’s say some of the Objects in the domain are not systems, so you want to specify that Objects must have the word “System” in their name.

To specify criteria involving names, click the `+ Entity` button, select an operator, and enter a name.

<figure><figcaption></figcaption></figure>

* `Equals` : only tag matching entity types with an exact name
* `Not Equals` : tag matching entity types that do not have the exact name
* `Contains` : tag matching entity types whose name contains entered text

With the criteria entered above, your tag will appear on Objects in your Data Map that have the word “System” in their name.

{% hint style="success" %}
“**Contains**” in this context means that the entered text must appear at the beginning of a name, at the beginning of a word in a multi-word name, or in a distinct segment of a single name string. The same criteria apply to the use of **contains** with property names and property values.

> A few examples will help illustrate this fuzzy logic according to which **contains** matches entries in a domain.
>
> A search for `system` will return entries with the name, property names, or property values `system`, `systemmortgage`, `mortgage systematics`, and `mortgage system`. The results will also include `mortgageSystem`, `mortgage_system`, and `mortgage1system` where the search term can be distinguished from the rest of the text by a capital letter or other unique character.
>
> The results will not include `mortgagesystem` because the search text, `system`, is not an isolatable, tokenisable component of the string *mortgagesystem*.
>
> If you enter multiple distinct words into the search field, the results will include all entries that contain **any** of those words. For example, `System catalog` will return `system`, `catalog`, and `catalogued_ids`. However, as in the previous example, it will not return `mortgagecatalog` or `mortgagesystem`.
>
> The domain text search is **not** case-sensitive, and it will include results where the specified text is only part of a name, property name, or value. For example, a search for `sys` would return these results:
>
> > * `System_Stats`
> > * `System catalog`
> > * `Mortgage System`
> > * every entry with a property called `System_ID`
> >   {% endhint %}

#### **Match by property and property value**

If you want to tag (or not tag) items that have certain properties and property values, click the `+ Property` button. Here you can add properties and property values to your match criteria.

<figure><figcaption><p>Match by property name and property value</p></figcaption></figure>

Enter the name of a property in the `Property name` field, then select an operator condition for the property value.

* `Equals` : Match items with a value exactly equal to the value you enter.
* `Not equals` : Match items with any value for the property other than the exact value you enter.
* `Contains` : Match items with a value for the property that contains the value you enter.
* `Any` : Match all items with the property.

The pictured tag will appear on any entity type with a property `DQ Result` that has a value exactly equal to `Fail`.

<figure><figcaption><p>An example of property match criteria in Basic mode</p></figcaption></figure>

{% hint style="success" %}
If you want a tag to appear on entities with a specific combination of values for a multi-select property type, choose the **include all** condition and then add each property value separately.
{% endhint %}

In this example, the tag will appear on entities with the combination of values `One, Four, Five` for the multi-select property `Multi-select`

<figure><figcaption><p>How to match a specific combination of values for a multi-select property</p></figcaption></figure>

#### **Match by reference relationship**

If you want to tag items according to Reference relationships, click the `+ Relationship` button. You can configure tags to appear on entities related to a specific term, or that have relationships with a specified label, or both combined.

<figure><figcaption></figcaption></figure>

Match by relationships to Reference terms

* Select a Reference model from the list of Reference models published to this Data Domain
* Enter a relationship label
* Enter the name of a Reference term

{% hint style="success" %}
A label **OR** term must be provided when adding relationship match criteria, and you can also provide both.

If you only enter a label, you will match all entities with relationships that have that label. If you enter only a term, you will match all relationships to that term with any label. If you enter both, you will match entities related to a term with the specific label.
{% endhint %}

In this example, the tag will appear on Objects that have a relationship labeled `Asset Type` to the term `Column` in the Reference model `MLI Contextual ii`.

<figure><figcaption><p>An example of relationship match criteria in Basic mode</p></figcaption></figure>

#### Complex queries in Basic mode

In Basic mode, you can create complex match criteria by combining multiple **Include/Exclude** conditions using **And** or **Or** logical operators.

To add additional match criteria with different **include/exclude** conditions, select `+ Condition` under the previously defined condition.

<figure><figcaption></figcaption></figure>

When you add more than one condition, you will see a dropdown menu to combine them with either **And** or **Or**.

<figure><figcaption><p>Use logical operators to combine Include/Exclude conditions</p></figcaption></figure>

For example, here is a tag that **includes all** of three criteria and **includes any** of three other.

In plain english, we are configuring the tag to appear only on entities whose name contains “System” with a property “DQ Status” of “Fail” that are related to the term “mortgage” in the “Products” Reference model. We also only want it to appear only on entities related to either Oracle DB, ODI ETL, or Power BI Reports in the “System Catalog” Reference model.

<figure><figcaption></figcaption></figure>

### Advanced mode

In Advanced mode, you can match entities you want your tag to appear on using the Domain Query Language (DQL). The options for using the DQL to match entities are endless, and the best reference for help is the comprehensive [Domain Query Language reference](/data-domains/explore-data-domains/query-data-domains).

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The Advanced mode dialog has a built-in Query Helper with colour-coded examples of valid syntax for all available predicates.

Click an example to use it in your query; just remember to replace the example terms with your own query terms that match what you are looking for.
{% endhint %}

#### Simple match criteria in Advanced mode

Here is a tag configured with the same entity type and name criteria as in the Basic mode example above, but using the DQL. Your tag will appear on Objects in your Data Domain that have the word “System” in their name.

<figure><figcaption></figcaption></figure>

#### Complex match criteria in Advanced mode

If you want to create a complex query with many conditions and logical operators, it might be easiest to use Advanced mode and write a query.

Here we defined the same complex query as above, but using the DQL. The tag will appear on Objects in your Data Domain that have the word “System” in their name, have a value “Fail” for the property “DQ Status”, and are related to the term “mortgage” in the Reference model “Products”. We only want to tag entities that also have a relationship to either the term “Oracle DB” or “ODI ETL” or “Power BI Reports”.

<figure><figcaption></figcaption></figure>

## Step 3: Choose color and text

Display options for tags include the text that appears on the tag and the colour of the tag.

{% hint style="success" %}
Both *Custom text* and *colour* are required for configuring a tag.
{% endhint %}

<figure><figcaption></figcaption></figure>

You can preview the tag once you’ve picked a colour and added text to appear on it.

<figure><figcaption></figcaption></figure>

When you’re happy with the tag, click `NEXT` to proceed to the final step.

## Step 4: Preview your tag

At the final step, you can view the tag and review the name, description, match criteria, and display options you entered. Click `BACK` to make any changes to previous steps.

<figure><figcaption><p>Preview and review your tag before finishing</p></figcaption></figure>

Click `CREATE` to finish creating the tag.

## Turn tags on and off on a Data Map

The purpose of Display Settings is to highlight key information in a Data Map. When you turn on a tag, it appears on entities that match the tag’s underlying query.

Here, we have two tags: one that appears on entities that failed a DQ test, and one that appears on entities that passed the test.

<figure><figcaption><p>Example: tags can highlight data quality test results to analyse upstream effects</p></figcaption></figure>

Let’s first turn on *DQ Passes* by clicking the toggle for that tag.

As you expand entities in the Data Map, you will notice the tag on entities that match the underlying query. In this case, the query matches entities with the property “DQ Result” equal to “Pass” (`Property: "DQ Result"="Pass"`).

<figure><figcaption><p>Expand the Data Map to find tagged entities</p></figcaption></figure>

Let’s now turn on the *DQ Fails* tag. As you can see, tags make it easy to visually surface crucial information, and we can see the upstream effects of data quality issues by following the lineage trace of entities with *Fail* results.

<figure><figcaption><p>View upstream effects of data quality issues</p></figcaption></figure>
