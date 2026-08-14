# JDBC URL Formatting

To connect to the specified database with JDBC connector a JDBC URL has to be provided. A typical JDBC URL looks like `jdbc:<dbVendor>://<instance>/<props>`. Individual JDBC drivers can require different connection strings, and therefore it is always best to check with the specific driver chosen. The following are some example connection strings for different databases, be aware that extra connection parameters can be unique to each driver.

### Oracle

Typical connection string structure:

`jdbc:oracle:thin:[<user>/<password>]@<host>[:<port>]:<SID>`

Please see for more information: <https://docs.oracle.com/database/121/JJDBC/urls.htm#JJDBC08200>

### Postgres

Typical connection string structure:

`jdbc:postgresql://<host>:<port>/<database>?<properties>`

Please see for more information: <https://jdbc.postgresql.org/documentation/use/>

### Snowflake

Typical connection string structure:

`jdbc:snowflake://<account_identifier>.snowflakecomputing.com/?<connection_parameters>`

Please see for more information: <https://docs.snowflake.com/developer-guide/jdbc/jdbc-configure> & <https://docs.snowflake.com/en/developer-guide/jdbc/jdbc-parameters>

### Configurable Connection Parameters (Optional)

You have the option to include additional connection parameters by separating them with `&` and adding them at the end of the URL.

i.e. `jdbc:snowflake://<account_identifier>.snowflakecomputing.com/?<param_key1>=<param_value1>&param_key2>=<param_value2>`

If you omit the `warehouse=X` parameter, then Snowflake will automatically use the user's default warehouse.

Similarly, if the `role=X` parameter is not provided, then Snowflake will utilize the user's default role.

Please verify that the user, as well as the warehouse and role chosen, possess the necessary permissions to access the database information.

### SQLServer

Typical connection string structure:

`jdbc:sqlserver://[serverName[:portNumber]][;property=value[;property=value]]`

Note: If a SQL Server instance name needs to be specified, please use `;instanceName=INSTANCE_NAME` instead of`\INSTANCE_NAME`. The `\` character is not permitted by JDBC URI syntax.

Please see for more\
information: <https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver16>

### BigQuery

Typical connection string structure:

`jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;ProjectId={PROJECT_ID}`

Example using service account authentication:

`jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;ProjectId={PROJECT_ID};OAuthType=0;OAuthServiceAcctEmail={SERVICE_ACCOUNT_EMAIL};OAuthPvtKeyPath={KEY_PATH}`

Please see for more information: <https://cloud.google.com/bigquery/docs/reference/odbc-jdbc-drivers>

### Redshift

Typical connection string structure:

`jdbc:redshift://<account_identifier>.redshift-serverless.amazonaws.com:<port>/<database>`

Please see for more information: <https://docs.aws.amazon.com/redshift/latest/mgmt/jdbc20-build-connection-url.html>

### Teradata

Typical connection string structure:

`jdbc:teradata://DatabaseServerName/ParameterName=Value,ParameterName=Value`

Please see for more\
information: <https://teradata-docs.s3.amazonaws.com/doc/connectivity/jdbc/reference/current/jdbcug_chapter_2.html>
