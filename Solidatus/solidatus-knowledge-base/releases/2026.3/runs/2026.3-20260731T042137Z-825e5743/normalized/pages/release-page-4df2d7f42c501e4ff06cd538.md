# Output Module Queries

Solidatus Collibra Connector supports Collibra asset metadata import using user-defined output module query. For more information on the Collibra Output Module please reference its [documentation](https://cdn.collibra.com/Community/Documentation/2022.06/Collibra-Output-Module-2022.06.pdf).

## Asset Query Template

We provide a query template which you can use to create a query with your own filter. The query template contains a set of required entity properties that defines the query response structure for Solidatus Collibra Connector. Entities within the output module query template below have been aliased to allow for generic extraction of the response metadata from the output module API. Note that the below template contains an example filter to filter assets by domain.

```json
{
  "ViewConfig": {
    "Resources": {
      "Asset": {
        "name": "AllAssets",
        "Id": {
          "name": "id"
        },
        "Signifier": {
          "name": "name"
        },
        "AssetType": {
          "name": "AssetTypes",
          "Id": {
            "name": "assetTypeId"
          },
          "Signifier": {
            "name": "assetTypeName"
          }
        },
        "Domain": {
          "name": "Domains",
          "Id": {
            "name": "domainId"
          },
          "Name": {
            "name": "domainName"
          },
          "DomainType": {
            "name": "DomainTypes",
            "Id": {
              "name": "domainTypeId"
            },
            "Signifier": {
              "name": "domainTypeName"
            }
          },
          "Community": {
            "name": "Communities",
            "Id": {
              "name": "communityId"
            },
            "Name": {
              "name": "communityName"
            }
          }
        },
        "DisplayName": {
          "name": "displayName"
        },
        "Status": {
          "name": "AssetStatus",
          "Signifier": {
            "name": "statusName"
          }
        },
        "Relation": {
          "name": "Relations",
          "type": "SOURCE",
          "Id": {
            "name": "relationId"
          },
          "RelationType": {
            "name": "RelationTypes",
            "Id": {
              "name": "relationTypeId"
            },
            "Role": {
              "name": "relationTypeRole"
            },
            "Corole": {
              "name": "relationTypeCorole"
            }
          },
          "SourceAsset": {
            "name": "SourceAssets",
            "Id": {
              "name": "sourceAssetId"
            }
          },
          "TargetAsset": {
            "name": "TargetAssets",
            "Id": {
              "name": "targetAssetId"
            }
          }
        },
        "Attribute": {
          "name": "Attributes",
          "Value": {
            "name": "attrValue"
          },
          "AttributeType": {
            "name": "attrType",
            "Signifier": {
              "name": "attrName"
            }
          }
        },
        "Filter": {
          "Field": {
            "name": "domainId",
            "operator": "EQUALS",
            "value": "$domainId"
          }
        }
      }
    }
  }
}
```

### Add entity or property

If entities or properties that you would like to filter by are not present in the template, you can add them to the query and use them in `Filter`.

As the query template defines the response structure, you **should not remove or modify** any existing properties or node names other than `Filter`. The connector will perform validation on your query and throw an error if it does not conform to the template schema.

#### Example

In this example, a user would like to query assets using `CreatedOn` property. This property is not set in the template hence it can be added to `/ViewConfig/Resources/Asset` and a new filter can be created using this property

```json
{
  "ViewConfig": {
    "Resources": {
      "Asset": {
        ...
        "CreatedOn": {
          "name": "createDate"
        },
        ...
        "Filter": {
          "AND": [
            {
              "Field": {
                "name": "domainId",
                "operator": "EQUALS",
                "value": "02204077-1cd1-4c70-a7c4-4cd845194b81"
              }
            },
            {
              "Field": {
                "name": "createDate",
                "operator": "GREATER",
                "value": "1440492290300"
              }
            }
          ]
        }
      }
    }
  }
}
```

### Add filter

You can create a filter using existing properties from the template or any new properties you add as the filtering property. There is no strict validation on `Filter` but your query must contain **at least 1 filter**.

#### Example

Filter by Domain and Asset Status

```json
"Filter": {
  "AND": [
    {
      "Field": {
        "name": "domainId",
        "operator": "EQUALS",
        "value": "02204077-1cd1-4c70-a7c4-4cd845194b81"
      }
    },
    {
      "Field": {
        "name": "statusName",
        "operator": "IN",
        "value": [
          "New",
          "In Review",
          "Accepted"
        ]
      }
    }
  ]
}
```

Filter by Domain and Asset Type

```json
"Filter": {
  "AND": [
    {
      "Field": {
        "name": "domainId",
        "operator": "EQUALS",
        "value": "02204077-1cd1-4c70-a7c4-4cd845194b81"
      }
    },
    {
      "Field": {
        "name": "assetTypeId",
        "operator": "EQUALS",
        "value": "00000000-0000-0000-0000-000000031007"
      }
    }
  ]
}
```
