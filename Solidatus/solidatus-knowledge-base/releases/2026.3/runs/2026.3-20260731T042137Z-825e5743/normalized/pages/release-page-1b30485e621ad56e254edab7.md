# API Authentication

## API tokens

All calls to the Solidatus API endpoint need to be authenticated for obvious security reasons.

Rather than sending sensitive and inconvenient credentials like a username and password, API tokens are sent in the request header instead.

API tokens are simply short strings of alphanumeric characters that identify and authenticate a user to the server.

API tokens are easy to generate and revoke if need be, and they can be assigned scopes that provide more granular permission restrictions that further aid in minimising risk of their usage and possible compromise.

That said, tokens should still be kept safe and private and only be sent over encrypted (https) connections.

## Generate API tokens

A user can generate a token from the [API tokens](/account-management/account-settings) page. This page can be accessed by clicking on your name in the top right of the Navigation Bar, selecting `Account`, and scrolling down to the `API tokens` section.

<figure><figcaption><p>Token Management tab for a user</p></figcaption></figure>

Using the “Create new API token” panel you can generate a new token:

* First you must enter a name for the token. You should make it meaningful so that when it comes to revoking the token, you can easily identify the entry in the list of active tokens.
* Once a name is chosen you must give at least one or more scopes to the token. The list of scopes shows the permissions your account has been granted access to - your token can only be as powerful as you are. The scopes you assign give authorisation to the token to carry out actions that require permissions represented by the scopes. You should follow the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when assigning scopes, i.e. give the token the least amount of access that is needed to get the job done.
* Once ready, press the “Create token” button to send the entered information and receive your token.

{% hint style="danger" %}

* You should copy the generated token somewhere safe and secure as once you leave the page or perform any other actions on the page, the generated token will disappear and you will not be able to view it again. If this happens, simply **revoke** the token and generate a new one in exactly the same way.
* If you have Admin access to Solidatus, you will be able to grant administrator-level permissions to a token - think very carefully before you do that.
  {% endhint %}

### Generate tokens for Service Accounts

[Service Accounts](/connectors/connectors-overview/service-accounts) will also own API Tokens, which are created in the same way as they are for ordinary users.

You can generate a token for a Service Account that you own, from your `Service Accounts` page. This page can be accessed by clicking on your name in the top right of the Navigation Bar, and selecting `Service Accounts` - open the Service Account you wish to create the token for, click on the `Settings` tab, then click on the `Token Management` page.

<figure><figcaption><p>Token Management for a Service Account</p></figcaption></figure>

{% hint style="warning" %}
It is essential to ensure that the roles are sufficient for the Agent or Job - see [Job Roles vs Model Roles](/connectors/connectors-overview/users-and-tokens#job-roles-vs-model-roles).
{% endhint %}

## Revoke existing API tokens

Existing tokens are displayed in the “Active API tokens” panel. The token’s name alongside its scopes are shown to help you identify tokens. To revoke a token, simply click on the “Revoke token” button next to the corresponding token entry. This will delete the token and prohibit access to the Solidatus API for that token.

## Use tokens in API calls

To authenticate an API call the token should be sent with every request. The token should be placed in the **Authorisation header** of the request and be prefixed with the word **Bearer** followed by a **space(!)**. For example an API call should include the following entry in its header:

{% code overflow="wrap" %}

```
Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0
```

{% endcode %}

## Use tokens in the Connector Framework

Each Connector [Agent](/connectors/connectors-overview/agents) and [Job](/connectors/connectors-overview/jobs) requires an API token for authentication and to manage the allowed roles for a Connector. See [Agent tokens](/connectors/connectors-overview/users-and-tokens#agent-token) and [Job tokens](/connectors/connectors-overview/users-and-tokens#job-token) for more information.
