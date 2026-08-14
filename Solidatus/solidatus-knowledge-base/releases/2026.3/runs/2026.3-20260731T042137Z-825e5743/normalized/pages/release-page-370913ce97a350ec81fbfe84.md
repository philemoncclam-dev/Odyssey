# Configuration

To configure the Solidatus WebFOCUS connector, create an `application.yaml` configuration file with the following configuration options, or use the [Command Line Arguments](/connectors/connector-specific-documentation/solidatus-webfocus/running).

The following example `application.yaml` shows all the configuration options and values.

## Configuration Example

`application.yaml`:

```yaml
---
logging:
  level:
    root: [TRACE|DEBUG|INFO|WARN|ERROR]
    com.solidatus: [TRACE|DEBUG|INFO|WARN|ERROR]
    com.solidatus.webfocus: [TRACE|DEBUG|INFO|WARN|ERROR]
spring:
  profiles:
    active: [connector|standalone]
solidatus:
  api:
    host: [Solidatus Host]
    token: [Solidatus Token]
    verify-ssl: [true|false]
  agent:
    name: WebFOCUS Connector
    description: A WebFOCUS connector
  webfocus:
    ignore-connector-level-config-sources: [true|false]
    create-data-assets: [true|false]
    access-file-sources:
      treat-parsing-errors-as-warnings: [true|false]
      source-paths:
        - path: [path to access files]
          process-sub-folders: [true|false]
    master-file-sources:
      treat-parsing-errors-as-warnings: [true|false]
      source-paths:
        - path: [path to master files]
          process-sub-folders: [true|false]
    trace-file-sources:
      treat-parsing-errors-as-warnings: [true|false]
      folder-path: [path to trace file sources]
      files-to-process:
        - [name of file to process]
      process-all-files: [true|false]
```

## Configuration Options

### Agent or Standalone

* `spring.profiles.active`: `connector` for agent mode or `standalone` for standalone mode

### Logging

* `logging.level.root`: Logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`. Default is `INFO`
* `logging.level.com.solidatus`: Solidatus logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`. Default is `INFO`
* `logging.level.com.solidatus.webfocus`: WebFOCUS connector logging level, either `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`

### Solidatus Options

#### API

* `solidatus.api.host`: Solidatus host
* `solidatus.api.token`: Solidatus API token
* `solidatus.api.verify-ssl`: Whether to verify SSL

### Agent Mode

* `solidatus.agent.name`: Unique name of connector agent. Default is `WebFOCUS Connector`
* `solidatus.agent.description`: Description of connector agent. Default is `A WebFOCUS connector`

### WebFOCUS Options

* `solidatus.webfocus.ignore-connector-level-config-sources`: If set to true and in agent mode, during job execution, any access/master file sources from the connector-level config will be ignored and only access/master file sources from the job-level config will be used.
* `solidatus.webfocus.create-data-assets`: By default, when true, creates Data Assets in the Solidatus model. Set to false to disable Data Asset creation.
* `solidatus.webfocus.access-file-sources.treat-parsing-errors-as-warnings`: By default, when false, ANTLR's parsing errors will throw an exception and terminate execution. Set to true to treat parsing errors as warnings instead. ANTLR will do its best to parse the input regardless and processing will continue.
* `solidatus.webfocus.access-file-sources.source-paths`: A **list** of [source path objects](#source-path)
* `solidatus.webfocus.master-file-sources.treat-parsing-errors-as-warnings`: By default, when false, ANTLR's parsing errors will throw an exception and terminate execution. Set to true to treat parsing errors as warnings instead. ANTLR will do its best to parse the input regardless and processing will continue.
* `solidatus.webfocus.master-file-sources.source-paths`: A **list** of [source path objects](#source-path)
* `solidatus.webfocus.trace-file-sources`: [trace file sources object](#trace-file-sources)

#### Source Path

* `process-sub-folders`: boolean flag indicating whether or not to recursively process subdirectories
* `path`: The path to the directory of sources

#### Trace File Sources

* `treat-parsing-errors-as-warnings`: By default, when false, ANTLR's parsing errors will throw an exception and terminate execution. Set to true to treat parsing errors as warnings instead. ANTLR will do its best to parse the input regardless and processing will continue.
* `folder-path`: The path to the directory of trace files.
* `process-all-files`: By default, when false, only explicitly listed files will be processed. Set to true to process all trace files found in the folder. If set to true, all explicitly listed files will be ignored and all files will be processed.
* `files-to-process`: List of trace files, in the folder, to process.
