# Examine reference relationships

A Reference relationship consists of an entity, a label, and a Reference term. Entities are related to terms in the manner specified by the label.

<figure><figcaption></figcaption></figure>

## Direct, inherited and inferred relationships

A relationship between an entity and a Reference term can be **direct**, **inherited**, or **inferred**.

<table data-header-hidden><thead><tr><th width="224.91455078125"></th><th></th></tr></thead><tbody><tr><td><strong>Direct relationship</strong></td><td>A relationship an entity itself has to a given Reference term.</td></tr><tr><td><strong>Inherited relationship</strong></td><td>A relationship an entity has to a Reference term when the entity’s ancestor is directly related to the term.</td></tr><tr><td><strong>Inferred relationship</strong></td><td>A relationship an entity has to a Reference term when the entity is directly related to a descendant of the term, but not to the term itself.</td></tr></tbody></table>

{% hint style="success" %}
Inherited and inferred relationships are also collectively referred to as **indirect** relationships.
{% endhint %}

<figure><figcaption><p>Direct vs. Inherited vs. Inferred Relationships</p></figcaption></figure>

## Find and examine relationships

There are multiple ways to examine existing relationships across the Solidatus interface. They can be organised by whether you are viewing a relationship from the perspective of an **entity** or a related **Reference term** .

### The entity perspective

To view the all of an entity's relationships:

* Select the entity and go to the `Properties and Relationships` panel in the Inspector tab.
* Go to the Model Overview of a Lineage model, find the `Entities` tab, expand the tree, select the entity, and check the `RELATIONSHIPS TO REFERENCE MODEL TERMS` section for a full list.
* If the entity is in a Data Domain, find it by searching, browsing, or querying and look at its `Overview` tab.

### The term perspective

To view the relationships a Reference term has to entities:

* Open the Reference model containing the term, select the term, and view the `Relationships to Selected Term` panel in the Inspector tab
* Go to the Model Overview of a Reference model and find the `Terms` page. Expand the tree, click a term, and review the `ENTITIES RELATING TO THIS TERM` section for a complete list.
* In a model containing entities related to a term, go to the `Reference Model Panel` in the Reference Model sidebar tab, find the term, and click to open a popup listing `Relationships to this term`. \**Note: this only shows a term’s relationships to entities in the open model*
* If the term is in a Data Domain, find it by searching, browsing, or querying and look at its `Related Entities` tab.

## Relationships in the Model Viewer

The main places to view and edit Reference relationships in the Model Viewer are the `Inspector` tab and the `Reference Models` tab.

* The `Inspector` tab focuses on the **entity perspective**
* The `Reference Models` tab focuses on the **term perspective**

### The Inspector tab

This tab displays existing relationships for the currently selected entity *or entities* in the model.

<figure><figcaption><p>Find all terms an entity is related to in the Inspector tab</p></figcaption></figure>

