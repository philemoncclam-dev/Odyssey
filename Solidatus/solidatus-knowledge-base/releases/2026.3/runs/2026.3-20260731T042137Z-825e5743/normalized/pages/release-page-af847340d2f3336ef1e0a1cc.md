# Sybase IQ

Sybase IQ (or SAP IQ) is a relational database management system offering from SAP. The JDBC connector can connect to a Sybase ASE server to pull structure and lineage metadata. To leverage these capabilities, `solidatus.jdbc.driver` must be set to `sybaseIQ`. For SQL parsing related features `solidatus.jdbc.dialect` must be set to `sybaseIQ`.

## **Supported Features Overview**

| **Feature** | **Included** | **Coverage**                                                                                                                     |
| :---------: | :----------: | -------------------------------------------------------------------------------------------------------------------------------- |
|  Structure  |       ✓      | Database structure                                                                                                               |
|   Lineage   |       ✓      | SQL Parsing from scripts and data dictionary metadata to visualise the flow of data between database objects at the column level |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|     **Database concept**    | **Solidatus model representation** |                                                              **Link to feature page**                                                             |
| :-------------------------: | :--------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|           Schemas           |               Layers               |               [Schema Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#schema)               |
|            Tables           |               Objects              |                [Table Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#tables)               |
|       Temporary Tables      |               Objects              | [Temporary Tables](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-11/features#temporary-tables) |
|            Views            |               Objects              |                 [View Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#views)                |
|           Columns           |             Attributes             |               [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|          Data types         |             Properties             |               [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|   Primary key constraints   |             Properties             |               [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|   Foreign key constraints   |             Transitions            |               [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns)              |
|  View column-level lineage  |             Transitions            |                          [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)                         |
| Script column-level lineage |             Transitions            |                       [Script Lineage](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/scriptlineage)                      |
