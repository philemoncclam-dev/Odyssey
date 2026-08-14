# Getting Started

The simplest way to get started is to use the Spring Initializr at <https://start.spring.io> to generate a downloadable Maven project for you!

Select your preferred build tool Maven or Gradle, Spring Boot version and your Java version.

You can even enter the GAV metadata details for your project.

Then simply click the Generate button to download a zip file of your project setup, unzip and open in your preferred Java IDE.

For an example Solidatus Java Connector, please see our provided example [project](https://github.com/solidatus/solidatus-java-sdk-example). If you do not have access to this project please ask your Solidatus contact for next steps.

### Maven

Add the Solidatus Java Connector SDK dependency to your Maven project's `pom.xml`

```xml

<dependency>
    <groupId>com.solidatus.spring</groupId>
    <artifactId>solidatus-spring-boot-starter</artifactId>
    <version>0.1.30</version>
</dependency>
```

### Gradle

Add the Solidatus Java Connector SDK dependency to your Gradle project's `build.gradle`

```
dependencies {
	implementation 'com.solidatus.spring:solidatus-spring-boot-starter:0.1.30'
}
```

The Solidatus Spring Boot Starter includes a dependency for the Solidatus Java Client, this is the client generated from Solidatus Open API specification. The SDK uses the Java client to make API calls to the Solidatus server.
