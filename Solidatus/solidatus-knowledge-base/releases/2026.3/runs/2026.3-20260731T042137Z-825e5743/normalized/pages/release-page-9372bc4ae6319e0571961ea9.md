# Pull requests

If you save changes to the Fork of a model, **Pull Requests** (also referred to as **PRs** on this page) allow you to submit them to be merged back into the parent Model.

Submitting changes that have been made on a Fork back to a parent Model creates a **Pull Request** Activity, which allows Owners or Authors of the Parent model to review and accept or reject proposed changes.

{% hint style="success" %}
When changes to a Parent model are saved, [Parent Model Changes](/models/share-and-collaborate/activities-and-activity-types/parent-model-changes) Activities are raised for the Fork. It is good practice to [synchronise your Fork with those changes](/models/build-and-edit-models/forks#when-the-parent-model-changes) before submitting the Pull Request.
{% endhint %}

All users who can review and merge model changes (Owners and Authors of the Parent model) receive a notification of new Pull Requests

Icons on the Model List in the [Model Browser](/the-user-interface/models-ui/model-browser) indicate that Pull Requests exist; in addition, all Pull Requests are listed on the `Activities` tab on the [Model Overview](/the-user-interface/models-ui/model-overview) and on [your list of Activities](/the-user-interface/models-ui/activities-interface#the-my-activities-list).

If auto-merging of Pull Requests is enabled, the changes proposed by the Pull Request will be automatically merged into the Model, possibly following the [approvals workflow](/models/share-and-collaborate/approvals-workflow). If auto-merge is not enabled, the owners or authors of the parent Model can review the proposed changes and decide which (if any) to accept and merge into the parent Model, again possibly subject to the [approvals workflow](/models/share-and-collaborate/approvals-workflow).

## Lifecycle of Pull Requests

The standard lifecycle (without approvals) for a Pull Request is simple – they are *Ready to merge*, then either *Merged* or *Closed*.

<figure><figcaption><p>The standard lifecycle for a Pull Request</p></figcaption></figure>

## Lifecycle of Pull Requests with Approvals

If approvals have been enabled for the Model then the [Approvals workflow](/models/share-and-collaborate/approvals-workflow) is followed. This changes the standard lifecycle in several ways:

> * The initial state for a Pull Request is *Submitted* (it will not change to *Ready to merge* until it has been approved)
> * There is a review process; the changes need to be approved by one or more approvers - see the Activity page to find out who they are
>
>   > * when a sufficient number of approvers have approved the changes, the state of the Task will change to *Ready to merge*
>   > * if **any** approver rejects the changes the state will change to *Changes requested* - the assignee is expected to make changes and then resubmit the Task

{% hint style="success" %}
Contact the Model owner if you think it’s taking too long to get your Pull Request approved
{% endhint %}

The approvals workflow for Pull Requests (apart from [closing](#close-a-pull-request), rejecting, or reopening the Pull Request) is illustrated by the diagram below:

<figure><figcaption></figcaption></figure>

There are additional possibilities if the Pull Request is *Closed* before being *Merged* – it can be reopened and closed at any time unless the changes have been merged into the parent Model.

To see the full lifecycle for a task, with every possible state and transition, see [Full lifecycle for other Activities](/models/share-and-collaborate/approvals-workflow#full-lifecycle-for-other-activities).

## The Activity Page for Pull Requests

Click on a Pull Request in the `Activities` tab in the Model Browser to open the Activity page, where you can add comments, and manage the Pull Request.

<figure><figcaption><p>Click a Pull Request in the list of Activities to view Activity page</p></figcaption></figure>

The example picture here shows a Pull Request that has been submitted and has been opened by a user with editing privileges (so they can carry out the Just Merge or Visual Merge).

<figure><figcaption><p>The Activity page for a Pull Request</p></figcaption></figure>

From this page the user can:

* merge changes from the pull request without review by clicking *Just Merge*
* examine the effect of the changes on the Model by clicking on *Visual Merge*
* look at the Model represented by the Pull Request by clicking on *Open Model*
* close or reopen the Pull Request (if it has not yet been *Merged*)
* add a comment

The version comparison that is presented in the *Visual Merge* is identical to the comparison that is presented when merging models via the user interface. See [Diffing Models](/models/build-and-edit-models/diff-mode) for more information.

## Create a Pull Request

First, save the changes made to your Fork using the `Save` button on the Toolbar:

<figure><figcaption><p>Click the save button in the toolbar on the left</p></figcaption></figure>

Now open the [Model Overview](/the-user-interface/models-ui/model-overview) by clicking on the name of the Model at the top of the screen or in the *Model* tab of the sidebar:

<figure><figcaption><p>Click the model name in the Navigation Bar to go to the Model Overview</p></figcaption></figure>

The right-hand box will be pink with the heading **Unsent Changes**. The text will show how many changes have not yet been sent to the parent and there will be a **Submit** button.

<figure><figcaption><p>Submit a Pull Request from the Model Overview Summary page</p></figcaption></figure>

Clicking the `Submit` button will open the following dialogue:

<figure><figcaption><p>Pull request creation dialogue</p></figcaption></figure>

Clicking the `Send pull request` button will notify the Model owner of any changes made in the forked Model and will invite them to merge some or all changes into the Parent Model.

Once the pull request is submitted, the right-hand box in the overview will turn yellow and display the message **Sent changes pending**.

<figure><figcaption><p>Once the pull request has been sent, the Model Overview will be updated</p></figcaption></figure>

{% hint style="success" %}
Click the `View Activity` button to open the activity page for the Pull Request in the Model Overview of the parent Model. To close the Pull request, click on the **Close Activity** button in the activity page.

**Note:** If you no longer have permission to view the parent Model or it has been deleted, the `View Activity` button will be inactive.

You will see the message noparenterror.
{% endhint %}

If you’ve finished your changes, wait for the Pull Request to be merged into the parent Model. If you have more changes to make, carry on editing your forked Model and submit those changes later on as a new Pull Request. If the most recent Pull Request is still in **Ready to merge** or **Submitted** state (not *Closed* or *Merged*, the two Pull Requests will be combined; otherwise a new Pull Request will be created.

Eventually, you’ll finish proposing changes, and the parent Model will be updated. If you want to, you can delete the fork using the list of Models in the [Model Browser](/the-user-interface/models-ui/model-browser).

## What happens after a PR is submitted?

Once the Pull Request has been submitted, only the parent Model’s owners will receive a notification through the bell icon in the Navigation Bar. Owners and authors will receive an alert in the *Summary* tab on the Model Overview, and they will see the Pull Request in the *Activities* tab.

Both Owners and Authors are able to view, merge, or reject changes from the Pull Request.

<figure><figcaption><p>Once the Pull Request has been submitted, the Model Overview will be updated</p></figcaption></figure>

The *Activities* section of the Model Overview for the parent Model will show a new pull request activity.

<figure><figcaption><p>Once the Pull Request has been submitted, a new Activity is created</p></figcaption></figure>

{% hint style="info" %}
If the Fork contains a lot of unsubmitted changes, it may take Solidatus a while to create the Pull Request; while this is happening, the state of the Activity will be shown as .
{% endhint %}

To review the proposed changes, click on the name of the Pull Request to open the activity page for the Pull Request, then click on the blue *Visual merge* button. The model owner or author can then reject some or all of the proposed changes and merge them into the original parent model:

<figure><figcaption><p>Reviewing the proposed changes</p></figcaption></figure>

See [How to show the differences between two model revisions](/models/build-and-edit-models/version-control#how-to-show-the-differences-between-two-model-revisions) for more information about handling the differences between the Pull Request and the parent Model.

If the Pull Request needs to be approved, each approver will open the [Activity page for the Task](/models/share-and-collaborate/activities-and-activity-types/tasks#the-activity-page). This allows each of them to:

* View the Pull Request - click on `View changes`
* Approve the Pull Request - click on `Approve`
* Reject the Pull Request - click on `Reject` - the approver who rejected the changes must approve the changes (or lose their right to approve changes) before they can be merged (unless a Model owner decides to *Force merge* the changes - see [Notes for Approvers](/models/share-and-collaborate/approvals-workflow#notes-for-approvers))
* Revoke a previous approval - click on `Revoke Approval`
* Undo a previous rejection - click on `Undo rejection`
* A Model owner can *Force merge* the changes - see [Notes for Approvers](/models/share-and-collaborate/approvals-workflow#notes-for-approvers)

Once the changes have been merged into the parent Model, the state of the Pull Request changes to *Merged*.

### What happens when a PR is only partially merged?

A parent Model does not have to merge all, or any, changes from a pull request.

When reviewing a pull request in Diff Mode, Model Owners and Authors can decide which changes to accept and which changes to reject (see [Diff Mode](/models/build-and-edit-models/diff-mode) for how to pick and choose among changes).

However, partially merging a pull request presents a unique situation because differences between the parent Model and the Fork will remain.

Solidatus manages further synchronisation between parent Model and Fork as follows:

* When a PR is partially merged, the Fork will show that all changes have been submitted to the parent for review - i.e., there are no unsubmitted changes.
* The Fork will get a notification that it is out of sync with the parent Model and that there are **parent Model changes** that can be merged.

<figure><figcaption><p>After partially merging a Pull Request</p></figcaption></figure>

{% hint style="info" %}
The notification of **parent model changes** after a partially merged pull request will ask the Fork whether to remove the changes that the parent has rejected.
{% endhint %}

When a pull request is only partially merged, the Fork editor must decide whether to align itself with the parent Model or continue work on a Model that is out of sync with the parent.

There are three possibilities going forward:

* Do not review the **parent Model changes**

If you do not review the incoming **parent Model changes** (i.e., you neither accept nor reject these changes), you will continue to work on a Fork that is different from the parent Model. However, future pull requests will **not** include the changes that have already been rejected.

* Accept the incoming **parent Model changes**

If you accept the incoming **parent Model changes**, all Model elements that were rejected in the pull request will be removed from the Fork model. In this case, both Models will be in sync from that point.

* Reject the incoming **parent Model changes**

If you review the incoming **parent Model changes** but reject them, then the Fork Model will maintain the changes that the parent Model rejected in the pull request. Since these changes were once again reviewed and affirmed, any future pull requests will include them and will require the parent Model to review them again.

## Automate Pull Requests

Via the settings for a Fork and the parent Model you can automate the update process:

<figure><figcaption></figcaption></figure>

* enabling auto-creation of Pull Requests will ensure that changes made to a Fork — perhaps by a [Connector](/connectors/connectors-overview) — are automatically submitted to the parent Model
* enabling [automatic merging](#automate-pull-requests) for Pull Requests would ensure that the parent Model is automatically updated by Pull Requests.

**Enabling auto-creation of Pull Requests**

In the Model Overview, there is an option in the advanced settings that causes a Pull Request to be submitted whenever a revision of a Fork is saved. This option only affects models that are Forks.

<figure><figcaption><p>Enable automatic Pull Requests on Forks</p></figcaption></figure>

See [Advanced Model settings](/the-user-interface/models-ui/model-overview#advanced-model-settings).

## Add changes to a PR after submitting

You know how it goes - you believe you’ve made all the updates you intended to make, so you submit your changes and sit back in your chair to unwind, and your eye falls on the little reminder that slipped onto the floor. You missed something, what do you do?

You can either close the Pull Request (see the **Tip** above), or make the changes and re-submit the Pull Request when you’re ready. The Model Overview will remind you that you have unsubmitted changes.

<figure><figcaption><p>Submitted changes, and unsubmitted changes</p></figcaption></figure>

* Click on *Update PR* to submit the additional changes and merge them into the existing Pull Request

## View list of Pull Requests

The `Activities` tab on the [Model Overview](/the-user-interface/models-ui/model-overview) provides access to a list of Actvities for a Model, use the filter dropdown if you want to show only Pull Requests.

To see a list of Pull Requests that you may be involved with, click on `Activities` on the [Navigation Bar](/the-user-interface/the-navigation-bar) to open your [My Activities](/the-user-interface/models-ui/activities-interface#the-my-activities-list) page. Again, use the filter dropdown if you want to show only Tasks.

## Close a Pull Request

A Pull Request can be closed if it has not yet been merged into the parent Model. It can be closed in the Model Overview of the fork or the parent Model.

> * in the fork - click the `Close` button next to the Pull Request in the *Summary* tab on the Model Overview
> * in the parent - open the Pull Request in the *Activities* tab on the Model Overview, then click on the `Close` button

Once the Pull Request has been closed, the Model Overview in the fork will no longer refer to it, though it will still be listed as a closed Pull Request in the parent Model’s list of Activities.

A *Closed* Pull Request can be reopened in the parent Model - open the Pull Request in the `Activities` tab, then click on the `Reopen activity` button.
