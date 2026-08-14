# Connectors interface

The connectors interface acts as a cockpit for managing, executing, and monitoring connector [agents](/connectors/connectors-overview/agents) and [jobs](/connectors/connectors-overview/jobs). The interface shows only agents and jobs that you own or that have been shared with you.

<figure><figcaption></figcaption></figure>

The connectors interface comprises two main areas:

* [List of agents](#list-of-agents) - allows you to view, access, and manage agents available to you
* [List of jobs](#list-of-jobs) - allows you to view, access, and manage connector jobs available to you

### Access the connectors interface

Click the **CONNECTORS** in the top navigation bar.

If there are no connectors available to you (you haven't registered any and there aren't any shared with you), the list of available connectors appears instead of the list of agents.

### List of agents

The default view contains a list of agents, which you can filter by the type of connector (in this case, the *JDBC* and *Solace-EP* connectors). The most recently-accessed agent is at the top of the list.

<figure><figcaption></figcaption></figure>

Each agent represents a connector process that is running outside of Solidatus; the status of each connector is indicated by a red or green icon:

<table data-header-hidden><thead><tr><th width="73.1016845703125"></th><th width="100.3038330078125"></th><th></th></tr></thead><tbody><tr><td>status-active</td><td><strong>Active</strong></td><td>The connector process is running</td></tr><tr><td>status-offline</td><td><strong>Offline</strong></td><td>The connector process is not running, possibly because the agent was <a href="/pages/51HJNvgnkdCgjYzBQy3J#deactivate-an-agent">deactivated</a>.</td></tr></tbody></table>

{% hint style="info" %}
If you cannot distinguish the icon colour, hover the mouse over the icon and it will display the current status as text - ‘Active’ or ‘Offline’.
{% endhint %}

The connectors status icons also appear on the [Agent Overview](/connectors/connectors-overview/agents#agent-overview) and the [Job Overview](/connectors/connectors-overview/jobs#job-overview).

Click on the triangle to the left of the status icon to expand the agent and view the list of jobs for the agent.

Hover over a job to see available actions. All actions are also available on the list of jobs and on the [Job Overview](/connectors/connectors-overview/jobs#job-overview). See the [jobs](/connectors/connectors-overview/jobs) page for more information about these actions.

<figure><figcaption></figcaption></figure>

***

Click the `Run` button to submit and run a job. The video below shows how the status changes as the job runs, from `Submitted`, to `Running`, then to `Success`.

<figure><figcaption></figcaption></figure>

***

Click the job name to open the [Job Overview](/connectors/connectors-overview/jobs#job-overview). From here you can open any job run to examine the results.

If you run a job from the Job Overview, the sequence of operations a connector has completed and is in the process of performing are shown as a job is running.

### List of jobs

Click the `Jobs` tab to display the list of every job you have access to (the most recently-accessed job is at the top of the list).

<figure><figcaption></figcaption></figure>

<table data-header-hidden><thead><tr><th width="474.0338134765625"></th><th></th></tr></thead><tbody><tr><td><p>Hover over a job to see the actions available for that job. These are the same as those on the <a href="/pages/51HJNvgnkdCgjYzBQy3J#agent-overview">Agent Overview</a>: export job, edit job configuration, clone job, and delete job.</p><p>You can also search the list by keyword and filter it by connector type or job status using the FILTERS button at the top right of the list.</p></td><td>second</td></tr></tbody></table>
