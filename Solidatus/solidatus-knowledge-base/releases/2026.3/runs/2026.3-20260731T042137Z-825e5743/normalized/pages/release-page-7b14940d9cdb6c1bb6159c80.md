# Query domains and models via the API

You can use the [Data Domain query language ](/data-domains/explore-data-domains/query-data-domains)(DQL) to query Solidatus models or Data Domains programmatically through the REST API.

{% hint style="info" %}
This API is in Beta and may change in future releases.
{% endhint %}

### Prerequisites

Before you begin, ensure you have:

* **A valid API token**: See [API Authentication](/api-documentation/api-overview/api-authentication) for instructions
* **Basic DQL knowledge**: See [Data Domain query language](/data-domains/explore-data-domains/query-data-domains) for a comprehensive reference
* **Model IDs or a Data Domain ID**: Found in your browser URL when viewing a model or domain

<div align="left"><figure><figcaption></figcaption></figure></div>

## Basic model or domain querying

When you query via the API, you must use the Data Domain query language (DQL) to fill in the "query" parameter, not the query language you use inside the Model Viewer.

In a single request, you can run a query against either a Data Domain, which includes all lineage models published to the domain, or a set of one or more models, but not both.

**Endpoint**

The endpoint is the same whether you query a domain or a set of models:

```
POST your-solidatus-url/api/vBeta/search/query/entities
```

Replace `your-solidatus-url` with the url of your Solidatus environment, e.g. `https://demo.solidatus.com`

At minimum, a query request must contain the query to be executed and the ID of the domain or models against which the query is to be executed.

**Minimal request body for querying a domain:**

```postman_json
{
    "query": "Name=\"customer_id\"",
    "domainId": "692d79691249de893f35f785"
}
```

**Minimal request body for querying models:**

```
{
    "query": "Property:\"DQ Score\"=\"fail\"",
    "modelIds": ["65f186936918f9a904fb908f", "6911b078033dbd7092eb30af"]
}
```

**Complete curl command:**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer YOUR_API_TOKEN" \
  --data '{
    "query": "Name=\"customer_data\"",
    "domainId": ["65f186936918f9a904fb908f"]
  }' \
  https://your-solidatus-url/api/vBeta/search/query/entities
```

You can also create a file with the JSON body of the request to reference in the curl command:

1. Create a file using a text-editor with the JSON request body
2. Save the file as a JSON file (e.g., “query.json”)
3. From the command line, navigate to the folder containing your file and execute the curl command, referencing the file in the `--data` parameter (e.g. `--data @query.json \`)

### Request parameters

**Required parameters:**

{% hint style="success" %}
Either `modelIds` or `domainId` is required, but not both. In other words, you can either query a Data Domain or a set of models, but not both.

In either case, you must use the [Data Domain query language](/data-domains/explore-data-domains/query-data-domains) to query via the API, not the query language you use inside the Model Viewer.
{% endhint %}

<table data-full-width="false"><thead><tr><th width="152.7332763671875">Parameter</th><th width="95.5999755859375">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>query</code></td><td>String</td><td>Your query in the <a href="/pages/8TPcuB1I1cP0GCFgAnbw">Domain Query Language</a> (DQL). Escape quotes within a query using <code>\</code> (e.g., <code>Name=\"value\"</code>)</td></tr><tr><td><code>modelIds</code></td><td>Array</td><td>IDs of Lineage models to query.</td></tr><tr><td><code>domainId</code></td><td>String</td><td>ID of Data Domain to query. <a href="#query-lineage-traces-in-a-data-domain">Lineage trace queries</a> can only be run against a domain.</td></tr></tbody></table>

**Optional parameters:**

<table><thead><tr><th width="186.933349609375">Parameter</th><th width="90.63330078125">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>referenceModelIds</code></td><td>Array</td><td>IDs of reference models to query.</td></tr><tr><td><code>entityTypes</code></td><td>Array</td><td>Specify entity types to query: “Layer”, “Object”, “Group”, “Attribute”</td></tr><tr><td><code>skip</code></td><td>Integer</td><td>Records to skip (for pagination, default: 0)</td></tr><tr><td><code>limit</code></td><td>Integer</td><td>Maximum results to return (default: 50)</td></tr></tbody></table>

### **Complete request example**

```
{
    "entityTypes": ["Layer", "Object", "Group", "Attribute"],
    "query": "Name=\"customer\" And Property:\"Criticality\"=\"Critical\"",
    "modelIds": ["65f186936918f9a904fb908f"],
    "referenceModelIds": ["60d19955f61ec1de7b18e187"],
    "skip": 0,
    "limit": 25
}
```

## Query lineage traces in a Data Domain

You can use trace queries through the API to return lineage for entities in a Data Domain. Use this two-step process:

### Step 1: Verify the domain sync status

Before querying, ensure your Data Domain is up-to-date with the latest changes in source models by checking whether models in the domain are synced with the graph engine.

**Endpoint:**

```
GET your-solidatus-url/api/vBeta/graph-engine/DOMAIN_ID/sync-status
```

Replace **DOMAIN\_ID** with your Data Domain ID (found in the domain URL in your browser).

<div align="left"><figure><figcaption></figcaption></figure></div>

**Response:**

The response returns **SYNCED** or **UNSYNCED** for the domain, along with the date and time of the last sync.

```json
{
    "domainSyncStatus": "SYNCED",
    "lastSynced": "2025-11-26T09:30:36.735Z"
}
```

**Response status meanings:**

* **SYNCED** - Domain is up-to-date with latest model versions and is ready for querying
* **UNSYNCED** - Latest model saves are still being synced; wait and retry until SYNCED is returned

### Step 2: Send your trace query

Trace queries can only be executed against the full set of lineage models included in a Data Domain and use the `domainId` parameter to specify the domain.

The response returns entities across all published models that are in the lineage trace of matched entities.

**Endpoint:**

```
POST your-solidatus-url/api/vBeta/search/query/entities
```

**Trace query predicates:**

* `HasDirectTrace:(Name=\"AMNT\")` - All entities (upstream or downstream) connected to "AMNT"
* `HasDirectTraceTo:(Name=\"AMNT\")` - All entities upstream from "AMNT"
* `HasDirectTraceFrom:(Name=\"AMNT\")` - All entities downstream from "AMNT"
* Add `Depth=` to limit number of hops (e.g., `Depth=3` for maximum 3 hops)

These are only example queries, and you do not have to specify entities whose trace you are querying using `Name=`. For more examples, and an indication of the scope of the query language, see our [DQL reference](/data-domains/explore-data-domains/query-data-domains).

**Example request:**

```
{
    "query": "HasDirectTrace:(Name=\"customer_data\" And Depth=3)",
    "domainId": "65d4adcc057c1bbf81c49b2e"
}
```

## Understand Responses

**Response structure:**

```
{
    "total": 5,
    "elapsedMilliseconds": 108,
    "hits": [
        {
            "name": "customer_data",
            "pathNames": ["Systems", "Database", "Tables"],
            "entityId": "bbfadf15-85c9-4e91-bc3e-55915e704b51",
            "models": [...],
            "properties": {
                "type": "column",
                "owner": "Sales Team"
        }
    ]
}
```

**Key response fields:**

* `total` - Number of matching entities
* `hits` - Array of matched entities with details
* `name` - Entity name
* `pathNames` - Entity hierarchy path
* `models` - Models containing entity
* `properties` - Entity properties as key:value pairs

## Need more help?

* [Domain query language syntax](/data-domains/explore-data-domains/query-data-domains)
* [API authentication](/api-documentation/api-overview/api-authentication)
