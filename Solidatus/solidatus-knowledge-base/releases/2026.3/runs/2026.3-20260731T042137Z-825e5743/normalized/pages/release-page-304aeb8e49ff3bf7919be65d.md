# Model Viewer

The Model Viewer is the heart of Solidatus. This is your canvas for creating, editing, visualising, and analysing a model.

<figure><figcaption><p>The Solidatus Model Viewer</p></figcaption></figure>

## **The Model Viewer toolbar**

The Model Viewer Toolbar provides access to a variety of great features.

<figure><figcaption><p>The Model Viewer Toolbar</p></figcaption></figure>

If your Model Viewer has fewer options than you can see here, that’s because you only have read-only access to the model, perhaps because you don’t have the required permissions to edit the model.

Visit [Model Viewer Toolbar](#model-viewer-toolbar) for more info.

## **The Model Viewer sidebar**

The [Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar) on the right of the screen provides access to information tools, including:

* Information about selected entities (including their properties, transitions, relationships)
* Related reference models
* The Document Viewer
* Lineage trace tools

## **Working with model content**

Lineage Models represent “flow” (of data, responsibility, control) and are likely to consist of multiple Layers, with possibly hundreds of thousands (or more) decendant entities, plus a multitude of Transitions connecting them.

Reference models generally have a hierarchical structure, e.g. a *data dictionary* or regulatory principles and procedures, and generally consist of a single layer.

The Model Viewer is the same for both Lineage and Reference models, with the exception of the background colour (reference models are pale green).

Solidatus provides a variety of features to help you to navigate and analyse your model content to derive insights about a data landscape. See [Navigate a model](/models/explore-and-analyse-models/navigate-a-model) to find out more.

Adding and editing content manually in a Solidatus model is a very simple and intuitive process, which is explained at [Add and Edit entities](/models/build-and-edit-models/add-and-edit-entities).

#### **Transitions in the Model Viewer**

It is possible to create multiple transitions between the same source and target entities via the API, but not via the Model Viewer interface.

This can be intentional if, for example, you want two different transitions each with its own properties representing transformation logic. But it can also be unintentional, in which case you should remove the redundant transitions.

If a model contains multiple transitions between the same source and target, a pop-up appears when you open the model.

<figure><figcaption></figcaption></figure>

If the multiple transitions are intentional, you can leave them. If they are unintentional, you should remove redundant transitions.

To remove transitions, simply delete the visible transition in the Model Viewer by selecting it, right-clicking, and selecting **Delete** from the context menu.

When you delete the visible transition via the Model Viewer, another previously hidden transition becomes visible when the model is refreshed or reopened. You can continue to delete additional transitions in this way until only one remains.

## **How to access the Model Viewer**

* Click a model's name in the list of models in the Model Browser (if the model is a Reference model, clicking its name takes you to the Model Overview rather than the Model Browser)
* Hover your mouse over the row of a model in the Model Browser list and select **Open viewer** from the three dots button that appears.
* Click the **OPEN** button at the top right of the [Model Overview](/the-user-interface/models-ui/model-overview)
