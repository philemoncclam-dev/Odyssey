# Solidatus basics for domain explorers

If you are coming to Solidatus to use and explore a Data Domain, and you are not familiar with other capabilities in the application, some background is useful. This page provides information to help you, as a Domain Explorer, interpret what you find in a Data Domain.

## Data Domains and Solidatus models

Solidatus Data Domains are built on top of Solidatus **models**, which are visualisation tools used to capture and store data lineage and metadata for data that exists in an organisation’s data ecosystem.

All information that surfaces in a Data Domain originally comes from a set of models that are **published** to the domain.

Data Domains are portals into information stored in models. They provide tools to help you understand and visualise data lineage within meaningful business contexts.

{% hint style="success" %}
Information in a Data Domain can only be edited in the original source models, not directly in the domain itself.
{% endhint %}

If you have a question about something you find in a Data Domain, or if you have a suggestion for editing content, contact the Domain Owner. Owners of a domain can consult the original source models or contact Owners of the original models, to make necessary changes.

## Lineage vs. Reference models

There are two types of source model from which information in a Data Domain is derived: Lineage models and Reference models.

Although the functionality of Lineage and Reference models is identical in almost all respects, they are distinguished due to the different type of information they contain and the purposes they are intended to serve.

**Lineage models** are intended to represent physical data elements (Databases, schemas, tables, columns, files, etc.) and their lineage from source to a target using directional arrows.

**Reference models** are meant to contain content like data dictionaries, business glossaries, policy items, regulations that classifies and documents physical assets represented in Lineage models.

When exploring a Data Domain, you will notice that entries in a domain fall into three classes: they are either a lineage **entity**, a **data asset**, or a **reference term**.

<table data-header-hidden><thead><tr><th width="167.2994384765625"></th><th></th></tr></thead><tbody><tr><td><strong>Entities</strong></td><td>Originally derived from Lineage models, <strong>entities</strong> typically represent physical data elements like schemas, databases, tables, columns, transformations, reports, files, etc. They are the components – sources and targets – of data lineage flows.</td></tr><tr><td><strong>Data Assets</strong></td><td>Data Assets, like entities, are also physical data elements. They differ in that they have a set of <em>Asset properties</em> that precisely identify their location and structure within their source technology. Data Assets can display a source technology and type icons, and they are stored in a separate area from non-asset entities in Data Domain.</td></tr><tr><td><strong>Reference Terms</strong></td><td>Originally derived from Reference models, terms typically represent entries in a business glossary, regulatory policies, governance frameworks, or other taxonomies that document and provide business meaning to physical data assets.</td></tr></tbody></table>

You can find and investigate entities, Data Assets, and Reference terms in a Data Domain, and you can explore the lineage of entities and assets in a Data Map.

In a Data Domain, icons next to an entry display whether the entry corresponds to a Lineage **entity** or Reference **term**.

<table data-header-hidden><thead><tr><th width="54.4921875"></th><th></th></tr></thead><tbody><tr><td></td><td>This icon represents a Lineage entity, which is usually a physical data element such as a schema, database, table, column, file, field, etc.</td></tr><tr><td></td><td>This icon represents a Reference term, which is usually a unit of semantic, governance, reference, or regulatory metadata.</td></tr></tbody></table>

In Solidatus models, entities, terms, and assets are organised **hierarchically**: they are situated in relation to entities that contain them and sub-entities that are contained in them.

<figure>The hierarchical entity types in a Solidatus model<figcaption><p>The hierarchical entity types in a Solidatus model</p></figcaption></figure>

{% hint style="success" %}
The general hierarchical structure of **entity types** from top-level to bottom-level in a model is Layer>Object>Group>Attribute.
{% endhint %}

In the search or query results page and on an Entry Page, the path of an entity or term in a published Lineage or Reference Model is shown. A path represents the hierarchical location of an entity or term in the form of Model>Layer>Object>Group>Attribute.

<figure>Layer>Object>Attribute"><figcaption><p>The Path of "Loan Loss Projections" in the form Model>Layer>Object>Attribute</p></figcaption></figure>

<figure>Layer>Object>Attribute"><figcaption><p>The Path of the eBranch Management term in the form Model>Layer>Object>Attribute</p></figcaption></figure>

## Reference relationships in Data Domains

While the functionality of Lineage and Reference models is nearly identical, there is one key, significant difference: [Reference relationships](/models/understand-solidatus-models/understand-reference-relationships) allow you to connect a term in Reference model to an entity or term in a separate model with a label that describes the meaning of the relationship.

{% hint style="success" %}
A **Reference relationship** consists of an entity, a term, and a label that describes the relationship.
{% endhint %}

Reference relationships surface in a variety of ways in a domain, allowing you to understand data elements through semantic, governance, regulatory, and business terms and taxonomies.

Reference relationships enhance information structure of a Data Domain:

* **Reference content**: Relationships supply reference content and metadata that you can search for and query directly
* **Business meaning**: You can view an entity or term’s relationships in a Data Map or in the `Overview` tab of an entry’s page.
* **Data discovery**: Relationships can be used as search filters to find related lineage entities, you can query for entities related to a term, and you can view the list of all `Related Entities` in a domain on the page of a Reference term.
* **Visual grouping in a Data Map**: When you apply visual context to a Data Map, entities are embedded in expandable boxes that represent terms they are related to in a *Context* Reference model.
