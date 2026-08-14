# Configuration

There are a number of configuration options that can be used to filter and narrow the ingested column lineage in a specific Snowflake instance.

|                                **Parameter**                               |                                                                   **Description**                                                                  |           **Example**          |
| :------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------: |
|      `--solidatus.jdbc.snowflake-enricher.insert-object-dependencies`      |                                            Whether to add transitions representing object-level lineage                                            | true or false default is false |
| `--solidatus.jdbc.snowflake-enricher.access-history.insert-column-lineage` |                                                 Whether to add access history based column lineage                                                 | true or false default is false |
|          `--solidatus.jdbc.snowflakeEnricher.accessHistory.users`          |                              List of users to scan access history from (defaults to all users if no user is specified)                             | JOHN\_SMITH, SERVICE\_ACCOUNT1 |
|         `--solidatus.jdbc.snowflakeEnricher.accessHistory.fromDate`        |            ('yyyy-MM-dd HH:flag\_mm:ss') format to be used for fromDate to be used for dateTime filtering. Must be before toDate value.            |      '2023-01-17 14:35:20'     |
|          `--solidatus.jdbc.snowflakeEnricher.accessHistory.toDate`         |             ('yyyy-MM-dd HH:flag\_mm:ss') format to be used for toDate to be used for dateTime filtering. Must be after fromDate value.            |      '2023-01-17 19:00:05'     |
|         `--solidatus.jdbc.snowflakeEnricher.accessHistory.timespan`        | Number of days in the past to scan column lineage. Please provide the number of days in the past to scan (up to 365), or -1 to not use this option |               20               |
