# Licences, roles, and permissions

There are four main Solidatus licence types: Author, Practitioner, Consumer (also called Read-only), and Admin.

Users are assigned one of these licence types when they are registered as a Solidatus user by an administrator of a Solidatus environment.

Each licence type gives users a standard set of capabilities summarised in the table below, although licences and capabilities can also be subject to individual agreements between customers and Solidatus.

<figure>Standard Capabilities for each Licence Type<figcaption><p>Standard capabilities for each licence type</p></figcaption></figure>

Note that [Service Accounts](/account-management/service-accounts) used to manage Connectors require and take up an Author licence.

{% hint style="success" %}
The licence types and capabilities assigned to each licence are subject to agreement between a customer and Solidatus, and may be different from those listed above. A definitive list of available licences and their capabilities for a given Solidatus instance is available in the [Licence tab in the Admin page](/account-management/admin#licence).
{% endhint %}

### Licence Capabilities vs. Role Permissions

There are two features that control what a Solidatus user can do inside the application: **Licence capabilities** and **Role permissions**.

<table data-header-hidden><thead><tr><th width="193.5263671875"></th><th></th></tr></thead><tbody><tr><td><strong>Licence capabilities</strong></td><td>A licence controls the general <strong>capabilities</strong> a user registered with that licence has inside Solidatus.</td></tr><tr><td><strong>Role permissions</strong></td><td>A role gives a user <strong>permission</strong> to act on licenced capabilities (or a subset of them) in the specific context of a Model, Group, Data Domain, <a href="/pages/zNlDqSAYPfMdKf2xaThI#agent-roles">Agent</a>, or <a href="/pages/zNlDqSAYPfMdKf2xaThI#job-roles">Job</a>.</td></tr></tbody></table>

Licences are assigned to each registered user in the `Admin` page by an administrator of a Solidatus environment.

Role permissions are set in local areas of the application in which access and capabilities to local features can be controlled: models, groups, dashboards, Data Domains, connector Agents, and connector Jobs.

Licenses and local role permissions interact to determine what actions a user can perform in specific situations.

The table below demonstrates this interaction through the example of licence types and roles assigned on a particular model.

{% hint style="success" %}
The possible roles that can be assigned on a model are **Owner**, **Author**, **Viewer**, and **Approver**.
{% endhint %}

<figure>Users must have licence capabilities to perform actions permitted by Model Roles<figcaption><p>Users must have licence capabilities to perform actions permitted by a model role</p></figcaption></figure>

{% hint style="success" %}
The key point

A local role cannot give users capabilities that are not granted by their licence, while licensed capabilities cannot be exercised in particular scenarios if a role does not permit them.
{% endhint %}

For example:

* If someone is licensed as a Read-only user, assigning them the Author or Owner role on a Model will not allow them to own, edit, or Fork the Model.
* If a user is licensed as an Author, they still must have either Author or Owner role permissions on a particular Model to edit it.

{% hint style="success" %}
For information on the Owner, Author, Viewer, and Approver **model roles** and what capabilities are permitted by each role, see [model roles and permissions.](/models/share-and-collaborate/model-roles-and-permissions)
{% endhint %}

### The Site Admin Role

If you are an administrator for your Solidatus instance, you may have come across the Site Admin role on the [Admin interface](/account-management/admin).

The Site Admin role is not a licenced role in Solidatus; it is a purely administrative role. Site Admins have administrative capabilities that allow them to manage users and configurations for the Solidatus environment on the `Admin` page, but it does not grant capabilities inside the application.

To read more about the Site Admin role, how to assign it, and what capabilities it gives, see our [Solidatus administration](/account-management/admin) documentation.
