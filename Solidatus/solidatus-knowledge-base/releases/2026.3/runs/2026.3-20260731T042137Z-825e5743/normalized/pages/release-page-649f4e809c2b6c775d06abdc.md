# Database specific functionality

For certain databases, there may exist unique functionality that does not get covered out of the box using JDBC drivers.

When a database vendor implements a JDBC driver, they adhere to the interface of methods outlined by JDBC. As such, this connector will be able to extract schema, table and column structure from any connected database that has implemented their JDBC driver to the appropriate standard.

The below listed databases are database vendors for which the connector implements additional functionality (including lineage via SQL parsing) or that we explicitly package drivers for. These features can necessitate connector configuration options that are specific to a database vendor, as well as adding unique properties to table/column entities to provide more detail.

|                                                    **Database**                                                   |
| :---------------------------------------------------------------------------------------------------------------: |
|   [BigQuery](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-1)  |
|    [Impala](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-4)   |
|    [Oracle](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-6)   |
|  [PostgreSQL](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-7) |
|   [Redshift](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-8)  |
|  [SQLServer](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-9)  |
|    [AzureSQL](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview)   |
|  [Teradata](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-12)  |
|     [Hive](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-3)    |
|    [MySQL](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-5)    |
|     [DB2](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-2)     |
| [Sybase ASE](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-10) |
|  [Sybase IQ](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/databasespecific/overview-11) |
