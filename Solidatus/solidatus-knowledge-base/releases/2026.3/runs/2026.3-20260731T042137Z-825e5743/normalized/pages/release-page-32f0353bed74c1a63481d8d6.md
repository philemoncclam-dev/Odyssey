# Model Overview

The Model Overview can be thought of as the control centre for a Solidatus model. It stores activities and displays full revision history, allowing you to view, compare, and restore previous versions of a model.

<figure><figcaption><p>The Model Overview</p></figcaption></figure>

Many functions can be performed and accessed from the Model Overview:

* [x] describe and tag your model,
* [x] launch the [Lineage Explorer](/models/explore-and-analyse-models/lineage-explorer) or [Graph Explorer](/models/explore-and-analyse-models/graph-explorer),
* [x] share your model with other users,
* [x] change model settings and permissions,
* [x] create [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks) and [Forks](/models/build-and-edit-models/forks),
* [x] export and import,
* [x] view revision history,
* [x] launch a comparison between past revisions,
* [x] restore previous revisions,
* [x] or see related Reference Models.

You can also view all entities in your model in a hierarchical fashion in the Entities tab.

{% hint style="success" %}
For a Reference Model, the Model Overview is slightly different. See [Reference Model Overview](/the-user-interface/models-ui/build-reference-models#reference-model-overview).
{% endhint %}

## Access the Model Overview

The Model Overview can be accessed from the Model Browser or the Model Viewer.

### From the Model Browser

You can open the Model Overview in two ways from the Model Browser:

1\) Click on the line (not the name) of a model entry in the model list to open a dropdown menu, then click `OPEN OVERVIEW`

<figure><figcaption></figcaption></figure>

2\) Click the three dots on the right-hand side of a model in the list and click `Open model overview`

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
If a model is a Reference Model, clicking on the model name in the list of models will open the Model Overview (for Lineage Models, this action will open the Model Viewer).
{% endhint %}

From the [Model Viewer](/the-user-interface/models-ui/model-viewer), you can access the Model Overview by clicking the model name in the [The Navigation Bar](/the-user-interface/the-navigation-bar).

<figure><figcaption></figcaption></figure>

***

## Model Overview layout

The Model Overview is organized into five main tabs, each serving specific purposes:

