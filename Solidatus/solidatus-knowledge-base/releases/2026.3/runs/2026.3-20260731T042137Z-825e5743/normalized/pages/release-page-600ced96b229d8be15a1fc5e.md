# Lineage model design

Lineage Models serve two key functions in Data Domains:

* **Data source**: Every entity in a published Lineage model becomes a searchable, discoverable entry in your domain
* **Lineage visualization**: Data Maps combine lineage from all published Lineage models into a single map

{% hint style="success" %}
When a Lineage Model is published to a domain, a corresponding entry in the domain is created for each Layer, Object, Group, and Attribute in the Lineage model.
{% endhint %}

Entity names in source Lineage models identify domain entries, and names can be used to find entries via

* [Searching](/data-domains/explore-data-domains/search-domain)
* [Browsing](/data-domains/explore-data-domains/browse-domain)
* [Querying](/data-domains/explore-data-domains/query-data-domains)

## Prepare Lineage models

Model preparation is an important step to ensure a domain is an optimal resource for your organisation. Before publishing Lineage models to a domain, consider the following:

### Add essential properties

Data Domains display entity properties on the main `Overview` tab of a domain entry. It helps to include essential information that colleagues need to understand and manage your data assets:

* **Descriptions and definitions** using standard property names
* **Technical details** like data types, update frequencies, and data sources
* **Governance information** including ownership, data quality metrics, and compliance details

**Automatic property display**: Data Domains recognize specific property names and display them in dedicated areas. Any property named Description, Definition, Summary, Explanation, Notes, Details, Context, Background, Meaning, Purpose, Usage, Information, or Remarks will populate the *Description box* on the `Overview` tab of an entry. If more than one of these properties exists, the first one in the priority order listed in the previous sentence is used.

**Special governance properties**: Properties with exact names (case-sensitive) “dq pass/fail”, “dq score”, “owners”, or “pii” appear in dedicated text boxes, making critical governance information immediately visible.

### Create meaningful relationships

Reference relationships are essential for making technical metadata accessible to business users. When you relate entities in your Lineage models to terms in Reference models published to the same domain, you enable:

* **Business-friendly filtering** of search results by Reference terms
* **Cross-model discovery** where users can find data through familiar business concepts
* **Query capabilities** using Domain Query Language to locate, count, and tag data elements

The `Related Entities` tab on each Reference term’s page displays all entities related to the term, providing a clear view of how business concepts map to technical data assets.

### Prepare for cross-model stitching

Data Maps are designed specifically for mapping end-to-end lineage across multiple Lineage models a Data Map can show full end-to-end flows across an entire enterprise-wide data landscape.

They can automatically stitch lineage together across the Lineage models published to the same Data Domain.

There are two ways to achieve this automatic stitching across Lineage models in a Data Map:

* **Data Assets**: Use FQNs to identify the same data elements in published models
* **Composite models**: Build set of composite models that altogether capture full end-to-end flow

{% hint style="success" %}
If you use Data Assets, you should not use composite models to fill in lineage between models. If you use Data Assets, publish all original atomic models to the same domain.
{% endhint %}

## Data Assets for cross-model lineage (recommended)

When the same Data Asset appears in multiple models published to the same Data Domain, the Data Map automatically consolidates all lineage the asset is involved in across these models.

<figure><figcaption></figcaption></figure>

For example, let’s say Model A contains a Data Asset representing a customer database, and Model B contains the same Data Asset with additional lineage to downstream systems. If Model A and Model B are published to the same domain, the Data Map will show a blue Transition between the asset in Model A and the same asset in Model B, thus completing the full lineage path from source to target.

{% hint style="success" %}
Assets are considered the same when their FQNs are identical (case-sensitive), whether they are in the same model or different models.
{% endhint %}

To ensure that the Data Map stitches together lineage across models, you need to ensure that the FQNs of the same Data Asset are identical in all models.

Since Data Maps are designed to exceed the performance limitations of the Model Viewer, using Data Assets to build an end-to-end Data Map is more efficient than using composite models. It also requires less manual effort to set up.

Data Maps automatically create a **blue, two-way Transition** to represent that entities in the Data Map are the same Data Asset.

<figure>Blue transitions show that two items are the same Data Asset<figcaption><p>Blue transitions show that two items are the same Data Asset</p></figcaption></figure>

{% hint style="success" %}
If you use Data Assets to build a Data Map, you do not need to create composite models to fill in lineage between models. Publish the original atomic models to the same Data Domain, and the Data Map will automatically stitch together lineage across models that contain the same Data Asset.
{% endhint %}

### Implementation workflow

1. **Select your models**: Identify models that you want to link together in a Data Map
2. **Configure Data Assets**: Ensure FQNs of the same Data Assets are identical across models
3. **Add business context**: Create Reference relationships to Context model terms
4. **Test integration**: Publish to a domain and open the Data Map to verify the stitching
5. **Iterate and improve**: Refine Data Assets and relationships as needed

## Composite models for cross-model lineage

Data Maps automatically consolidate lineage for entities that have been imported into more than one published model. This enables you to use a set of composite models to stitch together lineage across models that contain the same entities.

The cross-model stitching process can be illustrated with an example:

Let’s say we have two atomic Lineage Models, `A` and `B`. A Data Map cannot represent the lineage between entities in `A` and entities in `B` unless this lineage has been worked out through Transitions between entities in `A` and `B` in a composite Model that is made up of both: `A-B`.

Let’s add two further atomic Models, `C` and `D`. For Data Maps to show lineage across entities in `A`, `B`, `C`, and `D`, the uninterrupted flow of this lineage has to be captured across these Models.

One way this could be achieved is to build a very large composite Lineage Model into which all entities in all models have been imported and to fill in the lineage between them: `A-B-C-D`. However, this is not a practical solution as models containing more than 1 million entities can cause performance issues in the Model Viewer.

Data Maps offer a better way to do this. You can build smaller composite Lineage Models that together capture all lineage when stitched together: `A-B`, `B-C`, `C-D`. A Data Domain can then be built from these three smaller composites, and the Data Map for that Domain would show all lineage from `A` to `D` and in between.

<figure>Stitch entity lineage in composite models in preparation for Data Maps<figcaption><p>Stitch entity lineage in composite models in preparation for Data Maps</p></figcaption></figure>

No individual composite model in this example contains the full lineage from Objects A to D, but altogether they do. The Data Map for a Data Domain to which these composite models are published would automatically stitch the composites together.

<figure>Data Maps stitch lineage together across composite models that contain the same entities<figcaption><p>Data Maps stitch lineage together across composite models that contain the same entities</p></figcaption></figure>

{% hint style="success" %}
Once you’ve created a set of composite Lineage models that altogether capture end-to-end lineage, only these composite models should be published to a single Data Domain.

In other words, to avoid duplication, do not publish both the original atomic models and the composite models into which the original atomics have been imported.
{% endhint %}

Here is the same Data Map fully expanded to show end-to-end lineage at the Object level.

<figure>Data Maps fill in lineage across composite models<figcaption><p>Data Maps fill in lineage across composite models</p></figcaption></figure>
