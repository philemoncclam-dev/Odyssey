# Connectors overview

**Solidatus connectors** enable organisations to integrate Solidatus with external data technologies, so lineage can be captured automatically from existing metadata in an external source.

Connectors do more than just import and export to move information from one place to another: they often piece together the lineage of data that resides in external tools from metadata in those tools. As such, connectors perform lineage discovery and capture, scanning external tools for relevant metadata and generating lineage from it.

As a result, you can use the output of connectors and the lineage trace analytics in Solidatus to discover the lineage of data that lives in an external system.

All connectors are agent processes (written using our [Connector SDK](https://solidatus.gitbook.io/solidatus-java-sdk)) that extract, transform, and load information into Solidatus through the Solidatus JSON-based REST API. Some connectors can also extract information from Solidatus for transmission to another tool or for reporting.

{% hint style="success" %}
Each connector has its own documentation site with specific information pertaining to a connector and external source technology.

Visit the [connector-specific documentation](/connectors/connector-specific-documentation) page to find links to documentation for each connector.
{% endhint %}

***

### General connector concepts and functions

The pages in this section introduce and explain several key concepts and operations involved in the setup and use of all connectors:

* [Users and tokens](/connectors/connectors-overview/users-and-tokens)
* [Service accounts](/connectors/connectors-overview/service-accounts)
* [Agent and standalone modes](/connectors/connectors-overview/connectors-framework)
* [Agents](/connectors/connectors-overview/agents)
* [Jobs](/connectors/connectors-overview/jobs)

An understanding of the roles played by **service accounts** and **API tokens** is essential for managing connectors in an enterprise. See our [service accounts](/connectors/connectors-overview/service-accounts) page to find out more.

Connectors are managed via [agents](/connectors/connectors-overview/agents) and [jobs](/connectors/connectors-overview/jobs) that can be configured in the [connectors interface](/connectors/connectors-overview/connectors-page), accessible by clicking **CONNECTORS** in the top navigation bar.

See the [connector framework](/connectors/connectors-overview/connectors-framework) for an overview of connector architecture and a step-by-step guide to managing and running connectors through the user interface.
