# Edit models using commands

The Solidatus REST API provides a powerful way to programmatically modify models through **model update commands**.

These commands enable you to create, edit, and delete model content by sending JSON-formatted data to a single model update endpoint.

Model update commands let you:

* Create, modify, and delete entities and their properties
* Create, modify, and delete Reference relationships
* Import content from other models
* Update model structure and organization
* Manage model metadata and queries

Most commands execute a specific action on a single entity, such as adding an entity, setting properties, or defining relationships. However, you can define multiple commands to execute in sequence in a single API request, which allows for multiple operations at once.

There is one command that allows you to replace or update an entire model based on incoming data: the `ReplaceModel` command. This versatile command relies on being passed an entire desired model structure, which it uses to update an existing model. It determines what changes to make by comparing incoming model data with existing model data.

View a complete list of available model update commands with links to further reference documentation on each request in the [Model update commands reference](#model-update-commands-reference) section.

## Update command endpoint

There is one endpoint for modifying model content via API using **model update commands**:

```
POST /api/v1/models/{modelId}/update
```

An API request sent to this endpoint needs to specify a command, or set of commands, in the request body to execute against the model specified in the endpoint path.

Each command requires a unique JSON schema that includes parameters and incoming data to update the model with. The JSON schema unique to each command is described and illustrated on the pages linked to in the table below.

## General JSON schema for commands

Here is an example showing the general, highest level JSON schema for all model update commands (all fields are required). Specific commands and their attendant parameters are to be entered and defined in the `cmds` array.

```
{
  "cmds": [
  ],
  "commit": true,
  "commitMessage": "Updated model",
  "preview": false,
  "includeChangeset": false,
  "expectDraft": false
}
```

<table data-header-hidden><thead><tr><th width="214.395751953125"></th><th width="127.76092529296875"></th><th></th></tr></thead><tbody><tr><td><strong>Field</strong></td><td><strong>Type</strong></td><td><strong>Description</strong></td></tr><tr><td><code>"cmds"</code></td><td>Array of objects</td><td>Ordered list of commands to execute against model, along with accompanying data. Each command is defined separately in its own JSON object. A Single API request can contain many commands, but some commands cannot be used with others (see the individual command pages linked to in the table below for command-specific information).</td></tr><tr><td><code>"commit"</code></td><td>Boolean</td><td>If <code>true</code>, a new revision is created with the <code>commitMessage</code> specified. If false, commands are applied to the current draft. Default is <code>false</code>.</td></tr><tr><td><code>"commitMessage"</code></td><td>String</td><td>If commit is <code>true</code>, <code>commitMessage</code> provides the message describing the new revision. Default is <code>empty</code>.</td></tr><tr><td><code>"preview"</code></td><td>Boolean</td><td>If <code>true</code>, do a dry-run (don’t edit the model) to see the response. A changeset/diff showing the new model data that was updated by the request is always provided in the response (even if <code>includeChangeset</code> is set to false). Default is <code>false</code>.</td></tr><tr><td><code>"includeChangeset"</code></td><td>Boolean</td><td>Whether to return a changeset/diff in the response. Default is <code>false</code>.</td></tr><tr><td><code>"expectDraft"</code></td><td>Boolean</td><td>If <code>expectDraft</code> is false, this request will fail if a draft exists. To append commands to the current draft (<code>commit</code> is set to <code>false</code>), <code>expectDraft</code> must be true. Default is <code>false</code>.</td></tr></tbody></table>

The update request can optionally specify a commit message to describe the revision of the model containing the applied changes.

Alternatively, in a scenario in which multiple requests are sent to make a series of changes, the requests can append changes made by each request to a set of pending changes (called a draft), after which they can be finalised and committed by setting the `commit` field to `true` in a final update request.

## Specific commands and schemas

In the `cmds` array, each command you wish to execute is defined in its own JSON object that includes the command and all accompanying data and parameters. If you want to execute multiple commands in one request, add multiple objects in the `cmds` array.

**Example Command Request Body**

This example shows a JSON structure that executes a single `AddEntity` command.

```
{
 "cmds": [
     {
     "cmd": "AddEntity",
     "entity": {
       "name": "AMNT"
       },
     "parent": "ec6e3df3-9b72-4242-9ead-d5d7c78ad6ca",
     "pos": "2"
     }
 ],
 "commit": true,
 "commitMessage": "Add AMNT as child of Object 1",
 "preview": false,
 "includeChangeset": true,
 "expectDraft": false
}
```

## Model update commands reference

Model update commands are either **standard** or **composable**. **Composable** commands are different in that they use a property matching query to specify which entities to update by the incoming request data. This allows you to update multiple entities in a single request, without requiring you to obtain entity IDs for entities you are updating.

There are two composable commands, both for updating properties and property values, and they are described separately in their own table below.

### **Standard commands**

<table data-header-hidden><thead><tr><th width="271.2064208984375">Command</th><th>Short Description</th></tr></thead><tbody><tr><td><a href="/pages/yBv3lyxTybIeAQj6De49">AddEntity</a></td><td>Add a single entity to a model. You can also add child entities along with the defined entity.(but not descendants nested further than one-level down). You can add an entity as a child of an existing entity, or as a new Layer.</td></tr><tr><td><a href="/pages/n7quLZmjaGrA8P7CKQ2O">AddTransition</a></td><td>Add a single Transition to a model.</td></tr><tr><td><a href="/pages/kUUnacKry1IjXrbhxhy5">DeleteEntity</a></td><td>Delete a single entity from a model.</td></tr><tr><td><a href="/pages/nhD7VoBUNuieKD8ebD3n">DeleteAllEntities</a></td><td>Delete all entities from a model.</td></tr><tr><td><a href="/pages/atxTkEi7FkyU7WyD5Zwf">MoveEntity</a></td><td>Move a single entity (and its descendants) to a new location in a model.</td></tr><tr><td><a href="/pages/2CiaJPV8wASmFK5viuVi">RenameEntity</a></td><td>Change the name of a single existing entity.</td></tr><tr><td><a href="/pages/faQjUanZ8ooEZXlL3Bq4">SetProperty</a></td><td>Add, update, or remove a single property or property/value combination for a single entity.</td></tr><tr><td><a href="/pages/2x7ZnQwOH5k8hxDzPga4">SetProperties</a></td><td>Add, update, and remove multiple properties for a single entity.</td></tr><tr><td><a href="/pages/gTLQCM1K74mlRreOb1CW">SetPropertyDefinitions</a></td><td>Change the property type of existing properties.</td></tr><tr><td><a href="/pages/IlwZasroX0Xat5ecZDt7">SetRelationship</a></td><td>Add or update a single Reference relationship.</td></tr><tr><td><a href="/pages/TZTIrCO74AoJvErcy4MW">DeleteRelationship</a></td><td>Delete a single existing Reference relationship.</td></tr><tr><td><a href="/pages/hs0bY1SpB9je1nnLdLQd">ReplaceEntity</a></td><td>Replace an entity (and its descendants) with another entity (and optionally also add children). You can import properties and relationships along with the incoming entity. Note that transitions where the replaced entity was the source or target are also removed.</td></tr><tr><td><a href="/pages/3sN7tfOIxSmqJqrAUBe5">ReplaceModel</a></td><td>Replace an entire model with incoming data, or just update a model based on the diff between existing and incoming model data. This versatile command can be used to update multiple aspects of a model in a single request, as the command only updates what is different between the request data and the existing model data. For example, you can export a model in JSON, edit the JSON to reflect the changes you want to make, and then use <code>ReplaceModel</code> to make those changes.</td></tr><tr><td><a href="/pages/DBaZs0sVw9b9TWuldTxr">ReplaceTransitions</a></td><td>Replace Transitions with new Transitions.</td></tr><tr><td><a href="/pages/sBc5NhJtuZMQiIX1ykXi">SetMetadata</a></td><td>Add new metadata values or update existing ones. Model metadata includes features of display rules, grid reports, and views.</td></tr><tr><td><a href="/pages/Lc4UDePOgWv23OT5N9qD">ImportModel</a></td><td>Import all entities from one model into another.</td></tr><tr><td><a href="/pages/NdzOrKYseEAYNsSH1lNP">ImportEntities</a></td><td>Import a subset of entities from one model into another.</td></tr><tr><td><a href="/pages/4E5BX3ZvGOJYvJ4sveCC">UpdateImportedEntityToRevision</a></td><td>Update a single imported entity to its state in a specified revision of the model it was imported from.</td></tr><tr><td><a href="/pages/4pFjo9PlhS9HSqCLdDuK">UpdateImport</a></td><td>Update entities that were imported from a specified revision of an imported model to their state in another specified revision of the imported model. Most often this command will be used to update imported entities to the latest, current revision of the imported model.</td></tr><tr><td><a href="/pages/0PIOCJJpcM4zr9mjBoDo">UpdateAllImports</a></td><td>Update all entities imported from another specified model. You can update imported entities to a specific revision of the imported model or to the current, latest revision.</td></tr><tr><td><a href="/pages/PdXgiTc3FGpKRIfDYfN8">DeleteImportedModel</a></td><td>Remove imported entities from a model they were imported into.</td></tr><tr><td><a href="/pages/yOlw8EmBFV8xuY7JwXPb">AddQuery</a></td><td>Add a new query to your model that you can use in Filters, Display rules, and Views.</td></tr><tr><td><a href="/pages/LnvhLpowD9jIcL9JwSLQ">UpdateQuery</a></td><td>Edit an existing query and any Filters and Display Rules based on it. You can also use this command to simply update a query name, description, or module location.</td></tr><tr><td><a href="/pages/qqB2CLqfKborpR51z9F7">DeleteQuery</a></td><td>Remove a query and any Filters and Display Rules based on it.</td></tr><tr><td><a href="/pages/phe3FuicqUG9hsHsz3ca">ImportQueries</a></td><td>Import queries from one model into another.</td></tr><tr><td><a href="/pages/Y6xfErApzDb6ags1zeCo">DeleteImportedQueries</a></td><td>Remove imported queries from another model.</td></tr><tr><td><a href="/pages/1hTCwO8jWiim3jct7QUs">UpdateBy</a></td><td>Execute a composable command that updates entities based on a property query. The property query matches entities that have a specified property or property <code>key: value</code> combination.</td></tr></tbody></table>

### **Composable commands**

**Composable commands** enable you to update multiple entities at once with a single command. They use a property query, specified in a parameter of the request, to match entities that have a specified property or property `key:value` combination. The command then updates all matched entities.

There are two available composable commands, both of which allow you to modify existing properties or property values.

Unlike standard commands, composable commands must be defined as a parameter of a standard `UpdateBy` command, which specifies the property query. View the composable command pages for examples and descriptions of this unique command structure.

<table data-header-hidden><thead><tr><th width="244.7974853515625">Command</th><th>Short Description</th></tr></thead><tbody><tr><td><a href="/pages/ODjSxig6iGvdSzSLNpck">SetPropertyComposable</a></td><td>Add, modify, or remove a property from matched entities.</td></tr><tr><td><a href="/pages/nlgGBPeV1cAIhtMtK95O">SetPropertiesComposable</a></td><td>Add, modify, or remove multiple properties from matched entities.</td></tr></tbody></table>

## How to use IDs in API requests

Command schemas often have a field for `"id"` that is used to match incoming request data with the model entity the request is meant to update. The ID you enter can either be a Solidatus entity ID or a user-defined ID that refers to an ID used somewhere else in the same request to identify an entity.

### **Solidatus Entity IDs**

Each existing entity (including Transitions) in a Lineage or Reference model is represented by a unique Solidatus entity ID. In fact, you will notice if you export a model in JSON that entity IDs are used to organise model data. Model update commands also use Solidatus entity IDs to match incoming data with the entities a request is meant to modify.

You can find the Solidatus IDs of model entities in a variety of ways:

* Open the Model Viewer, select the entity, and find the `Selection` panel in the `INSPECTOR` tab. Copy and paste the entity ID from the panel into your API request body.
* Export a model in JSON from the Model Viewer and survey the JSON data to find an entity you are looking for.
* Call the `GET /api/v1/models/{modelId}/load` endpoint to return model JSON data.

In Solidatus JSON, entities are listed in the `entities` object by their entity ID. The `entities` JSON object is an ordered list of the entities in the model by entity ID (excluding Transitions, which are defined in their own `transitions` object). Each listed entity ID is itself a JSON object containing an ordered list of the entity data, such as name, properties, and relationships. Usually, the best way to find an entity’s ID in a JSON file is to look for other entities in its hierarchy by name, then locate its name and find the ID it is linked to. However, you can identify an entity through characteristic properties or relationships as well.

### **User-defined IDs**

When adding new entities to a model using the API, many of the commands sent to the update model API endpoint (`/api/v1/models/{modelId}/update`) require or optionally allow IDs to be provided by the user.

User-defined IDs in an API request can be in any format, with the only restriction being that they must be unique within the set of commands *in the current request*. For example, adding two entities with the same ID is not allowed (but it is allowed over separate requests).

When the commands are executed, the response will include a mapping of the user-provided IDs in the request to new Solidatus-generated IDs, which are globally unique within a Solidatus environment. To reference new entities in subsequent requests, you will need to use the new Solidatus entity IDs.

{% hint style="success" %}
You can use the mapping shown in an API response to find the correct Solidatus ID for an entity created by a model update command.
{% endhint %}

## Command example: Add and edit relationships

In this example, we are going to use the `ReplaceModel` command to add a Reference relationship to and existing entity in a model. Relationships are defined in Solidatus JSON in the request body and ingested through the API via the model update endpoint.

{% hint style="success" %}
Adding relationships through the API is useful given that relationship imports from Solidatus JSON are not supported through the user-interface import dialogue.
{% endhint %}

**Define relationships in Solidatus JSON**

In addition to standard `name`, `properties`, and `children` fields, entities (identified by entity ID in Solidatus JSON) can be provided with a `relationships` array containing relationship information.

The `relationships` array is an ordered list of JSON objects, one per relationship. Each object defines a relationship using the following three required properties:

* `ReferenceModelId` - The ID of the Reference model that contains the related Reference term.
* `TermId` - The ID of the term in the Reference model that the entity relates to.
* `Label` - The relationship label (i.e., the description of the relationship).

Let’s say we have a Reference Model with ID `646c82997665f3e9711d3b3b`, and a term inside it with ID `0efd0b79-dcdb-4924-aec2-86f0a079bc92`.

Now we want to relate a Lineage model entity to this term. To do this, we can construct the following Solidatus JSON for the API:

**Example Solidatus JSON file**

```
{
  "entities": {
    "7a084eaa-ea3e-48ba-8817-f5b61caf1c29": {
      "name": "Layer 1",
      "properties": {},
      "children": [
        "7394df9c-6254-44f7-a74f-10f9b0635d8a"
      ]
    },
    "7394df9c-6254-44f7-a74f-10f9b0635d8a": {
      "name": "Object 1",
      "properties": {},
      "children": [],
      "relationships": [
        {
          "ReferenceModelId": "646c82997665f3e9711d3b3b",
          "TermId": "0efd0b79-dcdb-4924-aec2-86f0a079bc92",
          "label": "RELATES TO"
        }
       ]
     }
    },
    "transitions": {},
    "roots": [
      "7a084eaa-ea3e-48ba-8817-f5b61caf1c29"
       ]
}
```

These `entities`, `transitions`, and `roots` fields must be provided in the body of a request in the `model` object of a `ReplaceModel` command:

```
{
  "cmds": [
   {
   "cmd": "ReplaceModel",
   "model": {
       "entities": {}
       "transitions": {}
       "roots": {}
       "metadata": {}
       "queries": {}
       "propertyDefinitions": {}
   },
   "comparator": {
       "id": true
   }
   }
  ],
  "commit": true,
  "commitMessage": "Add query for all attributes",
  "preview": false,
  "includeChangeset": true,
  "expectDraft": false
}
```

Send the JSON body to the model update endpoint using your REST client or a curl command (of course, you will need to obtain and provide a valid authentication token):

```
POST /api/v1/models/{modelId}/update
```

Since we are using a `ReplaceModel` command, the results of this API request would depend on the scenario:

* If the `entities` object matched the entity IDs and names of already existing entities, it would simply add a relationship with a “RELATES TO” label from the entity “Object 1” to the term in the Reference Model.
* If the `entities` object did not match existing entities, the existing entities would be replaced by this incoming data. The resulting model would have a Layer, “Layer 1”, containing a single Object, “Object 1”, with a “RELATES TO” relationship to the term in the Reference Model.
