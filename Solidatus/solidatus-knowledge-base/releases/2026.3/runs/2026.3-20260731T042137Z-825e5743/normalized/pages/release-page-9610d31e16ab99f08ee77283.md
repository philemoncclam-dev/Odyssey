# API tokens for connectors

Connectors require valid API tokens to successfully register an agent and run a job. Tokens control the ownership of the agent and the permissions of the connector when updating models.

A valid API token must be provided when registering a connector with Solidatus to create an agent and when creating a job.

{% hint style="success" %}
The specific way API tokens are provided during registration and job creation can differ among individual connectors. Consult [connector-specific documentation](/connectors/connector-specific-documentation) for instructions for each connector.
{% endhint %}

## API tokens

All calls to the Solidatus API endpoint need to be authenticated for obvious security reasons. Rather than sending sensitive credentials like a username and password, API tokens are sent instead. These tokens are unique strings of alphanumeric characters that authenticate a user, agent, or job to the server.

Tokens are easy to generate and revoke via the [user account settings](/account-management/account-settings) page, and the scopes assigned to them provide fine-grained permission levels that further minimise risk in the event of possible compromise.

Tokens inherit the capabilities and access permissions of the users that create them. While they can be given fewer capabilities, and permissions to enact those capabilities, than the users or service accounts that create them, they cannot be given more.

That said, tokens should still be kept safe and private and only sent over encrypted (https) connections.

## Generate new tokens

A user can generate a token from the API tokens page, accessed via your [user account settings](/account-management/account-settings).

To access the API tokens page via user account settings:

* Click your initials at the top right of the navigation bar,
* Select `Account`,
* Scrolling down to the `API tokens` section.

<figure><figcaption><p>Token management tab for a user</p></figcaption></figure>

Use the “Create new API token” panel to generate a new token:

1. First enter a name for the token (this is required).

{% hint style="success" %}
You should make the token name meaningful so when it comes to revoking the token, you can easily identify it in the list of active tokens.
{% endhint %}

2. Once you choose a name, you must give at least one or more scopes for the token. The list of scopes includes the [licence capabilities](/account-management/licences-capabilities-and-roles) your account has been granted. Your token can only have capabilities that you, as a user, can exercise in Solidatus. The scopes you assign the token authorise it to carry out actions that require specific permissions. You should follow the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when assigning scopes, i.e. give the token the least amount of access that is needed to get the job done.

{% hint style="success" %}
You can use the **SELECT ALL SCOPES** or **CLEAR ALL** buttons at the bottom to quickly select or clear them all. If the token is used to update models, we recommend selecting all permissions with the word "model" in their name.
{% endhint %}

3. Once ready, press the **CREATE TOKEN** button to send the entered information and receive your token.

{% hint style="danger" %}

* You should copy the generated token somewhere safe and secure as once you leave the page or perform any other actions on the page, the generated token will disappear and you will not be able to view it again. If this happens, simply **revoke** the token and generate a new one in exactly the same way.
* If you have Admin access to Solidatus, you will be able to grant administrator-level permissions to a token - think very carefully before you do that.
  {% endhint %}

## Tokens for service accounts

[Service accounts](/connectors/connectors-overview/service-accounts) also own API Tokens, which are created in the same way as they are for ordinary users, only you must first impersonate the service account to access its user account settings page, then navigate to the token management section.

To generate a token for a service account that you own, navigate to your `Service Accounts` page. This can be accessed by clicking your initials in the top right of the navigation bar and selecting `Service accounts` .

Open the Service Account you wish to create the token for, click the `Settings` tab, then click the `Token Management` section to create a new token or revoke previously created tokens.

<figure><figcaption><p>Token Management for a Service Account</p></figcaption></figure>

{% hint style="warning" %}
It is essential to ensure that the permissions you select are sufficient for the agent or job - see [job roles vs model roles](/connectors/connectors-overview/users-and-tokens#job-roles-vs-model-roles).
{% endhint %}

## Revoke API tokens

Existing tokens are displayed in the **Active API tokens** panel at the bottom of the page. Each token’s name and selected scopes are shown to help you identify them.

To revoke a token, simply click on the “Revoke token” button next to the corresponding token entry. This deletes the token and prohibits access to the Solidatus API for that token.

## Use tokens in API requests

To authenticate an API call the token should be sent with every request. The token should be placed in the **Authorisation header** of the request and prefixed with the word **Bearer** *followed by a **space!*** For example, an API call should include the following entry (relacing this token with your own) in it’s header:

```
Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0
```

## Use tokens in the connector framework

Each connector [agent](/connectors/connectors-overview/agents) and [job](/connectors/connectors-overview/jobs) requires an API token for authentication and to manage ownership and allowed permissions. See [agent tokens](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/solidatus-core/connectors/integrations-basics/users-and-tokens.md#agent-token) and [job tokens](/connectors/connectors-overview/users-and-tokens#job-token) for more information.
