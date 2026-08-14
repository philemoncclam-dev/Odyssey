# Context model design

This page explains what **context models** are and how they function in Data Domains.

For detailed instructions on how to build a context model, map relationships to lineage models, and configure it to work in a Data Domain, see [Configure a context model](/data-domains/build-data-domains/configure-a-context-model) in the [Build Data Domains](/data-domains/build-data-domains) section.

## Overview

A **context model** organizes and summarizes lineage in a Data Map by grouping related entities into meaningful business categories.

Context models are simply Reference models, but ones designed and built for the purpose of visually organising and summarising lineage in a Data Map.

<figure>Context models embed lineage in grouping boxes to provide meaningful business context<figcaption><p>Context models embed lineage in grouping boxes to provide meaningful business context</p></figcaption></figure>

When you apply visual context to a Data Map, entities are embedded in expandable grouping boxes representing terms they are related to in a context model.

**Key Benefits:**

* Visual organization of complex lineage relationships
* Business-friendly grouping of technical entities
* Multiple perspectives on the same data through different context models

**Common context model uses:**

Here are examples of classification categories (and sub-categories) that are useful for grouping lineage in a way that business users can easily interpret:

* **Systems:** Oracle Mortgage DB, Snowflake Data Warehouse
* **Regions:** EMEA → Singapore, North America → Canada
* **Data Owners:** Marketing Team → Jane Smith, Finance Department → Joe Boggs
* **Products:** Lending → Credit Cards, Insurance → Home

## How context models work

When you designate a Reference model published to a Data Domain as a Context model, the Lineage models published to the Data Domain are scanned for Reference relationships to terms in the Context model.

{% hint style="success" %}
For instructions on how to designate a Reference model that has been published to a domain as a context model, see [Create a Data Domain](/data-domains/build-data-domains/create-data-domains).
{% endhint %}

When you apply grouping to a Data Map, Lineage model entities appear embedded in expandable boxes that represent terms to which they are related in a context model.

Let’s look at an example that illustrates how applying context groupings affects a Data Map:

**Without context, the Data Map shows only raw entities and lineage from Lineage models.**

<figure>This is a Data Map with no Context applied<figcaption><p>This is a Data Map with no Context applied</p></figcaption></figure>

A Data Map that has no context groupings applied displays initially only Layers in all Lineage models published to the domain.

Top-level lineage entities in the Data Map can be expanded to view sub-entities: Objects, Groups, and Attributes.

Other than aesthetic and navigational differences, the key difference between a Data Map and the Model Viewer is that the Data Map consolidates entities and lineage captured across *all* Lineage models published to a domain.

**With context, entities are grouped into expandable boxes based on their relationships to Context model terms.**

<figure>This is a Data Map with Context applied<figcaption><p>This is a Data Map with Context applied</p></figcaption></figure>

As you can see, the lineage entities in a Data Map with no context have been replaced by high-level grouping boxes that still display Transition arrows representing the lineage that exists between the entities embedded in them.

<figure>Context grouping boxes are containers that can be expanded to show their contents<figcaption><p>Context grouping boxes are containers that can be expanded to show their contents</p></figcaption></figure>

## Best practice for context models

Each Data Domain should contain **only one** context model for grouping the Data Map.

The context provided should be clearly relevant to the name of the domain and the purpose of the domain. This way, those who enter the domain immediately understand the lens through which technical information is organised and presented.

If you'd like to view the same lineage from a different context perspective, create a new domain and add a different context model along with the same lineage models.
