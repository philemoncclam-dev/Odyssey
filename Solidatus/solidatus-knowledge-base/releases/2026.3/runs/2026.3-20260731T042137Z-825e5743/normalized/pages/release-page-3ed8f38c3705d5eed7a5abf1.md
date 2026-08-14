# Overview

## Usage

There are two ways to run the Solidatus SSIS connector: Agent mode and Standalone mode.

Agent mode sets up a connector agent to connect to a hosted Solidatus instance that enables a user to create, configure and run jobs from Solidatus UI. The connector agent will listen for job events from Solidatus and execute the jobs. See [Agent Mode](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/solidatus-core/connectors/solidatus-connectors/ssis/overview/broken-reference/README.md) for more details.

Standalone mode runs single execution of a connector job with a supplied config and publishes the model to Solidatus. The connector will terminate when the job execution is completed. See [Standalone Mode](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/solidatus-core/connectors/solidatus-connectors/ssis/overview/broken-reference/README.md) for more details.
