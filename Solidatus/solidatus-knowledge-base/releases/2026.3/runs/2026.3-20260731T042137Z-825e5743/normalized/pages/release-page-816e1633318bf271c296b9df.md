# SQL Server

Microsoft SQL Server is a relational database management system. The JDBC connector can connect to a SQLServer database to pull structure and lineage metadata. To leverage these capabilities, `solidatus.jdbc.driver` must be set to `sqlserver`. For SQL parsing related features `solidatus.jdbc.dialect` must be set to `sqlserver`.

## **Supported Features Overview**

|   **Feature**   | **Included** | **Coverage**                                                                                                                                        |
| :-------------: | :----------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|    Structure    |       ✓      | Database structure                                                                                                                                  |
|     Lineage     |       ✓      | SQL Parsing from scripts, stored procedures and data dictionary metadata to visualise the flow of data between database objects at the column level |
| SQL Derivations |       ✓      | Source code for Table level derivations and Column level derivations                                                                                |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|      **Database concept**      | **Solidatus model representation** |                                                             **Link to feature page**                                                             |
| :----------------------------: | :--------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: |
|             Schemas            |               Layers               |               [Schema Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#schema)              |
|             Tables             |               Objects              |               [Table Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#tables)               |
|              Views             |               Objects              |                [View Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#views)                |
|        Temporary Tables        |               Objects              | [Temporary Tables](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-9/features#temporary-tables) |
|             Columns            |             Attributes             |              [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|           Data types           |             Properties             |              [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|     Primary key constraints    |             Properties             |              [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|     Foreign key constraints    |             Transitions            |              [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|    View column-level lineage   |             Transitions            |                         [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                         |
| Procedure column-level lineage |             Transitions            |                         [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                         |
|  Table derivation source code  |             Properties             |                    [SQL Derivation Logic](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/derivations)                    |
|  Column derivation source code |             Properties             |                    [SQL Derivation Logic](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/derivations)                    |

## **Special cases**

### Fabric Lakehouse

For information on the JDBC connector's ability to connect to a Microsoft Fabric Lakehouse, visit the following [page](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-9/fabric-data-lakehouse).
