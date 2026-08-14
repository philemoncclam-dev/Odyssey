# Data assets in Data Domains

The purpose of the Data Asset functionality in Solidatus is to give you a unified view of identical data elements represented across multiple models.

This unified view is provided and generated in Data Domains, as they consolidate lineage and metadata for Data Assets across the set of Lineage models published to them. The consolidated view of an asset is shown in a Data map and in dedicated [Asset pages](/data-domains/explore-data-domains/examine-data-assets) in a domain.

{% hint style="success" %}
You can publish all models or a subset of models that contain a given Data Asset to a Data Domain. In either case, a domain only consolidates lineage and metadata for a Data Asset across the models you publish.
{% endhint %}

## Configure Data Assets

Data Assets must be configured within the models published to a domain, not in the domain itself.

Follow the instructions in the [Add and Edit Data Assets](/models/build-and-edit-models/add-and-edit-data-assets) section to set up Data Assets in your models. You have an **Owner** or **Author** role on a model to configure Data Assets in it.

When you publish models containing Data Assets to a domain, the domain automatically presents a count of the number of unique assets in those models on the domain homepage.

<figure><figcaption><p>Access your Data Assets from the domain homepage</p></figcaption></figure>

{% hint style="success" %}
The number of Data Assets represents the number of unique Fully Qualified Names (FQNs) across all published models.
{% endhint %}

Properties and relationships of Data Assets are consolidated and presented on a dedicated page for each asset. This allows you to access a unified overview of lineage and metadata associated with the asset across all models in the domain.

<figure><figcaption></figcaption></figure>

Asset pages must be accessed through the Data Assets section of the domain homepage. You cannot access Data Asset pages through the domain search, through the domain Browse tree, or from the Model Viewer.

To access the page for a Data Asset:

1. Navigate to a domain homepage
2. Select the arrow that appears at the top right of the tile showing the Data Assets count
3. Expand Asset hierarchies to find the asset you want to examine
4. Select the asset to open its page in the domain

## Data Assets for cross-model lineage (recommended)

One of the primary purposes of Data Assets is enable a Data Map to stitch lineage across multiple models automatically.

When the same Data Asset appears in multiple models published to a domain, the Data Map automatically consolidates lineage the asset is involved in across these models.

<figure><figcaption></figcaption></figure>

For example, let’s say Model A contains a Data Asset representing a customer database, and Model B contains the same Data Asset with additional lineage to downstream systems.

If Model A and Model B are published to the same domain, the Data Map shows a **blue line** between the asset in Model A and the same asset in Model B, thus completing the full lineage path from the source customer database to the downstream target in Model B.

{% hint style="success" %}
Assets are considered the same when their FQNs are identical (case-sensitive).
{% endhint %}

## Data Assets in Data Maps

Data Maps display cross-model lineage involving assets through blue lines that link the same asset represented in several models.

When an asset hierarchy is fully expanded in a Data Map, blue lines only appear between the lowest-level assets that are identical across hierarchies.

<figure><figcaption><p>Asset identity links appear at lowest level of asset hierarchy</p></figcaption></figure>

In this example, even though *Informatica* and *Credit Card Landing Area* are identical assets(they have the same Fully Qualified Names), the blue lines only link the lowest level assets in the hierarchy.

Thicker blue lines are displayed when identical sub-assets are inside a currently collapsed higher level asset in the Data map.

<figure><figcaption></figcaption></figure>

In this example, the collapsed *Informatica* asset contains sub-assets that have the same Fully Qualified Name as *Credit Card Landing Area* and *Mortage & Loan Landing Area*.

### Data Assets and context models

You can embed Data Assets in context containers in the same way as non-asset entities. See [Configure a context model](/data-domains/build-data-domains/configure-a-context-model) for a detailed explanation and steps.

## Asset matching across models

To ensure the Data Map stitches lineage across models, you need to ensure that the FQN of a Data Asset is identical in all models it is in.

In the typical case, Fully Qualified Names (FQNs) are automatically assigned by connectors when data is ingested into a model from external systems. You then do not need to manually assign Asset IDs or modify asset properties in underlying models. Simply publish models to a domain and the Data Map automatically stitches together assets with the same FQN using blue lines.

There might be situations where you need to modify asset properties to ensure FQNs match across models - see [resolve FQN mismatches](/models/build-and-edit-models/add-and-edit-data-assets#resolve-fqn-mismatches) for more information on how to do that.

#### Data Assets, atomic models, and composite models

Our [best practice section](/solidatus-best-practice/best-practice-main) covers how to design a [model topology](/solidatus-best-practice/model-topology) that uses model importing into composite models to "fill in" lineage connections across original, atomic models.

If you use Data Assets to build cross-model lineage in a Data Map, you do not need to create composite models to capture lineage across atomic models. Instead, simply publish the original atomic models containing identical assets to the same Data Domain, and the Data Map automatically stitches them together.

When using Data Assets to build cross-model lineage, it's important to ensure that FQNs of identical assets match across the models in a domain.
