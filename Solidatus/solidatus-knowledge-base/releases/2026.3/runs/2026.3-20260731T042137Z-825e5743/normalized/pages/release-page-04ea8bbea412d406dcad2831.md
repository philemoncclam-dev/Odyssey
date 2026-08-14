# Agents

An **agent** is a visible representation in the Solidatus user interface of a connector process that runs outside of the core Solidatus application.

Agents allow you interact with active connector processes that wait for jobs and run them when they are triggered in Solidatus.

## Agents: essential facts

An agent is created in the [connectors interface](/connectors/connectors-overview/connectors-page) when a connector is first registered with a Solidatus host environment.

[Connector-specific documentation](/connectors/connector-specific-documentation) explains how to configure, register, and run jobs for each connector. But for all connectors, the first time the connector is run with a valid configuration, an [agent](/connectors/connectors-overview/agents) is created to represent it, owned by the user or service account that created the provided [agent token](/connectors/connectors-overview/users-and-tokens#agent-token). The agent then appears in the [connectors interface](/connectors/connectors-overview/connectors-page) of the account that owns it and only appears for other accounts when it is shared with them.

Each time the connector starts up after having been stopped, it registers itself again with the Solidatus host environment. When the connector process is up and running, icons in the interface mark it as *Active* and you can send jobs to be run by clicking the *Run* button in the [jobs list](/connectors/connectors-overview/connectors-page#list-of-jobs) or on the [Job Overview](/connectors/connectors-overview/jobs#job-overview). When the connector shuts down, it ‘unregisters’ with Solidatus. Solidatus marks the agent as *Offline*, and jobs cannot be run.

Agents must be configured with the information and permission credentials necessary to connect to the source technology and the Solidatus environment. These configurations are unique to each connector, so [connector-specific documentation](/connectors/connector-specific-documentation) must be consulted for specific steps.

Once an agent is registered, it can be shared with other users, who can be given specific [agent role permissions](/connectors/connectors-overview/users-and-tokens#agent-roles-and-permissions) that determined what they are able to do. With sufficient permissions, users can create individual [jobs](/connectors/connectors-overview/jobs) for the agent for each unique combination of source data structures to extract and specific Solidatus model to load into. For example, you might extract specific schemas or tables from the Data Warehouse database into a specific connector fork model, and then extract others into a different model via another job.

Solidatus provides an indication of the current availability for each connector via status icons on the [connectors interface](/connectors/connectors-overview/connectors-page), on the [Agent Overview](#agent-overview), and on the [Job Overview](/connectors/connectors-overview/jobs#job-overview):

<table data-header-hidden><thead><tr><th width="68.148193359375"></th><th width="104.224365234375"></th><th></th></tr></thead><tbody><tr><td>status-active</td><td><strong>Active</strong></td><td>The connector process is live and available for executing jobs.</td></tr><tr><td>status-offline</td><td><strong>Offline</strong></td><td>The connector process is not running, possibly because the agent was deactivated</td></tr></tbody></table>

{% hint style="info" %}
If you cannot distinguish the icon colour, hover the mouse over the icon and it will display the current status as text: "Active" or "Offline".
{% endhint %}

***

The [connectors interface](/connectors/connectors-overview/connectors-page) provides access to the agents and jobs you own or that were shared with you. If you own an agent or a job, you can use the [Agent Overview](#agent-overview) or [Job Overview](/connectors/connectors-overview/jobs#job-overview) to share and assign roles to other users who need to see those agents and jobs on their own accounts.

<figure><figcaption></figcaption></figure>

Click the name of an agent to open the [Agent Overview](#agent-overview), where you can create jobs and manage settings, or expand the entry for an agent using the expand arrow on the left-hand side of a row to see the list of existing jobs for that agent.

You can then click on the name of a job to open the [Job Overview](/connectors/connectors-overview/jobs#job-overview) for that job, where you can update the job's settings and configuration.

***

## Agent tokens

An API token is required to register every agent and must be supplied to the connector when it is registered. To replace a token, you must first [deactivate the agent](#deactivating-an-agent) and then register it again.

See [connector ownership, sharing, and permissions](/connectors/connectors-overview/users-and-tokens) to find out more about creating and managing tokens used by connectors.

***

## Create an agent

Agents cannot be created via the Solidatus user interface.They are created by the connector process itself when it is first run, typically via the command line. If the connector registration was configured correctly and it is successful, the agent then appears in the user interface.

Before you run the connector for the first time, you need to do the following:

| **Create a service account** *(Optional)* | Access to Solidatus is controlled using encrypted [API tokens](/connectors/connectors-overview/users-and-tokens#api-tokens) for the connector agent and its jobs - the job tokens apply to the models and/or forks created or updated by the connector. The tokens can be owned by ‘real people’ users or by [service accounts](/connectors/connectors-overview/service-accounts), synthetic accounts which have permissions and roles like any other user, but do not represent a real person. Solidatus recommends the use of Service Accounts to manage and run connectors and Webhook notifications. |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create an agent token**                 | The *agent token* allows the connector to communicate with a Solidatus host. The user that creates the token must have an Author licence for Solidatus, or be a Service Account created by such a user. *Note - the token will be encrypted in transit.* See [users and tokens](/connectors/connectors-overview/users-and-tokens) to find out more about managing users and tokens.                                                                                                                                                                                                                      |
| **Amend agent roles** *(Optional)*        | It is very likely that multiple users will need to be able to edit or execute an agent, or just keep an eye on the agent and its jobs, so you should allocate [agent roles](/connectors/connectors-overview/users-and-tokens#agent-roles) to those users.                                                                                                                                                                                                                                                                                                                                                |

## Agent Overview

The Agent Overview is the control centre for an agent that you own or has been shared with you.

From the Agent Overview, you can:

* view the agent configuration,
* share the agent with other users,
* change agent roles for other users,
* manage encryption,
* create, run, and monitor [jobs](/connectors/connectors-overview/jobs).

Note that the options visible to you on the Agent Overview depend on the [agent role](/connectors/connectors-overview/users-and-tokens#agent-roles-and-permissions) you have, which is set by the owner of that agent. See the [connector ownership, sharing, and permissions](/connectors/connectors-overview/users-and-tokens) page for details of the permissions corresponding to the available agent roles.

### Summary tab

The `Summary` tab presents information about the agent, including a summary of job statuses, the agent description and configuration, and users or Groups the agent has been shared with. The status of a job indicates whether it has been able to access the data source, collect relevant data, and update the target model.

Summary tab for an agent

{% hint style="warning" %}
The description and configuration specification cannot be edited via the user interface, they are supplied by the connector when it is registered.
{% endhint %}

### Jobs tab

The `jobs` tab allows you to work with the jobs defined for an agent (you can only see the jobs that you own or have been shared with you). The status of a job indicates whether it has been able to access the data source and collect relevant data.

Jobs tab for an agent

| Hover over a job to see the actions available for that job (these are the same as those on the [connectors page](/connectors/connectors-overview/connectors-page)). The buttons available to you depend on your [agent role](/connectors/connectors-overview/users-and-tokens#agent-roles-and-permissions) and [job role](/connectors/connectors-overview/users-and-tokens#job-roles-and-permissions). | second |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |

### Settings tab

The `Settings` tab allows you to edit some of the information about the agent, view the agent configuration, set roles permissions, manage the encryption key, and delete the agent.

The `Settings` tab is only available for agent owners.

{% hint style="warning" %}
The description and configuration cannot be edited via the user interface; these are supplied by the connector when it is registered. See [connector-specific documentation](/connectors/connector-specific-documentation) for information on how to set these when registering the agent.
{% endhint %}

#### **Information section**

The `Information` section enables you to view the name and description of the agent.

Information section of the Settings tab for an agent

#### **Configuration section**

The `Configuration` section enables you to view the specification and configuration of the agent.

Configuration section of the Settings tab for an agent

#### **Permissions section**

The `Permissions` section plays an important role in collaboration. This is where you share the agent and assign or remove roles and their associated permissions.

When checking what capabilities a user has for an agent, Solidatus takes the union of all capabilities provided to them, whether assigned directly to a user or to one or more Groups that a user is a member of. The checkbox called `Show inherited roles` enables you to see the most privileged role each user has for an agent.

See [agent roles](/connectors/connectors-overview/users-and-tokens#agent-roles) for a list of assignable roles and their associated permissions.

Permissions section of the Settings tab for an agent

#### **Encryption section**

The `Encryption` section enables you to view and edit the encryption key for the agent.

Encryption section of the Settings tab for an agent

#### **Advanced section**

The `Advanced` section enables you to deactivate and delete the agent. To delete an agent, you must first deactivate it.

If the agent is active, only the **Deactivate** button appears. If it is offline, only the **Delete** button appears.

Advanced section of the Settings tab for an agent

## Prevent a connector from running

A job cannot be executed if a connector agent is offline. Therefore, to prevent jobs from running against a connector, you must de-activate the agent. If you don't want an offline agent to appear in your list anymore, you can delete the agent.

### Deactivate an agent

An agent must be deactivated before being deleted, and before re-registering the connector.

An owner can deactivate an agent via the Settings tab on the [Agent Overview](#agent-overview).

If an agent is deactivated, the status is shown as *Offline* no jobs can be submitted via the user interface. Any jobs submitted via an external scheduler will fail. The history of job runs is not affected.

Jobs can be created and edited while the agent is offline, but they cannot be executed.

### Delete an agent

An Owner can delete an agent via the Settings tab on the [Agent Overview](#agent-overview). **You must de-activate the agent before deleting it.**

Deleting an agent will also delete all jobs and job runs. There is no impact on any prior model changes saved by the agent.

## Amend or upgrade an agent

The name, description, and configuration for an agent cannot be amended via the user interface; they can only be amended by re-registering the connector using the [connector-specific](/connectors/connector-specific-documentation) instructions supplied with the connector. **You must deactivate the agent before re-registering it.**

You must also deactivate an agent before [installing a new version of the connector](/connectors/connectors-overview/upgrade-connector-version).
