# Configuration

Configuring the Connector as an Agent

### What is a Connector Agent?

A connector agent is a way to run the connector via Solidatus that listens for jobs that are configured and sent from the UI of the Solidatus instance. This capability allows users to manage several connections from a variety of different sources effectively. For more information on the connectors dashboard, refer to the Solidatus connectors framework documentation at `/help/connectors/framework.html`.

The configuration file for the Connector is a JSON file containing various fields which configure different aspects of the behaviour of the Connector.

The fields are as follows:\\

| Config field           | Required | Type    | Notes                                                                                                                             |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| connectorMode          | Yes      | "agent" |                                                                                                                                   |
| solConnection          | Yes      | object  | Defines the connection details for Solidatus.                                                                                     |
| solConnection.host     | Yes      | string  | URL of Solidatus instance.                                                                                                        |
| solConnection.apiToken | Yes      | string  | API Token for authenticating with Solidatus.                                                                                      |
| solConnection.proxyUrl | No       | string  | If given, URL of proxy to use when connecting to Solidatus.                                                                       |
| noSSLVerify            | No       | boolean | If true, SSL verification will be skipped. May be needed if connecting to an instance of Solidatus using self-signed HTTPS certs. |
| agentName              | No       | string  | The name of the agent registered in Solidatus.                                                                                    |
| agentDescription       | No       | string  | The description of the agent registered in Solidatus.                                                                             |
| loggerConfig           | No       | object  | Defines configuration for connector logger.                                                                                       |

### Agent mode config example

```json
{
  "connectorMode": "agent",
  "solConnection": {
    "host": "https://solidatus-host.example.com",
    "apiToken": "solidatus api token"
  },
  "agentName": "Tableau",
  "agentDescription": "Connects to Tableau"
}
```

### Running a connector via the UI and the job configuration screen

Documentation on using a connector agent via the UI is available through Solidatus help. The below is a screenshot of available job configuration options. Please refer to the Config file section of this documentation for specifics on each field.

## Configuring the Connector in standalone mode

The configuration file for the Connector is a JSON file containing various fields which configure different aspects of the behaviour of the Connector.

The table below indicates the purpose of each field. An example config file can be found in this directory (`config.json`).

<table><thead><tr><th>Config field</th><th>Required</th><th>Notes</th></tr></thead><tbody><tr><td>solConnection</td><td>Yes</td><td><p>Contains sub-options <code>host</code>, <code>apiToken</code>, <code>modelId</code> (optional, will overwrite supplied model, and create a new model if not set), <code>proxyURL</code> (optional, required if Solidatus request is being proxied), <code>dontUseUIDComparator</code> (optional, when true, allows job to use default model update comparator. This is a debug option to bypass potential duplicate UID errors. This will however prevent keeping track of diff changes between revisions.):</p><pre><code>{ "host": "http://my-solidatus.com", "apiToken": "api token for my-solidatus.com", "modelId": "my model id", "proxyURL": "http://example.com"}
</code></pre></td></tr><tr><td>modelId</td><td>No</td><td>The ID of the solidatus model to update with. Id empty, a new model will be created</td></tr><tr><td>modelName</td><td>No</td><td>The name of solidatus model to create with. If empty, model will created with default name "Tableau model"</td></tr><tr><td>inputFilePath</td><td>Yes</td><td>Optional path of a single queries file in <code>solq</code> file format.</td></tr><tr><td>queriesFilePath</td><td>No</td><td>Optional path of a single queries file in <code>solq</code> file format.</td></tr><tr><td>outDir</td><td>No</td><td>Output directory. Used to specify the output directory of the generated <code>.json</code> files.</td></tr><tr><td>noSSLVerify</td><td>No</td><td>If true, SSL verification will be skipped. May be needed if connecting to an instance of Solidatus using self-signed HTTPS certs.</td></tr><tr><td>loggerConfig</td><td>No</td><td>Defines configuration for connector logger.</td></tr></tbody></table>

### Standalone mode config example

```json
{
  "connectorMode": "standalone",
  "solConnection": {
    "host": "https://solidatus-host.example.com",
    "apiToken": "solidatus api token"
  },
  "inputFilePath": "./tableauWorkbooks/Superstore.twb",
  "modelName": "Tableau model"
}
```

## Configuring the Connector in standalone mode to connect to your Tableau instance directly

The Connector will also allow you to connect a Tableau instance directly to extract workbook information into a Solidatus model. For direct Tableau instance connectivity, the following config options will also need to be provided.