| Tab                                               | Primary Purpose                    | Key Features                                             |
| ------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| [Summary tab](#summary-tab)                       | Quick overview and recent activity | Model info, recent revisions, sharing controls           |
| [Entities (or Terms) tab](#entities-or-terms-tab) | Browse and analyze model content   | Hierarchical view, entity details, relationship tracking |
| [Revisions tab](#revisions-tab)                   | Version control and history        | Compare versions, restore states, track changes          |
| [Activities tab](#activities-tab)                 | Collaboration workflow management  | Tasks, pull requests, approvals, discussions             |
| [Settings tab](#settings-tab)                     | Configuration and permissions      | User access, approval workflows, model policies          |

{% hint style="success" %}
The Model Overview is slightly different for a lineage model, reference model, or model fork. These difference are described in the relevant sections below.
{% endhint %}

### Open models

<figure><figcaption></figcaption></figure>

You can open the model in any of the visualisation modes through the Model Overview.

Click <mark style="color:red;">`OPEN`</mark> to open the model in the Model Viewer.

Click the dropdown arrow to the right of <mark style="color:red;">`OPEN`</mark> to visualise model content in either the Model Viewer, Graph Explorer, or Lineage Explorer.

### Actions menu

The *Actions* menu provides key model-level actions, such as importing, exporting, deleting, editing model info, and forking the model.

<figure><figcaption></figcaption></figure>

Note that the actions available in the menu depend on your highest model role, and the menu is not visible if your only role is *Approver*.

If you are on a Consumer licence, you will not see the Actions button in the Model Overview.

*Viewers* can execute the following functions:

<table data-header-hidden><thead><tr><th width="168"></th><th></th></tr></thead><tbody><tr><td>Fork</td><td>Create a <a href="/pages/4APQteop2Na8y2ahaTeg">Fork</a> of the model (if the viewer has an author licence)</td></tr><tr><td>Export</td><td>Export the model as a Solidatus ‘<em>SOL</em>’ file that includes all entities in the Model, as well as the Display Rules, Filters and Views, and linked Reference Models. Exporting to BSON (deprecated) downloads a file of the model in an old (unsupported) format.</td></tr></tbody></table>

*Authors* hcan execute the following additional capabilities:

<table data-header-hidden><thead><tr><th width="166"></th><th></th></tr></thead><tbody><tr><td>Import</td><td>Import a Solidatus SOL file to <strong>replace the model contents</strong>. Also provides a link for importing a BSON file.</td></tr><tr><td>Diff with model</td><td>Allows owners and authors to compare the model with any other model they have access to (see <a href="/pages/N3mqoHdPINAdPAIv2zIe">Diff Mode</a>).</td></tr></tbody></table>

*Owners* can execute the following additional capabilities:

<table data-header-hidden><thead><tr><th width="225"></th><th></th></tr></thead><tbody><tr><td>Manage Sharing</td><td>Lists users and Groups the model is shared with, as well as read-only link shares; enables you to remove users or Groups or add them as Viewers - you can change their roles on the <a href="#settings-tab">Settings tab</a>; you can also edit, copy and delete read-only link shares (they’re at the end of the list of users and Groups)</td></tr><tr><td>Edit model information</td><td>Opens a dialogue where you can change the name and description of the model, <a href="/pages/SCRB2l0xgN7XAhDaH1km">edit model tags</a>, prevent forking by other users (this does not prevent model owners from forking the model), and ensure that users of the Lineage Explorer cannot update the model Viewer gives you a choice of formats, and only includes model entities</td></tr><tr><td>Delete</td><td>Delete the model (this cannot be reversed)</td></tr></tbody></table>

## Summary tab

The <mark style="color:red;">`Summary`</mark> tab presents information about the model itself, including a list of revisions, links to current Activities, users or Groups the model has been shared with, and the ability to edit the model information.

<figure><figcaption><p>Model Overview Summary Tab</p></figcaption></figure>

You can share the model with other users by clicking on the *Share* button on this tab - this assigns them the *Viewer* role - if you want these users to have a different role, click on the *Edit* button to go to the *Settings* tab.

### Comparisons possible from the Summary tab

From the summary tab, there are a number of ways to compare various versions of a model. You can compare:

* a past revision to the current state of the model
* a past revision to the previous revision
* any two past revisions
* a fork with its parent model (only if the model is a fork)
* a fork with the state of the parent model when the Fork was created (only if the model is a fork)

You can also restore a previous revision — don't worry, this doesn’t delete newer versions, it creates a new revision with the restored content and preserves the history of changes.

#### **From the revisions list**

A list of revisions of the model is shown on the Summary tab, with the most recent revision at the top.

You can open a visual comparison between any two revisions by clicking on the **ACTION** button next to a revision.

* **View changes at revision** : compares the revision to the previous revision
* **View changes since revision** : compares the revision to the current state of the model
* **Compare with…** : allows you to select any other revision to compare with

Revisions shown in the `SUMMARY` tab are tagged when they result from specific types of activities and model edits: Pull Requests, Import Model Updates, Merged Tasks, User changes, Parent Model Changes, or updates from Connector jobs.

For completed activities, the tags are clickable links that take you to the relevant [activity page](https://ci-rc.solidatus.dev/help/collaboration/activities/activities.html).

<figure><figcaption><p>Revisions Tags indicate the type of change made to a model</p></figcaption></figure>

#### **From the Summary tab of a fork model**

For a model fork, the Summary tab provides an overview of the differences between the fork and the parent Model.

<figure><figcaption><p>Messages on Overview Summary Tab</p></figcaption></figure>

* Click **VIEW ACTIVITY** on the tile that indicates the fork is out of sync with the parent to compare a fork with the current version of its parent model. This takes you to the activity page for the Parent Model Changes, where you can click **VISUAL MERGE** to see the differences between the two models in Diff mode.
* Click the **{#} revisions** link on the tile to open a visual comparison in Diff mode of the current state of the parent model with the state of the parent model when the fork was created.

<figure><figcaption></figcaption></figure>

### Referenced models and Data Domains

The Summary tab also provides a list of all related Reference Models and Data Domains to which to the model has been published.

<figure><figcaption></figcaption></figure>

The number next to a Referenced model tells you how many Reference Relationships there are to terms in the model.

Click on the name of a model to open the Model Overview for a Reference model or the listed Data Domain (these open in the **same** browser tab).

## Entities (or Terms) tab

The `Entities` tab presents the Model contents as a hierarchy with access to information about the individual entities that make up the Model. If the Model is a Reference Model, the tab is called `Terms`.

<figure><figcaption><p>Model Overview Entities Tab</p></figcaption></figure>

Click on `Go to entity` to open the Model Viewer, focused on the current entity.

In the `Relationships to reference model terms` section, click on the name of a referenced term to open the Model Overview for the reference model, focused on that term (in a new browser tab).

The `History` section lists all the revisions in which the entity was created or amended - click on an entry to see the changes made to the entity in that revision. It shows the *before* (left) and *after* (right) values.

After selecting the entry, you can de-select *Only show differences* to show all property values and relationships for the entity.

<figure><figcaption><p>What happened to an entity in a revision</p></figcaption></figure>

The `Branches` section lists all the Forks and Tasks containing the entity, as well as the parent Model - it will only show the Branches that you have access to. The Model name is a link - click on one to open the Model in the Model Viewer, focused on that entity. By default, Tasks will open in the same tab, Forks will open in a new tab. Alternatively, click elsewhere in the entry for a Branch to see the entity properties in that Branch - by default it will be limited to showing the differences between the entity in the current Model and the entity in the other Branch.

<figure><figcaption><p>Comparing an entity across branches</p></figcaption></figure>

The `Entity connectivity` section shows the entity and the direct connections to other entities in the model. Click on an entity to switch to that entity in the Entities tab.

## Revisions tab

When a model is saved, a new revision of the model is created. The <mark style="color:red;">`Revisions`</mark> tab presents a list of model revisions that the user can filter to show revisions by author or tag, or with certain text in the revision name (using the Search bar). You can tag individual model revisions if you need to distinguish them in some way, just note that the tags are visible to all users who have access to the model.

<figure><figcaption><p>Model Overview Revisions Tab</p></figcaption></figure>

Each revision in the list has three dropdown lists of commands - the same commands are also available on the <mark style="color:red;">`Summary`</mark> tab.

These commands allow the user to compare a revision with any other revision, to visualise and demonstrate change over time, and to restore a model to the state described by a revision - users are encouraged to contribute without fear of irreversible damage.

{% hint style="success" %}
Commands will only be visible if you have the necessary privileges to perform them.
{% endhint %}

### **View changes**

* view the changes made in this revision (compare the revision to the previous revision)
* view the changes made since this revision was saved (compare the revision to the current state of the model)
* Compare the revision with another revision
* Export the changes as a Solidatus JSON file

### **View model**

* open the revision (read-only) in the Model Viewer

  > * click on `Diff/Merge` to update the latest revision with content from this revision
  > * click on `Restore` to restore this revision as the latest one
  > * click on `Save as` to clone or Fork this revision
* open the revision (read-only) in the Lineage Explorer

### **Actions**

* export the revision as a ‘SOL’ file (a Solidatus JSON file that includes all entities in the Model, as well as the Display Rules, Filters and Views)
* restore the model to the state described by this revision (this does not rollback changes, it creates a new revision)
* copy the revision ID to the clipboard

You can read more on this topic at [Version Control](/models/build-and-edit-models/version-control).

{% hint style="success" %}
There is a quick way to access the *Revisions* tab from the Model Viewer - click on the clock icon in the `Model info` section in the [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar).
{% endhint %}

Revisions are tagged when they result from specific types of model edits: Pull Requests, Import Model Updates, Merged Tasks, User changes, Parent Model Changes, or updates from Connector jobs.

<figure><figcaption><p>Revisions Tags indicate the type of change made to a model</p></figcaption></figure>

## Activities tab

Solidatus provides a single workflow for managing collaboration among users, facilitating effective development of models. Solidatus also allows any user with visibility of the model to start a discussion about the model, ask a question, or just make a comment.

The Activities tab allows a user to see at-a-glance all in-progress updates for a model, such as changes made to an imported model or the parent model for a Fork, or changes submitted via a Task or a Fork.

All of the above are referred to as **Activities**, which are visible in the `Activities` tab on the Model Overview. A single lifecycle applies to all Activities, with variations according to the type of Activity. See [Activities](/models/share-and-collaborate/activities-and-activity-types/activities) for more information.

{% hint style="success" %}
The Activities tab does not display information about model changes made using the standard editing and saving workflow – you can see these (and more) listed on the `Revisions` tab.
{% endhint %}

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
To see an explanation of the parts of this dialogue, click on the `Help` button at the top-right corner and select the `Tour ..` option.
{% endhint %}

{% hint style="warning" %}
Creating a Task from the *Activities* tab will give the Task assignee access to the whole model (the same as a Fork) - you may prefer to create a Task using the [Model Viewer](/the-user-interface/models-ui/model-viewer), where the scope of a Task can be limited to selected entities or types of entities.
{% endhint %}

### Filtering and sorting the list of Activities

The list of Activities can be filtered and sorted using the *search bar* and dropdown options at the top of the list.

There are several filters available - each filter allows you to select one or more values to include. Activities will only appear in the list if they satisfy all of the filters.

For example, you may wish to filter the list to show only those activities that meet the following criteria:

```
State = “Ready to merge” OR “Open”           ß
   AND
Contributor = “Demo User1" OR “Demo User2”
   AND
search = “fork”
```

In the example below, the list has been filtered to show only Activities with the ‘ready’ tag and ‘fork’ in the Activity name.

<figure><figcaption><p>Filtering Activities by name and tag</p></figcaption></figure>

Only 2 of 12 Activities are visible - click on *Show all 12* to remove the filter

<figure><figcaption><p>More Activities to see</p></figcaption></figure>

In the example below, the *States* filter has been applied

<figure><figcaption><p>Filtering Activities</p></figcaption></figure>

#### **The following filters are available**

<table data-header-hidden><thead><tr><th width="218"></th><th></th></tr></thead><tbody><tr><td>Contributors</td><td>Users that have updated the Activity Model or merged the Activity Model into the parent Model</td></tr><tr><td>Assignees</td><td>Users that have been assigned to a Task (Assignees are also included as Contributors)</td></tr><tr><td>Type</td><td>Basic (such as a Discussion), Task, Pull Request, Import update, or Parent model changes</td></tr><tr><td>State</td><td>Open, Submitted, Changes requested, Ready to Merge, Closed, Merged. See <a href="/pages/ZUTLtoQZyqQtcoWEQGJS">Collaboration</a> for information about Activity lifecycles.</td></tr><tr><td>Tags</td><td>All the tags listed have been used for one or more Activities within the model. See <a href="/pages/SCRB2l0xgN7XAhDaH1km">Tagging</a> for information about Tags.</td></tr><tr><td>Awaiting my approval</td><td>View activities that have been submitted AND for which your approval has been requested</td></tr><tr><td>Unread Comments</td><td>View activities with comments that have not yet been read by you</td></tr></tbody></table>

#### **Sorting**

By default, the list shows the most recently modified Activities at the top. There are a number of alternative options available via the dropdown

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
When sorting by <mark style="color:red;">`Status`</mark>, Activities are sorted in the following sequence:

1. Ready to merge
2. Submitted
3. Changes requested
4. Open
5. Closed
6. Merged
   {% endhint %}

#### Working with an Activity in the list

Each entry in the list allows you to open the Activity and add tags to the Activity, as well as providing useful information about it.

* Status
* Activity Name
* The last action taken, who by, and when
* Tags (hover the mouse over an Activity and the *+ Edit tags* option appears - click this to edit tags)
* The number of comments there are (the blue icon indicates there are comments that you have not read)
* Who contributed to the Activity (made the changes, and/or merged them in to the model)
* Who is specifically nominated to approve the Activity (there may be other users who can approve the Activity)

<figure><figcaption><p>Information about an Activity</p></figcaption></figure>

## Settings tab

{% hint style="warning" %}
The Settings tab is only visible to model Owners.
{% endhint %}

The <mark style="color:red;">`Settings`</mark> tab allows you to edit the essential information about the model (including the type of [Reference Model](/models/understand-solidatus-models/reference-models-101)), to set permissions, to manage the approvals workflow, and to manage policies regarding model forking and the use of the [Lineage Explorer](/models/explore-and-analyse-models/lineage-explorer) as the default read-only display of the model.

### Information

The <mark style="color:red;">`Information`</mark> section enables you to edit the name and description of the model. To edit the *Notes* property for the model, see the *Model* tab in the [sidebar in the Model Viewer](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar).

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The model name and description can also be edited via the `Summary` tab - click on the `Edit` button in the *Description* box.
{% endhint %}

### Permissions

The <mark style="color:red;">`Permissions`</mark> section plays an important role in [Collaboration](/models/share-and-collaborate) - this is where you assign and remove permissions. When checking what capabilities a usr has on a model, Solidatus will take the union of all the capabilities provided to them, whether assigned directly to that user or to one or more [Groups](/models/share-and-collaborate/groups) that the user is a member of. The Model Overview provides a checkbox called `Show inherited roles` so you can see the most privileged role each user has on the model.

<figure><figcaption></figcaption></figure>

See [Model Roles and Permissions](/models/share-and-collaborate/model-roles-and-permissions) for information about Roles in Solidatus.

{% hint style="success" %}

* You cannot delete the last Owner of a model or reduce their permissions; if you want to remove that Owner’s access to the model, you must assign another user as the Owner first
* Don’t be surprised if the user you’re looking for does not appear when you click on `Add user/group` - for privacy reasons this will only show users who are “visible” to you - i.e. they are in the same group as you or you’ve shared models with them before. You can add a ‘non-visible’ user by typing in their email address. This privacy shield can be disabled by an Admin user.
  {% endhint %}

### Activities

The <mark style="color:red;">`Activities`</mark> settings allow model Owners to define the approval and merging requirements for each type of Activity.

{% hint style="success" %}
You can disable Import Update Activities unchecking the *Subscribe to* box, which will prevent you from receiving notifications when imported content has been edited in the original, imported Model.
{% endhint %}

The *Subscribe to* box is only available for Import Update Activities.

Disabling Import Updates prevents future Activities from being created (it does not affect existing Activities). If you re-enable Import Updates, any missing Activities are created automatically.

<figure><figcaption><p>Settings for Model Activities - click ‘Manage’ to change the settings for a type of Activity</p></figcaption></figure>

{% hint style="success" %}
The option to set <mark style="color:red;">`Conflict Preference`</mark> only applies to a specific, unlikely scenario in which both a Parent and a Task/Fork have imported the same entity from another Model, but have put it in a different place. In such a scenario, Auto-merge will not know which entity (or entities) to take.

Selecting <mark style="color:red;">`Current`</mark> or <mark style="color:red;">`Incoming`</mark> will only apply to such a scenario, and it will select either the entity in the model you are merging into (current) or the entity in the model that is being merged (incoming).
{% endhint %}

See [Approvals Workflow](/models/share-and-collaborate/approvals-workflow), [Auto-merge](/models/share-and-collaborate/activities-and-activity-types/auto-merge), and [Diff Mode](/models/build-and-edit-models/diff-mode) for more information.

### Advanced model settings

The <mark style="color:red;">`Advanced`</mark> section allows you to delete the Model, and provides two settings that affect how the Model how can be used.

<table data-header-hidden><thead><tr><th width="194.48587036132812"></th><th></th></tr></thead><tbody><tr><td><strong>Prevent forking</strong></td><td>Prevents users (apart from model owners) from forking the model - this does not affect any existing forks</td></tr><tr><td><strong>Always Open in Lineage Explorer</strong></td><td>Forces read-only users to open the model in the Lineage Explorer instead of the Model Viewer</td></tr></tbody></table>

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The model name and description, plus the two settings listed above, can also be edited via the `Summary` tab - select the `Edit` button in the *Description* box.
{% endhint %}

#### **Additional setting for forks**

If the Model is a Fork, an additional setting for **automatically creating pull requests** is available in the Advanced model settings.

<table data-header-hidden><thead><tr><th width="196.11441040039062"></th><th></th></tr></thead><tbody><tr><td><strong>Automatically Create Pull Requests</strong></td><td>A Pull Request will automatically be submitted every time a revision of this Fork is saved. If the most recent Pull Request is still in the ‘Ready to merge’ or ‘Submitted’ state, the two Pull Requests will be combined; otherwise a new Pull Request will be created.</td></tr></tbody></table>

## Next Steps

* [Model Viewer](/the-user-interface/models-ui/model-viewer) - Your canvas for building and editing models
* [Collaboration](/models/share-and-collaborate) - Share your models and your model work
* [Version control](/models/build-and-edit-models/version-control) - Understand revisions and revision management
* [Model roles](/models/share-and-collaborate/model-roles-and-permissions) - Manage model access and permissions
