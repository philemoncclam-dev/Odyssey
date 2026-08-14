# Retrieve model data

The Solidatus REST API is extensive. You can find the full endpoint catalog in the Swagger reference, accessed via **Help → API Documentation** in Solidatus:

<figure><figcaption></figcaption></figure>

Many calls exist to retrieve source data that constitutes a model, from an entire model to just individual entities, with or without their children or descendants.

This page lists a few of the most basic, and commonly used calls for retrieving model data. However, for a comprehensive list, see our Swagger reference.

{% hint style="success" %}
Model Data is returned in the format we refer to as Solidatus JSON, which is just JSON structured in the schema Solidatus uses to represent model data.
{% endhint %}

## Retrieve model data

### Retrieve a single entity

```
GET /api/v1/models/{modelId}/load/{entityId}/only
```

Returns a single entity without its children from the specified model.

### Retrieve a single entity and its children

```
GET /api/v1/models/{modelId}/load/{entityId}
```

Returns a single entity along with its children from the specified model.

### Retrieve a whole model

```
GET /api/v1/models/{modelId}/load
```

Returns an entire model along with its metadata.

The returned JSON can then be traversed and parsed to find specific model data as required.

The full details of response schemas and formats can be found in the Swagger API reference (navigate to **Help → API Documentation** in Solidatus or append `/api-docs` to your Solidatus instance URL).

{% hint style="success" %}
You can also use the Domain Query Language to [query models via the API](/api-documentation/query-models-via-the-api).

You can also return the results of a query in the Solidatus model query language through the API; however, a Node.JS utility is required to do so. You can find the utility and a readme file with further info [here](https://github.com/solidatus/node-api-query).
{% endhint %}

## Retrieve model metadata

Model metadata is used to store extra information about a model outside of entities and transitions. For example, you can view data stored in a model for Views, Queries, Grid Reports, and more.

There are two endpoints for retrieving model metadata.

The first endpoint retrieves metadata for the current, latest revision of the model specified in the endpoint path:

```
GET /api/v1/models/{modelId}/metadata
```

The second endpoint can retrieve metadata for any revision by supplying the revision ID in the endpoint path:

```
GET /api/v1/models/{modelId}/revisions/{revisionId}/metadata
```

**Sample Response:**

```
Status: 200
```

```
{
   "metadata":
   {
       "views": "{\"views\":[{\"name\":\"Hello\",\"description\":\"\",\"applyOnLoad\":false,\"view\":{\"version\":20,\"zoom\":{\"scale\":1,\"layerWidth\":250,\"layerSpacing\":40},\"collapsed\":{\"expanded\":[\"b9a80c1c-5984-4a26-8251-3591b8753039\"],\"collapsed\":[]},\"trace\":{\"enabled\":false,\"lock\":null,\"highlightedTraceDepth\":1,\"isHighlightedTraceDepthAll\":true,\"isTraversable\":true},\"selection\":[\"06dd642b-b545-4875-be2c-654319756a9a\"],\"queries\":{\"styled\":[\"86374c7a-853f-46a5-a042-70b46955f9a2\",\"9f6f64ce-231e-4f53-8aeb-c700186d301c\"],\"filtered\":[],\"filterType\":{\"86374c7a-853f-46a5-a042-70b46955f9a2\":\"show\",\"9f6f64ce-231e-4f53-8aeb-c700186d301c\":\"show\"},\"expandedModules\":[]},\"settings\":{\"hideEmptyContainers\":false,\"hideFilteredLayers\":false,\"expandFilteredEntities\":false,\"portHintsEnabled\":true,\"autoBundleTransitions\":1,\"autoStyleTransitions\":1,\"autoHideTransitions\":1,\"maxSpanningTransitionDepth\":10,\"rootEntityType\":\"Layer\"}},\"options\":{\"zoom\":true,\"collapsed\":true,\"trace\":true,\"selection\":true,\"queries\":true,\"settings\":true},\"id\":\"VIEW-G96n8llA\"}]}",
       "queries": "{\"version\":\"3\",\"moduleColours\":{\"Uncategorised\":\"#9013fe\"},\"queryOrder\":[\"86374c7a-853f-46a5-a042-70b46955f9a2\"]}",
       "gridReports": "{\"reports\":[{\"id\":\"grid-report-definition-nzwpy878\",\"name\":\"Attributes by path\",\"description\":\"\",\"startSelector\":{\"type\":\"EntityType\",\"entityType\":\"Attribute\"},\"columnDefinitions\":[{\"value\":\"$path\",\"id\":\"column-2\",\"label\":\"Path\"}]}],\"version\":1}"
   }
}
```

## Update model metadata

Setting metadata is done through a `SetMetadata` command posted to the update model endpoint:

```
POST /api/v1/models/{modelId}/update
```

For documentation on the `SetMetadata` command, see [SetMetadata](/api-documentation/api-actions/api-use-the-api/setmetadata).

## Examine model metadata in the UI

It is possible to examine existing model metadata for review or to help structure API calls through the Model Viewer interface.

<figure><figcaption></figcaption></figure>

To examine model metadata JSON from the Model Viewer, click the `i` icon in the Model Info panel in the `MODELS` sidebar tab.

In the dialog, you can then choose various aspects of the model - Properties, Views, Grid Reports, etc. – to find their metadata keys and the current values set for them.

<figure><figcaption><p>Metadata JSON in the Model Info dialog</p></figcaption></figure>

The JSON for each of these metadata sections can be copied and pasted to structure the body of a request for the `SetMetadata` command.
