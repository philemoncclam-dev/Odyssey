# Service accounts

The purpose of this page is to provide guidance on the functionality, capability, and use of service accounts and associated functions in relation to connectors.

{% hint style="success" %}
**Prerequisites**

Before carrying out the instructions on this page, please familiarise yourself with the meaning of **connector,** **standalone mode**, **agent**, and **job**.

You should have also set up Solidatus Groups for those individuals that need to set up connector agents and jobs, and potentially a Solidatus Group for individuals that will need to run and modify jobs, e.g., `Solidatus Connector Management` and `Solidatus Job Execution` groups.
{% endhint %}

## What are service accounts?

Service accounts allow you to separate “real” user accounts from accounts used to manage automated interactions between Solidatus connectors and third-party systems. For the most part, they function like regular user accounts, but they cannot be logged into directly. Instead, authorized users can “impersonate” them to manage connectors, agents, and jobs on their behalf.

The main function of a service account is to create and own an API token, which can then be used to register agents and configure jobs in agent or standalone modes. An API token is the security credential required for access to the Solidatus REST API.

Best practice is to use a service account generated API token for all agent and standalone connector configurations (potentially stored in a vault and passed as a variable).

**Why use service accounts?**

* *Separation of responsibilities*: Keep automated processes separate from personal user accounts
* *Continuity*: Ensure connectors continue working even if individual users leave the organization
* *Security*: Ensure the principle of least privilege by giving service account tokens only the access they need

{% hint style="success" %}

* Any user with the *Author* licence can create service accounts
* The Solidatus licence limits the number of service accounts that can be created
* It is not possible to log in to Solidatus as a service account
  {% endhint %}

## Set up service accounts for connector management

The steps below explain how to set up a service account for managing connectors.

We recommend that only one agent is registered per connector per Solidatus instance, and that this agent is registered, managed, and shared with others either via a single service account or via a separate service account for each connector.

