# Add and edit Data Assets

The core purpose of the Data Assets functionality is to enable Data Domains and Data Maps to consolidate lineage and metadata automatically across multiple models.

A **Data Asset** is an entity that has been assigned special identifying properties (specifically and **Asset ID** and **Fully Qualified Name \[FQN]**). These asset properties enable Solidatus to identify and group entities that represent the same data element across multiple models they appear in.

There are no restrictions on what entities can be made Data Assets, but typically Asset IDs are used identify specific data elements and structures external to Solidatus that exist in your organisation's data infrastructure, such as databases, tables, or files.

Most often Asset properties are assigned automatically by connectors when lineage is ingested from external tools. When used with connectors, Data Assets are designed to enable fully automated lineage capture across source technologies and across enterprise-wide data infrastructure.

For example:

* A **database schema, table, or column** in a relational database might be considered a Data Asset.
* A **CSV file** containing business data could be another Data Asset.
* An **API** endpoint providing data can also be categorized as a Data Asset.

{% hint style="success" %}
Data Asset properties enable Solidatus to generate a Data Map that automatically consolidates the lineage of the same data element across multiple models.
{% endhint %}

See [Data Assets 101](/models/understand-solidatus-models/data-assets-101) for further explanation of Data Assets and how Asset properties work.

## Create a Data Asset

A Data Asset is created by adding an **Asset ID** to an existing entity in a model.

{% hint style="success" %}
With the exception of the FQN, which cannot be added or edited directly, asset properties (Asset, ID, Technology, Type) are the same as other non-asset properties in Solidatus, and they can be added or updated in the same ways.
{% endhint %}

Asset properties can be assigned to an entity in a variety of ways:

* Manually using the *Properties and Relationships* panel in the Inspector tab in the Model Viewer.
* Via an import into the Model Viewer (For example, CSV, JSON, or XML. See [Import Model Content](/get-started/import-model-content))
* Via connectors, which can automatically add Asset properties based on source metadata (see [Connectors](/connectors/connectors-overview))
* Via an API Request using standard or composable `SetProperty` [model update commands](/api-documentation/api-actions/api-use-the-api)

This page explains how to add Asset properties using the `Properties and Relationships` panel and via an import into the Model Viewer.

### Technology logos

Here is the list of technologies with supported logos. If you set one of these technologies as the *Technology* asset property, logos are provided in Data Domains for easy identification.

<table data-header-hidden><thead><tr><th width="221.5029296875"></th><th></th></tr></thead><tbody><tr><td><strong>Supported technology</strong></td><td><strong>Notes on asset property value conventions</strong></td></tr><tr><td>Cassandra</td><td>Enter one word (case-insensitive), for example: <code>Cassandra</code></td></tr><tr><td>Db2</td><td>Enter one word (case-insensitive), for example: <code>db2</code></td></tr><tr><td>MySQL</td><td>Enter one word (case-insensitive), for example: <code>MySQL</code></td></tr><tr><td>Oracle</td><td>Enter one word (case-insensitive), for example: <code>Oracle</code></td></tr><tr><td>PostgreSQL</td><td>Enter one word (case-insensitive), for example: <code>PostgreSQL</code></td></tr><tr><td>Redshift</td><td>Enter one word (case-insensitive), for example: <code>Redshift</code></td></tr><tr><td>Snowflake</td><td>Enter one word (case-insensitive), for example: <code>Snowflake</code></td></tr><tr><td>Microsoft SQL Server</td><td>Enter three words separated by spaces (case-insensitive). Do not abbreviate Microsoft. For example: <code>Microsoft SQL Server</code></td></tr><tr><td>SAP ASE</td><td>Enter two words separated by a space (case-insensitive), for example: <code>SAP ASE</code></td></tr><tr><td>SAP IQ</td><td>Enter two words separated by a space (case-insensitive), for example: <code>SAP IQ</code></td></tr><tr><td>Azure SQL</td><td>Enter two words separated by a space (case-insensitive), for example: <code>Azure SQL</code></td></tr><tr><td>Big Query</td><td>Enter two words separated by a space (case-insensitive), for example: <code>Big Query</code></td></tr><tr><td>Hive</td><td>Enter one word (case-insensitive), for example: <code>Hive</code></td></tr><tr><td>Impala</td><td>Enter one word (case-insensitive), for example: <code>Impala</code></td></tr><tr><td>Teradata</td><td>Enter one word (case-insensitive), for example: <code>Teradata</code></td></tr><tr><td>Spark SQL</td><td>Enter two words separated by a space (case-insensitive), for example: <code>Spark SQL</code></td></tr></tbody></table>

