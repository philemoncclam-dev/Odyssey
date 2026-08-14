# Groups

Groups let you to share models, tasks, data domains, agents, and jobs with collections of other users at once. They work like distribution lists for sharing and managing permissions across Solidatus functions and features.

{% hint style="success" %}
Groups can be created by a Solidatus administrator on the [Admin page](/account-management/admin#groups) or by individual users who can then invite others to join. Note that adding many users to a group at the same time is best done through the [Admin page](/account-management/admin#groups).
{% endhint %}

## What groups are

Groups are a crucial tool for effective, collaborative use of Solidatus in an enterprise. With groups, you can share models, data domains, tasks, agents, or jobs with entire teams or departments at once and manage permissions at the team level.

A group can have one member or the entire organisation (for example, an "All Staff" group). Group admins can easily [add](#invite-users-to-join-a-group) or [remove](#remove-members-from-a-group) other members (including themselves).

There are also [roles and permissions within a group](#group-roles-and-permissions): not everyone in a group can invite members, change settings, or assign roles to other members.

## Open and navigate groups

To open groups, click **GROUPS** in the top navigation bar.

<figure><figcaption></figcaption></figure>

From there, you can view all groups you belong to or open a specific group.

{% hint style="info" %}
When you select All Groups, you only see groups you belong to, not every group in your organisation.
{% endhint %}

You can only open a group you belong to, and there are several ways to do so:

* Click **GROUPS** in the top navigation bar, then click the group's name, or click the group's name from your All Groups page.
* From a model shared with the group, click the group's name in the **PEOPLE** list on the Summary page of the [Model Overview](/the-user-interface/models-ui/model-overview).
* If you have **starred** the group, click its name in the **Favourite groups** section in the [Model Browser](/the-user-interface/models-ui/model-browser).

## Create and join groups

To create a group:

1. Click **GROUPS** in the navigation bar, then select All Groups.
2. Click **CREATE GROUP** at the top right of the Groups page. Then add a name and description in the next dialog and click **CREATE**.

<figure><figcaption></figcaption></figure>

3. After creating the group, you are taken to its empty [Group Overview](#the-group-overview). From there you can invite others to join: click the **ACTIONS** menu in the top right corner, then click **+Invite To Group**.

<figure><figcaption></figcaption></figure>

### Add members to a group

If you are a group **Admin**, you can invite users to join from the Group Overview page. They become members after they [accept the invitation](#join-a-group).

If you are a Solidatus environment admin, you can add users to a group directly (without invitation) via the [Groups section of the Admin page](/account-management/admin#groups).

#### via the Group Overview

If you are [group Admin](#group-roles-and-permissions), you can send someone an invitation to join from the [Group Overview page](#the-group-overview-page):

1. Find the **ACTIONS** button at the top right of the Group Overview, then select **Invite To Group**.
2. Click in User field and starting typing a user's name or email address to filter the list. You can click a user to select them or simply enter their email address in full (this must be the email they are registered to Solidatus with).

<figure><figcaption><p>The user invite dialog. Click on role names to enable or disable them. Click on an information icon to see the definition of a role.</p></figcaption></figure>

3. Choose the roles to grant by clicking the pencil icon next to **Group roles**, then selecting roles in the popup.

   The **approver** role is only available if the [**require approval when sharing**](#approve-models-when-sharing-with-a-group) setting is enabled for the group.
4. Finally, click **INVITE**.

The invited user is notified and can accept or decline the invitation either from the bell notification icon in the navigation bar or by going to **GROUPS** and selecting **All Groups**.

#### via the Admin page

A Solidatus environment admin can also add users to a group through the [**Groups** section on the Admin page](/account-management/admin#groups). Note that this method does not require an invitation to be sent and accepted; adding users to groups via the Admin page automatically adds them to the group.

<figure><figcaption></figcaption></figure>

Navigate to the **Groups** section in the sidebar along the left, then click the name of the group you'd like to add members to.

Then click **+Add users** and start typing a user's name or email address to filter the list. Click a user's name to add them to the group, then click **SAVE** when you're finished.

<figure><figcaption></figcaption></figure>

### Join a group

The **All Groups** page shows your groups and an **Invitations** section for pending group invitations.

You can only join an existing group via an invitation from a member with admin permission to add new members. When you are invited, the group appears under **Invitations** and you can click **JOIN** to accept or **DISMISS** to decline.

<figure><figcaption><p>The Groups page</p></figcaption></figure>

{% hint style="success" %}
Group invitations are also shown using an envelope icon in the **Favourite groups** section of the [Model Browser](/the-user-interface/models-ui/model-browser).
{% endhint %}

From this page, you can also create a new group or access the Group Overview for your existing groups by clicking their name in the list.

## Share items with groups

To share something with a group, you must:

* Have permission to share the item (typically be an **owner** of the model, domain, agent, or job).
* Have an [Admin](#group-roles-and-permissions) or [Publisher](#group-roles-and-permissions) role in that group.

You share with groups from the permissions settings on models, data domains, agents, and jobs, not from the [Group Overview](#the-group-overview) page. However, Admins can remove shared items from a group on the Group Overview.

When you share something with a group, all members receive the same access at the level you assign to the group; you cannot share with or set permissions for a subset of members of a group (but you can always create a new group with only a subset of members of another group).

To share with a group, open the permissions settings for the item, click **+Add user/group**, start typing the group’s name, select it, and assign a role.

* For a model, go to the Settings tab on the [Model Overview](/the-user-interface/models-ui/model-overview)
* For a Data Domain, go to the [Domain settings](/data-domains/build-data-domains/edit-data-domains)
* For an agent, go to the Settings tab on the [Agent Overview](/connectors/connectors-overview/agents#agent-overview)
* For a job, go to the Settings tab on the [Job Overview](/connectors/connectors-overview/jobs#job-overview)

There are further ways to share a model with a group:

* **From the** [**Model Overview**](/the-user-interface/models-ui/model-overview) of the model you are sharing, click the **ACTIONS** dropdown menu at the top right and choose **Manage Sharing**. Click **+Add user/group**, start typing the group's name until the group appears in the list, then click its name. If its name appears under the **+Add user/group** button, the sharing is complete and you can close the dialog.

<figure><figcaption><p>Share a model with a group</p></figcaption></figure>

* **From the** [**Model Browser**](/the-user-interface/models-ui/model-browser), click the checkbox next to models you want to share, then click **SHARE** in the blue toolbar that appears above the model list. Click **+Add user/group**, start typing the group's name until the group appears in the list, then click its name. If its name appears under the **+Add user/group** button, the sharing is complete and you can close the dialog.

### See what's shared with a group

Group members with a [Model Access role](#group-roles-and-permissions) can view models, domains, agents, and jobs shared with the group. Models you have access to via a group also appear in your main [Model Browser](/the-user-interface/models-ui/model-browser) list in the same way as models you have access to via individual ownership and sharing.

You can view everything shared with a specific group on the group's [Group Overview](#group-overview) page.

There are three ways to access a Group Overview and see items shared with that group:

* Access the [Groups page](https://docs.solidatus.com/models/share-and-collaborate/groups) through the Navigation Bar and click on the name of a Group
* Go to the Model Overview of a model shared with a group and click the group's name in the **PEOPLE** section of the Model Overview
* If you **star** a group on the [Group Overview](#the-group-overview), it appears in the **Favourite groups** section in the right-hand [sidebar](https://docs.solidatus.com/the-user-interface/models-ui/model-viewer/model-viewer-sidebar) in the Model Browser. Just click the name of a group to go to its Group Overview.

Note that is possible for a group administrator to [require approval before a model is published](#approve-models-when-sharing-with-a-group) to a group. If this setting is active, once a model is shared, it must then be approved before it appears on the Group Overview.

### Approvals when sharing with a group

{% hint style="info" %}
This section is only relevant for groups that have been set to **require approval when sharing**.
{% endhint %}

Group admins can enable **require approval when sharing** to add a review step before models become visible to group members.

When this setting is active, an **approver role** is available to assign to group members. Shared models must be approved by an approver before members with **Model Access** can see them.

To enable the **require approval when sharing** setting:

1. Navigate to the Group Overview
2. Click **ACTIONS** at the top right, then select **Edit Group Information**
3. Enable **require approval when sharing**
4. Click the **UPDATE SETTINGS** button

<figure><figcaption></figcaption></figure>

Approvers can see a list of pending models at the top of the [Group Overview](#group-overview) and can reject or accept those models into the Group.

<figure><figcaption></figcaption></figure>

### Remove shared items from a group

Group Admins can remove items shared a with group from the Group Overview, even if they were shared by other members.

To do so, click the **bin icon** on the right side of the row of a shared item:

<figure><figcaption></figcaption></figure>

## The Group Overview page

The Group Overview is the control centre for a group. It allows you to:

* see members of the group and all models, agents, jobs, and activities shared with the group
* open a shared model, agent, job or activity by clicking its name
* remove a model from the group (if you are a **Publisher** or **Admin**)
* **star** a group to add it to your list of **Favourite groups** in the [Model Browser](/the-user-interface/models-ui/model-browser)
* [invite a user to join](#inviting-users) the group
* edit the group's name, description, and settings

Here is a sample Group Overview for a group that has shared models, agents, jobs, and activities.

<figure><figcaption><p>The Overview for a Group</p></figcaption></figure>

{% hint style="success" %}
If the name of a model, agent, job, or activity has been truncated, hover your mouse over the name and it will be expanded.
{% endhint %}

In the **Members** section, you can see all group members and their access roles, including invited users who have not yet accepted their invitations (their entries have a grey cast and an hourglass icon).

<figure><figcaption><p>Two users haven’t accepted their invitation yet</p></figcaption></figure>

If you’re not an admin of a group, you are not able to see the names of invited users until they accept their invitation.

<figure><figcaption><p>Names of invited users do not appear to non-owners</p></figcaption></figure>

If you’ve invited someone who hasn’t yet set up their account, you’ll see a question mark next to their name.

<figure>An invited user hasn&#x27;t set up their account<figcaption><p>An invited user hasn't set up their account</p></figcaption></figure>

### Manage group settings

Click **ACTIONS** and then **Edit Group Information** to open the group settings dialog.

<figure><figcaption><p>The Group settings dialog (Hover over the info icons for descriptions)</p></figcaption></figure>

Here you can update the group’s name or description and enable or disable two key group settings:

**Require approval when sharing:** causes any models shared to enter a pending state where they are NOT visible by group members until a user with the **Approver** role approves them.

**Private membership:** If enabled, group members are only visible to group **Admins** and not to other members.

## Group roles and permissions

Group roles control what members can do within a group. They are separate from [model roles](/models/share-and-collaborate/model-roles-and-permissions) or [licence capabilities](/account-management/licences-capabilities-and-roles).

**Important**: **Model Access** must be assigned explicitly. Without it, group members with **Publisher**, **Approver**, or **Admin** roles cannot see models, domains, agents, or jobs shared with the group.

<table data-header-hidden data-full-width="false"><thead><tr><th width="151.11346435546875"></th><th></th></tr></thead><tbody><tr><td><strong>Model Access</strong></td><td>Allows the user to see the list of models, agents, and jobs published to the group. Users can then access those models using the model role assigned to the group.</td></tr><tr><td><strong>Publisher</strong></td><td>Publishers can publish a model to the group (ready for approval if required). Models are published to a group by sharing them with the group via the Model Overview.</td></tr><tr><td><strong>Approver</strong></td><td>If <strong>require approval when sharing</strong> is enabled for the group, when a user publishes a model, agent or job to the group, it will need accepting by an approver before being visible to users with the Model Access role. The Approver role is automatically granted to the Admin user that enables <strong>require approval when sharing</strong>.</td></tr><tr><td><strong>Admin</strong></td><td>Admins can invite members to the group, change group settings, and assign any of the available roles to other members.</td></tr></tbody></table>

{% hint style="warning" %}
Solidatus does **not** automatically grant **Model Access** to members with other roles.

For example, a **Publisher** without **Model Access** can publish models to the group but cannot see the list of models, agents, and jobs.
{% endhint %}

If the only admin in a group removes their admin role (accidentally or on purpose), or the admin user's account is disabled or deleted, you will need to ask an administrator of your Solidatus instance to assign a new admin user via the [Groups section on the Admin page](/account-management/admin#groups).

### **Effective roles across groups**

Users can be members of multiple groups, each with a different role on the same model, domain, agent, or job. They can also have a role assigned directly to their individual user account.

When this happens, the user’s **effective role** is the **highest role** assigned to them across their individual account and all of their groups. On a model, roles are ordered as follows: **Viewer < Approver < Author < Owner**.

For example, say User X has Model Access in both Group 1 and Group 2. Group 1 has the **Viewer** role on *Banking Lineage Model* (no editing), and Group 2 has the **Author** role on the same model (editing allowed). In this case, User X can edit *Banking Lineage Model* because their effective role is **Author**, the highest of their assigned roles.

## Manage group membership

### Remove members from a group

{% hint style="warning" %}
When you remove a user from a group, any models they published remain visible to the group, and if another group member has forked models shared with the group by the removed user, the forks remain accessible.
{% endhint %}

#### via the Group Overview

Group admins can remove members from a group via the **EXIT** icon next to the user's name in the list of members. Note that admins can remove any other member, including other group admins and including themselves.

<figure><figcaption></figcaption></figure>

#### via the Admin page

A Solidatus environment admin can also remove users from a group through the **Groups** section on the Admin page.

<figure><figcaption></figcaption></figure>

Navigate to the Groups section in the sidebar along the left, then click the name of the group you'd like to remove members from.

Then click the bin icon next to the names of users you would like to remove, and finally click SAVE.

<figure><figcaption></figcaption></figure>

### Delete a group

You cannot permanently delete a group from a Solidatus environment.

A group admin or Solidatus environment admin can remove all members from a group, which effectively hides it from the user interface. The group remains listed under **Groups** on the Admin page and can be reinstated at any time by [adding members](#via-the-admin-page) again.

To remove all members from a group [via the Group Overview](#via-the-group-overview), a group admin must remove all other members and then finally remove themselves.

Alternatively, a Solidatus admin can access a group's settings [via the Admin page](#via-the-admin-page) and then remove all members.
