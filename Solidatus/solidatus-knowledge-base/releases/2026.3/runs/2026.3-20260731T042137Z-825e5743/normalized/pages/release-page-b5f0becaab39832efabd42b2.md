# Model tab

This tab gives information about the Model and the changes you have made since opening the Model.

There are 4 panels in the Model tab. Click the links below for further information on each panel.

| [The Model Info Panel](#the-model-info-panel) |
| --------------------------------------------- |
| [The Drafts Panel](#the-drafts-panel)         |
| [The Notes Panel](#the-notes-panel)           |
| [The History Panel](#the-history-panel)       |

## The Model Info panel

This panel shows general infomation about the model. It allows you to view the model description and edit the model name, and it also tells you how many revisions there are.

Click on the clock icon to the right of the number of revisions to open the [Revisions tab](/the-user-interface/models-ui/model-overview) on the Model Overview. You can view the history of model changes and revisit previous versions from there.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
Model metadata is not editable, and it is simply intended to store information about model settings (such as queries, display rules, etc) not including entities and transitions.
{% endhint %}

## The Drafts panel

The Drafts panel lists all currently-available [Drafts](/models/build-and-edit-models/version-control) of the model. You can delete any or all drafts, open a previous draft, and `stash` the current draft (preserves the current draft then reloads the model without any of the changes from the draft - you are now working on a new draft, starting with the latest revision of the model).

<figure><figcaption></figcaption></figure>

## The Notes panel

Use this panel to keep any notes for any reason. This would generally contain extra information about the model to support and extend the Model description. You can format notes, and they will be saved when you save the model.

<figure><figcaption></figcaption></figure>

## The History panel

The History panel lists all and only changes you have made **in the current session** since opening the Model.

{% hint style="success" %}
Clicking on a change will roll the model back to the point that change was made, undoing all later changes as well.
{% endhint %}

When you exit a model or refresh your browser, all entries other than “Original State” are removed and the record of the model’s history starts over.

<figure><figcaption></figcaption></figure>
