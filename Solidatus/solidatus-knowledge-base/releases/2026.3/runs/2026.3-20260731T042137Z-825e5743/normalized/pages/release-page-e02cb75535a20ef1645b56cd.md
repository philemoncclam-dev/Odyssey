# Cross Database Access History Column Lineage

The Snowflake Multiple Database Connector is used in conjunction with the Snowflake Connector to link up multiple database models and add any cross-database column lineage using Snowflake Access History. Access history based column lineage is only available to Snowflake Enterprise Edition (or higher) accounts.

## Prerequisites

Your user account provided as `--solidatus.snowflake.jdbc.username` must have access to the `SNOWFLAKE.ACCOUNT_USAGE` schema and its containing views. For full access and parsing, the following **select** permission at a minimum is required:

* `SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY`

Snowflake captures column lineage information based on access history, which refers to the historical data access events that occur within the system. Executed queries on a Snowflake instance are logged as an access event, and Snowflake automatically captures the column lineage information associated with that event. The limitations of this approach are that only when database columns have been modified or actual data is moved will it then show up as column lineage in the model. Only Snowflake queries that are **WRITE** operations will be captured in the access history with relevant information for Column Lineage. **READ** queries to a table or view will not be captured in access history based column lineage. It then becomes a great indicator of the usage and actual lineage of a specific Snowflake system.

For more limitations and the specific queries that will show up (in the OBJECTS\_MODIFIED column) please see the official Snowflake documentation: <https://docs.snowflake.com/en/user-guide/access-history#label-access-history-column-lineage>

## Model

<figure><figcaption></figcaption></figure>

The output model generated from the connector will combine the individual Snowflake connector database models into a single model and stitch them together using Snowflake column lineage.

Figure 1 shows 3 Snowflake databases with lineage between them from column lineage (red transitions) whilst still maintaining the internal lineage within the database (blue transitions).

The provided input models are imported into a single composite model with additional lineage mapped between them which allows for easier updating when implemented in a workflow.

### Users

Using the `solidatus.snowflake.accessHistory.users` configuration allows restricting column lineage depending on the actions of chosen users. This can be used to ascertain habits and regular workflows of a group of users. The users configuration option takes a list of Snowflake usernames. This will show the access of queries run against the dataset by that user.

If a list of users is not provided the column lineage of all users is used.

### DateTime span

Using the `solidatus.snowflake.accessHistory.toDate` and `solidatus.snowflake.accessHistory.fromDate` configuration allows filtering down the access history lineage between provided dateTimes. The dateTimes should be provided in ('yyyy-MM-dd HH:m:ss') format. This can be used to track and compare system usage over specific periods of time.

A limitation of using the Snowflake Access History view is that it can only retrieve access within 1 year (365 days). Therefore, the dateTime span provided must also be within 1 year. If no date span is provided the default scope is 30 days before current date.

## Example Model

For the resulting Solidatus model extracted column lineage is represented as transitions between columns where direction shows source to target flow of data.

### Properties

The properties added for column lineage transitions are:

* SOL.SNOWFLAKE.accessHistory: always true to denote transitions inferred from access history<br>

  <figure><figcaption></figcaption></figure>
