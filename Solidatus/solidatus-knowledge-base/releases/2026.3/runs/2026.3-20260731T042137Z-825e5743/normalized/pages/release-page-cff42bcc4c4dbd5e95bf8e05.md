# Example Configuration

## YAML Configuration - Agent Mode

```yaml
logging:
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.powerbi: INFO
# Agent mode example configuration
spring:
  profiles:
    active: connector
solidatus:
  api:
    host: "https://xyz-group.solidatus.com"
    token: "123abc45de789f0"
  agent:
    name: "My PowerBI Connector Agent"
    type: "PowerBI"
    description: "PowerBI Connector Agent"
```

## YAML Configuration - Standalone Mode

```yaml
logging:
  # Recommended logging
  level: # Alternative log levels = (INFO/DEBUG/TRACE/ERROR)
    root: INFO
    com.solidatus.powerbi: INFO
# Standalone mode example configuration
spring:
  profiles:
    active: standalone
solidatus:
  api:
    host: "https://xyz-group.solidatus.com"
    token: "123abc45de789f0"
  powerbi:
    converter:
      input-file: "/home/xyzReport.pbit"
      target-model-id: "987654321987654321987"
```
