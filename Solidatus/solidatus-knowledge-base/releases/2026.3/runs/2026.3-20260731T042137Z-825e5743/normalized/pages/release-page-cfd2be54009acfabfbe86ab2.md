# API Model building tutorial

This comprehensive tutorial shows you how to create, build, and edit Solidatus models entirely through the REST API, without using the user interface. You’ll learn to perform all major model operations programmatically, from basic creation and simple modifications to roundtrip model retrieval, editing, and re-uploading.

This tutorial is meant to solidify core API concepts and operations to help you automate model creation, build your own connections using our [SDK](https://solidatus.gitbook.io/solidatus-java-sdk/), or build custom workflows around model management.

<details>

<summary>Tutorial Contents</summary>

* [Prerequisites](#prerequisites)
* [Step 1: Authenticate and get an API token](#step-1-authenticate-and-get-an-api-token)
* [Step 2: Create a new model](#step-2-create-a-new-model)
* [Step 3: Build your model structure](#step-3-build-your-model-structure)
  * [Note on Entity IDs](#note-on-entity-ids)
* [Step 4: Add individual entities](#step-4-add-individual-entities)
* [Step 5: Modify entity properties](#step-5-modify-entity-properties)
* [Step 6: Create additional transitions](#step-6-create-additional-transitions)
* [Step 7: Build relationships to reference models](#step-7-build-relationships-to-reference-models)
* [Step 8: Delete and replace transitions](#step-8-delete-and-replace-transitions)
* [Step 9: Bulk property updates](#step-9-bulk-property-updates)
* [Step 10: Move and reorganize entities](#step-10-move-and-reorganize-entities)
* [Step 11: Retrieve and verify your model](#step-11-retrieve-and-verify-your-model)
* [Step 12: Use ReplaceModel for further updates](#step-12-use-replacemodel-for-further-updates)
  * [Using comparators with ReplaceModel](#using-comparators-with-replacemodel)
  * [Test model updates with ReplaceModel](#test-model-updates-with-replacemodel)
* [Next steps](#step-12-use-replacemodel-for-further-updates)

</details>

## Prerequisites

Before starting this tutorial, ensure you have:

* Access to a Solidatus instance
* The `curl` command-line utility or your preferred API client
* A valid user account with an Author licence
* Basic familiarity with JSON and REST APIs

{% hint style="success" %}
The API request examples in this tutorial use `curl`, but you can use any REST API client of your choice (Postman, Insomnia, custom scripts, etc.) as long as you can set HTTP headers and send JSON request bodies.
{% endhint %}

## Step 1: Authenticate and get an API token

All API operations require authentication using an API token.

1. **Obtain an API token**

Navigate to the API token management page in your Solidatus instance:

> * Click your initials in the top-right corner, then select **Account**
> * Scroll down to **API tokens**, then select **MANAGE TOKENS**
> * Enter a descriptive name for your token (e.g., “Model Building Tutorial”)
> * Select at least all scopes with **model** in their name: `Create model`, `Export model`, `Share model`, `Fork model`, `View model`
> * Click **CREATE TOKEN**

{% hint style="warning" %}
Copy the token immediately - you cannot view it again later
{% endhint %}

2. **Set your environment variables**

These variables must be set in all API requests:

* **SOLIDATUS\_URL:** your Solidatus environment URL (e.g., `https://demo.solidatus.com`)
* **API\_TOKEN:** A valid API token with sufficient capabilities and permission to access models

## Step 2: Create a new model

Start by creating a new, empty model.

**Request**

```
curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --request POST \
  --data '{
    "name": "Customer Data Pipeline",
    "description": "Complete data lineage for customer information processing"
  }' \
  SOLIDATUS_URL/api/v1/models
```

**Response**

```
{
  "id": "674a5b2c8f4e7a0001dc2b15",
  "name": "Customer Data Pipeline",
  "description": "Complete data lineage for customer information processing",
  "type": "LineageModel",
  "referenceModelType": null,
  "owner": {
    "id": "54d0b14018d86418ccfdc157",
    "name": "Your Name"
  }
}
```

{% hint style="success" %}
**Save the model ID from the response**: Copy the `id` value from the response (e.g., `674a5b2c8f4e7a0001dc2b15`) - you’ll need it for all subsequent operations.
{% endhint %}

## Step 3: Build your model structure

Now we’ll build and upload a comprehensive model structure representing a customer data pipeline. This example includes multiple layers, objects, attributes, data flows, and entity properties.

This is just an example that you can copy and paste into the body of your request for the purpose of this tutorial; if you are building your own models, you should supply model data that fits your own systems and lineage structure.

We will use the `ReplaceModel` [model update command](https://docs-pr-268.solidatus.dev/api/models/commands/index.html), which is ideal for initial model creation. This command replaces the current model with incoming data, so it can import an entire model structure in one go.

Start by creating a file named `customer-pipeline.json` that represents the model structure in JSON (see [Solidatus JSON Format](https://docs-pr-268.solidatus.dev/api/models/solidatus-json.html) for a JSON specification for Solidatus model data).

```
{
  "cmds": [
    {
      "cmd": "ReplaceModel",
      "model": {
        "entities": {
          "source-layer": {
            "name": "Source Systems",
            "properties": {
              "layer_type": "source",
              "description": "External data sources"
            },
            "children": ["crm-system", "billing-system"]
          },
          "crm-system": {
            "name": "CRM Database",
            "properties": {
              "system_type": "database",
              "technology": "PostgreSQL",
              "owner": "Sales Team"
            },
            "children": ["customers-table", "contacts-table"]
          },
          "customers-table": {
            "name": "customers",
            "properties": {
              "object_type": "table",
              "record_count": "50000"
            },
            "children": ["cust-id", "cust-name", "cust-email"]
          },
          "cust-id": {
            "name": "customer_id",
            "properties": {
              "data_type": "integer",
              "primary_key": "true",
              "nullable": "false"
            }
          },
          "cust-name": {
            "name": "customer_name",
            "properties": {
              "data_type": "varchar(255)",
              "nullable": "false"
            }
          },
          "cust-email": {
            "name": "email_address",
            "properties": {
              "data_type": "varchar(255)",
              "nullable": "true",
              "pii": "true"
            }
          },
          "contacts-table": {
            "name": "contacts",
            "properties": {
              "object_type": "table",
              "record_count": "75000"
            },
            "children": ["contact-id", "contact-cust-id", "contact-phone"]
          },
          "contact-id": {
            "name": "contact_id",
            "properties": {
              "data_type": "integer",
              "primary_key": "true",
              "nullable": "false"
            }
          },
          "contact-cust-id": {
            "name": "customer_id",
            "properties": {
              "data_type": "integer",
              "foreign_key": "customers.customer_id",
              "nullable": "false"
            }
          },
          "contact-phone": {
            "name": "phone_number",
            "properties": {
              "data_type": "varchar(20)",
              "nullable": "true",
              "pii": "true"
            }
          },
          "billing-system": {
            "name": "Billing API",
            "properties": {
              "system_type": "api",
              "technology": "REST API",
              "owner": "Finance Team"
            },
            "children": ["billing-endpoint"]
          },
          "billing-endpoint": {
            "name": "customer-billing",
            "properties": {
              "object_type": "endpoint",
              "url": "/api/v1/billing/customers"
            },
            "children": ["bill-cust-id", "bill-amount", "bill-date"]
          },
          "bill-cust-id": {
            "name": "customerId",
            "properties": {
              "data_type": "string",
              "required": "true"
            }
          },
          "bill-amount": {
            "name": "totalAmount",
            "properties": {
              "data_type": "decimal",
              "currency": "USD"
            }
          },
          "bill-date": {
            "name": "billingDate",
            "properties": {
              "data_type": "date",
              "format": "ISO8601"
            }
          },
          "processing-layer": {
            "name": "Data Processing",
            "properties": {
              "layer_type": "processing",
              "description": "ETL and data transformation"
            },
            "children": ["etl-pipeline"]
          },
          "etl-pipeline": {
            "name": "Customer ETL",
            "properties": {
              "system_type": "pipeline",
              "technology": "Apache Airflow",
              "schedule": "daily"
            },
            "children": ["processed-customer", "processed-billing"]
          },
          "processed-customer": {
            "name": "customer_data_clean",
            "properties": {
              "object_type": "dataset",
              "format": "parquet"
            },
            "children": ["proc-cust-id", "proc-cust-name", "proc-cust-email", "proc-phone"]
          },
          "proc-cust-id": {
            "name": "customer_id",
            "properties": {
              "data_type": "integer",
              "source": "crm.customers.customer_id"
            }
          },
          "proc-cust-name": {
            "name": "full_name",
            "properties": {
              "data_type": "string",
              "source": "crm.customers.customer_name",
              "transformation": "trimmed and titlecased"
            }
          },
          "proc-cust-email": {
            "name": "email",
            "properties": {
              "data_type": "string",
              "source": "crm.customers.email_address",
              "transformation": "validated and normalized"
            }
          },
          "proc-phone": {
            "name": "phone",
            "properties": {
              "data_type": "string",
              "source": "crm.contacts.phone_number",
              "transformation": "format standardized"
            }
          },
          "processed-billing": {
            "name": "billing_summary",
            "properties": {
              "object_type": "dataset",
              "format": "parquet"
            },
            "children": ["proc-bill-cust-id", "proc-total-amount"]
          },
          "proc-bill-cust-id": {
            "name": "customer_id",
            "properties": {
              "data_type": "integer",
              "source": "billing.customer-billing.customerId"
            }
          },
          "proc-total-amount": {
            "name": "lifetime_value",
            "properties": {
              "data_type": "decimal",
              "source": "billing.customer-billing.totalAmount",
              "transformation": "aggregated sum by customer"
            }
          },
          "target-layer": {
            "name": "Analytics Layer",
            "properties": {
              "layer_type": "target",
              "description": "Data warehouse and reporting"
            },
            "children": ["data-warehouse"]
          },
          "data-warehouse": {
            "name": "Customer Data Warehouse",
            "properties": {
              "system_type": "database",
              "technology": "Snowflake",
              "owner": "Analytics Team"
            },
            "children": ["customer-360"]
          },
          "customer-360": {
            "name": "customer_360_view",
            "properties": {
              "object_type": "table",
              "purpose": "unified customer view"
            },
            "children": ["final-cust-id", "final-name", "final-email", "final-phone", "final-ltv"]
          },
          "final-cust-id": {
            "name": "customer_id",
            "properties": {
              "data_type": "integer",
              "primary_key": "true"
            }
          },
          "final-name": {
            "name": "customer_name",
            "properties": {
              "data_type": "varchar(255)"
            }
          },
          "final-email": {
            "name": "email_address",
            "properties": {
              "data_type": "varchar(255)"
            }
          },
          "final-phone": {
            "name": "phone_number",
            "properties": {
              "data_type": "varchar(20)"
            }
          },
          "final-ltv": {
            "name": "customer_lifetime_value",
            "properties": {
              "data_type": "decimal(10,2)"
            }
          }
        },
        "transitions": {
          "cust-id:proc-cust-id": {
            "source": "cust-id",
            "target": "proc-cust-id",
            "properties": {
              "transformation": "direct copy",
              "quality_rules": "not null validation"
            }
          },
          "cust-name:proc-cust-name": {
            "source": "cust-name",
            "target": "proc-cust-name",
            "properties": {
              "transformation": "trim whitespace, title case",
              "quality_rules": "length > 0"
            }
          },
          "cust-email:proc-cust-email": {
            "source": "cust-email",
            "target": "proc-cust-email",
            "properties": {
              "transformation": "email validation, lowercase",
              "quality_rules": "valid email format"
            }
          },
          "contact-phone:proc-phone": {
            "source": "contact-phone",
            "target": "proc-phone",
            "properties": {
              "transformation": "format to +1-XXX-XXX-XXXX",
              "quality_rules": "valid phone number"
            }
          },
          "bill-cust-id:proc-bill-cust-id": {
            "source": "bill-cust-id",
            "target": "proc-bill-cust-id",
            "properties": {
              "transformation": "string to integer conversion"
            }
          },
          "bill-amount:proc-total-amount": {
            "source": "bill-amount",
            "target": "proc-total-amount",
            "properties": {
              "transformation": "sum by customer_id",
              "aggregation": "SUM"
            }
          },
          "proc-cust-id:final-cust-id": {
            "source": "proc-cust-id",
            "target": "final-cust-id",
            "properties": {
              "transformation": "direct copy"
            }
          },
          "proc-cust-name:final-name": {
            "source": "proc-cust-name",
            "target": "final-name",
            "properties": {
              "transformation": "direct copy"
            }
          },
          "proc-cust-email:final-email": {
            "source": "proc-cust-email",
            "target": "final-email",
            "properties": {
              "transformation": "direct copy"
            }
          },
          "proc-phone:final-phone": {
            "source": "proc-phone",
            "target": "final-phone",
            "properties": {
              "transformation": "direct copy"
            }
          },
          "proc-total-amount:final-ltv": {
            "source": "proc-total-amount",
            "target": "final-ltv",
            "properties": {
              "transformation": "direct copy"
            }
          }
        },
        "roots": [
          "source-layer",
          "processing-layer",
          "target-layer"
        ]
      },
      "comparator": {
        "path": true
      }
    }
  ],
  "commit": true,
  "commitMessage": "Initial customer data pipeline model structure",
  "preview": false,
  "includeChangeset": true,
  "expectDraft": false
}
```

**Execute the request to create your model**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data @customer-pipeline.json \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

Note that the curl command must be executed from the directory containing your `customer-pipeline.json` file.

**Response**

The API returns a response showing the changeset and mapping of user-defined IDs to new Solidatus entity IDs:

```
{
  "changeset": [...],
  "ids": {
    "source-layer": "675a1b2c8f4e7a0001dc2b16",
    "crm-system": "675a1b2c8f4e7a0001dc2b17",
    "customers-table": "675a1b2c8f4e7a0001dc2b18",
    ...
  },
  "errors": [],
  "revisionId": "675a1b2c8f4e7a0001dc2b50"
}
```

<figure><figcaption><p>This is what the model you created looks like</p></figcaption></figure>

### Note on Entity IDs

{% hint style="success" %}
Some commands in this tutorial, such as `AddTransition`, require you to know the Solidatus entity IDs of entities you want to modify.
{% endhint %}

You can find entity IDs in several ways:

* In the changeset of an API response when you create or retrieve a model
* Using a `GET /api/v1/models/modelId/load` request to retrieve the full model JSON, which includes entity IDs
* By exporting a model in JSON format and looking up entity IDs in the exported data
* In the UI by opening a model, selecting an entity, and opening the **INSPECTOR** sidebar tab. Entity IDs of a selected entity are shown in the Selection panel at the top of the sidebar.

<figure><figcaption><p>Location of an entity ID in the Solidatus UI</p></figcaption></figure>

## Step 4: Add individual entities

You can add additional new entities individually using the `AddEntity` command. This is useful for incremental model building or when adding entities to specific locations.

**Add a new table to the CRM system**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "AddEntity",
        "entity": {
          "name": "customer_preferences",
          "properties": {
            "object_type": "table",
            "record_count": "45000",
            "created_date": "2024-01-15"
          }
        },
        "parent": "entity ID of CRM Database object",
        "pos": "3"
      }
    ],
    "commit": true,
    "commitMessage": "Add customer preferences table",
    "includeChangeset": true
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

## Step 5: Modify entity properties

Update properties of existing entities using the `SetProperties` command.

**Update multiple properties at once**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "SetProperties",
        "id": "entity ID of customers table",
        "properties": {
          "record_count": "52000",
          "last_updated": "2024-01-20",
          "data_quality_score": "95%",
          "retention_policy": "7 years"
        }
      }
    ],
    "commit": true,
    "commitMessage": "Update customers table metadata"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

To update properties for more than one entity at once, add additional commands to the `cmds` array or use composable `SetProperty` or `SetProperties` commands as described in [edit models using commands](/api-documentation/api-actions/api-use-the-api).

## Step 6: Create additional transitions

Add new data flow relationships between entities using the `AddTransition` command.

**Add a data quality check flow**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "AddTransition",
         "id": "123",
         "source": "entity ID of customers table",
         "target": "entity ID of customer_data_clean dataset",
         "properties": {
            "transformation": "data quality validation",
            "validation_rules": "email format, phone format, required fields",
            "error_handling": "log and quarantine invalid records",
            "success_rate": "98.5%"
        }
      }
    ],
    "commit": true,
    "commitMessage": "Add data quality validation flow"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

{% hint style="success" %}
To find entity IDs of the customers table and the customer\_data\_clean dataset, refer to the changeset returned when you created the model in Step 3 or retrieve the full model data using a `GET /api/v1/models/{MODEL_ID}/load` request. See [Note on Entity IDs](https://docs-pr-268.solidatus.dev/api/tutorials/build-model-api.html#entity-ids) for more details.
{% endhint %}

## Step 7: Build relationships to reference models

Create relationships between your lineage model entities and terms in reference models using the `SetRelationship` command. You will need IDs of the lineage entity, reference model, and reference term you want to relate to.

**Add a relationship to a data governance term**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "SetRelationship",
        "id": "entity ID of customers table",
        "referenceModelId": "ID of your reference model",
        "termId": "ID of PII classification term",
        "label": "is classified as"
      }
    ],
    "commit": true,
    "commitMessage": "Add PII classification relationship"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

## Step 8: Delete and replace transitions

Remove existing transitions and optionally replace them with new ones using the `ReplaceTransitions` command. This is useful when data flows change or when you need to clean up incorrect lineage.

**Replace transitions between source and target entities**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "ReplaceTransitions",
        "source": "entity ID of CRM Database object",
        "target": "entity ID of Customer ETL object",
        "transitions": [
          {
            "source": ["CRM Database", "customers", "customer_id"],
            "target": ["Customer ETL", "customer_data_clean", "customer_id"],
            "properties": {
              "transformation": "direct copy with validation",
              "quality_check": "primary key validation"
            }
          }
        ]
      }
    ],
    "commit": true,
    "commitMessage": "Replace transitions with improved lineage"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

## Step 9: Bulk property updates

Use composable commands to update multiple entities at once based on property matching.

**Update all PII fields with compliance properties**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "UpdateBy",
        "query": {
          "propertyQuery": {
             "key": "pii",
             "value": "true"
           }
        },
        "composableCommands": [
          {
            "cmd": "SetPropertyComposable",
            "propertyName": "compliance_required",
            "propertyValue": "GDPR, CCPA"
          },
          {
            "cmd": "SetPropertyComposable",
            "propertyName": "encryption_required",
            "propertyValue": "true"
          },
          {
            "cmd": "SetPropertyComposable",
            "propertyName": "access_level",
            "propertyValue": "restricted"
          }
        ]
      }
    ],
    "commit": true,
    "commitMessage": "Add compliance properties to PII fields"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

## Step 10: Move and reorganize entities

Reorganize your model structure by moving entities to different locations.

**Move an entity to a different parent**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer API_TOKEN" \
  --data '{
    "cmds": [
      {
        "cmd": "MoveEntity",
        "id": "Insert entity ID of customer_billing",
        "parent": "Insert entity ID of CRM Database object",
        "pos": "1"
      }
    ],
    "commit": true,
    "commitMessage": "Reorganize entity hierarchy"
  }' \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/update
```

## Step 11: Retrieve and verify your model

**Get complete model data**

```
curl --header "Authorization: Bearer API_TOKEN" \
  SOLIDATUS_URL/api/v1/models/MODEL_ID/load
```

This returns the complete model in Solidatus JSON format, including all entities, properties, transitions, and metadata.

## Step 12: Use ReplaceModel for further updates

The `ReplaceModel` command relies on being passed an entire desired model structure, which it uses to update an existing model. To determine if something is new, changed, or deleted, it uses a **comparator** to correlate existing model entities with ones in the incoming data.

This means that to preserve existing entities, relationships, properties, or transitions in a model, they must be recorded in the replacement JSON and a **comparator** must be used correctly.

When using `ReplaceModel`, the goal is to ensure an accurate diff between existing and incoming data, so Solidatus only logs *actual* changes in the revision history and maintains existing entities where no changes occurred.

{% hint style="success" %}
If you do not use a comparator correctly, `ReplaceModel` results in a record showing that everything in the existing model was deleted and everything in the incoming data was added.
{% endhint %}

### Using comparators with ReplaceModel

A comparator tells Solidatus how to correlate incoming data with existing data in a model.

You can use Solidatus entity IDs as comparators, but this requires you to know and record the IDs of all existing entities in your replacement JSON. This is often impractical for automated workflows.

However, if you don’t use Solidatus entity IDs as comparators, it’s important to generate replacement model data in the same repeatable, reproducible way as originally imported data. This includes maintaining consistent child order under parents and consistent layer order.

Three alternative comparators are available:

**Path comparator**

Uses an entity’s path: its layer name + parent names + entity name (separated by `/`).

```
"comparator": {
  "path": true
}
```

*Benefits:*

* Solidatus automatically calculates paths from parent-child relationships in your JSON
* No need to explicitly record paths for each entity in the JSON

*Limitations:*

* Cannot handle entities with duplicate paths
* Cannot handle names containing forward slash `/` characters

**Property comparator**

Matches based on identical values of a specified property. The property should be a unique identifier, such as an ID from the source system.

```
"comparator": {
  "property": "source_system_id"
}
```

*Benefits:*

* Flexibly generate unique property values to avoid duplicates
* Handles duplicate names and paths
* Handles entities with `/` in their names

*Limitations:*

* Requires strategy for generating unique values consistently
* The comparator property might not be meaningful to end users of the model

**Name comparator**

Matches based solely on entity names.

```
"comparator": {
  "name": true
}
```

*Benefits:*

* Simplest method to implement

*Limitations:*

* Cannot handle duplicate names
* Cannot handle name changes between uploads

### Test model updates with ReplaceModel

Practice updating your customer pipeline model using the example data provided in Step 3. Test with the path comparator or add unique ID properties and use the property comparator.

**Update your customer pipeline with new data**

1. Create a new file: `customer-pipeline-v2.json`
2. Copy and paste into it the sample model data from Step 3
3. Make some modifications. For example, add a new data source or new transitions.

Here is abbreviated example data that adds a new marketing system data source and a transition to link campaign customer IDs to processed customer IDs:

```
{
  "cmds": [
    {
      "cmd": "ReplaceModel",
      "model": {
        "entities": {
          // Include all existing entities you want to keep
          "source-layer": {
            "name": "Source Systems",
            // ... existing properties
            "children": ["crm-system", "billing-system", "marketing-system"]
          },
          // Add new entities
          "marketing-system": {
            "name": "Marketing Platform",
            "properties": {
              "system_type": "database",
              "technology": "MongoDB",
              "owner": "Marketing Team"
            },
            "children": ["campaigns-collection"]
          },
          "campaigns-collection": {
            "name": "campaigns",
            "properties": {
              "object_type": "collection",
              "record_count": "25000"
            },
             "children": ["campaign-cust-id"]
          },
           "campaign-cust-id": {
             "name": "customer_id",
             "properties": {
               "data_type": "string",
               "required": "true"
             }
           },
         // ... include all other existing entities
        "transitions": {
          // Include existing transitions plus new ones
          "campaign-cust-id:proc-cust-id": {
            "source": "campaign-cust-id",
            "target": "proc-cust-id",
            "properties": {
              "transformation": "customer ID matching"
            }
          }
          // ... include all other existing transitions
        },
        "roots": ["source-layer", "processing-layer", "target-layer"]
      },
      "comparator": {
        "path": true
      }
    }
  ],
  "commit": true,
  "commitMessage": "Add marketing system integration",
  "includeChangeset": true
}
```

**Execute the update**

```
curl -X POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {API_TOKEN}" \
  --data @customer-pipeline-v2.json \
  SOLIDATUS_URL/api/v1/models/{MODEL_ID}/update
```

{% hint style="success" %}
To test the property comparator, first add a unique ID property to existing entities, then use the property comparator in subsequent requests. You can add the property in an API request using the path comparator or in the Solidatus UI.
{% endhint %}

**Verify your changes**

After the update, only the new entities and transitions appear as recorded changes in the revision history. Existing unchanged entities remain unmodified, demonstrating the power of comparator-based updates for maintaining clean change tracking.

## Next steps

With your model built, you can:

* **Automate updates**: Create scripts to regularly update your model with fresh data
* **Integrate**: Connect your model building to CI/CD pipelines or data engineering workflows
* **Monitor**: Set up automated model validation and quality checks
* **Report**: Use the API to extract model data for external reporting systems
* **Update**: Upload changes to model data using the `ReplaceModel` command

For more information on API operations, see:

* [Edit models using commands](/api-documentation/api-actions/api-use-the-api) - Complete model update command reference
* [Solidatus JSON format](/api-documentation/api-actions/solidatus-json-format) - Detailed JSON specification for Solidatus models
* [API Authentication](/connectors/connectors-overview/api-authentication) - Authenticating to the API
* Our API developer reference - Complete endpoint and schema reference, accessible through the Help menu at the top right side of the navigation bar inside Solidatus.

You now have a fully functional model created entirely through the API, demonstrating the power and flexibility of the API for programmatic model building and updating.
