# Databricks

When a Solidatus Purview Connector has a Databricks job set up, the connector is able to pull tables, views and notebook jobs from the specified Solidatus model, creating assets and relationships in Purview. It will use properties from the objects in Solidatus in order to create the following Purview Assets:

* Databricks Catalog
* Databricks Schema
* Databricks Table
* Databricks View
* Databricks Table Column
* Databricks View Column
* Databricks Process
* Databricks Job
* Databricks Notebook Task

## Features

* Create and push Databricks assets to Microsoft Purview
* Create a push column level lineage for Databricks Jobs to Microsoft Purview

## Pre-Requisites

* Access to a Solidatus instance via API
* A valid Solidatus API token
* Read access to Solidatus model created by Solidatus Databricks connector
* Microsoft Service Principal credentials, with ability to create assets and relationships in Microsoft Purview
* Access to Microsfot Purview user-interface to verify results

## Known Limitations

* Databricks Views are not currently supported
* Databricks model metadata needs to be manually pushed

## Qualified Names

Assets in Purview can be referenced in one of two ways. One is through the use of a GUID, the other is by using a unique attribute on the asset. One such unique attribute is the `qualifiedName`, which is defined by way of a regex on the appropriate asset type in Purview. The connector builds the Purview `qualifiedName` using the metadata within the Solidatus model.

For Databricks the qualified names used are:

| Asset Type                 | Qualified Name                                                                                   | Example                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `databricks_metastore`     | `databricks://<MetastoreId>`                                                                     | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e`                                                                       |
| `databricks_catalog`       | `databricks://<MetastoreId>/catalogs/<Catalog>`                                                  | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main`                                                         |
| `databricks_schema`        | `databricks://<MetastoreId>/catalogs/<Catalog>/schemas/<Schema>/`                                | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main/schemas/default`                                         |
| `databricks_table`         | `databricks://<MetastoreId>catalogs/<Catalog>/schemas/<Schema>/tables/<Table>`                   | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main/schemas/default/tables/department`                       |
| `databricks_view`          | `databricks://<MetastoreId>catalogs/<Catalog>/schemas/<Schema>/views/<View>`                     | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main/schemas/default/views/department`                        |
| `databricks_table_column`  | `databricks://<MetastoreId>/catalogs/<Catalog>/schemas/<Schema>/tables/<Table>/columns/<Column>` | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main/schemas/default/tables/department/columns/name`          |
| `databricks_view_column`   | `databricks://<MetastoreId>/catalogs/<Catalog>/schemas/<Schema>/views/<View>/columns/<Column>`   | `databricks://f27d9d14-8edd-4964-a5fb-2f9f5d113c6e/catalogs/main/schemas/default/views/department/columns/name`           |
| `databrcicks_process`      | `databricks://<Workspace>/notebooks/<Notebook>/jobs/<Job>/tasks/<Task>/processes/<Process>`      | `databricks://adb-3811074401831777.17.azuredatabricks.net/jobs/13/tasks/task1/processes/1babea11a3ed1971a4bae2571eeee435` |
| `databricks_job`           | `databricks://<Workspace>/notebooks/<Notebook>/jobs/<Job>`                                       | `databricks://adb-3811074401831777.17.azuredatabricks.net/jobs/13`                                                        |
| `databricks_notebook_task` | `databricks://<Workspace>/notebooks/<Notebook>/jobs/<Job>/tasks/<Task>`                          | `databricks://adb-3811074401831777.17.azuredatabricks.net/jobs/13/tasks/task1`                                            |

The connector builds the qualified name from properties which are present on model entities in a Databricks-sourced Solidatus model.

In a Databricks model the root entities or layers represent the schemas within a Databricks Catalog, tables and views are objects within a layer, columns are children of the table/view objects.

In a Databricks model jobs are groups within a Jobs layer.

| Qualified Name Part | Property Key                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `<MetastoreId>`     | This is loaded from the model metadata                           |
| `<Catalog>`         | `Catalog` property of a model layer                              |
| `<Schema>`          | `Name` property from a model layer                               |
| `<Table>`           | `Name` property from a child object of a layer which is a schema |
| `<View>`            | `Name` property from a child object of a layer which is a schema |
| `<Column>`          | `Name` of the attribute which is a child of a table/view         |
| `<Process>`\*       | `Name` of child object from the Jobs layer                       |
| `<Job>`             | `Name` of child object from the Jobs layer                       |
| `<Task>`\*          | `Name` of child object from the Jobs layer                       |

`*There are no corresponding model entities that map directly to these Databricks Assets, they are derived from the Job model entity.`

## Purview Asset Type Mapping

Purview is a strongly-typed system, whereas Solidatus is not. Therefore we have created a mechanism for mapping entities or metadata in Solidatus to types in Purview, in order to create the correct hierarchy of assets within Purview. The below table gives the detail on how each currently supported Databricks Purview type is generated from a Solidatus model.

| Purview Asset Type         | Solidatus Model source                                       |
| -------------------------- | ------------------------------------------------------------ |
| `databricks_catalog`       | Created from model metadata supplied by Databricks connector |
| `databricks_schema`        | Created from a model layer                                   |
| `databricks_table`         | Created from child objects of a schema model layer           |
| `databricks_view`          | Created from child objects of a schema model layer           |
| `databricks_table_column`  | Created from child objects of a table model object           |
| `databricks_view_column`   | Created from child objects of a view model object            |
| `databricks_process`       | Derived from child objects from the Jobs layer               |
| `databricks_job`           | Create from child objects from the Jobs layer                |
| `databricks_notebook_task` | Derived from child objects from the Jobs layer               |

## Lineage Relationship Mapping

### Databricks Job Column Level Lineage

Databricks Job column level lineage is captured in the Solidatus model by the Solidatus Databricks Connector. The Solidatus Purview Connector will read the column level lineage from the Solidatus model and push it to Purview as a set of column mappings on a `databricks_process` asset. The `databricks_process` asset is linked to a `databricks_job_task` asset via a relationship of type `databricks_runnable_process`; The `databricks_job_task` asset is linked to a `databricks_job` asset via a relationship of type `databricks_job_job_task`

The below diagram shows how Databricks assets are linked via relationships in Purview
