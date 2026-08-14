# Create and edit metrics

To create a new metric, open an Analytics Report, go to the `Metrics` tab, and click `+ METRIC`.

<figure><figcaption><p>Create a new metric</p></figcaption></figure>

If you’ve already created metrics, the `+ CREATE METRIC` button will be located on the top-right of the list of metrics.

You can edit the definition of a metric that has already been created by hovering your mouse over the right-hand side and clicking the `three-dots` menu.

<figure><figcaption><p>Create and edit metrics</p></figcaption></figure>

{% hint style="success" %}
Metrics count entities and terms in your Data Domain that satisfy the criteria you set when creating or editing a metric.
{% endhint %}

There are **three** steps involved in creating a new metric, each reflected in the sequence of the dialog that opens when you click `+ Create`:

<figure><figcaption></figcaption></figure>

1. Metric name: Name and describe the metric
2. Match criteria: Set **match criteria** to count items by type, name, property, and relationship.
3. Preview: Check to make sure the name, description, and match criteria are correct.

The sections below explain each step involved in creating a metric.

## Step 1: Name your metric

Give your metric a name and description, and when you’re done click `NEXT` at bottom right corner of the dialog.

{% hint style="success" %}
The name you enter here describes what the number returned by your metric represents. It is displayed on charts and infographics that contain the metric, and anyone you share your Analytics Report with will use names and descriptions to understand what numbers mean.
{% endhint %}

## Step 2: Set match criteria

This is the most important step, as this is where you tell your metric `what` to count in your Data Domain.

You can define match criteria using simple dialog menus and buttons (Basic mode), or you can use the Domain Query Language (Advanced mode).

<table data-header-hidden><thead><tr><th width="162.170654296875"></th><th></th></tr></thead><tbody><tr><td><a href="#basic-mode">Basic Mode</a></td><td>Set match criteria using a simple interface with menus and buttons.</td></tr><tr><td><a href="#advanced-mode">Advanced Mode</a></td><td>Set match criteria by writing a query in the <a href="/pages/8TPcuB1I1cP0GCFgAnbw">Domain Query Language</a>.</td></tr></tbody></table>

In Advanced mode, you can use all available predicates in the [Domain Query Language](/data-domains/explore-data-domains/query-data-domains) to specify `what` to count in a domain.

{% hint style="success" %}
Only Advanced mode supports restricting your metric to count only matching entities in specific models in a domain. You can use `Model=` and `ModelId=` predicates to restrict the scope of a metric to the specified subset of models.
{% endhint %}

The following instructions explain how to configure a metric in each mode and give examples of configuring the same metrics in both modes.

### Basic mode

<figure><figcaption></figcaption></figure>

In Basic mode, you can use an intuitive interface to specify characteristics items must possess in order to be included – or excluded – in the count your metric performs.

The basic workflow for defining a metric is pictured in the following image, and the sections below provide more detail on the options available at each step.

<figure><figcaption></figcaption></figure>

### Simple match criteria in Basic Mode

Simple metrics involve only one or two match criteria, and they do not include more than one **include/exclude** condition.

You can familiarise yourself with the basic options for setting match criteria here before looking at more complex metrics with more than one **include/exclude** condition.

#### **Include or exclude condition**

For each characteristic you define, the Basic mode dialog allows you to **include** or **exclude** items with that characteristic in the count your metric performs.

<table data-header-hidden><thead><tr><th width="114.0731201171875"></th><th></th></tr></thead><tbody><tr><td><strong>Include</strong></td><td>Including characteristics means the metric will count items with those characteristics (i.e., names, properties, or relationships)</td></tr><tr><td><strong>Exclude</strong></td><td>Excluding characteristics means the metric will <strong>not</strong> count items with those characteristics, but will count items that satisfy other criteria.</td></tr></tbody></table>

<figure><figcaption></figcaption></figure>

Additionally, you can choose whether to include or exclude entities that have **all** of a set of defined characteristics or **any** of a set of characteristics.

