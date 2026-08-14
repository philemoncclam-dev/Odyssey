# Version control: revisions and model history

Solidatus provides a suite of version control features to keep track of model changes, prevent data loss, and support collaborative model building workflows. These include:

* **Model revision history** : Non-destructive, complete audit trails for model changes
* **Restoration** : Ability to revert to any previous model version without losing history
* **Diff mode** : A powerful visual tool to compare model versions and review proposed changes
* **Forks and pull requests** : Branching and merging workflows for collaboration and sandboxed model editing

This page focuses on the first two features: model history preservation, revisions, and revision restoration.

For information on Diff mode, see [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode). For model branching and merging features, see [Version Control: Forks and Pull Requests](/models/build-and-edit-models/forks) and [Activities](/models/share-and-collaborate/activities-and-activity-types/activities).

### How revisions work

Every model save creates a new revision, preserving full history while enabling easy restoration and collaboration.

All features for viewing and comparing revisions are accessible through the **Revisions** and **Summary** tabs on the [Model Overview](/the-user-interface/models-ui/model-overview).

**Key concepts:**

<table data-header-hidden><thead><tr><th width="163.1549072265625"></th><th></th></tr></thead><tbody><tr><td><strong>Drafts</strong></td><td>Work-in-progress changes, automatically saved as you work</td></tr><tr><td><strong>Revisions</strong></td><td>Permanent versions created each time you save your model</td></tr><tr><td><strong>Comparisons</strong></td><td>Visual <strong>Diff mode</strong> tool to see differences between any two versions</td></tr><tr><td><strong>Restoration</strong></td><td>Ability to restore any previous state without losing history</td></tr></tbody></table>

{% hint style="success" %}
Forks maintain independent version histories from their parent models. Changes in a fork do not affect the parent model until merged via a pull request.
{% endhint %}

**The version control workflow:**

1. **Work**: Make changes in the Model Viewer (changes are auto-saved as drafts)
2. **Save**: Create a new revision with your changes
3. **Compare**: Review differences between versions
4. **Restore**: Return to previous versions when needed

### Work with drafts

Drafts preserve your work automatically as you edit, ensuring no changes are lost even if you close your browser unexpectedly.

**How drafts work**

* Changes are automatically saved periodically as you work
* Drafts are created for each model browser session
* Drafts persist until you save them as revisions
* Multiple drafts can exist when a model is edited in different browser tabs or work has not been saved for through multiple sessions
* You can switch between existing drafts or **stash** a draft to start from the previously saved revision while preserving changes for later
* Drafts are private to you until saved as a revision; other users cannot see your drafts

When you have unsaved changes, a draft indicator appears in the Model Viewer toolbar:

<figure><figcaption></figcaption></figure>

When you reopen a model with existing drafts, a popup appears:

<figure><figcaption></figcaption></figure>

* Click **VIEW** then select a draft to continue previous work
* Close the popup and start fresh to create a new draft (previous drafts remain available)
* Click **DELETE ALL DRAFTS** to remove all existing drafts

**Draft management options**

<figure>Multiple drafts interface<figcaption></figcaption></figure>

\\

* **Resume**: Switch to a different draft
* **Stash**: Temporarily store current changes and start fresh
* **Delete**: Remove drafts you no longer need
* **Save**: Convert draft to permanent revision

**Visualise changes made in a draft in Diff mode**

To see what changes are in a draft compared to the last saved revision:

1. Create a fork from the draft (Save as → Fork)
2. In the fork’s Model Overview, go to Revisions tab
3. Compare the two revisions to see draft changes in Diff mode
4. Submit a Pull Request if you want to merge changes back

Note that you cannot partially fork a draft version of a model. When you fork from a draft, the entire model must be included.

{% hint style="success" %}
Saving a draft as a fork removes the original draft. Use Pull Requests to merge changes back to the main model.
{% endhint %}

### Manage revisions

Every time you save a model, a new revision is created with complete change tracking and comparison capabilities.

#### Access revisions

All revision management features are available in the Model Overview on the **Summary** and **Revisions** tabs.

**Summary tab** - Quick revision access:

* View recent revisions with action buttons
* Compare adjacent revisions or track changes over time
* Quick restoration of recent versions

<figure>Summary tab revisions<figcaption></figcaption></figure>

