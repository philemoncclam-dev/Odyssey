# Reference model design

Reference models are the crucial ingredient for enabling Data Domains to bridge the languages of business and IT in an organisation.

The multiple ways Reference models function in a Data Domain altogether allow you to apply business, regulatory, semantic, and other reference lenses to technical data lineage flows.

The functions of Reference models in a Data Domain can be broken down into three things that Reference models supply to a domain:

* Reference metadata content
* Information architecture
* Visual context for a Data Map

{% hint style="success" %}
The visual context function only applies to Reference models designated to function as *Context* models in a domain. Specific information relevant only to *Context* Reference models is on the [Context Model Design](/data-domains/understand-data-domains/domain-context-model-requirements) page.
{% endhint %}

## Metadata content

Reference models can simply contain metadata entities (referred to as **terms**) relevant to a Data Domain that will be discoverable in the domain they are published to.

Terms in published Reference models surface in the domain in the same way as entities in published Lineage models: an Entry Page in the domain is created for each Layer, Object, Group, and Attribute in a published Reference model.

## Information architecture

Reference models can be used to organise data assets and lineage entities in a domain. For example, you can classify entries in a domain according to business processes, semantic terms, or regulations and policies that are supplied in Reference models.

Reference models fulfill this information architecture function in two ways:

1. Related terms can be used as search filters or in queries, so only entries related to a chosen term will be displayed in the search results.

{% hint style="success" %}
See [Search a Data Domain](/data-domains/explore-data-domains/search-domain) for more information on using Reference terms as search filters.
{% endhint %}

2. You can see a full list of domain entities related to a Reference term in the `Related Entities` tab on the Entry Page of a term.

Both of these functions allow Reference relationships to organise the contents of a domain.

Let’s consider an example of how Reference relationships can make critical information easy to find for someone exploring the domain:

Reference models are often used to store regulations and policies that apply to data assets represented in Lineage models.

You can easily find entities related to a specific regulation or policy by visiting the Entry Page for the regulation and viewing the `Related Entities` tab.

You also query for entities related to a term representing a specific policy in a domain, or you can filter the results of a search by relationship to the term representing a relevant regulation or policy item.

## Visual context for a Data Map

Reference models published to a domain can be designated as **context** models in the domain [Data Map settings](/data-domains/build-data-domains/edit-data-domains#data-map-settings).

Designating a Reference model as a context model makes it available to apply to a Data Map visualisation, in which case lineage entities will be embedded in expandable grouping boxes that represent context model terms to which the entities are related.

The [Configure a context model](/data-domains/build-data-domains/configure-a-context-model) page explains how to build a Reference model that will be used as a context model to organise the layout of a Data Map.
