# Overview

The connector takes as input a PowerBI `*.pbit` file. This is a PowerBI report template file, obtained by saving a PowerBI dashboard as a Template.

This connector retrieves the Layout internal file from the PBIT and uses it to derive data source equivalents of tables and columns used to populate sections of the output report. It retrieves the model schema information, which is interpreted to discover the data sources (files and relational database tables) for the report sections.

## Usage

There are two ways to run the PowerBI connector: Agent mode and Standalone mode.

Agent mode sets up a connector agent to connect to a hosted Solidatus instance that enables a user to create, configure and run jobs from Solidatus UI. The connector agent will listen for job events from Solidatus and execute the jobs. See [Agent Mode](/connectors/connector-specific-documentation/power-bi/overview/agent-mode) for more details.

Standalone mode runs single execution of a connector job with a supplied config and publishes the model to Solidatus. The connector will terminate when the job execution is completed. See [Standalone Mode](/connectors/connector-specific-documentation/power-bi/overview/standalone-mode) for more details.
