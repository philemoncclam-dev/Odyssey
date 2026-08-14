# Export to CSV (Spreadsheet)

The CSV export allows you to export a custom selection of the Model’s Entities, and to choose which information you want to include for each Entity.

{% hint style="success" %}
CSV exports contain *at least* one row for each entity that is in scope. CSV exports can contain multiple rows for the same entity; if an entity is related to multiple reference terms, the export will contain a row for each relationship to a unique term.
{% endhint %}

To export to a CSV file, click the `Export` button in the Model Viewer Toolbar, then select *CSV* - then think about what it is that you’d like to export.

The export dialog provides a number of entity export options for CSV, XML, and YAML exports. Hover the mouse over each option to see the tooltips in the user interface.

By default, the export will include every entity in the Model, but this can be modified using the options available in the export dialog.

<figure><figcaption></figcaption></figure>

When you’ve made your selections, press `Next`. Now you can choose which columns to include in the CSV file. Whether you choose [default](#default-columns-for-csv-export) or [custom](#custom-csv-export), click the `Next` button to download your CSV file.

{% hint style="info" %}
Exported CSVs contain at least one row for each entity in scope; however, if an entity has multiple reference relationships, the export contains a unique row for each relationship.

As a result, there may be multiple rows for an entity that are identical apart from columns describing Reference relationships.
{% endhint %}

## Custom CSV export

Click on the `Custom` button to choose the columns you want to export. You can pick them from the `Add columns` dropdown, and/or type them directly into the text box to the right. The available columns are described at [What can I export?](#what-can-i-export).

Click the `Generate preview` button to preview the output; click the `Next` button to export the selected information to a CSV file.

<figure><figcaption><p>Previewing a custom CSV export</p></figcaption></figure>

## Default columns for CSV export

The default columns are: `ID`, `TYPE`, `PARENT`, `NAME`, `SOURCE`, `TARGET`, `REFERENCE_MODEL_ID`, `TERM_ID`, `TERM`, `LABEL`, and `PROPERTIES:`.

<figure><figcaption><p>Exported CSV file with default columns</p></figcaption></figure>

If you select the default columns, it is likely that there will be blank entries, as some columns are only relevant to certain entity types (e.g., `SOURCE` and `TARGET`), and some entities might not have reference relationships or certain properties.

{% hint style="success" %}
To get Unicode characters in a CSV export to show up properly in Excel on a Mac:

> * create a blank spreadsheet
> * select `File->Import`
> * select the CSV file
> * select `Unicode (UTF-8)` from the “File Origin” selector
> * click `Next`
> * select “Comma” from the list of delimiters
> * then finish.

On a Windows version of Excel, select <mark style="color:red;">`Data->From Text/CSV`</mark> instead of <mark style="color:red;">`File->Import`</mark>.
{% endhint %}

## What can I export?

The available export columns have been grouped into four categories. Some columns are only relevant to certain types of Entity - they will be empty if they are not relevant to the current Entity.

> * [Basic entity information](#basic-entity-information)
> * [Transitions and links](#transitions-and-links)
> * [Entity properties](#entity-properties)
> * [Reference relationships](#reference-model-relationships)

### Basic entity information

<table><thead><tr><th width="219">Export column</th><th>Content</th></tr></thead><tbody><tr><td><strong>ID</strong></td><td>The unique ID for the Entity</td></tr><tr><td><strong>NAME</strong></td><td><p>The name of the Entity</p><p><em>If the Entity is a Transition this will be empty,</em> <strong>unless</strong> <em>the Transition was given a name when it was either imported from a file or created via the API.</em></p></td></tr><tr><td><strong>PATH</strong></td><td><p>Lists all the parents of the Entity, followed by the Entity name. For example, <code>/Layer 1/Object 1/Start date</code></p><p><em>If the Entity is a Layer, contains the Layer name</em></p><p><em>If the Entity is a Transition, contains the path to the source entity, followed by some text and the path to the target entity. For example:</em></p><p><code>Layer 1/Object 1/outgoing::*[target = Layer 2/Object 2]</code></p></td></tr><tr><td><strong>TYPE</strong></td><td><p>The type of Entity</p><p><em>Layer, Object, Group, Attribute, or Transition</em></p></td></tr><tr><td><strong>PARENT</strong></td><td><p>The ID of the parent Entity</p><p><em>If the Entity is a Layer or Transition, this is empty</em></p></td></tr><tr><td><strong>PARENT_NAME</strong></td><td><p>The name of the parent Entity</p><p><em>If the Entity is a Layer or Transition, this is empty</em></p></td></tr><tr><td><strong>LAYER</strong></td><td><p>The ID of the Layer that owns the Entity</p><p><em>If the Entity is a Layer, contains the Layer ID</em></p><p><em>If the Entity is a Transition, this is empty</em></p></td></tr><tr><td><strong>LAYER_NAME</strong></td><td><p>The name of the Layer that owns the Entity</p><p><em>If the Entity is a Layer, contains the Layer ID</em></p><p><em>If the Entity is a Transition, this is empty</em></p></td></tr><tr><td><strong>OBJECT</strong></td><td><p>The ID of the Object that owns the Entity</p><p><em>If the Entity is an Object, contains the Object ID</em></p><p><em>If the Entity is a Transition, this is empty</em></p></td></tr><tr><td><strong>OBJECT_NAME</strong></td><td><p>The name of the Object that owns the Entity</p><p><em>If the Entity is an Object, contains the Object name</em></p><p><em>If the Entity is a Transition, this is empty</em></p></td></tr><tr><td><strong>ATTRIBUTE</strong></td><td><p>The attribute ID</p><p><em>If the Entity is not an Attribute, this is empty</em></p></td></tr><tr><td><strong>ATTRIBUTE_NAME</strong></td><td><p>The attribute name</p><p><em>If the Entity is not an Attribute, this is empty</em></p></td></tr></tbody></table>

### Transitions

<table><thead><tr><th width="224">Export column</th><th>Content</th></tr></thead><tbody><tr><td><strong>SOURCE</strong></td><td><p>If the Entity is a Transition - the ID of the source Entity.</p><p>For other Entity types, will include a list of the source Entity IDs for every incoming Transition.</p></td></tr><tr><td><strong>SOURCE_LAYER</strong></td><td><p>The ID of the Layer that owns the source Entity</p><p><strong>Only provided for Transitions</strong></p></td></tr><tr><td><strong>SOURCE_NAME</strong></td><td><p>If the Entity is a Transition - the name of the source Entity.</p><p><em>For other Entity types, will list the source Entity IDs for every incoming Transition.</em></p></td></tr><tr><td><strong>SOURCE_OBJECT</strong></td><td>If the Entity is a Transition - the name of the Object that owns the source Entity.*</td></tr><tr><td><strong>SOURCE_PATH</strong></td><td><p>If the Entity is a Transition - the path to the source Entity.</p><p>For example: <code>/Layer1/Object1/Attribute1</code></p></td></tr><tr><td><strong>TARGET</strong></td><td><p>If the Entity is a Transition - the ID of the target Entity.</p><p>For other Entity types, will include a list of the target Entity IDs for every incoming Transition.</p></td></tr><tr><td><strong>TARGET_LAYER</strong></td><td><p>The ID of the Layer that owns the target Entity</p><p><strong>Only provided for Transitions</strong></p></td></tr><tr><td><strong>TARGET_NAME</strong></td><td><p>If the Entity is a Transition - the name of the target Entity.</p><p><em>For other Entity types, will list the target Entity IDs for every incoming Transition.</em></p></td></tr><tr><td><strong>SOURCE_OBJECT</strong></td><td>If the Entity is a Transition - the name of the Object that owns the target Entity.*</td></tr><tr><td><strong>TARGET_PATH</strong></td><td><p>If the Entity is a Transition - the path to the target Entity.</p><p>For example: <code>/Layer1/Object2</code></p></td></tr></tbody></table>

### Entity properties

<table><thead><tr><th width="256">Export column</th><th>Content</th></tr></thead><tbody><tr><td><strong>PROPERTY:property_key</strong></td><td>A named property (enter the property name after PROPERTY:)</td></tr><tr><td><strong>PROPERTIES</strong></td><td>All properties for the Entity</td></tr></tbody></table>

### Reference relationships

<table><thead><tr><th width="311">Export column</th><th>Content</th></tr></thead><tbody><tr><td><strong>TERM_PROPERTY:property_key</strong></td><td>A named property (enter the property name after TERM_PROPERTY:)</td></tr><tr><td><strong>TERM_PROPERTIES</strong></td><td>All properties for the related Term</td></tr><tr><td><strong>REFERENCE_MODEL_ID</strong></td><td>The ID of the related Reference Model</td></tr><tr><td><strong>TERM_ID</strong></td><td>The ID of the related Reference Model Term</td></tr><tr><td><strong>TERM</strong></td><td>The name of the related Reference Model Term</td></tr><tr><td><strong>TERM_PATH</strong></td><td>The full path for the related Term within the Reference Model</td></tr><tr><td><strong>LABEL</strong></td><td>The Label on the Reference Relationship</td></tr></tbody></table>

{% hint style="success" %}
If an Entity is related to multiple Terms, the export will contain a row for each combination of Entity and Term.
{% endhint %}

### Alternative CSV export method: Grid reports

[Grid reports](/models/explore-and-analyse-models/grid-reports) allow you to use a query to define which entities to export; the export will only include entities that match the query.
