# Tools tab

The Tools tab contains useful tools for selecting items, adjusting what you see in a model, and customising how lineage is shown.

The selection options are especially useful for bulk editing transitions, entity types, or properties and reference relationships of specific entity types. Once the specific entities you want are selected in the Model Viewer, you can edit their properties and reference relationships in bulk in the Inspector tab.

Lineage options available in the Tools tab are only available in this tab. However, other actions available via the Tools tab are also available elsewhere:

* Selecting specific entities and entity types can be done using a query: match entities with a query in the search bar, then choose **Select search results** from the three-dots menu at the right of the search bar
* You can also select and expand/collapse entities via the **context menu** available by right-clicking inside the Model Viewer canvas
* Views can be applied via the **Views** button in the toolbar
* Zoom levels can be adjusted via the **Recenter** menu in the toolbar

The Tools tab comprises three panels:

| [The Tools Panel](#the-tools-panel)     | Selecting entities, applying views, expanding/collapsing, disabling filters and display rules    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [The Zoom Panel](#the-zoom-panel)       | Adjusting zoom and entity width                                                                  |
| [The Lineage Panel](#the-lineage-panel) | Adjusting lineage display (number of hops, multi-trace settings, including parents and children) |

## The Tools panel

The Tools panel is contains a variety of useful actions:

* **Select**: Select entities by type, hierarchy, or lineage connections. Use **Add to selection** to toggle whether to replace currently selected entities with a new selection or add to them.
* **Trace**: Apply a focused trace to entities selected in the Model Viewer. Choose whether to show only incoming lineage (upstream), outgoing lineage (downstream), or both. You can also isolate focal entities, showing only focal entities and hiding everything else.
* **Expand/Collapse**: Expand or collapse sets of entities
* **Views**: Apply an available view or disable applied views (reset)
* **Queries**: Disable all filters or all display rules

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
If you enable `Focus Trace` to view the lineage of an entity and then select an entity type in the Tools panel, you will only select entities of that type contained in the applied lineage trace. You will **not** select all entities of that type in the entire model.

This can be useful to bulk edit only entities of a certain type that are in a given lineage trace.
{% endhint %}

## The Zoom panel

The Zoom panel allows you to customise how your model looks in the Model Viewer. You can zoom in and out of the Model and you can increase and decrease the width of Objects and Layers.

<figure><figcaption></figcaption></figure>

These options can be used to suit your preference, but they can also be used to draw attention to aspects of the model that are relevant to a given question or business need.

Current zoom options can be saved and reapplied easily by storing them in a [View](/models/explore-and-analyse-models/views).

## The Lineage panel

The Lineage Panel gives you a number of useful options for customising how the lineage of entities selected in the Model Viewer is displayed.

<figure><figcaption></figcaption></figure>

The **Highlight** and **Focus** buttons work the same as **Show Trace** and **Focus Trace** in the toolbar:

* **Highlight** shows the lineage of the selected entities.
* **Focus** filters the canvas to show only the selected entities and their lineage.

Highlighted Trace Depth and Focused Trace Depth control how many **hops** are included in a trace.

A **hop** is one transition. An entity one hop away is connected by one transition. An entity two hops away is connected by two transitions.

For example, if you select entity **Z**:

* **All hops**: `V -> W -> X -> Y ->` **Z** `-> A -> B`
* **1 hop**: `Y ->` **Z** `-> A`
* **2 hops**: `X -> Y ->` **Z** `-> A -> B`
* **3 hops**: `W -> X -> Y ->` **Z** `-> A -> B`

**Direction** works the same as `incoming`, `outgoing`, and `both` in the Tools panel above. It limits the trace to incoming lineage (upstream), outgoing lineage (downstream), or both.

Select **Advanced** for additional options:

* **Lineage type** (when multiple entities are selected):
  * **All**: shows all transitions connected to any selected entity.
  * **Common**: shows only transitions shared by all selected entities.
* **Traverse parents and children**: includes (enable) or excludes (disable) lineage of parent and child entities in highlighted or focused traces.
