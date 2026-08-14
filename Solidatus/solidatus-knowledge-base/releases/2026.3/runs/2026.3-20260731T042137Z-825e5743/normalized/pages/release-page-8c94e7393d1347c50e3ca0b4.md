# Edit Data Domain settings

To modify a Data Domain after its been created, find the domain `Settings` in the three-dots menu at the top-right of the domain's homepage.

<figure><figcaption><p>Open the Data Domain setting</p></figcaption></figure>

The features of a Data Domain you can modify are the same features you defined when creating a domain, with the notable addition of Permissions and Advanced settings.

**Settings options:**

* [Summary](/data-domains/build-data-domains/create-data-domains#step-1-name-and-describe-your-domain) - Edit the name and description of your Data Domain
* [Models](#model-settings) - Change which models are published to the Data Domain
* [Data Map](#data-map-settings) - Change which Reference models are designated as *Context* models
* [Permissions](#data-domain-roles-and-permissions) - Share and manage access to your Data Domain
* [Advanced](#delete-a-data-domain) - Delete your Data Domain and the Data Map, Analytics Reports, and Data Map views belonging to it

<figure><figcaption><p>Edit the Data Domain settings</p></figcaption></figure>

To move through the different settings sections, Click the name of the section in tabs at the top of the page.

<figure><figcaption><p>Move through Data Domain settings</p></figcaption></figure>

To save new settings you’ve entered, remember to click the SAVE button in the top-right after you've made changes.

Click `CANCEL` at any time to return to the Data Domain homepage and revert to the most recently saved settings.

The Permissions and Advanced sections do not have a SAVE button. When you add a user or change their access Role, or delete a Data Domain, the change is automatically registered.

## Model settings

{% hint style="warning" %}
When you modify which models are published to a domain, make sure to click SAVE at the top-right.
{% endhint %}

<figure><figcaption><p>Modify which models are published to the Data Domain</p></figcaption></figure>

## Data Map settings

In this tab, you will see a list of **all and only** Reference models that you selected in the `Models` tab.

Here, you can designate Reference models as context models to be used for grouping the Data Map.

{% hint style="success" %}
We strongly recommend using only one context model per data domain. If you'd like to group the same Lineage models by another set of terms, create a separate domain with its own context model.
{% endhint %}

<figure><figcaption><p>Select context models for use with the Data Map</p></figcaption></figure>

Recall that *Context* models must be designed in advance and according to some simple rules in order to function correctly in a Data Map.

For an explanation of what a *Context* model is and for full instructions on how to set one up, see [Prepare Models for Data Domains](/data-domains/understand-data-domains/prepare-models-to-publish-to-domains) and [Context Model Requirements](/data-domains/understand-data-domains/domain-context-model-requirements).

Once you’ve built your *Context* models, publish them in the `Models` tab, then select the checkbox next to them in the `Data Maps` tab. This makes these models available to apply using the *Context* dropdown menu at the top-left in a Data Map.

<figure><figcaption><p>Select context to apply to a Data Map</p></figcaption></figure>

## Share a Data Domain

When you’re ready to share your Data Domain with other registered Solidatus users in your organisation, click `Settings` at the top right of the Data Domain homepage.

Click the `Permissions` tab.

<figure><figcaption><p>Invite users and groups to access Data Domain</p></figcaption></figure>

* Click `+ Add user/group` to search for and individual or group to share your Data Domain with.
* Use `Filter and Sort` to list members of your Data Domain by role or alphabetically.
* Click `Download (CSV)` to download a list of added users and their permissions.
* Search for someone you’ve shared your Data Domain with using the `Search Members` box.
* You can set access permissions by assigning users a **Role**.

## Data Domain roles and permissions

The Permissions section does not have a SAVE button. When you add a user or group, or change their access Role, the change is automatically saved.

<table data-header-hidden><thead><tr><th width="150.28729248046875"></th><th></th></tr></thead><tbody><tr><td><strong>Data Domain Owners</strong></td><td>Can both view all contents of a Data Domain and edit Data Domain settings, including permissions and sharing.</td></tr><tr><td><strong>Data Domain Members</strong></td><td>Can search and browse all Data Domain contents, including Data Maps, but cannot view or edit Data Domain settings.</td></tr></tbody></table>

{% hint style="success" %}
Both Owners and Members automatically gain **Viewer (read-only)** access to all original models published to a Data Domain and can open these models in the Model Viewer in read-only mode through a domain.

However, users who only have access to models via a Data Domain Role are not listed as Viewers in the Model Overview of the original models, and the original models are not visible to them in the Model Browser.
{% endhint %}

## Delete a Data Domain

To delete a Data Domain, click the `Advanced` settings tab.

The only action in the `Advanced` tab is to delete the Data Domain.

<figure><figcaption><p>Advanced setting allow you to delete a Data Domain</p></figcaption></figure>

{% hint style="success" %}
Deleting a Data Domain can only be performed by an Owner of the domain, and it cannot be undone.

Deleting a domain also deletes the Data Map, Analytics reports, and Data Map views that belong to it.
{% endhint %}

<figure><figcaption></figcaption></figure>

Click the bin icon or `DELETE` to delete the domain. To ensure you don’t accidentally delete a Data Domain, you will be asked to confirm this choice or cancel it to go back to the domain settings.
