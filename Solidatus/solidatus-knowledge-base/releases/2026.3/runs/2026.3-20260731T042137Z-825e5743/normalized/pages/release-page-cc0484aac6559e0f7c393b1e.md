# Legacy Mainframe

The Solidatus Legacy Mainframe connector is a Java based tool to parse Legacy based text output. This output can represent a multitude of systems or concepts.

The connector reads the output files created by Legacy for underlying domain systems, rather than the specific domain system's export.

The connector creates Solidatus layers, attributes, objects and transitions with any structure, and provides property values for any of the generated entities.

## Usage

There are two ways to run the Legacy Mainframe connector, Agent mode and Standalone mode.

Standalone mode runs a singular execution of the Connector with supplied config and publishes the model. The connector will terminate after this execution completes or fails.

Agent mode sets up a long-lasting Solidatus Agent to connect to the hosted Solidatus site that can receive and run connector jobs with unique configurations and can be configured through the Solidatus user interface. After any job execution finishes or fails, the connector process will continue to listen for new job executions sent from the UI.

Configuration can also be set using a `{}.yml` file as presented in the example configuration. Alternatively the configuration can be passed in as command line parameters to the connector jar file. If using both methods the command line arguments will overwrite the configuration .yml file. See the Configuration Options section for more detail.

## Running the connector with docker

The connector can be run via `docker-compose` where an example of a `docker-compose.yml` can be found. Then execute `docker-compose up -d`. To run the container using docker, run the command to execute would be `docker run -d -v data:/data --name <name_of_container> <tag_name_of_image> [flags]`.
