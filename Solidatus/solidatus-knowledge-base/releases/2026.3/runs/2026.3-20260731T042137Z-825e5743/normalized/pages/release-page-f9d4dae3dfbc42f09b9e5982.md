# Agent mode

Running the Legacy Mainframe Connector in Agent mode will set up the Connector to wait and receive jobs sent to it. To submit a job go to the Connectors Dashboard, create a job with a specified configuration and submit. Once the job is completed the final model will appear in the Model List. For a full demonstration of Connector Agent mode see your hosted Solidatus site documentation page `/help/connectors`.

Using the configuration wizard allows you to validate the file options for the Legacy Mainframe Connector.

Running the connector in agent mode requires setting the `--spring.profiles.active='agent'`.

Along with this the only required configuration options are:

`--solidatus.api.host`

`--solidatus.api.token`

`--solidatus.agent.name`

Setting these options will set up the connector in agent mode connected to the Solidatus instance which allows configuring and running jobs through the Solidatus UI.

### Example

To run the Connector agent a script similar to the following would be run. This agent will continue running while jobs are sent to it.

```bash
java -jar solidatus-legacy-mainframe-connector.jar \
--spring.profiles.active="agent" \
--solidatus.api.host={SOLIDATUS_HOST_ADDRESS} \
--solidatus.api.token={SOLIDATUS_TOKEN} \
--solidatus.agent.name="Legacy Mainframe Connector" \
--solidatus.agent.type="legacy-mainframe" \
--solidatus.agent.description="Solidatus Legacy Mainframe Connector"
```

### Screenshot Walkthrough

1.

2\.

3\.

4.
5.
6.
7.
8.

Once the job has completed, a model will be created (or updated) with the contents of the connector run.
