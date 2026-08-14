# Customise imports

The information on this page applies to the following import formats: Tabular (CSV or Excel), JSON, XML, Solidatus JSON, Solidatus Model.

## How to customise an import

Customising an import involves choosing where to place imported entities and whether to overwrite existing model content, particularly when imported entities match the names or IDs of existing entities.

To customise an import:

1. Once a file or data has been readied for import, open the model you want to import into and find the importer in the Model Viewer toolbar.

<figure><figcaption></figcaption></figure>

2. Click the **Import** button on the toolbar, then choose an import format from the options in the dialog.
3. Load your structured data to import via a file upload or via pasting into the import field
4. Click the **IMPORT** button
5. The next dialog allows you to customise how imported entities are handled

<figure><figcaption><p>Customising a Tabular import</p></figcaption></figure>

The above image is an example of the customise page during a simple Tabular import, with the default options selected. Note the absence of warning messages, so we can tell that the structure of the content follows the Solidatus standard. The same dialogue is presented for JSON and XML imports.

The dialog indicates how many matches have been found (Note that this only appears if you choose *Match by name* or *Match by ID*).

**Matches** are existing entities that have the same name or ID as entities in your import. When you select `Match by name` or `Match by ID` as the import location option, you overwrite existing entities that match entities in your import.

***

<figure><figcaption><p>Customising a Solidatus JSON import</p></figcaption></figure>

The above image is an example of the customise page during a Solidatus JSON import, with the default options selected.

> **Notes:**
>
> * Any error messages or warnings during the import process are shown at the top of the customisation dialog.
> * See the warning messages at the top of the screen - in this example the only warning is the absence of transitions in the JSON file, which would only be a problem if you were expecting there to be transitions.
> * The dialogue includes an additional option (`Set unmatched`) which is also available when importing a Solidatus model.

The **SET UNMATCHED** option determines where entities in your import that do **not** match any existing entities will be placed in the Model.

***

<figure><figcaption><p>Customising a Solidatus model import</p></figcaption></figure>

The above image is an example of the customise page during a Solidatus model import, with the default options selected.

> **Notes:**
>
> * The dialogue includes an additional option (`Set unmatched`) which is also available when importing a Solidatus model.
> * The *Remove transitions* and *Remove children* options do not apply to model imports.

***

The first page in the import customisation dialog only displays the top-level imported entities, namely, entities which do not have a parent in the imported content. For example, importing an 3 Layers, each containing 1 Object and 1 Attribute will result in 3 entities being displayed on the customise page: the Layers.

<figure><figcaption></figcaption></figure>

However, when you click `Preview`, you see a breakdown of each entity in the import by type.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
The dialog groups entities together based on their entity type. A file which imports 1000 attributes will result in a single line on the customise page, allowing control over all those entities of the same type.
{% endhint %}

## Importing options

At the top of the customise page are a set of options which change the behaviour for the whole importing process.

<figure><figcaption></figcaption></figure>

<table data-header-hidden><thead><tr><th width="223"></th><th></th></tr></thead><tbody><tr><td>Overwrite model</td><td><p>When selected, this option will delete any entity in your model that is not present in the import, including:</p><p><em>Children of entities which are imported, if those children are not in the import</em></p><p><em>Transitions which are not defined in the import</em></p><p><em>Parents of existing entities which are not specified in the import</em></p><p>(Specifying either ‘Remove transitions’ or ‘Remove children’ with this option is redundant, as they both already happen)</p></td></tr><tr><td>Remove transitions</td><td>Removes any transition to or from model entities that are matched to an imported entity where the transition does not exist in the import.</td></tr><tr><td>Remove children</td><td>Removes any child of a model entity that is matched to an imported entity where the child does not exist in the import.</td></tr><tr><td>Overwrite properties</td><td>Overwrites all properties of matched entities with the properties in the imported content.</td></tr><tr><td>Overwrite relationships</td><td>Overwrites all relationships to reference terms for matched entities with relationships in the import.</td></tr><tr><td>Arrange layers</td><td>Orders the imported layers based on transitions between their children. Uses the same layout approach that is used the Model Viewer when the root entity type is <em>Object</em>: Layers are arranged so that Transitions flow from left to right.</td></tr></tbody></table>

## Global Options

<table data-header-hidden><thead><tr><th width="187"></th><th></th></tr></thead><tbody><tr><td>Global location (Set all)</td><td><p>Set the default location for where entities in the imported content will be placed.</p><p>See Import location options below for description of the available options.</p></td></tr><tr><td>Entity matching (Set unmatched)</td><td><p>This determines where to put entities in the imported content that cannot be matched in the model. (Only appears if Global Location is set to Ignore, Match by name, or Match by ID)</p><p><em>Add to start</em></p><p><em>Add to end</em></p><p><em>Add to entity (Takes you to the Model Viewer to select the entity to add them to)</em></p></td></tr></tbody></table>

## Import location options

The lower half of the screen provides options for fine-tuning what happens with each of the imported entities. Not all options are available for all Importers.

<table data-header-hidden><thead><tr><th width="199"></th><th></th></tr></thead><tbody><tr><td>Ignore</td><td>This entity will not be added to the Model</td></tr><tr><td>Add to end</td><td>Add after all existing layers. If multiple objects are imported they will be laid out in multiple layers based on their imported transitions with the maximum number of left -> right transitions preserved.</td></tr><tr><td>Add to start</td><td>Same as Add to end but places the imported entities before the existing layers.</td></tr><tr><td>Add to entity</td><td>Adds the imported entity to a specified entity in the Model, ignoring the type of the imported entity (i.e. an imported Layer can be added to an Object, where it will be converted into a Group or Attribute).</td></tr><tr><td>Match by name</td><td>Matches the imported entity to an existing Model entity by name and type. Will not import this entity if there is no match.</td></tr><tr><td>Match by property</td><td>Matches the imported entity to an existing Model entity by property. Will not import this entity if there is no match.</td></tr><tr><td>Match by ID</td><td>Matches the imported entity to an existing Model entity by ID. Will not import this entity if there is no match.</td></tr></tbody></table>

Import location options can be selected for each entity type listed in the import, or for all entities which are unmatched (entities set to match by name, property or ID but have no match in the model).

<figure><figcaption></figcaption></figure>
