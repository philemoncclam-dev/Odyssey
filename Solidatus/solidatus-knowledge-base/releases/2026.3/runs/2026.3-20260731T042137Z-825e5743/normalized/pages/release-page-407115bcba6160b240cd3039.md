# Data Assets tab

The Data Assets tab is useful for viewing Data Assets that exist in the open model and quickly locating them.

The tab contains one panel — the Data Assets panel — that displays all assets in the model in a list. Additionally, you can view asset properties and search for assets using a pop-out menu that appears when you select an asset in the list.

The Data Assets tab is located at the bottom of the sidebar in the Model Viewer, below the Reference Models tab.

## The Data Assets panel

When an Asset ID is given to an entity, it becomes a Data Asset and is then listed in the Data Assets panel.

<figure>Data Assets tab<figcaption><p>Data Assets tab</p></figcaption></figure>

Data Assets are listed in the panel as expandable *Asset hierarchies*, so you can view each asset in relation to parent and child assets.

{% hint style="success" %}
The Data Assets tab only lists top-level assets initially, but you can expand the top-level assets to view sub-assets.
{% endhint %}

When you hover over an asset in the Data Assets tab, the asset and its ancestor assets are highlighted orange in the Model Viewer canvas. This allows you to see where the asset is in the model.

{% hint style="success" %}
Using the Data Assets tab to find data assets in your model is especially useful when Asset IDs are different from entity names.
{% endhint %}

When you select an asset in the Data Assets tab, the properties of that asset are displayed in a popout menu. You can’t edit the properties from here, but you can locate the asset in the model, then select it and edit its properties in the `Properties and Relationships` panel in the Inspector tab.

<figure>Data Assets popout menu<figcaption><p>Data Assets popout menu</p></figcaption></figure>

The popout menu contains a useful search function, which enters a query in the search bar that matches all entities in the model that are the asset (i.e., they have the same FQN).

{% hint style="success" %}
If you want to create a display rule or filter for a specific asset, use the search function to build the underlying query, then copy the query or create a display rule or filter directly from the search bar.
{% endhint %}

<figure>Create a display rule from the Data Assets popout menu<figcaption><p>Create a display rule from the Data Assets popout menu</p></figcaption></figure>
