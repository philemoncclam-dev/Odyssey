# Java connector SDK

The Solidatus API allows metadata and lineage to be read and updated programmatically, without a user having to interact with the web-based interface. Interaction with Solidatus can be programmed through the Solidatus API, for example from a script, micro-service, or application.

The API allows organisations to fully automate data lineage from various sources, including data governance tools, spreadsheets, data catalogs, databases and ETL tools. Changes made via the API are versioned, audited and can be augmented with manually maintained metadata and lineage.

The Solidatus API allows organisations to build and streamline their ecosystem of metadata and data governance tooling.

A Java application which uses the Solidatus API, we call a Connector.

Using the raw Solidatus API can present some challenges so to make things simpler, faster and better we have written a Solidatus Java Connector SDK.

At Solidatus, we recommend writing your Solidatus Java Connectors using Spring Boot. As such, our Java Connector SDK is written as a Spring Boot Starter and is called `solidatus-spring-boot-starter`

This document assumes that the reader is already familiar with Spring Boot and Spring's concepts of Dependency Injection, Spring Beans, Property Configuration Management and Spring Configuration classes.

For more information on Spring Boot, please see the [additional resource links](/connectors/connector-specific-documentation/java-connector-sdk/additional-resources) at the end of this guide.
