# Requirements

## Input files

The connector is a file-based connector only. It does not connect to WebFOCUS directly. Instead, it relies on input files provided to it.

Files must be available on the connector-accessible file-system. Upload of files is not supported. For help on making files available to the connector, please see the [Setup Page](/connectors/connector-specific-documentation/solidatus-webfocus/setup#uploading-source-files).

### WebFOCUS trace files

The connector requires WebFOCUS trace files (`.trc`) as input to extract lineage. These files are generated during WebFOCUS report (`.fex`) execution, and represent the actual commands executed by WebFOCUS. Generating trace files is explained in detail in the [Setup Page](/connectors/connector-specific-documentation/solidatus-webfocus/setup#generating-webfocus-trace-files).

#### Execution timestamps

If multiple trace files are provided, the connector must sort them into the order they were executed in, so that it can correctly resolve interdependencies.

If this is the case, each trace file needs to contain a statement setting a WebFOCUS variable `SOLIDATUS_EXECUTION_TIMESTAMP` to a timestamp with millisecond precision in the format `YYYYMMDDHHMMSSsss`. E.g. `SET SOLIDATUS_EXECUTION_TIMESTAMP = 20251218104510189;`.

If there are multiple trace files with the same execution timestamp, it is assumed that they were executed in parallel, and there are no dependencies between them. In this case, the connector can process these files in any order.

#### Report names

The connector also supports extracting report names from the trace files, to include as properties in the generated model. This is not required, but can be helpful for users to explore lineage by report name in Solidatus.

By default, the connector will use the file name of the trace file as the report name.

Alternatively, if the trace file contains a statement setting a WebFOCUS variable `SOLIDATUS_REPORT_NAME` to a string value, the connector will use that value as the report name instead of the file name. E.g. `SET SOLIDATUS_REPORT_NAME = 'My Report 1';`.

### WebFOCUS metadata files

The connector also requires all master (`.mas`) and access (`.acx`) files that are relevant to the executed WebFOCUS reports. These files contain metadata about the logical and physical data sources used by WebFOCUS, and are necessary for the connector to correctly infer lineage.

## Solidatus

For both Agent mode and Standalone mode, a Solidatus instance running Solidatus 5.1 or greater is required.

* For Agent mode, a Solidatus API token is required to register the agent in Solidatus.
* For Standalone mode, a Solidatus API token is required to create and update models in Solidatus.

## Network

An HTTP(S) TCP network connectivity is required between the connector and the Solidatus instance server.

## Environment

The connector is built using Java, and available as a `.jar` file or a containerized image.

We recommend 2 CPU & 8GB of RAM for the connector, but the requirements will depend on the size of the input files and the size of the generated model. The connector is expected to run on a single machine, and does not require distributed computing.

### Java `.jar` file

*Recommended for Standalone mode, but can be used for Agent mode if desired.*

To run the connector from the `.jar` file, a Java Runtime Environment (JRE) is required. The connector was built using Java 17, and is expected to be run on Java 17.

Knowledge in running Java applications from the command line is required to run the connector from the `.jar` file.

If using Agent mode, knowledge in configuring long-running applications/services under the selected operating system is required to run the connector.

### Containerized image

*Recommended for Agent mode, but can be used for Standalone mode if desired.*

The containerized image comes with Java and all other dependencies pre-installed, so no additional software is required to run the connector from the containerized image.

To run the connector from the containerized image, a containerization platform is required. The connector was built and tested using Docker, but should be compatible with other containerization platforms that support Docker images.

Knowledge in running containerized applications is required to run the connector from the containerized image.
