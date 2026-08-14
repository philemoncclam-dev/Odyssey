# Approvals workflow

By default, any model changes proposed via [Activities](/models/share-and-collaborate/activities-and-activity-types/activities) must be merged into a model by one of the model Owners or Authors, using the `Just Merge` or [Visual Merge](/models/build-and-edit-models/diff-mode#merge-differences-between-models) feature.

For example, several Owners may examine the proposed changes without actually merging them into the model, then discuss whether they jointly approve of the changes. Finally, one Owner merges the changes into the model.

While this simple process may be sufficient in some scenarios, complex modelling scenarios can require a more formal (but streamlined) approach, enabled by the following Solidatus collaboration features:

> * Nominating additional users (who might not already be an Owner or Author) as an Approver for the model, using the *Settings* tab on the Model Overview (see [below](#notes-for-model-owners))
> * Enabling the approvals workflow for a type of Activity for a model, by setting a minimum number of approvers, also via the *Settings* tab on the Model Overview (see [below](#notes-for-model-owners))
> * Enabling the [automatic merging](/models/share-and-collaborate/activities-and-activity-types/auto-merge) of changes proposed via a type of Activity, on completion of the Approvals workflow if enabled, also via the *Settings* tab on the Model Overview (see [below](#notes-for-model-owners))
> * When an Activity requires approval, Solidatus generates notifications for users that have been explicitly named as approvers for the Activity.

{% hint style="warning" %}
A user can only be nominated as an Approver if they have an [Author licence](/account-management/licences-capabilities-and-roles).
{% endhint %}

## The Approvals lifecycle

The following diagram shows the generic lifecycle for an Activity where approvals are required - **the specific lifecycle for each type of Activity can be found in the documentation for that type of Activity**. In addition to the actions shown in the diagram, an Activity can be closed at (almost) any point in the process.

Once an Activity has been merged it cannot be closed - a model has been updated and we need to maintain the audit trail. A *Closed* activity can be reopened at any time.

<figure><figcaption></figcaption></figure>

The full Approvals lifecycle (except for closing and reopening)

Requiring Approvals for a type of Activity introduces two additional states for Activities:

<table data-header-hidden><thead><tr><th width="130"></th><th></th></tr></thead><tbody><tr><td></td><td>The proposed changes are awaiting Approval from at least one Approver. Without Approvals or auto-merging enabled, the Activity state would otherwise be <code>Ready to Merge</code></td></tr><tr><td>changes-state</td><td>The proposed changes have been rejected by at least one Approver - check for comments on the <a href="/pages/L580ZsFWX7PX4K6uvqix#the-activity-page">Activity page</a> for the Activity</td></tr></tbody></table>

## Who can approve an Activity?

A user can approve the changes proposed by an Activity if they have the Model *Owner*, *Author*, or *Approver* role on the model to be updated, whether personally or by membership of a Group. If the Activity is a Task, there may be additional Approvers named when the Task is created. See [Creating a Task](/models/share-and-collaborate/activities-and-activity-types/tasks#create-a-task).

Model Owners can use the ‘Force Merge’ feature (see [Notes for Approvers](#notes-for-approvers)) to bypass the Approval process for an Activity.

## Notes for Model Owners

Whether or not Approvals are needed for a given Activity will depend on the Activity settings for the model that the Activity would update. This is the right-hand model in the diagrams shown at [Types of Activity](/models/share-and-collaborate/activities-and-activity-types).

Model owners are in control of the approvals process for a Model, by setting a minimum number of approvers in the [Activities section in the Settings tab](/the-user-interface/models-ui/model-overview#activities) - if this is greater than zero, approvals are required. Remember, Model Owners can use the ‘Force Merge’ feature (see [Notes for Approvers](#notes-for-approvers)) to bypass the Approval process for an Activity.

If the *Automatically merge* option is also set for a type of Activity, the changes will be merged into the parent Model automatically as soon as the minimum number of approvals have been received.

<figure><figcaption><p>Approval settings for Activities</p></figcaption></figure>

In the example above, approvals are required from at least two users for every submitted Task, and 1 approval for Parent Model changes. Once approved, the changes proposed by a Task or Parent Model changes will automatically be applied to the Model they are merging into.

The option to set `Conflict Preference` only applies to a specific, unlikely scenario in which both a Parent and a Task/Fork have imported the same entity from another Model, but have put it in a different place. In such a scenario, Auto-merge will not know which entity (or entities) to take. Selecting `Current` or `Incoming` will only apply to such a scenario, and it will select either the entity in the Model you are merging into (current) or the entity in the Model that is being merged (incoming).

Changes to the minimum number of approvals required for a type of Activity may affect existing Activities \*\*immediately\*\*.

For example:

> * if the number of approvers increases, a Task that is *Ready to merge\`* may change state to `Submitted`, and require additional approval
> * if the number of approvers decreases and auto-merging is enabled, a Task that is `Ready to merge` may change state to `Submitted`, be automatically merged into the Model, and then change state to `Merged`. {% endhint %}

## Activities on Model Overview

The following diagram shows the list of Activities for a model (on the [Activities section in the Settings tab](/the-user-interface/models-ui/model-overview#activities) of the Model Overview) - for each Activity it shows an icon for each Approver that has approved or rejected the proposed changes, plus an icon for every requested approver that has not yet responded. Hover over one of these icons to see the full name of the user.

<figure><figcaption><p>Approvals on the Model Overview</p></figcaption></figure>

The same information about approvers is also shown on the Activity page for each Activity - you should always look at the comments on this page in case the approvers have made suggestions. See [Questions, Discussions, etc.](/models/share-and-collaborate/activities-and-activity-types/questions-comments-discussions-etc.) for an example of a trail of comments.

<table data-header-hidden><thead><tr><th width="130"></th><th></th></tr></thead><tbody><tr><td>icon-pending</td><td>This user has been specifically invited to approve the Activity but has not yet responded (there may be other users with the ability to approve the Activity due to their permissions)</td></tr><tr><td>icon-approved</td><td>This user approved the proposed changes</td></tr><tr><td>icon-rejected</td><td>This user rejected the proposed changes - the Activity state would be changed to <code>Changes requested</code>, and the approver may have left comments explaining why the changes were rejected.</td></tr></tbody></table>

## Notes for Assignees / Submitters

For an overview of the state of all the Activities you’re involved with, check your [Activities Interface](/the-user-interface/models-ui/activities-interface) page.

The [Activity page](/models/share-and-collaborate/activities-and-activity-types/activities#the-activity-page) for an Activity is the place to look for information about the Activity, such as the history of the Activity, comments made by users, and the number of reviewers that must approve your changes before the proposed changes can be merged into the Model.

{% hint style="success" %} Contact the model Owner if you think it’s taking too long to get your Task model approved. {% endhint %}

## Notes for Approvers

For an overview of the state of all the Activities you’re involved with, check your [Activities Interface](/the-user-interface/models-ui/activities-interface) page.

If you’ve been specifically invited to approve an Activity you will receive a [Notification](/the-user-interface/the-navigation-bar#notification-settings) - click on it to open the [Activity page](/models/share-and-collaborate/activities-and-activity-types/activities#the-activity-page).

If you were not specifically invited to approve an Activity, you will not be notified when an Activity requires approval, though you will be able to approve or reject the Activity.

If an Activity is awaiting approval, a potential reviewer will see additional options on the Activity page:

<figure><figcaption><p>Approval options on the Activity page</p></figcaption></figure>

<table data-header-hidden><thead><tr><th width="177"></th><th></th></tr></thead><tbody><tr><td>! Just Merge</td><td><strong>If you are a Model Owner</strong> - Allows you to ‘Force Merge’ without visual review of changes. Just Merge accepts all changes from the Task Model, taking the task Model version where there are differences. <strong>If you are a Task Assignee</strong> - Just Merge allows you to ‘Force Merge’ changes from a sub-task.</td></tr><tr><td>! Visual merge</td><td><strong>If you are a Model Owner</strong> - Allows you to ‘Force Merge’, i.e. to bypass the approval process, by reviewing the differences and choosing which changes to apply - see <a href="/pages/N3mqoHdPINAdPAIv2zIe#reviewing-changes-in-approvals-workflow">reviewing changes in the Approvals workflow</a>. <strong>If you are a Task Assignee</strong> - Allows you to ‘Force Merge’ changes from a subTask.</td></tr><tr><td>View changes</td><td><strong>If you are not a Model Owner</strong> - Allows you to review the proposed changes and also to Approve or Reject them - see <a href="/pages/N3mqoHdPINAdPAIv2zIe">Diffing a Model</a>.</td></tr><tr><td>View revision</td><td>Allows you to review the differences without applying them to the model - see <a href="/pages/N3mqoHdPINAdPAIv2zIe#reviewing-changes-in-approvals-workflow">reviewing changes in the Approvals workflow</a>.</td></tr><tr><td>Approve</td><td>Approve the Activity - if the required number of Approvals has been reached, the Activity state will change to <em>Ready to merge</em> - if auto-merge is enabled, the changes will be merged into the model.</td></tr><tr><td>Reject</td><td>Reject the Activity - the Activity state will no longer be <em>Ready to merge</em> or <em>Submitted</em> - it will be <em>Changes requested</em>. To help the user that submitted the Activity, you should add a comment to the Activity to explain your decision.</td></tr></tbody></table>

**After you approve or reject an Activity, additional options may appear:**

<table data-header-hidden><thead><tr><th width="178"></th><th></th></tr></thead><tbody><tr><td>Just Merge</td><td><strong>Only available if the Activity state is `Ready to merge`</strong> Merges the Task Model automatically without visual review of changes, accepting the Task Model version where there are differences.</td></tr><tr><td>Visual merge</td><td><strong>Only available if the Activity state is `Ready to merge`</strong> - Review the differences and choose which changes to apply - see <a href="/pages/N3mqoHdPINAdPAIv2zIe">Diffing a Model</a>.</td></tr><tr><td>Revoke Approval</td><td>Change your mind about approving the Activity - the Activity state will no longer be <em>Ready to merge</em> or <em>Submitted</em> - it will be <em>Changes requested</em>. To help the user that submitted the Activity, you should add a comment to the Activity to explain your decision.</td></tr><tr><td>Undo Rejection</td><td>Change your mind about rejecting the Activity - if the required number of Approvals has been reached, the Activity state will change to <em>Ready to merge</em> - if auto-merge is enabled, the changes will be merged into the model .</td></tr></tbody></table>

{% hint style="success" %} When you click on the `Approve` or `Reject` buttons, remember to leave a comment in the dialogue that pops up, especially if you’re rejecting an Activity. {% endhint %}

Note that using `Just Merge` will accept all changes in the Task Model, overwriting the parent Model with the Task model version where there are any differences.

## Possible State Transitions

The following diagrams show the transitions available for each possible state of an Activity. In this context, a transition is an action on the part of a user or Solidatus that can cause the state of an Activity to change. For example, there are three possible actions that can cause a state change for an Activity that is currently in the `Submitted` state; one of those actions can result in one of two different states (`Ready to merge` or `Merged`), depending on whether or not auto-merging is enabled for that type of Activity.

These diagrams can help you to understand the potential complexities of the approvals process.

<figure><figcaption></figcaption></figure>

***

<figure><figcaption></figcaption></figure>

***

<figure><figcaption></figcaption></figure>

***

<figure><figcaption></figcaption></figure>

***

<figure><figcaption></figcaption></figure>

## Full lifecycle for Tasks

The following diagram shows the full lifecycle for Tasks, with every possible state and transition.

<figure><figcaption><p>The full lifecycle for a Task with Approvals</p></figcaption></figure>

## Full lifecycle for other Activities

The following diagram shows the full lifecycle for Activities other than Discussions and Tasks, with every possible state and transition.

<figure><figcaption><p>The full lifecycle for other Activities with Approvals</p></figcaption></figure>

## Informal Review of Tasks

If you have only Viewer access to a model, you can still participate in peer review of assigned Tasks through an informal review.

Model Viewers can access the Tasks for a model through the Activities tab in the Model Overview.

By opening a Task in the Activities tab, Model Viewers can:

* compare changes in a Task model to the original model in Diff Mode (click `VIEW CHANGES`)
* view a Task model in read-only mode (click `VIEW REVISION`)

<figure><figcaption><p>Informally review a Task through the Activities tab of the Model Overview</p></figcaption></figure>
