# Setup

In order to use the Solidatus WebFOCUS connector, you must first edit your WebFOCUS configuration to generate WebFOCUS trace files (`.trc`).

## Generating WebFOCUS trace files

To generate WebFOCUS trace files, add code like below to your WebFOCUS user profile:

```
-* Enable generation of trace files for the Solidatus WebFOCUS connector
SET TRACEUSER='trace-file.trc';
SET TRACEOFF=ALL;
SET TRACEON=CEH /1;
SET TRACEUSER=ON;
```

If multiple trace files are to be provided to the connector, each trace file needs to contain a timestamp.

The timestamp can be generated using the below snippet.

Set this special variable AFTER the trace file enabling code in the WebFOCUS user profile.

```
-* Create variable containing the current date-time with millisecond precision in format YYYYMMDDHHMMSSsss
-SET &NOW = EDIT(DT_FORMAT(DT_CURRENT_DATETIME(MILLISECOND),'HYYMDm'),'9999$99$99$99$99$99$999');

-* Set the connector-required variable to the generated timestamp
SET SOLIDATUS_EXECUTION_TIMESTAMP = &NOW;
```

If you wish to use custom report names, set the WebFOCUS variable `SOLIDATUS_REPORT_NAME` to the desired report name string in the trace file:

```
-* Include report name to use instead of trace file filename due to filename character limit
SET SOLIDATUS_REPORT_NAME = 'My Report 1';
```

## Uploading Source Files

Files must be available on the connector-accessible file-system. Upload of files is not supported.

For Java `.jar` file execution, the connector filesystem will be the local filesystem of the machine executing the connector.

For containerized image execution, the connector filesystem will be the container filesystem. In this case, files can be made available to the connector via volume mounting.
