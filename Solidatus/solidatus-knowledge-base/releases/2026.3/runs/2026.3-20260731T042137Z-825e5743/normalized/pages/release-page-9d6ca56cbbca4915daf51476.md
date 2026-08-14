# Data Assets in domains

Data Assets can be viewed in several areas in Data Domains and Data Maps.

When models are published to a domain, any entities with the same FQN (Fully Qualified Name) are automatically consolidated into a single Data Asset in the domain. This consolidation enables cross-model lineage visualisation in the Data Map, unified property views, and comprehensive relationship listings for each Data Asset.

{% hint style="success" %}
See Data Assets 101 for more information about Data Assets and configuring assets for your domains.
{% endhint %}

## Data Asset Homepage Tile

<figure>../../_images/data-assets-tile-ui.png<figcaption></figcaption></figure>

1. **Asset count**: Total number of unique Data Assets across all published models in the domain
2. **Browse arrow**: Click arrow to access the dedicated Data Assets section of the domain

## Data Assets Section

<figure>../../_images/data-assets-list-ui.png<figcaption></figcaption></figure>

1. **Asset ID list**: Data Assets listed by Asset ID, initially showing only top-level assets
2. **Asset type icons**: Visual indicators for asset types (Schema, Table, Column) when Type property is set
3. **Expand/collapse controls**: Click to show or hide sub-assets in the asset hierarchy
4. **Search bar**: Enter exact Asset ID matches (case-sensitive, no fuzzy matching)
5. **Technology filter**: Filter assets by their Technology property values

### **Asset Type Icons:**

* schema-icon Schema
* table-icon Table
* column-icon Column

## Data Asset Search and Filtering

<figure>../../_images/data-asset-search.png<figcaption></figcaption></figure>

The Asset search function requires exact Asset ID matches (case-sensitive).

<figure>../../_images/asset-search-filters.png<figcaption></figcaption></figure>

The **Technology filter menu** is automatically populated with unique Technology property values of assets in the domain.

When a Technology filter is applied, entire asset hierarchies are shown **if any asset in the hierarchy matches**.

{% hint style="success" %}
Data Asset search uses exact matching only - it does not support fuzzy logic like the domain homepage search, and Data Assets cannot be queried using the DQL.
{% endhint %}

## Data Asset Entry Page

<figure>../../_images/data-asset-properties-ui.png<figcaption></figcaption></figure>

1. **Asset breadcrumbs**: Shows the Data Asset’s hierarchical path within the domain structure
2. **Asset FQN**: The FQN unique identifier of the Data Asset
3. **Asset page tabs**: Navigate between Overview, Sub-assets, Lineage, and Asset Relationships tabs
4. **Property search**: Search bar for finding properties by name or value (supports fuzzy matching)
5. **Model filter**: Filter properties to show only those from specific models published to the domain
6. **Consolidated properties**: Properties from all published models containing this Data Asset, expandable to show model-specific values

{% hint style="success" %}
Data Asset entry pages consolidate information from all models where the asset appears, providing a unified view of properties, relationships, and lineage.
{% endhint %}

## Data Asset Page Tabs

* **Overview Tab** (pictured above) : Displays Technology, Type, and Asset ID properties in tiles, plus consolidated properties from all published models.
* [Sub-assets tab details](/data-domains/explore-data-domains/examine-data-assets#sub-assets) : Shows all assets below the current asset in the hierarchy across all published models.
* **Lineage Tab** : Displays the domain Data Map with a focused trace applied to show all upstream and downstream connections.
* [Asset relationships tab details](/data-domains/explore-data-domains/examine-data-assets#asset-relationships): Lists all Reference terms the asset is related to, including relationship labels and source models.

#### Sub-assets Tab Details

<figure>../../_images/sub-assets-tab-ui.png<figcaption></figcaption></figure>

1. **Sub-asset hierarchy**: All assets below the current asset across published models
2. **Clickable sub-assets**: Select items to navigate to their dedicated asset pages
3. **Search sub-assets**: Search bar for finding sub-assets by exact Asset ID (case-sensitive, no fuzzy matching)

If sub-assets have their own sub-assets, the top-level sub-asset is shown and expand/collapse controls allow you to show or hide nested levels.

{% hint style="success" %}
Because domains consolidate sub-assets across published models, the list might show more sub-assets than are visible in any single model.
{% endhint %}

## Asset Relationships Tab Details

<figure>../../_images/asset-relationships.png<figcaption></figcaption></figure>

1. **Related terms list**: All Reference terms the asset is connected to across published models
2. **Relationship labels**: The type of relationship between asset and term
3. **Source model information**: Shows which model contains each relationship
4. **Term properties**: Properties of related terms from their source Reference models
5. **Expandable relationships**: When relationships exist in multiple models, expand to see details for each

## Data Assets in Data Maps

<figure>../../_images/data-assets-datamap-ui.png<figcaption></figcaption></figure>

1. **Blue connection lines**: Indicate that connected entities are the same Data Asset across different models
2. **Asset entity boxes**: Data Assets appear as standard entities with grey headers in Data Maps
3. **Asset side panel**: When an asset is selected, the side panel shows consolidated Asset information

Cross-model lineage flows between assets in multiple models are automatically displayed when Data Assets are published to a domain.=

{% hint style="success" %}
Blue lines in Data Maps are automatically generated when models containing the same Data Asset are published to a domain, enabling you to track cross-model lineage visually.
{% endhint %}
