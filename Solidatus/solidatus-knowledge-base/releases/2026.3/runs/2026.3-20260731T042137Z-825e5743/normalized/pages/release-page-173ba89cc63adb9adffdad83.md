# Agent mode

This mode is used to start the connector as an agent service, which registers itself with Solidatus. You can configure a job interactively, run and monitor the job from the Solidatus connectors dashboard.

See [Configuration](/connectors/connector-specific-documentation/power-bi/configuration) for more configuration details.

Once the connector agent has been successfully registered, you can start to [configure a job on Solidatus](/connectors/connector-specific-documentation/power-bi/configuration/configure-job-using-wizard-in-solidatus).

## Example

```bash
java -jar solidatus-powerbi-java-X.X.XX.jar \
--spring.profiles.active=connector \
--solidatus.agent.name="My PowerBI Connector Agent" \
--solidatus.agent.type="PowerBI" \
--solidatus.api.token="123abc45de789f0" \
--solidatus.api.host="https://xyz-group.solidatus.com"
```

> The agent name `solidatus.agent.name` should be unique. Otherwise, the agent registration will fail if another agent exists with the same name.