<table data-header-hidden><thead><tr><th width="62.74151611328125"></th><th></th></tr></thead><tbody><tr><td><strong>All</strong></td><td>The metric will only count domain entities with <strong>all</strong> characteristics specified under this include/exclude condition (i.e., names, properties, or relationships).</td></tr><tr><td><strong>Any</strong></td><td>The metric will count domain entities with <strong>any</strong> characteristic specified under this include/exclude condition (i.e., names, properties, or relationships).</td></tr></tbody></table>

#### **Match by entity type and name**

The first step in setting match criteria is adding or removing entity types from your match criteria from the dropdown menu. Metrics can count all model entity types in a domain: Layers, Objects, Groups, Attributes, and Transitions.

<figure><figcaption></figcaption></figure>

For example, let’s say you want to count all of the systems in your Models. If Objects represent Systems in all models published to a domain, you can select Object in the `Entity type` dropdown menu to count your systems.

Wait! Let’s say some of the Objects in the domain are not systems, so you want to specify that Objects must have the word “System” in their name.

To specify criteria involving names, click the `+ Entity` button, select an operator, and enter a name.

<figure><figcaption></figcaption></figure>

* `Equals` : only count exact name matches
* `Not Equals` : count all items that do not have the exact name
* `Contains` : count items whose name contains entered text

With the criteria entered above, your metric represents the number of Objects in your Data Domain that have the word “System” in their name.

{% hint style="success" %}
“**Contains**” in this context means that the entered text must appear at the beginning of a name, in a distinct word in a multi-word name, or in a distinct segment of a single name string. The same criteria apply to the use of **contains** with property names and property values.

> A few examples help illustrate the fuzzy logic according to which **contains** matches entries in a domain.
>
> A search for `system` returns entries with the name, property names, or property values `system`, `systemmortgage`, and `mortgage system`. The results also include `mortgageSystem`, `mortgage_system`, and `mortgage1system` where the search term can be distinguished from the rest of the text by a capital letter or other unique character.
>
> The results do not include `mortgagesystem` because the search text `system` is not an isolatable, tokenisable component of the string *mortgagesystem*.
>
> If you enter multiple distinct words into the search field, the results include all entries that contain **any** of those words. For example, `System catalog` returns `system`, `catalog`, and `catalogued_ids`. However, as in the previous example, it does not return `mortgagecatalog` or `mortgagesystem`.
>
> The domain text search is **not** case-sensitive, and it includes results where the specified text is only part of a name, property name, or value. For example, a search for `sys` would return these results:
>
> > * `System_Stats`
> > * `System catalog`
> > * `Mortgage System`
> > * every entry with a property called `System_ID`
> >   {% endhint %}

#### **Match by property and property value**

If you want to count items that have certain properties and property values, click the `+ Property` button. Here you can specify properties and property values to add to your match criteria.

<figure><figcaption><p>Match by property name and property value</p></figcaption></figure>

Enter the name of a property in the `Property` field, then select an operator condition for the property value.

* `Equals` : Count items with a property value exactly equal to the value you enter.
* `Not equals` : Count items with the property, excluding those with a value exactly equal to the value you enter.
* `Contains` : Count items with a value for the property that contains the value you enter.
* `Any` : Count all items with the property, excluding items where the property has no value.

{% hint style="warning" %}
Metrics do not count items where a property is empty. If you add a property criterion and choose **Any**, the metric includes only items where that property has a value.
{% endhint %}

In this example below, the metric counts Objects with a property `Type` that has a value exactly equal to `Table`.

<figure><figcaption><p>An example of property match criteria in Basic mode</p></figcaption></figure>

{% hint style="success" %}
If you want to count a specific combination of values for a multi-select property type, choose the **include all** condition and then add each property value separately.
{% endhint %}

In this example, the metric counts entities with the combination of values `One, Four, Five` for the multi-select property `Multi-select` .

<figure><figcaption><p>How to match a specific combination of values for a multi-select property</p></figcaption></figure>

#### **Match entities by reference relationship**

If you want to count items according to Reference relationships, click the `+ Relationship` button. Metrics can count entities that are related to a specified term, or that have relationships with a specified label, or both combined.

