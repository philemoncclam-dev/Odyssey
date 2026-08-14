# Fabric Data Lakehouse

Using the SQL server driver, the JDBC connector can extract table metadata from a Lakehouse on Microsoft Fabric. Our suggested authentication method to connect to the underlying SQL Server database is via an Azure Active Directory Service Principal. Note that connectivity in this manner will only be able to visualize Lakehouse tables and columns in the produced Solidatus model.

## Service Principal access setup

In order for a Service Principal to be setup correctly to allow access to a Fabric Lakehouse's underlying database, please adhere to the following recommendations. For more information on Azure Service Principals, please see [here](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal).

* Grant PowerBI Service API permissions to the App registration
  * The application permissions required are: Tenant.Read.All
* Create a new Entra group for the App registration
  * Make the App registration an owner and a member
* In the Fabric Admin Portal, under the `Tenant settings` page, ensure that `Service principals can use Fabric APIs` is enabled.
* Add the App registration group to any relevant Fabric Workspace.

### Service Principal Example configuration

Below is an example configuration for a standalone execution of the connector.

```yml
solidatus:
    jdbc:
        driver: sqlserver
        url: jdbc:sqlserver://${sql-analytics-endpoint};authentication=ActiveDirectoryServicePrincipal
        username: ${application-id}
        password: ${client-secret-value}
        catalog: ${lakehouse-name}
        schema-pattern: dbo
```

The `application-id` refers to the Application ID on the App registration created as a Service Principal. This is retrievable from the Overview page of the appropriate App registration.

The `client-secret-value` is the value of a client secret created on the appropriate App registration.

The `sql-analytics-endpoint` is the SQL connection string used to construct the JDBC connection string that targets the appropriate Fabric Lakehouse. For more information, please see [here](https://learn.microsoft.com/en-us/fabric/data-warehouse/get-started-lakehouse-sql-analytics-endpoint).

The `lakehouse-name` is the name of the Fabric Lakehouse to connect to.

## Default Azure Identity

Alternatively, if a user is running the connector in an environment that they have access to the Azure CLI (`az`), they can authenticate via credentials that can be provided locally. The user would just need the appropriate access to the lakehouse whether directly or through an Entra group.

### Default Azure Token Example configuration

```yml
solidatus:
    jdbc:
        driver: sqlserver
        url: jdbc:sqlserver://${sql-analytics-endpoint};authentication=ActiveDirectoryDefault
        catalog: ${lakehouse-name}
        schema-pattern: dbo
```

The `sql-analytics-endpoint` is the SQL connection string used to construct the JDBC connection string that targets the appropriate Fabric Lakehouse. For more information, please see [here](https://learn.microsoft.com/en-us/fabric/data-warehouse/get-started-lakehouse-sql-analytics-endpoint).

The `lakehouse-name` is the name of the Fabric Lakehouse to connect to.
