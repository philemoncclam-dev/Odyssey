# Examine Data Assets

Data Assets in a model can be explored and examined in a variety of ways:

* [Select an entity](#select-entities-to-view-asset-properties) and open the **INSPECTOR** sidebar tab to view its asset properties (if it has them).
* [Query asset properties](#query-asset-properties) using the `SOL.` format for asset property keys
* [Create filters and display rules](#create-filters-and-display-rules-for-assets) based on asset properties
* Use the [Data Assets sidebar tab](#the-data-assets-sidebar-tab) to explore Data Asset hierarchies in the open model

## Select entities to view asset properties

To view an asset's properties, select it in the Model Viewer and then open the **INSPECTOR** sidebar tab.

Asset properties are displayed in their own section of the `Properties and Relationships` panel.

<figure><figcaption></figcaption></figure>

## Query asset properties

Asset properties are shown as Asset ID, Technology, and Type in the `Properties and Relationships` panel, but they are stores as SOL.AssetID, SOL.Technology, and SOL.Type in the underlying model data

{% hint style="info" %}
You cannot query FQNs, only Asset IDs and Technology and Type properties.
{% endhint %}

To query asset properties using the model query language, you must reference the asset property key using the `SOL.` format:

| Asset property | Asset property key    | Example query                        |
| -------------- | --------------------- | ------------------------------------ |
| Asset ID       | *SOL.AssetID*         | \[SOL.AssetID] = 'customer\_id'      |
| Technology     | *SOL.AssetTechnology* | \[SOL.AssetTechnology] = 'Snowflake' |
| Type           | *SOL.AssetType*       | \[SOL.AssetType] = 'Column'          |

### Create filters and display rules for assets

You can create filters and display rules for assets by using the SOL. asset property key in an underlying query.

Let's say you want to tag all assets with the value of their Type asset property.

1. Click **Rules** in the toolbar and select **+ NEW DISPLAY RULE**
2. Enter the query `hasProperty([SOL.AssetType])` or `Not isEmpty(SOL.AssetType)` in the query field
3. Select **TAG** for the display rule type
4. Select **PROPERTY VALUE** for the tag type
5. Find SOL.AssetType in the property dropdown
6. Select **AUTO FROM PROPERTY** in the **Background** setting to set a unique color for each unique property value.

## The Data Assets sidebar tab

The Data Assets tab is useful for viewing Data Assets that exist in the open model and quickly locating them.

The tab contains one panel — the Data Assets panel — that displays all asset hierarchies in the model in a list. Additionally, you can view asset properties and search for assets using a pop-out menu that appears when you select an asset in the list.

The Data Assets tab is located at the bottom of the sidebar in the Model Viewer, below the Reference Models tab.

When an Asset ID is given to an entity, it becomes a Data Asset and is then listed in the Data Assets panel.

<figure>Data Assets tab<figcaption><p>Data Assets tab</p></figcaption></figure>

Data Assets are listed in the panel as expandable *Asset hierarchies*, so you can view each asset in relation to ancestor and descendant assets.

{% hint style="success" %}
The Data Assets tab only lists top-level assets initially, but you can expand the top-level assets to view sub-assets.
{% endhint %}

When you hover over an asset in the Data Assets tab, the asset and its ancestor assets are highlighted orange in the Model Viewer canvas. This allows you to find the asset in the model.

{% hint style="success" %}
Using the Data Assets tab to find data assets in your model is especially useful when Asset IDs are different from entity names.
{% endhint %}

When you select an asset in the Data Assets tab, the properties of that asset are displayed in a popout menu. You can’t edit the properties from here, but you can locate the asset in the model, then select it and edit its properties in the `Properties and Relationships` panel in the Inspector tab.

<figure>Data Assets popout menu<figcaption><p>Data Assets popout menu</p></figcaption></figure>

The popout menu contains a useful search function, which enters a query in the Model Viewer search bar that matches all entities in the model that are the asset (i.e., they have the same FQN). The query matches assets using entity IDs of entities known to have the asset's FQN in the model.

<figure>Create a display rule from the Data Assets popout menu<figcaption><p>Create a display rule from the Data Assets popout menu</p></figcaption></figure>

{% hint style="success" %}
If you want to create a display rule or filter for a specific asset, use the search function int he Data Asset popout menu to build the underlying query, then copy the query or create a display rule or filter directly from the search bar.
{% endhint %}
