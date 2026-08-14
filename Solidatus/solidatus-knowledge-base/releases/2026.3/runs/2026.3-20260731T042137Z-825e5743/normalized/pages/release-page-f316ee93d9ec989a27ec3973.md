# Running the connector

The connector can be run in `agent` or `standalone` mode.

In `standalone` mode the connector will execute the processing and then shutdown.

In `agent` mode the connector runs as a long-lived process, it connects to a Solidatus instance and awaits job events. When a job event is received it will execute the job and await the next job event.

In the examples below we have used the environment variable `${SOLIDATUS_HOST}` and `${SOLIDATUS_TOKEN}` to represent a Soldiatus host instance URL and Solidatus token.

## Standalone mode

To execute in `standalone` mode run the following command line supplying the job details as command line properties

```shell
java -jar solidatus-databricks-1.0-SNAPSHOT.jar --spring.profiles.active=standalone \
--solidatus.api.host=${SOLIDATUS_HOST} \
--solidatus.api.token=${SOLIDATUS_TOKEN} \
--solidatus.api.verify-ssl=true \
--solidatus.connector.model-name="Solidatus Databricks model" \
```

Or using a Spring Boot `yaml` configuration file

```shell
java -jar solidatus-databricks-1.0-SNAPSHOT.jar --spring.profiles.active=standalone
```

#### application.yml

```yaml
spring:
  config:
    activate:
      on-profile: standalone
solidatus:
  api:
    host: ${SOLIDATUS_HOST}
    token: ${SOLIDATUS_TOKEN}
    verify-ssl: true
    model-name: "Databricks"
  databricks:
    databricks-host: ${DATABRICKS_HOST}
    databricks-token: ${DATABRICKS_TOKEN}
```

> **Note:** Databricks connectivity requires `solidatus.databricks.databricks-host` and **either** `solidatus.databricks.databricks-token` (PAT) **or** OAuth credentials (`solidatus.databricks.databricks-client-id` and `solidatus.databricks.databricks-client-secret`). See [oauth.md](https://github.com/solidatus/Solidatus-docs-gitbook/tree/stable/solidatus-core/connectors/solidatus-connectors/solidatus-databricks/oauth.md).

## Agent mode

To execute in `agent` mode run the following command line. We do not supply job details via the command line in agent mode, but we can supply some agent properties.

In `agent` mode the `solidatus.api.host` and `solidatus.api.token` properties supplied on the command line or via a Spring configuration file are used by the `agent` to connect to a Solidatus host instance. They are not used by a job.

```shell
java -jar solidatus-databricks-1.0-SNAPSHOT.jar --spring.profiles.active=connector \
--solidatus.agent.name="java-sdk-example" \
--solidatus.agent.description="Example Solidatus Databricks Connector" \
--solidatus.agent.type="Databricks" \
--solidatus.api.host=${SOLIDATUS_HOST} \
--solidatus.api.token=${SOLIDATUS_TOKEN} \
--solidatus.api.verify-ssl=true
```

Or using a Spring Boot `yaml` configuration file

```shell
java -jar solidatus-databricks-1.0-SNAPSHOT.jar --spring.profiles.active=connector
```

#### application.yml

```yaml
spring:
  config:
    activate:
      on-profile: connector
solidatus:
  agent:
    name: java-sdk-example
    description: "Example Solidatus Databricks Connector"
  api:
    host: ${SOLIDATUS_HOST}
    token: ${SOLIDATUS_TOKEN}
    verify-ssl: true
```

> **Note:** Databricks connectivity requires `solidatus.databricks.databricks-host` and **either** `solidatus.databricks.databricks-token` (PAT) **or** OAuth credentials (`solidatus.databricks.databricks-client-id` and `solidatus.databricks.databricks-client-secret`). See [oauth.md](https://github.com/solidatus/Solidatus-docs-gitbook/tree/stable/solidatus-core/connectors/solidatus-connectors/solidatus-databricks/oauth.md).
