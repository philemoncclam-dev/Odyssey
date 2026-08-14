# DB2

DB2 is part of a set of database products built by IBM. The JDBC connector can connect to a DB2 database to pull structure metadata. To leverage these capabilities, `solidatus.jdbc.driver` must be set to `db2`.

## **Supported Features Overview**

| **Feature** | **Included** | **Coverage**       |
| :---------: | :----------: | ------------------ |
|  Structure  |       ✓      | Database structure |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|   **Database concept**  | **Solidatus model representation** |                                                **Link to feature page**                                                |
| :---------------------: | :--------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
|         Schemas         |               Layers               |  [Schema Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#schema) |
|          Tables         |               Objects              |  [Table Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#tables)  |
|          Views          |               Objects              |   [View Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#views)   |
|         Columns         |             Attributes             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
|        Data types       |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
| Primary key constraints |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
| Foreign key constraints |             Transitions            | [Column Extraction](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/metadataextraction#columns) |
