# Importing from Collibra to Solidatus

To import, the following fields will be required in the config:

**Config**

|                           |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collibraIdToImport        | N/A       | Required. ID of Collibra organisation to import. This can be either a single string value or a list of strings in the form \["xxxx1", "xxxx2"].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| collibraBaseTypeToImport  | Community | Required. Base Type of Collibra organisation to import. Possible values are "Community" or "Domain".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| relationIdsForTransitions | null      | Required. List of Collibra relation IDs to be treated as transitions when imported. When null, will import all relations as transitions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| solModelName              | N/A       | Either solModelName or solModelId is required (not both). Name of Solidatus model to be created when importing. After the import, this field will be replaced by the solModelId field will the newly created model's ID filled in.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| solModelId                | N/A       | Either solModelName or solModelId is required (not both). ID of Solidatus model to import to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| solEntityId               | N/A       | Optional. Only when solModelId is used. ID of Solidatus entity within the specified Solidatus model to import to. Can specify "root" to import as root layer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| arrangeImport             | null      | Required. Possible values are "Layer", "Object" or null. When null, will import Collibra organisation as one Solidatus layer. When "Layer", will import the children of the Collibra organisation as Solidatus layers and will attempt to arrange layers by the direction of the flow of transitions. When "Object", will import the Collibra organisation as duplicate Solidatus layers and its children as Solidatus objects and will attempt to arrange objects by the direction of the flow of transitions. NOTE: for the non null options, if more than one organisation is imported, we ignore the import of the top level organisations but still attempt to rearrange their children appropriately. |
| glossary                  | false     | Optional. Only used when solModelName is used. Determines whether a Solidatus Glossary model or a Solidatus Lineage model is created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| pageSize                  | 100000    | Optional. This value is used to paginate query results to avoid hitting response size limit. Defaults to 100000 if not set. For example, 300000 assets will be returned in 3 pages with 100000 each.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Output Module Querying**

