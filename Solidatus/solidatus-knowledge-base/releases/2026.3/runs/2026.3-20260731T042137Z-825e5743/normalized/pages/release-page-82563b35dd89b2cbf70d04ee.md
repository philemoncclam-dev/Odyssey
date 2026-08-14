# Examine Data Assets

The Data Assets functionality is a mechanism for grouping entities in the same model or in separate models by their **Fully Qualified Name (FQN)**, which is a unique signature indicating their real-world data element identity (see [Data Assets 101](/models/understand-solidatus-models/data-assets-101#asset-ids-fqns-and-asset-hierarchies) for information on how FQNs are assigned).

When you publish models containing Data Assets to a domain, the domain consolidates information about assets from all published models onto a single page, allowing you to explore and analyse them in one place.

Data Asset pages can be accessed through a dedicated Data Assets section in the domain, which you can navigate to via the arrow on the top-right side of the Data Assets tile on the domain homepage.

<figure>Access the Data Assets section through the Data Assets tile on the domain homepage<figcaption></figcaption></figure>

## The Data Assets section

The Data Assets section contains an explorable list of all Data Assets in a domain, which can be searched and filtered by source technology.

<figure>List of top-level Data Assets in a domain<figcaption></figcaption></figure>

Assets are listed by their **Asset ID**. Initially, only top-level assets are shown, but you can expand the hierarchies to explore all sub-assets.

<figure>Expand top-level assets to explore their sub-assets<figcaption></figcaption></figure>

### Asset types

If assets have a value for the `Type` asset property, an icon representing the asset's type is shown next to its Asset ID. Currently, icons are shown for the following Data Asset types:

* schema-icon : Schema
* table-icon : Table
* column-icon : Column

## Search Data Assets

You can search for assets by *Asset ID* using the search bar at the top of the Data Assets section.

Data Asset search only returns assets whose Asset ID *exactly* matches the text string entered in the search bar, with case-sensitivity. It does not use fuzzy logic like the search bar on the homepage of a Data Domain, and you cannot query Data Assets.

<figure>../_images/data-asset-search.png<figcaption></figcaption></figure>

## Asset search filtering

You can filter the Data Asset list, or the results of a Data Asset search, by source technology.

Click **Technology** in the top-right corner of the Data Assets list to view available filters, which are automatically populated by all unique `Technology` properties of assets in the domain.

<figure>../_images/asset-search-filters.png<figcaption></figcaption></figure>

{% hint style="success" %}
If an asset has a `Technology` property value that matches an applied filter, its entire hierarchy is shown in the results, even if its ancestors or descendants do not have a value for the property.
{% endhint %}

## Examine an Asset Page

Click an asset in the Data Assets list to open its dedicated page in the domain.

<figure>../_images/data-asset-properties.png<figcaption></figcaption></figure>

Data Asset pages have the same structure as [entity pages](/data-domains/explore-data-domains/examine-an-entry-page) in a domain, with the following tabs:

| **Quick links to asset page tabs**          |
| ------------------------------------------- |
| [Overview](#overview)                       |
| [Sub-assets](#sub-assets)                   |
| [Lineage](#lineage)                         |
| [Asset Relationships](#asset-relationships) |

## Overview

The **Overview** is the default tab on an asset page. It displays the values of the asset’s *Technology*, *Type*, and *Asset ID* properties in tiles at the top of the page. The **Properties** section displays a consolidated list of properties an asset has across all models published to the domain.

<figure>../_images/data-asset-properties.png<figcaption></figcaption></figure>

If an asset has a value for a property in multiple models, the property can be expanded to show the values in each model separately. You can click a model name to open and explore the model in a separate browser tab.

You can search properties using the search bar at the top of the list. The property search matches both property names and values, and it uses fuzzy logic, which enables you to match partial strings as well as whole text.

You can filter the list of properties by model using the **Model** filter in the top-right corner of the list. Filtering by models means only properties recorded for an asset in the selected models are shown. The list of available filters is automatically populated with all unique models published to the Domain that contain the asset.

## Sub-assets

The **Sub-assets** tab displays a list of all assets below the current asset in its *Asset hierarchy*. All levels below (i.e., children, children of children, etc.) are shown. You can select sub-assets in the list to open their asset pages in the domain.

<figure>../_images/sub-assets-tab.png<figcaption></figcaption></figure>

In the example pictured here, the asset `Core Banking System` is a Snowflake table that has six columns, which are listed as sub-assets.

{% hint style="success" %}
This tab shows all sub-assets captured across the models in the domain. So, the list may contain more sub-assets than are visible in a particular model.
{% endhint %}

## Lineage

The **Lineage** tab displays the domain Data Map with a focused trace applied to the current asset.

The focused trace filters the Data Map to show only entities connected upstream and downstream by any degree of separation (or number of “hops”) to the asset you are viewing. This allows you to explore the asset’s lineage in the context of the domain.

When you select an entity in the Data Map, you can use the side panel that appears on the right side of the screen to view properties, relationships, and a list of immediate (one “hop” away) sources and targets of lineage.

{% hint style="success" %}
You can select sources or targets in the list to view their sources and targets, thereby allowing you to examine each “hop” along a lineage trace.
{% endhint %}

## Asset Relationships

The **Asset relationships** tab lists all terms the asset is related to in Reference models published to the domain.

For each related term, you can view:

* The label of the relationship to the asset
* The original source model the relationship is captured in
* The term’s properties in its original source Reference model

<figure>../_images/asset-relationships.png<figcaption></figcaption></figure>

{% hint style="success" %}
If an asset relationship to a term is captured in multiple models, the entry for the relationship can be expanded to view the relationship in each model, and you can click each model name to open it in a separate browser tab with a focused trace applied to the asset.
{% endhint %}
