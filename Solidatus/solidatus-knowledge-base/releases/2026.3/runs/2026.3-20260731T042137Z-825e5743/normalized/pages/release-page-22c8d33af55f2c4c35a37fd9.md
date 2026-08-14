# Lineage explorer

The Lineage Explorer allows you to analyse individual entities and lineage without the clutter of other parts of a model.

The Lineage Explorer extracts a subset of entities from models using several modes outlined below, so entities and lineage can be explored or edited in abstraction from the rest of the model.

## Open a model in the Lineage Explorer

To open a model in Lineage Explorer mode, go to the [Model Overview](/the-user-interface/models-ui/model-overview) and click the dropdown next to the “Open” button, then click “Lineage Explorer”.

<figure><figcaption></figcaption></figure>

## Extract entities by trace

By specifying an entity in a model, the Lineage Explorer can perform a search and display both the entity and its trace. A user may also specify the depth of the trace they want to extract and in which direction. Said trace works in the same way as traces in the regular Solidatus model viewer.

<figure><figcaption></figcaption></figure>

The entities are listed as a tree opened by clicking the large dropdown and can also be filtered by certain queries. To filter this tree by a query, the query needs to exist in a module created by the user named “$SELECTOR\_QUERIES”. Click [here](/models/explore-and-analyse-models/search-and-query-in-a-model) to learn more about queries and modules. When created this way, the query will appear as a button above the search bar in the Lineage Explorer trace tab.

<figure><figcaption></figcaption></figure>

The below screenshot shows an example of a query created in the “$SELECTOR\_QUERIES” module in the model’s query manager. Note that the query and module have to be created in the regular model viewer with edit capabilities and hence cannot be created in Lineage Explorer itself.

<figure><figcaption></figcaption></figure>

## Extract entities by query

A user may also query for entities to display using [the Solidatus query language](/models/explore-and-analyse-models/search-and-query-in-a-model).

<figure><figcaption></figcaption></figure>

## Extract entities by reference relationship

Lastly, a user can extract entities in a model by specifying [a label](/models/explore-and-analyse-models/examine-reference-relationships). You can only search by labels that exist on relationships in the model. The Lineage Explorer will only display entities that have reference relationships with that particular label. Additionally, you can select a reference term so that the Lineage Explorer will only display entities that relate to that particular reference term by the specified label.

The reference terms are listed with the name of the reference model they were defined in. Optionally, the search results can be [aggregated](/additional-resources/advanced-topics/aggregate-attributes-by-property-or-reference-label) by label.

<figure><figcaption></figcaption></figure>

## Lineage Explorer results

When you click `Explore` on the Lineage Explorer dialog, you will enter a view of the Model Viewer, but it will be populated only by the entities and lineage you selected.

<figure><figcaption></figcaption></figure>

Additional fragments of an entity’s data lineage may also be revealed by right-clicking an entity and selecting one of the options presented.

You can choose to show additional entities in the Lineage Explorer that are related to the selected entity:

* Descendants
* Entities connected to selected entity by incoming Transitions
* Entities connected to selected entity by outgoing Transitions

After the results of the search display, the search parameters used appear in model section in the sidebar.

<figure><figcaption></figcaption></figure>

## Share Lineage Explorer results

You can create a link share for others to copy your Lineage Explorer options so that they can create the same results as you; this will copy a link to your clipboard.

<figure><figcaption></figcaption></figure>

## Save Lineage Explorer results

You can save your results to a new or existing model by clicking the “Save results” button in the toolbar. Saving your results to an existing model will replace what’s currently in the model with the Lineage Explorer results.

<figure><figcaption></figcaption></figure>

<figure><figcaption></figcaption></figure>
