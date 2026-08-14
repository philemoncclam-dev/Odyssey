# Column Lineage

The Snowflake connector can also extract column-level lineage, based on Snowflake Access History, and apply it between columns in the Solidatus model. Column lineage is a visual representation of how data flows throughout a system shown as transitions between source and target columns. By leveraging access history, Snowflake allows users to track and understand the lineage of columns, providing valuable insights into data origins, transformations, and usage patterns. Access history based column lineage is only available to Snowflake Enterprise Edition (or higher) accounts.

## How Column Lineage works in Snowflake

Snowflake captures column lineage information based on access history, which refers to the historical data access events that occur within the system. When a user queries a table or view in Snowflake, the query is logged as an access event, and Snowflake automatically captures the column lineage information associated with that event. The limitations of this are therefore only when database columns have been modified or actual data is moved then it will show up as column lineage in the model. It then becomes a great indicator of the usage and actual lineage of a specific Snowflake system.

For more limitations and the specific queries that will show up please see the official Snowflake documentation: <https://docs.snowflake.com/en/user-guide/access-history#label-access-history-column-lineage>

## Pre-requisites

Your user account provided as `--solidatus.jdbc.username` must have access to the `SNOWFLAKE.ACCOUNT_USAGE` schema and its containing views. For full access and parsing, the following **view** permission at a minimum is required:

* `SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY`

## Configurability

Please see the [Configuration](/connectors/connector-specific-documentation/snowflake/column_lineage/configuration) section for more details on the specific options and expected values.

### Users

Using the `solidatus.jdbc.snowflakeEnricher.accessHistory.users` configuration allows restricting column lineage depending on the actions of chosen users. This can be used to ascertain habits and regular workflows of a group of users. The users configuration option takes a list of Snowflake usernames. This will show the access of queries run against the dataset by that user.

If a list of users is not provided then all users' access history lineage will be fetched.

### DateTime span

Using the `solidatus.jdbc.snowflakeEnricher.accessHistory.fromDate` and `solidatus.jdbc.snowflakeEnricher.accessHistory.toDate` configuration allows filtering down the access history lineage between provided dateTimes. The dateTimes should be provided in ('`yyyy-MM-dd HH:mm:ss`') format. This can be used to track and compare system usage over specific periods of time.

A limitation of using the Snowflake Access History view is that it can only retrieve access within 1 year (365 days). Therefore, the dateTime span provided must also be within 1 year. If no date span is provided the default scope is 30 days before current date.

### Timespan

The `solidatus.jdbc.snowflakeEnricher.accessHistory.timespan` configuration is an alternate option for selecting the period of time for access history. The value of this field represents the number of days before today to retrieve access history for. To use this option, do not fill in the [DateTime span options](#datetime-span) highlighted above.

## Display rules

A new display rule provided in the Snowflake Data Governance module called `Highlight Column Lineage` is included which can be used to filter and highlight transitions in the model which specifically represent access history column lineage.

## Example Model

For the resulting Solidatus model extracted column lineage is represented as transitions between columns where direction shows source to target flow of data.

### Properties

The properties added for column lineage transitions are:

* SOL.SNOWFLAKE.accessHistory: always true to denote transitions inferred from access history
* NUM\_QUERIES: the number of times a specific column lineage source -> target result appears in the access history

Tag entity properties

### Transition

Tag transition properties
