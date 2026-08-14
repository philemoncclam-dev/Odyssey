# Search a Data Domain

As a **Domain Explorer**, your aim is likely to find information you need quickly and easily, and perhaps to discover relevant information you may not have been looking for initially.

This page is designed to help you understand what you can find – and how to find things – using the search bar on the homepage of a Data Domain.

<figure>../_images/domain-search-bar.png<figcaption></figcaption></figure>

\\

You can also enter **queries** in the search bar to retrieve entries in a domain. For information on querying, see [Data Domain Query Language](/data-domains/explore-data-domains/query-data-domains).

## Data Domain terminology

Entries in a domain represent either a single data **entity** or reference **term**.

<table data-header-hidden><thead><tr><th width="123.21728515625"></th><th></th></tr></thead><tbody><tr><td><strong>Entities</strong></td><td>Typically represent physical data elements like schemas, databases, tables, columns, transformations, reports, files, etc. They are the components – sources and targets – of data lineage flows.</td></tr><tr><td><strong>Terms</strong></td><td>Typically represent semantic terms in a business glossary, regulatory policies, governance frameworks, or other taxonomies that classify and document data elements.</td></tr></tbody></table>

{% hint style="success" %}
The search bar on the homepage of a Data Domain cannot be used to search for Data Assets. For information on searching for assets, see [Search Data Assets](#search-data-assets).
{% endhint %}

## Search a Data Domain

<figure>../_images/catalog-search-homepage.png<figcaption></figcaption></figure>

\
Searching a Data Domain should be familiar from searching the internet or finding a product to purchase on a website.

The search bar is located directly and prominently at the top of a Data Domain homepage.

Type a word or phrase that matches the name of what you are looking for into the search bar and press `Enter` to show the results.

You can make you search more precise using the [Domain Query Language](/data-domains/explore-data-domains/query-data-domains), which allows you to retrieve entries by name, property, relationship, model, and hierarchy.

## Understand Search Results

The search function matches all entries whose **name**, **property names**, and **property values** *contain* the text string entered in the search bar.

The “**Contains**” logic in this context is that the search text string must appear

* at the start of a name, property name, or property value
* at the start of a distinct string in a multi-string name, property name, or property value
* in a distinct, tokenisable segment of a name, property name, or property value

A few examples can illustrate the fuzzy logic according to which the search function returns entries in a domain.

A search for `system` returns entries with the name, property names, or property values `system`, `systemmortgage`, and `mortgage system`. The results also include `mortgageSystem`, `mortgage_system`, and `mortgage1system` where the search term can be distinguished from the rest of the text by a capital letter or other unique character.

The results do **not** include `mortgagesystem` because the text string `system` is not a tokenisable component of the string *mortgagesystem* (i.e., the start of `system` is not distinguishable within the string).

If you enter multiple distinct words into the search field, the results include all entries that contain **any** of those distinct strings. For example, `System catalog` will return `system`, `catalog`, and `catalogued_ids`. However, as in the previous example, it will not return `mortgagecatalog` or `mortgagesystem`.

The domain text search is **not case-sensitive**, and it includes results where the specified text is only part of a name or value. For example, a search for `sys` would return these results:

> * `System_Stats`
> * `System catalog`
> * `Mortgage System`
> * every entry with a property called `System_ID`

Search results appear in a list that shows the clickable name for an entry below the path of the entry in the metadata hierarchy of its original model.

<figure>../_images/catalog-search-results.png<figcaption></figcaption></figure>

Clicking the entry name takes you to its [domain page](/data-domains/explore-data-domains/examine-an-entry-page), where you can investigate comprehensive details, focused lineage, relationships, and further metadata.

Icons next to entries in search results results display whether an entry is a lineage **entity** or reference **term**.

<table data-header-hidden><thead><tr><th width="81.74102783203125"></th><th></th></tr></thead><tbody><tr><td></td><td>This represents a Reference term, typically containing semantic, governance, reference, or regulatory metadata.</td></tr><tr><td></td><td>This represents a Lineage entity, typically representing a data element such as a schema, database, table, column, file, field, etc.</td></tr></tbody></table>

## Search by Entity or Term

The dropdown to the left of the search bar allows you to restrict your search to only **entities** or **terms** in the Data Domain.

{% hint style="success" %}
Reference **terms** can perform the function of classifying entries in a Data Domain. If you search for a term, you can find all entities related to the term on the term’s domain page. This is a quick, easy way to find all entries belonging to a particular business category.
{% endhint %}

Additionally, you can filter the results of a search to show only those entries related to a Reference term.

## Filter Search Results

You can use search filters to narrow the results of a text search (or query) to find a specific resource.

You can filter the results of a search using two filter menus located on the top right-hand corner of the search results list: `Context` and `Relationship`. The filter menus distinguish between Context Reference model terms and terms in Reference models that are not designated as Context models in the domain.

<figure>../_images/catalog-search-filters.png<figcaption></figcaption></figure>

{% hint style="success" %}
Context and Reference filters are terms in Reference models and designated Context Reference models in a domain.
{% endhint %}

Both menus allow you to filter your search results so that only entities with existing Reference relationships to the selected terms are shown.

Both menus are automatically and dynamically populated by Context and Reference term hierarchies that have existing relationships to **any** of the returned results of the search.

For example, if your search for `mortgage system` returned three results – `mortgagesystem`, `system_id`, and `mortgageapplicant_id` – the **Filters** menus contain only terms (and their hierarchies) that have a direct relationships to **any** of the search results.

{% hint style="success" %}
When a filter is selected, an entry is shown in the results if it **or any of its ancestors** is related directly to the filter term **or to a sub-term of the selected filter term** (see [Direct, Inherited, and Inferred Relationships](#direct-inherited-and-inferred-relationships)).
{% endhint %}

| [**Filter by Context**](#filter-by-context)           | Show only results that belong to a particular Context classification category. You can use this to find entities that appear embedded in a particular Data Map visual grouping category. |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Filter by Relationship**](#filter-by-relationship) | Show only results with existing relationships to one or many terms in published Reference models.                                                                                        |

Tick the box next to a term to activate it as a filter. Notice that selecting a term automatically selects all of the term’s descendants. This indicates that the results include entities with **inferred** relationships to the selected term (see [Direct, Inherited, and Inferred Relationships](#direct-inherited-and-inferred-relationships)).

{% hint style="success" %}
When multiple Relationship filters are selected, or when both Context and Relationship filters are selected, only entries related to **all** selected terms will appear in the search results.
{% endhint %}

### Direct, Inherited, and Inferred Relationships

When a search filter is activated, entities with either **direct**, **inherited**, or **inferred** relationships to selected filter terms are shown in the search results.

{% hint style="success" %}
Remember that search results have to match the text search as well as any applied filters to be listed in the results. There may be entities that are related to all selected filters terms, but they are not shown because their name, properties, or property values do not contain the search string.
{% endhint %}

<table data-header-hidden><thead><tr><th width="220.5404052734375"></th><th></th></tr></thead><tbody><tr><td><strong>Direct Relationship</strong></td><td>A relationship an entity itself has to a given Reference term.</td></tr><tr><td><strong>Inherited Relationship</strong></td><td>A relationship an entity has to a Reference term when its ancestor is directly related to the term.</td></tr><tr><td><strong>Inferred Relationship</strong></td><td>A relationship an entity has to a Reference term when it is directly related to a descendant of the term, but not directly to the term itself.</td></tr></tbody></table>

{% hint style="success" %}
Inherited and inferred relationships are also collectively referred to as **indirect** relationships.
{% endhint %}

<figure>../_images/direct-inherited-inferred.png<figcaption><p>Direct vs. Inherited vs. Inferred Relationships</p></figcaption></figure>

### Filter by Context

The **Context** filter menu displays terms in Reference models that you have designated as *Context* models in the Data Domain settings.

The Context filter menu is dynamic, meaning the terms available to select as filters depend on the returned results of a text search or query. When you’ve executed a search or query, the menu is populated by terms that have direct, inherited, or inferred relationships to any of the results.

{% hint style="success" %}
Even if multiple Context models and terms are shown in the filters menu, you can only activate one Context filter term at a time.
{% endhint %}

When you select a Context filter term, the filter menu name changes to display the name of the selected term.

<figure>../_images/active-context-filter.png<figcaption></figcaption></figure>

**When you select a Context term to use as a filter, all descendant terms are also automatically selected.**

This indicates that entities will appear in the results if they have a **direct** relationship to the selected term or any of its descendants (i.e., they have an **inferred** relationship to the selected term).

The results will also include entities with **inherited** relationships to the selected term or its descendants.

{% hint style="success" %}
You can filter your search results at a more fine-grained level by selecting terms lower down in the *Context* term hierarchy.
{% endhint %}

### Filter by Relationship

The Relationship filters menu is populated by Reference terms that have direct, inherited, or inferred relationships to any of the results of a text search or query.

Selecting a term narrows search results to those that have direct or inherited relationships to the term or to the term’s descendants, as indicated by the fact that the selection box next to all descendant terms is automatically ticked in grey.

{% hint style="success" %}
Unlike the Context filters, you can activate multiple active Relationship filters at a time.

If you activate more than one Reference term filter, results only include entities related (directly or indirectly) to **all** selected terms.
{% endhint %}

When you select Relationship filter terms, the menu changes to display the number of terms selected.

<figure>../_images/active-relationship-filters.png<figcaption></figcaption></figure>

{% hint style="success" %}
You can filter your search results at a more fine-grained level by selecting terms lower down in the Reference term hierarchy.
{% endhint %}

## Search Data Assets

To search Data Assets, you must use the search bar in the Data Assets section within a domain.

You can access the Data Assets search bar by clicking the arrow on the top-right side of the Data Assets tile on the domain homepage.

<figure>Access the Data Assets search bar from the Data Assets tile on the domain homepage<figcaption></figcaption></figure>

Data Asset search only returns assets whose name *exactly* matches the text string entered in the search bar. It does not use fuzzy logic like the search bar on the homepage of a Data Domain, and you cannot query Data Assets.

<figure>../_images/data-asset-search.png<figcaption></figcaption></figure>

### Asset search filtering

You can filter the Data Asset list or the results of a Data Asset search by source technology.

Click **Technology** in the top-right corner of the Data Assets list to view the menu of available filters, which is automatically populated by all unique `Technology` properties of assets in the domain.

<figure>../_images/asset-search-filters.png<figcaption></figcaption></figure>

{% hint style="success" %}
If an asset has a `Technology` property value that matches an applied filter, its entire hierarchy is shown in the results, even if its ancestors or descendants do not have a value for the property.
{% endhint %}
