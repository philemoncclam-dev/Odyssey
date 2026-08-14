# Read-only sharing

Model Owners (but not Authors, Approvers, or Viewers) can share models via a read-only link by clicking the `Share` button in the Model Viewer toolbar.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
Only Solidatus users registered to your environment can use a read-only sharing link.
{% endhint %}

There are a number of ways you can customise a read-only link:

* Select a [view](/models/explore-and-analyse-models/views) to apply when Model is accessed through the link
* Keep the link updated with the current version of the model or pin it to a specific revision
* Add an expiration date
* Limit the number of times the link can be used

## Read-only sharing and permissions

When you access a Model through a read-only sharing link, there will be a number of restrictions on what actions you can perform.

What you **CAN** do:

* Apply views
* Export Grid Reports
* Use the Document Viewer
* Search and query in the search bar
* View entity, model, and reference model info in the sidebar
* Add or edit filters and display rules (but these CANNOT be saved)
* Import and export a .qry file containing queries, filters, and display rules
* Select EDIT in the toolbar to create your own copy of the model that you can edit (only possible if you have an Author licence)

What you **CANNOT** do:

* Share the model
* Create tasks
* Use the Automapper
* Access Model Overview
* Create or edit entities
* Save or fork a model
* Create or edit reference relationships

## Create a read-only link

When you click `Share` in the toolbar, a dialog will open that enables you to create multiple links, view existing links, customise and edit links, and view link information.

## Link actions

<table data-header-hidden><thead><tr><th width="184"></th><th></th></tr></thead><tbody><tr><td>keep-updated</td><td>Check the box next to <code>Keep updated</code> to ensure your link always displays the most up-to-date revision of your Model, which includes saved edits since the link was created. If the box is unchecked, your link will access the revision that was open when the link was created.</td></tr></tbody></table>

The icons to the right of a link in the list enable a number of useful actions:

* copy-to-clipboard-icon - Copy link URL to your clipboard
* download-qr-icon - Download link as a QR code
* email-link-icon - Open mail client to email link to someone
* edit-link-icon - Add an expiration date or limit number of accesses
* delete-link-icon - Delete the link

## Link information

<figure><figcaption></figcaption></figure>

The icons to the right of a link provide useful information, such as which View will be applied to the Model when the link is used and how many times the link has been used.

If the revision is shown as `Current`, it means `Keep updated` was checked when the link was created. This indicates that the link will access the most up-to-date version of the Model.

{% hint style="warning" %}
Read-only links should be considered confidential, but only those who are logged in to a particular Solidatus instance can use them.
{% endhint %}

## Important notes on read-only links

* Read-only links can only be created and shared by model owners (Authors, Approvers, and Viewers will not see the `Share` button in the toolbar)
* You may select a [View](/models/explore-and-analyse-models/views) to apply to the model when it is accessed through the link
* The link can be shared as a URL and/or a QR code
* When viewing a model via the link, the Model Viewer toolbar includes an `Edit` button - click this to log in to Solidatus to create your own copy of the model in the same Solidatus environment (you must have an Author licence to do this)
* A list of existing read-only links is shown only to model Owners on the `Summary` tab on the [Model Overview](/the-user-interface/models-ui/model-overview)
* Model Owners can also see a more detailed list of existing links by clicking the `Share` button in the [Model Viewer](/the-user-interface/models-ui/model-viewer) or by clicking on the [Actions](/the-user-interface/models-ui/model-overview#actions-menu) drop-down menu in the [Model Overview](/the-user-interface/models-ui/model-overview) and choosing `Manage Sharing` - these lists allow you to edit, share, follow, copy, or delete the links.
