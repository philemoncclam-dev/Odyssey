# Example Configuration

## YAML Configuration - Agent Mode

```yaml
logging:
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.ssis: INFO
# Agent mode example configuration
spring:
  profiles:
    active: connector
solidatus:
  api:
    host: "https://xyz-group.solidatus.com"
    token: "123abc45de789f0"
  agent:
    name: "My SSIS Connector Agent"
    type: "SSIS"
    description: "SSIS Connector Agent"
```

## YAML Configuration - Standalone Mode

```yaml
logging:
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.ssis: INFO
# Standalone mode example configuration
spring:
  profiles:
    active: standalone
solidatus:
  api:
    host: "https://xyz-group.solidatus.com"
    token: "123abc45de789f0"
    model-name: "Sample SSIS model"
  ssis:
    dtsx-file-path:
      - "/home/sample.dtsx"
      - "/users/sample.dtsx"
    connection-manager-providers:
      - ref-id: "Package.ConnectionManagers[OLE DB Extract]"
        database-provider: "oracle"
      - ref-id: "Package.ConnectionManagers[OLE DB Load]"
        database-provider: "sqlserver"
```
