# Version control: forks and pull requests

Forks are a core part of Solidatus’ version control capabilities. They enable users to create working branches of models, so they can edit a copy of a model in isolation from the original model, then submit proposed changes to the owner(s) of the original model for review.

This page explains how forks work, how to create them, and how to submit and merge changes to the parent model via pull requests.

See [pull requests](/models/share-and-collaborate/activities-and-activity-types/pull-requests) for more detail on the process of reviewing and merging changes submitted from a fork.

## What is a fork?

A fork is a complete or partial copy of a model that is linked to the parent model from which it branched. A fork allows a user or group of users to work on a model in a separate, “sandboxed” workspace, and to merge edits back into the original, parent model via **pull requests**.

A fork is not a revision of a model. A fork is a separate model that can be edited independently of the parent model.

Changes made in a fork do not affect the parent model until they are submitted via a pull request and merged by an owner or author of the parent model, possibly after a required approval process.

{% hint style="success" %}
Entities in forks (and clones) have the same entity IDs as the entities original models they were copied from.
{% endhint %}

A **pull request** is a request to owners and authors of the parent model to review and merge changes made in the fork into the parent model. Pull requests are created from within the fork, and they appear on the Activities tab of the parent model after they are submitted.

The link a fork maintains to its parent model enables you to:

* sync a fork to keep it up to date with updates to the parent model
* submit a pull request to merge changes into the parent model when you’re ready

