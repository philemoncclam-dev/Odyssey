# Oracle

Oracle Database is a multi-model database management system. There are a number of Oracle specific features that the connector can represent in the model. To enable these features `solidatus.jdbc.driver` must be set to `oracle12`. For SQL parsing related features `solidatus.jdbc.dialect` must be set to `oracle`.

## **Supported Features Overview**

|   **Feature**   | **Included** | **Coverage**                                                                                                                                        |
| :-------------: | :----------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|    Structure    |       ✓      | Database structure                                                                                                                                  |
|     Lineage     |       ✓      | SQL Parsing from scripts, stored procedures and data dictionary metadata to visualise the flow of data between database objects at the column level |
| SQL Derivations |       ✓      | Source code for Table level derivations and Column level derivations                                                                                |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|      **Database concept**      | **Solidatus model representation** |                                                           **Link to feature page**                                                           |
| :----------------------------: | :--------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
|             Schemas            |               Layers               |             [Schema Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#schema)            |
|             Tables             |               Objects              |             [Table Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#tables)             |
|              Views             |               Objects              |              [View Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#views)              |
|             Columns            |             Attributes             |            [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)            |
|           Data types           |             Properties             |            [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)            |
|     Primary key constraints    |             Properties             |            [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)            |
|     Foreign key constraints    |             Transitions            |            [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)            |
|    View column-level lineage   |             Transitions            |                       [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                       |
| Procedure column-level lineage |             Transitions            |                       [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                       |
|  Function column-level lineage |             Transitions            |                       [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                       |
|            Packages            |               Objects              |       [Packages](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-6/features#packages)       |
|            Synonyms            |               Objects              |       [Synonyms](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-6/features#synonyms)       |
|      Database Link Tables      |               Objects              | [Database Links](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-6/features#database-links) |
|  Table derivation source code  |             Properties             |                  [SQL Derivation Logic](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/derivations)                  |
|  Column derivation source code |             Properties             |                  [SQL Derivation Logic](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/derivations)                  |