The Connector supports Collibra asset metadata import using a user-defined [output module query](/connectors/connector-specific-documentation/collibra/usage/output-module-queries). Please reference [this section](#running-a-connector-via-the-ui-and-the-job-configuration-screen) for detailed instructions on job configuration in agent mode.

**Results**

The Solidatus entities will be imported with the following properties depending on what was imported from Collibra. Collibra exclusive properties are prefixed with '*COLL:*'.

* From a Community, the entity will have the following properties:
  * '*COLL:BaseType*': Community
  * '*COLL:ID*': Community ID
  * '*COLL:CollibraURL*': URL that links to Collibra Community
* From a Subcommunity, the entity will have the following properties:
  * '*COLL:BaseType*': Community
  * '*COLL:ID*': Community ID
  * '*COLL:CollibraURL*': URL that links to Collibra Community
* From a Domain:
  * '*COLL:BaseType*': Domain
  * '*COLL:ID*': Domain ID
  * '*COLL:CollibraURL*': URL that links to Collibra Domain
  * '*COLL:Type*': Specific Domain type (see Collibra docs for [Domain type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/organizational-concepts/domain-types/))
* From an Asset:
  * '*COLL:BaseType*': Asset
  * '*COLL:ID*': Asset ID
  * '*COLL:CollibraURL*': URL that links to Collibra Asset
  * '*COLL:Type*': Specific Asset type (see Collibra docs for [Asset type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/structural-concepts/asset-types/))
  * '*COLL:Status*': Status of Collibra Asset (see Collibra docs for [Status type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/execution-and-monitoring-concepts/status-types/))
  * '*COLL:OriginalCommunity*': The original community this asset belongs to. An asset might exist under a community it is not a part of in the Solidatus model if the relations config determines that it is a child of an asset in a said community.
  * '*COLL:OriginalDomain*': The original domain this asset belongs to. An asset might exist under a domain it is not a part of in the Solidatus model if the relations config determines that it is a child of an asset in a said domain.

Collibra Attributes are imported as properties on the imported Collibra Assets.

#### Importing Collibra Relations to Solidatus

Collibra Relations can either be imported as transitions or hierarchy (a parent-child relation). Transitions will be imported with the following properties.

* '*COLL:ID*': Relation ID
* '*COLL:RelationTypeID*': ID of Collibra Relation type (see Collibra docs for [Relation type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/structural-concepts/relation-types/))
* '*COLL:Role*': Collibra Relation role (see Collibra docs for [Role](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/execution-and-monitoring-concepts/role-types/))
* '*COLL:Corole*': Collibra Relation corole (see Collibra docs for use case of [Corole](https://university.collibra.com/knowledge/collibra-body-of-knowledge/reference-cases/leveraging-a-territory-glossary-with-office-reference-data/))

When imported as hierarchy, a Collibra relation will only be expressed as a parent-child relation in Solidatus.

Using the **relationsConfig**, you can specify which Collibra relation types are associated with pairs of source and target asset types.

```json
{
  "Data Asset": {
    "Technology Asset": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007005",
    },
    "Data Usage": {
      "type": "transition",
      "id": "00000000-0000-0000-0000-000000007059"
    }
  }
}
```

If the above **relationsConfig** is used, Collibra relations between assets of type Data Asset and Technology Asset will be imported as hierarchy and relations between assets of type Data Asset and Data Usage will be imported as a Solidatus transition.

### Examples

**Example of importing a Collibra domain as a glossary**

Given a Collibra domain of the following form

<figure><figcaption></figcaption></figure>

And the following integration config

<a class="button secondary">Copy</a>

```
{
  "collibraIdToImport": "9c79bdb1-9ad0-444a-8015-50bd29251d1d",
  "collibraBaseTypeToImport": "Domain",
  "relationIdsForTransitions": [],
  "arrangeImport": null,
  "glossary": true,
  "solModelName": "Glossary of Terms"
}
```

And the following relations config

<a class="button secondary">Copy</a>

```
{
  "GOT Asset Type": {
      "GOT Asset Type": {
          "type": "hierarchy",
          "id": "18114516-fead-4c5d-abab-ca8131250e9d"
      }
  }
}
```

**Result:**

Glossary of Terms Solidatus Model

<figure><figcaption></figcaption></figure>

We see that the domain has been imported as a Solidatus Glossary model with name "Glossary Of Terms". The domain is represented as the layer "GOT Asset Types". Because "GOT Asset Types" has assets that have relations with ID `18114516-fead-4c5d-abab-ca8131250e9d` (representing grouping), we use the relation to determine the hierarchy of assets as children of "GOT Asset Types". As we specify "relationIdsForTransitions" as empty, no relations are imported as transitions.

Note that the Solidatus entities have the correct properties imported from Collibra.

Technical Asset properties

<figure><figcaption></figcaption></figure>

**Example of importing a Collibra community as lineage**

Given a Collibra community of the following form

Commercial Banking Collibra Community

<figure><figcaption></figcaption></figure>

Commercial Banking Collibra Assets

<figure><figcaption></figcaption></figure>

And the following integration config

<a class="button secondary">Copy</a>

```
{
  "collibraIdToImport": "783aea16-1ce7-4eed-9251-c2e9056c8301",
  "collibraBaseTypeToImport": "Community",
  "arrangeImport": "Object",
  "glossary": false,
  "solModelName": "Commercial Banking"
}
```

And the following relations config

<a class="button secondary">Copy</a>

```
{
  "Schema": {
      "Table": {
          "type": "hierarchy",
          "id": "00000000-0000-0000-0000-000000007043"
      }
  },
  "Table": {
      "Column": {
          "type": "hierarchy",
          "id": "00000000-0000-0000-0000-000000007042",
          "reverse": true
      }
  },
  "Database": {
      "Table": {
          "type": "hierarchy",
          "id": "00000000-0000-0000-0000-000000007045",
          "reverse": true
      }
  },
  "System": {
      "Database": {
          "type":"hierarchy",
          "id": "7345d44f-acfc-4a90-b3a5-15801ce880a5"
      }
  }
}
```

**Result:**

Commercial Banking Solidatus Model

<figure><figcaption></figcaption></figure>

We see that the community has been imported as a Solidatus Lineage model with name "Commercial Banking". With the setting arrangeImport as "Object", the layers in the imported model all represent the overarching Community "Commercial Banking" and the Collibra domains, as objects, are arranged into an order attempting to best represent the underlying lineage of the import. In order to determine said arrangement, we use the Collibra relations that have been converted into Solidatus transitions.

We specify "relationIdsForTransitions" as null, meaning that all Collibra relations are converted into Solidatus transitions (other than relation type IDs used in the relations config with type "hierarchy").

**Running a connector via the UI and the job configuration screen**

Documentation on using a connector agent via the UI is available through Solidatus help. This section will detail how to set up the Solidatus Collibra connector through the UI in wizard mode.

**Step 1: Configuring the Collibra connection**

This section allows you to provide the connector with information to connect to your Collibra instance. The Collibra host, username and password fields are mandatory. If the connection is unsuccessful, an error will occur and prevent you from moving onto the next step.

<figure><figcaption></figcaption></figure>

**Step 2: Determining how to import Collibra assets**

This section allows you to determine how you import your Collibra assets into your Solidatus model. There are two options: providing an output module query file or providing Collibra organisation IDs (Community or Domain).

<figure><figcaption></figcaption></figure>

**Step 3: Uploading a relations file**

This section allows you to provide the connector with information on what Collibra relations are treated as Solidatus transitions or parent-child hierarchy. If you do not have a relations config created already, please open the `Relations File JSON string` dropdown and click the first value. Then hold the mouse button down on the text and copy it into a `.json` file. Provide the relative path to this file or upload it.

<figure><figcaption></figcaption></figure>

**Step 4: Configuring the Solidatus model output**

This section allows you to provide the connector with information on how the output of the connector should be saved. Toggle the `Create new model` option to determine whether a new model should be created or an existing model updated.

<figure><figcaption></figcaption></figure>

**Step 5: Customising model layout**

This section allows you customise the layout of the output model. It should be noted that this is optional and may cause the connector to take much longer to complete if the model is too large or the server on which the connector is running does not have enough memory. Further, this should not be used when generating a model through an Output Module Query.

<figure><figcaption></figcaption></figure>
