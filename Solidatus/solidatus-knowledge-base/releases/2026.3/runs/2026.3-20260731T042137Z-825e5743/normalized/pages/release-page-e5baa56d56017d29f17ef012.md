# Explore a Data Map

A Data Map shows the complete data lineage landscape of a Data Domain, consolidating all entities, assets, and flows from published models into a single, explorable visualization.

## Quick start

**Open a Data Map:**

* Click `DATA MAP` on the domain homepage for the full domain view
* Use the Lineage tab on any entity page for focused lineage traces
* Click saved views from the Data Map Views tile

**Basic navigation:**

* Scroll up or down: Mouse wheel
* Pan: Click and drag anywhere
* Navigation buttons: Top-right corner for zoom and re-center
* Expand: Click down arrow on an entity

## Understand what you see

**Entity types in Data Maps**

*Physical entities*: Your actual data elements and Data Assets (databases, tables, files) from Lineage models are marked with grey headers.

*Context groupings*: Business categories that organise your lineage (departments, products, processes) with expandable plain boxes.

*Lineage flows*: Arrows connecting entities show how data moves and transforms across systems.

*Data Asset links*: Blue, two-way transitions indicate that two connected physical entities are the same Data Asset.

**Visual cues:**

<table data-header-hidden><thead><tr><th width="371.8343505859375"></th><th></th></tr></thead><tbody><tr><td></td><td>Grey header indicates a physical data entity</td></tr><tr><td></td><td>A plain box indicates a context grouping</td></tr><tr><td></td><td>Chevron arrows indicate expandable/collapsable lineage entities</td></tr><tr><td></td><td>Collapse icons indicate that a context grouping can be collapsed</td></tr></tbody></table>

Grey transitions indicate lineage flow between source and target entities.



Thick grey transitions indicate lineage between descendants of entities.



Blue, two-way transitions indicate connected entities are the same Data Asset.



## Navigate a Data Map

You can use the standard zooming capabilities provided by your browser or a scroll button on your mouse to zoom in and out of a Data Map.

You can also drag the map around with your mouse by clicking anywhere on the screen and dragging.

If you’re using a touchscreen, you can use your fingers to pinch and zoom or drag the image around.

Data Maps also contain a set of navigational buttons in the top right that allow you to zoom or re-center the Data Map on your screen and reset to the original zoom settings.

<figure>Navigational buttons allow you to position the Data Map on your screen<figcaption><p>Navigational buttons allow you to position the Data Map on your screen</p></figcaption></figure>

{% hint style="success" %}
If something in a Data Map is selected or a focused trace is applied, the re-center button will move it to the middle of the screen and restore original zoom settings.
{% endhint %}

## Organise lineage by context

Data Maps can display lineage in two ways:

**Physical lineage only**: Shows raw technical content from Lineage models

**Business context applied**: Groups lineage into meaningful business categories for easier interpretation

Here is a Data Map that shows only physical lineage; that is, no context has been applied to organise the layout of the data landscape.

<figure>The view of a Data Map with no context<figcaption><p>The view of a Data Map with no context</p></figcaption></figure>

By contrast, see what happens when you apply the *Business Landscape* context to organise the same Data Map.

<figure>View same lineage through context groupings<figcaption><p>View same lineage through context groupings</p></figcaption></figure>

When context is applied, click grouping boxes to expand and explore the technical details within business categories.

<figure>Expand context groupings to view embedded content<figcaption><p>Expand context groupings to view embedded lineage</p></figcaption></figure>

**Change context**: Use the Context dropdown (top-left) to switch between different business perspectives or return to physical lineage view.

## Explore lineage details

While exploring a Data Map, you can focus on the lineage of a single entity by selecting the entity and clicking the datamap-show-trace-icon button.

<figure>Click the target icon to show only lineage involving selected entity<figcaption><p>Click the target icon to show only lineage involving selected entity</p></figcaption></figure>

Select any item in a Data Map to view its properties, relationships, and sources and targets of lineage in a side panel on the right side of the window. If you selected a Data Asset, you can see its Asset properties in the side panel.

<figure>Popout displays entity properties and description<figcaption><p>Popout displays entity properties and description</p></figcaption></figure>

Click the **TARGET** icon to focus the Data Map on the selected entity’s lineage.

Click **VIEW ENTITY** to go to the entity’s domain page.

<figure>../../_images/datamap-sources-targets.png<figcaption></figcaption></figure>

Click `SOURCES/TARGETS` to view lineage connections to and from the selected entity.

Note that this list does not include entities connected via other entities or inferred lineage connections (children or parents of sources and targets).

You can select an item in the list to select that entity in the Data Map, which updates the side panel to show that entity’s direct sources and targets.

{% hint style="success" %}
You can navigate the full lineage of an entity by tracking sources using the pop-out in this way, or by following connections in the map to find downstream sources.
{% endhint %}

## Data Assets in a Data Map

Data Assets in Data Maps appear the same as non-Data Asset entities: as boxes with a grey header.

<figure>Blue transitions show that two items are the same Data Asset<figcaption><p>Blue transitions show that two items are the same Data Asset</p></figcaption></figure>

Blue, two-way transitions in a Data Map indicate that two connected items are the **same Data Asset**.

{% hint style="success" %}
Blue transitions represent cross-model lineage connections, and they are generated automatically when you publishe models that contain the same Data Asset to a domain.
{% endhint %}

You can also find out if something is a Data Asset by looking at the side panel that opens when you select it.

For Data Assets, the side panel has an **Asset information** section showing asset properties.

Logos and icons for *Technology* and *Type* asset properties are also displayed if values for these properties have been entered.

You can also see the Data Asset’s lineage in the **Sources/Targets** tab in the side panel.

## Advanced features

[**Saved Views**](/data-domains/explore-data-domains/save-and-share-data-map-views)

Save specific snapshots for quick access to important lineage perspectives.

[**Display Settings**](/data-domains/data-maps/data-map-display-rules)

Create visual tags that highlight entities based on properties, relationships, or other criteria. Use tags to surface data quality issues, governance status, or business classifications.

Here, we have two tags: one appears on entities that failed a DQ test, and one appears on entities that passed the DQ test.

<figure>Example: tags can highlight data quality test results to analyse upstream effects<figcaption><p>Example: tags can highlight data quality test results to analyse downstream effects</p></figcaption></figure>

## Next steps

* Learn about [Data Map Display Settings](/data-domains/data-maps/data-map-display-rules) to tag Data Maps with critical metadata and query results
* See [Save and Share Data Map Views](/data-domains/explore-data-domains/save-and-share-data-map-views) for saving and sharing perspectives on a Data Map
* Review [Model Architecture for Data Maps](/data-domains/data-maps/prepare-models-for-data-maps) if lineage or context grouping isn’t as expected
