# Save and share Data Map views

In the course of investigating a Data Map, or a focused Data Map through the Lineage tab of an entry, you can save a Data Map view.

A Data Map **view** is a snapshot that preserves the current state of a Data Map at the point the view is saved.

{% hint style="success" %}
The **current state** of a Data Map includes applied context groupings and applied focused-lineage trace (if the view is saved when a focused trace is applied).
{% endhint %}

A **view** is more than just a screenshot or frozen image – the initial state of the Data Map preserved in a view can be modified in the course of exploring it.

## Save a Data Map view

To save a Data Map in its current state, click the save-data-map-icon icon next to the context dropdown menu.

<figure><figcaption><p>Save and share a Data Map view</p></figcaption></figure>

Give your view a name and description that will appear in the Data Map views tile on the domain homepage, then click the **Save** button.

A link to the view will appear on the `Data map views` tile on the homepage of the Data Domain.

<figure><figcaption><p>Save and share a Data Map view</p></figcaption></figure>

The Data map views tile displays when the view was saved and the account name of who saved it.

When you open a view, icons to the left of the view’s name indicate whether the Data Map is in an open or focused-lineage state.

<table data-header-hidden><thead><tr><th width="47.208587646484375"></th><th></th></tr></thead><tbody><tr><td>focused-saved-datamap</td><td>The Data Map is focused on the lineage of a target entity. Entities that do not belong to the lineage of the focal entity are hidden.</td></tr><tr><td>open-saved-datamap</td><td>The Data Map is not focused on a target entity and it includes all entities from Lineage models published to the domain. All lineage in the domain can be viewed and explored in an “open-world” fashion.</td></tr></tbody></table>

{% hint style="success" %}
Views do not currently preserve active Display Settings or the state of expanded and collapsed entities, except for the expanded hierarchy of the target entity in a focused-lineage Data Map view.
{% endhint %}

## Share a Data Map view

{% hint style="warning" %}
Only Owners of a Data Domain can save Data map views, but saved views can be opened by anyone with access to the domain.
{% endhint %}

When you save a Data map view, it is automatically shared with everyone who can access the Data Domain via a link on the `Data map views` tile on the domain homepage.

It is not possible to share a view with Solidatus users who do not have access to a domain or to restrict access to the view to only a subset of domain Owners and Members.
