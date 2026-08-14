# Agent mode

## What is Agent Mode?

Agent mode is different from standalone mode. The connector will run as a long running process that connects to the core Solidatus application. Users of the Solidatus application can create preset configurations, known as a Job, that can be submitted to the connector. The connector agent will run these jobs, creating an Execution which will create or update models in the same way standalone mode would.

Agent mode presents a way to easily allow technical and non-technical users to create connector configurations, share them with other Solidatus users or groups, and execute connector jobs to create or update Solidatus models all within the Solidatus UI. Previous job executions can be viewed along with their configuration and output in the UI. Connectors in agent mode will create an audit trail in the model revisions they create, linking the revisions back to the job and execution that created them. The audit trail contains the who, what and when information typically needed to answer an audit history question.

In addition to this, jobs will automatically be queued for running, and multiple users can access the same connector instance.

Finally, agent mode allows users to submit jobs with sensitive configuration with reassurance that those values are encrypted safely in Solidatus.

It is recommended that when a connector is developed, agent mode is considered for these benefits.

## Agent Mode classes

To implement a connector in `agent` mode we need 4 classes:

| Class                    | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `Connector`              | A class to read source data, process it, create a solidatus model and publish it |
| `ConnectorConfig`        | A Java bean class to hold the connectors job properties                          |
| `ConnectorConfiguration` | A Spring Configuration class which defines beans for `agent` mode                |
| `Application`            | The Spring Boot application entry point                                          |

In `agent` mode the same `Connector` and `ConnectorConfig` classes are used as with `standalone` mode, the difference is how they are instantiated and called.

## Connector

Given a `ConnectorConfig` object, this class will read a source of data. The source can be a file or a remote system accessed via an API. Inspect and interpret the source data to extract meaning which can be visualised as a Solidatus model, create the Solidatus model and publish it to a Solidatus instance.

A simple `Connector` implementation outline might look like this:

```java
/**
 * Solidatus Java Connector example which builds a model by parsing a JSON file
 * of data, creates a Solidatus model to visualise the data and saves it to Solidatus
 * using the Solidatus API
 */
public class Connector {

  /**
   * Constructs the connector
   * @param apiClient - Solidatus API client
   * @param config - the connector config
   */
  public Connector(ApiClient apiClient, ConnectorConfig config) {
  }

  /**
   * Constructs the connector
   * @param apiClient - the Solidatus API client
   * @param config - the connectors config
   * @param modelService - Solidatus Model Service API
   */
  public Connector(ApiClient apiClient, ConnectorConfig config, SolidatusModelService modelService) {
  }

  /**
   * Executes the connector
   * @throws IOException
   */
  public void run() throws IOException {
    // Read source data
    // Create Solidatus model
    // Publish solidatus model
  }
}
```

In the code above the `Connector` is making use of the `ApiClient` and `SolidatusModelService` both of these classes are in the Solidatus Java Connector SDK. The `ApiClient` is the Solidatus API helper and `SolidatusModelService` is a helper for working with Solidatus Models.

## ConnectorConfig

A Spring bean class which represents the properties needed by the connector class to execute, e.g.

```java
/**
 * The Connector configuration domain object.
 * An instance of this class will be configured from the <code>solidatus.connector</code> properties namespace and added
 * to the {@link org.springframework.context.ApplicationContext}
 */
@Configuration
@ConfigurationProperties("solidatus.connector")
@Getter
@Setter
public class ConnectorConfig {

  String host;
  String token;
  String modelName;
  String datasourceFile;

  //Getters and Setters added by Lombok
}
```

The annotations `@Configuration` and `@ConfigurationProperties` are from Spring Boot they tell Spring to create a bean of the `ConnectorConfig` class with properties set using values from the property framework whose values start with the prefix `solidatus.connector`

More on external properties can be found here <https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config>

## ConnectorConfiguration

A Spring Configuration bean class that is enabled for the `agent` Spring Profile only. This configuration class is only enabled when `spring.profiles.active=agent` is added to the command line.

This configuration class is responsible for defining a `CommandLineRunner` implementation which constructs and executes an instance of the `SolidatusConnectorClient` class. It is also responsible for defining other Spring Beans required by the `SolidatusConnectorClient`.

A `ConnectorConfiguration` should use the `@EnableSolidatusConnector` annotation on the class to enable the SDKs agent features.

This configuration should also define Spring Beans which can be used by the `CommandLineRunner` when instantiating the `SolidatusConnectorClient`.

Below is a pseudocode example of a `ConnectorConfiguration` class

```java
/**
 * Spring Configuration for Connector Agent mode
 */
@Profile({"agent"})
@Configuration
@EnableSolidatusConnector
public class ConnectorAgentConfiguration {

  private RegisterConnectorAgentResponse registration;

  /**
   * Spring Command Line Runner which runs the connector in Agent mode
   */
  @Bean
  CommandLineRunner connectorAgentRunner(SolidatusConnectorAgentProperties agentProperties,
                                         SolidatusApiProperties apiProperties,
                                         SolidatusConnectorClient client,
                                         ConnectorConfig config,
                                         ApiClient apiClient,
                                         Client httpClient,
                                         List<IConnectorSubscriber> subscribers,
                                         Map<String, ConnectorConfigItemMetaInformation> configMeta) {

    //Returns a CommandLineRunner which configures the SolidatusConnectorClient
    //and starts the connector agent.
  }

  /**
   * A list of subscribers to connector events pushed from a host Solidatus instance
   */
  @Bean
  List<IConnectorSubscriber> subscribers(ApiClient apiClient, SolidatusConnectorClient connectorClient) {
    //Returns a list of subscribers used by the agent
  }

  /**
   * Config meta-data map sent to Solidatus to display this connectors UI
   */
  @Bean
  Map<String, ConnectorConfigItemMetaInformation> configMeta() {
    //Returns a Map ConnectorConfigItemMetaInformation
  }

  /**
   * <p>This connector's Job event subscriber.</p>
   * <p>A {@link ConnectorJobSubscriber} subscribes to connector job events pushed from a Solidatus host instance and
   * is responsible for executing the job.</p>
   * <p>Executing the job should involve collating data from sources, producing the Solidatus model, and publishing it to
   * a Solidatus instance.</p>
   */
  ConnectorJobSubscriber getJobSubscriber(ApiClient apiClient, SolidatusConnectorClient connectorClient) {
    //Define and Return a Connector Job subscriber
  }

}
```

| method                 | description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `connectorAgentRunner` | Defines a `CommandLineRunner` which starts and configures the injected `SolidatusConnectorClient` |
| `subscribers`          | Defines a list of subscriber implementations                                                      |
| `configMeta`           | Defines a Map of ConnectorConfigItemMetaInformation items                                         |
| `getJobSubscriber`     | Defines a ConnectorJobSubscriber implementation                                                   |