* Select one entity, and the `Properties and Relationships` panel in the Inspector tab lists all the Relationships for the selection. You can add Relationships to new terms here, edit Relationship Labels, and also [delete one or more Relationships](/models/build-and-edit-models/add-and-edit-reference-relationships#deleting-relationships).
* Select more than one entity, and the `Properties and Relationships` panel in the Inspector tab lists all the Relationships the selected entities have in common. You can modify or delete relationships all selected entities have in common here.

### The Reference Models tab

The `Reference model` tab focuses on all Reference models and terms that have relationships to entities in the model. It allows you to

* Filter the entities visible in the model to show only those related to a term or set of terms, hiding ebverything else (the `Show Usage` function)
* Filter the terms listed in the panel according to existing relationships (the `Filter based on selection` option)

<figure><figcaption><p>The Reference Models tab shows all entities a term is related to in the open model</p></figcaption></figure>

If the `Reference Model Panel` only shows terms that have existing relationships for a Reference model, you can load the full model:

> * Using the red download icon next to the Reference Model name
> * Using the `three-dots` dropdown menu on the right.

<figure><figcaption><p>Load the full reference model</p></figcaption></figure>

## Where and how is a term used?

Hover over a term in the `Reference Model Panel`, and related entities are highlighted in green in the model.

The numbers displayed alongside each Reference model and term in the panel tell you how many direct and inferred relationships each term has to entities in the model.

<figure><figcaption><p>Direct vs. inferred relationships in the Reference Model Panel</p></figcaption></figure>

The image also shows what happens when you click a term - a popup appears that shows the term’s properties and the entities that are related to the term.

<figure><figcaption><p>Where is this term used?</p></figcaption></figure>

There are three clickable areas in the popup (framed by red boxes in the image):

> * click the `Link` icon to the right of the term’s name to open the Reference Model Overview in a new tab, focused on the term
> * click `Search` to create a [query in the search bar](/models/explore-and-analyse-models/search-and-query-in-a-model) that will find all entities related to the term
> * click `Show usage` (see next two sections foor information on this function)

## Show terms related to selected entities

To view and edit existing relationships for an entity or set of entities, toggle `Filter based on Selection`:

* Click the `Filter based on selection` button in the `Reference Model Panel`
* Select the entity or entities whose relationships you wish to examine
* In the `Reference Model Panel`, all related terms will be expanded with a `green dot` next to them

<figure><figcaption><p>Filtering terms based on selected entities</p></figcaption></figure>

When <mark style="color:red;">`Filter based on selection`</mark> toggle is enabled (green), the Reference Model panel only displays terms with existing relationships to selected entities.

## Filter model by usage of a term

A `Show usage` filter shows only entities related to a term in the Model Viewer, hiding everything else.

To toggle a usage filter for a term:

> * Click the `Show usage` button in the popup that appears when you click a term in the Reference Model Panel.

{% hint style="success" %}
When activated, the filter icon next to a term in the Reference Model Panel turns green: show-usage-icon
{% endhint %}

<figure><figcaption><p>Filter model by relationship to a Reference term</p></figcaption></figure>

## Filter model by usage of multiple terms

You can turn on `Show Usage` for multiple terms, which filters the model so only entities related to the selected terms are visible in the Model Viewer.

When you activate `Show Usage` for more than one term, a new option appears at the top of the Reference Model Panel: `Show usage of selected terms`.

<figure><figcaption><p>Show usage for multiple Reference Terms</p></figcaption></figure>

The toggle allows you choose whether to show entities related to **any** active filter term or to **all** terms.

| show-usage-any-term  | Shows entities related to **any** of the Reference terms selected to `Show usage`. |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| show-usage-all-terms | Shows entities related to **all** of the Reference terms selected to `Show usage`. |

<figure><figcaption><p>Select <em>ALL</em> to show entities related to the intersection of multiple Reference terms</p></figcaption></figure>

To turn off usage filters for multiple terms, click the `Clear Filters` text at the bottom of the `Reference Model Panel`.

<figure><figcaption><p>Turning off term usage filters</p></figcaption></figure>

## Relationship queries, filters, and display rules

This section discusses creating Filters and Display Rules based on Reference relationships.

For general information on Filter and Display Rules and more detailed how-tos, see [Filters and Display Rules](/models/explore-and-analyse-models/filters-and-display-rules).

### Relationship queries

Filters and Display Rules apply to entities that match an underlying query. Queries match entities based on characteristics like properties, relationships, descendant and ancestor entities, and incoming/outgoing transitions.

In the Models Query Language, you can match entities based on Reference relationships using the `$relationships` special property.

{% hint style="success" %}
A *special property* is an element in the query language that accesses a list of items in a model.

For example, `$relationships` accesses a list of the relationships of each entity in the model and returns entities with relationships that match further conditions in the query.
{% endhint %}

`$relationships` must be paired with further special properties to construct a complete query:

* `$label` : accesses a list of relationship labels
* `$value.$name` : accesses a list of names of related Reference terms

The general syntax of a `$relationships` query can be illustrated through an example:

<figure><figcaption><p>Syntax for relationship queries</p></figcaption></figure>

The above query matches entities that have at least one relationship with the label *Relates to*.

#### **Reference relationship query examples**

Here are more examples of relationship queries. Note that these examples all use the string `relationship` as the variable, but this is arbitrary and you can use any text string, even just a letter `x`.

These queries match Attributes based on their existing relationships:

> * `isAttribute() and any relationship in $relationships (relationship.$label = 'is a')` matches all Attributes that have a Reference relationship with the label `is a`.
> * `isAttribute() and any relationship in $relationships (relationship.$value.$name = 'Currency')` matches all Attributes that have a Reference relationship to a term called *Currency*.
> * `isAttribute() and any relationship in $relationships (relationship.$value.$id = 'ed865ddd-1b52-4a7d-c53a-186458232869')` matches all Attributes that have a relationship to a term with the id `ed865ddd-1b52-4a7d-c53a-186458232869`.
> * `isAttribute() and any relationship in $relationships (any parent in relationship.$value.$parents (parent.$name = 'Trade'))` matches all Attributes that have a relationship to a term with an ancestor named `Trade`.

### Relationship filters and display rules

You can create Model Viewer filters and display rules based on relationships in several ways:

* Write a query based on relationships and filter or decorate matched entities
* Create a `Reference term name or property value` tag Display Rule

If you write a query that matches entities based on their relationships, you can create any type of Display Rule to make these entities stand out in a model.

There is also a unique `Reference term name or property value` tag Display Rule that displays the name or property value of a related Reference term on an entity. You can choose which term name or property value to display based on relationship labels or by specifying a single term.

For more information and instructions on creating relationship tags, see [Reference Term Name and Property Value Tags](/models/explore-and-analyse-models/filters-and-display-rules#example-4-tag-entities-with-a-reference-term-property-value).

### Example: A Complex Relationship Filter

<figure><figcaption></figcaption></figure>

Let’s say you have a Reference model that contains a hierarchically structured Data Dictionary, and you want a rule that tags any lineage entity that relates to any term that is a child or grandchild (i.e., a *descendant*) of a given term.

How would you create a Filter to show only entities related to any descendant term of `Category`?

Here is a query that matches all entities related to a descendant of `Category`:

`any r in $relationships (any p in r.$value.$parents (p.$name = 'Category'))`

This is an example of a `nested query` that contains an `any` clause nested inside another `any` clause. It shows how the combination of queries, Filters, and Display Rules can surface fine-grained information to make a complex analysis simple.

<figure><figcaption><p>Create a Filter or Display Rule from any query entered into the search bar</p></figcaption></figure>

Enter the above query into the search bar in a model and simply click the `three-dots` on the right-hand side to create a Filter that shows only matched entities, hiding everything else.

## Open a Related Reference Model

To view a Reference term in its original model context, you can open the Model Overview of a related Reference model in a separate browser tab.

<table data-header-hidden><thead><tr><th width="219.69097900390625"></th><th></th></tr></thead><tbody><tr><td>In the <em>Inspector</em> tab</td><td>Click a related term in the <code>Properties and Relationships</code> panel, then select the <code>link</code> icon next to its name in the popup menu.</td></tr><tr><td>In the <em>Reference Models</em> tab</td><td><p>There are two options here:</p><blockquote><ol><li>Click the term in the <code>Reference Model Panel</code>, then click the <code>link</code> icon to the right of the term’s name in the popup.</li><li>Click the three-dots dropdown menu to the right of the name of a term, then select <code>Go to term definition</code>.</li></ol></blockquote></td></tr></tbody></table>

<figure><figcaption><p>Open a term in the Model Overview of its original model</p></figcaption></figure>
