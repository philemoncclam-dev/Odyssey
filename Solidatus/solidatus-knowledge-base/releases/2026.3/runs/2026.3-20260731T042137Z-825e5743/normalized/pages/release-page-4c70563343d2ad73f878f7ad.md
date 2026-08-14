# Data Assets 101

The core purpose of the **Data Assets** functionality is to enable Data Domains and Data Maps to consolidate lineage and metadata automatically across multiple models published to the same domain. It is a mechanism for automatically identifying and grouping entities in multiple models that represent the same real-world data element.

Here are the key things you can do with Data Assets:

* Automatically "stitch" end-to-end lineage across your entire data landscape
* View all information about a data element that appears in multiple models in one place
* Identify data elements using clear logos and icons for source technologies (Snowflake, PowerBI, Oracle, etc.) and data element types (schema, table, column, etc.)

**How it works:**

The Data Assets functionality works by using unique identifying properties (specifically an **Asset ID** and **Fully Qualified Name \[FQN]**) to match and group entities across models that represent the same real-world data element. When assets with the same **FQN** are published to a Data Domain, the Data Map automatically consolidates lineage for an asset across the published models it appears in.

Entities become **Data Assets** when they are assigned an **Asset ID**. When entities in models are assigned an **Asset ID**, an **FQN** is automatically generated for them.

**FQN**s are unique signatures used for asset matching. When assets with the same **FQN** are published to a Data Domain, the Data Map automatically consolidates their lineage, and an asset page is generated that consolidates properties and relationships across models — this allows you to see all information about an asset in one place.

## What are Data Assets?

In the simplest terms, a Data Asset is an entity that possesses an Asset ID, and giving an entity an Asset ID turns it into a Data Asset.

Assigning an Asset ID to an entity automatically generates its Fully Qualified Name (FQN). When entities with the same FQN appear in the same model (though this is not the standard case) or in multiple models, Solidatus recognises these entities as representations of the same data element.

#### Data Asset example

A column named *Customer\_ID* in a **Customers** table might be represented in:

* A Source System model
* An ETL pipeline model
* A Data Warehouse model

Without Data Asset properties, Solidatus would not recognise entities in these separate models as representations of this specific *Customer\_ID* column, even if they have identical names and other properties.

With Asset properties properly configured, Solidatus recognises entities in separate models as instances of the same *Customer\_ID* column.

This recognition enables two key enhancements:

* Solidatus can generate a Data Map that automatically stitches together the lineage of the *Customer\_ID* column from the multiple models it appears in.
* A Data Domain can aggregate information about the *Customer\_ID* column from all published models into a single page, providing a comprehensive view of lineage and documentation across the data landscape.

## Why use Data Assets?

The primary purpose of Data Assets is to enable automatic cross-model lineage stitching in a Data Map and automatic unification of information about an asset in a Data Domain.

When models containing the same assets are published to a Data Domain, Solidatus automatically generates a Data Map that consolidates lineage of assets across all published models.

<figure>Lineage stitching of Data Assets across models in a Data Map<figcaption><p>Lineage stitching of Data Assets across models in a Data Map</p></figcaption></figure>

In a Data Map, **blue transitions** without arrows represent the **identity** of two "things": they are the same Data Asset.

Blue transitions show that the same data element is represented in multiple models, and they enable you to track a full lineage flow across models.

In a Data Domain, you can view all information about an asset that exists in several models on one [asset page](/the-user-interface/data-domains-ui/data-assets-in-domains), including all lineage, relationships, and properties.

## Asset properties explained

Asset properties function to identify a Data Asset and store additional information about it.

There are three Asset properties:

<table data-header-hidden><thead><tr><th width="177.14520263671875"></th><th></th></tr></thead><tbody><tr><td>Asset ID</td><td><ul><li>The ID of an asset.</li><li>Assigning an <em>Asset ID</em> turns an entity into a Data Asset.</li><li>The <em>Asset ID</em> is used to generate an FQN (Fully Qualified Name), which is used for asset matching across models (see <a href="#asset-ids-fqns-and-asset-hierarchies">Asset IDs, FQNs, and asset hierarchies</a>).</li><li>An <em>Asset ID</em> is initially set to an entity’s name when first assigned, but both entity names and <em>Asset IDs</em> can be modified independently afterward. <em>Note that changing an Asset ID will change the FQN of the entity, which will affect asset matching.</em></li></ul></td></tr><tr><td>Technology</td><td>(<em>Optional</em>) Identifies the source system or technology where the asset exists (e.g., Snowflake, Oracle, Power BI). This enables Solidatus to use recognisable logos for easy identification, and it helps distinguish between assets with similar names across different systems. See Technology logos for the list of technologies with supported logos.</td></tr><tr><td>Type</td><td>(<em>Optional</em>) Categorises what type of data element the asset is (e.g., Table, Column, File, etc.). This enables Solidatus to generate clear icons, and it is useful for filtering and analysing assets of similar types.</td></tr></tbody></table>