{% hint style="success" %}
You can detach a fork from the parent so that it becomes an independent model, no longer able to exchange updates with the parent. See [Detach forks](#detach-forks) below for more information.
{% endhint %}

#### **Forks vs. other collaboration methods:**

| *Method*           | *Best For*                                             | *Key Characteristics*                               |
| ------------------ | ------------------------------------------------------ | --------------------------------------------------- |
| **Forks**          | Independent work, experimentation, and major revisions | Full or partial model branch, pull request workflow |
| **Tasks**          | Delegated assignments, scoped work                     | Owner-controlled, specific entity focus             |
| **Direct editing** | Quick changes, trusted collaborators                   | Immediate model updates, no review                  |

{% hint style="success" %}
Forks are different from [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks), where a model owner or author delegates work to others, in that a fork persists alongside the parent model even after changes have been merged, and a fork can be repeatedly edited and merged into the parent.
{% endhint %}

## The fork workflow

**Complete fork lifecycle:**

1. **Create**: Copy the parent model (complete or partial)
2. **Work**: Make changes independently in your fork
3. **Sync**: Update your fork with parent model changes (optional and **not recommended** if the fork is used for importing via a connector)
4. **Submit**: Create a pull request with your changes
5. **Review**: Parent model owners or authors review and merge changes
6. **Maintain**: Keep fork updated, continue editing, detach, or delete when finished

<figure>Fork workflow diagram with pull requests and parent synchronisation<figcaption><p>Fork workflow diagram with pull requests and parent synchronisation<a href="https://ci-rc.solidatus.dev/help/design/forks.html#id2"></a></p></figcaption></figure>

**Key principles:**

* Changes to forks don’t automatically affect the parent model
* Changes flow through pull requests for review and approval
* Parent model updates can be selectively merged into forks
* Multiple forks of the same parent model can exist

{% hint style="success" %}
You can also automate pull request creation on the fork and pull request merging on the parent model. See [automate pull requests](#automate-pull-requests) below.
{% endhint %}

## Detailed summary of fork actions

#### **In the parent model**

1. Create the fork

#### **In the fork**

1. Open the fork and make changes
2. Save the changes
3. If there are any updates in the Parent model (see the Model Overview for the fork), update the fork (**unless the fork is used for importing via a connector**, then do not sync the fork with the parent model)
4. Create a pull request from the `Summary tab` on the Model Overview of the fork - the pull request then appears on the `Activities tab` for the parent model with *Ready to merge* status.

#### **In the parent model**

1. Open the pull request from the Activities tab in the Model Overview
2. Click on the `Visual merge` button to review the differences in [Diff mode](/models/build-and-edit-models/diff-mode)
3. Save the changes you want to save, then save the model
4. The status of the pull request changes to *Merged*

## Model Overview of a fork

The [Model Overview](/the-user-interface/models-ui/model-overview) for a fork provides the same features as the Model Overview for the parent model, with the exception of the ‘forked from’ section, which provides information on the relationship between the original model (the **parent**) and the fork.

The following images illustrate the information available via this section.

***

**Initial state**

<figure>No parent changes to merge, and no unsubmitted changes in the fork<figcaption></figcaption></figure>

| The left-hand box provides information about changes to the Parent model that have not been merged into the fork. In this example there are no parent changes to merge - the parent model has not been saved since the fork was created or since the last set of Parent changes were merged. | The right-hand box provides information on changes to the fork that have not been merged into the parent model. The box shows the number of submitted and unsubmitted changes. In this example, there are no unsubmitted changes in the fork. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

***

**After saving the fork for the first time**

<figure>A pull request can be created from the Model Overview<figcaption></figcaption></figure>

| There are no parent changes to merge. | The fork has been saved once since it was last submitted to the parent model.         |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
|                                       | Click on the `Submit 1 change` button to submit the change and create a pull request. |

***

**A more complex scenario with changes in both directions**

<figure>Submitted changes, and unsubmitted changes<figcaption></figcaption></figure>

| The parent model has been saved 10 times since it was last merged into the fork.                                                                                 | A pull request (containing two revisions of the fork) has been submitted but not yet merged into the parent model, and the fork has been saved once since the pull request was created. |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Click `10 revisions` to examine the changes made in the 10 revisions of the parent model.                                                                        | Click `2 submitted` to examine the changes that are included in the pull request.                                                                                                       |
| Click `View activity` to open the [Parent Model Changes](/models/share-and-collaborate/activities-and-activity-types/parent-model-changes) Activity in the fork. | Click `1 unsubmitted` to examine the changes made since the pull request was submitted.                                                                                                 |
|                                                                                                                                                                  | Click `View activity` to open the pull request in the parent model.                                                                                                                     |
|                                                                                                                                                                  | Click on `Submit 1 change` to submit recent changes by including them in the existing pull request.                                                                                     |

If you no longer have permission to view the parent model to which a pull request has been submitted, or it has been deleted, the `View Activity` button will be inactive.

When you hover your mouse over the `View Activity` button, you will see the message **Parent model has been deleted or is no longer shared.**

You can continue working on the fork, but you will not be able to submit changes to the parent model.

## Create a fork

{% hint style="success" %}
You must have an Author licence and at least a Viewer role on a model to create a fork of it. The user who creates the fork becomes the owner of the fork.
{% endhint %}

You can create a fork of any model that is shared with you, unless forking has been disabled for that model. Forks can be created on the Model Overview or within the Model Viewer of the parent model.

* A fork created via the Model Overview will be a **complete** copy of the model
* A fork created via the Model Viewer can be a **complete** *or* **partial** copy of the model

### **Create a fork via the Model Overview**

Open the `Actions` drop-down menu, select `fork`, then complete the form and press `Save`. You may like to change the suggested name for the fork, revise the tags, and provide an appropriate description. You may also want to share the fork with one or more groups.

Apart from the name and any changes made to the model description and tags, the new model will be an exact copy of the parent model. The user that forked the model will be the owner; the fork will not inherit any of the activities or users from the parent model.

Unless you share the fork with other users, no one else will have any access to the fork

<figure>Creating a fork in the Model Overview<figcaption><p>Creating a fork in the Model Overview</p></figcaption></figure>

### **Create a fork via the Model Viewer**

To create a fork in the Model Viewer, click on ‘Save As’ in the toolbar, then select `fork`. You may like to change the suggested name for the fork, revise the tags, and provide an appropriate description. You may also want to share the fork with one or more groups.

Apart from the name and any changes made to the model description and tags, the new model will be an exact copy of the parent model. The user that forked the model will be the owner; the fork will not inherit any of the activities or users from the parent model.

If you want the fork to contain just part of the parent model, here’s how to do it:

* in your model, select the model entities you would like to include in the fork
* follow the instructions above to open the `fork` dialogue
* select the `Partial Save` option
* click on `Create fork`

<figure>Creating a fork in the Model Viewer<figcaption><p>Creating a fork in the Model Viewer</p></figcaption></figure>

{% hint style="warning" %}
Unless you share the fork with other users, nobody else will have any access to the fork.
{% endhint %}

## Synchronise with the parent model

While you’re working on a fork model, other users are likely to be working on the parent model. When they save changes to the parent model, and the changes affect the scope of your fork, a [parent model changes activity](/models/share-and-collaborate/activities-and-activity-types/parent-model-changes) is raised for the fork.

This activity is visible on the **Summary** tab of the fork. It informs you that the parent model has changed and invites you to synchronise the fork with the latest version of the parent model.

<figure><figcaption></figcaption></figure>

Click the **VIEW ACTIVITY** button to open the activity. You can then review and merge changes made to the parent model since you last synced your fork.

It is often good practice to update your fork model with parent model changes before submitting a pull request **unless the fork is used for importing via a connector**.

{% hint style="success" %}
If the fork is used with a connector **do not sync the fork with the parent model** as this results in any design changes to the layout of the parent model being overwritten by the next pull request. See [Model Topology](/solidatus-best-practice/model-topology) for more information.
{% endhint %}

## Submit a pull request

Once you have made the desired changes, they can be submitted to the owner(s) of the parent model to be considered for inclusion. This is done by clicking the `Submit change` button on the `Summary` tab on the Model Overview. This creates a pull request on the parent model.

<figure><figcaption></figcaption></figure>

## Automate pull requests

There are two points at which you can introduce automation within a fork workflow:

* Automatically create pull requests when a new revision is created on the fork model
* Automatically merge pull requests into the parent model

{% hint style="success" %}
Introducing automation saves time and effort, but it also removes potential layers of review and approval.
{% endhint %}

### **Automatically create pull requests**

Turning on **Automatically Create Pull Requests** on the fork model creates a pull request to merge changes into the parent model as soon as a connector job successfully completes and a new revision of the Fork model is created.

To set up **Automatically Create Pull Requests** on the fork model:

1. Navigate to the Model Overview of the fork model, open the `Settings` page, and click the `Advanced` section of the settings.
2. Click the check-box next to **Automatically Create Pull Requests**
3. Click `SAVE CHANGES` located in the bottom right of the settings page

<figure>Automatically create pull requests when a new revision of the Fork model is created<figcaption><p>Automatically create pull requests when a new revision of the Fork model is created</p></figcaption></figure>

### **Auto-merge Pull Requests**

Turning on auto-merge for pull requests on the parent model merges a pull request as soon as it is submitted, without requiring the additional step of merging or reviewing manually.

To set up auto-merge on a parent model:

1. Navigate to the Model Overview of the parent model, open the `Settings` page, and click the `Activities` section of the settings.
2. Click **MANAGE** next to **Pull Requests**
3. Click the check-box next to **Automatically merge**
4. Click **SAVE CHANGES** at the bottom right of the dialog

<figure>Set up auto-merge for pull requests on Parent models<figcaption><p>Set up auto-merge for pull requests on Parent models</p></figcaption></figure>

## View changes merged by a pull request

After a pull request has been submitted, you can:

* In the [Activity page for the pull request](/models/share-and-collaborate/activities-and-activity-types/pull-requests#the-activity-page-for-pull-requests), click on `View changes` to open a read-only comparison of the two models, using the standard [Diff](/models/build-and-edit-models/diff-mode) visualisation feature.
* In the [Activity page for the pull request](/models/share-and-collaborate/activities-and-activity-types/pull-requests#the-activity-page-for-pull-requests), click on `View revision` to open a read-only view of the fork model that was submitted.

After a pull request has been merged, you can:

* Open the `Revisions` tab on the Model Overview of the parent model, find the revision created when the pull request was merged, and click **VIEW CHANGES** to open a read-only visual comparison in [Diff mode](/models/build-and-edit-models/diff-mode) of the pull request revision with the previous revision.

## Fork management

There are several actions you can take to manage forks: compare two forks, detach a fork, prevent forks of a model from being created, and save an active draft as a fork.

### List existing forks of a model

The `Summary` tab on the Model Overview of a model provides access to a list of existing forks for a model. Note that you can only see forks that you have access to.

Forks are also listed as separate models in the main [Model Browser](/the-user-interface/models-ui/model-browser) list.

### Compare forks of the same model

Compare two forks of the same parent model:

1. Open Model Overview for first fork
2. Click **Actions** → **Diff with model**
3. Select second fork from list
4. Review differences in Diff Mode (read-only)

Solidatus allows you to compare any two models in `Diff Mode`, and this includes two forks of the same model.

{% hint style="warning" %}
When you compare forks in `Diff Mode`, you are not able to save any model changes. As a result, you cannot revise or merge changes from separate forks in this way.
{% endhint %}

To compare two forks of the same model, open the Model Overview of one of the forks. Then click `Actions` in the top right and select `Diff with model` from the dropdown menu.

<figure><figcaption><p>Compare two different models in Diff mode</p></figcaption></figure>

Scroll through the list to find another fork of the same model and click `DIFF` to open a comparison of the two forks in `Diff Mode`.

<figure><figcaption><p>Select a fork of the same model to compare with</p></figcaption></figure>

You can view the differences between two forks of the same model in this way, but you cannot update them or merge any changes.

<figure><figcaption><p>View differences between forks</p></figcaption></figure>

### Detach forks

Break the connection to create independent models:

1. Open fork Model Overview
2. Click **Actions** → **Detach model**
3. Confirm detachment (cannot be reversed)
4. Fork becomes standalone model with same entity IDs

{% hint style="warning" %}
Detaching prevents future parent model synchronization. Ensure you have all needed changes before detaching.
{% endhint %}

## Create a fork from a draft

You may have more than one draft available for your model, and you’re curious about the changes you made two weeks ago - what were they? You need to create a fork from the draft - here are the steps to follow:

> 1. If you need to, *resume* the draft
> 2. Click on *Save as* in the toolbar to save the model as a fork
> 3. Make sure you give the fork a name that indicates why you created it (otherwise you may have several with the same name)
> 4. In the Model Overview for the fork, open the `Revisions` tab
> 5. There will be two revisions - the oldest one reflects the state of the model before the draft, and the newest one contains the changes made in the draft
> 6. Click on the `View changes` button for the top revision in the list (see revision-diffs)
> 7. Click on *Hide unchanged* in the toolbar - this will hide everything that was not included in the draft
> 8. If you want to include your changes in the original model you **must** submit them from the fork

{% hint style="info" %}
When you save a draft as a fork, the original draft is removed. If you need to update the model with the changes, you must submit a [pull request](/models/share-and-collaborate/activities-and-activity-types/pull-requests).
{% endhint %}

## Prevent fork creation

A model owner can prevent other users from creating forks of a model.

To do this:

1. Navigate to the [Model Overview](/the-user-interface/models-ui/model-overview) of the model
2. Open the **Settings** tab
3. Select the **Advanced** settings section
4. Select the checkbox nex to **Prevent forking**

Alternatively, you can:

1. Select the **ACTIONS** button at the top right of the the [Model Overview](/the-user-interface/models-ui/model-overview)
2. Select **Edit model information**
3. Check the box next to **Prevent forking**
4. Select **CONFIRM**

{% hint style="success" %}
This option does not prevent **model owners** from forking the model.
{% endhint %}

## Next steps

* [Pull Requests](/models/share-and-collaborate/activities-and-activity-types/pull-requests) - Detailed pull request workflows
* [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode) - Change comparison and merge tools
* [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks) - Alternative collaboration method
* [Auto-merge](/models/share-and-collaborate/activities-and-activity-types/auto-merge) - Automated change integration
