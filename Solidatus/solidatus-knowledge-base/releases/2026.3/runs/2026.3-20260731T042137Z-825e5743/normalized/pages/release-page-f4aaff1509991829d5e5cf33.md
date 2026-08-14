# Jobs

A job is an individual, executable action performed by a connector [agent](/connectors/connectors-overview/agents).

## Jobs: essential facts

Job runs typically involve four high-level stages:

* **scanning** external source metadata,
* **extracting** the requested metadata from the source,
* **interpreting** and **transforming** source metadata into model data,
* **loading** transformed metadata into a model.

A **job configuration** provides the information needed to describe and access the source to extract from and the target model to import into for an individual job run.

For example, a job is created for the `JDBC connector` agent, providing the information necessary for the connector to extract information from the Data Warehouse Oracle database schema, into a fork of the **Data Warehouse database** model.

Each time a job is executed, a new [job run](#job-run-overview) record is created to store the results of the job and provide a snapshot of the configuration at the time of execution.

{% hint style="warning" %}
Solidatus recommends that you always target connector jobs at forks of models, instead of updating an original atomic model directly. This allows you to utilise our collaboration features, such as the [Approvals workflow](/models/share-and-collaborate/approvals-workflow), to ensure the output of connectors is reviewed before making into a trusted model.

Once you've established a working, automated approach to connectors, you can change the settings for the fork and the parent model to enable changes to flow automatically through a series of composite models.

All of this information about model types and their function within a connector-led workflow is covered in our [best practice](broken://pages/R7g0IQKsUZQOdZ3ZD5m2) section, particularly the page on [model topology](/solidatus-best-practice/model-topology).
{% endhint %}

***

## Connectors interface: list of jobs

The [connectors interface](/connectors/connectors-overview/connectors-page) displays a list of the agents and jobs available to you. You can also see a list of the jobs for an agent on the [Agent Overview](/connectors/connectors-overview/agents#agent-overview).

<figure><figcaption></figcaption></figure>

***

## Job steps diagram

Creating and running a job requires the following steps, which are described below. The coloured boxes illustrate the changes in the state of the job:

Job steps

## Generate a job token

An API token is required for every job to provide permissions necessary for the job to create or update model(s) in Solidatus.

Tokens inherit access permissions of the users that create them. As a result, the user that creates them must have at least Author access to every model that is to be updated by a job.

The token must be supplied in the job configuration before the job can run. See [connector ownership, sharing, and permissions](/connectors/connectors-overview/users-and-tokens) to find out more about managing users and tokens.

## Create a job

There are three ways to create a job:

| **Create job** and supply all configuration details          | Click the `Create job` button on the [Agent Overview](/connectors/connectors-overview/agents#agent-overview), or click on the `+` button next to the name of an agent on the [connectors page](/connectors/connectors-overview/connectors-page)                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clone** an existing job and edit the configuration details | Click the `Clone` button on the [Job Overview](#job-overview). You will not be able to see the `Clone` button unless you have permission to update the agent.                                                                                                                                                                                |
| **Export** an existing job and then **Import** it            | Click the `Export` button on the [Job Overview](#job-overview) to export the job details to a JSON-format file, then click the `Import job` button on the [Agent Overview](/connectors/connectors-overview/agents#agent-overview). There are [constraints](#export-and-import-limitations) to be aware of when exporting and importing jobs. |

### Job export and import constraints

Jobs can only be exported and imported individually; you cannot export or import multiple jobs at once.

When importing a job from a JSON file, there are two conditions that must be met:

* the values for *connectorAgentRegistrationName* and *connectorAgentRegistrationType* **must match** the name and type for the agent
* the value for *name* **must not match** the name of an existing job owned by the agent

When you export a job, the values of any encrypted fields (such as the [job token](/connectors/connectors-overview/users-and-tokens#job-token)) are not included - you will need to supply them again after importing the job.

### Configure a job

You can configure a job by filling out the [configuration section](#configuration-section) in the [Settings tab](#settings-tab) of the [Job Overview](#job-overview).

Most connectors allow you to fill in the configuration manually or using a wizard that takes you through a series of logical steps.

Each connector requires unique information to be supplied in the job configuration to complete a successful job run. Typical information that needs to be supplied includes:

* The specific source within the system that you wish to extract,
* The model that you want to import into,
* Login credentials for permission to access sources,
* API tokens

#### Upload source files

Some Solidatus connectors are file-based, meaning they do not use an external API to access source metadata, instead they read one or more individual files. For example, the *Erwin Connector* reads and imports from a single *Erwin Data Modeller* XML file.

Before running such a connector via the user interface, you must upload the source file(s) as part of the job configuration settings. You can drag a file into the settings page or navigate to the file.

When the job runs, the agent downloads it from Solidatus for processing.

The type and number of files that can be uploaded is under the control of the developer of the connector. For example, one connector may allow you to upload one or several separate files, and another may allow you to submit one file of a given type or a .zip file containing many such files.

The following image shows part of the configuration wizard for the *Alteryx* connector.

<figure><figcaption><p>A typical file upload option</p></figcaption></figure>

The following image shows a file that has been uploaded. To replace this file, click the **cross** to remove the file from Solidatus, then choose a replacement file.

<figure><figcaption><p>A file has been uploaded</p></figcaption></figure>

{% hint style="info" %}
Solidatus does not attempt to validate files that you upload; the connector provides error messages in the Job Run Overview if it encounters any issues.
{% endhint %}

## Edit a job

The [Job Overview](#job-overview) enables you to share a job with other users and also to edit the [job configuration settings](#settings-tab). For example, you might want to [upload or replace a source file](#uploading-source-files), re-run a configuration wizard, or change the target model.

{% hint style="success" %}
All validation of the job configuration is carried out by the connector at run time, not via the user interface (see the [Job Run Overview](#job-run-overview) for error messages).
{% endhint %}

## Run a job

Visit our separate page on [running a job](/connectors/connectors-overview/running-a-job) for detailed information.

## View the results of a job

The status of a job is shown next to the job's name in the jobs list. It indicates whether the job was able to access the data source and collect relevant metadata.

When a job is run, its status in the jobs list or on the Job Overview changes from `Submitted` to `Running`. When it is finished, it changes to `Success` or `Error` if it has not been able to complete the job.

To view the results of a successful job, open the model that the job was targeted to update.

## Job Overview

The Job Overview is the control centre for a job that you own or that was shared with you. This is where you view and edit the job configuration, share the job with other users, change job permissions for other users, and execute and monitor the job.

Click the `Run Job` button to submit and run the job (see [running a job](/connectors/connectors-overview/running-a-job) for more information).

Click the `Clone` button to create an exact copy of the job within the agent for you to rename and amend (see [creating a job](#creating-a-job)).

Click the `Export` button to export the job details to a JSON file which can be edited and then imported (see [creating a job](#creating-a-job)).

### Summary tab

The Summary tab provides a comprehensive set of information about a job, including the Run history.

<figure><figcaption></figcaption></figure>

### Run History tab

The Run History tab gives access to the details of every time the job has been run, allowing you to compare run times and the number of models affected by each Run - click on an entry to open the [Job Run Overview](#job-run-overview).

<figure><figcaption></figcaption></figure>

### Settings tab

The `Settings` tab allows you to edit some of the information about the job, to edit the configuration, to set permissions, and to delete the job. The tab is only available for job owners.

#### **Information section**

The `Information` section enables you to edit the name and description of the job.

Settings tab for a job

#### **Configuration section**

The `Configuration` section is where you can fill in the job configuration, which provides the details required by the connector to complete a full sequence of extraction, transformation, and loading into a Solidatus model.

Details in a job configuration typically include, for example, credentials needed to access the data source, an API token, customisation options, and location and identification of content to extract. The exact information required varies for each connector (see [connector-specific documentation](/connectors/connector-specific-documentation) for details).

Click the `Edit` button at the top right to edit the job configuration: you can choose to edit the values manually or use the wizard to take you through the options step-by-step. The wizard and the available options are managed by the connector.

{% hint style="warning" %}
The configuration wizard is only available if the connector is *Active*.
{% endhint %}

The top part of the configuration provides settings specific to the connector for the s*ource* you are extracting from (for example, the database you are extracting from). The image below shows the settings for the JDBC connector: it specifies the use of the driver `Oracle 12` to extract Tables and Views from six selected schemas in a database.

Connector-specific settings for a job

{% hint style="info" %}
For file-based connectors, you need to [upload one or more source files](#uploading-source-files) in the job configuration.
{% endhint %}

The second part of the configuration provides common settings for Solidatus (the *target* of the job run). The minimum you must supply are: Solidatus host URL, API token, and name of model you are going to update.

<figure><figcaption></figcaption></figure>

{% hint style="warning" %}
When the job runs, Solidatus looks for a model (and fork, if required) with the name defined in the configuration that is owned by or shared with the user that owns the [job token](/connectors/connectors-overview/users-and-tokens#job-token). If the specified model and/or fork do not exist, **the job creates them** when it runs.
{% endhint %}

#### **Permissions section**

The `Permissions` section plays an important role in collaboration: this is where you assign and remove permissions for the job. When checking what capabilities a user has on a job, Solidatus takes the union of all capabilities provided to them, whether assigned directly to that user or to one or more groups that the user is a member of. The checkbox called `Show inherited roles` enables you to see the most privileged role each user has on the job.

See also [job roles](/connectors/connectors-overview/users-and-tokens#job-roles).

<figure><figcaption></figcaption></figure>

#### **Advanced section**

The `Advanced` section enables you to delete the job.

<figure><figcaption></figcaption></figure>

### Job Run Overview

Clicking an entry for a job in the Run History tab opens the overview for that specific job run. The overview tells you when the job ran, provides progress messages if the job is still running, failure reasons if required, links (subject to your permissions) to the model(s) updated by the job run, and a snapshot of the job configuration that was used.

<figure><figcaption></figcaption></figure>

### Change summary

If the job run is successful, you can see which models were affected by the job run by expanding the *Change summary* section.

The change summary provides links to the affected models if the current user has the necessary permission.

<figure><figcaption><p>Job run viewed by user with limited permissions</p></figcaption></figure>

In the example shown above, the user *Doc John* was able to execute the job, but the current user does not have access to either the agent or the models created by the job:

> * Agent name is shown as “Unnamed agent”
> * The name of the model (*DW Fork*) updated by the job is not a link.

In the example below, the job created a model, then created a fork, then populated the second revision of the fork with the metadata extracted from a database.

| The *Data Warehouse schema model* will be empty - all the imported content is in the fork. The next action would be to review the contents of the fork, then submit a [pull request](/models/share-and-collaborate/activities-and-activity-types/pull-requests). You should also consider setting up [approvals](/models/share-and-collaborate/approvals-workflow) in the model **before** submitting the Pull Request. | [second](https://demo.solidatus.com/help/_images/change-summary.png) |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |

### If the job failed

Error messages are returned by the connector and displayed on the [Job Run Overview](#job-run-overview).

Errors typically result from issues with the job configuration or permissions. See [connector-specific documentation](/connectors/connector-specific-documentation) for configurations required for each connector or for troubleshooting connector errors.

<figure><figcaption></figcaption></figure>
