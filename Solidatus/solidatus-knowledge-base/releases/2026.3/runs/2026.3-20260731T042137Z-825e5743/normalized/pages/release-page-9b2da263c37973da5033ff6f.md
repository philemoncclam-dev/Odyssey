# Diff mode: compare and merge models

**Diff mode** is a function that allows you to compare differences between two models or model revisions visually. In many cases, Diff mode allows you to update and edit Models by merging elements from one model (such as a Fork, Parent model, Task model, or model revision) into another.

When you are in Diff mode in the Model Viewer, you will see a visual <mark style="color:blue;">`Diff mode`</mark> tag in the Navbar and a “top line” that describes what is being compared (See [The top line](#the-top-line)).

<figure><figcaption></figcaption></figure>

Diff Mode can be used to visualise differences between:

* Two revisions of the same Model (either two past revisions or the current Model and a past revision)
* A Fork and the parent model from which the Fork was created
* A Task model and the parent model in which the Task was created
* Two unrelated models

In some cases, Diff Mode can be used to edit and update a Model by merging differences from another Model; in other cases, it can only be used to view and compare differences in a read-only state.

## Merge Differences Between Models

The same process is followed for all Diff Mode scenarios. The Model that you launch a comparison from is the **target** Model into which changes will be merged, the other is the **source** Model.

In Diff mode, the differences between the source and target are highlighted. In editable Diff Mode, changes can be merged *from* the **source** *into* the **target** Model.

{% hint style="warning" %}
Differences between Models are always viewed from the perspective of the **target Model** into which changes will be merged.
{% endhint %}

Let’s look at an example.

We have `Model A` and `Model A Fork`, which is a Fork made from `Model A`. `Model A` and `Model A Fork` are the same in all respects.

Let’s say you add three entities to `Model A Fork` that do not exist in `Model A`. If you merge `Model A Fork` into `Model A` (this is called a **pull request** from a Fork into a parent Model), these three entities will be highlighted in green as *additions* to `Model A`.

In this example, `Model A Fork` is the **source** and `Model A` is the **target** of the merge. If you decide to accept these additions, they will be added to the **target**, `Model A`.

Let’s say you delete three entities from `Model A`. If you merge `Model A` into `Model A Fork` (this is called a **parent Model Update**) these will be highlted in red as *deletions* from `Model A Fork`.

In this example, `Model A` is the **source** and ``Model A `Fork`` is the **target** of the merge. If you decide to accept these changes, the entities will be deleted from the **target**, `Model A Fork`.

## Diff Mode Scenarios

The diagram below illustrates the scenarios in which you can compare and merge models in Diff mode.

<figure><figcaption><p>Model diffing scenarios - arrowheads indicate the comparison direction, from source to target</p></figcaption></figure>

### Diff Mode Scenarios for Merging Models

In the following comparison scenarios, Diff Mode is used to review and merge differences between Models. Where these comparisons are named Activitied in Solidatus, these names are listed.

1. **Import Model Update** - Updating a Model with [changes from an imported Model](/models/share-and-collaborate/activities-and-activity-types/import-model-updates)
2. **Parent Model Changes** - Synchronising a [Fork Model](/models/build-and-edit-models/forks) with the parent Model to merge recent changes from the parent Model into the Fork
3. **Pull Request** - Reviewing a [Pull Request](/models/share-and-collaborate/activities-and-activity-types/pull-requests) to merge changes from a Fork into the parent Model
4. **Parent Model Changes** - Synchronising a [Task Model](/models/share-and-collaborate/activities-and-activity-types/parent-model-changes) with the parent Model, to include recent changes to the parent Model

{% hint style="warning" %}
**!Be careful synchronising a Task model with its parent Model!**

If you have already made changes to the Task model, these will be overwritten when you synchronise with the parent Model. We generally recommend not to synchronise a Task model once it has been edited, i.e., work has begun on the Task.
{% endhint %}

5. Merging a [Task Model](/models/share-and-collaborate/activities-and-activity-types/tasks) into the parent Model
6. Merging the latest Model changes into a [Draft](/models/build-and-edit-models/version-control#drafts)
7. Reviewing the changes proposed by an Activity when [reviewing changes in the Approvals workflow](/models/share-and-collaborate/approvals-workflow)
8. Updating a Model with content from an old revision - open the old revision from the [Model Overview](/the-user-interface/models-ui/model-overview), then click `Diff/Merge` in the Toolbar.

{% hint style="info" %}
When synchronising a Task or Fork with the parent Model, only changes coming from the parent Model are listed; changes made in the Task or Fork are ignored. The same is true when updating a Model with changes made in an imported Model.
{% endhint %}

### Diff Mode Scenarios for Viewing Model Differences

There are also scenarios in which Diff Mode displays differences between Models or revisions without the ability to edit the Models. When you are in read-only Diff Mode, the `Save` button will not be visible in the Toolbar.

1. Viewing changes in a Fork before submitting them to a parent Model as a **Pull Request**.
2. Viewing differences between a [Task Model](/models/share-and-collaborate/activities-and-activity-types/tasks) and its parent Model before submitting the Task
3. Comparing any two revisions of a Model: **This type of Model Diff cannot be used to update a Model**
4. Comparing a Model with another Model of the same type (the other Model does not need to be connected in any way) - click on the `Actions` button in the [Model Overview](/the-user-interface/models-ui/model-overview), and select `Diff with Model`. Click on the `Diff` button alongside the name of the Model you want to compare with. **This type of Model Diff cannot be used to update a Model.**

## The top line

The top line of the *Model diff* dialogue will identify the source and target models in the merge or comparison, with the target Model on the left and the source Model on the right.

Consider the line `Comparing model Project Management Demo with changes made 7 days ago`. Here, `Project Management Demo` (the Model on the left) is the **target** Model, and `changes made 7 days ago` (the Model on the right) is the **source** Model.

In the syntax of `Comparing X with Y` or `Merging changes into X from Y`, `X` is the **target** Model into which changes will be merged, and `Y` is the **source** model from which changes are incoming.

{% hint style="success" %}
Both Model names in the top line of Diff Mode are hyperlinks, which you can use to open the target or source Model.
{% endhint %}

The following image illustrates this ‘top line’ for some of our scenarios

<figure><figcaption><p>The ‘top line’ for some of our scenarios</p></figcaption></figure>

## Diff Mode Toolbar Commands

In **Diff mode,** commands in the toolbar depend on the model comparison scenario.

The most common Diff Mode commands are *Save*, *Cancel merge*, *Take mine*, *Take theirs*, and *Hide unchanged*.

<figure><figcaption></figcaption></figure>

* `Merge Models`: Toolbar encountered when merging Models (e.g., Pull Requests, Tasks, Parent Model Changes, and Import Model Updates).
* `View Changes`: Toolbar encountered when viewing changes in *submitted* Task Models.
* `View Revision`: Toolbar encountered when viewing old (i.e., not current) Model revisions.
* `Read-only`: Toolbar encountered in most Diff-Mode read-only scenarios (i.e., when comparing two distinct Models or two old revisions).

{% hint style="success" %}
A different set of commands are available when [reviewing changes in the Approvals workflow](/models/share-and-collaborate/approvals-workflow).
{% endhint %}

<table data-header-hidden><thead><tr><th width="155.6817626953125"></th><th></th></tr></thead><tbody><tr><td><strong>Command</strong></td><td><strong>What does it do?</strong></td></tr><tr><td>Save</td><td>Click to save the Model with all <em>accepted</em> changes applied (Note: button not visible in read-only Diff Mode)</td></tr><tr><td>Cancel merge</td><td>Click to close the Model diff without applying any changes</td></tr><tr><td>Take mine</td><td>Decline all incoming changes (remember to Save)</td></tr><tr><td>Take theirs</td><td>Accept all incoming changes (remember to Save)</td></tr><tr><td>Hide unchanged</td><td>Hide any entity in the Model that is not affected by the Model diff. Click again to show the hidden entities</td></tr><tr><td>Diff/Merge</td><td>When viewing an old revision, this will take you to the visual merge where you can merge with the current revision</td></tr><tr><td>Hide restricted</td><td>When viewing the revision for a submitted Task, hide the entities that are out of scope for the Task. Click again to show the hidden entities (this is the default view)</td></tr><tr><td>Restore</td><td>Restore the left-hand Model as a new Model version</td></tr></tbody></table>

## Diff Mode Visualisation Features

In the example below a Task Model is being synchronised with the parent Model. To make the changes more obvious, all Display Rules have been turned off and the `Hide unchanged` option has been actioned in the toolbar.

<figure><figcaption><p>The Model diff shows the difference between the source and target models</p></figcaption></figure>

### Color Coding Changes by Type

In Diff Mode, modifications to the target Model that would be made by accepting an incoming change are highlighted by colour in the Model Viewer.

* Entity deletions are in **red**
* Entity modifications are in **yellow**
* Entity additions are in **green**

The actions are always viewed from the perspective of the target Model into which the changes will be merged. In this example, the colour coding indicates the changes that would be propagated from the parent Model into a Task Model.

The arrow buttons at the top of the [Inspector Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab) allow the modeller to cycle through the changes, accepting or declining each one.

All changes are *accepted* by default. You can click individual entities in the Model to select them and display the change detail in the Inspector panel.

If you’d rather see a list of changes to accept or decline, click on the `Show changes` button in the *Inspector* tab at top right (the actual label on the button varies according to the scenario and the number of changes). The section is highlighted in the screen shot above.

<figure><figcaption><p>The individual changes between the models</p></figcaption></figure>

{% hint style="warning" %}
This list is less granular than the individual changes highlighted in the Model Viewer.
{% endhint %}

The list can be filtered by clicking one of the categories of change listed across the top; click an entry in the list to toggle acceptance of the change.

{% hint style="success" %}
Changes to properties are shown as *before* and *after* values in the Inspector panel. Solidatus will only accept/reject the **entire** set of value changes.

In the diff summary, changes to property values will appear under the `Other change` category.
{% endhint %}

## Accept and Reject Incoming Changes

Click `Take theirs` in the toolbar to accept all incoming changes, and click `Take mine` to reject all incoming changes.

<figure><figcaption></figcaption></figure>

You can review change by change usig the *Showing Changes* panel in the Inspector. Cycle through changes using the arrows in the top left. Click the `Yes` button to accept an incoming change, and `No` to decline it.

One more option for accepting/rejecting change by change is to click the circle on the left-hand side of changed entities in the Model Viewer. A check-mark in the circle indicates that you are *accepting* the change, while an empty circle indicates *rejecting* the change. You can review change by change in this way and then `Save` at the end to confirm your choices.

<figure><figcaption></figcaption></figure>

Changes to Display Rules and Filters can be also be accepted or rejected through the toolbar. Note that changes to Filters and Display Rules, like changes to Properties, can only be accepted or rejected as an **entire** set, rather than change by change.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
Once all incoming changes have been considered and accepted or declined, the Model must be saved in the normal way (by clicking `Save` in the toolbar).
{% endhint %}

## Reviewing Changes in Approvals workflow

If you’ve been asked to [approve an Activity](/models/share-and-collaborate/approvals-workflow#notes-for-approvers), you could just click on the `Approve` or `Reject` buttons in the [Activity page](/models/share-and-collaborate/activities-and-activity-types/activities), but you shouldn’t do that until you’ve actually seen the changes. Click the `View changes` or `Visual Merge` button to review the changes and use the `Approve` or `Reject` buttons in the diffing dialogue to record your decision.

The following non-standard commands are available when reviewing changes that require approval:

<table data-header-hidden><thead><tr><th width="178"></th><th></th></tr></thead><tbody><tr><td><strong>Command</strong></td><td><strong>What does it do?</strong></td></tr><tr><td>Go back</td><td>Close the comparison and return to the Activity page</td></tr><tr><td>Approve</td><td>Approve the Activity and close the comparison</td></tr><tr><td>Reject</td><td>Reject the Activity and close the comparison</td></tr><tr><td>Hide unchanged</td><td>Hide any entity in the Model that is not affected by the Model diff – click again to show the hidden entities</td></tr></tbody></table>

Providing a comment when you approve or reject an Activity is a good routine to establish, especially when rejecting an Activity.

<figure><figcaption><p>Explain your reasons for approving or rejecting the changes</p></figcaption></figure>

## Notes for Tasks

When viewing the revision for a submitted Task, the *Diff/merge* button will enable you to use the visual merge to reinstate selected differences back into the current Model, enabling you to carry out a partial or full restore of the previous revision. To choose which changes to reinstate, click on the `Show changes` button in the *Inspector* tab at top right, de-select the entries you want to reinstate, then click on `Ok`. Save the Model when you’re ready to commit the changes.
