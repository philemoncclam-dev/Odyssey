# Snowflake

The Solidatus Snowflake Connector is a Java based tool to connect to a database and extract the metadata structure and visualise data lineage.

The connector will enrich the model structure with additional metadata for Data Governance from Snowflake such as Tags, Policies and Access History lineage.

## **Supported Features Overview**

| **Feature** | **Included** | **Coverage**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :---------: | :----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  Structure  |       ✓      | Database structure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|   Lineage   |       ✓      | <p>Three types of lineage are covered: SQL parsing, object dependency, access history and query history.<br>SQL Parsing from scripts, stored procedures and data dictionary metadata visualises the flow of data between database objects at the column level.<br>Access History derives lineage between tables at the column level. These relationships are drawn from Snowflake's Access History tables.<br>Object dependency implies lineage between tables at the table level.<br>Query history derives lineage from the parsing of queries that are retrieved from the query history system tables.</p> |
|  Governance |       ✓      | Tags, Row-Access Policies, Dynamic Masking Policies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

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

## **Snowflake Features**

The table below illustrates how key Snowflake concepts are mapped to the Solidatus model through the connector. For comprehensive details on each feature, refer to the linked pages.

|         **Snowflake concept**         |    **Solidatus model representation**   |                                                **Link to feature page**                                               |
| :-----------------------------------: | :-------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|  Access History column-level lineage  |               Transitions               |                [Column Lineage](/connectors/connector-specific-documentation/snowflake/column_lineage)                |
|         Query History lineage         |               Transitions               |                 [Query History](/connectors/connector-specific-documentation/snowflake/query_history)                 |
| Object Dependency table-level lineage |               Transitions               | [Object Dependencies](/connectors/connector-specific-documentation/snowflake/snowflakeenrichment/object-dependencies) |
|                  Tags                 |          Reference model terms          |            [Tags](/connectors/connector-specific-documentation/snowflake/snowflakedatagovernanceusage/tags)           |
|          Row Access Policies          |          Reference model terms          |        [Policies](/connectors/connector-specific-documentation/snowflake/snowflakedatagovernanceusage/policies)       |
|        Dynamic Masking Policies       |          Reference model terms          |        [Policies](/connectors/connector-specific-documentation/snowflake/snowflakedatagovernanceusage/policies)       |
|  Lineage between Snowflake databases  | Transitions between imported attributes |                [Column Lineage](/connectors/connector-specific-documentation/snowflake/column_lineage)                |