Giving an entity an *Asset ID* turns it into a Data Asset, and an *FQN* is then automatically assigned. FQNs are derived from an asset's Asset ID and the Asset IDs of all ancestors that are also Data Assets (see [Asset IDs, FQNs, and asset hierarchies](#asset-ids-fqns-and-asset-hierarchies)).

**FQNs** (Fully Qualified Names) are used for asset matching within and across models, as they create precise, unique signatures for each data element based on its location in the data ecosystem. Data Assets with the same **FQNs** are treated as the same.

{% hint style="success" %}
While Asset IDs are not directly used for matching, FQNs are derived from an asset's Asset ID and the Asset IDs of its ancestor assets. Asset IDs thereby play an important role in determining the unique signature of an asset.
{% endhint %}

### Asset IDs, FQNs, and asset hierarchies

An asset’s *FQN* is derived from both its own Asset ID and the Asset IDs of ancestor assets in its **asset hierarchy**.

An **asset hierarchy** refers to ancestors and descendants of an asset that are also Data Assets. An Asset hierarchy differs from a model hierarchy in that only entities with AssetIDs and FQNs (i.e., entities that are also Data Assets) are included in an Asset hierarchy.

An *FQN* is like a path, but it differs from the path of an entity in a model in that an FQN only includes ancestors that are also Data Assets, and it is based on Asset IDs, which do not have to match entity names.

For example, if an Attribute named *Customer\_ID* is a Data Asset, but none of its ancestors are Data Assets, it is considered a **root** or **top-level** Data Asset in its hierarchy. Its *FQN* is then the same as its *Asset ID* (e.g., `Customer_ID`).

If the *Customer\_ID* Attribute is a child of an Object named *Customer* that is also a Data Asset, the FQN could be `Customer/Customer_ID`.

{% hint style="success" %}
These examples assume Asset IDs are the same as entity names, but note that this is not required.
{% endhint %}

## Edit an FQN

**FQNs cannot be edited directly**. If you need to change an asset’s *FQN*, for example to match it with another asset, there are several ways to do this:

* Change the *Asset ID* of an asset
* Change the *Asset ID*s or asset status of ancestor entities
* Add or remove ancestor assets in its asset hierarchy
* Move the asset’s level up or down in its asset hierarchy

{% hint style="success" %}

* Asset IDs of distinct assets are not required to be unique across a single model, as only FQNs are used for asset matching. However, it is recommended to use unique Asset IDs to avoid confusion.
* Asset IDs of distinct assets are not required to be unique across multiple models, as only FQNs are used for asset matching. However, it is recommended to use unique Asset IDs to avoid confusion.
* Asset IDs and FQNs are case-sensitive, so *Customer\_ID* and *customer\_id* are considered different values.
* Asset IDs can be any string value, including spaces and special characters.
  {% endhint %}

## How asset matching works

Solidatus evaluates Data Assets for matches when models containing Data Assets are published to a Data Domain. It treats assets with identical FQNs (with case-sensitivity) as the same asset.

**Example FQNs**:

* Database Table: `snowflake/FINANCE/CUSTOMER_TABLE`
* Table Column: `snowflake/FINANCE/CUSTOMER_TABLE/CUSTOMER_ID`

**Practical Example**

Consider again a *Customer\_ID* column that exists in multiple systems and multiple models representing each system.

It could have the following Asset properties:

* **Asset ID**: Customer\_ID
* **FQN**: `oracle/CRM.CUSTOMERS/Customer_ID`
* **Technology**: Oracle
* **Type**: Column

Let’s say the same column appears and has the same FQN in both a Source System and an ETL model.

When both models are published to a Data Domain, Solidatus recognizes the *Customer\_ID* column in both models as the same data element. It then generates a Data Map that connects the *Customer\_ID* column across all published models it appears in.

<figure><figcaption></figcaption></figure>

## Get Started with Data Assets

To begin using Data Assets effectively:

* Identify key data elements that appear in multiple models
* Configure Asset properties consistently across models using the `Properties and Relationships` panel in the Model Viewer. See [asset matching](/models/build-and-edit-models/add-and-edit-data-assets#resolve-fqn-mismatches) for tips on resolving mismatching FQNs.
* Publish models containing the same assets to a Data Domain to see consolidated lineage in the Data Map and consolidated Asset information on a Data Asset page.

## Summary

* Data Assets is a mechanism for grouping representations of the same real-world data elements across models.
* Assigning an Asset ID to an entity turns it into a Data Asset and automatically generates an FQN (Fully Qualified Name).
* FQNs are signatures used for asset matching. Assets with the same FQN (case-sensitive) are treated as the same asset.
* Properly configured Data Assets enable automatic lineage stitching across model boundaries in a Data Map.
* Data Assets make it easier to gain a comprehensive view of a data element and to capture complete lineage across your entire data infrastructure.
