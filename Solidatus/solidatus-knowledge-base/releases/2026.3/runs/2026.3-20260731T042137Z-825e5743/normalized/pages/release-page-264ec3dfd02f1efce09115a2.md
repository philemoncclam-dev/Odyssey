# Configuration

## Configuration Options

| Name                                          | Description                                                                                                                          | Example value                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| --spring.profiles.active                      | Required. `connector` for Agent mode, `standalone` for Standalone mode                                                               |                                   |
| --solidatus.agent.name                        | Required (Agent mode). Unique name of connector agent                                                                                | `My PowerBI Connector Agent`      |
| --solidatus.agent.type                        | Optional (Agent mode). Connector type                                                                                                | `PowerBI`                         |
| --solidatus.agent.description                 | Optional (Agent mode). Description of the connector agent                                                                            | `PowerBI Connector Agent`         |
| --solidatus.api.host                          | Required. Solidatus host                                                                                                             | `https://xyz-group.solidatus.com` |
| --solidatus.api.token                         | Required. Solidatus API token                                                                                                        | `123abc45de789f0`                 |
| --solidatus.powerbi.converter.input-file      | Required (Standalone mode). The path of PowerBI report template file (.pbit)                                                         |                                   |
| --solidatus.powerbi.converter.target-model-id | Optional (Standalone mode), if `solidatus.powerbi.converter.model-name` is provided. The ID of the model to update.                  |                                   |
| --solidatus.powerbi.converter.model-name      | Optional (Standalone mode), if `solidatus.powerbi.converter.target-model-id` is provided. The name of the model to create or update. |                                   |

## YAML properties file

Configuration options can be defined either using command-line arguments or through a YAML properties file. Using YAML properties file is recommended as it's easier to manage for complex or multiple job configurations.

YAML properties file path can be specified using the argument `--spring.config.location={YAML_FILE_PATH}`.

```bash
java -jar solidatus-powerbi-java-X.X.XX.jar \
--spring.config.location={YAML_FILE_PATH}
```

See examples in [Example Configuration](/connectors/connector-specific-documentation/power-bi/configuration/example-configuration)
