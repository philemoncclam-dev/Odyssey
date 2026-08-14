# Model architecture for domains

Domains are built from a set of models published to them. Lineage models and reference models play a unique roles in a Data Domain, and content from each model type surfaces differently.

Creating an effective Data Domain starts with selecting models and ensuring relationships between them are mapped correctly. This page explains how content from different model types affects the functionality available in a domain.

<figure>Model architecture for Data Domains<figcaption><p>Model architecture for Data Domains</p></figcaption></figure>

{% hint style="success" %}
The specific content of Lineage, Reference, and Context models in this diagram are just examples. You can select whichever models fit the purpose of the domain.
{% endhint %}

## Why model preparation matters

Preparing models before publishing them to a domain is important for several reasons:

* **Content:** A domain can only display information already captured in published Lineage and Reference models, so if you want users of a domain to be able to see an data element, property, or relationship, it must be captured in the original model.
* **Visualization:** Data Maps aggregate lineage from all published Lineage models into a single map. What a Data Map shows results directly from the lineage captured in the underlying models.
* **Discovery:** Domain entries become searchable through relationships to Reference terms. Reference relationships help business users find data and lineage through language that is meaningful to them.
* **Business Context:** Context models enable visual grouping that summarises lineage and makes Data Maps easy to interpret for business users

{% hint style="success" %}
Think of model preparation as creating a well-organised library system where books (data) are properly catalogued and cross-referenced for easy discovery. Users can use a general classification like "cookbook" to find the specific book they are looking for.
{% endhint %}

## Data Domain model types

Models you publish to a domain fall into three categories in terms of how they function in a domain.

Note that there are still only two core Solidatus model types — Lineage models and Reference models. **Context model** is just a name we give to a Reference model that is built and designed specifically for the context grouping function provided by Data Maps. To learn how to build and design a context model, visit [Context model design](/data-domains/understand-data-domains/domain-context-model-requirements) and [Configure a context model](/data-domains/build-data-domains/configure-a-context-model).

| **Lineage models**   | Supply data lineage flow, properties, and relationships | <ul><li>Supply an entry in a domain for each entity</li><li>Data lineage for the Data Map</li><li>Further information stored in properties and relationships</li></ul> |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reference models** | Provide reference terms and classification              | <ul><li>Supply entries in a domain for each term</li><li>Filters for domain search</li></ul>                                                                           |
| **Context models**   | Enable high-level, visual grouping for Data Map         | <ul><li>Visually organise and summarise lineage</li><li>Business-friendly classifications of data elements</li><li>Filters for domain search</li></ul>                 |

## Domain ingredients

An effective Data Domain is made up of:

1. **One or more Lineage models** containing your data flows
2. **Reference models** that are related to entities in Lineage models
3. **One Context reference model** for Data Map grouping and business categorisation
4. **Mapped relationships** between Context and Lineage models

{% hint style="success" %}
Without Reference relationships between Context model terms and Lineage model entities, your Data Map will show ungrouped technical lineage that’s harder for business users to understand.

Context models enable you to group technical lineage in categories that are more meaningful in business terms.

See [Context Model Design](/data-domains/understand-data-domains/domain-context-model-requirements) for details on how to set up Context models and map relationships correctly.
{% endhint %}

## Work with Lineage models

Lineage models form the foundation of your Data Domain by providing actual data entities, data assets, and their lineage connections.

Every Layer, Object, Group, and Attribute in a published Lineage model becomes a searchable, queryable domain entry.

The Data Map belonging to a domain aggregates all published Lineage models into a single visualisation, creating end-to-end flow that spans multiple source models.

#### Key considerations

* **Cross-model stitching**: Use [Data Assets](/models/understand-solidatus-models/data-assets-101) to automatically stitch lineage across multiple models for full end-to-end flow
* **Relationship clarity**: Clear relationships and labels ensure technical lineage is well-documented, easy to find, and easy to understand
* **Contextualization**: Relate high-level lineage entities to Context model terms to provide high-level, business-friendly visualizations of technical lineage

{% hint style="success" %}
See [Lineage Model Design](/data-domains/understand-data-domains/domain-lineage-model-requirements) for detailed guidance on preparing Lineage models for cross-model lineage in a Data Map.
{% endhint %}

## Work with Reference models

Every term in a published Reference model becomes both a searchable domain entry and a potential search filter for finding related entities.

{% hint style="success" %}
Reference relationships must exist between reference terms and lineage entities in the same domain for terms to function as search filters.
{% endhint %}

On the entry page of a Reference term in a domain, you can use the `Related Entities` tab to see all lineage entities *in the domain* that are related to the term, providing a clear view of all domain data that falls under a business concept or term.

{% hint style="success" %}
See [Reference Model Design](/data-domains/understand-data-domains/domain-reference-model-requirements) for a guide to Reference models published to a Data Domain
{% endhint %}

## Work with Context models

Context models are Reference models designed to provide meaningful categories for grouping and summarising lineage in a way that makes it easier to understand and navigate.

Context models embed data entities in containers labeled according to meaningful business units and terminology of your choosing.

Context models enable Data Maps to:

* Group related data flows under simple, business-relevant categories
* Provide a high-level summary overviews of complex technical landscapes
* Allow you to drill down into specific areas of interest for more detail and granular analysis

<figure>Context models embed lineage in grouping boxes to provide meaningful business context<figcaption><p>Context models transform technical lineage into business-friendly, grouped visualisations</p></figcaption></figure>

{% hint style="success" %}
Context models only work when proper Reference relationships exist between reference terms in the context model and entities in your Lineage models. Without these relationships, your Data Map will show ungrouped lineage as it is in lineage published models.
{% endhint %}

**High-level implementation steps for context models**:

1. Design your business categorisation scheme
2. [Create the Context model ](/data-domains/build-data-domains/configure-a-context-model)with appropriate terms
3. Map relationships between context terms and lineage entities
4. Designate the Reference model as a “Context” model in the domain settings

{% hint style="success" %}
See [Context Model Design](/data-domains/understand-data-domains/domain-context-model-requirements) and [Configure a context model](/data-domains/build-data-domains/configure-a-context-model) for a comprehensive guides on creating and implementing Context models.
{% endhint %}

## Plan your model architecture

Before publishing models to a domain, consider:

**Audience**: Who will use this domain and what do they need to accomplish?

**Scope**: What data landscape should the domain cover?

**Organization**: How should data be categorized for your audience?

**Discovery**: What search and navigation patterns will users expect?

You don’t need a perfect plan to begin. Start by:

1. Publishing your existing Lineage models
2. Creating a simple Context model with basic business categories
3. Adding relationships
4. Iterating based on how easy the domain is to use and what users find most helpful
5. Refining your models

Once you have a working model architecture, you can expand and refine it over time.

{% hint style="success" %}
Data Domains automatically update when changes are made to underlying models published to them. This means you can continuously improve your domain without needing to republish everything.
{% endhint %}

## Next steps

Now that you understand the model architecture, choose your path:

* **Start with lineage preparation**: [Lineage Model Design](/data-domains/understand-data-domains/domain-lineage-model-requirements)
* **Design your reference vocabulary**: [Reference Model Design](/data-domains/understand-data-domains/domain-reference-model-requirements)
* **Create business context**: [Context Model Design](/data-domains/understand-data-domains/domain-context-model-requirements)
* **Ready to build**: [Create a Data Domain](/data-domains/build-data-domains/create-data-domains)
