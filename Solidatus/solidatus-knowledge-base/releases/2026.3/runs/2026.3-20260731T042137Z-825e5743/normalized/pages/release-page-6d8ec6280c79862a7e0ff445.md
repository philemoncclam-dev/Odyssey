# Reference model interface

You can build and edit Reference models in the same way, and through the same interface (the [Model Viewer](/the-user-interface/models-ui/model-viewer)), as a Lineage model.

The main differences are that a green theme is used in the interface of a Reference model, and the **INSPECTOR** sidebar tab has a panel that lists all relationships involving a term that is selected in the model.

While the interface for Lineage and Reference models is the same, there is one key functional difference between the two model types:

Entities in a Lineage model can only be connected to other entities within the same model via the visible directional arrows we call **transitions.** Terms in Reference models can be connected to unlimited entities or terms in other models via **reference relationships**.

## Create a reference model

To create a reference model, click the `Create` button on the [Model Browser](/the-user-interface/models-ui/model-browser) and select `Reference model:`

<figure><figcaption><p>Create a reference model</p></figcaption></figure>

When creating a reference model, you can indicate its prupose by choosing a reference model type; you should also provide a description for the model to help other users (or the [AI assistant](/models/solidatus-ai-assistant-preview)) understand it.

<figure><figcaption><p>A Reference Model is more than just a name</p></figcaption></figure>

A reference model’s type can be changed at any time by editing the model information in the Settings tab in the [Reference Model Overview](#reference-model-overview).

{% hint style="success" %}
Note that selecting a type of Reference model just adds a label and changes its icon in the model list; it does not the affect how the model functions.
{% endhint %}

[Adding additional tags to the model](/the-user-interface/models-ui/model-tags) can also be useful for classification purposes.

## Reference Model Overview

The Reference Model Overview allows you to edit model Information, search for reference terms, view term relationships, and track model revision history.

To open the Reference Model Overview, click the model name in the Model Browser.

{% hint style="success" %}
For more general information about the Model Overview that applies to both lineage and reference models, see [Model Overview](/the-user-interface/models-ui/model-overview).
{% endhint %}

### **The Summary tab**

The `Summary` tab presents information about the model itself, including a list of revisions, links to current Activities, users or Groups the model has been shared with, and the ability to edit the model information. For Reference Models, it also provides links to models that use the Reference Model.

<figure><figcaption><p>Change the Reference model type through the Summary tab of the Model Overview</p></figcaption></figure>

Click on `Edit model information` on the `actions` dropdown to open the Model Information dialogue.

<figure><figcaption><p>Editing Model Information</p></figcaption></figure>

### **The Terms tab**

The `Terms` tab presents the model contents as a hierarchy, with access to information about the individual terms that make up the model.

<figure><figcaption><p>The Terms tab</p></figcaption></figure>

## Sidebar tabs and menus

The [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar) contains two sections that are very useful when working with related Reference Models: the Inspector tab and the Reference Models tab.

### The Inspector tab

The `Properties and Relationships` panel in the [Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab) focuses attention on the currently-selected entity or entities, and provides a quick and easy way to [view](/models/explore-and-analyse-models/examine-reference-relationships#the-inspector-tab), [create](#the-inspector-tab) and [manage](/models/explore-and-analyse-models/examine-reference-relationships#the-inspector-tab) Reference Relationships.

### The Reference Models tab

The [Reference Models panel](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-reference-models-tab) focuses attention on the Reference Models that are loaded into the model that you are editing. The tab also enables you to [view](/models/explore-and-analyse-models/examine-reference-relationships#the-reference-models-tab), [create](/models/build-and-edit-models/add-and-edit-reference-relationships#in-the-reference-models-tab) and [manage](/models/explore-and-analyse-models/examine-reference-relationships#the-reference-models-tab) reference Relationships.

Note that Reference Models are not automatically fully loaded into the Reference Model panel when you add them to the list. Instead, the contents of a Reference Model are loaded into your model as and when you expand its terms and sub-terms. Relationships can only be suggested in the `Relationship Suggestions` panel to terms that have been loaded into your model, so if you want to see relationship suggestions to all terms, load the full Reference Model.

To load the full contents of a Reference Model, click the load-contents-icon icon next to its name in the list.

The tab provides a dropdown menu to the right of each term in the list, with the following options:

<table data-header-hidden><thead><tr><th width="234"></th><th width="295"></th><th></th></tr></thead><tbody><tr><td><strong>Menu option</strong></td><td><strong>Result</strong></td><td><strong>In the Inspector tab</strong></td></tr><tr><td><strong>Search usages</strong></td><td>Creates a query within the <a href="/pages/XYcJwVpclmtJSrgRQook">search bar</a> to identify model entities that are related to the term.</td><td>Click on a term then click the <code>Search</code> button in the property preview that pops up.</td></tr><tr><td><strong>Create display rule</strong></td><td>Creates a Display Rule to identify model entities that are related to the term, and also creates a Display Rule - notice that the query uses the <em>Id</em> of the term, which is much better for a Filter or Display Rule than the name of a term, which could change at any time. For example - <code>any a in $relationships (a.$value.$id = '5f508882-e15d-40fc-965f-8b319d87d538' or any p in a.$value.$parents ( p.$id = '5f508882-e15d-40fc-965f-8b319d87d538' ))</code>.</td><td><em>No equivalent action.</em></td></tr><tr><td><strong>Expand branch</strong></td><td>Expand the list to show every child term - this will expand every level in the hierarchy below the current term.</td><td><em>No equivalent action.</em></td></tr><tr><td><strong>Delete all relationships</strong></td><td>Delete all relationships between this term and entities within the current model.</td><td><em>No equivalent action.</em></td></tr><tr><td><strong>Go to term definition</strong></td><td>Open the definition of the term in the <a href="#reference-model-overview">Reference Model Overview</a>, if you have permission to do so.</td><td>Click on a term then click the <code>Search</code> button in the property preview that pops up.</td></tr></tbody></table>

### Customise the sidebar panels

**Expanded and compact relationship layouts**

The dropdown menu for the Relationships section of the `Properties and Relationships` panel allows you to choose between the *expanded* and *compact* layouts for the section; the default view is the *expanded* layout.

<figure><figcaption><p>Expanded view of Relationships - click the Model name to open it</p></figcaption></figure>

<figure><figcaption><p>Compact view of Relationships - hover over the <strong>i</strong> to see the Model name</p></figcaption></figure>

## Link to Lineage models

Reference Model terms are connected to entities in Lineage Models by [creating Reference Relationships](/models/build-and-edit-models/add-and-edit-reference-relationships#creating-reference-relationships).

Open the Lineage Model in the Model Viewer, and use a combination of the `Inspector` and `Reference Models` tabs in the Sidebar to load Reference Models and to create, view, and analyse Reference Relationships.

{% hint style="success" %}
When you delete a term in a Reference model, all existing Reference Relationships to that term are also removed.
{% endhint %}

## Find information about linked reference models

The `Reference Models` tab in the Sidebar provides details of all the reference terms related to entities in the open model.

In addition, there is a list of related Reference Models in the `Summary` tab in the [Model Overview](/the-user-interface/models-ui/model-overview); the number in the green box tells you how many total Reference Relationships there are to each Reference Model.

<figure><figcaption><p>The list of related Reference Models</p></figcaption></figure>

Click on the name of a Reference model to open the Model Overview for that Reference model (this opens in the **same** browser tab).
