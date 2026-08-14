# Query History

## How Query History parsing works with the Snowflake connector

When query history parsing is enabled, the connector fetches SQL statements from Snowflake's query history for SQL parsing. The queries retrieved can be filtered by the configured users and time range.

The retrieved statements are processed in batches against the already extracted database metadata. Each batch is parsed using SQL parsing, and the resulting lineage relationships are added to the Solidatus model.

## Pre-requisites

Your user account provided as `--solidatus.jdbc.username` must have access to the `SNOWFLAKE.ACCOUNT_USAGE` schema and its containing views. The following **view** permission at a minimum is required:

* `SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY`

## Configurability

Please see the [Configuration](/connectors/connector-specific-documentation/snowflake/query_history/configuration) section for more details on the specific options and expected values.

### Users

An optional list of Snowflake usernames to filter query history by. If not provided, query history for all users is retrieved.

### DateTime span

An explicit date range can be provided using `jdbcConfig.snowflakeEnricher.queryHistory.fromDate` and `jdbcConfig.snowflakeEnricher.queryHistory.toDate` (format: `yyyy-MM-dd HH:mm:ss`). The following constraints apply:

* Both `fromDate` and `toDate` must be provided together.
* The range cannot exceed 60 days.
* `toDate` cannot be in the future and cannot be earlier than `fromDate`.
* Neither date can be more than 1 year in the past.

Either a date range or a [timespan](#timespan) must be configured — not both.

### Timespan

`jdbcConfig.snowflakeEnricher.queryHistory.timespan` accepts a number of days in the past to scan (e.g. `7` for the last 7 days, up to a maximum of 60). Set to `-1` (the default) to disable this option and use a [date range](#datetime-span) instead. A value of `0` or any other negative number is not permitted.

## Example Model

Below is an example for how a `Source` schema and `Target` schema in Snowflake may be associated via dataflow instigated by SQL retrieved by parsing the Snowflake query history logs. The name of an object is the query's hash.

Query History Example Model
