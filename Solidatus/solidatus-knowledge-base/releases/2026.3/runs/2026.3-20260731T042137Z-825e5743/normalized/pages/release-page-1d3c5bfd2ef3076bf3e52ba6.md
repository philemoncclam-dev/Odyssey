# Examine properties

Properties can be viewed in the Entities or Terms tab in the [Model Overview](/the-user-interface/models-ui/model-overview), and viewed and edited (subject to permissions) in the [Model Viewer](/the-user-interface/models-ui/model-viewer).

## Property folders

Properties can be organised into folders by prefixing the property name with the folder name followed by the `/` character. For example, the property `GDPR/Dates/Next Impact Assessment Date` will normally be displayed like this, with two folder levels:

<figure><figcaption><p>Property folders</p></figcaption></figure>

You can toggle the use of folders from the three-dot menu of the *Properties and Relationships* section in the Model Viewer. If you choose to *Disable folder layout*, property names are prefixed with the folder names.

<figure><figcaption><p>Property folders - disabled, with vertical row layout</p></figcaption></figure>

The image above shows the *Vertical row layout*, in which there is more space for the folder names to be displayed.

{% hint style="warning" %}
When you create a property within a folder, the folder name is regarded as part of the full name of the property. As a result, it is possible to create properties with the same name as long as they sit in different folders.

For example, it is completely valid to have multiple **Comment** properties in separate folders, because folder names differentiate between properties with the same name .
{% endhint %}

## Properties in the Model Viewer

In the [Model Viewer](/the-user-interface/models-ui/model-viewer), the properties for a selected entity (or multiple selected entities) can be viewed and edited (subject to permissions) in the `Properties and Relationships` section of the [Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab) in the Model Sidebar. You can also use the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager) to manage the properties that are available in the Model.

{% hint style="success" %}
You can also right-click any entity in the model and select `Properties` from the context menu to open the `Properties and Relationships` panel in the sidebar.
{% endhint %}

You can access `Properties and Relationships` by manually opening the Sidebar and clicking on the `Inspector` tab, or by right-clicking an entity and selecting `Properties`.

The `Properties and Relationships` section contains (as the name suggests) the properties and relationships for the selected entity or entities. If you have opened the model in *read-only* mode you can only view properties and relationships. Model Authors and Owners can edit the [Property Type](/models/understand-solidatus-models/understand-properties/property-types), Name and value of any property by clicking on the relevant part of the dialogue.

{% hint style="success" %}
Selecting multiple entities allows you to view or edit the properties for multiple entities at the same time. See [Assign a property to multiple Entities](/models/build-and-edit-models/add-and-edit-properties#assign-a-property-to-multiple-entities).
{% endhint %}

Property and relationship names and values can be searched using the search bar at the top.

<figure><figcaption><p>View and edit properties in the sidebar</p></figcaption></figure>

Click the three-dots menu menu to the right of a property name for more actions.

<figure><figcaption><p>Options for a property</p></figcaption></figure>

## Customise the Properties and Relationships panel

#### **Dragging away from the Sidebar**

You can drag sections away from the Sidebar, placing them wherever you would prefer to see them, alongside each other to focus on a task, or perhaps alongside the entities you’re working on in the Model Viewer.

In the image below, two sections have been dragged from the [The Reference Models Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-reference-models-tab) so that they are next to the `Properties and Relationships` panel in [The Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab).

<figure><figcaption><p>Drag sidebar panels around to form a bespoke workspace</p></figcaption></figure>

***

## Properties in the Model Overview

The Model Overview allows you to navigate a hierarchical view of the content of a model - see the `Entities` tab in a Lineage Model or the `Terms` tab in a Reference Model. This is very useful when you’re more interested in the model entities than you are in the lineage. For example, when you’re examining a business glossary in a [Reference Model](/models/understand-solidatus-models/reference-models-101).

To view properties in the Model, expand the entities in the model hierarchy until you reach an entity of interest, then select that entity. If it helps, use the search bar to filter the list of entities.

The information pane will include everything known about the selected entity:

> * properties
> * relationships to Terms in Reference Models
> * revision history
> * a list of the branches (forks) that contain a version of the entity
> * a diagram illustrating the transitions to or from other entities in the same Model (including those imported from other models)

Click on `Go to entity` to open the Model Viewer, focused on the current entity.

<figure><figcaption><p>Properties in the Model Overview</p></figcaption></figure>