| Config field           | Required | Notes                                                                                                                                                                                                                      |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tableau.source         | Yes      | Value should be `Tableau Instance` if trying to connect to Tableau instance directly                                                                                                                                       |
| tableau.tokenName      | Yes      | Token name of a user-configured access token used to access the workbook.                                                                                                                                                  |
| tableau.tokenSecret    | Yes      | Token secret generated by Tableau used to access the workbook.                                                                                                                                                             |
| tableau.siteContentUrl | Yes      | The site content URL of the site to access in order to find the desired workbook(s). If the welcome page is <https://prod-uk-a.online.tableau.com/#/site/myTableau/home>, the corresponding site content URL is myTableau. |
| tableau.url            | Yes      | The URL to the host of your tableau instance. If the welcome page is <https://prod-uk-a.online.tableau.com/#/site/myTableau/home>, the corresponding url is <https://prod-uk-a.online.tableau.com>.                        |
| tableau.workbooksInfo  | Yes      | A list of objects of the following structure: `{ "workbookId": "${id-of-workbook-on-Tableau-instance-1}" }`. Please see example below.                                                                                     |

### Standalone mode config example with Tableau instance direct connectivity

```json
{
  "solConnection": {
    "host": "https://solidatus-host.example.com",
    "apiToken": "solidatus api token"
  },
  "modelName": "Tableau model",
  "connectorMode": "standalone",
  "tableau": {
    "source": "Tableau Instance",
    "tokenName": "${tableau-token-name}",
    "tokenSecret": "${tableau-token-secret}",
    "siteContentUrl": "${tableau-site-content-url}",
    "url": "https://tableau-host.example.com",
    "workbooksInfo": [
      { "workbookId": "${id-of-workbook-on-Tableau-instance-1}" },
      { "workbookId": "${id-of-workbook-on-Tableau-instance-2}" }
    ]
  }
}
```

## Configuring the Tableau Connector to run with SQL Parsing

Enabling SQL Parsing for the Tableau Connector allows for the extraction of the lineage gap between Tableau connected datasource and the database that the Connector is connecting to. There are multiple ways to connect to a database through Tableau. The below section describes the current offering of the Tableau Connector for each scenario.

1. Non-proxied SQL datasource: This type of datasource allows a user to specify a query to retrieve information from a database. The Tableau Connector will parse the SQL specified in this query to retrieve column level relationships from database columns to result set columns on a Tableau datasource.
2. Non-proxied native datasource: This type of datasource similarly allows a user to retrieve information from a database without having to specify a query. The Tableau Connector will retrieve column level relationships without requiring SQL parsing.
3. Proxied datasources: This type of datasource allows for metadata queried from a database to be stored outside of a Tableau workbook. As such, since the Tableau Connector parses Tableau workbooks, lineage information for this type of datasource cannot be retrieved at this point in time.

Below are additional config options that are required in either standalone or agent mode in order to run the Tableau Connector with SQL Parsing.

| Config field   | Required | Type   | Notes                                              |
| -------------- | -------- | ------ | -------------------------------------------------- |
| sqlParser      | No       | object | Defines SQL Parsing service connection information |
| sqlParser.host | No       | string | URL of SQL Parsing service                         |

## Logging

The Tableau Connector provides a logging interface that allows users to enable and configure custom logging features for the connector. If no logging config is provided, the logger will use the default configuration provided by the connector. To enable use of custom logging configuration, it is necessary to provide the desired `json` configuiration object to the `loggerConfig"` field in the connector configuration file.

### Example logger configuration config

```json
{
  "logLevel": "info",
  "file": {
    "folder": "logs"
  },
  "outputs": ["file", "console"],
  "splitLogs": true
}
```

The above configuration options can be configured as follows:

### `logLevel`

* `error`: only shows the errors and can include a JS error
* `warn`: shows errors and warnings
* `info`: will contain the majority of the logs. Shows errors, warnings and info
* `debug`: gives the most information about certain operations. Shows all logs

### `file`

* `maxsize`: the maximum size in Bytes that you want each log file to be
* `maxFiles`: the maximum number of files you want generated per log level (based on `maxsize`)
* `folder`: the folder that you want the logs to be output to

### `output` (manadatory to select at least one)

* `console`: will output to the console with the designate log level if enabled
* `file`: will create log files that correlate to the log level if enabled. \*Note that selecting file means the `file` field needs a valid folder destination defined. Using an empty object `{}` will default the output file path to the root directory of the where the connector is being run.

### `splitlogs`

Logs can be outputted all to one file to be kept in one place, or they can be split up based on the log level. If split, then there will be a log for each level with higher levels containing all of that below them. This can be useful for just looking at errors, or just errors and warnings.
