# Search and query a model

There are two main ways to locate entities in a model: **searching** and **querying**.

<table><thead><tr><th width="114.8719482421875"></th><th></th></tr></thead><tbody><tr><td><strong>Searching</strong></td><td>Allows you to find entities by name. In the Model Viewer, search matches entities whose name contains the string you enter in the search bar. You can refine your search by enabling options such as exact match, case-sensitivity, or searching for text within properties.</td></tr><tr><td><strong>Querying</strong></td><td>Offers more advanced options for finding entities based on fine-grained criteria. For example, you can use queries to locate entities with specific properties and relationships or lineage and hierarchy characteristics (e.g., ancestors or descendants have specific traits).</td></tr></tbody></table>

This page covers the basics of searching and querying model content, including where you can find and use these features in Solidatus.

For a comprehensive reference on the query language for use inside the Model Viewer, see the [model query language reference](/models/explore-and-analyse-models/model-query-language).

{% hint style="success" %}
Data Domains use their own query language, the [domain query language](/data-domains/explore-data-domains/query-data-domains), to return entities in a domain.

You can query an individual model’s content using the domain query language by publishing it to a domain and using the `Model =` predicate to scope the query to the particular published model.
{% endhint %}

For technical instructions on querying models and returning results via the API rather than through the user interface, see [query models via the API](/api-documentation/query-models-via-the-api).

## Where can I search for model content?

You can search a model’s contents in several places, each offering unique features depending on your objectives and needs.

<table data-header-hidden><thead><tr><th width="191.7091064453125"></th><th></th></tr></thead><tbody><tr><td><a href="/pages/bwf66p0eYCiZRRQX1vJ1">Model Viewer</a></td><td>The search bar in the <a href="/pages/bwf66p0eYCiZRRQX1vJ1">Model Viewer</a> allows you to locate entities and create Filters and Display Rules that apply to search results.</td></tr><tr><td><a href="/pages/3L8FHSUBYE4OR2NEojD2">Model Overview</a></td><td>The search box in the <em>Entities</em> tab (for a Lineage Model) or <em>Terms</em> tab (for a Reference Model) tab in the <a href="/pages/3L8FHSUBYE4OR2NEojD2">Model Overview</a> allows you to find entities and view critical information, such as properties, relationships, and lineage.</td></tr><tr><td><a href="/pages/eMIGK75bsCnfmmT5UHnq">Data Domains</a></td><td>The search and query capabilities in Data Domains allow you to locate and analyse entities in models published to a domain based on fine-grained traits, such as properties, relationships, and hierarchical characteristics.</td></tr></tbody></table>

This rest of this page focuses on searching and querying via the Model Viewer search bar. Use the links in the table to find information about searching in other areas.

## The Model Viewer search bar

The search bar in the Model Viewer is for both searching and querying a model.

The search bar is not initially visible when you open a model, but you can open it by clicking the magnifying glass in the bottom-right corner (or by hitting `Ctrl + f` in Windows, `Command + f` on a Mac, or the `.` key).

<figure><figcaption><p>Click the magnifying glass to open the search bar in the Model Viewer</p></figcaption></figure>

The search bar is used for both searching and querying. Type a string of text into the search bar and click `Enter`, or type a query to match entities that satisfy the conditions contained in the query.

<figure><figcaption><p>Click the magnifying glass to open the search bar in the Model Viewer</p></figcaption></figure>

{% hint style="success" %}
Text is automatically interpreted as a query if it is in valid query syntax; otherwise, it is interpreted as a search string.
{% endhint %}

If your query has valid syntax, the search bar confirms it and displays the number of matching entities. This helps you quickly verify that your query’s syntax is correct.

<figure><figcaption><p>The search bar tells you whether your query has valid syntax</p></figcaption></figure>

Typing text in the search bar highlights all **visible** Layers, Objects, Groups and Attributes whose name contains the typed text. In other words, entities hidden by a filter or collapsed in the model are not highlighted.

Buttons on the search bar allow you enable further options:

> * Make the search case-sensitive (if you click this button, searching for *Amt* will not match *amt*)
> * Match an exact word or phrase (if you click this button, searching for *Policy* will not match *Policy Number*)
> * Extend the search into collapsed entities (this highlights any visible entity that contains a matching entity, but it will not expand collapsed entities automatically).
> * Extend the search to include property values.
> * Cycle through the results using the up and down arrows