### Type icons

Here is the list of data element types with supported symbols. If you set the *Type* asset property to one of the following types, symbols are displayed in Data Domains for easy type identification.

<table data-header-hidden><thead><tr><th width="88.5972900390625"></th><th width="180.31494140625"></th><th></th></tr></thead><tbody><tr><td><strong>Icon</strong></td><td><strong>Data element type</strong></td><td><strong>Notes on asset property value conventions</strong></td></tr><tr><td>schema-icon</td><td>Schema</td><td>Enter one word (case-insensitive), for example: <code>schema</code></td></tr><tr><td>table-icon</td><td>Table</td><td>Enter one word (case-insensitive), for example: <code>table</code></td></tr><tr><td>column-icon</td><td>Column or Table column</td><td>Enter two words (case-insensitive), for example: <code>table column</code></td></tr></tbody></table>

## The Properties and Relationships panel

Asset properties are stored in a separate section (titled **Asset properties**) in the *Properties and Relationships* panel in the Model Viewer sidebar. By default, the section is expanded, but if you are not using Data Assets, it can be collapsed to save space.

<figure><figcaption><p>Asset properties in the Properties and Relationships panel</p></figcaption></figure>

Asset properties can be added in the same way as any other properties – just type a property value into the empty fields. The main differences are that Asset properties themselves do not need to be added to an entity (only the values), they cannot be deleted or removed from the panel, and the *FQN* (Fully Qualified Name) cannot be assigned or edited manually.

Even though the Model Viewer shows *Asset ID*, *FQN*, *Technology*, and *Type* as the property keys for Asset properties, the keys are stored in the underlying model data as *SOL.AssetId*, *SOL.FQN*, *SOL.AssetTechnology*, and *SOL.AssetType*.

{% hint style="success" %}
To query asset properties in a filter or display rule, you must identify the property key using the `SOL.` format.

For example, to query the Technology asset property, use \[SOL.AssetTechnology] = 'Snowflake'
{% endhint %}

### Assign an Asset ID to a single entity

You can assign an Asset ID to an entity in the Properties and Relationships panel in two ways:

1. **Type the Asset ID** directly into the Asset ID field.
2. **Click the** `Generate` **Button** to automatically generate an Asset ID that matches the entity’s name.

Asset IDs can be edited or updated at any time, and FQNs are automatically updated when an Asset ID is changed. To change an Asset ID, just type a new value into the Asset ID field or click the `Generate` button again.

### Assign Asset IDs in bulk

It is likely that you will want to turn an entire hierarchy of entities into Data Assets at once.

To do this:

1. Select the top-level entity in the hierarchy you want to turn into Data Assets
2. Right-click the top-level entity you selected and find the `Select` option in the context menu
3. Choose `Select all descendants`
4. Select `Generate` in the Asset ID field in the `Properties and Relationships` panel.

<figure><figcaption><p>Turn an entire hierarchy of entities into Data Assets</p></figcaption></figure>

### Assign Asset IDs to all entities in a model

You might want to turn all entities in a model into Data Assets. To do this:

1. Open the `TOOLS` sidebar tab in the Model Viewer
2. Toggle the `Add to Selection` option to `On` in the Tools panel
3. Select all entity types, except Transitions, in the `Select` section of the Tools panel
4. Then click `Generate` in the Asset ID field in the `Properties and Relationships` panel.

