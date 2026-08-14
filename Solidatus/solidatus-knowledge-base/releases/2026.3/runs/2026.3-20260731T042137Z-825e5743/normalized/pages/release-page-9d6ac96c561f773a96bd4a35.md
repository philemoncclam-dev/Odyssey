# Properties 101

The purpose of **properties** is to store any additional information — technical, descriptive, conceptual — required to classify, describe, and identify an entity in a model.

Whatever an entity in a model represents, it likely means very little to viewers of the model without additional information and context beyond an entity's name. The purpose of **properties** is to store and provide this additional information.

Properties serve a variety of critical roles in Solidatus:

* Matching property values can be used as the basis for adding Transitions between entities.
* Display Rules can surface critical information that is stored in properties, such as PII classifications or CDEs.
* Properties play a key role when using the [Auto-mapper](/models/build-and-edit-models/automap-transitions) to find potential lineage connections between entities.

## Essential Facts about Properties

* An entity can have a property without an assigned value. In that case, the property is considered *empty.*
* A property can be created or **assigned to an entity** in the [Properties and Relationships ](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab#the-properties-and-relationships-panel)panel in the [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar).
* You can also create a property using the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager).
* The [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager) enables you to search for all entities in the model with a property assigned (with any value or with a specific value).
* A property (if created via the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager)) can exist without any values. When you create a property, it is available via the auto-populated dropdown in the Properties section of the `Properties and Relationships` panel.

{% hint style="success" %}
You can filter the list of properties in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager) to look for existing properties with similar names, such as all properties with **comment** in their name.
{% endhint %}

***

* When you copy and paste entities, all of their properties move along with them, even when you paste into a different Model.
* If the pasted content includes a property with the same name as an existing property, the value is copied into the existing property - depending on the property type, this might result in the value being flagged as invalid.

***

* When you [import content from another Solidatus Model](/get-started/import-model-content/import-and-link-to-solidatus-models), all the properties defined in the imported Model become available to add to entities in your model - see [Import Properties](/models/build-and-edit-models/add-and-edit-properties#import-properties) to find out more.

***

* Solidatus provides eight different [property types](/models/understand-solidatus-models/understand-properties/property-types) (the default type is `Text`), each of which has its own validation rules.

***

* A **property value** can be added to a property via the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager), but this does not assign it to any particular entity. Instead, it makes the value available to an Entity using the Properties and Relationships panel.

{% hint style="success" %}
Values for Number or Checkbox property types cannot be added via the Property Manager.
{% endhint %}

* The possible range of values that are valid for a property depends on the associated [property type](/models/understand-solidatus-models/understand-properties/property-types).
* The maximum length of a property value is 10,000 characters.

{% hint style="success" %}
If you want to provide pre-defined lists of values for modellers to use in your properties, you are advised to use only [Multi-select](/models/understand-solidatus-models/understand-properties/property-types) or [Select](/models/understand-solidatus-models/understand-properties/property-types) property types. Unused values contained in all other property types will be removed when the model is saved.
{% endhint %}

***

* The Solidatus [Models Query Language](/models/explore-and-analyse-models/search-and-query-in-a-model) provides a number of options for identifying entities based on properties. You can test and compare the values of properties, look for entities that have at least one invalid property, and look for entities that have empty or invalid values for a given property.

***

{% hint style="success" %}
See also [Notes on Properties when moving, copying or deleting entities](/models/build-and-edit-models/add-and-edit-entities#notes-on-properties-when-moving-copying-or-deleting-entities).
{% endhint %}

***

## Examples of properties

Entities that represent the contents of a regulatory report could have the following properties:

<table data-header-hidden><thead><tr><th width="230"></th><th></th></tr></thead><tbody><tr><td><strong>Property name</strong></td><td><strong>Information provided by property</strong></td></tr><tr><td>Approval date</td><td>The date when the definition was approved</td></tr><tr><td>Average Population %</td><td>The average value of a property for all descendants of the entity</td></tr><tr><td>Confidentiality</td><td>The confidentiality level for the data</td></tr><tr><td>Critical</td><td>Is this data regarded as <em>Critical</em>?</td></tr><tr><td>Description</td><td>A business description of the data</td></tr><tr><td>Owners</td><td>The internal owner(s) of the data</td></tr><tr><td>Regulation</td><td>A link to an external definition of the regulatory requirement</td></tr><tr><td>Version Number</td><td>The version number for the definition</td></tr></tbody></table>

Properties assigned to an entity are shown in the `Properties and Relationships` panel in the Inspector tab in the sidebar of the Model Viewer.

In the image, some properties (e.g. *Approval date*) are contained within [property folders](/models/explore-and-analyse-models/view-and-analyse-properties#property-folders). In this example, *Approval date* is contained in the *Dates* folder. The icon to the left of each property name indicates the associated [property type](/models/understand-solidatus-models/understand-properties/property-types), which controls how the property value is entered, stored, validated, and displayed.

<figure><figcaption><p>View and edit properties in the sidebar</p></figcaption></figure>

{% hint style="success" %}
There are many ways of recording some of this information in your model.

For example, some of the above properties (*Confidentiality*, *Critical*, *Owners*, and *Regulation*) could possibly be stored using [Transitions](/models/build-and-edit-models/add-and-edit-entities#add-transitions) or [Reference Relationships](/models/understand-solidatus-models/understand-reference-relationships) instead. The benefits of using Reference relationships rather than properties are discussed on the [Reference Models 101](https://docs.solidatus.com/models/understand-solidatus-models/pages/jy0eHmFLQpjWvmAg0d44#reference-relationships-vs.-properties) page.
{% endhint %}
