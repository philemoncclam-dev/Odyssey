# Solidatus FAQs

<table data-header-hidden><thead><tr><th></th><th data-hidden></th><th data-hidden></th></tr></thead><tbody><tr><td><a href="#how-can-i-break-the-link-to-imported-model-content">How can I break the link to imported model content?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-focus-my-attention-on-a-specific-subset-of-models-i-have-access-to">How can I focus my attention on a specific subset of models I have access to?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-create-or-view-a-trace-at-the-layer-level">How can I create or view a trace at the Layer level?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-find-the-shortest-distance-between-two-entities">How can I find the shortest distance between two entities?</a></td><td></td><td></td></tr><tr><td><a href="#can-i-see-a-list-of-all-layers-connected-to-a-selected-layer">Can I see a list of all Layers connected to a selected Layer?</a></td><td></td><td></td></tr><tr><td><a href="#how-many-entities-are-in-my-model">How many entities are in my model?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-reverse-all-incoming-or-outgoing-transitions-for-an-entity">How can I reverse all incoming or outgoing Transitions for an entity?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-select-all-transitions-between-selected-entities">How can I select all Transitions between selected entities?</a></td><td></td><td></td></tr><tr><td><a href="#how-can-i-find-the-history-of-an-entity">How can I find the history of an entity?</a></td><td></td><td></td></tr></tbody></table>

## How can I break the link to imported model content?

If you’ve imported content from another model, you can break the link to the original model by copying the content somewhere else in your model and then deleting the imported content.

This will change the entity IDs of the originally imported entities.

{% hint style="info" %}
Breaking the link to an imported model means you will no longer receive import model updates that allow you to update imported content to incorporate changes made in the original model.
{% endhint %}

Exporting a model as a SOL file will also sever links to an imported model, but this method will preserve the entity IDs of imported entities.

## How can I focus my attention on a specific subset of models I have access to?

If you’d like to see a specific subset of models without any others included in the list, there are a few options:

1. Star the models, then select the “Starred” filter in the Model Browser.
2. Create a unique tag and tag only those models with it.
3. Create a new Group and add those models to the Group (Groups do not need to have more than one member).

## How can I create or view a trace at the layer level?

If you’d like to add or view transitions between layers, switch the `Root Entity Type` to `Object` from the *Options* menu in the Toolbar.

This turns all layers into objects, allowing you to create and view transitions between them, while maintaining the hierarchical order of nested sub-entities.

Note that this will automatically rearrange layers in left-to-right order based on the direction of transitions between them.

<figure>Switch the root entity type to view transitions between layers<figcaption><p>Switch the root entity type to view transitions between layers</p></figcaption></figure>

## How can I find the shortest distance between two entities?

To find the shortest distance between two entities connected indirectly in a network of transitions:

* Focus a trace on the source entity
* Set the `Focused trace depth` to 1 in the Lineage panel of the Tools tab in the sidebar
* Continue increasing the `Focused trace depth` until you see the target entity in the focused trace

This will show the smallest number of “hops” between the focused entity and the target entity.

## Can I see a list of all layers connected to a selected layer?

You can find a list of all layers directly connected to a selected layer in the transition panel of the Inspector tab in the sidebar.

<figure>Combined transitions can list links between layers<figcaption></figcaption></figure>

Make sure that you have selected *combined* transitions in the transitions panel.

This summarises the list by displaying transitions between descendant entities as transitions between the selected higher-level entity that contains them.

## How many entities are in my model?

You can find out how many entities are in your model in several ways:

1. The total number of entities in a model is listed underneath the model name in the Model Browser.

<figure>Total entities listed in the Model Browser<figcaption></figcaption></figure>

2. The total number of entities is also listed on the SUMMARY page of the Model Overview.

<figure>Total entities listed in the Model Overview<figcaption></figcaption></figure>

3. You can enter this query in the search bar of the Model Viewer to return a count of the total entities in the model:

   `isTransition() or isLayer() or isObject() or isGroup() or isAttribute()`

<figure>Find total entities while in the Model Viewer<figcaption></figcaption></figure>

## How can I reverse all incoming or outgoing transitions for an entity?

You can reverse all incoming or outgoing transitions in a few clicks to avoid major model reconfiguration.

First, right-click an entity to open the context menu, scroll to `Select`, and choose either `Select all incoming transitions`, `Select all outgoing transitions`, or `Select all incoming and outgoing transitions`.

Once the transitions have been selected, right-click one of them and choose `Reverse transitions`.

## How can I select all transitions between selected entities?

To select all transitions between a set of selected entities, first right-click, select `Focus/Isolate` from the context menu, and then select `Isolate selection`.

Make sure to set the `Focused trace depth` to the right number of hops to get all transitions desired in the isolated trace.

Once you’ve gotten all desired transitions into view, go to the Tools panel in the sidebar and click the **transitions** button.

{% hint style="success" %}
Isolating only the transitions between a selected set of entities can depend on selecting them in the right order.

If transitions outside of the network of entities you’ve selected appear when you set the `Focused trace depth`, try selecting the entities in a different order before isolating them.
{% endhint %}

## How can I find the history of an entity?

The best place to view the full history of an entity is the `Entities` tab in the Model Overview (or the `Term` tab for a Reference term).

Locate the entity by searching or browsing the tree hierarchy of the model in the sidebar on the left of the `Entities` tab.

Click on the entity in the browse tree and find the `History` panel, which shows the full history since the entity was created.

<figure>View the history of an entity in the Entities tab of the Model Overview<figcaption><p>View the history of an entity in the Entities tab of the Model Overview</p></figcaption></figure>

You can also find the history of an entity by selecting the entity in the Model Viewer and viewing the `Entity History` panel of the Inspector tab in the sidebar.

However, if the entity has undergone many changes, the full history will not fit in the panel.

## How can I import a Reference model into a Lineage model (or vice-versa)?

You can import a Reference model into a Lineage model (or vice-versa):

1. Export the model as JSON
2. Open the JSON file in a text editor
3. Change the value of the `type` field from `ReferenceModel` to `LineageModel` (or vice-versa)
4. Save the file
5. Import the modified JSON file into a new, empty model and save it
6. Open the model you want to import into
7. Select Import>Model from the toolbar
8. Select the new model you created in step 5

If you only want the imported content without a link to the original model, follow the steps to step 5 and then import the modified JSON file directly into the model you want to add the content to.
