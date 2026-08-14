# Imported model updates

Imported model updates automatically notify you when content you’ve imported from other models has changed, allowing you to incorporate updates selectively while maintaining control over your model’s content and structure.

{% hint style="success" %}
Only owners and authors of a model can merge imported model updates.
{% endhint %}

## What are imported model updates?

When you [import content from one Solidatus model into another](/get-started/import-model-content/import-and-link-to-solidatus-models), a link to the source model is established that monitors changes.

**Imported model updates** are activities automatically created when imported content has been modified in the source model. They enable you to review and merge changes selectively or as a whole, while maintaining an audit trail of changes.

{% hint style="success" %}
Content imported from another model cannot be edited directly. It must be edited in its original source model and merged into models with imported content via imported model update activities.
{% endhint %}

Whenever changes to entities that were imported into another model are saved in a new revision, a new import update activity is generated for the target model provided that

* the target model is subscribed to import updates (enabled by default), and
* the changes affect entities that were imported into another model

The import update workflow allows you stay synchronized with source changes while maintaining complete control over what is incorporated into your model. You can preserve local customizations and avoid overwriting important modifications, all while tracking a complete history of what changed and when.

## The import update workflow

The complete lifecycle of imported model updates follows a straightforward pattern:

1. Source model changes trigger a notification via the **Bell icon** in the navigation bar that an update activity has been created.
2. An imported model update activity appears in the Activities tab of the Model Overview of the target model and on your ACTIVITIES page.
3. You review the changes using [Diff mode](/models/build-and-edit-models/diff-mode) and merge the approved changes into your model.
4. The activity is closed and changes are preserved in the revision history.

<figure>Import update lifecycle<figcaption><p>Import update lifecycle<a href="https://ci-rc.solidatus.dev/help/collaboration/activities/imported-models.html#id2"></a></p></figcaption></figure>

\\

Merging imported model updates can be either automatic or manual. When [auto-merge is enabled for imported model updates](#auto-merge-imported-model-updates), they apply automatically subject to any approval requirements. When auto-merge is disabled, manual review, approval, and merging is required.

## Merge import updates

Import update activities appear in multiple locations when changes to imported content are saved in the source model.

* You receive a notification in the **Bell icon** in the navigation bar
* In the Model Overview, you’ll see the activity listed in the **Activities** tab

<figure>Import update in Model Overview<figcaption></figcaption></figure>

\\

* The activity is listed on your **ACTIVITIES** page, accessible through the navigation bar
* If you open the model importing dialog in the Model Viewer, an alert appears next to models with pending updates

<figure>Import update alert in Model Viewer<figcaption></figcaption></figure>

## Review and merge imported model updates

To process an imported model update:

1. Start by opening the activity either by clicking the notification or finding it in the Activities tab.
2. Click **Visual merge** to open a visual comparison in Diff mode.
3. Review the changes.
4. Finally, save the model to apply your selected changes and complete the update.

## Understand different types of changes

Content changes include new entities added to the source model, modifications to existing entity properties and relationships, and structural reorganization of the model hierarchy.

Changes to display rules, filters, views, or grid reports do not transfer to other models via model imports or imported model updates.

{% hint style="success" %}
If Visual Merge shows no obvious differences, click the orange **Show n changes from the Imported Model** button in the Inspector to see an itemised list of changes.
{% endhint %}

## Auto-merge imported model updates

You can enable auto-merge for imported model updates to streamline the update process. When auto-merge is enabled, changes to imported content are applied automatically without requiring manual review.

To enable auto-merge:

1. Navigate to the Model Overview Settings tab (requires owner access) for the model receiving imports
2. Select the **Activities** settings
3. Select **MANAGE** next to import update
4. Select the checkbox next to **Auto-merge** to enable or disable it
5. Save settings to apply changes

## Unsubscribe from import updates

To enable or disable the creation of imported model update activities when the source model changes:

1. Navigate to the Model Overview Settings tab (requires owner access)
2. Find the “Activities” section with import update settings
3. Check or uncheck the “Subscribe to” box for import updates
4. Save settings to apply changes

Disabling updates means **import update activities** are not created when the source model changes. However, if you later re-subscribe to import updates, you will be able to merge all changes since the last update.

## Approvals and import updates

When approval workflows are enabled, import updates follow additional governance steps that provide extra oversight for important changes.

<figure>Import update approval lifecycle<figcaption></figcaption></figure>

The approval process begins when the import update is automatically submitted for review. Designated approvers receive notifications about the review request and examine the changes to provide feedback. They then make a decision to approve, reject, or request modifications. Finally, the changes are either merged into the model or returned for revision based on the approval outcome.

Different roles participate in the approval workflow. Model owners can override approval requirements, if necessary, and contributors may be asked to provide additional context about the changes.

## Diff mode and imported model updates

You can review changes in Diff mode using the same tools and techniques as for other types of activities (see [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode)). However, there is a unique category of change, **import revision updates**, that applies specifically to imported model updates.

This type of change includes all root level entities and transitions in the imported model, even if they were not changed in the revision that triggered the imported model update. In addition, transitions that were imported from the source model appear in orange in Diff mode even if they were not edited.

<figure>Orange transitions in Diff mode for imported model updates<figcaption><p>Orange transitions in Diff mode for imported model updates</p></figcaption></figure>

This category reflects the fact that the ID of the latest revision of the imported model has changed, which means that all imported entities and transitions are technically “edited” because they now point to a new revision of the source model.

<figure>Imported root entities and transitions listed as import revision updates<figcaption><p>Imported root entities and transitions listed as import revision updates</p></figcaption></figure>

You can ignore these changes when reviewing the import update activity, as they do not represent actual changes to entities or transitions.

## Next Steps

For more information, see related documentation:

* **Importing models**: [Import and Link to Solidatus Models](/get-started/import-model-content/import-and-link-to-solidatus-models)
* **Visual merge and comparison tools**: [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode)
* **Set up approval for imported model updates**: [Approvals Workflow](/models/share-and-collaborate/approvals-workflow)
