# Usage

### Model Output Example

Below is a simplified model output to visualise an Azure Data Factory instance.

The model should be read from left to right, whereby the layers house increasingly granular concepts. Linked Services and the Datasets that belong to them are on the left, while the Pipelines and DataFlows that transform them are on the right.

DataFlows and Pipelines will have more information within its attributes, which will detail different Pipeline Activities and Dataflow transformations. There are also transitions to represent transformations, and transitions to represent parentage. There is a property `relation-type` to help differentiate these transitions.

Only Linked Services that have additional support from Data Factory i.e. for use in DataFlows will have additional properties. For example, an Oracle database is not additionally supported by Data Factory, and therefore schema information will not be available for it.

Currently, the supported activity pipelines are as follows:

* Copy Activity
* Execute Dataflow Activity Please note that any feature of Azure Data Factory not explicitly mentioned may not be supported by the Azure Data Factory connector.

### Usage

There are two ways to run the Azure Data Factory Connector, agent mode and standalone mode. Standalone mode runs a singular instance of the Connector with supplied config and publishes the model. Agent mode sets up a Solidatus Agent to connect to the hosted Solidatus site that can receive and run Azure Data Factory Connector jobs with unique configurations.

Configuration can be set in either a `{}.yml` file as presented in `template.yml`. Alternatively the configuration can be passed in as command line parameters to the Azure Data Factory Connector JAR file. If using both methods the command line arguments will overwrite the configuration `.yml` file.

An Azure Subscription ID is required for this connector to run, and it is implied that the same subscription will be used for a particular connector instance.

#### Agent Mode

**Description**

Running the Azure Data Factory Connector in Agent mode will set up the Connector to wait and receive Jobs sent to it. To submit a Job go to the Connectors Dashboard, create a job with a specified configuration and submit. Once the Job is completed the final model will appear in the Model List. For a full demonstration of Connector agent mode see your hosted Solidatus site documentation page `/help/connectors`.

All jobs while run in agent mode will run with the same subscription ID, while the client ID, tenant ID and client secret can be changed through the Solidatus UI.

**Example**

To run the Connector agent a script similar the following would be run. This agent will continue running while jobs are sent to it.

```bash
export AZURE_SUBSCRIPTION_ID={AZURE_SUBSCRIPTION_ID}

java -jar solidatus-azure-data-factory-0.0.1.jar \
--spring.profiles.active="agent" \
--solidatus.api.host={SOLIDATUS_HOST} \
--solidatus.api.token={SOLIDATUS_TOKEN} \
--solidatus.agent.name="Azure-DF-Agent" \
--solidatus.agent.description="An Azure Data Factory sample Connector"
```

#### Standalone Mode

**Description**

Running the Azure Data Factory Connector in Standalone mode will run one execution of the Connector with the specified configuration options and then stop. The output model will be named and published to the host Solidatus site according to the options provided as command line parameters. Any command line arguments not passed will be set to default arguments (Null or empty).

**Example**

Command line execution example:

```bash
export AZURE_SUBSCRIPTION_ID={AZURE_SUBSCRIPTION_ID}

java -jar solidatus-azure-data-factory-0.0.1.jar \
--solidatus.api.host={$SOLIDATUS_HOST} \
--solidatus.api.token={$SOLIDATUS_TOKEN} \
--solidatus.api.model-name="Azure Data Factory Model" \
--solidatus.azure.client-id={CLIENT_ID} \
--solidatus.azure.client-secret={CLIENT_SECRET} \
--solidatus.azure.tenant-id={TENANT_ID} \
--solidatus.azure.resource-group={RESOURCE_GROUP} \
--solidatus.azure.factory-name={FACTORY_NAME}
```

### Command line options

| name                                | description                                                                                                                | example                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `--solidatus.azure.client-id`       | Azure Client ID for authentication with Data Factory                                                                       |                                                               |
| `--solidatus.azure.client-secret`   | Azure Client Secret for authentication with Data Factory                                                                   |                                                               |
| `--solidatus.azure.tenant-id`       | Azure Tenant ID for authentication with Data Factory                                                                       |                                                               |
| `--solidatus.azure.resource-group`  | Azure Resource group for identifying which Data Factory instance to extract from                                           |                                                               |
| `--solidatus.azure.factory-name`    | The name of the Data Factory instance to extract from                                                                      |                                                               |
| `--solidatus.azure.linked-services` | List of linked services to extract to the model, leave blank to extract all services                                       | service1, service2, service3                                  |
| `--solidatus.azure.datasets`        | List of datasets to extract to the model, leave blank to extract all datasets                                              | dataset1, dataset2, dataset3                                  |
| `--solidatus.azure.pipelines`       | List of pipelines to extract to the model, leave blank to extract all pipelines                                            | pipeline1, pipeline2, pipeline3                               |
| `--solidatus.azure.data-flows`      | List of dataflows to extract to the model, leave blank to extract all dataflows                                            | dataFlow1, dataFlow2, dataFlow3                               |
| `--solidatus.api.host`              | Solidatus host address                                                                                                     | `https://demo.solidatus.com`                                  |
| `--solidatus.api.token`             | Solidatus user token with create model role                                                                                |                                                               |
| `--solidatus.api.model-name`        | the name of the model to create or replace                                                                                 |                                                               |
| `--solidatus.api.rules-template`    | the name of a model to copy display rules from                                                                             | no default value                                              |
| `--solidatus.api.fork-mode`         | create a fork of `model-name` rather than update the model                                                                 | `true` or `false` default is `false`                          |
| `--solidatus.api.fork-name`         | the name of the fork to create                                                                                             | default value is `Fork of`+ value of `model-name`             |
| `--solidatus.api.verify-ssl`        | perform SSL validation                                                                                                     | `true` or `false` default is `true`                           |
| `--solidatus.api.update-as-draft`   | create a draft update of `model-name` rather than update the model directly                                                | `true` or `false` default is `false`                          |
| `--logging.pattern.dateformat`      | Optional, adjust the way the Connector logs to the console. By default, the logger will log on local time for the machine. | `'yyyy-MM-dd HH:mm.ss,SSS.Z, UTC'` to print logs in UTC time. |
