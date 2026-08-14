# Exporting from Solidatus to Collibra

To export, the following fields will be required in the config:

#### Config

| Config field       | Default                              | Notes                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| solModelId         | N/A                                  | ID of Solidatus model to export.                                                                                                                                                                                                                                                                                        |
| solEntityId        | N/A                                  | Optional. ID of Solidatus entity within the specified Solidatus model to export. You can provide a list to this field in order to export multiple entities. If the list contains only IDs of Solidatus layers, then Collibra relations are created in between connected entities by inferring the lineage between them. |
| dryRun             | false                                | Optional. Sets the submitted Collibra job to be a simulation. The job will not edit assets in Collibra even if the job succeeds.                                                                                                                                                                                        |
| createAttribute    | false                                | Optional. Whether to create Collibra Attributes as part of the Export Job. Note that when enabled and the Solidatus model contains entities that represent Collibra assets with invalid attributes, the job will fail.                                                                                                  |
| propertyKeys       | N/A                                  | Optional. Specify one or more property keys. Will export entities (and their children) that have this property on them.                                                                                                                                                                                                 |
| adoptiveRelationId | 00000000-0000-0000-0000-000000007017 | Legacy. ID of Collibra relation that should be used to represent a parent-child relation between new Collibra attributes                                                                                                                                                                                                |

#### Identifying where to export to

When exporting a Solidatus entity, certain properties on that entity will help identify where to export to in Collibra. The exporter will use the Solidatus entity name and the property '*COLL:BaseType*' to determine what to export it as. In Collibra, an organisation's name is unique between its siblings. Furthermore, all community names are unique.

* '*COLL:BaseType*': Collibra organisation type \[Community, Domain, Asset]
* '*COLL:ID*': ID of Collibra resource

Furthermore, depending on the organisation type, you can specify more identifiers.

* If the entity should be exported as a Community, you can specify the following properties:
  * '*COLL:Community*': Name of parent Community
* As a Domain, you can specify the following properties:
  * '*COLL:Community*': Name of parent Community
  * '*COLL:Type*': Specific Domain type (see Collibra docs for [Domain type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/organizational-concepts/domain-types/))
* As an Asset, you can specify the following properties:
  * '*COLL:Domain*': Name of parent Domain
  * '*COLL:Type*': Specific Asset type (see Collibra docs for [Asset type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/structural-concepts/asset-types/))
  * '*COLL:Status*': Status of Collibra Asset (see Collibra docs for [Status type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/execution-and-monitoring-concepts/status-types/))

Children of Solidatus entities that have *COLL:BaseType* Asset (either explicitly or implicitly) will also be given *COLL:BaseType* Asset. A parent and child that are both Collibra Assets will be exported to Collibra with a **relation** of type denoted by the config field *adoptiveRelationId*. This config field will override the default *adoptiveRelationId*. You can also set this value on an entity by entity basis by setting the property *COLL:AdoptiveRelationID* on Solidatus entities that represent assets. When this property is set on an entity, it means that in Collibra, the relationship between this parent and its children will be represented by a Collibra relation with ID: *COLL:AdoptiveRelationID*.

#### Exporting Collibra Attributes

**Note exporting of Solidatus properties to Collibra attributes is currently disabled. The Collibra Metamodel should not be edited/exposed outside of Collibra.**

Other properties are exported as Collibra Attributes. A property's key is exported as an attribute type with the property's value as its value. See Collibra docs for [Attribute type](https://university.collibra.com/knowledge/collibra-body-of-knowledge/data-governance-operating-model/structural-concepts/attribute-types/).

Solidatus entity properties that start with the prefix *COLL:* will not be converted into Collibra Attributes.

#### Exporting Collibra Relations

Using the **relationsConfig**, you can specify which Collibra relation types are associated with pairs of source and target asset types when exporting.

```json
{
  "Schema": {
    "Table": {
      "type": "transition",
      "id": "00000000-0000-0000-0000-000000007043"
    }
  },
  "Table": {
    "Column": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007042",
      "reverse": true
    }
  }
}
```

If the above **relationsConfig** is used, Solidatus transitions between source and target entities representing Collibra Assets of types Schema and Table respectively will be exported as a relation with id *"00000000-0000-0000-0000-000000007043"*. Additionally, the parent-child relation between Solidatus entities with types Table and Column respectively will be exported as a relation of id *"00000000-0000-0000-0000-000000007042"*; **NOTE** that this example assumes that the Table-Column relation type is reversed on the Collibra instance relative to the Schema-Table relation type, hence requiring the "reverse: true" field. The below screenshots of the Collibra instance demonstrates this.

### Notes about exporting

#### Job success

Something to note about exporting is that connector jobs from a Solidatus Collibra Exporter agent will always succeed. This is because the success of the connector represents the success of job submission to the Collibra Job Scheduler; but there is no long running thread to detect the latter success of the job in Collibra.

### Examples

#### Example of exporting a domain in a Solidatus model to an existing Collibra community

In this example we want to export a domain to an existing Collibra community called "Test".

We use the following Solidatus model with ID "5fc51da7972c88fee878bf6e"

And the following integration config where "154836f3-b50a-4f53-a1ac-4d0ded4dca55" is the entity ID of GOT Asset Types

```json
{
  "solModelId": "5fc51da7972c88fee878bf6e",
  "solEntityId": "54836f3-b50a-4f53-a1ac-4d0ded4dca55"
}
```

And the following relations config

```json
{
  "GOT Asset Type": {
      "GOT Asset Type": {
          "type": "hierarchy",
          "id": "18114516-fead-4c5d-abab-ca8131250e9d"
      }
  }
}
```

In addition, in order to export to the community "Test", we need the property "COLL:Community" with value "Test" on this entity.

Just the name "Test" is enough to identify the community because communities are unique by name.

**Result:**

We see here that the Solidatus entity has been exported as a Collibra domain as a child of the Collibra community "Test". Here the relations config is used to convert the parent-child relationship between Solidatus entities into Collibra relations. The exported assets under said domain can also be seen by clicking on the Assets button.

#### Example of exporting inferred lineage

In this example we want to export layers in a Solidatus model while also exporting the inferred spanning transitions between entities as Collibra relations.

Given the following Solidatus model with ID "5fc80c6d967fe9e1827ee168"

And the following integration config where "235a6f5a-82ea-4efd-bdd5-2725e4e5cf76" and "de71b1ba-8601-49a6-94d2-388a0e0c2557" are the Solidatus layer entities "Logical Data Dictionary" and "Group Operations" respectively. We can also see that with "France" selected, the Solidatus inferred spanning transitions highlight entities "First Name" and "Mobile Number" as they are indirectly connected through entities in the three collapsed layers.

```json
{
  "solModelId": "5fc80c6d967fe9e1827ee168",
  "solEntityId": [
    "235a6f5a-82ea-4efd-bdd5-2725e4e5cf76",
    "de71b1ba-8601-49a6-94d2-388a0e0c2557"
  ]
}
```

With the following relations config

```json
{
  "Data Attribute": {
      "Country": {
          "type": "transition",
          "id": "00000000-0000-0000-0000-000000007004",
          "reverse": true
      }
  }
}
```

**Result:**

The result of this export is that the chosen Solidatus layers, and their children, are exported to Collibra. Some of their children were indirectly connected through some of the layers that were not exported. So we try export the inferred lineage between indirectly connected entities. As an example, we can see that the Collibra asset, France, has two relations directly connecting it to assets "First Name" and "Mobile Number".