| [Step 1: Create a service account](#step-1-create-a-service-account)                                                   |
| ---------------------------------------------------------------------------------------------------------------------- |
| [Step 2: Share a service account](#step-2-share-a-service-account)                                                     |
| [Step 3: Generate an API token for the service account](#step-3-generate-an-api-token-for-the-service-account)         |
| [Step 4: Create and share models with the service account](#step-4-create-and-share-models-with-the-service-account)   |
| [Step 5: Register an agent using a service account token](#step-5-register-an-agent-using-a-service-account-token)     |
| [Step 6: Create and configure jobs via the service account](#step-6-create-and-configure-jobs-via-the-service-account) |

## Step 1: Create a service account

Service accounts can be created and managed by users with an **Author** licence.

You can access the page for creating and managing service accounts via `Account settings` on the [The Navigation Bar](/the-user-interface/the-navigation-bar).

When you open your service accounts, you will see a list of service accounts that you have created or that have been shared with you.

<figure>My service accounts<figcaption><p>My service accounts</p></figcaption></figure>

To create a new service account, click the `Create service account` button on the list of service accounts, then provide the name and description.

{% hint style="success" %}
You should name the service account according to the connector agent it will manage, so you can easily identify it later. For example, if the service account is for a Power BI connector, you could name it “Power-BI-service-account”.
{% endhint %}

<figure>Create a new service account<figcaption><p>Create a new service account</p></figcaption></figure>

{% hint style="warning" %}

* The name of a service account can only contain letters, numbers or one of these characters `-._+`
* The name cannot contain spaces
* You must provide a description
* You cannot rename a service account, so think carefully before you create it
  {% endhint %}

***

{% hint style="danger" %}
You will not be able to create the service account if your organisation already has the maximum number allowed by the Solidatus licence.
{% endhint %}

***

## Step 2: Share a service account

There are two aspects to configuring service account permissions:

1. **Who can manage the service account?** - This involves sharing a service account you created with other users or groups, which is covered in this section.
2. **What can the service account do?** - This involves generating an API token with appropriate capabilities and giving the service account access to models it will update via connector jobs. These topics are covered in [Step 3](#step-3-generate-an-api-token-for-the-service-account) and [Step 4](#step-4-create-and-share-models-with-the-service-account).

#### Share the service account with other users and groups

You can add other users and groups to the service account via the `Permissions` tab in the service account settings.

To find the `Permissions` tab:

1. Open your service accounts via the `Account settings` in the Navigation Bar, then click the name of service account you want to manage.
2. Click the name of a service account in the list, then click the `Settings` tab.
3. Click the `Permissions` section.

<figure>Add owners to a service account<figcaption><p>Add owners to a service account</p></figcaption></figure>

{% hint style="success" %}
All users and groups you share the service account with have the same permissions and are, effectively, owners.
{% endhint %}

All users and groups with access to a service account can:

* Edit `Settings`
* Create and revoke tokens
* Impersonate the service account
* Delete the service account

## Step 3: Generate an API token for the service account

One of the primary functions of service accounts is to own API tokens that are used to manage connector agents and run jobs.

To run agents and jobs, the service account needs to have an API token with the appropriate capabilities.

You can generate one or more API tokens for a service account via the `Token Management` tab in the service account `Settings` page.

To do this:

1. Open your service accounts via the `Account settings` in the Navigation Bar,
2. Click the name of service account you want to manage.
3. Click the `Settings` tab, then click the `Token Management` tab.
4. Select all capabilities that you want the token to have, then click the `Create token` button on the bottom right of the window.

{% hint style="success" %}
We recommend that you add all capabilities with `model` in their name (i.e., `Create model, Export model`, `Share model`, `Fork model`, and `View model`, along with any other capabilities that you want the service account to have.
{% endhint %}

<figure>Token Management tab for a service account<figcaption><p>Token Management tab for a service account</p></figcaption></figure>

1. Copy the token to a safe place or credentials vault, as you will not be able to see it again once you leave this page. You can revoke the token at any time by clicking the `Revoke token` button.

<figure>Copy a service account token<figcaption><p>Copy a service account token</p></figcaption></figure>

## Step 4: Create and share models with the service account

Next, give the service account access to the models it will update via connector jobs. You can do this by giving the service account a role on the model, just like you would for a regular user account.

{% hint style="success" %}
You can only give service accounts access to models you have the owner role on. Additionally, access to models must be given from the accounts of model owners, not from within the service account itself.
{% endhint %}

**Best practice for service accounts**

As a principle of best practice, connectors should only be used to update **fork models** rather than original parent atomic models themselves.

This separates the model containing the raw import from the connector from the model in which design changes are made to the raw imported data. It also allows the service account to update the fork without affecting the parent atomic model.

To create a fork model for the service account to update:

1. From a “real” user account, create a new, empty model and name it according to the source technology it will import from.
2. **Fork** that model and append **“connector fork”** to its name. This is the model you will give the service account access to.
3. Open the Model Overview of the **connector fork**. At this point, you should note the model ID of the fork, which is at the end of the URL in your browser when you have the Model Overview open, as you will need it later when configuring a job.
4. Click the `Settings` tab in the Model Overview.
5. Click the `Permissions` section on the Settings page.
6. Click the `+ Add user/group` button, then select the service account you want to give access to.
7. Give the service account the `Owner` or `Author` role on the model.

{% hint style="success" %}
The `Author` role allows the service account to update the fork, but not share it or delete it, and it will not be able to modify the parent atomic model.
{% endhint %}

You might wish to follow the steps above on the parent atomic model and give the service account **viewer** access, so someone impersonating the service account can at least view the parent model.

## Step 5: Register an agent using a service account token

Service accounts are used to manage API tokens, agents, and jobs for importing and exporting metadata and lineage.

To register a connector agent, you will need follow connector-specific instructions, which are available in the documentation for each connector.

{% hint style="success" %}
The key point here is that you need to register the agent using the API token you created in Step 3, so the service account will be the default owner of the agent.
{% endhint %}

Once the agent is registered, you can then impersonate the service account to manage the agent, share it with other Solidatus users, and create and run jobs.

* We strongly recommend that you share the service account with at least one other “real” user, and ideally a group.
* Also add another user or group as an owner of the agent, so there is at least one other user who can manage the agent owned by the service account.

Once an agent is registered using the service account token, the agent appears on the connectors page of the service account.

To access the agent on the connectors page, you will have to impersonate the service account.

To impersonate the service account:

1. Open your service accounts via the `Account settings` in the Navigation bar
2. Click the `Actions` dropdown next to the service account you want to impersonate

<figure>Impersonate a service account<figcaption><p>Impersonate a service account</p></figcaption></figure>

The interface inside a service account is the same as a “real” account, and you can access the connectors interface by selecting `CONNECTORS` in the Navigation Bar.

When you’re impersonating a service account, there is a visual reminder in the Navigation Bar.

<figure>Impersonating a service account<figcaption><p>Impersonating a service account</p></figcaption></figure>

To share an agent with other users:

1. Click the agent on the connectors page
2. Click the `Settings` tab in the agent Overview
3. Click the `Permissions` section
4. Click the `+ Add user/group` button, then select the users or groups you want to share the agent with
5. Select the role you want to give the users or groups on the agent (we recommend you give at least one other user the **owner** role, so they can manage the agent if the service account is deleted or otherwise becomes unavailable)

{% hint style="success" %}
See [Agent roles](/connectors/connectors-overview/users-and-tokens#agent-roles) for more information about the roles available for agents.
{% endhint %}

When you are finished operating the service account, click the dropdown to the right of the `Impersonating` tag in the Navigation Bar and select `Unimpersonate` to return to back to your user account.

<figure>Unimpersonate a service account<figcaption><p>Unimpersonate a service account</p></figcaption></figure>

## Step 6: Create and configure jobs via the service account

Once you’ve registered a connector agent and set up the service account, you can create, configure, share, and execute jobs to bring your metadata and lineage into Solidatus.

The key point is to use the API token you created in Step 3 when configuring the job, so the service account is used to authorise access and run the job.

To do create a job in agent mode on behalf of the service account, you need to impersonate the service account (see Step 4), then navigate to the `CONNECTORS` page via the Navigation Bar.

Follow the instructions on the [Jobs](/connectors/connectors-overview/jobs) page. Each connector requires unique parameters to be configured based on the source technology, so it is advised to consult the documentation for a specific connector when setting up a job.

{% hint style="success" %}
Ensure that the job is set to run against a connector fork that you shared with the service account in step 2 (see [Step 2](#step-2-share-a-service-account)).
{% endhint %}

### Summary and next steps

The service account is now set up and ready to manage connector agents and jobs that are configured using its API token.

Anyone you gave access to the service account can now impersonate it. This allows them to manage the agent and jobs, and run them on behalf of the service account.

The rest of this page explains ongoing management monitoring of service accounts, and best practice principles for using them.

## Manage a service account

The Overview for a service account is set up the same as the [Model Overview](/the-user-interface/models-ui/model-overview) of a model.

There are two pages: the `Summary` page and the `Settings` page. The `Settings` page is where you do the real work when creating or editing the service account. This page has four tabs:

* [Information tab](#information-tab)
* [Permissions tab](#permissions-tab)
* [Token Management tab](#token-management-tab)
* [Advanced tab](#advanced-tab)

### Information tab

This tab displays useful information abut the service account, and allows you to edit the description.

<figure>Information tab for a service account<figcaption><p>Information tab for a service account</p></figcaption></figure>

{% hint style="success" %}
The listed name and email of a service account include an ID that links it to the user account that created it.
{% endhint %}

### Permissions tab

This tab lists the users and groups with access to the service account. You can share the service account and remove access from here.

<figure>Permissions tab for a service account<figcaption><p>Permissions tab for a service account</p></figcaption></figure>

### Token Management tab

This tab allows you create and manage API tokens owned by the service account, which can be used as [agent tokens](/connectors/connectors-overview/users-and-tokens#agent-token) and [job tokens](/connectors/connectors-overview/users-and-tokens#job-token). See [Agent roles](/connectors/connectors-overview/users-and-tokens#agent-roles) and [Job roles](/connectors/connectors-overview/users-and-tokens#job-roles) for more information about the scopes and permissions required for these tokens.

You should follow the principle of least privilege when assigning roles, i.e. give the token the least amount of access needed to perform the job. This ensures that should a token be compromised, it will be least damaging.

You should treat the tokens like your passwords - keep them safe, secure and secret. You can revoke a token, and all access originating from it, by pressing `Revoke token`.

<figure>Token Management tab for a service account<figcaption><p>Token Management tab for a service account</p></figcaption></figure>

{% hint style="success" %}
See [Users and tokens](/connectors/connectors-overview/users-and-tokens) to find out more about managing tokens.
{% endhint %}

### Advanced tab

This tab allows you to delete the service account. Deleting a service account will result in the following:

* All of API tokens are revoked (which may cause agents, jobs and other API calls to fail)
* Any agents and jobs that they are the sole owner of can no longer be accessed

<figure>Advanced tab for a service account<figcaption><p>Advanced tab for a service account</p></figcaption></figure>

## Monitor service account activities

There are several ways to monitor the activities of service accounts. Which approach you use will depend on what has been shared with you - the service account itself, the agents it owns, the models created using the tokens it owns, or all three.

### Agents and jobs

The [connectors Interface](/connectors/connectors-overview/connectors-page) will show the agents and jobs that you own or have been shared with you.

### Models

You can use the filters built in to the Model Browser to list the models owned by a service account (**if** they have been shared with you).

To view models that have not been shared with you, you must impersonate the service account. While impersonating a service account, you can then share models with your 'real' user account.

### Webhooks

Webhooks are HTTP POST requests containing a JSON payload that are sent to a third-party URL separately configured to receive them.

Webhooks can be used as external notifications or triggers for events in external systems. Configuring webhooks on service accounts is an effective way to monitor the automated activity of connectors on any models the service account has access to.

See [webhooks](/api-documentation/webhooks) for more information and instructions for setting up webhooks.

## Best practices for service accounts

**Service account management**

* Name service accounts according to the connector agent they own
* Share with multiple owners
* Create separate service accounts for different connectors
* Document the purpose of each account in the description

**Token management**

* Follow principle of least privilege
* Use separate tokens for different purposes
* Revoke unused or compromised tokens as soon as possible

**Job configuration**

* Create models and forks before running jobs
* Ensure jobs are set to run against connector forks
* Use service accounts to run scheduled jobs and user accounts for ad-hoc runs. This way an ad-hoc run can be traced back to a “real” user who ran it

**Monitoring and maintenance**

* Regularly review permissions and access
* Monitor job success rates
* Use webhooks for real-time notifications

## When (not) to use service accounts

All scheduled interactions with Solidatus should be managed via service accounts. In practice this means that all [agent tokens](/connectors/connectors-overview/users-and-tokens#agent-token) and most [job tokens](/connectors/connectors-overview/users-and-tokens#job-token) should be owned by service accounts.

Solidatus suggests that you follow these principles:

| Don’t let connectors create models, so models are not owned by service accounts. A 'real' user should always create the target model and fork it, then share the fork with the service account and run the connector to import into the fork. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Only use service accounts for creating agent and job tokens, registering and sharing agents, and for running scheduled jobs                                                                                                                   |
| Ad-hoc job runs should be run by ‘real’ users; people run jobs, service accounts run scheduled jobs                                                                                                                                           |
| Do not use service accounts for manually editing models; only real users should do this                                                                                                                                                       |
