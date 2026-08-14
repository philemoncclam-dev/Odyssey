# Solidatus-Collibra Integration Setup Guide

The Solidatus-Collibra integration comprises a bi-directional exchange of data, metadata, and lineage between Solidatus and Collibra. It is designed to boost an organisation’s data management, governance, and compliance initiatives by visually mapping the Collibra catalog and harnessing fine-grained, end-to-end lineage analytics for data assets in Solidatus.

There are numerous benefits of mapping your Collibra estate with Solidatus:

* Ability to track complex lineage with unrivalled detail and scale
* Performant end-to-end and fine-grained asset traceability and lineage analytics
* Solidatus provides back up and tracks change history via version control
* Accelerated content discovery
* Content enrichment across platforms
* Additional data assurance and simplified gap analysis
* Consolidated views across Collibra communities
* Increased connectivity to other applications
* Increased customer satisfaction, and time and cost savings

The purpose of this document is to explain the basics of how to set up a round-trip exchange between Solidatus and Collibra, so you can visualise a Collibra data landscape in Solidatus and send changes made in Solidatus back to Collibra.

{% hint style="success" %}
Customers may have unique requirements beyond what is covered here, and there are always many ways to set up an exchange. To find the best solution for individual needs and circumstances, contact our Expert Services team at [expert.services@solidatus.com](mailto:expert.services%40solidatus.com).
{% endhint %}

While this document assumes your assets are originally captured in Collibra and you are importing into Solidatus, this may not be the case.

