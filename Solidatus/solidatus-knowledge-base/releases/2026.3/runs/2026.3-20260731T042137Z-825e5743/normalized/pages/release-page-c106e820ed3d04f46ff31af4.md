# Overview

## **Supported Features Overview**

*Base features are derived from the Solidatus Snowflake Connector and are represented in the Multiple Database Connector output through imported entities.*

|     **Feature**    | **Included** | **Example**                                                                   |
| :----------------: | :----------: | ----------------------------------------------------------------------------- |
| Metadata Structure |       ✓      | Schemas, Tables, Views, Columns, Data Types, Primary/Foreign Key Constraints  |
|       Lineage      |       ✓      | View column-level, Object dependency table-level, Access History column-level |
|     Governance     |       ✓      | Tags, Row-Access Policies, Dynamic Masking Policies                           |

The table below illustrates how key Snowflake concepts are mapped to the Solidatus model through the connector. For comprehensive details on each feature, refer to the linked pages.

|        **Snowflake concept**        | **Solidatus model representation** |                                                       **Link to feature page**                                                       |
| :---------------------------------: | :--------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
| Access History column-level lineage |             Transitions            | [Column Lineage](/connectors/connector-specific-documentation/snowflake-multi-database/cross-database-access-history-column-lineage) |
|  Cross-database SQL parsing lineage |             Transitions            |        [SQL Parsing Lineage](/connectors/connector-specific-documentation/snowflake-multi-database/cross-database-sql-parsing)       |
