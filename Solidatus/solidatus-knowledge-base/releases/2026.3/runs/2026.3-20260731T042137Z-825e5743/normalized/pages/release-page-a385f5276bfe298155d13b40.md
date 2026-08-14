# Upgrade a connector

{% hint style="warning" %}
**!WARNING!**

Please read the connector release notes carefully before starting an upgrade to be aware of potential breaking changes.

Please read ALL the release notes, from the currently deployed version (exclusive) to the new version to be deployed (inclusive).
{% endhint %}

The following instructions explain two methods for upgrading a connector to a newer version: [the quicker method](#upgrade-an-existing-connector-agent-quickest) and [the safer method](#create-a-new-connector-agent-safest).

The two methods differ in that the quicker method replaces the old connector agent with the new version, while the safer method maintains the old version alongside the newer version, making reversion easier if problems arise while the new version is tested.

## Prerequisites

These instructions imply that you:

* Have access to the connector executable and dependant files
* Have access to the agent configuration file

## Access the new connector version

* Navigate to the connectors portal to find the latest version of the connector to be upgraded.
* Download the latest version of the connector.
* Save the connector onto your virtual machine (VM) through your method of choice.
* Extract the zipped connector files into a folder on the VM. It's good practise to maintain a hierarchy of `CONNECTOR_NAME/CONNECTOR_VERSION/EXECUTABLE` to keep files manageable.

## Method 1: replace the existing agent (quicker)

The following instructions entail replacing an existing connector with the upgraded version.

This method is the quickest way to upgrade a connector, but it requires reverting to the older version of the connector if it needs to be used for any reason. The "safer method" maintains both versions reverting is not required.

1. Locate the existing directory where the connector agent is deployed.
2. Locate the existing configuration file for the connector. If no configuration file is available, please contact a team member as it is likely that the connector was deployed using direct command line arguments.
3. Find the process currently running the connector agent and terminate it.
   1. If the connector agent is in an available terminal window, use Ctrl-C to terminate the agent. It should disconnect from Solidatus, and it's corresponding availability icon should turn red.
   2. If the connector agent is running in the background, use a command such as `ps ax |grep java` to isolate it, and `strace -p $!` to check the background process logs. This way you can verify you'll shutdown the right connector agent.
4. Run the new connector binary with the same agent configuration as the old one. This may look similar to `java -jar solidatus-java-connector-1.0.60.jar --spring.config.additional-location=config.yml`.
5. The connector should run correctly and come back online, ready to be used, in the Solidatus UI.

## Method 2: create a new connector agent (safer)

The following instructions involve upgrading an existing connector while retaining the old version. This should result in two connector agents, where one is the original agent and version and the other is the new agent and version with all jobs transferred over.

The benefit of this is you can use the old version of the connector at any time before sunsetting it. However, the process for upgrading may take longer and require more resources.

This method also requires exporting jobs from the old connector and re-importing them to migrate them to the new connector. Instructions for [migrating jobs](#migrate-jobs-to-the-new-connector-version) are provided in the following section.

To upgrade to a new connector version:

1. Locate the existing directory where the connector agent is deployed.
2. Locate the existing configuration file for the connector. If no configuration file is available, please contact a team member as it is likely that the connector was deployed using direct command line arguments.
3. Duplicate the configuration into a new folder, where you can run a second agent.
4. Open the configuration file.
5. Update the connector agent name. This should reflect the name of the new version. If the old connector agent was called `Java-Connector-1.0` then a new name of `Java-Connector-1.1` would be appropriate.
6. Replace/update the description in the new version of the configuration.
7. Run the connector agent, using the new configuration file. This might look similar to `java -jar solidatus-java-connector-1.0.60.jar --spring.config.additional-location=config.yml`.
8. The connector should run correctly and come back online in the Solidatus UI. Look for the green *Active* symbol to verify the agent is available and online.
9. Reimport the jobs you previously exported using the `Import Job` button.
10. Run the job and compare the output versus the old connector. Verify everything in the model looks as expected.
11. Sunset the previous connector version when ready.

## Migrate jobs to the new connector version

While jobs are automatically transferred to the new connector version through the quicker method, this does not happen automatically using the safer method.

If you use the safer method, you should migrate jobs from the agent representing the old version to the agent representing the new version. Migrating jobs involves first exporting them from the old agent, then reimporting them into the new agent.

Jobs are exported as JSON files that contain the job configuration and all other necessary metadata.

There are a few constraints on exporting and importing jobs that you should be aware of:

1\) You can only export and import jobs individually; it isn't possible to export and import multiple jobs at once.

2\) When importing a job from a JSON file, there are two conditions that must be met:

* the values for *connectorAgentRegistrationName* and *connectorAgentRegistrationType* **must match** the name you gave to the new agent when you registered it and the type of the new agent. Therefore, you may have to manually update these values in the exported JSON file **before importing**
* the value for *name* in the exported JSON file **must not match** the name of an existing job owned by the agent

3\) When you export a job, the values of any encrypted fields (such as the [job token](/connectors/connectors-overview/users-and-tokens#job-token)) are not included in the exported JSON file; you will need to supply them again **after importing** the job.

### Job migration steps

1\) Export existing jobs from the old agent in one of three ways:

* Go to the **Jobs** tab on the main connectors interface page and select **Export** next to the appropriate job.

<figure><figcaption></figcaption></figure>

* Alternatively, open the Job Overview of a job you want to export by clicking its name in the list, then select the **Actions** menu, and finally select **Export**.



* Alternatively, from the old agent's Agent Overview, hover your mouse over the middle of the row of a job in the Jobs tab, then select the **Export** button.

<figure><figcaption></figcaption></figure>

2\) Open the exported job JSON file in a text editor and update the `connectorAgentRegistrationName` value to match the new agent’s name.

3\) To import the job, navigate to the new connector agent's Agent Overview, click **IMPORT JOB,** then select the exported and updated job configuration file.

<figure><figcaption></figcaption></figure>

4\) Once the job imports successfully, update the job token in the job configuration. The values of any encrypted fields (such as the [job token](https://docs.solidatus.com/connectors/connectors-overview/users-and-tokens#job-token)) are not included in a job export, so these will need to be supplied again after importing the job.

To update the job token:

* navigate to the Job Overview of the job (click the job's name in the list of jobs),
* select the **Settings** tab,
* select the **Configuration** section,
* then select **EDIT** at the top left of the job configuration and choose to edit either manually or using the wizard,
* Find the job token field in the configuration and enter a valid API token with the necessary capabilities and permissions.

5\) In addition, please note that in the job configuration, the job `name` must be unique and cannot match the name of an existing job owned by the agent.
