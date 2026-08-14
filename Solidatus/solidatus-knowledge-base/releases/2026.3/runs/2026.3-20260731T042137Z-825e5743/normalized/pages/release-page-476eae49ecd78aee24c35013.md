# Troubleshooting

Below are answers to common questions about the JDBC Connector.

### SQL Parsing isn't working! What do I do?

Consider the following steps:

1. Have you ensured the correct config options are enabled?
   * This includes having `solidatus.jdbc.dialect`, `solidatus.jdbc.sql-parsing` and `solidatus.jdbc.default-schema` set in the configuration.
2. If using files, have you ensured that `solidatus.jdbc.sql-directory` is set too?
3. Have you checked your database user can access the database DDL?
4. Have you provided the correct `catalog` or `schema` to the Connector?
5. If your SQL is particularly large, have you considered using our built-in filters to reduce the dataset?

### The Connector is running too slowly / taking a long time!

1. Have you checked that you've provided `solidatus.jdbc.schema-pattern`? Without this, the Connector will pull all schemas available to the user which can be very large.
2. Providing `solidatus.jdbc.table-pattern` can also reduce model size.
3. Have you used the configuration filters such as `solidatus.jdbc.exclusion-filter` to reduce the data size more?

### The Connector runs into Out of Memory / Heap error!

1. Try the above answers, regarding running too slowly / taking a long time.
2. Try increasing the Java heap maximum.

### What do I do if I'm getting a 401/403 API Exception?

1. Check that your Solidatus API token is correct.
2. Check that your Solidatus API token has enough permissions to create and edit models.
3. If the model already exists and the Connector is updating it, please ensure that the token has permissions on the existing model. This can be done by sharing the existing model to the user whose token is provided.
4. Ensure the Solidatus host is correct.

### When scanning BigQuery, all my projects are scanned instead of one

1. Please ensure that `solidatus.jdbc.catalog` is set to the desired project, as the Connector will use all projects accessible by the account otherwise.

### When using BigQuery, I can't get SQL Parsing working

1. Currently, SQL parsing only works for BigQuery when using a file directory, please ensure you are providing `solidatus.jdbc.sql-directory` to the Connector.

### When scanning Teradata, I'm getting a connection timeout

