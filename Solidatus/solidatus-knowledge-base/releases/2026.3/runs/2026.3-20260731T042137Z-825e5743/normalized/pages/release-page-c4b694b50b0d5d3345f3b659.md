# Oracle

## Purview Oracle Integration

The Solidatus Connector for Purview allows you to push a Solidatus Oracle lineage model, created by the Solidatus\
Database (JDBC) Connector into Purview.

The Solidatus Purview Integration for Oracle will find and match existing Oracle database assets in Purview, based on\
their Purview Fully Qualified Name (FQN), with Solidatus entities in the Oracle lineage model.

If a matching asset can not be found, then a new Purview Asset is created.

All data lineage from the Solidatus model is pushed to Purview. Any existing lineage between matched oracle assets in\
Purview, is over-written.

Any existing Oracle Purview Assets which have related Glossary Terms, where the term has been imported into a\
Solidatus Reference Model, will have a Reference Model relationship created in Solidatus on their matched lineage\
model entity.

## Features

* Export a Solidatus Database Connector Oracle lineage model into Purview
  * Tables
  * Views
  * Columns
  * Stored Procedures
  * Packages
  * Column level lineage
* Includes matching/creation of Assets and Lineage Relationships
* A Solidatus entity link is added to each matched Oracle Purview Asset
* A Purview Asset link is added to each matched Solidatus Lineage Model entity
* Oracle Asset Classification values are mapped to Solidatus model entity Property Groups
* Reference Model relationships created in Solidatus for Oracle Purview Assets with related Glossary Terms.

## Unsupported Features

* Solidatus Lineage Model entity relationships to Solidatus Reference Model terms, are not exported as relationships to Purview Glossary Terms
* Oracle Synonyms are not exported
* Oracle Triggers are not exported
* Oracle Indexes are not exported
* Oracle Constraints are not exported
* Oracle Sequences are not exported

## Qualified Names

Assets in Purview can be referenced in one of two ways. One is through the use of a GUID, the other is by using a unique attribute on the asset. One such unique attribute is the `qualifiedName`, which is defined by way of a regex on the appropriate type in Purview.

For Oracle table/view column assets the general layout of one of these qualified names is as follows:

`oracle://<oracle-server>/schemas/<schema>/[table|view]s/<tableOrView>/columns/<column>`

For assets further up the hierarchy they use the appropriate prefix of this qualified name in order to define themselves; for example, a schema's qualified name would end with `schemas/<schema>`.

Currently, we construct the qualified name from properties which are present on objects in an Oracle-sourced Solidatus model. For one of these table or view objects the properties are read as follows:

| Qualified Name Part | Property Key                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| `oracle-server`     | This is loaded from the model metadata and represents the Oracle SID or Service Name |
| `schema`            | `TABLE_SCHEM`                                                                        |
| `[table\|view]`     | `TABLE_TYPE`                                                                         |
| `tableOrView`       | `TABLE_NAME`                                                                         |
| `column`            | Name of the attribute which is a child of a table/view                               |

## Type Mapping

Purview is a strongly-types system, whereas Solidatus is not. Therefore, we have created a mechanism for mapping entities or metadata in Solidatus to types in Purview, in order to create the correct hierarchy of assets within Purview. The below table gives the detail on how each currently supported Oracle Purview type is generated from a Solidatus model.

| Purview Type            | Solidatus Entity/Other                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Oracle Server           | Created from model metadata or connector job property                                        |
| Oracle Schema           | Created from the TABLE\_SCHEM property on a table/view                                       |
| Oracle Table            | Created from objects in the Solidatus model where the TABLE\_TYPE property is equal to TABLE |
| Oracle Table Column     | Created from children of objects with TABLE\_TYPE property equal to TABLE                    |
| Oracle View             | Created from objects in the Solidatus model where the TABLE\_TYPE property is equal to VIEW  |
| Oracle View Column      | Created from children of objects with TABLE\_TYPE property equal to VIEW                     |
| Oracle Package          | Created from SOL.package property of stored procedure model objects                          |
| Oracle Stored Procedure | Created from model objects with the SOL.isProcedure property                                 |

## Lineage Relationship Mapping

Currently, the connector supports loading column level stored procedure and view lineage from an Oracle-sourced Solidatus model. This means lineage will be created between tables and views, or views and views and for Oracle stored procedures.

## Known Issues

* Oracle Synonyms are not currently mapped from the Solidatus model to a Purview Asset
* Oracle DBLinks for linked server are not currently mapped from the Solidatus Model to a Purview Asset
