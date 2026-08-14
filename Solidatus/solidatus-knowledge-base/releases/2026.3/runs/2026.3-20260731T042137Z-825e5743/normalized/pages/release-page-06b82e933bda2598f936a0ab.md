# Solidatus 4.1

After many months of development, we are pleased to announce the general availability of Solidatus 4.1.

Solidatus 4.1 is a minor release, focusing on query improvements and two-factor authentication with some interface enhancements and performance improvements.

As always, we encourage all feedback to be shared with us at [support@solidatus.com](mailto:support%40solidatus.com).

**Implementation**

* Query modules enable greater reuse and reduced implementation time
* Improved query writing facilities, making queries easier/quicker to write, reducing implementation time
* Improved API documentation making it easier and quicker for users to learn, speeding up implementation

**Security**

Solidatus now supports “Two Factor Authentication” to increase the security of sensitive metadata information. This is supported by industry standard verification apps such as “Microsoft Authenticator” or “Google Authenticator”.

**Usability**

* Increased understanding of the business impact of change across a common Glossary/Dictionary/Inventory
* Additional querying facilities
* Improved lineage traceability
* Improved information on lineage on Model Overviews
* Restructured the online documentation to make it easier to find things

For more information, see Improved visualisation and Reference Models

**Other**

* Various bug fixes and other enhancements
* Improved collaboration features
* Improvements to the Collibra connector

For more information, see Cloning an existing model and Connectivity

### Query Modules

Queries are the foundations underpinning [Display Rules and Filters](/models/explore-and-analyse-models/filters-and-display-rules) within Solidatus. In this release we’ve introduced **query modules** to enable easier and greater reuse of queries to reduce implementation time.

You can categorise related queries within query modules (a query module can also contain other query modules); your query modules can be shared across multiple models and with other users. Any changes to query modules are automatically propagated across the models which use them, allowing our customers to create shareable libraries of useful queries.

### Other Query changes

We’ve improved the query writing facilities, making queries easier and quicker to write, reducing implementation time.

* Queries can be now be administered through a new API - this could be used to provide a library of standard or sample queries
* Query autocomplete – Get query suggestions when typing your quer
* The query language has been extended with special properties for writing queries about:

  > * traces and transitions of entities
  > * finding entities that are imported from other models
  > * when querying based on reference model relationships

**The following new query predicates are available:**

| **Predicate** | **Arguments** | **Description**                                 |
| ------------- | ------------- | ----------------------------------------------- |
| isImported    |               | The entity is imported from another model       |
| isImported    | entity        | The given entity is imported from another model |

**The following new properties are available:**

| **Applies to**                  | **Property name**          | **Return type**                  | **Description**                                                                           |
| ------------------------------- | -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| Layer, Object, Group, Attribute | $trace                     | List of Entities and Transitions | All entities in an entity’s trace without traversing parents and children                 |
| Layer, Object, Group, Attribute | $trace.deep                | List of Entities and Transitions | All entities in an entity’s trace that traverses through parents and children             |
| Layer, Object, Group, Attribute | $trace.deep.incoming       | List of Entities and Transitions | All entities in an entity’s incoming trace that traverses through parents and children    |
| Layer, Object, Group, Attribute | $trace.deep.outgoing       | List of Entities and Transitions | All entities in an entity’s outgoing trace that traverses through parents and children    |
| Layer, Object, Group, Attribute | $trace.incoming            | List of Entities and Transitions | All entities in an entity’s incoming trace without traversing parents and children        |
| Layer, Object, Group, Attribute | $trace.outgoing            | List of Entities and Transitions | All entities in an entity’s outgoing trace without traversing parents and children        |
| Layer, Object, Group, Attribute | $transitions               | List of Transitions              | The list of transitions of an entity                                                      |
| Layer, Object, Group, Attribute | $transitions.deep          | List of Transitions              | The list of transitions of an entity including transitions of the entity’s descendants    |
| Layer, Object, Group, Attribute | $transitions.deep.incoming | List of Transitions              | The list of incoming transitions of an entity including those of the entity’s descendants |
| Layer, Object, Group, Attribute | $transitions.deep.outgoing | List of Transitions              | The list of outgoing transitions of an entity including those of the entity’s descendants |
| Layer, Object, Group, Attribute | $transitions.incoming      | List of Transitions              | The list of incoming transitions of an entity                                             |
| Layer, Object, Group, Attribute | $transitions.outgoing      | List of Transitions              | The list of outgoing transitions of an entity                                             |
| Referenced term                 | $id                        | String                           | The entity ID of the referenced term                                                      |
| Referenced term                 | $name                      | String                           | The name of the referenced term                                                           |
| Referenced term                 | $parent                    | Referenced term                  | The parent of the referenced term                                                         |
| Referenced term                 | $path or $parents.         | List of Referenced term          | The list of parent entities of the referenced term                                        |

### Improved visualisation

There is now a graphical visualisation of an entity’s connectivity when you select an entity in the Model Overview.

When tracing the linkages through a Lineage model, you can change the scope of a trace for a given entity, choosing to include or exclude links via the parent or children of the selected entity.

### Reference Models

When viewing a reference model entity in the model editor, you can now see incoming relationships in the relationships sidebar section. An incoming relationship is created when you assign an entity in a reference model link to another reference model entity.

### Cloning an existing model

The ability to create your own working copy of a model (by creating a ‘fork’ of the original model) is invaluable. Your working copy of the model remains attached to the original model, and there are times when you need to break that link, such as when :

* the original model is no longer required
* the working copy needs to be separated from the original model
  * perhaps you wanted to create a new model that started out very similar to an existing model

With release 4.1.0 you can detach your working version from the original model, allowing you to clone the original model. Previously, to clone a model you would need to export the model as a Solidatus JSON file, then import it as a new model.

### Two-factor Authentication

Solidatus now supports “Two Factor Authentication” to increase the security of sensitive metadata information. This is supported by industry-standard verification apps such as “Microsoft Authenticator” or “Google Authenticator”.

### Connectivity

Improvements to the Collibra connector allow you to arrange the layers created during an import from Collibra.

### Improved API documentation

Making it easier and quicker for users to learn, speeding up implementation.
