# Understand Data Domains

Data Domains give business users a one-stop portal into their organisation's data, governance, and lineage landscape. They transform the technical lineage and metadata stored in your Solidatus models into indispensable, business-friendly resources for your entire organisation.

Think of Data Domains as library catalogs for your data architecture. Just as library catalogs help you find books by title, author, or topic, Data Domains give you the ability to survey data and technology infrastructure that feeds into crucial business-facing reports through familiar business terms and context.

Data Domains bring three core enhancements to Solidatus:

* **Data discovery**: Search and browse your data landscape using business-friendly terms and classifications, with an interface as intuitive as a web search or file browser.
* **Cross-model lineage**: Visualise end-to-end data flows across multiple models using integrated [Data Maps](/data-domains/data-maps), with automatic stitching of common [Data Assets](/models/understand-solidatus-models/data-assets-101).
* **Quantitative insights**: Generate [Analytics reports](/data-domains/analytics-reports) and charts for data-driven analysis of the lineage and governance landscape captured in a domain.

## Data Domains and models

Models serve as the foundation of Data Domains, in that all data elements, metadata, lineage, and context in a Data Domain derives from a set of models published to it.

**Use Data Domains when:**

* Enabling self-service data exploration, especially for non-technical users
* Building cross-model lineage views that span multiple models
* Creating organisation-wide data inventories for discovery and governance
* Summarising a lineage landscape according to business terms, functions, and processes

**Common Data Domain examples:**

* **System-focused**: “Data Warehouse Domain” for all models related to your data warehouse
* **Department-focused**: “Finance Domain” for models relevant to financial reporting
* **Product-focused**: “Credit Card Domain” for models for credit card data flows
* **Regulatory-focused**: “Liquidity Reports Domain” for all systems feeding key regulatory reports

## Data Domain basics

Data Domains are built by publishing Lineage and Reference models to them. All information in a Data Domain originates from these published models.

<figure>The architecture of Data Domains<figcaption><p>Data Domains aggregate content from published models</p></figcaption></figure>

The process of building a Data Domain involves:

1. **Building models**: Create Lineage models (for data flows) and Reference models (for business terms) or use existing ones
2. **Establishing relationships**: Connect your lineage model entities to Reference terms using Reference relationships
3. **Publishing to a domain**: Select the models to include in your Data Domain
4. **Enabling discovery**: Users can now explore lineage in a Data Map and search, browse, query, and run analytics using a business-friendly portal interface

## What’s inside a Data Domain

Data Domains contain two types of content from your published models:

<table data-header-hidden><thead><tr><th width="179.4398193359375"></th><th></th></tr></thead><tbody><tr><td><strong>Data elements</strong></td><td>Data elements (e.g., databases, tables, columns, reports) and their lineage. These are entities and Data Assets from your Lineage models. They comprise <em>what</em> data you have in your domain and how it flows.</td></tr><tr><td><strong>Reference terms</strong></td><td>Classifications and context (business glossary terms, policies, governance frameworks) from your Reference models. These document and provide business <em>meaning</em> for your data elements.</td></tr></tbody></table>

<figure>The architecture of a Data Domain<figcaption><p>Content structure within a Data Domain</p></figcaption></figure>

**How lineage model entities and reference terms work together in a domain:**

* Published data elements and terms maintain their hierarchical structure (ancestor and sub-entities) from models
* Reference relationships link data elements to relevant Reference metadata
* Reference terms provide search filters by relationship and context grouping
* Data Maps group lineage flows according to related terms from context model&#x73;**\***

**\***[Context models](/data-domains/understand-data-domains/domain-context-model-requirements) are just Reference models, but ones designed and mapped for applying visual grouping to a Data Map.

## Data Domain ingredients

To create an effective Data Domain, we recommend you prepare:

1. **Lineage models** - Contain your data elements and lineage flow
2. **Reference models** - Contain semantic terms, classifications, and glossaries
3. **Reference relationships** - Connect data elements to Reference terms for business meaning
4. **Context models** - Designated Reference models that create visual groupings in Data Maps

{% hint style="success" %}
These are recommended components, but a domain can be built from any model or set of models, even if only one model or model type is included.
{% endhint %}

The recommended ingredients for a domain are based on considerations of what elements provide end-users and consumers a clear, well-organised, easy to interpret information resource and analytical tool.

To this end, we recommend some minimal preparation before including models in a domain.

Detailed information on model preparation for each model type is covered in [Lineage model design](/data-domains/understand-data-domains/domain-lineage-model-requirements), [Reference model design](/data-domains/understand-data-domains/domain-reference-model-requirements), and [Context model design](/data-domains/understand-data-domains/domain-context-model-requirements).

**Summary of recommended model preparation:**

* Plan your domain scope to align with organisational information needs
* Use [Data Assets](/models/understand-solidatus-models/data-assets-101) to enable automatic cross-model lineage stitching
* Create clear business terms in your Reference models
* Clearly label relationships between technical data elements and Reference terms

{% hint style="success" %}
**Start focused**: Begin by identifying a specific use case (like a regulatory report or department) and building a domain focused on it rather than trying to include everything at once.
{% endhint %}

## Data Map integration

Every Data Domain automatically builds an integrated Data Map from published models — simply publish models to a domain and the Data Map is automatically available.

Data Maps are also automatically updated to the latest saved revision of each source model, so they keep up-to-date automatically when source models change.

A Data Map is a powerful visualisation and analytical tool that:

* **Combines lineage** from all published models into a single view
* **Groups visually** using business terms from your [Context models](/data-domains/understand-data-domains/domain-context-model-requirements)
* **Stitches automatically** across models when [Data Assets](/models/understand-solidatus-models/data-assets-101) or [composite models](/data-domains/understand-data-domains/domain-lineage-model-requirements#composite-models-for-cross-model-lineage) are properly configured
* **Provides high-level summaries** by embedding technical flows in business context

For complete information about Data Maps, see the [Data Maps](/data-domains/data-maps) section.

## Data Assets for cross-model lineage

The Data Asset functionality is designed specifically to enable Data Domains to generate unified views of data elements represented in multiple models. Data elements that exist across multiple models can be seen and analysed as single, unified assets rather than as separate, disconnected entities.

Data Assets unlocks the following Data Domain capabilities:

* **Automatic cross-model lineage**: The Data Map automatically combines all lineage involving each asset across multiple models, showing complete data flows without requiring manual stitching.
* **Consolidated asset information**: Each Data Asset gets a dedicated page that displays all lineage, properties, and relationships from every model where it appears.
* **Asset inventory**: The domain homepage shows a count of unique assets across all published models, providing an overview of the data asset inventory in your domain.

When you publish multiple models to a domain, the Data Map automatically connects identical assets across the models they appear in:

<figure><figcaption><p>Automatic Data Asset "stitching" in a Data Map</p></figcaption></figure>

## Getting started

Ready to build your first Data Domain?

1. **Plan your scope**: Decide what business need your domain will serve
2. **Prepare your models**: Visit [Model Architecture for Domains](/data-domains/understand-data-domains/prepare-models-to-publish-to-domains) for setup guidance
3. **Create the domain**: Follow step-by-step instructions in [Create a Data Domain](/data-domains/build-data-domains/create-data-domains)
4. **Explore the results**: Learn about using domains in [Explore Data Domains](/data-domains/explore-data-domains)

{% hint style="success" %}
**Domain Builders** can benefit from our documentation on how to explore domains effectively, as it helps understand how information from underlying models is organised and how it surfaces to **Domain Explorers**.
{% endhint %}