* Please try to add `LOB_SUPPORT=OFF` to the connection string
* Please see the following section in the documentation: [https://teradata-docs.s3.amazonaws.com/doc/connectivity/jdbc/reference/current/jdbcug\_chapter\_2.html#URL\_LOB\_SUPPORT](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/troubleshooting)

### When scanning SQL Server, I'm getting SSL error

```
com.microsoft.sqlserver.jdbc.SQLServerException: The driver could not establish a secure connection to SQL Server by using Secure Sockets Layer (SSL) encryption.
Error: "PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target".
```

If the connection string contains `encrypt` property and the value is `true`, you may add or set `trustServerCertificate` to `true` in the connection string so that SSL certificate validation will be skipped by the driver.

When `trustServerCertificate` is set to `false`, you should check that SSL certificate for SQL Server you're scanning is imported to Java truststore.

See <https://learn.microsoft.com/en-us/sql/connect/jdbc/connecting-with-ssl-encryption> more details on connection with SSL/TLS encryption

### When scanning Azure SQL, I'm getting database unavailable error

Azure SQL database is likely in auto-pausing state. You can retry the connector job once the database is resumed. See <https://learn.microsoft.com/en-us/azure/azure-sql/database/serverless-tier-overview?view=azuresql\\&tabs=general-purpose#auto-pausing-and-auto-resuming> for more details.

Set `connectRetryCount`, `connectRetryInterval`, `loginTimeout` properties in the connection string to increase automatic retry by the driver. The value for `loginTimeout` **should not be less** than (`connectRetryCount` x `connectRetryInterval`). See <https://learn.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties>

### Nothing is happening/ I can't register the Connector

* Please ensure that the spring profile has been set.
* For standalone mode:
  * `--spring.profiles.active="standalone"`
* For agent mode:
  * `--spring.profiles.active="connector"`

### I'm using a configuration file and there is no output

* When using a configuration file please ensure the path is passed into the Connector execution.
* The parameter `--spring.config.location={YAML_FILE}` must be provided with a valid path to the configuration file.
* Please ensure the spring profile is set in either the command line or in the configuration file.

### Why is my model empty?

* If the model is empty please check the database credentials provided are valid:
  * `solidatus.jdbc.username`
  * `solidatus.jdbc.password`
* Please check the logs to see if a connection is made to the database.
  * You may see logs similar to: `JDBC Username is not set [solidatus.jdbc.username]. Execution may fail due to failed authentication`
* If username and password are valid, then check that the user has the correct permissions to **VIEW** the database schemas provided

### The Connector crashes with a NullPointerException

* The Connector errors with a `NullPointerException` please ensure configuration options are provided correctly for all required fields.
* Please see the `fullSample.yml` for an example of required options.

### The Connector job is stuck in a SUBMITTED state

* If the Connector job is stuck in a submitted state please check that the agent is correctly running.
* In some cases an agent that is down can still look active.
* Stopping the agent while it is running will terminate the submitted jobs, moving them in to the `Aborted` state.
* Once the agent has been restarted the submitted job will re-run correctly.

### The Connector job is stuck RUNNING

* If the Connector job is stuck running for a long amount of time, please either attempt to cancel the job, or restart the agent.
* On agent restart the job will error and be able to run again.
* If the job is still stuck in running please use the API endpoint through `{SOLIDATUS_HOST}/api-docs` and find `/api/v1/connectors/jobs/execution/{executionId}/error`.
  * Then add the running execution (this can be found from the clicking on the execution and copying the id from the URL) into the endpoint description box
  * And execute the endpoint
  * This will force error the running job.

### There is a NULL.FILES layer in the model

* If parsing SQL files through the `sql-directory` option and there exists a NULL.FILES layer with left over scripts please set the `solidatus.jdbc.default-schema` property.
* This ensures any scripts that cannot correctly be allocated to a schema are stores in the correct layer in the model.

### I want to connect my database model to another model

If you have different models from different connectors you can use Solidatus AutoMapping to automatically link objects together.

1. First create a composite model with both models imported into it.
2. Click `Auto map`
3. Select the source and targets layer you wish to connect
4. Remove the default attributes features already selected
5. Select the `SOL.UID` option in the advanced settings
6. And click generate mappings.

This will automatically find and match SOL.UID properties on the chosen entities and create direct transitions between them.

### There are missing transitions between my PROCEDURES/FILES layer and my tables

If there is missing lineage between the SQL procedures/files that are parsed there are a number of ways to investigate why.

1. Check the source/target columns on the model for a `SOL.error` property. This will contain a description of why a transitions hasn't been made. Depending on the error message provided you may have to check that the entity to map is in the model. If not it may need to be added to the SCHEMA or TABLE pattern.
2. Check the debug logging. There will be a log statement of when lineage mappings are attempted to be created.

The most common reason for missing lineage is schemas or tables not included in the configuration options.

### The Agent fails to register

If receiving an error where the agent is unable to be registered, please ensure that an agent with the same name does not exist. Connector agents must require globally unique names, and there could already exist an active agent. There may also be another user who has already registered an agent with that name.

If attempting to re-register an agent, please ensure the existing agent has been shared with the user whose API token is used in the configuration.

## Debug logging

Some problems can be solved from inspecting the detailed logs. The logging framework can be provided with the following log levels:

* INFO: The most basic logging
* DEBUG: More detailed developer logging
* ERROR: Specific error messages
* TRACE: The most detailed logging encompassing all the levels above

For more verbose logging enable `debug` logging for `root` logger, this produces a lot of logging!

Logging is passed in through configuration properties, either through command line or a configuration file.

Command line:

```bash
--logging.level.root="debug"
```

Configuration file:

```yaml
logging:
    level:
        root: INFO
        com.solidatus.app: DEBUG
```

Please see `fullSample.yml` or `template.yml` as an example.

### Recommended Agent mode log settings:

When running the Connector in Agent mode, the logs are only available on the Java process. This means users using the Connector via Solidatus will not be able to see the full output of the Connector logs. It is recommended to increase logging used so that if issues arise, they can be easier to debug.

```bash
--logging.level.com.solidatus.app="debug"
--logging.level.com.zaxxer.hikari="debug"
```

### Recommended debug log settings

```bash
--logging.level.com.solidatus.app="info"
--logging.level.com.zaxxer.hikari="debug"
```

optionally you can add:

```bash
--logging.level.org.glassfish.jersey="debug"
```

Logging format can also be changed with:

```bash
--logging.pattern.dateformat='yyyy-MM-dd HH:mm.ss,SSS.Z, UTC'
```

as an example for printing UTC timezone on log messages.

### Debug logging for SQL Server/AzureSQL JDBC Driver

SQL Server/AzureSQL JDBC driver is using `java.util.logging` hence there is additional setup to enable debug logging for the driver.

> This should only be enabled for debugging complex connectivity issue as it incurs performance overhead

1. Create a `logging.properties` file with `handlers` property below

```properties
handlers=org.slf4j.bridge.SLF4JBridgeHandler
```

2. Add JVM option `-Djava.util.logging.config.file=/path/logging.properties` to command line
3. Add logging setting for JDBC driver to command line

```bash
--logging.level.com.microsoft.sqlserver.jdbc="debug"
```

4. Restart connector agent or re-run command line with the change above

## Network Proxy

Being behind a proxy can sometimes cause problems for the Solidatus API client when connecting to a Solidatus instance via `http` or `https`. This is common when there are network policies between the host computer and the Solidatus instance.

An indication of a proxy problem might look like this error message from the utility:

```$java
Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2020-02-24 16:30:09.945 ERROR 8821 --- [           main] o.s.boot.SpringApplication               : Application run failed java.lang.IllegalStateException: Failed to execute CommandLineRunner
at org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:782) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
at org.springframework.boot.SpringApplication.callRunners(SpringApplication.java:763) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:318) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1213) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1202) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
at com.solidatus.utils.Main.main(Main.java:45) [classes!/:1.2.1]
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.8.0_171]
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[na:1.8.0_171]
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:1.8.0_171]
at java.lang.reflect.Method.invoke(Method.java:498) ~[na:1.8.0_171]
at org.springframework.boot.loader.MainMethodRunner.run(MainMethodRunner.java:47) [solidatus-jdbc-connectors-1.2.1.jar:1.2.1]
at org.springframework.boot.loader.Launcher.launch(Launcher.java:86) [solidatus-jdbc-connectors-1.2.1.jar:1.2.1]
at org.springframework.boot.loader.Launcher.launch(Launcher.java:50) [solidatus-jdbc-connectors-1.2.1.jar:1.2.1]
at org.springframework.boot.loader.JarLauncher.main(JarLauncher.java:51) [solidatus-jdbc-connectors-1.2.1.jar:1.2.1]
Caused by: com.solidatus.client.ApiException: error
at com.solidatus.client.ApiClient.invokeAPI(ApiClient.java:738) ~[solidatus-client-java-1.0.3.jar!/:na]
at com.solidatus.client.api.ModelsApi.queryModelsForUser(ModelsApi.java:540) ~[solidatus-client-java-1.0.3.jar!/:na]
at com.solidatus.utils.SolidatusModelService.findModelByName(SolidatusModelService.java:83) ~[classes!/:1.2.1]
at com.solidatus.utils.SolidatusModelService.saveModel(SolidatusModelService.java:204) ~[classes!/:1.2.1]
at com.solidatus.utils.Main.run(Main.java:75) [classes!/:1.2.1]
at org.springframework.boot.SpringApplication.callRunner(SpringApplication.java:779) [spring-boot-2.1.6.RELEASE.jar!/:2.1.6.RELEASE]
... 13 common frames omitted

2020-02-24 16:30:09.956  INFO 8821 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2020-02-24 16:30:09.991  INFO 8821 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.
```

This means the Connector (JVM) could not contact the Solidatus host instance.

### Validating the proxy

To ensure the proxy is valid please try the following command:

```bash
curl --proxy "https://[PROXY_HOST]:[PROXY_PORT]" "[SOLIDATUS_HOST]/health"
```

You should expect to retrieve the following as a response:

```bash
{
  "status": "Healthy",
  "description": null
}
```

### Providing the Connector with the proxy

To fix the problem we need to tell the JVM about the proxy. To do so, add the following to the command line:

```$java
-Dhttp.proxyHost=PROXY_HOST -Dhttp.proxyPort=PORT
-Dhttps.proxyHost=PROXY_HOST -Dhttps.proxyPort=PORT
```

depending on which protocol the proxy uses. **PROXY\_HOST should not contain the https\:// or http\:// prefix**.

Therefore, the command line execution becomes:

```bash
java -Dhttp.proxyHost=PROXY_HOST -Dhttp.proxyPort=PORT -Dhttps.proxyHost=PROXY_HOST -Dhttps.proxyPort=PORT -jar ./solidatus-jdbc-connectors-1.0.jar \
--spring.profiles.active="standalone" \
--solidatus.jdbc.driver=sqlserver \
--solidatus.jdbc.url=JDBC_CONNECTION_URL \
--solidatus.jdbc.username=JDBC_CONNECTION_USERNAME \
--solidatus.jdbc.password=JDBC_CONNECTION_PASSWORD \
--solidatus.jdbc.schema-pattern=COMMA_SEPARATED_SCHEMA_NAMES \
--solidatus.api.host=$SOLIDATUS_HOST\
--solidatus.api.token=$SOLIDATUS_TOKEN \
--solidatus.api.model-name="Solidatus Model Name"
```

### Connector errors on start up with an Application Context exception or Not seeing any logging

If you are seeing the following error:

```
Caused by: java.lang.IllegalArgumentException: LoggerFactory is not a Logback LoggerContext but Logback is on the classpath. Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:solidatus-jdbc-connectors/lib/{X}.jar). If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

This is caused by conflicting versions of SLF4J on the Java classpath. To fix this error please remove the older version of SLF4J from the class path. This may arise due to loading a `custom` JDBC driver with it's own version of SLF4J.