**Revisions tab** - Complete revision management:

* Full revision history with filtering and search
* Advanced comparison options
* Bulk operations and detailed change tracking

<figure>Revisions tab interface<figcaption></figcaption></figure>

**Revision information includes:**

* Timestamp and author of changes
* Automatic tags showing change source (User, Connector, Pull Request, etc.)
* Comments describing the changes
* Full content snapshot for comparison and restoration

### Compare model versions

**Diff mode** is a visual comparison tool to help you understand exactly what changed between any two model versions. See [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode) for full details.

You can open various comparison options from both the **Summary** and **Revisions** tabs.

**Comparison options from any revision:**

* **View changes at revision**: Compare with the previous version
* **View changes since revision**: Compare with current model state
* **Compare with…**: Select any other revision for comparison

<figure>Revision comparison dropdown<figcaption></figcaption></figure>

**Common comparison scenarios:**

* **Track recent changes**: Compare last few revisions to understand recent work
* **Review collaboration**: Compare before/after Pull Request merges
* **Audit compliance**: Review changes made by specific users or time periods
* **Troubleshoot issues**: Identify when problems were introduced

### Restore previous versions

Restoring a past revision creates a new revision containing previous content, thereby preventing any permanent data loss. It preserves complete history of model changes while undoing unwanted changes.

**Complete restoration workflow:**

**Scenario**: Restore your entire model to a previous state

1. **Navigate**: Go to Model Overview → Revisions tab
2. **Select**: Find the revision you want to restore
3. **View**: Click **VIEW MODEL** to open that version
4. **Restore**: Click **Restore** in the toolbar
5. **Document**: Add a comment explaining why you’re restoring
6. **Confirm**: A new revision is created with the restored content

You can also restore from the Summary tab by selecting the **VIEW CHANGES** dropdown on recent revisions and then the **Restore** option.

**Example restoration scenario:**

*Original revisions:*

* \#5 Extended to include financial concepts (Sep 9, 2021)
* \#4 Renamed customer to client (Sep 2, 2021)
* \#3 More query changes (Aug 16, 2021)

*After restoring revision #4:*

* \#6 Restored model version #4 (Sep 16, 2021) ← New revision
* \#5 Extended to include financial concepts (Sep 9, 2021)
* \#4 Renamed customer to client (Sep 2, 2021)
* \#3 More query changes (Aug 16, 2021)

**Partial restoration workflow:**

**Scenario**: Restore only specific changes from a previous version

1. **Find the revision** containing the changes you want to restore
2. **Open comparison**: Click **View model** then **Diff/Merge** in toolbar
3. **Review changes**: Use **Show changes** to see all differences
4. **Select content**: Choose which specific changes to include/exclude
5. **Save**: Apply only the selected changes to current model

**Best practices:**

* Always add descriptive comments when restoring
* Review changes in Diff Mode before applying
* Use restoration only for major rollbacks, and use pull requests or tasks for selective changes

{% hint style="success" %}
Restoration requires an Author licence and Owner or Author permissions on a model. The **Restore** button only appears for users with editing capability.
{% endhint %}

### Integration with collaboration features

Revisions and model history tracking integrate seamlessly with Solidatus collaboration features to support team workflows.

* Revisions show a commit message to indicate the nature of changes.
* Revisions show the person or connector job who created the revision.
* Tags can be createsd for revisions to indicate the source or nature of changes.
* The list of revisions can be filtered by tag or revision author.
* Revisions are also automatically tagged by source:
  * **Pull request**: Changes from team collaboration
  * **Import update**: Changes to imported content in original model
  * **User changes**: Direct model edits
  * **Connector**: Automated data updates
  * **Parent model changes**: Fork synchronization

{% hint style="success" %}
Click an activity tag on a revision to go to the page for the completed activity.
{% endhint %}

### Next steps

* [Diff Mode: Compare and Merge Model Differences](/models/build-and-edit-models/diff-mode) - Detailed visual comparison and merge tools
* [Activities](/models/share-and-collaborate/activities-and-activity-types/activities) - Team collaboration workflows
* [Model Overview](/the-user-interface/models-ui/model-overview) - Model Overview interface guide
* [Version Control: Forks and Pull Requests](/models/build-and-edit-models/forks) - How branching and forking works
