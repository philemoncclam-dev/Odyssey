# Solidatus JSON format

`Solidatus JSON` is the JSON data format used by the ReplaceModel API command when updating a model. When interacting with Solidatus through the API, it used in the body of POST requests to define model content and additional parameters.

While we name the JSON format `Solidatus JSON`, it is not a unique or modified version of JSON; it is just JSON structured in the manner Solidatus uses to define and represent model content, such as entities, properties, and relationships.

The Solidatus user interface has an option to import `Solidatus JSON` in the Model Viewer importer, and when you export model content in JSON, that content is structured in the `Solidatus JSON` format.

{% hint style="success" %}
The import dialog in the Model Viewer has options for both `Solidatus JSON` and `JSON` alone.

This is to distinguish between JSON data that is already structured in the format Solidatus uses to represent model content (often because it was exported from Solidatus) and JSON that represents other content and is not in the structure of a Solidatus model.

The resulting model output when you choose either import option is different, so if your JSON content is already in the standard Solidatus model format, choose the `Solidatus JSON` option.
{% endhint %}

`Solidatus JSON` has three properties: `entities`, `roots`, and `transitions`.

* `entities`: An object mapping entity IDs to entity definitions. There is one entry for each layer, object, group and attribute. Each entity definition has the following properties:
  * `name`: The name of the layer, object, group or attribute.
  * `properties`: An object mapping property keys to property values.
  * `children`: An array of child IDs also defined in the entities array in this file.
* `roots`: An array of IDs of entities defined in the entities object in this file that are Layers, i.e., they are `root` entities in a model hierarchy.
* `transitions`: An object mapping transition IDs to transition definitions. Each transition definition has the following properties:
  * `source`: An attribute ID also defined in the entities array in this file.
  * `target`: An attribute ID also defined in the entities array in this file.
  * `properties`: An object mapping property keys to property values of transitions.

## Example Model Data

This Solidatus JSON was exported from the user interface. It defines a set of model entities and their properties.

```
{
    "entities": {
        "7a084eaa-ea3e-48ba-8817-f5b61caf1c29": {
            "name": "Reports",
            "properties": {},
            "children": [
                "7394df9c-6254-44f7-a74f-10f9b0635d8a"
            ]
        },
        "7394df9c-6254-44f7-a74f-10f9b0635d8a": {
            "name": "Report1",
            "properties": {},
            "children": [
                "e6bd043f-1f59-4ddd-92b7-8f7028df8bc1",
                "543d7e78-61b3-48c6-9765-98399d88d7ee",
                "084e2896-39b0-4d0a-bf75-ceb5611babbf",
                "ead65423-3c49-4d4d-88b6-c3ca284e3de6"
            ]
        },
        "e6bd043f-1f59-4ddd-92b7-8f7028df8bc1": {
            "name": "PnL Date",
            "properties": {
                "COLUMN_NAME": "PnL Date",
                "DATA_TYPE": "datetime",
                "DataOwnerDepartment": "Financial Reporting",
                "DataElement": "Posting Date",
                "DataConcept": "Date / Time",
                "DataElementDefinition": "Date time of transaction posting."
            }
        },
        "543d7e78-61b3-48c6-9765-98399d88d7ee": {
            "name": "Account",
            "properties": {
                "COLUMN_NAME": "Account",
                "DATA_TYPE": "float",
                "DataOwnerDepartment": "Financial Reporting",
                "DataElement": "Trial Balance Account",
                "DataConcept": "Account",
                "DataElementDefinition": "Account to which the transaction is posted."
            }
        },
        "084e2896-39b0-4d0a-bf75-ceb5611babbf": {
            "name": "Country",
            "properties": {
                "COLUMN_NAME": "Country",
                "DATA_TYPE": "nvarchar",
                "DataOwnerDepartment": "Financial Reporting",
                "DataElement": "Country Of Transaction",
                "DataConcept": "Country of operations",
                "DataElementDefinition": "Country in which the transaction was received."
            }
        },
        "ead65423-3c49-4d4d-88b6-c3ca284e3de6": {
            "name": "Entity",
            "properties": {
                "COLUMN_NAME": "Entity",
                "DATA_TYPE": "nvarchar",
                "DataOwnerDepartment": "Group Finance",
                "DataElement": "Trial Balance Entity",
                "DataConcept": "Legal Entity",
                "DataElementDefinition": "Entity to which the transaction is posted."
            }
        }
    },
    "transitions": {},
    "roots": [
        "7a084eaa-ea3e-48ba-8817-f5b61caf1c29"
    ]
}
```

This JSON represents the following entities (and their properties):

<figure><figcaption><p>Entities and properties captured in an exported JSON file</p></figcaption></figure>
