# Running a job

To run a job you need at least *Execute* permission for the job. To see the level of permission you have for a job, go to the `Summary` tab on the [Job Overview](/connectors/connectors-overview/jobs#job-overview).

Before you run a job for the first time, you **must** fill in the job configuration, which provides information about the data source and target model for the connector. You can do this via the [Settings tab](/connectors/connectors-overview/jobs#settings-tab) tab on the [Job Overview](/connectors/connectors-overview/jobs#job-overview). You might also need to amend the settings from time to time, perhaps to [supply an updated source file](/connectors/connectors-overview/jobs#uploading-source-files).

{% hint style="info" %}
All validation of a job configuration is carried out by the connector, not by the Solidatus application.
{% endhint %}

There are two ways to run a job via the user interface:

<table data-header-hidden><thead><tr><th width="129.6324462890625"></th><th></th></tr></thead><tbody><tr><td><a href="#method-1">Method 1</a></td><td>Click the <code>Run job</code> button on the <a href="/pages/6Z4tHFOcpAhGfKSuXHw9#job-overview">Job Overview</a></td></tr><tr><td><a href="#method-2">Method 2</a></td><td>Click the <code>Run</code> button alongside the job name on in the <a href="/pages/yS889JT7HdsyKnlBpodc#list-of-jobs">list of jobs</a>.</td></tr></tbody></table>

{% hint style="success" %}
See also [Creating a job](/connectors/connectors-overview/jobs#creating-a-job) and the [Settings tab](/connectors/connectors-overview/jobs#settings-tab).
{% endhint %}

## Method 1: via the Job Overview

The best way to run a job is by clicking on the `Run job` button on the [Job Overview](/connectors/connectors-overview/jobs#job-overview). The reason this is preferred is that the Job Overview shows the individual stages of a job run as they are in progress and completed, allowing you to track and monitor them.

When you execute a job run, a new entry appears in the list of runs. Click the entry to watch the status messages appear and to view the results after the job completes.

The job status changes as the job runs, from `Submitted`, to `Running`, then to `Success` or `Error`.

Once the job completes, you can read any error messages or access the updated model(s) (see [viewing the results of a job](#seeing-the-results)).

<figure><figcaption><p>Monitor a job while it runs (you will need to refresh the screen to see the change summary)</p></figcaption></figure>

The change summary provides links to the updated models if the current user has the necessary permission.

<figure><figcaption><p>Job Run viewed by user with limited permissions</p></figcaption></figure>

In the example above, the user *Doc John* was able to execute the job, but the current user not have access to either the agent or models created by the job. This is indicated in the UI:

> * The agent name is shown as “Unnamed agent”
> * The name of the model (*DW Fork*) updated by the job is not a link.

In the example below, the job created a model, then created a fork, then populated the second revision of the fork with the metadata extracted from a database.

| The *Data Warehouse schema model* will be empty: all imported content is in the fork. The next action would be to review the contents of the fork, then submit a [pull request](/models/share-and-collaborate/activities-and-activity-types/pull-requests) to merge the fork into its parent atomic model. You should also consider setting up [approvals](/models/share-and-collaborate/approvals-workflow) in the model **before** submitting the pull request. | second |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |

## Method 2: via the list of jobs

You can also run a job by clicking the `Run` button alongside the job name on the list of agents or the list of jobs on the [connectors page](/connectors/connectors-overview/connectors-page), or on the list of jobs in the [Agent Overview](/connectors/connectors-overview/agents#agent-overview). On the list of agents, you will have to expand an agent to see the list of jobs you have access to.

<figure><figcaption><p>Monitor a job while it runs</p></figcaption></figure>

* If the job that you need to run is not visible, you need to contact the owner of the job to share the job with you — make sure you are given at least *Execute* role permissions.
* If the `Run` button does not appear alongside the name of the job, you likely only have *Viewer* access, which does not give permission to execute the job. Contact the owner of the job to give you at least *Execute* permission.

## View the results of a job

The status of a job can be seen on the list of agents or the list of jobs on the [connectors page](/connectors/connectors-overview/connectors-page), and on the [Job Overview](/connectors/connectors-overview/jobs#job-overview). To see error messages, progress messages, and the change summary for a job Run, you will need to open an entry in the `Run History`, which is in the [Job Run Overview](/connectors/connectors-overview/jobs#job-run-overview).

When a job is finished, a new revision is created for the model updated by the job.

* The job is listed as the author of that revision on the *Revision* tab of the model's Model Overview. If you have access to them, you will see links to the agent, job, and job run.
*

```
<figure><figcaption><p>Links to the agent, job and job run</p></figcaption></figure>
```

* The job is also listed as a **contributor** on the *Summary* tab of the Model Overview of the updated model.

<figure><figcaption></figcaption></figure>

## Troubleshoot a job error

Error messages are returned by the connector and displayed on the [Job Run Overview](/connectors/connectors-overview/jobs#job-run-overview). See the connector documentation for more information.

<figure><figcaption><p>Why did the job fail?</p></figcaption></figure>
