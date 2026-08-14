# Auto-merge

By default, any model changes proposed via [activities](/models/share-and-collaborate/activities-and-activity-types/activities) must be merged into a model by one of the model Owners or Authors using *Visual Merge* or *Just Merge*.

Complex modelling scenarios, with perhaps hundreds of linked models, would result in a heavy workload for model Owners. In many cases, such as importing changes from models that are automatically maintained by Solidatus connectors, the proposed changes will always be accepted - if the model of your Data Warehouse database has been automatically updated, you should not need to tell Solidatus to accept the changes (See [Creating multiple linked models](broken://pages/Q3duilC7Z63pACbIg1bp#creating-multiple-linked-models)).

With this type of concern in mind, Solidatus allows you to enable the automatic merging of changes made in an Activity on completion of the Approvals workflow – if enabled. You can enable auto-merge via the `Activities` section of [Settings tab](/the-user-interface/models-ui/model-overview#settings-tab) tab on the Model Overview.

## **What activity types can be auto-merged?**

You can set up auto-merge for

> * [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks)
> * [Pull Requests](/models/share-and-collaborate/activities-and-activity-types/pull-requests)
> * [Import Model Updates](/models/share-and-collaborate/activities-and-activity-types/import-model-updates), and
> * [Parent Model Changes](/models/share-and-collaborate/activities-and-activity-types/parent-model-changes)

## **How auto-merge works**

When changes are submitted for a model (and approved if required), the status of the Activity changes to *Ready to merge*. If auto-merge is enabled for that type of Activity, Solidatus automatically schedules and runs the auto-merge. Progress messages are added to the trail of comments for the Activity. The auto-merge will nearly always succeed and the Activity status set to *Merged*, but there is a chance that it may fail and revert to *Ready to Merge* - remember to check the Activity comments to find out.

<figure><figcaption><p>This auto-merge failed</p></figcaption></figure>

In the list of Revisions for a model, the *Auto-merged* tag makes auto-merged Revisions stand out.

<figure><figcaption><p>The current revision was created by auto-merging an import update activity</p></figcaption></figure>

## Set a conflict preference

When you click `Manage` in the Activities Settings in the Model Overview, there is an option to set `Conflict Preference` for each Activity type.

Note that this only applies to a specific, unlikely scenario in which both a Parent and a Task/Fork have imported the same entity from another model, but have put it in a different place.

<figure><figcaption><p>Set conflict preference</p></figcaption></figure>

In such a scenario, Auto-merge will not know which entity (or entities) to take. Selecting `Current` or `Incoming` will only apply to such a scenario, and it will select either the entity in the model you are merging into (current) or the entity in the model that is being merged (incoming).