<figure><figcaption><p>Turn all entities in a model into Data Assets</p></figcaption></figure>

## Import Asset properties

You can add or edit Asset properties via an import into the Model Viewer. Since Asset properties (except for the FQN) are stored like any other property, all import formats can be used (see [Import Model Content](/get-started/import-model-content)).

{% hint style="warning" %}
The Model Viewer shows *Asset ID*, *FQN*, *Technology*, and *Type* as the names of asset properties, but they are stored as *SOL.AssetId*, *SOL.FQN*, *SOL.AssetTechnology*, and *SOL.AssetType* in the underlying model data.

This means that you have to use the `SOL.` format to import asset property values
{% endhint %}

Let’s look at an example of how to import Asset properties using a CSV file.

1. First, create a *custom* CSV export containing whichever entities you want to modify (see :doc: *use/exporting/csv*)
2. Add the columns *PATH*,\` and if you are updating existing Asset properties, also add the *PROPERTY:property\_key* column to the export
3. To export only Asset properties, you can add several `PROPERTY:property_key` columns and replace the *property\_key* with the keys of the Asset properties you want to export in the `SOL.` format (e.g., `SOL.AssetId`, `SOL.AssetTechnology`, and `SOL.AssetType`).
4. Open the exported file, locate entities you want to update by their path, and update the Asset properties in the appropriate `PROPERTY:` columns.
5. Save the file and import it back into the Model Viewer using the Tabular importer (see [Import Model Content](/get-started/import-model-content)).

{% hint style="danger" %}
FQNs are automatically updated if you change an asset’s *Asset ID*, change the *Asset IDs* of other assets in its hierarchy, or move the asset to a new hierarchy.
{% endhint %}

## Resolve FQN mismatches

The core purpose of Data Assets is to identify the same data element across models so Data Domains and Data Maps can consolidate asset lineage and metadata across models.

When multiple models containing the same Data Asset are published to a Data Domain, the Data Map automatically consolidates the asset's lineage across published models. The domain also generates an asset page that shows properties, reference relationships, and asset hierarchies across published models.

{% hint style="warning" %}
Data Assets across models are considered the same when their FQNs are identical (case-sensitive).
{% endhint %}

If the Asset IDs of entities in separate models are the same and their Asset hierarchy is the same, they will have the same FQNs.

There are a few possible scenarios in which FQNs may not be the same, but you know entities represent the same asset and you have to resolve the FQN mismatch across models:

* If the Asset hierarchy of two entities is identical, ensure they have the same Asset IDs and all ancestors in the Asset hierarchy have the same Asset IDs
* If two entities have the same Asset IDs, but their Asset hierarchy is different, you may need to add Data Assets to the hierarchy of one or the other to match FQNs
* If the Asset hierarchies of two entities are different, you can add Asset IDs that contain parts of the Asset hierarchy of the other entity

Let’s look at an example of resolving an FQN mismatch: An entity with the FQN *Oracle/Customer/Customer\_ID* is in one model and an entity with the FQN *Oracle/Customer\_ID* is in another model, and you know they represent the same column in a relational database.

<figure><figcaption><p>Match assets across models</p></figcaption></figure>

The image above shows the same *Customer\_ID* column in two separate models. However, the Asset hierarchies in these two models do not match, and therefore the FQNs of the *Customer\_ID* column do not match.

There are several ways you can resolve this mismatch, so Solidatus recognises these entities as representations of the same *Customer\_ID* column:

* Add the Asset *Customer* to the second model as a parent of *Customer\_ID*. This will change its FQN to *Oracle/Customer/Customer\_ID*, allowing Solidatus to match them as the same Data Asset.
* Delete the Asset `Customer` from the first model. This will change its FQN to *Oracle/Customer\_ID*, allowing Solidatus to match them as the same Data Asset.
* Add the Asset ID `Customer/Customer_ID` to the entity in the second model. This will change its FQN to *Oracle/Customer/Customer\_ID*, allowing Solidatus to match them as the same Data Asset.
