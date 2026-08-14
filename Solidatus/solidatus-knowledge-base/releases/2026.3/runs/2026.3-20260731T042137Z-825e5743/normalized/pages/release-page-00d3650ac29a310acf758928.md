# Example configuration

The following are example yml configuration files for the Solidatus JDBC Connectors.

## Example Template

Below is an example configuration that contains commonly used configuration options:

```yaml
logging: # Optional
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.app: DEBUG
    com.zaxxer.hikari: DEBUG
---
# Agent mode connector example configuration
spring:
  profiles:
    active: connector # Required
solidatus:
  api:
    host: { SOLIDATUS_HOST_ADDRESS } # Required
    token: { SOLIDATUS_TOKEN } # Required
  agent:
    name: JDBC-Connector-Agent # Optional: a default name is selected
    type: JDBC # Optional
    description: "A JDBC sample connector" # Optional
  # JDBC configuration is set through Job configuration
---
# Standalone mode connector example configuration
spring:
  profiles:
    active: standalone # Required
solidatus:
  util: # Optional parameter if output to file is wanted
    modelFilename: "generated_model.json"
  api:
    host: { SOLIDATUS_HOST_ADDRESS } # Required
    token: { SOLIDATUS_TOKEN } # Required
    model-name: "JDBC Model"
  jdbc:
    driver: { DRIVER } # Required: Any selected JDBC driver i.e. oracle12/mysql/sqlserver/snowflake/impala/cassandra/etc.
    url: { JDBC_URL } # Required: See documentation for more information on structure.
    username: { DB_USERNAME } # Required
    password: { DB_PASSWORD } # Required
    schema-pattern: { SCHEMA_PATTERN }
    table-pattern: { TABLE_PATTERN }
    table-types: [ "TABLE", "VIEW", "SYNONYM" ] # Optional
    split-views: true # Optional: Creates a separate layer for Views (Labelled as 'SCHEMA'.VIEWS)
    # Optional: SQL-parsing configuration options
    sql-parsing: true # Required if SQL parsing is wanted
    dialect: { DIALECT } # Required: Must match dialect equivalent of chosen driver (See documentation)
    default-schema: { DEFAULT_SCHEMA } # Required
    sql-directory: null # Optional if only parsing through database connection
```

## Full Example Template

Below is a full example template yml file:

```yaml
logging: # Optional
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.app: DEBUG
    com.zaxxer.hikari: DEBUG
---
# Agent mode connector example configuration
spring:
  profiles:
    active: connector # Required
solidatus:
  api:
    host: { SOLIDATUS_HOST_ADDRESS } # Required
    token: { SOLIDATUS_TOKEN } # Required
    verify-ssl: true # Optional
  agent:
    name: JDBC-Connector-Sample # Optional: a default name is selected
    type: JDBC # Optional
    description: "A JDBC sample connector" # Optional
  # JDBC configuration is set through Job configuration
---
# Standalone mode connector example configuration
spring:
  profiles: standalone # Required
solidatus:
  util: # Optional parameter if output to file is wanted
    modelFilename: "generated_model.json"
  api:
    host: { SOLIDATUS_HOST_ADDRESS } # Required
    token: { SOLIDATUS_TOKEN } # Required
    model-name: "JDBC Model"
  jdbc:
    driver: oracle12 # Required: Any selected JDBC driver i.e. oracle12/mysql/sqlserver/snowflake/impala/cassandra/etc.
    url: { JDBC_URL } # Required: See documentation for more information on structure.
    username: { DB_USERNAME } # Required
    password: { DB_PASSWORD } # Required
    catalog: "HR" # Optional
    schema-pattern: [ "HumanResources", "Person", "Production", "Purchasing", "Sales" ] # Optional: Comma separated list of required schemas
    table-pattern: [ "T1, T2, T2" ]  # Optional: Comma separated list of required tables
    table-types: [ "TABLE", "VIEW", "SYNONYM" ] # Optional
    split-views: true # Optional: Creates a separate layer for Views (Labelled as 'SCHEMA'.VIEWS)
    simple-procedure-summary: true # Optional: Simplifies procedure processes
    exclusion-filter: # Optional: Wildcard formatted exclusions
      table-pattern: [ "RS_*" ]
    procedure-pattern: [ "PACK_*" ]
    views-pattern: [ "*COMB*" ]
    # Optional: SQL-parsing configuration options
    sql-parsing: true # Required if SQL parsing is wanted
    dialect: oracle # Required: Must match dialect equivalent of chosen driver (See documentation)
    default-schema: "Person" # Required
    sql-directory: null # Optional if only parsing through database connection
---
# Standalone mode connector custom driver example configuration
spring:
  profiles:
    active: standalone
solidatus:
  api:
    host: { SOLIDATUS_HOST_ADDRESS }
    token: { SOLIDATUS_TOKEN }
    model-name: "JDBC Custom Driver Model"
  jdbc:
    driver: custom # Required
    driver-class: com.microsoft.sqlserver.jdbc.SQLServerDriver # Required: Chosen custom JDBC driver class
    url: { JDBC_URL } # Required
    username: { DB_USERNAME } # Required
    password: { DB_PASSWORD } # Required

```
