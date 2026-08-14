# Overview

## **Supported Features Overview**

| **Feature** | **Included** | **Coverage**                                                                                                                                                                                                           |
| :---------: | :----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  Structure  |       ✓      | Database structure                                                                                                                                                                                                     |
|   Lineage   |       ✓      | SQL Parsing from scripts, stored procedures and data dictionary metadata to visualise the flow of data between database objects at the column level. Implementation and coverage of SQL parsing is database dependent. |

## **Database Features**

The following table outlines the key database features that the Solidatus connector extracts and represents within the Solidatus model. For comprehensive details on each feature, refer to the linked pages.

|   **Database concept**  | **Solidatus model representation** |                                         **Link to feature page**                                        |
| :---------------------: | :--------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|         Schemas         |               Layers               |  [Schema Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#schema) |
|          Tables         |               Objects              |  [Table Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#tables)  |
|          Views          |               Objects              |   [View Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#views)   |
|         Columns         |             Attributes             | [Column Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#columns) |
|        Data types       |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#columns) |
| Primary key constraints |             Properties             | [Column Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#columns) |
| Foreign key constraints |             Transitions            | [Column Extraction](/connectors/connector-specific-documentation/snowflake/metadata-extraction#columns) |

## **Database Specific Functionality**

The JDBC Connectors application is able to generically support the above concepts as it leverages the JDBC API through database specific drivers. However, there is more specific functionality for each database that needs to be handled more distinctly. The [linked page](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific) highlights additional supported features for each database if present
