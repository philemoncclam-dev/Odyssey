# Parent model changes

If a model has open tasks or forks, the model is considered the [parent model ](/additional-resources/solidatus-glossary#parent-model)to the task or fork models that have branched off of it.

When changes are saved in a parent model, a **Parent Model Changes** Activity is created to merge the changes into the Task or Fork Model.

{% hint style="warning" %}
There are two scenarios in which Parent Model Changes should **not** be merged in a task or fork model:

1\) If changes have already been made on a task, merging the Parent Model Changes overwrites those changes. Therefore, it is advised not to sync with a parent model if a task has already been started.

2\) If a fork is fed by a connector, **do not** sync with the parent model. If you do, any changes to the parent model will be overwritten the next time a Pull Request is merged.
{% endhint %}

If auto-merging of Parent Model changes is enabled, the changes will be automatically merged into the Task or Fork Model, possibly subject to the [approvals workflow](/models/share-and-collaborate/approvals-workflow). If auto-merge is not enabled, the Owners or Authors of the task or fork can review the proposed changes and decide which (if any) to accept and merge into the parent model, again possibly subject to the [approvals workflow](/models/share-and-collaborate/approvals-workflow).

### When is a Parent Model Changes activity created?

If a model has forks or open tasks, a Parent Model Changes activity is created for every task or fork model when changes to the parent model are saved (i.e., a new revision is created).

The following lifecycle applies to each Parent Model Changes activity.

<figure><figcaption><p>Lifecycle for a Parent Model change</p></figcaption></figure>

Solidatus will automatically advise you of these Activities:

* via [Notifications](/the-user-interface/the-navigation-bar#notification-settings) if enabled
* in the Activity page for a Task, or the Model Overview for a Fork

<figure><figcaption></figcaption></figure>

* in the Model Viewer

<figure><figcaption></figcaption></figure>

To start merging changes, just click on the option presented to you.

## Sync with a Parent Model

Synchronising with the Parent Model works in the same way as every other *merge* of models in Solidatus. You are presented with the standard [model diff ](/models/build-and-edit-models/diff-mode)dialogue, which enables you to choose which Parent Model changes you wish to apply.

<figure><figcaption><p>The banner for merging parent changes into a Task</p></figcaption></figure>

{% hint style="success" %}
The Model names in the banner are links - clicking one of these links will close the model synchronisation and open the selected model instead.
{% endhint %}

**Updating the target model**

1. Open the Activity from the Activities tab in the Model Overview
2. Click on the `Visual merge` button to review the differences - see [Diffing a Model](/models/build-and-edit-models/diff-mode)
3. Accept the changes you want to save (they are all accepted by default), then save the Model
4. The status of the Activity changes to *Merged*

{% hint style="warning" %}
Your decision is final - if you decline an action from the Parent Model (e.g. add a new Layer or Object, or modify a property for an Attribute), that action will not be offered again.
{% endhint %}

{% hint style="success" %}
You may find that the Visual Merge shows no differences, because the changes made to the Parent Model do not affect your Model - perhaps the modeller saved a view or Display Rules, or parts of the Model that you have not imported.
{% endhint %}

**Other Actions**

Open the Activity from the Activities tab in the Model Overview, then

Click on the `Edit model` button to open the imported model (this will open in the same tab)

> *or*

Click on `Close activity` to close the update - it can be reopened if you decide to merge the updates later, unless it has been replaced by further changes to the imported model

## List Activities

The `Activities` tab on the [Model Overview](/the-user-interface/models-ui/model-overview) and your [My Activities](/the-user-interface/models-ui/activities-interface#the-my-activities-list) page provide access to lists of Actvities, use the filter dropdown if you want to show only parent Model changes.

## Close an Activity

A parent Model changes Activity can be closed if it has not yet been merged into the Fork or Task Model, using the Activity page - click on the `Close activity` button at the foot of the screen. The Activity can be reopened at any time by a model owner or author.

## Lifecycle of Parent Model Changes with Approvals

If approvals have been enabled for the Model then the [Approvals workflow](/models/share-and-collaborate/approvals-workflow) will be followed. This changes the standard lifecycle in several ways:

> * when a parent Model changes Activity is submitted, the state changes to *Submitted* (it will not change to *Ready to merge* until it has been approved)
> * there is a review process; the changes need to be approved by one or more approvers - see the Activity page to find out who they are
>
>   > * when a sufficient number of approvers have approved the changes, the state of the Activity will change to *Ready to Merge*
>   > * if **any** approver rejects the changes the state will change to *Changes requested*

The approvals workflow for parent model changes activities (apart from [closing](#close-an-activity), rejecting, or reopening the Activity) is illustrated by the diagram below:

<figure><figcaption><p>The approvals lifecycle for a parent Model changes Activity</p></figcaption></figure>

To see the full lifecycle with every possible state and transition, see [Full lifecycle for other Activities](/models/share-and-collaborate/approvals-workflow#full-lifecycle-for-other-activities).