<figure><figcaption><p>Match by relationships to Reference terms</p></figcaption></figure>

* Select a Reference model from the list of Reference models published to this Data Domain.
* Enter a relationship label
* Enter the name of a Reference term

{% hint style="success" %}
A label **OR** term is required when adding relationship match criteria, and you can provide both.

If you only enter a Label, you will match all entities with relationships that have that label. If you enter only a Term, you will match all relationships to that term with any label. If you enter both, you will match all entities related to that term with that label.
{% endhint %}

In this example, the metric counts Objects that have a relationship labeled `Asset Type` to the term `Column` in the Reference model `Class model`.

<figure><figcaption><p>An example of relationship match criteria in Basic mode</p></figcaption></figure>

### Complex match criteria in Basic mode

In Basic mode, you can create complex match criteria by combining multiple **Include/Exclude** conditions using **And** or **Or** logical operators.

To add additional match criteria with different **include/exclude** conditions, select `+ Condition` under the previously defined condition.

<figure><figcaption></figcaption></figure>

When you add more than one condition, a dropdown menu appears between them that combines them with either **And** or **Or** logic.

<figure><figcaption><p>Use logical operators to combine Include/Exclude conditions</p></figcaption></figure>

For example, here is a metric that **includes all** of three criteria and **includes any** of three other.

In plain english, we are telling the metric to count entities whose name contains “System” with a property “DQ Status” with the value “Fail” that are also related to the term “mortgage” in the “Products” Reference model. Additionally, we only want to count entities that satisfy these conditions and are related to either Oracle DB, ODI ETL, or Power BI Reports in the “System Catalog” Reference model.

<figure><figcaption></figcaption></figure>

### Advanced mode

In Advanced mode, you can match entities you want your metric to count by writing a query in the Domain Query Language (DQL). The options for using the DQL to match entities are endless, and the best reference for help is the comprehensive [Domain Query Language reference](/data-domains/explore-data-domains/query-data-domains).

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The Advanced mode dialog has a built-in Query Helper with colour-coded examples of valid syntax for all available predicates.

Click an example to use it in your query; just remember to replace the example terms with your query terms that match what you are looking for.
{% endhint %}

### Simple match criteria in Advanced Mode

Here we defined the same entity type and name metric as in simple example above, but using the DQL. Your metric represents the number of Objects in your Data Domain that have the word “System” in their name.

<figure><figcaption></figcaption></figure>

### Complex match criteria in Advanced mode

If you want to create a complex metric with many conditions and logical operators, it is likely easiest to use Advanced mode and write a query.

Here we defined the same complex metric as above, but using the DQL. The metric counts the number of Objects in your Data Domain that have the word “System” in their name, have a value “Fail” for the property “DQ Status”, and are related to the term “mortgage” in the Reference model “Products”. We only want to count entities that also have a relationship to either the term “Oracle DB” or “ODI ETL” or “Power BI Reports”.

<figure><figcaption></figcaption></figure>

## Step 3: Preview your metric

When you’re finished setting match criteria, click `NEXT` to preview your metric. You can review the name, description, and match criteria you entered, and you can also view the returned value, which represents the number of matching entities in your domain.

When previewing a metric, match criteria are expressed in the form of a query in the Domain Query Language, even if you used Basic mode.

<figure><figcaption><p>Preview and review your metric before finishing</p></figcaption></figure>

## Edit or delete metrics

When you’ve finished creating a metric, it appears in the `Metrics` tab of your Analytics Report.

The row of a metric shows the name and description, as well as the metric value, which represents the number of entries in the domain that match the criteria contained in the metric’s underlying query.

You can edit or delete a metric by clicking the three-dots menu on the right-hand side of a metric’s row.

<figure><figcaption><p>View the list of metrics in this Analytics Report</p></figcaption></figure>

You can edit the name and description of a metric, you can also edit the match criteria in Basic or Advanced mode, regardless of which was used when the metric was created.

<figure><figcaption></figcaption></figure>
