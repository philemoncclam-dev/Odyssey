# Standalone mode

To implement a connector in `standalone` mode we need 4 classes:

| Class                     | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| `Connector`               | A class to read source data, process it, create a Solidatus model and publish it |
| `ConnectorConfig`         | A Java bean class to hold the connectors job properties                          |
| `StandaloneConfiguration` | A Spring Configuration class for `standalone` mode                               |
| `Application`             | The Spring Boot application entry point                                          |

## Connector

Given a `ConnectorConfig` object this class will read a source of data, the source can be a file or a remote system accessed via an API. Inspect and interpret the source data to extract meaning which can be visualised as a Solidatus model, create the Solidatus model and publish it to a Solidatus instance.

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

In the code above, the `Connector` is making use of the `ApiClient` and `SolidatusModelService` both of these classes are in the Solidatus Java Connector SDK. The `ApiClient` is the Solidatus API helper and `SolidatusModelService` is a helper for working with Solidatus Models.

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

## StandaloneConfiguration

A Spring Configuration bean class that is enabled for the `standalone` Spring Profile only. This configuration class is only enabled when `spring.profiles.active=standalone` is added to the command line.

This configuration class is responsible for defining a `CommandLineRunner` implementation which constructs and executes an instance of the `Connector` class.

```java

@Profile({"standalone"})
@Configuration
public class StandaloneConfiguration {

  @Bean
  Connector connector(ConnectorConfig config, ApiClient apiClient, SolidatusModelService modelService) {
    return new Connector(apiClient, config, modelService);
  }

  @Bean
  CommandLineRunner connectorStandaloneRunner(Connector connector) {
    return (args) -> {
      connector.run();
    };
  }

}
```

The `@Profile({"standalone"})` annotation enables this configuration for the `standalone` profile only.

The `@Configuration` annotation defines this bean class as a Spring Configuration.

The first `@Bean` annotation defines a Spring Bean method which returns an instance of the `Connector` implementation class.

The `Connector` instance is configured via its constructor with other Spring Beans that have been autowired when the method is called.

The second `@Bean` annotation defines a Spring Bean method which returns an instance of a `CommmandLineRunner` class. The `CommandLineRunner` instance is autowired with the `Connector` bean and it executes the `Connector` implementation when the Spring Application starts-up.

## Application

The main entry point of the application, it simply defines and starts the Spring Boot application.

```java

@SpringBootApplication
public class Application {

  public static void main(String[] args) {
    new SpringApplicationBuilder(Application.class).run(args);
  }

}
```

The following table defines the available Spring Beans created by the auto-configuration feature and available for auto-wiring.

| Bean                     | Class | Description                                                        |
| ------------------------ | ----- | ------------------------------------------------------------------ |
| `ApiClient`              |       | An API client configured from properties prefixed `solidatus.api`  |
| `SolidatusApiProperties` |       | Solidatus properties bean from properties prefixed `solidatus.api` |
| `SolidatusModelService`  |       | Helper class for Solidatus models                                  |
| `HttpClient`             |       | An SSL/TLS verifying or non-verifying http client                  |
