# Solidatus administration

Solidatus Administrators have access to additional features for managing a Solidatus environment via the `Admin` page.

To open the Admin page, click the `Admin` button on the [the navigation bar](/the-user-interface/the-navigation-bar). Note that you will be able to see this button if you have an *Admin* or *Author-Admin* licence or the *Site Admin* role. These are typically granted by another admin user or, if you are the sole admin user, these are granted when the environment is first activated.

{% hint style="info" %}
In your organisation, licence names (apart from *Site Admin*) might vary from the terms used here. See the [Licence](#licence) section for more information.
{% endhint %}

## Admin interface

A Solidatus licence grants a number of capabilities to each user registered with it. Many features in the [Admin toolbar](#the-admin-toolbar) will only be available if your licence includes a specific admin capability. Note that a *Site Admin* has all admin capabilities.

The Admin page has three parts:

1. A blue bar at the top, providing access to actions for the current page
2. A selectable list of pages in a sidebar along the left side of the page
3. Content related to the current page in the main window

<figure><figcaption><p>The structure of the Admin page</p></figcaption></figure>

To use the individual pages and their features, the required admin capabilities are:

<table data-header-hidden><thead><tr><th width="166.7864990234375"></th><th></th></tr></thead><tbody><tr><td><strong>Admin page</strong></td><td><strong>Required capability</strong></td></tr><tr><td><a href="#users">Users</a></td><td><code>ViewUsers</code></td></tr><tr><td><a href="#groups">Groups</a></td><td><code>ManageGroups</code></td></tr><tr><td><a href="#service-accounts">Service Accounts</a></td><td><code>ViewServiceAccounts</code></td></tr><tr><td><a href="#log">Log</a></td><td><code>ViewLogs</code></td></tr><tr><td><a href="#console">Console</a></td><td>always shown (though individual commands will require specific capabilities)</td></tr><tr><td><a href="#licence">Licence</a></td><td><code>ManageLicence</code></td></tr><tr><td><a href="#config">Config</a></td><td><code>ViewConfig</code></td></tr><tr><td><a href="#statistics">Statistics</a></td><td><code>ViewStatistics</code></td></tr><tr><td><a href="#dataops">DataOps</a></td><td><code>ManagaDbOps</code></td></tr><tr><td><a href="#events">Events</a></td><td><code>ViewStatistics</code> (requires <code>AuditEvents</code> to be enabled in the feature configuration)</td></tr><tr><td><a href="#search">Search</a></td><td><code>ViewSearchState</code> (requires either <code>Search</code> or <code>Dashboards</code> to be enabled in the licence feature section)</td></tr></tbody></table>

### The admin sidebar

<table data-header-hidden><thead><tr><th width="285.81640625"></th><th></th></tr></thead><tbody><tr><td><a href="#users">toolbar-users</a></td><td>The <a href="#users">Users</a> tab is the default feature presented when accessing the Admin page. Presents a sortable and filterable list of users, allowing an administrator to create and remove users, and change their password, primary licence, and authentication method.</td></tr><tr><td><a href="#groups">toolbar-groups</a></td><td>The <a href="#groups">Groups</a> tab provides a sortable and filterable list of all Groups in the Solidatus instance, allowing an administrator to access (and edit) every Group in Solidatus.</td></tr><tr><td><a href="#service-accounts">toolbar-service</a></td><td>The <a href="#service-accounts">Service Accounts</a> tab lists all Service Accounts and provides the same capabilities for managing them as are available to the users that created the Service Accounts.</td></tr><tr><td><a href="#log">toolbar-log</a></td><td>The <a href="#log">Log</a> tab presents a list of informative messages of interest, which can be simply useful information, warning messages, debug messages, error messages, or fatal messages.</td></tr><tr><td><a href="#console">toolbar-console</a></td><td>The <a href="#console">Console</a> tab enables you to execute a number of different commands for users and Models.</td></tr><tr><td><a href="#log">toolbar-licence</a></td><td>The <a href="#licence">Licence</a> tab displays information about the licenced capabilities in a Solidatus instance.</td></tr><tr><td><a href="#config">toolbar-config</a></td><td>The <a href="#config">Config</a> tab provides a read-only view of the configuration file, which controls and restricts the technical capabilities of Solidatus</td></tr><tr><td><a href="#statistics">toolbar-stats</a></td><td>The <a href="#statistics">Statistics</a> tab gives you insights into what’s happening in Solidatus, including textual and graphical information. You can also create a Solidatus Model that illustrates the dependencies between licences, users, Groups, and Models.</td></tr><tr><td><a href="#dataops">toolbar-dataops</a></td><td>The <a href="#dataops">DataOps</a> tab allows you to lock Solidatus, preventing all access.</td></tr><tr><td><a href="#events">toolbar-events</a></td><td>The <a href="#events">Events</a> tab presents detailed information about technical events in Solidatus.</td></tr><tr><td><a href="#search">toolbar-search</a></td><td>The <a href="#search">Search</a> tab allows you to control the Search feature, if enabled.</td></tr></tbody></table>

Most lists presented in the admin pages can be filtered and sorted, but the actual methods vary between pages.

For example, the list of service accounts can be sorted by clicking headings or up/down arrows, and filtered by typing in the search box.

<figure><figcaption></figcaption></figure>

On the Users page, you can filter and sort the list of users using a dialog with a menu of options.

<figure><figcaption></figcaption></figure>

## The Site Admin role

For some users listed on the Users page, you will find a `Site Admin` tag displayed next to the user’s licence. This indicates that the user has been assigned the Site Admin role.

<figure><figcaption></figcaption></figure>

The Site Admin role is an administrative role in Solidatus. It grants administrative capabilities to manage users and configurations, but does not grant any capabilities inside the application.

The Site Admin role is not a licence role, meaning the number of registered users that can be assigned the role is not restricted. Site Admins also do not have to be assigned a Solidatus licence.

{% hint style="success" %}
While the number of Site Admins is not restricted, for security we recommend following the principle of least privilege: assign as few Site Admins as necessary and only to users who understand and need administrative capabilities.
{% endhint %}

The Site Admin role can only be assigned or removed by another Site Admin. Each Solidatus instance is initially set up with one Site Admin who can then assign the role to others, who are then able to remove the role from the original Site Admin.

#### **Site Admin capabilities**

* Access the Admin page
* View logs, configurations, and statistics
* View and manage users, groups, and licences
* Manage DataOps
* View and manage agents, jobs, and service accounts
* View, manage, and execute Elastic Search queries
* Manage Models
* Access the Solidatus API

## Users

A user is a ‘real person’ that has been granted access to Solidatus - not to be confused with [Service Accounts](#service-accounts), which do not represent real people. Each user is assigned a licence within Solidatus; the capabilities of licence types are listed in the [Licence](#licence) tab and are governed by licence agreements with Solidatus.

A user’s licences can be changed (or completely removed), and they can also be disabled or deleted. Each licence allocated will require a licence.

The *Users* tab provides a sortable and filterable list of all users in the Solidatus instance. By default it shows all users that have every logged in - use the button on the blue bar at the top to show those users that have been invited but have not yet logged in.

For each user we see:

> * an icon representing their email domain, which also indicates when we last saw them
> * their username and email address
> * the [licences](https://demo.solidatus.com/help/admin/#licence-roles) allocated (and possibly Site Admin role) - unless the account is disabled
> * information about when they were last seen, and when their account was created
> * a [drop-down Actions menu](#actions)

<figure><figcaption><p>The right and left-hand sides of the list of Users</p></figcaption></figure>

<figure><figcaption><p>Which users have we seen recently?</p></figcaption></figure>

<figure><figcaption><p>This account is disabled and does not occupy a licence</p></figcaption></figure>

By default, the list of users includes every registered user, with the most recently active users at the top. The simplest way to filter the list (perhaps to locate a particular user) is to type into the search box at the top of the list. For example, typing *Solidatus* in the box will filter the list to show only those users with *Solidatus* in their username or email address.

Click on the `Filter and Sort` button to open the *Filter and Sort* dialogue, which allows you to change the sort sequence and focus your attention on different categories of user.

The selections made here are applied to the list immediately.

<figure><figcaption><p>Filtering and sorting the list of Users</p></figcaption></figure>

<table data-header-hidden><thead><tr><th width="149.9544677734375"></th><th></th></tr></thead><tbody><tr><td><strong>Role</strong></td><td>Show only users with selected licences</td></tr><tr><td><strong>Site Admin</strong></td><td>Show or hide users with the <code>Site Admin</code> role</td></tr><tr><td><strong>User State</strong></td><td>Show or hide disabled users</td></tr><tr><td><strong>Authentication</strong></td><td>Filter according to the type of authentication</td></tr><tr><td><strong>Created</strong></td><td>Select a range of dates in which users were created</td></tr><tr><td><strong>Active</strong></td><td>Select a range of dates in which users connected to Solidatus</td></tr><tr><td><strong>Sort by</strong></td><td>Sort the list of users by when they were last seen, by their name, by their email address, or by the date on which the user was created</td></tr></tbody></table>

### Select multiple users

Many actions can be carried out for multiple users at the same time - just click on one or more of the selection boxes to the left of the user names and a blue button will appear on the blue bar at the top. Click on the chevron to the right of the button to open a drop-down menu.

<figure><figcaption></figcaption></figure>

<figure><figcaption></figcaption></figure>

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The *Edit users* button will not be available if you have included yourself in the selection
{% endhint %}

The buttons will allow you to invite all of the selected users to a [Group](#groups), or to carry out one of the following actions:

> * set their licence
> * enable the *Site Admin* role
> * remove the *Site Admin* role
> * delete the users
> * require two-factor authentication for these users
> * remove the requirement for two-factor authentication for these users

### Actions

For an individual user, the `Actions` dropdown allows you to:

> * impersonate the user (if impersonation is enabled)
> * require or disable two-factor authentication
> * change password (you can force user to change their password when they next login)
> * reset two-factor authentication
> * disable or reinstate the user
> * delete the user.

An administrator can impersonate any user, very useful for analysing a situation from a user’s perspective, and for transferring responsibilities from users that have left the organisation.

#### Require two-factor authentication

Solidatus administrators can require users to set up two-factor authentication (2FA) on their accounts. When Require 2FA is enabled, users are prompted to set up 2FA the next time they log in, and they won’t be able to continue until it’s complete.

**For single users**

To enable or disable the two-factor authentication requirement for single users:

1. Navigate to the Admin page via the **ADMIN** button in the top navigation bar (only visible if you have an admin role on a given Solidatus instance)
2. Navigate to **Users** section of the Admin page
3. Click the **ACTIONS** button on the right side of the row of a given user to open a context menu.
4. Select **Require 2FA** to force a user to set up two-factor authentication the next time they log in. Select **Remove 2FA requirement** to disable two-factor authentication on that user's account.

<figure><figcaption></figcaption></figure>

If you've set Require 2FA on a user's account, a yellow tag saying **2FA not set up** appears until the user successfully configures two-factor authentication the next time they log in.

**For multiple users at once**

To set the two-factor authentication requirement for multiple users at once:

1. Select the checkbox to the left of all users you would like to modify
2. Select the **X USERS SELECTED** button that appears at the top of the Users section.
3. Select **Edit users**
4. Select **Require** or **Remove 2FA for selected users**

<figure><figcaption></figcaption></figure>

### Create users

Click the `Create user` button at the top of the list of users and choose between the options available, which will vary according to the site configuration.

<table data-header-hidden><thead><tr><th width="224.48541259765625"></th><th></th></tr></thead><tbody><tr><td>Select <strong>Create user</strong></td><td>Provide details for a single user - the user will be created, and they will be sent an email inviting them to sign in</td></tr><tr><td>Select <strong>Create SSO user</strong> in the drop-down menu</td><td>Provide details for a single user - the user will be created, and they will be sent an email inviting them to sign in</td></tr><tr><td>Select <strong>Invite users</strong> in the drop-down menu</td><td>Provide details for one or more users, along with the content for the invitation email that each of them will receive</td></tr><tr><td>Select <strong>Re-invite users</strong> in the drop-down menu</td><td>Provide details for one or more users, along with the content for the invitation email that each of them will receive</td></tr><tr><td>Select <strong>Generate invite link</strong> in the drop-down menu</td><td>Provide details for a single user - this will generate a URL that you can send to the user</td></tr><tr><td>Select <strong>Create many users</strong> in the drop-down menu</td><td>Provide details for one or more users (in comma-separated format) - each user will be created, and they will be sent an email inviting them to sign in</td></tr></tbody></table>

{% hint style="success" %}
The default licence for each new user is *Author*.
{% endhint %}

For more information about the available licences, see [licences, roles, and permissions](/account-management/licences-capabilities-and-roles).

### **Create multiple users**

<figure><figcaption><p>Creating multiple users</p></figcaption></figure>

### Disable or delete a user

You can disable or delete a user via the `Actions` dropdown.

{% hint style="success" %}
**Disabled** users can be re-enabled; **deleted** users cannot be reinstated, they would have to be re-invited. A re-invited user is a brand-new user with no access to anything.
{% endhint %}

### **What happens to disabled or deleted users?**

**Disabled** users remain linked to all of their Models, Activities, Groups, Agents, Jobs and Dashboards, etc. - they just cannot log in to Solidatus.

**Deleted** users are removed from all of their Models, Activities, Groups, Agents, Jobs and Dashboards, etc.

> * If deleting a user leaves a Group with no Group admins then the member who has been in the Group the longest will be automatically promoted to Admin.
> * If deleting a user leaves a Model with no Owners then the Model will remain with no Owners; an admin user can use the ADD\_MODEL\_OWNER command in the [Console tab](#console) to add an owner to the Model.

## Single Sign-On (SSO)

Single Sign-On (SSO) is a process where a user is able to log-in to Solidatus without needing to have a local password on their user account, usually re-using credentials that they use on other applications within their organisation. SSO gives several benefits to clients, such as allowing the enforcement of more secure passwords than Solidatus can support or as a convenient way to ensure users do not have to re-enter a password for every different tool they use.

Solidatus supports three SSO approaches but the strongly recommended version is **SAML**. This is the most feature-rich SSO implementation we offer and is the only one which will get future development enhancement (bug-fixes for *LDAP* and *TrustedHeader* will still be implemented).

SSO can automatically set a user’s licence - e.g. Author, Read-only.

## Groups

The *Groups* tab provides a sortable and filterable list of all [Groups](#groups) in the Solidatus instance, allowing an administrator to access (and edit) every Group in Solidatus.

The list of [Groups](/models/share-and-collaborate/groups) shows the essential information about each Group.

<figure><figcaption><p>The list of Groups</p></figcaption></figure>

The icons on the right indicate whether or not approvals are required for publishing Models to a Group, and also how many Models are awaiting approval.

<figure><figcaption><p>Sharing approval indicators</p></figcaption></figure>

### Filtering and sorting the list

The list of Groups can be sorted by most of the list columns, using the up and down arrows alongside the column names.

<figure><figcaption><p>Filtering the list of Groups</p></figcaption></figure>

To filter the list, click on the `Filters` button.

<table data-header-hidden><thead><tr><th width="173.7752685546875"></th><th></th></tr></thead><tbody><tr><td><strong>Privacy</strong></td><td>Filter the list according to the <code>Private membership</code> setting</td></tr><tr><td><strong>Sharing Approvals</strong></td><td>Filter the list according to the <code>Require approvals when sharing</code> setting</td></tr><tr><td><strong>Group Admins</strong></td><td>Filter the list to show or hide Groups without <em>Admin</em> users</td></tr></tbody></table>

### Edit group properties

Click on a Group in the list of Groups to edit the properties for the Group (this is similar to the [Group Overview](/models/share-and-collaborate/groups#group-overview)).

<figure><figcaption><p>Editing a Group</p></figcaption></figure>

{% hint style="warning" %}
When you remove a user from a group, any models that they published to the group remain visible to the group, and if another group member has forked models shared with the group by the removed user, the forks remain accessible.
{% endhint %}

{% hint style="success" %}
See also [Group Overview](/models/share-and-collaborate/groups#group-overview) and [Group Roles](/models/share-and-collaborate/groups#group-roles) for more information about modifying group settings and the available group roles.
{% endhint %}

## Service accounts

There are two types of user account in Solidatus: user account that represent real individual people in your organisation and [service accounts](/account-management/service-accounts) used primarily to register and manage connector agent&#x73;*.*

Service accounts are accounts used to manage automated interactions between connectors and third-party applications. They are each owned by a "real" user and have permissions and roles like any other user, but do not represent a person.

Using service accounts facilitates a [separation of responsibilities](/connectors/connectors-overview/users-and-tokens#responsibilities), so people do not take direct responsibility for the output of connectors. [Agent tokens](/connectors/connectors-overview/users-and-tokens#agent-token) and [job tokens](/connectors/connectors-overview/users-and-tokens#job-token) enable this separation (see also [Which user owns the token?](/connectors/connectors-overview/users-and-tokens#which-user-owns-the-token)).

{% hint style="success" %}

* Any user with an *Author* licence can create service accounts
* A Solidatus licence limits the number of service accounts that can be created
* It is not possible to log on to Solidatus as a service account (see [Operating a service account](/connectors/connectors-overview/service-accounts))
  {% endhint %}

<figure><figcaption><p>The list of service accounts</p></figcaption></figure>

This tab lists all Service Accounts on the instance and provides the same capabilities for managing them as are available to the users that created the service accounts.

See [service accounts](#service-accounts) for more detailed information.

## Log

The *Log* presents a list of informative messages of interest, which can be simply useful information, warning messages, debug messages, error messages, or fatal messages.

Almost all network calls are recorded in log (the ones that we use for polling are ignored to keep it cleaner). We also log other helpful information, at various levels. The debug level needs to be explicitly enabled (in the JSON configuration file) in order to be actually logged and visible. The others are on by default.

Network calls are listed in the [Events](#events) tab.

Click on the box with the cross to the left of a message to see more information in JSON format.

Click on the `Filter` button to choose the categories you wish to see.

<figure><figcaption><p>Logs</p></figcaption></figure>

Click on the `Download` button to download one or more pages of messages in JSON format.

## Console

The *Console* tab enables you to perform several administrative actions for your Solidatus instance directly using commands.

Available commands are listed as clickable buttons at the top of the console. Click a command to enter a template into the empty console that you can fill in with your own values.

{% hint style="info" %}
Many commands perform an action on a single user or model. However, you can enter multiple commands at once, whether the same command multiple times or several distinct commands, to perform a series of actions in one execution.
{% endhint %}

<figure><figcaption><p>Executing commands via the Console</p></figcaption></figure>

Once you fill in a command template with your own values, click **EXECUTE** to run the command. The results can then be viewed below the **EXECUTE** button.

<table data-header-hidden><thead><tr><th width="370.7523193359375"></th><th></th></tr></thead><tbody><tr><td>CREATE_USER</td><td>Creates a single new user account with specified credentials and licence role</td></tr><tr><td>SET_PASSWORD</td><td>Sets a new password for a single existing user</td></tr><tr><td>ADD_TO_GROUP</td><td>Adds a single existing user to a group by providing a group ID, which can be found in the URL when the group's <a href="/pages/SHqm4H5EKK254jTw6aUx#the-group-overview-page">Group Overview</a> is open</td></tr><tr><td>CLONE_MODEL</td><td>Clones a single model and make a specified user the <strong>Owner</strong> of the clone. Specified user must have at least <strong>Author</strong> access to the original model</td></tr><tr><td>TEST_EMAIL</td><td>Sends a test email to a single specified email address</td></tr><tr><td>TEST_LDAP</td><td>Checks credentials for a single LDAP SSO user. This is helpful for checking whether a user was successfully created in third-party LDAP application</td></tr><tr><td>APPLY_ROLE_TO_ALL_USERS</td><td>Gives a specified licence role to all users registered to your instance</td></tr><tr><td>START_CONNECTOR_JOB_CHANGE_STREAM</td><td>Starts the job change stream that connectors subscribe to for job state updates</td></tr><tr><td>STOP_CONNECTOR JOB_CHANGE_STREAM</td><td>Stops the job change stream that connectors subscribe to for job state updates</td></tr><tr><td>ADD_MODEL_OWNER</td><td>Makes a single specified user an <strong>Owner</strong> of a single specified model</td></tr><tr><td>RESTORE_MODEL</td><td>Restores a single deleted model (you must obtain the model ID of the deleted model, typically via logs)</td></tr><tr><td>CLEAR_CACHE</td><td>Clears the Solidatus application server cache. This can be useful to improve performance if speed or loading issues are encountered</td></tr><tr><td>CLEAR_MODEL_CACHE</td><td>Clears the Solidatus application server cache for a particular model. This is useful for troubleshooting problems with loading, saving, or performance</td></tr><tr><td>RESYNC_DOMAIN</td><td>Refreshes cache of models included in a single Data Domain to ensure domain is up to date with latest model versions</td></tr><tr><td>MONGO_CURRENT_OP</td><td>Returns the current state and operations of MongoDB</td></tr><tr><td>RELEASE_GRAPH_ENGINE_LOCKS</td><td>Forces locks on the Mongo graph engine to release. This can be necessary before resetting and restarting the <a href="#graph-engine">graph engine INIT sync</a> if the graph unexpectedly goes down</td></tr><tr><td>REMOVE_DUPLICATE_ENTITIES</td><td>Entities with duplicate IDs in a model can prevent it from opening. This command removes duplicate entities, leaving only one entity in the model per provided ID</td></tr><tr><td>FIX_IMPORT_IDS</td><td>Repairs corrupted revision IDs of imported models in a model with the provided ID, without requiring database access. Creates standard IDs for corrupted IDs of imported models</td></tr><tr><td>CONFIRM_USER_EMAIL</td><td>Checks whether a single email address matches a registered user</td></tr></tbody></table>

## Licence

The *Licence* tab displays information about the licenced capabilities in a Solidatus instance, including:

> * the available licences (and how many of each have been allocated)
> * the capabilities granted by each licence
> * the number of available Service Accounts
> * additional features that are available (such as [Search](#search)).

It also allows you to supply a new licence code.

<figure><figcaption><p>Admin Licence tab</p></figcaption></figure>

### Licences and capabilities

There are four main Solidatus licence types: Author, Practitioner, Consumer (also called Read-only), and Admin.

Users are assigned one of these licence types when they are registered as a Solidatus user by an administrator of a Solidatus environment.

Each licence type gives users a standard set of capabilities summarised in the table below, although licences and capabilities can also be subject to individual agreements between customers and Solidatus.

<figure><figcaption></figcaption></figure>

Note that [Service Accounts](/account-management/service-accounts) used to manage Connectors require and take up an Author licence.

{% hint style="success" %}
The actual licences available are subject to agreement between a client and Solidatus, and may be different from those listed above. The licence tab in the Admin page provides the definitive list of available licences and their capabilities.
{% endhint %}

## Config

The *Config* tab provides a read-only view of the configuration file, which controls and restricts the technical capabilities of Solidatus, such as:

> * the available [Connectors](/connectors/connectors-overview)
> * backups
> * notifications
> * single sign-on (SSO)

<figure><figcaption><p>Configuration settings</p></figcaption></figure>

## Statistics

The *Statistics* tab gives you insights into what’s happening in Solidatus, including textual and graphical information. You can also create a Solidatus Model that illustrates the dependencies between licences, users, Groups, and Models.

There are six sections in this tab:

<table data-header-hidden><thead><tr><th width="157.144775390625"></th><th></th></tr></thead><tbody><tr><td><strong>Summary</strong></td><td>The summary box provides some technical information plus the current number of active and registered users, Models, Revisions, and Entities.</td></tr><tr><td><strong>Trends</strong></td><td>This is followed by a number of trend charts, with a configurable time period. You can export the statistics for the currently-selected time period in JSON format. Statistics are shown for the following categories: Registered users, Active users, Models created, Revisions created, Entities edited, Models viewed</td></tr><tr><td><strong>Active Users</strong></td><td>A list of all users that have been active in the selected time period, with the most recently active users shown at the top</td></tr><tr><td><strong>Largest Models</strong></td><td>A list of the 10 largest Models (complete with a hyperlink if you have access to them)</td></tr><tr><td><strong>Most Changed Models</strong></td><td>A list of the 10 most changed models over specified period (period can be yesterday, year, month, week, all time, or custom)</td></tr><tr><td><strong>Errors</strong></td><td>Graphs showing number of client and server errors by date, and a list of errors containing date, type, and error message. You can view errors by year, month, week, day, all time, or a custom period.</td></tr></tbody></table>

<figure><figcaption><p>Site statistics</p></figcaption></figure>

***

If the browser tab is narrow, each graph occupies a single row in the tab. A good little feature to use instead of having to roughly gauge the amount of both registered and active users respectively is to click on the bold green line. By doing so you will be able to see the exact value on a specific day.

<figure><figcaption><p>Trends as graphs</p></figcaption></figure>

***

Can see statistics about large models and models that have changed the most:

<figure><figcaption></figcaption></figure>

Large Models and Models that have changed the most

***

Can see details of errors:

<figure><figcaption><p>Monitor and examine errors</p></figcaption></figure>

### Monthly usage statistics

On-prem Solidatus customers are requested to provide usage statistics to Solidatus every month. This can be done by click the **Monthly Usage Statistics** button on the Admin Statistics page.

{% hint style="success" %}
Admin accounts will now see a banner on top of the Navbar if there are new usage stats that have not been downloaded and sent to Solidatus.
{% endhint %}

<figure><figcaption><p>Alert to Admins that there are new stats available</p></figcaption></figure>

Click `here` in the banner to go directly to the `Download monthly usage statistics` dialog.

In the `Download monthly usage statistics` dialog, you must enter an instance type. Then you can either download a file containing the usage statistics, or send them directly to Solidatus with the Email Solidatus button.

<figure><figcaption><p>Enter instance type and download or send to Solidatus directly</p></figcaption></figure>

### Statistics model

The `Open Statistics Model` button will create a temporary read-only Solidatus Model that illustrates the dependencies between licences, users, Groups, and Models.

<figure><figcaption><p>Statistics as a Solidatus Model</p></figcaption></figure>

{% hint style="success" %}
If you need to keep a copy of this Model, use the `Save as` option on the toolbar to [create a Clone](/models/build-and-edit-models/copy-clone-or-fork-a-model#clone-a-model)
{% endhint %}

You can use standard Solidatus features to trace the dependencies for Models or users.

<figure><figcaption><p>Tracing a Model’s dependencies</p></figcaption></figure>

You can also examine the properties for Models and users, and enable the supplied Display Rules and Filters.

<figure><figcaption><p>Properties for a Model</p></figcaption></figure>

Click a paintbrush icon to toggle a Display Rule for a property.

<figure><figcaption><p>Properties for a user</p></figcaption></figure>

## DataOps

Allows you to lock Solidatus, preventing all access. An Admin user can unlock Solidatus.

## Events

The *Event* tab presents detailed information about auditable events in Solidatus. These events are a reflection of “events/actions” that have taken place in Solidatus, categorised by the type of event. For each event you can see the event type, the person who fired off the event, the time the event kicked off and a short description of what happened.

<figure><figcaption><p>Events</p></figcaption></figure>

Click an Event to expand it and see more information.

<figure><figcaption><p>Event colours</p></figcaption></figure>

## Search

The *Search* tab is available if the *Search* feature has been enabled. This feature extracts all Model metadata from Solidatus into an Elastic Search database, keeping that database up to date with changes as they occur.

<figure><figcaption><p>Search index health</p></figcaption></figure>

An expert in Elastic Search can use this console to run commands.

<figure><figcaption><p>Search index health</p></figcaption></figure>

The *Data Sync* panel enables you to control the initialisation and watching processes, and to pause or resume the collection of statistics.

<figure><figcaption></figcaption></figure>

## Graph Engine

Solidatus loads model data into a back-end graph engine to optimise the performance of Data Maps and Data Domains. The graph engine supports:

* **Data Asset discovery in Data Domains**: Identifying and managing Data Assets across your entire data ecosystem.
* **Data Map generation**: Generating an interactive and explorable map that consolidates entities, assets, and lineage across models published to a domain.

To keep the graph data consistent with model data, an automatic synchronisation process is in place that runs any time changes are saved to a model that is in a Data Domain (i.e., a new revision is created).

The **Graph Engine** tab on the admin page allows administrators to monitor and manually reset and initiate the graph engine synchronisation process.

<figure>Monitor and control the init and watch sync processes<figcaption><p>Monitor and control the init and watch sync processes</p></figcaption></figure>

### Initial (init) sync

The Initial (init) Sync is an operation that populates the graph database from scratch.

You can reset the synchronisation process using the **RESET** button on the Data Sync section of the Graph Engine tab. You can also **initiate** the synchronisation process after it has been reset by selecting **RUN INIT**.

Note that the synchronisation process can only be reset after it has completed. If you reset the synchronisation process, you must then wait until the reset has completed and the graph is empty before running the **init sync** again.

### Sync states

The state of each synchronisation process is tracked and displayed in the Graph Engine tab to provide visibility and control over its lifecycle.

<figure><figcaption></figcaption></figure>

The sync can be in the following states:

* **Running**: The sync process is currently active.
* **Complete**: The sync process has finished successfully.
* **Incomplete**: The sync process encountered an error and stopped.
* **Resetting**: The graph database is in the process of being emptied
* **Not run:** The sync was reset and has not yet been initiated again.

When triggered, the INIT sync state changes to **Running**. Upon successful completion, the state becomes **Complete**. If an error occurs, the process stops and the state is typically **Incomplete**, with details about the error logged.

### Domain statistics

You can view storage statistics for the graph engine that represent all Data domains across your Solidatus instance. You can view the total number of entities (includes both entities in Lineage models and terms in Reference models) in all domains, the number of models (Lineage and Reference) included in domains, and the total number of domains.

Click the **GET** button next to **Domain Stats** to update the statistics based on the state of the sync process. The stats are real-time, so they will track the progress of the sync process as it runs.
