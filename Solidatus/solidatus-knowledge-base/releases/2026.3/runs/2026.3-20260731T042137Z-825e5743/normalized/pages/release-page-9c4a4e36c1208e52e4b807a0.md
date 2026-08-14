# Hive

Apache Hive is a data warehouse project that sits on top of Apache Hadoop. The Apache Hive driver is not bundled with this connector and therefore must be added to the Java execution classpath. See the [Custom Driver config](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/usage#Advanced-use-with-custom-driver-config) section for more details. The JDBC connector supports a number of Hive specific features. To enable these features, `solidatus.jdbc.driver` must be set to `custom`, with `solidatus.jdbc.driver-class` set to the Hive JDBC class. For SQL parsing related features `solidatus.jdbc.dialect` must be set to `hive`.

## **Supported Features Overview**

| **Feature** | **Included** | **Coverage**                                                                                                                     |
| :---------: | :----------: | -------------------------------------------------------------------------------------------------------------------------------- |
|  Structure  |       ✓      | Database structure                                                                                                               |
|   Lineage   |       ✓      | SQL Parsing from scripts and data dictionary metadata to visualise the flow of data between database objects at the column level |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|    **Database concept**   | **Solidatus model representation** |                                                **Link to feature page**                                                |
| :-----------------------: | :--------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
|          Schemas          |               Layers               |  [Schema Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#schema) |
|           Tables          |               Objects              |  [Table Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#tables)  |
|           Views           |               Objects              |   [View Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#views)   |
|          Columns          |             Attributes             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
|         Data types        |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
|  Primary key constraints  |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
|  Foreign key constraints  |             Transitions            | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
| View column-level lineage |             Transitions            |            [SQL Parsing](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing)            |