We have provided an [Appendix](#appendix-set-up-integration-from-solidatus-as-source) that explains how to set up the integration when Solidatus is the original source and you are populating Collibra via import from Solidatus.

If you have some assets represented in Solidatus and some in Collibra, the instructions covered across both sections will help you move data depending on which platform is the source and which is the destination.

## High-level steps

Setting up a round-trip exchange between Solidatus and Collibra requires four main components and steps:

<table data-header-hidden><thead><tr><th width="90.121826171875"></th><th></th></tr></thead><tbody><tr><td><a href="#step-1-set-up-solidatus-models-to-receive-data-from-collibra">Step 1</a></td><td>Set up empty Solidatus models to receive data from Collibra</td></tr><tr><td><a href="#step-2-set-up-and-run-an-import-job-for-the-collibra-connector">Step 2</a></td><td>Set up and run a Collibra connector import job</td></tr><tr><td><a href="#step-3-craft-your-parent-atomic-models">Step 3</a></td><td>Craft and organise the raw connector output</td></tr><tr><td><a href="#step-4-set-up-and-run-a-collibra-export-job-for-your-lineage-model">Step 4</a></td><td>Set up and run a Collibra connector export job to push changes and additions made in Solidatus back to Collibra</td></tr></tbody></table>

The goal of this set up process is to have Lineage and Reference models that capture the physical and reference assets in a Collibra community, and then to be able to import and export changes between platforms.

### Prerequisites

The instructions provided here assume the following:

* You have a Collibra **community** set up with **domains** that are populated with assets, which could be reference domains or a Physical Data Dictionary domain that contains physical data assets and lineage. Both types of domains can be ingested into Solidatus.
* You are setting up your first extraction of a set of assets from Collibra into Solidatus.
* You have import and export agents for the Collibra connector registered and active on your Solidatus instance.

This document **does not** explain how to set up and register a connector agent or how to create and manage assets in Collibra.

For information on setting up a Collibra connector agent, see the general [Connectors overview](/connectors/connectors-overview) section or connector-specific documentation.

## Collibra-Solidatus concept map

Before integrating Solidatus and Collibra, it is helpful to understand how the high-level, hierarchical organisation and core concepts of the Collibra catalog map to the structure and core concepts of Solidatus and Solidatus models.

<table data-header-hidden><thead><tr><th width="167.0172119140625"></th><th></th></tr></thead><tbody><tr><td><strong>Collibra Concept</strong></td><td><strong>Corresponding Solidatus Concepts</strong></td></tr><tr><td>Community</td><td>A community in Collibra is a collection of domains that contain either reference or physical assets and metadata. In Solidatus, collections of assets can be represented by <strong>models</strong> or by high-level <strong>entities</strong> in models. In real-world scenarios, in which communities contain millions of assets of various types, it is likely optimal to represent communities using several Lineage and Reference models in Solidatus.</td></tr><tr><td>Domain</td><td>A domain in Collibra is a logical grouping of assets, which can be reference assets (glossary terms, data owners, etc.) or physical assets (schemas, tables, columns, etc). In Solidatus, domains are typically represented by a single model that captures an entire domain, or by Layers in models that represent several domains. In real-world scenarios domains can also contain millions of assets, in which case it is best to use several models to capture all assets in a domain, and to use an <strong>output module query</strong> to import only a subset of assets in a domain into each model (see <a href="#the-output-module-query">The output module query</a> for more details).</td></tr><tr><td>Asset</td><td>An asset in Collibra refers to an individual item in a domain, whether a Reference asset or Physical data asset. For example, an asset could be a schema or column (data asset), or a dictionary term (reference asset). Assets are represented in Solidatus as <strong>entities</strong> in a Lineage model or <strong>terms</strong> in a Reference model.</td></tr><tr><td>Relation</td><td>A Relation in Collibra refers both to a type of two-way relationship between Asset Types and to an instance of that type, in which two particular assets are related in the way defined by a Relation type. Collibra Relations can be represented by Transitions, by parent-child hierarchy relationships, or by reference relationships in Solidatus. <em>Note: Collibra Relations between reference and physical data assets can be imported into Solidatus, but this requires custom configurations not covered in this document. For assistance, contact our Expert Services team at</em> <a href="mailto:expert.services%40solidatus.com">expert.services@solidatus.com</a>.</td></tr><tr><td>Attribute</td><td>An Attribute in Collibra holds metadata that further describes and documents an asset. Collibra Attributes correspond to <strong>properties</strong> in Solidatus.</td></tr></tbody></table>

{% hint style="success" %}
In brief, when importing from Collibra, reference assets should be ingested into a **Reference model**, and physical data assets and lineage – contained in a Physical Data Dictionary domain in Collibra – should be ingested into a **Lineage model**.
{% endhint %}

### **Solidatus model entities and Collibra concepts**

The following table shows how Collibra concepts map to Solidatus model entities. Solidatus is flexible in terms of what entity types can represent.

<table data-header-hidden><thead><tr><th width="188.0653076171875"></th><th></th></tr></thead><tbody><tr><td><strong>Solidatus Entity Type</strong></td><td><strong>Collibra Concept</strong></td></tr><tr><td>Model</td><td>A model in Solidatus can represent a Collibra community, domain, or subset of a domain. Note that you can begin to encounter performance issues when a model contains more than one million entities. So, in real-world scenarios, it is often best to use several models to represent an entire community or a large domain.</td></tr><tr><td>Layer</td><td>A Layer typically represents a domain or a top-level asset in a domain, such as a schema or database. Layers can also be used to represent a collection of domains.</td></tr><tr><td>Object</td><td>Objects typically represent assets. In a Lineage model, they typically represent physical data assets that contain sub-assets, such as a schema or table. In a Reference model, they represent reference assets, such as a glossary term or data owner. In Reference models, Objects often do not have sub-assets, and each reference asset is represented as an Object.</td></tr><tr><td>Group</td><td>Groups are used to represent lower-level assets that also contain sub-assets.</td></tr><tr><td>Attribute</td><td>Attributes represent the lowest-level assets, such as columns or fields.</td></tr></tbody></table>

### **Solidatus and Collibra asset types**

The core concepts for grouping assets in Solidatus are **Lineage** versus **Reference**, which map to the distinction between Lineage and Reference model types. Each model type is used to represent corresponding asset types, and the two model types work together to map relationships between the two asset types.

<table data-header-hidden><thead><tr><th width="167.3594970703125"></th><th></th></tr></thead><tbody><tr><td><strong>Lineage assets</strong></td><td>Lineage assets are the sources or targets of data flows. Lineage assets are physical data assets, and connections between them indicate physical lineage flows.</td></tr><tr><td><strong>Reference assets</strong></td><td>Reference assets classify and document lineage assets according to semantic, governance, regulatory, and or other business contexts and taxonomies. In Solidatus,relationships between <strong>reference</strong> assets and physical <strong>lineage</strong> assets are captured through <em>Reference relationships</em> that connect entities in Reference models to entities in Lineage models.</td></tr></tbody></table>

In Collibra, all assets are defined by their asset type, but Collibra asset types do not always overlap cleanly with Solidatus’ distinction between **lineage** and **reference** assets.

For example, Collibra classifies as **data assets** or **technology assets** things like a server, database, or data set. These asset types are **lineage** assets in Solidatus. But Collibra also classifies data models as **data assets**, and data models do not themselves participate in data flows or pipelines.

Collibra classifies as **business assets** or **governance assets** things like reports, dashboards, rules, procedures, and glossaries. Most of these would be classified as **reference** assets in Solidatus; however, reports and dashboards are considered **lineage** assets because data feeds into them and we want to capture that in a lineage model.

Collibra supports custom asset types in addition to “out-of-the-box” types, and custom types may fall either into the **lineage** or **reference** classification in Solidatus.

{% hint style="success" %}
The key point is to ensure that all assets in Collibra – whatever their Collibra asset type – that have physical lineage should be imported into a Lineage model. Similarly, all other assets should typically be ingested into a Reference model.
{% endhint %}

## Step 1: Set up Solidatus models to receive data from Collibra

Setting up models in Solidatus for the integration involves three main steps:

1. Create and name a new, empty Lineage model and a new, empty Reference model
2. Fork both newly created models
3. Note and save the model IDs of the new connector forks you created

{% hint style="success" %}
These steps assume you are ingesting both physical and reference assets from Collibra. If you are only ingesting one or the other, you only need to create and fork a Lineage model or a Reference model, respectively.
{% endhint %}

Before configuring the connector, you’ll need to create empty models that will, ultimately, contain the designed models of your Collibra catalog.

You also want to create connector forks of these new, empty models so you can set up jobs for the Collibra connector to import into the connector forks, not directly into the parent models.

To create a fork:

1. Open the new Lineage or Reference model you created
2. Click `Save As` in the toolbar
3. Make sure `Fork` is highlighted in the tab at the top, then click `CREATE FORK` in the bottom-right corner of the dialog.

By default, your new connector fork will have the same name as the parent followed by “fork”, but you can change this at any time.

{% hint style="success" %}
We recommend naming the fork with a prefix that indicates it is a connector fork, i.e., a fork that is used specifically for importing raw content from a connector. This will help ensure the fork is used only for that purpose.
{% endhint %}

### Why import into model forks?

The reason for importing into connector forks is to separate **raw** model content generated by the connector from the model you will modify, augment, and craft.

If you don’t separate the raw model from the crafted model, any changes you make to the layout of the raw model are overwritten each time an import job is run.

By ingesting into a connector fork and updating the parent model via Pull Requests, you can import via the connector over and over again without overwriting the layout of the parent model with the raw model structure coded into the connector.

{% hint style="success" %}
Entities in forks and parent models are matched by entity IDs. As a result, changes to the name, properties, or relationships of an entity can be merged into a parent model via a Pull Request without affecting the location or hierarchy of the entity in the parent model.
{% endhint %}

The best practice principle of using connector forks for importing via connectors will be clearer as you progress through setting up the integration. For now, note that you need new, empty models and forks of these models, and you will be pulling data from Collibra into the forks, not directly into the parent models.

{% hint style="danger" %}
When changes to the parent model are saved, a Parent Model Update activity is created for the fork that invites you to merge changes made to the parent back into the connector fork.

**Do not synchronise Atomic (Parent) Model Updates back into Connector Forks**

If you do, the next Pull Request from the connector fork will overwrite the layout of the parent model.
{% endhint %}

For information on how to automate the creation and merging of Pull Requests between forks and parent models, see the section [Set up automation for Pull Requests](#set-up-automation-for-pull-requests).

## Step 2: Set up and run an import job for the Collibra connector

This step assumes you have an active import agent for the Collibra connector accessible through the Solidatus user interface.

There are a few things you need to configure import jobs for the Collibra connector:

<table data-header-hidden><thead><tr><th width="264.50830078125"></th><th></th></tr></thead><tbody><tr><td><strong>What you need</strong></td><td><strong>Where to find it</strong></td></tr><tr><td>Model IDs of the Forks you created in <code>Step 1</code></td><td>You can find these at the end of your browser URL when you have the model open in either the Model Viewer or Model Overview. For example, the URL <code>https://demo.solidatus.com/viewer/67a207c0e86accf0542224c4</code> shows the model ID <code>67a207c0e86accf0542224c4</code>.</td></tr><tr><td>IDs of the Collibra domains you want to import</td><td>Collibra IDs are in the URL when you have the domain open in your browser. For example, the URL <code>https://solidatus.collibra.com/domain/01949386-104f-72b8-a665-d2f6f3bfaf67?view=0194d1ea-ccc8-7a1d-9f20-169beff9b44c</code> shows the domain ID after <code>/domain/</code>: <code>01949386-104f-72b8-a665-d2f6f3bfaf67</code> (see <a href="#obtain-solidatus-and-collibra-ids">Obtain Solidatus and Collibra IDs</a> for more details).</td></tr><tr><td>Your Collibra environment URL and valid login credentials</td><td>You probably have these or can obtain them from your organisation’s systems administrator. <em>Note: The Collibra credentials you supply in the connector configuration provide access to the communities or domains you wish to ingest into Solidatus.</em></td></tr><tr><td>A valid API token for the Solidatus API</td><td>To obtain an API token, go to your Solidatus <code>Account</code> page, scroll down to <code>Manage Tokens</code>, fill in the form, and click <code>CREATE TOKEN</code>. Copy your API token and paste it somewhere you can save it for future use, as you will not be able to see it again in the Solidatus interface.</td></tr><tr><td>A <code>relations.jsonc</code> file</td><td>A default <code>relations.jsonc</code> file can be found in the <code>relations</code> directory in the <code>.zip</code> file obtained from Solidatus. This file specifies how Collibra Relations are translated into model structure and vice-versa (see <a href="#edit-the-default-relations.jsonc-file">Edit the default relations.jsonc file</a> for more details and instructions).</td></tr><tr><td>An output module query (optional)</td><td>An output module query is a JSON file that allows you to filter what you are exporting from Collibra to Solidatus. It is often used in the case where a Collibra domain contains large amounts of data and you want to exclude some data from the import. For more information, see the section on the output module query (<a href="/pages/nuNdfkmRSPlkSGviI9ck">The output module query</a>).</td></tr></tbody></table>

Jobs to ingest physical assets and reference assets into Solidatus should be configured to import at the domain level, and each domain should typically be imported into its own atomic model.

Assets in a Physical Data Dictionary domain should be imported into a Lineage model, and assets in all other domains should be imported into a Reference model.

In cases where a domain contains a large number of assets (> 1 million), which is often the case for a Physical Data Dictionary, you can use an **output module query** to filter the data returned by the Collibra API. This is particularly useful when you want to import only a subset of assets in a domain into a single model.

The following instructions explain importing physical assets and reference assets separately.

### Obtain Solidatus and Collibra IDs

IDs required to configure the Collibra import job must be obtained from Solidatus and Collibra. You can copy and paste these IDs from your browser URL into the job configuration or save them to copy and paste later.

#### **Solidatus Model IDs**

Once you’ve created a fork of the parent atomic model you will use to map your Collibra assets, its Solidatus model ID can be found in your browser’s address bar when you have the fork open in the Model Viewer or Model Overview.

#### **Collibra Domains IDs**

If you are importing physical assets and lineage, you need the domain ID of your Physical Data Dictionary.

In Collibra, IDs of domains are located in the middle of the URL (after the `/domain/`) in your browser’s address bar when you have the domain’s page open.

{% hint style="success" %}
You can import multiple domains in a single connector job run, but only into one model, whose model ID you provide in the job configuration.
{% endhint %}

### Edit the default relations.jsonc file

The `relations.jsonc` file is critical for configuring an exchange of data between Collibra and Solidatus. It gives you the ability to customise the way Collibra Relations are represented in Solidatus models, and it also allows you to export hierarchical relationships and Transitions you add to the model as Relations between assets.

If no `relations` configuration is provided, the raw import from the connector is a “flat” model: everything in a domain, whatever its Asset Type, is represented at the same level by the same model entity type, and Relations are captured by Transitions between assets.

This is not the desired outcome, as it does not represent the hierarchical relationships between assets – e.g., where one asset, a Table, contains another asset, a Column – using the hierarchy of model entity types.

The `relations.jsonc` file can add hierarchical structure to the model. It specifies whether to import an existing Relation between assets that are particular Collibra asset types, like a Table and Column, as a Transition or as a parent-child relationship (i.e., one entity contains the other in the model’s hierarchical structure).

When exporting, the `relations.jsonc` file tells the connector to export Transitions and entities you have added to the model as specific Collibra Relations based on the Asset Types of their source and target (for a Transition) or their parent or child (for other entities).

Recall the **four** components of a Collibra Relation:

* **Head** : The Asset type from which a Relation proceeds
* **Tail** : The Asset type to which the Head is related
* **Role** : The semantic meaning of the relation from Head to Tail
* **Corole** : The semantic meaning of the relation from Tail to Head

Let’s look at an example Collibra Relation type: Columns `are parts of` Tables and, vice-versa, Tables `contain` Columns.

* **Head** : Column
* **Tail** : Table
* **Role** : is part of
* **Corole** : contains

The JSON structure of a `relations` file can specify that this Relation is a `hierarchy` relation, thereby telling the connector to import assets that are the Asset type `Column` as *children* of assets that are `Tables` to which they have this Relation in Collibra:

{% hint style="success" %}
The term `Relation` in Collibra refers both to a type and to an **instance** of that type, meaning that two particular assets that are the Asset types of the `Head` and `Tail` have been assigned the Relation type.
{% endhint %}

Note that the `relations.json` file specifies how Relation types are represented in a model, but this affects how instances of these Relations are displayed in a model.

Here is an example of the JSON structure that specifies that the Relation between Tables and Columns should be imported as a hierarchy relation:

```
{
  "Table": {
    "Column": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007042"
    }
  }
}
```

If we upload this JSON as the `relations.jsonc` file in the connector job configuration, columns that have the relation `00000000-0000-0000-0000-000000007042` to tables in Collibra are imported as children in the resulting Solidatus model.

`BP_DW` is a column with the relation `00000000-0000-0000-0000-000000007042` to the table `DW Download` in Collibra. Because we have specified in our `relations.jsonc` file that `00000000-0000-0000-0000-000000007042` is a hierarchy relation, `BP_DW` has been imported as a child of `DW Download`.

**Relations JSON schema**

The following illustrates the general JSON schema for specifying how Collibra Relations are imported and exported.

```
{
  "Asset type 1": {
    "Asset type 2": {
      "type": --> "hierarchy" or "transition",
      "id": --> ID of the Relation between Asset types 1 and 2 (obtained in Collibra),
      "reverse": --> true if Asset type 2 is HEAD of Relation, otherwise false or omitted
    },
    "Asset type 3": {
      "type": ,
      "id": ,
      "reverse": ,
    }
  },
  "Asset type 4": {
    "Asset type 5": {
      "type": ,
      "id":
    }
  }
}
```

The function of the Objects and properties in this JSON structure are described in more detail in the following table.

<table data-header-hidden><thead><tr><th width="218.6806640625"></th><th></th></tr></thead><tbody><tr><td><strong>JSON characteristic</strong></td><td><strong>Function</strong></td></tr><tr><td>Nested JSON Objects</td><td>The outer Asset Type Object is treated as either the parent in a <code>hierarchy</code> relation or the source in a <code>transition</code> relation. The inner, nested Asset Type Object is treated as the child of the outer Asset Type or as the target of a Transition.</td></tr><tr><td><code>"type:"</code> property</td><td>Specifies whether to import a Relation as a <code>"hierarchy"</code> (parent-child relation) or as a <code>"transition"</code>; these are the only possible values.</td></tr><tr><td><code>"id:"</code> property</td><td>Relations with the provided ID are imported/exported as the JSON structure specifies. IDs are found in Collibra (see <a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#type-ids-collibra">How to find Type IDs in Collibra</a>).</td></tr><tr><td><code>"reverse:"</code> property</td><td>If, in Collibra, the inner Asset Type is the HEAD of the Relation specified by the provided ID, the <code>reverse:</code> property must be provided and set to <code>true</code>. This specifies that the nested Asset Type is the HEAD and the outer Asset Type is the TAIL of the Collibra Relation. If the outer Asset Type is the HEAD, the <code>"reverse:"</code> property can be omitted or set to <code>false</code>.</td></tr></tbody></table>

**Copy and paste a relations.jsonc example**

A default `relations.json` file is provided in the directory containing the connector files and executables obtained from Solidatus. However, we recommend replacing the default file or creating a new one of your own, as this ensures the Relations in your specific Collibra environment are captured and represented appropriately in Solidatus.

{% hint style="success" %}
The principles explained above are illustrated the following example. But you can use it to configure your import: just copy the following JSON and paste it into a file to upload when configuring the connector job. You may have to replace the IDs with the IDs of Relations in your Collibra environment.
{% endhint %}

```
{
  "Table": {
    "Column": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007042",
      "reverse": true
    },
    "Column Group": {
      "type": "hierarchy",
      "id": "839f79bc-f674-462a-83db-0009f082682c",
      "reverse": true
    }
  },
  "Column Group": {
    "Column": {
      "type": "hierarchy",
      "id": "0194a879-31a3-7826-bd56-ebf4a36fa349",
      "reverse": true
    },
    "Column Group": {
      "type": "hierarchy",
      "id": "0194bc12-9745-78e1-a539-17ac754ac4ca",
      "reverse": true
    }
  },
  "Column": {
    "Column": {
      "type": "transition",
      "id": "2494a1da-2d7c-4e56-96a0-7b5467d3255f"
    },
    "Field": {
      "type": "transition",
      "id": "140335e3-d277-4fb7-89d8-c27ae3357f9a"
    }
  },
  "File": {
    "Field": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007023"
    }
  },
  "Field": {
    "Field": {
      "type": "transition",
      "id": "b9369280-5eaa-49c8-89b5-2af999092b79"
    },
    "Column": {
      "type": "transition",
      "id": "b8c343e7-ecd2-4d62-b53f-1246770da611"
    }
  },
  "Database": {
    "Schema": {
      "type": "hierarchy",
      "id": "37dfa77a-788a-46e6-8d85-75ceae18067a"
    }
  },
  "Schema": {
    "Table": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007043"
    },
    "Database View": {
      "type": "hierarchy",
      "id": "565a7289-d07f-43f0-a468-5727640c7903"
    }
  },
  "Database View": {
    "Column": {
      "type": "hierarchy",
      "id": "00000000-0000-0000-0000-000000007042",
      "reverse": true
    }
  }
}
```

### The output module query

An output module query is a JSON file that allows you to filter what you are exporting from Collibra to Solidatus. It is often used in the case where a Collibra community or domain contains large amounts of superfluous data that you want to exclude from the import, or when you want to import only a subset of assets in a domain.

In real-world scenarios, a Physical Data Dictionary domain can contain millions of data assets. In these cases, it is best to use an output module query to filter the data returned by the Collibra API to a subset of the assets in the domain.

The Collibra output module is a graph query engine exposed through the public Collibra API. The output module query calls the output module to filter the data returned by the Collibra API.

For comprehensive information on the Collibra output module and on formatting queries, see the Collibra documentation at <https://developer.collibra.com/api/rest/output-module>.

Further information, including the output module query template and examples, can be found in our technical documentation <https://solidatus.gitbook.io/collibra/overview/outputmodulequery>.

### Import physical assets and lineage into Solidatus

In Collibra, physical data assets and their lineage are contained in a Physical Data Dictionary domain type. Therefore, to ingest physical lineage into Solidatus, you need to extract from Collibra at the domain level into the empty Lineage model fork you created in step one.

1. Click the active Collibra import connector agent in your list of Connector agents.
2. Next, click `CREATE JOB` in the top right of the Connector agent page.
3. Click `EDIT` in the `Configuration` box to configure the job either manually or using the wizard (the same details must be supplied in either case).

The following annotated example shows you how to configure your job.

{% hint style="success" %}
This configuration example is not intended to provide full documentation of all configuration options available. Instead, it shows the essential options needed for a successful ingestion of the domain. For documentation on all configuraiton options, see[ Importing from Collibra to Solidatus](/connectors/connector-specific-documentation/collibra/usage/importing-from-collibra-to-solidatus).
{% endhint %}

When you’re finished entering your job configuration details, click `SAVE CHANGES` in the bottom-right corner.

Your job is now ready to be executed by clicking `RUN JOB` in the top-right corner.

When the job executes successfully, as indicated by the green `Success` tag in the user interface, open your Lineage model fork to view the raw model output from the connector.

This example does not include an output module query, but for most real-world integrations there are likely millions of data assets in the Physical Data Dictionary domain. If that is the case, you will likely need to add an output module query to filter the data returned by the Collibra API to a subset of the assets in the domain.

If you are ingesting a domain with more than one million assets, you should:

* Filter the data returned by the Collibra API using an output module query.
* Import subsets of the domain into separate Lineage models.
* Use Data Domains and Data Maps to stitch the models together into a full end-to-end visualisation in Solidatus.

For more information, see the section on the output module query ([The output module query](/connectors/connector-specific-documentation/collibra/usage/output-module-queries)). For assistance configuring an output module query or customising how large domains are represented in Solidatus, contact our Expert Services team at [expert.services@solidatus.com](mailto:expert.services%40solidatus.com).

**Imported properties**

{% hint style="success" %}
In addition to importing structure and lineage, the Collibra connector records Collibra asset IDs and Attributes as **properties** in the Solidatus model.
{% endhint %}

The Collibra connector adds properties to all model entities, including Transitions, that store Collibra metadata, such as asset Attributes, type, ID, location, and status.

{% hint style="success" %}
The Connector also adds a helpful URL link that opens an asset in Collibra, so you can move back and forth between the representation of an asset in Solidatus and Collibra.
{% endhint %}

The properties without a `COLL:` prefix are Collibra Attributes, and the properties prefixed by `COLL:` allow the connector to match entities in the model with their counterparts in Collibra and determine how they are represented in Collibra when exchanging data (discussed in [step 3](#step-3-craft-your-parent-atomic-models) and [step 4](#step-4-update-collibra-with-changes-made-in-solidatus)).

{% hint style="warning" %}
It is important not to modify the `COLL:` properties added by the connector as these are used to match entities across platforms.
{% endhint %}

Since lineage Relations imported from Collibra are represented as Transitions in the model, the connector adds unique properties to Transitions that record the Relation information:

If you add new entities and Transitions (discussed in [step 4](#step-4-update-collibra-with-changes-made-in-solidatus)) and wish to export these into Collibra, you need to add `COLL:` properties that supply information needed to represent them in Collibra.

### Import reference assets into Solidatus

In Collibra, Reference content is typically contained in several distinct domain types. For example, each of the following domain types in Collibra contain the type of semantic and reference assets that Solidatus would typically represent as terms in a Reference model:

* Glossaries
* Logical Data Dictionaries
* Rulebooks
* Governance Asset Domains
* Risk and Control Registers
* Organisational Domains

In short, every domain type other than a Physical Data Dictionary contains reference content, which you may wish ultimately to map to physical assets and lineage in Solidatus using Solidatus Reference relationships.

{% hint style="success" %}
This document does not cover how to import Collibra Relations between reference and physical data assets so they are captured as Reference relationships. This is possible, but requires custom configurations not covered in this document. For assistance, contact our Expert Services team at [expert.services@solidatus.com](mailto:expert.services%40solidatus.com).
{% endhint %}

The steps for ingesting Reference assets are parallel to the steps for physical assets. The main difference is that ingesting Reference assets should be done by importing each Reference domain into a its own connector fork.

You first need to configure the import job to target your Collibra domain:

1. Click the active Collibra import connector agent in your list of Connector agents.
2. Next, click `CREATE JOB` in the top right of the Connector agent page.
3. Click `EDIT` and enter configuration details for the job either manually or through the wizard (the same details must be supplied in either case).

The following annotated example shows you how to configure your job.

{% hint style="success" %}
This configuration example is not intended to provide full documentation of all configuration options available. Instead, it shows the essential options needed to import a community successfully.
{% endhint %}

When you’re finished entering your job configuration details, click `SAVE CHANGES` in the bottom-right corner.

Your job is now ready to be executed by clicking `RUN JOB` in the top-right corner.

If the job executes successfully, as indicated by the green `Success` tag in the Connectors interface, open your Reference model Fork to view the raw model output from the connector.

**Imported properties**

The properties added by the connector are all prefixed by `COLL:`, while Collibra Attributes are added as properties without the `COLL:` prefix.

It is important not to modify the `COLL:` properties because they allow the connector to match entities in the model with their counterparts in Collibra when further exchanging data (discussed in [step 3](#step-3-craft-your-parent-atomic-models) and [step 4](#step-4-update-collibra-with-changes-made-in-solidatus)).

## Step 3: Craft your parent atomic models

Upon completing step 2, you have a raw Lineage model of your Collibra physical domain and a raw Reference model of a reference domain. You can complete steps 1 and 2 for as many domains or subsets of domains as you wish to import into Solidatus.

Step 3 involves pulling the raw content created by the connector into your parent models, crafting their layout and structure, and augmenting them with additional content like properties, Reference relationships, Filters and Display Rules, and Views. Later, in Step 4, we will discuss pushing new content you’ve added in Solidatus back into Collibra.

The same process is required to pull the raw content in both model forks into their respective parent models:

1. Create Pull Requests from your model Forks into your parent models
2. Review and merge the Pull Requests

For instructions on how to create and merge Pull Requests to update parent model with changes to forks, see [Pull Requests](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/collaboration/activities/pull-requests.html).

{% hint style="success" %}
You can set up automation for creating and merging Pull Requests (see [Set up automation for Pull Requests](#set-up-automation-for-pull-requests)).
{% endhint %}

### Craft your physical Lineage model

The raw, connector-generated model of your Physical Data Dictionary represents Schemas and their sub-assets in a single Layer. Although the Collibra connector stitches together lineage captured in Collibra by lineage Relations, viewing lineage in a single Layer makes it difficult to follow upstream and downstream flows.

We recommend altering the model layout so lineage flows in a single direction (where possible) and each Schema is represented by its own Layer. Lineage can then be traversed upstream and downstream from left to right and right to left, rather than from top to bottom.

**Rearrange Schemas to capture directional flow**

First, start by rearranging Schemas (represented by Objects in the model) so the Lineage flows in a single direction. Of course, for complex lineage, it may not be possible to arrange lineage so it flows in only one direction, but it is likely still possible to clean up the raw sequence of Layers generated by the connector at this stage.

These tips will help you organise lineage into a linear sequence:

* Open the `TOOLS` sidebar menu
* In the `Lineage` panel at the bottom, Click `ALL` to set a custom Highlighted Trace Depth
* Set the Highlighted Trace Depth to 1 (This will show only 1 “hop” connections to a selected entity)
* Now select a Schema Object and click `Show Trace` in the toolbar to view the Schemas that immediately precede or follow the selected Schema in the lineage sequence
* Find the Schema that has only outgoing and no incoming Transitions and move it to the top by clicking and dragging it to its new location. Then find the next Schema connected by one “hop” and move it directly underneath. Keep going until each Schema follows and precedes a Schema it is directly connected to (where possible).

**Turn Schemas into Layers ordered from left to right**

Now that Schemas are in the right order,the next step is to convert them from Objects into Layers so lineage is captured from left to right.

There is a simple way to turn your Schema Objects into Layers:

1. Click the top Object in the Layer, then while holding the `SHIFT` key on your keyboard, click the bottom Object. This selects all Objects in the Layer, which should be blue to indicate that they’ve been selected.
2. Right-click on any of the selected Objects and find `Cut` in the context menu.
3. Hover your mouse over any empty portion of the model to the right of the single Layer, then right-click and select `Paste`.

You should now see that each Schema Object has been turned into a Layer, and the original Layer is empty. Transitions are preserved, and they now appear horizontally from left to right between Layers.

This copy and paste method preserves the ordering – now from left to right rather than top to bottom – of Schemas from the original, raw, connector-generated content. You can feel free to copy and paste the Layers further to rearrange them, as Transitions are preserved when you move entities in a Solidatus model.

{% hint style="warning" %}
Even though the original Layer is empty, do not delete it, as it can continue to function as a landing area for new assets created in the Collibra Physical Data Dictionary that are not heirarchically linked to already ingested assets.
{% endhint %}

It can be helpful to simply collapse the left-most, empty Layer by clicking the `|><|` carrots on the left-hand side so it doesn’t distract from the model.

**Add additional content to the model**

At this point, you can further craft the model by adding

* Additional Transitions
* Additional model entities
* Additional properties
* Reference relationships
* Display Rules and Filters
* Views

See the section on [Model Building](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/design/index.html) for specific instructions on how to add these elements to your model.

{% hint style="success" %}
New entities, lineage Transitions, and properties added to the model can be exported back into Collibra by an export job (see [Step 4: Update Collibra with changes made in Solidatus](#step-4-update-collibra-with-changes-made-in-solidatus)).

Reference relationships recorded in the Lineage model are not currently exported by the connector, but there are many ways to transfer these to Collibra. Speak to one of our Expert Services team for a custom solution to your specific requirements ([expert.services@solidatus.com](mailto:expert.services%40solidatus.com))
{% endhint %}

### Craft your Reference model

The raw, connector-generated model of a Collibra reference domain presents all assets in a single Layer.

Often, reference assets do not have hierarchical structure, so each asset is represented as an Object and the model is structured as a single layer with a set of child Objects.

This raw structure may suffice as a good representation of the Collibra domain, and so you may not need to craft it further.

However, you may wish to create a single Reference model that contains all reference assets from multiple Collibra domains.

You can import each atomic parent Reference model into a new composite Reference model.

To do this:

1. Create a new Reference model.
2. Click `Import` in the toolbar and select `Model`.
3. Find an atomic Reference model and import the whole model.
4. Repeat steps 1-3 for each atomic Reference model representing a Collibra domain.

Once you’ve imported all of your Reference content, you can rearrange the Layers using cut and paste or move functions available in the context menu that appears when you right-click an entity in the model.

### Add Reference relationships to your Lineage model

At this stage, you have an atomic Lineage model that captures your physical data lineage landscape, but it doesn’t contain information about the Reference relationships of data assets.

You also have atomic Reference models that contain the reference assets you have stored in Collibra.

You might wish to add Reference relationships in your Lineage model to terms in your Reference models.

{% hint style="success" %}
If you already have the relationships you wish to add captured in Collibra as Relations between reference and physical assets, there are ways to import them without having to add them manually in Solidatus. However, this typically requires configuring the Collibra connector according to how Relations are captured in your Collibra environment. For assistance, contact our Expert Services team at [\`\`](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#id5)[expert.services@solidatus.com](mailto:expert.services%40solidatus.com) <[mailto:expert.services@solidatus.com](mailto:expert.services%40solidatus.com)>\`\_.
{% endhint %}

## Step 4: Update Collibra with changes made in Solidatus

Now that you have your Collibra estate mapped in Solidatus, you can modify your atomic models and export them to update Collibra with your changes.

{% hint style="success" %}
Importing from Collibra is performed into a connector fork, but exporting is performed from the atomic model because that is the model in which changes should be made.
{% endhint %}

You can export the following model items back into Collibra using the Collibra export connector:

| **Solidatus Entity Type**                              | **Corresponding Collibra Type**                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| Layers, Objects, Groups, Attributes added to the model | New entities can be exported to Collibra as new Assets or Sub-assets. |
| Lineage Transitions added to Lineage model             | New Transitions can be exported as lineage Relations to Collibra.     |
| Properties                                             | New properties can be exported as Attributes to Collibra.             |

{% hint style="success" %}
The Collibra export connector does not currently export Reference relationships added in Solidatus, and it also does not delete entities from Collibra that are removed from the Solidatus model.
{% endhint %}

When you add an entity to a Solidatus model to export back into Collibra, you must also add `COLL:` properties and values to the entity. These give Collibra the information necessary to represent the added information correctly.

The properties you must supply depend on what you have added to the model and how you want information to appear in Collibra (see descriptions in the tables below for more info).

### Required properties for new entities

This section shows which `COLL:` properties you must add to new entities to successfully export them back into Collibra.

{% hint style="warning" %}
While there are some `COLL:` properties you must set on added entities and Transitions to export them into Collibra (listed below), **do not** provide `COLL:CollibraURL` or `COLL:ID` on an added entity. The value of these properties must be set by Collibra, so the export will fail if they are added to entities not yet represented in Collibra.
{% endhint %}

The required properties differ according to the entity type you add to the model, as listed in this section.

**New Layer, Object, Group, or Attribute**

You can add new entities to existing hierarchies, or you can create and add new Layers with new sub-entities. You must provide properties that give Collibra the information it needs to represent the new entity correctly.

For example:

* Are you adding an Asset or Domain?
* If you are adding a domain, what Domain type is it? Which community is it in?
* If you are adding an Asset, what Asset type is it? Which domain and community does it belong to?

The properties you supply specify the answers to these questions.

<table data-header-hidden><thead><tr><th width="226.38616943359375"></th><th></th></tr></thead><tbody><tr><td><strong>Property</strong></td><td><strong>Description</strong></td></tr><tr><td><code>COLL:BaseType</code></td><td>Either <code>Asset</code>, <code>Domain</code>, or <code>Community</code> depending on what you are exporting to Collibra.</td></tr><tr><td><code>COLL:OriginalCommunity</code></td><td>If you are adding a domain or asset, this is the Collibra community it is added to.</td></tr><tr><td><code>COLL:OriginalDomain</code></td><td>If you are adding an asset, this is the Collibra domain your asset is added to.</td></tr><tr><td><code>COLL:Type</code></td><td>The Collibra asset or domain type to set for the exported entity.</td></tr><tr><td><code>COLL:TypeID</code></td><td>The unique resource identifier used in Collibra to identify assets or domains of this type. Obtain this from Collibra (see <a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#type-ids-collibra">How to find Type IDs in Collibra</a>). If you are adding something whose type does not yet exist in Collibra, you will need to create it in Collibra and copy the resource ID into this property.</td></tr></tbody></table>

**New Lineage Transition**

To export lineage back to Collibra, add the properties listed below to new Transitions created in the Lineage model representing your Physical Data Dictionary. Exported lineage Transitions appear in Collibra as Relations between a `source` and `target` asset.

<table data-header-hidden><thead><tr><th width="218.554931640625"></th><th></th></tr></thead><tbody><tr><td><strong>Property</strong></td><td><strong>Description</strong></td></tr><tr><td><code>COLL:Role</code></td><td>This should be set to <code>targets</code>.</td></tr><tr><td><code>COLL:Corole</code></td><td>This should be set to <code>sources</code>.</td></tr><tr><td><code>COLL:RelationTypeID</code></td><td>This should be set to the resource ID of the lineage Relation in your Collibra environment.</td></tr></tbody></table>

Note that the `COLL:Role` and `COLL:Corole` properties specify the direction of the Transition. The property values shown in the table assume the `Head` of the Relation is the `source` entity and the `Tail` is the `target` entity. The `Head` *targets* the `Tail` and the `Tail` *sources* the `Head`.

However, Collibra is flexible, which means it is possible to define a lineage Relation the other way around, with the `Tail` as the source entity and the `Head` as the target. If that is how the lineage Releation is defined in your Collibra environment, set the `COLL:Role` property to `sources` and `COLL:Corole` to `targets`. In that case, the Transition should originate in the `Tail` entity and flow to the `Head` entity.

{% hint style="success" %}
Your *relations.jsonc* file will likely have to be modified to include Transitions or hierarchy relationships between new Asset types added to your model.
{% endhint %}

#### How to find Type IDs in Collibra

You must supply a `COLL:TypeID` or `COLL:RelationTypeID` property to all added entities and Transitions. These are IDs Collibra uses to identify resources of a given type.

If an already imported entity is the same type as what you are adding, just copy an appropriate `COLL:TypeID` or `COLL:RelationTypeID` value from an existing entity into the property of a new entity.

If you are creating an entity in the model that is not of the same type as an already ingested entity, you will have to create a new resource in Collibra and then copy the ID generated by Collibra for that resource.

To find Resource IDs in Collibra:

* Go to the Settings for your Collibra environment by selecting the `nine-dots` at the top left of the screen and scrolling to the bottom of the dropdown menu to find `Settings`.
* Find the `Operating model` section
* Click the type of item you are adding (i.e., Asset type, Domain type, Relation type, etc.)
* Look up the item you are adding to see if it has an existing `Resource ID`.
* Copy and paste the ID into the `COLL:TypeID` or `COLL:RelationTypeID` property.
* If a resource does not exist in your Collibra Operating model for the type of item you are adding to your Solidatus model, click `Add` in the top-right to create a new resource and copy the ID Collibra automatically generates for it.

### Export properties as Collibra Attributes

You can export new properties added to your Solidatus models into Collibra, or you can export updates to existing properties (just not the `COLL:` properties).

Exported properties appear in Collibra as Collibra *Attributes*.

{% hint style="success" %}
To export a Solidatus property to Collibra, an Attribute corresponding to that property must exist *in Collibra* and belong to matching Asset Types in the Operating model.
{% endhint %}

Updates to properties in your models that were originally ingested from Collibra will appear in Collibra after you run a connector export job.

However, if you add new properties to entities in Solidatus and want them to appear in Collibra on corresponding assets, you will have to create matching Attributes and assign them to matching Asset Types in Collibra before running the connector.

Explanation of the steps required to set up Attributes in Collibra in preparation for exporting properties is provided in the following two sections.

**Create a new Attribute in Collibra**

For a new property created in Solidatus to appear in Collibra, you must create a corresponding Attribute in Collibra and add it to Asset Types that match the Asset Types of entities with the property in Solidatus.

There are several steps needed to create an Attribute:

1. Log in to your Collibra environment
2. Open the environment Settings
3. Select *Attribute Types* in the Operating model settings
4. Select `Add` in the top right of the table of existing Attributes
5. Enter the details of the new Attribute. These must match the name and property type of the property added in Solidatus.

**Add Attributes to Asset Types**

Next, you must add the new Attributes as Global Assignment Characteristics to Asset Types that match the Asset Types of entities you added the properties to in Solidatus.

For example, if you added a property `Data Type` to entities in Solidatus that are the Asset Type `Column` (as indicated by their `COLL:Type` and `COLL:TypeID` properties), you must add the Attribute `Data Type` to the Asset Type `Column` in the Operating model of your Collibra environment.

To add an Attribute as a Global Assignment Characteristic to an Asset Type in Collibra:

1. Select `Asset types` in the Operating model settings
2. Find and select an Asset Type to add the Attribute to
3. Select `Global assignment` in the sidebar along the left
4. Select `Edit` in the top-right of the Global assignments list
5. Select the `Add characteristic` button that appears beneath `Cancel` and `Save`
6. Find and select the new Attribute you created

After following these steps for each new property added to Solidatus, you have Attributes in Collibra that correspond to the added properties, and they are assigned to Asset Types that match the Asset Types of entities properties were added to.

When you run your connector export job, the new properties and values entered in Solidatus will now appear in Collibra as Attributes on corresponding assets.

### Set up a job for the Collibra export Connector

When you’ve added new entities and their `COLL:` properties, and you are ready to export them into Collibra, find the Collibra export agent on your Connectors page.

There are a few things you need to configure a job for the Collibra export connector.

<table data-header-hidden><thead><tr><th width="269.534423828125"></th><th></th></tr></thead><tbody><tr><td><strong>What you need</strong></td><td><strong>Where to find it</strong></td></tr><tr><td>Model ID of the atomic Lineage or Reference model you are exporting</td><td>You can find these at the end of your browser URL when you have the model open in either the Model Viewer or Model Overview. For example, the URL <code>https://demo.solidatus.com/viewer/67a207c0e86accf0542224c4</code> shows the model ID <code>67a207c0e86accf0542224c4</code>.</td></tr><tr><td>Your Collibra environment URL and valid login credentials</td><td>You probably have these or can obtain them from your organisation’s systems administrator. <em>Note: The Collibra credentials you supply in the connector configuration must be for an account that has access to the communities or domains you wish to ingest into Solidatus</em>.</td></tr><tr><td>A valid API token for the Solidatus API</td><td>To obtain an API token, go to your Solidatus <code>Account</code> page, scroll down to <code>Manage Tokens</code>, fill in the form, and click <code>CREATE TOKEN</code>. Copy your API token and paste it where you can save it for future use, as you will not be able to see it again in the Solidatus interface.</td></tr><tr><td>A <code>relations.jsonc</code> file</td><td>The <code>relations.jsonc</code> file can be found in the <code>relations</code> directory in the <code>.zip</code> file obtained from Solidatus. This file specifies mapping of Collibra IDs to Solidatus entity types. An example and further information about the file is provided below.</td></tr></tbody></table>

**Configure and run the export Job**

1. Click `CREATE JOB` in the top right of the Connector agent page.
2. Click `EDIT` in the `Configuration` box to configure the job either manually or using the wizard (the same details must be supplied in either case).

The following annotated example shows you how to configure your job.

{% hint style="success" %}
This configuration example is not intended to provide full documentation of all configuration options available. Instead, it shows the essential options needed for a successful ingestion of the domain.
{% endhint %}

When you are finished entering your job configuration details, click `SAVE CHANGES` in the bottom-right corner.

Your job is now ready to be executed by clicking `RUN JOB` in the top-right corner.

**Additional Export Configuration Options**

<table data-header-hidden><thead><tr><th width="182.0438232421875"></th><th width="114.7110595703125"></th><th></th></tr></thead><tbody><tr><td>Solidatus entity IDs</td><td>Optional</td><td>You can export specific entities from the model specified in <code>Solidatus Model ID</code> by providing entity IDs. If you enter entity IDs, only these entities will be exported.</td></tr><tr><td>Solidatus group ID</td><td>Neither</td><td>You can export a group of models by first adding them to a <a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/collaboration/groups.html">Group</a> and then supplying the group ID here. Group IDs can also be found at the end of the URL in the address bar when you have the group open in your browser. <em>If you supply a group ID, do not also supply a Model ID; either one is required, but the job will fail if both are supplied.</em></td></tr><tr><td>Property keys</td><td>Optional</td><td>You can supply property keys to export only those entities (and their descendants) that have the specified properties.</td></tr></tbody></table>

In the instructions for ingesting from Collibra into Solidatus, we recommended editing the default `relations.jsonc` file. This file specifies the type of relation to add to Collibra based on Transitions and parent-child relationships between particular Asset types in the Solidatus model.

It is likely that you will have to create a custom `relations.jsonc` file specifically for exporting to ensure Relations are added in Collibra that capture Transitions and hierarchical relationships between Asset Types in the model.

Refer to the section [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file) for information on how the `relations.jsonc` file works and how to customise it to suit your needs.

### Troubleshoot Export Jobs

If a job completes sucessfully but a change is not made in Collibra, check the Activities log in Collibra by going to your profile and clicking the `Activities` section.

If changes you make in Solidatus do not appear in Collibra after the export job finishes, you may need to set up an Attribute, Asset Type, or Relation in Collibra to match what you added to your Solidatus model.

The steps for adding an Attribute are explained in the [Export properties as Collibra Attributes](#export-properties-as-collibra-attributes) section.

To add an Asset Type in Collibra:

* Open the environment Settings
* Find `Operating Model` and select `Asset Types`
* Click `Add` in the top right
* Name the new Asset type and specify its parent Asset type
* Open the new Asset type and add `Global Assignments` to assign applicable Attributes and Relations

To add a Relation in Collibra:

* Open the environment Settings
* Find `Operating Model` and select `Relations`
* Click `Add` in the top right
* Enter the new Relation details
* Note the new Resource ID of this relation
* Go into any applicable `Asset types` and add this Relation under `Global assignments`

Once you’ve added an Asset type or Relation to the Operating model, you will have to modify the `relations.jsonc` file to specify how Relations between new Asset types are imported and exported (see [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file)).

## Appendix: Set up integration from Solidatus as Source

The instructions in this documentation assumed that your data estate is originally captured in Collibra and imported into Solidatus. However, it is also possible for Solidatus to be the original source for assets and lineage used to populate Collibra.

For example, you might have ingested lineage into Solidatus from other systems using other Solidatus integrations, or you might already have mapped your entire estate in Solidatus.

This section explains how to set up the Solidatus-Collibra integration from the opposite direction, with Solidatus as the source of your data estate.

Note

This section explains the export steps for one Lineage model. If you have multiple models, and multiple communities into which your are exporting Solidatus content, repeat the steps for each model and community.

**Export lineage and physical assets from Solidatus to Collibra**

<table data-header-hidden><thead><tr><th width="83.43304443359375"></th><th></th></tr></thead><tbody><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-one-solidatus">Step 1</a></td><td>Create a community and a Physical Data Dictionary domain in Collibra into which to export your Solidatus Lineage model content.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-two-solidatus">Step 2</a></td><td>Create Asset types, Relations, and Attributes in your Collibra environment to match your Solidatus model content.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-three-solidatus">Step 3</a></td><td>Using the resource IDs of the Collibra resources you created in Step 2, populate the required <code>COLL:</code> properties in your Lineage model.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-four-solidatus">Step 4</a></td><td>Set up and run a Collibra connector export job to push Solidatus Lineage model content into Collibra.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-five-solidatus">Step 5</a></td><td>Synchronise your Collibra and Solidatus data by forking your Lineage model, importing from Collibra into the fork, and then merging the fork back into the atomic Lineage model via a Pull Request.</td></tr></tbody></table>

At the end of this process, you will have a Physical Data Dictionary in Collibra populated with assets and lineage from your Lineage models, and you will be able to exchange updates made in either platform via further import and export jobs.

**Export reference assets from Solidatus to Collibra**

<table data-header-hidden><thead><tr><th width="95.77947998046875"></th><th></th></tr></thead><tbody><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-one-ref-solidatus">Step 1</a></td><td>Create domains in Collibra that are the appropriate types for storing your reference assets.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-two-ref-solidatus">Step 2</a></td><td>Build a Reference model with Layers representing the domains you created in step 1.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-three-ref-solidatus">Step 3</a></td><td>Create Asset types and Attributes in your Collibra environment that correspond to the terms and properties in your model.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-four-ref-solidatus">Step 4</a></td><td>Use the resource IDs of Collibra Relations you created in Step 3 to add the required <code>COLL:</code> properties to terms in your Reference model.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-five-ref-solidatus">Step 5</a></td><td>Set up and run a Collibra export job to export reference assets into Collibra.</td></tr><tr><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-six-ref-solidatus">Step 6</a></td><td>Synchronise your Collibra and Solidatus reference data by importing from Collibra into a fork of your Reference model, then merging the fork back into the Reference model via a Pull Request.</td></tr></tbody></table>

At the end of these steps, you will have a Collibra community populated with both physical and reference assets from Solidatus, and you will be able to exchange updates made in either platform via further import and export jobs.

{% hint style="success" %}
To import into Collibra successfully, Collibra entities – Communities, Domains, Asset types, Relations, and Attributes – must be set up in the Operating Model in advance to receive and match incoming data.
{% endhint %}

#### Export Lineage and Physical Data Assets into Collibra

This section explains how to export the data assets and lineage captured in your Solidatus Lineage models into Collibra. It explains the steps for one Lineage model, but if you multiple models, simply repeat the steps for each model you want to export. You can export multiple Lineage models into a single Collibra domain.

{% hint style="success" %}
In most real-world scenarios, you will have millions of assets and multiple models to export to Collibra. You can choose whether to export these all to a single Collibra community or to multiple communities depending on how you want to organise your data estate in Collibra. Note that in each community, you will need to create a Physical Data Dictionary domain to receive and store the physical assets and lineage.
{% endhint %}

#### Step 1: Create communities and domains in Collibra

The first step is to create an empty community and an empty Physical Data Dictionary domain in Collibra into which you will export your Solidatus Lineage model content.

Create a **Physical Data Dictionary** domain in Collibra to export your Lineage model into. This domain is suited for the physical data assets and lineage captured in your Solidatus Lineage models.

Once you’re finished, navigate to your Physical Data Dictionary domain in your browser and copy and paste its ID into a text file so you can use it later to configure export jobs. You can find the domain’s ID in your browser’s when the domain homepage is open (see [Obtain Solidatus and Collibra IDs](#obtain-solidatus-and-collibra-ids)).

{% hint style="success" %}
You can also copy and paste the ID from a separate browser tab or window when configuring a Collibra export job.
{% endhint %}

#### Step 2: Create Asset types, Relations, and Attributes in Collibra

Next, you need to create Asset types, Attributes, and a lineage Relation in Collibra that match the information stored in your Solidatus models. For example, if an entity in your Lineage model is a `Column`, you need to create an Asset type in Collibra called `Column`.

You can create Asset types, Relations, and Attributes in Collibra by going to the environment Settings and selecting `Asset types`, `Relations`, or `Attributes` in the Operating model settings (see [How to find Type IDs in Collibra](#how-to-find-type-ids-in-collibra) for more detailed instructions).

You will likely need to create two types of Relations: a Lineage Relation to capture Transitions that represent lineage and hierarchy Relations to capture parent-child relationships between assets in your model (see [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file)).

When creating lineage Relations in Collibra, it is best to set the `Role` to `targets` and the `Corole` to `sources`. This way, the Relation will be created in the same direction as the Transition in your Solidatus model.

For example:

* **Head** : Data Element
* **Tail** : Data Element
* **Role** : targets
* **Corole** : sources

This Relation connects two data assets where the lineage flows from the `Head` of the Relation to the `Tail`.

Note the resource IDs of the Collibra resources you created, as you will need them to populate the required `COLL:` properties in step 3.

#### Step 3: Populate required properties in your Lineage model

`COLL:` properties are used to identify the Collibra resources that entities and Transitions in your Solidatus model are mapped to. These properties are required to export entities in your model successfully.

To populate the required `COLL:` properties in your Lineage model:

1. Open your Solidatus Lineage model in the Model Viewer.
2. Select an entity or Transition that you want to map to a Collibra resource you created in step 2.
3. Add the following `COLL:` properties to the entity or Transition, using the resource IDs you noted in Step 2:

{% hint style="success" %}
Many of these properties can be added in bulk because they will be the same for multiple entities in your model. To add properties in bulk, select multiple entities in the model, then go to the `Properties and Relationships` panel in the Inspector sidebar tab and enter property names and values.
{% endhint %}

**For Layers, Objects, Groups, and Attributes:**

> * `COLL:BaseType`: Set to `Asset` for all entities you are exporting.
> * `COLL:OriginalCommunity`: Set to the ID of the Collibra community the entity belongs to.
> * `COLL:OriginalDomain`: Set to the ID of the Collibra domain the entity belongs to (if applicable).
> * `COLL:Type`: Set to the name of the Collibra asset or domain type.
> * `COLL:TypeID`: Set to the resource ID of the Collibra asset type.

**For Lineage Transitions:**

> * `COLL:Role`: Set to `targets`.
> * `COLL:Corole`: Set to `sources`.
> * `COLL:RelationTypeID`: Set to the resource ID of the lineage Relation your created in step 2.

1. Add properties to all entities and Transitions in your model that you want captured in Collibra.
2. Save the model.

Once the required properties are populated, proceed to Step 4 to set up and run a Collibra export job.

#### Step 4: Set up and run a Collibra export job for your Lineage model[](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#step-4-set-up-and-run-a-collibra-export-job-for-your-lineage-model)

Now that you’ve populated the required `COLL:` properties in your Lineage model, you can set up and run an export job to push the model into Collibra.

To do this, follow the instructions in the section [Set up a job for the Collibra export Connector](#set-up-a-job-for-the-collibra-export-connector).

{% hint style="success" %}
You will need to configure a *relations.jsonc* file so Transitions and parent-child relationships between Asset types in the model are captured successfully as Collibra Relations (see [Edit the default relations.jsonc file](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/solidatus-collibra-integration.html#relations-json)).
{% endhint %}

#### Step 5: Synchronise your Collibra and Solidatus lineage data

In this step, you will import your Collibra community into a fork of your Lineage model and update your Lineage model via a Pull Request. This synchronises your Solidatus model and Collibra Physical Data Dictionary so further updates made in either platform can be exchanged.

1. Create a fork of your Lineage model and copy its model ID.
2. Set up automation on your fork and parent Lineage models (*optional*, see [Set up automation for Pull Requests](#set-up-automation-for-pull-requests)).
3. Create an import job to import your Collibra Physical Data Dictionary domain into the fork of your Lineage model. Follow the instructions in the section [Step 2: Set up and run an import job for the Collibra connector](#step-2-set-up-and-run-an-import-job-for-the-collibra-connector).
4. Save your fork model.
5. If you haven’t set up automation, create a Pull Request and merge the fork into the parent Lineage model.
6. Organise the contents of the Layer in the parent the model so lineage flows in one direction, where possible (see [Step 3: Craft your parent atomic models](#step-3-craft-your-parent-atomic-models)).
7. Select all descendants of the single Layer containing your domain, then cut and paste to the right of the Layer to move each Object into its own Layer.

{% hint style="success" %}
You can select all Objects in a Layer by clicking the top Object, holding the `Shift` key, and then clicking the bottom Object. Then right-click one of the selected Objects and select `Cut`.
{% endhint %}

8. Save your Lineage model.

At the end of this process, you will be able to make changes in either Solidatus or Collibra and exchange them using import and export jobs. Just remember: always import into the connector fork of the Lineage model, but make changes to and export from the parent atomic Lineage model.

***

#### Export Reference assets and relationships into Collibra

After completing the steps for exporting your physical data assets and lineage, you have a Physical Data Dictionary domain in Collibra populated with your Lineage model content.

The Physical Data Dictionary contains physical data elements and lineage Relations, but reference assets have not yet been exported to Collibra.

This section explains how to export your Reference content.

Here are the key requirements for a Reference model built for exporting to Collibra:

* Layers in a Reference model, or several Reference models, should correspond to the Collibra domain types that store specific types of reference assets.
* Reference terms must have *COLL:* properties that identify their corresponding Asset type in Collibra.
* A *relations.json* file must be configured to specify how hierarchy relationships between reference Asset Types – if there are any – translate into Collibra Relations.

{% hint style="success" %}
You can create one Reference model with all of your content, or you can create a model for each domain. We advise the second approach, as you can always edit and export from domain-specific models and create a composite model to view all of your reference content in one place.
{% endhint %}

Reference relationships created in Solidatus are not currently exported to Collibra as Relations by the connector. However, there are many ways to transfer Reference relationships to Collibra. Contact our Expert Services team for a Solution that fits your circumstances ([expert.services@solidatus.com](mailto:expert.services%40solidatus.com)).

#### Step 1: Create reference domains in Collibra

In Collibra, Reference content is typically contained in several distinct domain types. For example, each of the following domain types in Collibra contain the type of semantic and reference assets that Solidatus would typically represent as terms in a Reference model:

* Glossaries
* Logical Data Dictionaries
* Rulebooks
* Governance Asset Domains
* Risk and Control Registers
* Organisational Domains

In this step, you will create domains in Collibra to store the type of content you would like to export from Solidatus.

These domains can be created in the same community as your Physical Data Dictionary domain or in a different community – it is up to you how you organise your data landscape in Collibra.

You will need the ID of the Collibra community in which you created your reference domains when configuring the export job.

{% hint style="success" %}
You can find IDs of Collibra communities and domains by navigating to them in your browser and copying the ID from the URL (see [Obtain Solidatus and Collibra IDs](#obtain-solidatus-and-collibra-ids)).
{% endhint %}

#### Step 2: Build a Reference model or modify an existing one

The next step is to build one Reference model or several Reference models with the content you wish to export to Collibra.

How you build your Reference model depends on your starting point and the content you have in Solidatus:

* You might need to build a model from scratch and add content manually, import from spreadsheets, or use other integrations.
* You might have a Reference model already built in Solidatus that you can modify.
* You might be able to import content from several existing Reference models into a new one.

{% hint style="success" %}
If you have an existing model, it would be best to create a `Clone` and then modify the clone with the specific content required for exporting to Collibra.
{% endhint %}

Instructions for building a model and importing existing content are provided in the section of our documentation on [Model Building](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/design/index.html).

The main points to keep in mind are:

* Each Layer in your Reference model (or several models if you use one for each domain) should represent a corresponding Collibra domain you created in Step 1.
* Layers should contain terms appropriate for their domain type. For example, a Layer representing a Collibra Glossary domain should contain terms that are appropriate for a glossary, such as definitions and business terms.
* Each term in your Reference model should have a `COLL:` property that identifies its Collibra Asset type. For example, if a term in your Reference model is a `Business Name`, you need to set the `COLL:Type` and `COLL:TypeID` properties to the Collibra asset type and resource ID of the Business Name asset type.
* It is simplest if each Reference asset is represented as an Object in the Layer that represents its Collibra domain (i.e., each Reference asset is an Object and does not contain children). However, this is not a requirement, and you can have a more complex hierarchy if needed.

{% hint style="success" %}
You will create Asset types in Collibra that match the terms in your Reference model in step 3 and add their IDs as `COLL:TypeID` properties in step 4.
{% endhint %}

#### Step 3: Create Asset Types, Relations and Attributes in Collibra

Next, you need to create Asset types, Attributes, and Relations in Collibra that match the information stored in your models. For example, if a term in your Reference model is a `Business Name`, you need to create an Asset type in Collibra called `Business Name`.

You can create Asset types, Relations, and Attributes in Collibra by going to the environment Settings and selecting `Asset types`, `Relations`, or `Attributes` in the Operating model settings (see [How to find Type IDs in Collibra](#how-to-find-type-ids-in-collibra) for more detailed instructions).

If your Reference terms are hierarchically related, you will need to create corresponding hierarchy Relations in Collibra between Asset Types that match the Asset Types of hierarchically related terms in your model (see [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file)). You will also need to configure the `relations.jsonc` file to ensure hierarchies in the model are exported successfully as hierarchy Relations.

Here is an example of a hierarchy Relation in Collibra:

* **Head** : Table
* **Tail** : Column
* **Role** : contains
* **Corole** : is part of

#### Step 4: Add the required `COLL:` properties to your Reference model

To add the required `COLL:` properties, open your Reference model in the Model Viewer and select one or multiple terms.

{% hint style="success" %}
It is often the case that all reference assets in a given domain are the same type. If this is the case, you can right-click a Layer, find Select in the context menu, and choose `Select all descendants`. You can then add the required `COLL:` properties in bulk in the `Properties and Relationships` panel.
{% endhint %}

**For each term in the Reference model:**

> * `COLL:BaseType`: Set to `Domain` on the Layer and `Asset` for each term.
> * `COLL:OriginalCommunity`: Set to the ID of the Collibra community the term will be exported to.
> * `COLL:OriginalDomain`: Set to the ID of the Collibra domain the term will be exported to.
> * `COLL:Type`: Set to the name of the Collibra asset or domain type.
> * `COLL:TypeID`: Set to the resource ID of the Collibra asset or domain type.

When you’ve finished adding the required `COLL:` properties to your model, save your changes.

If your Reference terms are hierarchically related, the next step is to configure a `relations.jsonc` file to ensure parent-child hierarchy relationships between Asset types in the model are exported as Collibra Relations (see [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file)).

Here is an example of the JSON data needed in the `relations.jsonc` file to export a Relations Transitions when the `Head` is a parent reference asset and the `Tail` is a child reference asset:

```
{
"Parent Asset Type": {
  "Child Asset Type": {
    "type": "hierarchy",
    "id": "{Resource ID of the Relation}"
  }
}
}
```

#### Step 5: Set up and run a Collibra connector export job

When you’ve reached this step, your model is fully configured for exporting to Collibra. The only thing left is to set up and run a job for the Collibra export connector.

To do this, follow the instructions in the section [Set up a job for the Collibra export Connector](#set-up-a-job-for-the-collibra-export-connector).

Note

You will need to attach the `relations.jsonc` file you created to the job configuration (see [Edit the default relations.jsonc file](#edit-the-default-relations.jsonc-file)).

#### Step 6: Synchronise your Collibra and Solidatus reference data

You now have your Solidatus Reference models mirrored in Collibra. The final step is to synchronise them so changes made in either Collibra or Solidatus can be exchanged smoothly.

To do this, you’ll need to run an import job into a fork of the Reference model and merge the fork into the parent Reference model:

1. Create a fork of your Reference model and copy its model ID.
2. Set up automation on your fork and parent models (*optional*, see [Set up automation for Pull Requests](#set-up-automation-for-pull-requests)).
3. Create an import job to import your Collibra reference domain into the fork of your Reference model. Follow the instructions in the section [Step 2: Set up and run an import job for the Collibra connector](#step-2-set-up-and-run-an-import-job-for-the-collibra-connector).
4. Save your fork model.
5. If you haven’t set up automation, create a Pull Request and merge the fork into the parent Reference model.
6. Organise the layout of your parent Reference model (this may not be required if you’ve only imported a single domain).
7. Save your Reference model.

At the end of this process, you will be able to make changes in either Solidatus or Collibra and exchange them using import and export jobs. Just remember: always import into the connector fork of the Reference model, but make changes to and export from the parent atomic Reference model.

## Additional information

This section provides additional information that will help you set up a Collibra-Solidatus integration.

### Set up automation for Pull Requests

*This step is optional but recommended*

Once you have the division in place between the fork, which you will import into, and the parent model, which you will design and craft, you can automate the process of updating the parent model when a connector job imports raw content from Collibra.

{% hint style="success" %}
Introducing automation saves time and effort, but it also removes potential layers of review and approval.
{% endhint %}

There are two points at which you can introduce automation:

* Automatically create Pull Requests when a connector job updates the fork model
* Automatically merge Pull Requests into the parent model

**Automatically create Pull Requests**

Turning on `Automatically Create Pull Requests` on the fork model creates a Pull Request to merge changes into the parent model as soon as a connector job successfully completes and a new revision of the Fork model is created.

To set up `Automatically Create Pull Requests` on the fork model:

1. Navigate to the Model Overview of the fork model, open the `Settings` page, and click the `Advanced` section of the settings.
2. Click the check-box next to `Automatically Create Pull Requests`
3. Click `SAVE CHANGES` located in the bottom right of the settings page

**Auto-merge Pull Requests**

Turning on auto-merge for Pull Requests on the parent model merges a Pull Request as soon as it is submitted, without requiring the additional step of merging or reviewing manually.

To set up auto-merge on a parent model:

1. Navigate to the Model Overview of the parent model, open the `Settings` page, and click the `Activities` section of the settings.
2. Click `MANAGE` next to `Pull Request`
3. Click the check-box next to `Automatically merge`
4. Click `SAVE CHANGES` at the bottom right of the dialog

## Summary and Next Steps

This documentation has taken you through the steps needed to set up Collibra and Solidatus to work alongside each other. Once you have your atomic models and you’ve exported updates successfully from and to Collibra, you can keep the two platforms in sync by regularly running connector jobs, especially after updates on either side.

Next steps could involve mapping lineage across several models that contain content from Collibra. You can do this either using our Data Map and Data Domain features, or by importing atomic models into a composite model and adding Transitions between assets in separate communities.

Speak to our Expert Services team for help building out your data estate in Solidatus, or for any specific requirements not covered in this document. You can reach them at [expert.services@solidatus.com](mailto:expert.services%40solidatus.com).
