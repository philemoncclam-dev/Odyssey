# Simultaneous model editing

Simultaneous editing features prevent conflicts when changes are made to a model that is open in multiple browser sessions. This can occur when:

* Multiple users edit the same model simultaneously in separate browser sessions.
* A single user opens and edits the same model in multiple browser tabs.

## How simultaneous editing works

Simultaneous editing occurs when multiple users have edit permissions on the same model (such as multiple **Owners** or **Authors**), and they work on a model at the same time in separate browser sessions. Simultaneous editing can also occur when a single editor has a model open in several browser tabs.

When edits are made to a model that is open in several browser sessions, changes are not visible outside the session until they are saved. If changes are saved in any open session, other sessions **must merge them** before they can save their own changes.

## Merging changes from other open sessions

Let's look at a simple example of simultaneous editing:

* Author A and Author B are both editing a model.
* Author A saves their changes, creating a new [revision](/models/build-and-edit-models/version-control) of the model.
* Author B is alerted that there are updates to the model that must be merged.
* Author B must fetch and merge Author A's changes in Diff mode before they can save their own draft.

## Fetch and merge changes

When someone else saves changes while you're editing, a **FETCH MODEL CHANGES** notification appears below the navigation bar.

<figure><figcaption><p>Someone else has saved changes to this model</p></figcaption></figure>

**To merge changes:**

1. Click **FETCH MODEL CHANGES**
2. Review the other editor’s changes in Diff mode using the toolbar options provided.

<figure><figcaption></figcaption></figure>

3. Click **Save** to merge the changes into your draft

You ***must*** merge changes from the latest revision before you can save your draft.

If you click **Cancel merge** when reviewing changes in Diff mode, you return to your draft in the same state as when you entered Diff mode. The **Save** button stays disabled until you fetch and merge the latest revision.

After you’ve merged changes from another session, you can modify what was changed (including reverting the changes, if needed) and save your modifications as a new revision.

> **Note:** If you're working with an old draft and you haven't fetched and merged model changes in a while, you may need to fetch many changes saved days or weeks earlier. You may also need to fetch and merge changes made across several revisions if you've saved multiple drafts consecutively without fetching updates in between.
