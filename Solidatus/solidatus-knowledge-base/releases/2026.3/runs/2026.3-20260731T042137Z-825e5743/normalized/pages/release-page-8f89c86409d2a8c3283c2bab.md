# Configuration

To configure the Solidatus Databricks connector, create an `application.yml` configuration file with the following configuration options, or use [Command Line Arguments](/connectors/connector-specific-documentation/solidatus-databricks/running).

The following example `application.yml` shows all the configuration options and values.

## Configuration Example

`application.yml`:

```yaml
---
logging:
  level:
    root: [ TRACE|DEBUG|INFO|WARN|ERROR ]
    com.solidatus: [ TRACE|DEBUG|INFO|WARN|ERROR ]
    com.solidatus.databricks: [ TRACE|DEBUG|INFO|WARN|ERROR ]
spring:
  profiles:
    active: [ connector|standalone ]
solidatus:
  api:
    host: [ Solidatus Host ]
    token: [ Solidatus Token ]
    verify-ssl: [ true|false ]
    model-name: [ Model Name ]
  agent:
    name: Databricks Connector
    description: A Databricks connector
  databricks:
    databricks-host: [ Databricks Host ]
    databricks-token: [ Databricks PAT ]
    databricks-client-id: [ OAuth Client ID ]
    databricks-client-secret: [ OAuth Client Secret ]
    schemas-to-include:
      - [ schema1 ]
      - [ schema2 ]
    jobs-to-include:
      - [ job1 ]
      - [ job2 ]
    include-jobs-layer: [ true|false ]
    create-data-assets: [ true|false ]
```

## Configuration Options

### Agent or Standalone

* `spring.profiles.active`: `connector` for agent mode or `standalone` for standalone mode

### Logging

* `logging.level.root`: Logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`. Default is `INFO`
* `logging.level.com.solidatus`: Solidatus logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`. Default is `INFO`
* `logging.level.com.solidatus.databricks`: Databricks connector logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`

### Solidatus Options

#### API

* `solidatus.api.host`: Solidatus host
* `solidatus.api.token`: Solidatus API token
* `solidatus.api.verify-ssl`: Whether to verify SSL
* `solidatus.api.model-name`: Name of the model to update

### Agent Mode

* `solidatus.agent.name`: Unique name of connector agent. Default is `Databricks Connector`
* `solidatus.agent.description`: Description of connector agent. Default is `A Databricks connector`

### Databricks Options

* `solidatus.databricks.databricks-host`: Databricks workspace host URL (required)
* `solidatus.databricks.databricks-token`: Databricks personal access token (required if OAuth is not used)
* `solidatus.databricks.databricks-client-id`: Service principal OAuth client ID (required with client secret if PAT is not used)
* `solidatus.databricks.databricks-client-secret`: Service principal OAuth secret (required with client ID if PAT is not used)

Configure **either** a PAT **or** OAuth client credentials, not both. See [oauth.md](https://github.com/solidatus/Solidatus-docs-gitbook/tree/stable/solidatus-core/connectors/solidatus-connectors/solidatus-databricks/oauth.md).

* `solidatus.databricks.schemas-to-include`: List of schemas to extract metadata for (optional)
* `solidatus.databricks.jobs-to-include`: List of Databricks jobs to include (optional)
* `solidatus.databricks.include-jobs-layer`: Whether to include a jobs layer (optional, default is false)
* `solidatus.databricks.create-data-assets`: Whether to create Data Assets in the Solidatus model (optional, default is true)
