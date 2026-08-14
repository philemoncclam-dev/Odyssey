# Graph explorer

The Graph Explorer equips you with a unique visualisation of a model as an animated graph, in which entities are displayed as **nodes**, and transitions, parent-child links, and relationships to Reference Models are displayed as **predicates**.

The Graph Explorer is especially useful for visually analysing networks of entities and relationships in a model.

You can add or remove nodes as you wish, and you can navigate the graph by clicking and dragging your mouse and using the scroll button on your mouse to zoom in and out. You can also apply different layout and colouring schemes to more clearly convey information about entities in the model.

<figure><figcaption><p>A model opened in the Graph Explorer</p></figcaption></figure>

## Open the Graph Explorer

You can open a model in the Graph Explorer from either the Model Viewer or Model Overview.

### From the Model Viewer

<figure><figcaption></figcaption></figure>

When in the Model Viewer, you can find a `GRAPH` heading in the Navigation Bar to the right of `HOME`. Click `GRAPH` to open a dropdown with options to open the model in the Graph Explorer either **unpopulated** or **populated** with all entities in the model.

* **Open graph** - This option will open the Graph Explorer in an empty, **unpopulated** state and will prompt you to select specific entities from the model to display.
* **Open graph and populate** - This option will open the Graph Explorer with all entities in the model displayed.

When individual entities are added to the graph, they appear as a nodes, and you will be able to select a node to see that entity’s properties, incoming edges, and outgoing edges in the sidebar.

In both cases, the underlying model data is loaded into the graph explorer, so you can add model entities to the graph simply by looking them up in the search dialog.

### **Open a trace in the Graph Explorer**

<figure><figcaption></figcaption></figure>

In the Model Viewer, you can right-click on either an Object or Attribute in the model to open the context menu, which will have the option to *View trace in graph explorer*.

Select this option to open the Graph Explorer populated only with the trace of this entity – i.e., this entity and all entities either directly or indirectly connected to it through Transitions in the model.

If you open the Graph Explorer in this way, you can navigate the trace of the selected entity all the way from source to target on the graph.

### From the Model Overview

You can also open a model in the Graph Explorer in an **unpopulated** state through the Model Overview by selecting the dropdown arrow to the right of `OPEN`.

<figure><figcaption><p>Open a model in the Graph Explorer through the Model Overview</p></figcaption></figure>

## Predicates

A predicate describes the relationship between two nodes. The sidebar shows the predicates for the selected node as incoming and outgoing edges.

In the graph explorer there are only two types of predicate that will be displayed as edges: **‘HasChild’** and **‘MapsTo’**. In the Solidatus Model Viewer, the former refers to the relationship between a layer and an object or an object and an attribute and so on; the latter refers to the transitions you can draw between entities.

## Predicate colouring

Predicate colouring allows the user to colour nodes by their predicate values using a user-determined predicate. The default **‘SOL-Type’** predicate corresponds to the type of entity in the model. When a colouring predicate is set, the Colouring section in the sidebar shows the mapping between predicate value and colour. The settings to colour different predicates can be accessed by clicking the cogs icon in the top right of the legend or, as previously stated, you can click the paint brush icons that appear next to predicates.

Properties in the Solidatus model viewer also appear as predicates in the legend. As such you will be able to colour by property values.

## Sidebar functionality

* The **‘Add all’** button across from Outgoing edges adds all outgoing edges extending from the currently selected node, together with corresponding nodes.
* The individual edges also have an add button across from them which adds the relevant edge and node into the graph.
* Similarly, the Incoming edges section also has these buttons. The only difference being that the **‘Add Transitively’** feature recursively adds incoming nodes rather than outgoing nodes.
* Hovering over a predicate, in any of the sidebar section, also allows you click the small paint brush icon which toggles the Predicate colouring feature.

## Pick and pin mode

When pick and pin mode is on, dragging the nodes around and releasing them will pin them to that location. A pinned node is indicated by a small red pin above the node. When still in pick and pin mode, unpinning can be done by clicking a node’s pin. When out of pick and pin mode, dragging a pinned node and releasing it automatically removes the pin.

## Different layouts

The **‘Force Live’** layout, which is selected by default, allows nodes to freely float around the graph. Conversely, the Tree layouts fix node positions according to their relationships.

<figure><figcaption></figcaption></figure>
