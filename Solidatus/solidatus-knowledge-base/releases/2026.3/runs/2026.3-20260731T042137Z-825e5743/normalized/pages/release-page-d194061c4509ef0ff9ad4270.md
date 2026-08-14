# Overview

The Solidatus Purview connector is a Java based tool to connect to Solidatus and a Purview instance, pull information from models created by other connectors in Solidatus, and create and update assets and relationships within Purview to match what is loaded in Solidatus.

## Usage

There are two ways to run the Purview connector; Agent mode and Standalone mode. Standalone mode requires all configuration to be provided to the connector, which then runs a single instance of the connector and updates Purview once. Agent mode sets up a Solidatus Agent to connect to the Solidatus site that can receive and run multiple different job configurations, to pull information from multiple Solidatus models into Purview.

Configuration can be passed through a YAML file, as shown in the example files `fullSample.yml` and `template.yml`. Configuration can also be passed through command line arguments. If an option is provided by both file and command line, the command line version will be used. See [Configuration](https://github.com/solidatus/solidatus-purview/blob/docs/solidatus-purview-docs/core/core/configuration.md) for more details.
