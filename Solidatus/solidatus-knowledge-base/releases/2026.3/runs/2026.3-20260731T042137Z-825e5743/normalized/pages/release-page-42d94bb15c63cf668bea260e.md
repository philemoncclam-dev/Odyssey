# Configuration

There are a number of configuration options that can be used to filter and narrow the query history ingested in a specific Snowflake instance.

|                              **Parameter**                              |                                                                  **Description**                                                                 |           **Example**          |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------: |
|   `--solidatus.jdbc.snowflakeEnricher.queryHistory.insertQueryHistory`  |                                            Whether to fetch Snowflake query history to create lineage                                            | true or false default is false |
|         `--solidatus.jdbc.snowflakeEnricher.queryHistory.users`         |                             List of users to scan query history from (defaults to all users if no user is specified)                             | JOHN\_SMITH, SERVICE\_ACCOUNT1 |
|        `--solidatus.jdbc.snowflakeEnricher.queryHistory.fromDate`       |           ('yyyy-MM-dd HH:flag\_mm:ss') format to be used for fromDate to be used for dateTime filtering. Must be before toDate value.           |      '2023-01-17 14:35:20'     |
|         `--solidatus.jdbc.snowflakeEnricher.queryHistory.toDate`        |            ('yyyy-MM-dd HH:flag\_mm:ss') format to be used for toDate to be used for dateTime filtering. Must be after fromDate value.           |      '2023-01-17 19:00:05'     |
|        `--solidatus.jdbc.snowflakeEnricher.queryHistory.timespan`       | Number of days in the past to scan query history. Please provide the number of days in the past to scan (up to 60), or -1 to not use this option |               20               |
| `--solidatus.jdbc.snowflakeEnricher.queryHistory.queryHistoryBatchSize` |                        Number of query history entries to process per batch. Default is 50 and must be between 1 and 200.                        |               50               |