## Useful facts about search

The search bar is a powerful tool for quickly locating entities in a model. Here are some important facts about how it works.

As you cycle through results using the up and down arrows:

* The result you are currently on is highlighted in **brown**, while the rest of the matched entities remain **green**.
* The search bar displays which result you are currently on, e.g., “1 of 3” if there are three results and you are on the first one.
* Results that are within a collapsed entity are expanded to make the matching entity visible. The entity is collapsed again when you move on to the next result, change the search query, or close the search.

<figure><figcaption><p>The search bar finds entities that match the name or a query</p></figcaption></figure>

When a search is active (i.e., matched entities are highlighted in the model), the `three-dots` button at the end of the search bar allows you to:

> * Select all entities matched by the search (useful for bulk-editing properties)
> * Create a [Filter](/models/explore-and-analyse-models/filters-and-display-rules#filters-show-and-hide-model-content) that shows or hides entities matched by the search
> * Create a [Display Rule](/models/explore-and-analyse-models/filters-and-display-rules#display-rules) on entities matched by the search
> * Use the [Query Builder](#the-query-builder) to create a query (starting with the current search bar contents)

{% hint style="success" %}
The *Create Filter* and *Create Display Rule* options will create and save a new query every time you use them. For an alternative approach, see [Filtering search results](/models/explore-and-analyse-models/filters-and-display-rules#filtering-search-results).
{% endhint %}

The [Models Query Language](/models/explore-and-analyse-models/model-query-language) is more powerful than text search for retrieving and displaying fine-grained information in a model. For example: `isAttribute() and Owner = 'Dan'` will locate every entity that

> * is an Attribute
> * has a property called “Owner” with the exact value “Dan” (it is also possible to search for partial property values using the predicate `contains`).

## The Query Builder

The search bar gives you access to the **Query Builder**, a tool and reference for building valid queries in the Model Viewer.

The Query Builder is useful for creating queries that can be used in the search bar, or saved as [Filters](/models/explore-and-analyse-models/filters-and-display-rules#filters-show-and-hide-model-content) or [Display Rules](/models/explore-and-analyse-models/filters-and-display-rules#display-rules).

To open the Query Builder from the search bar:

> * Activate the search bar by clicking the magnifying glass or hitting ctrl+f.
> * Click the `three dots` button on the right-hand side of the search bar, and select `Open query builder`.

{% hint style="success" %}
You can also open the Query Builder from the dialog for creating a new Filter or Display Rule.
{% endhint %}

The Query Builder contains two tabs to help you build queries:

* `Quick Query` is a graphical interface with buttons for building simple queries based on entity types and properties.
* `Advanced` is a field that you can write queries in or populate with pre-built example queries called `Snippets`. The `Advanced` function also has a tab with a comprehensive list of MQL predicates and components.

### Quick Query

`Quick Query` provides menus and buttons for creating simple queries. You can retrieve entities by entity type, possession of a property with a particular name, and possession of a property with a particular value.

In this example, we would like to find Objects or Attributes that have a property `Owner` with the value `Dan`.

<figure><figcaption><p>The Query Builder being used to find entities with a chosen property</p></figcaption></figure>

Once you’ve selected some options in `Quick Query`, you can view the full syntax of your query formulated in the query language in the `Advanced` tab. This shows you the raw query, which Solidatus generates from the options you selected.

<figure><figcaption><p>The Query Builder, showing the generated query</p></figcaption></figure>

### Advanced

The `Advanced` tab contains a field that you can write a query directly into. If the syntax is valid, the field’s border turns green and you’ll see a green checkmark.

You can use `Snippets` and the `Reference` in the `Advanced` tab to help you build your query.

<figure><figcaption><p>Click a Snippet to use it in a query, or consult the query reference</p></figcaption></figure>

You can click an example `Snippet` to input it into the field, or you can use the `Reference` to find a predicate to use in a query.

The `Reference` tab contains a comprehensive list of predicates and components that you can use in queries, along with a description of each predicate.

{% hint style="success" %}
If your query is complex (e.g., it contains multiple logical operators), click `FORMAT` to separate distinct components into distinct lines for easier reading, interpretation, and trouble-shooting.
{% endhint %}
