# Import from spreadsheets

When importing from Excel or CSV, Solidatus understands several column heading names. The description of these is below, along with some useful combinations of columns.

After selecting an import file or pasting content into the `Enter data` tab, the import dialogue provides a common [customisation page](/get-started/import-model-content/customise-imports) that allows you to customise the results of the import.

{% hint style="success" %}
When copying and pasting content from Excel into the <mark style="color:blue;">`Enter data`</mark> tab, click `Ctrl + A` or `⌘ + A` to select all content in the spreadsheet before you copy it.

If this only selects part of the spreadsheet content, it means you have empty columns or rows that may produce errors during import. You will need to delete or exclude these empty rows and columns if you use the <mark style="color:blue;">`Enter data`</mark> tab.
{% endhint %}

## Get started

The most basic “CSV” format for importing is simply a list of Attributes (without any column headings). For example:

```
Attribute Name 1
Attribute Name 2
Attribute Name 3
...
```

This can either be pasted into the import dialogue, or can be uploaded as a .csv or .xlsx file, and would result in the following additions to the model (assuming none of the names matched existing Attributes).

<figure><figcaption><p>Adding 3 Attributes at the end of the model</p></figcaption></figure>

{% hint style="success" %}
If you run into import errors when pasting content from CSV files or Excel into the import dialogue, try copying the content in an Excel file containing one of our [downloadable templates](#downloadable-import-templates) and import that file.
{% endhint %}

If you need to add properties to the new Attributes you must provide column headings.

In the example below, the Solidatus entity ID has been supplied for each Attribute (you can find this in the Attribute properties panel or in a Grid Report). Supplying an entity ID ensures we update the correct entities. We’ve also provided text for a *Comment* property for the first two Attributes. If the property does not exist, it will be created. Note that the third entry has fewer commas, which means we have not provided a *Comment* property for that entity.

```
id,Properties:,Comment
b0eb1e45-532e-4da4-9245-4c071b2282d8,,"This is a comment"
720ce4ea-976c-4781-935f-4b356792d232,,"This is also a comment"
70288ae6-8f1a-4b56-95a6-0f4c7bd01e46
...
```

***

For more complicated imports, a combination of columns can be used to achieve a variety of outcomes. For example, here is a simple model with two Layers, each of which contains a single Object, and none of the names are duplicated:

<figure><figcaption><p>A simple model before a complex import</p></figcaption></figure>

The following CSV content contains four rows, explained in the table below:

```
ID,type,name,parent,source,target
id1,Attribute,Attribute 1,Object 1,,
id2,Attribute,Attribute 2,Object 2,,
id3,Transition,,,id1,id2
```

<table data-header-hidden><thead><tr><th width="123"></th><th></th></tr></thead><tbody><tr><td>row 1</td><td>Column headings</td></tr><tr><td>row 2</td><td>Will add or update an Attribute called <em>Attribute 1</em> in <em>Object 1</em>, referring to it as <em>id1</em></td></tr><tr><td>row 3</td><td>Will add or update an Attribute called <em>Attribute 2</em> in <em>Object 2</em>, referring to it as <em>id2</em></td></tr><tr><td>row 4</td><td>Will add or update a Transition between the Entities referred to as <em>id1</em> and <em>id2</em></td></tr></tbody></table>

After importing this content, we can see two new Attributes and a new Transition.

<figure><figcaption><p>The same model after the import</p></figcaption></figure>

{% hint style="success" %}
**Import multiple sheets!** You can add multiple sheets to a workbook and Solidatus will import each sheet in the workbook **in order**. This is a very useful approach for large imports, building or updating the model in a logical sequence - perhaps with separate sheets for Layers, Object, Groups and Attributes, and Transitions.
{% endhint %}

## Potential errors

#### **Double quotes**

When pasting Excel content into the tabular import dialogue it can mess it up. The name of the first Entity will start with a double quote and the importer will parse all it encounters until another double quote directly followed by a delimiter/newline char. Excel is likely to place the double-quotes incorrectly, resulting in parsing errors.

To avoid this, import from a CSV or Excel file instead of pasting content into the import dialogue.

#### **Entity names are case-sensitive**

> In the example below, *contacts1.csv* and *Contacts1.csv* are not the same Object.

| **Layer**    | **Object**    | **Attribute** |
| ------------ | ------------- | ------------- |
| Source Files | contacts1.csv | ID            |
| Source Files | Contacts1.csv | FirstName     |

> If you refer to an Entity elsewhere in the Excel file, the case of the name must match. For example, when adding the following Transitions, the second Transition will result in a `Failed to find Transition endpoint` error message if there is not an Object called *ConTACTs1.csv*.

| **source\_Layer** | **source\_Object** | **source** |
| ----------------- | ------------------ | ---------- |
| Source Files      | contacts1.csv      | ID         |
| Source Files      | ConTACTs1.csv      | FirstName  |

## Downloadable import templates

Several Excel templates are available for download within the app.

1. Click Import (in the toolbar)
2. Click Tabular
3. Click the <mark style="color:blue;">`Help`</mark> tab
4. Download one of the templates

Documentation on how to use the templates are contained within them. For general descriptions and tips on use, see the table here.

<table data-header-hidden><thead><tr><th width="287"></th><th></th></tr></thead><tbody><tr><td><a href="#simple-import-format">import-simple.xlsx</a></td><td>This template has two sheets: Structure and Transitions. Structure defines layers, objects, attributes and their properties. Transitions defines transitions based on the source and target layers, objects and attributes.</td></tr><tr><td><a href="#full-import-format">import-full.xlsx</a></td><td>This template has one sheet that demonstrates a full import. The sheet defines layers, objects, attributes and their properties as well as their transitions. The sources and targets of the transitions are defined using IDs.</td></tr><tr><td><a href="#import-by-path">import-path-and-mapping.xlsx</a></td><td>This template has three sheets. The first sheet contains some documentation on how to use the template. The second and third define the structure and mappings respectively. This template is useful for defining Attributes and nested Attributes (Groups) and their transitions, but it cannot be used to import Objects. Attributes are defined using their path. If you do not need groups, the simple template is easier to populate.</td></tr><tr><td><a href="#import-reference-relationships">import-relationships.xlsx</a></td><td>This template has one sheet which contains an example on how to import entities with reference model relationships through the tabular importer. You will not be able to import this example as is because it contains references to models that don’t exist.</td></tr></tbody></table>

## Simple import format

This is a compact format and is useful for quickly importing Layers, Objects, Attributes, Transitions and properties by name. The downloadable example contains two tabs:

#### **Importing entities and properties**

<table data-header-hidden><thead><tr><th width="235"></th><th width="256"></th><th></th></tr></thead><tbody><tr><td><strong>Column name</strong></td><td><strong>Description</strong></td><td><strong>Notes</strong></td></tr><tr><td><code>Layer</code></td><td>Name of the Layer</td><td>When importing without Layers, any new Objects will be laid out automatically from left to right.</td></tr><tr><td><code>Object</code></td><td>Name of the Object</td><td>If empty, the row will describe a Layer</td></tr><tr><td><code>Attribute</code></td><td>Name of the Attribute</td><td>If empty, the row will describe an Object</td></tr><tr><td><code>PROPERTIES:</code></td><td>Denotes that all columns to the right-hand-side of this column are for properties.</td><td>Optional. All values of this column must be empty.</td></tr><tr><td><code>&#x3C;ANYTHING_ELSE></code></td><td>If the column is to the right of a <code>PROPERTIES:</code> column, this will be a property name on the described Entity.</td><td>Optional.</td></tr></tbody></table>

#### **Importing transitions**

| **Column name**   | **Description**                                                                                          | **Notes**                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `SOURCE_Layer`    | Name of the source Layer                                                                                 | Optional. Can be a Layer name, ID or row number (in this spreadsheet).      |
| `SOURCE_Object`   | Name of the source Object                                                                                | Optional. Can be an Object name, ID or row number (in this spreadsheet).    |
| `SOURCE`          | Name of the source Attribute                                                                             | Optional. Can be an Attribute name, ID or row number (in this spreadsheet). |
| `TARGET_Layer`    | Name of the target Layer                                                                                 | Optional. Can be a Layer name, ID or row number (in this spreadsheet).      |
| `TARGET_Object`   | Name of the target Object                                                                                | Optional. Can be an Object name, ID or row number (in this spreadsheet).    |
| `TARGET`          | Name of the target Attribute                                                                             | Optional. Can be an Attribute name, ID or row number (in this spreadsheet). |
| `PROPERTIES:`     | Denotes that all columns to the right-hand-side of this column are for properties for the Transition.    | Optional. All values of this column must be empty.                          |
| `<ANYTHING_ELSE>` | If the column is to the right of a `PROPERTIES:` column, this will be a property name on the Transition. | Optional.                                                                   |

{% hint style="success" %}
The above simple import examples assume all Transitions are Attribute to Attribute. Whilst a simple import can be modified to add Transitions between other types of Entity it is usual practice to use one of the other more advanced import templates. [Click here](#importing-transitions) to find out more about importing Transitions.
{% endhint %}

## Full import format

This more detailed format will let you define all Entity types in one sheet and identify them uniquely.

<table data-header-hidden><thead><tr><th width="209"></th><th></th><th></th></tr></thead><tbody><tr><td><strong>Column name</strong></td><td><strong>Description</strong></td><td><strong>Notes</strong></td></tr><tr><td><code>ID</code></td><td>A unique ID for the row.</td><td>Optional. Can be a Solidatus ID (as exported from Solidatus) or a user defined ID (in which case it will be used in this import only)</td></tr><tr><td><code>TYPE</code></td><td>The type of the Entity described by this row.</td><td>Required. Valid values: Layer, Object, Group, Attribute, Transition</td></tr><tr><td><code>PARENT</code></td><td>The parent of the Entity.</td><td>Optional. Can be a name, Solidatus ID, user defined ID (in this spreadsheet) or row number (in this spreadsheet). This must be valid parent type for the Entity type.</td></tr><tr><td><code>NAME</code></td><td>The name of this Entity.</td><td>Required.</td></tr><tr><td><code>SOURCE</code></td><td>One or more Source Entities for Transitions.</td><td>Optional. Comma-separated list of Entity names, IDs or row numbers (in this spreadsheet). Transitions can also be created as a separate row and can be between any Entity type (not just Attributes)</td></tr><tr><td><code>TARGET</code></td><td>One or more Target Entities for Transitions.</td><td>Optional. Comma-separated list of Entity names, IDs or row numbers (in this spreadsheet). Transitions can also be created as a separate row and can be between any Entity type (not just Attributes)</td></tr><tr><td><code>PROPERTIES:</code></td><td>Denotes that all columns to the right-hand-side of this column are for properties.</td><td>Optional. All values of this column must be empty.</td></tr><tr><td><code>&#x3C;ANYTHING_ELSE></code></td><td>If the column is to the right of a <code>PROPERTIES:</code> column, this will be a property name on the described Entity.</td><td>Optional.</td></tr></tbody></table>

## Import by path

This mode is useful for importing Attributes at any level within a hierarchy.

You can change the delimiter within the path hierarchy in the advanced section.

<table data-header-hidden><thead><tr><th width="203"></th><th></th><th></th></tr></thead><tbody><tr><td><strong>Column name</strong></td><td><strong>Description</strong></td><td><strong>Notes</strong></td></tr><tr><td><code>TYPE</code></td><td>Attribute.</td><td>Required.</td></tr><tr><td><code>Layer</code></td><td>Name of the Layer.</td><td>Required. The Layer in which the Entity will reside.</td></tr><tr><td><code>PATH</code></td><td>Describes an Attribute path starting with the Object name.</td><td>Required. For example, ObjectName/Group1/Group2/AttributeName, if using / as the path delimiter</td></tr><tr><td><code>SOURCE</code></td><td>One or more Source Entities for Transitions.</td><td>Optional. Comma-separated list of Entity names, IDs or row numbers (in this spreadsheet).</td></tr><tr><td><code>TARGET</code></td><td>One or more Target Entities for Transitions.</td><td>Optional. Comma-separated list of Entity names, IDs or row numbers (in this spreadsheet).</td></tr><tr><td><code>PROPERTIES:</code></td><td>Denotes that all columns to the right-hand-side of this column are for properties.</td><td>Optional. All values of this column must be empty.</td></tr><tr><td><code>&#x3C;ANYTHING_ELSE></code></td><td>If the column is to the right of a <code>PROPERTIES:</code> column, this will be a property name on the described Entity.</td><td>Optional.</td></tr></tbody></table>

## Import properties

Property values can be added to any Entity, by providing two or more columns to the right of all other columns in the import data - you must supply column headings. The first extra column must be called *Properties:*, the names of the remaining columns will form the property names. To provide values for existing properties, you must ensure that the names in the import data exactly match those in the model. If you make a mistake, it is possible to combine two properties by [editing one property name to match the other.](/models/build-and-edit-models/add-and-edit-properties#merge-properties)

The following CSV content will add or replace properties called *Comment*, *Data Steward*, and *Status* for two Attributes:

```
type,name,parent,properties:,Comment,Data Steward,Approval Status
Attribute,Attribute 1,Object 1,,"This is a comment","TBA","Draft"
Attribute,Attribute 2,Object 2,,"This is also a comment","TBA","Draft"
```

## Import transitions

There are two approaches for importing Transitions:

<table data-header-hidden><thead><tr><th width="143"></th><th></th></tr></thead><tbody><tr><td><a href="#implicit-transitions">Implicitly</a></td><td>When importing a Layer, Object, Group or Attribute - add one or more entity names or IDs in the SOURCE or TARGET columns. Useful for simple scenarios.</td></tr><tr><td><a href="#explicit-transitions">Explicitly</a></td><td>Create a separate row for each Transition in your import - this allows you to be more specific about the source and target Entities, and to add properties to your Transitions.</td></tr></tbody></table>

### Implicit transitions

You can create Transitions implicitly merely by including the names or IDs of source or target Entities in your import. You can see how simple it is in the following example.

<figure><figcaption><p>Simply supply a source and/or a target</p></figcaption></figure>

This creates Transitions:

> * from `Object A (2)` to `Object B (5)` and `Attribute B (6)`
>   * by listing `5` and `6` as targets for `2`
> * from `Attribute A (3)` to `Attribute B(6)`
>   * by specifying `3` as the source for `6`, and `6` as the target for `3`
> * from `Attribute A (3)` to `Attribute BBB(7)`
>   * by specifying `3` as the source for `7`

<figure><figcaption><p>The results of the import</p></figcaption></figure>

Creating implicit Transitions from the SOURCE and TARGET columns can be prevented by toggling the *Generate implicit transitions* option on the first page of the import dialogue. You’ll need to expand the *Advanced* section to see this option.

<figure><figcaption><p>The results of the import</p></figcaption></figure>

{% hint style="warning" %}
If you decide to switch off this feature after you’ve provided the content to import, you can use the <mark style="color:red;">`Back`</mark> button to return to the first page, but you will have to resupply the content you want to import.
{% endhint %}

### Explicit transitions

To successfully import Transitions explicitly you must identify both the source and target Entities. There are several techniques for doing this, all of which can be used to identify source or target Attributes, though some cannot be used to identify Objects.

In the [customisation options](/get-started/import-model-content/customise-imports) you can choose how the import attempts to match the supplied information to source or target Entities, either provided by the import or already existing in the model, by choosing *Match by ID* or *Match by name*.

| **Identification Technique**             | **Valid for Object** | **Valid for Attribute** | **Notes**                                                                                        |
| ---------------------------------------- | -------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| Object ID                                | Yes                  | Yes                     | <p>Precise, unique</p><p><em>(Match by ID)</em></p>                                              |
| ID within import, such as the row number | Yes                  | Yes                     | Precise, unique – will match to an entry in the import                                           |
| Path                                     | Yes                  | Yes                     | <p>Precise, probably unique - disambiguates most name clashes</p><p><em>(Match by name)</em></p> |
| Layer, Object, & Attribute names         |                      | Yes                     | <p>Precise, probably unique - disambiguates most name clashes</p><p><em>(Match by name)</em></p> |
| Object & Attribute names                 |                      | Yes                     | <p>Precise, probably unique</p><p><em>(Match by name)</em></p>                                   |
| Attribute names                          |                      | Yes                     | <p>Potentially ambiguous</p><p><em>(Match by name)</em></p>                                      |

Importing Transitions can be a very straightforward process in a model with unique names, potentially creating multiple Transitions for a given source or target Entity for each row in the import feed. The following CSV content contains three rows, explained in the table below:

```
type,name,parent,source
Attribute,Attribute 1,Object 1,Attribute 2
Attribute,Attribute 2,Object 2,"Object 2,Object 3"
```

<table data-header-hidden><thead><tr><th width="91"></th><th></th></tr></thead><tbody><tr><td>row 1</td><td>Column headings</td></tr><tr><td>row 2</td><td>Will add a Transition from a source Entity called <em>Attribute 2</em> to a target Attribute called <em>Attribute 1</em> in <em>Object 1</em></td></tr><tr><td>row 3</td><td>Will add a Transition from two source Entities, called <em>Object 2</em> and <em>Object 3</em>, to a target Attribute called <em>Attribute 2</em> in <em>Object 2</em></td></tr></tbody></table>

### Updating a transition

To update an existing Transition using a Tabular import you must provide sufficient information to uniquely identify the Transition, and there are two alternative approaches:

* provide the Solidatus entity ID for the Transition (you can find this by selecting the Transition and opening the Selection panel of the Inspector tab, or you can find it in a grid report)
* identify both source and target Entities precisely

### Column headings for transitions

The following columns can be used to define one Transition per row. `SOURCE` and `TARGET` are used in the most basic format. The `_Object` and `_Layer` variants may be required to disambiguate name clashes.

<table data-header-hidden><thead><tr><th width="202"></th><th></th><th></th></tr></thead><tbody><tr><td><strong>Column Name</strong></td><td><strong>Description</strong></td><td><strong>Notes</strong></td></tr><tr><td><code>ID</code></td><td>A unique ID for the row.</td><td>Optional. Can be a Solidatus ID (as exported from Solidatus) or a user defined ID (in which case it will be used in this import only)</td></tr><tr><td><code>TYPE</code></td><td>Type must be Transition</td><td>Required.</td></tr><tr><td><code>SOURCE</code></td><td>Source Entity of the Transition</td><td>Required. Can be an Entity name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>TARGET</code></td><td>Target Entity of the Transition</td><td>Required. Can be an Entity name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>SOURCE_Object</code></td><td>The source Object of the Transition.</td><td>Optional. Can be an Object name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>TARGET_Object</code></td><td>The target Object of the Transition.</td><td>Optional. Can be an Object name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>SOURCE_Layer</code></td><td>The source Layer of the Transition.</td><td>Optional. Can be a Layer name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>TARGET_Layer</code></td><td>The target Layer of the Transition.</td><td>Optional. Can be a Layer name, ID or row number (in this spreadsheet).</td></tr><tr><td><code>PROPERTIES:</code></td><td>Denotes that all columns to the right-hand-side of this column are for properties for the Transition.</td><td>Optional. All values of this column must be empty.</td></tr><tr><td><code>&#x3C;ANYTHING_ELSE></code></td><td>If the column is to the right of a <code>PROPERTIES:</code> column, this will be a property name on the described Transition.</td><td>Optional.</td></tr></tbody></table>

### Layer sequencing when importing transitions

When importing without identifying Layers in which entities should be placed, Solidatus will automatically create new Layers and sequence them by analysing Transitions that are specified in the spreadsheet.

<figure><figcaption></figcaption></figure>

For example, let’s say you import the spreadsheet pictured here.

The spreadsheet only specifies Objects and Transitions. Solidatus will automatically create Layers in which to put these Objects, and it will sequence them by analysing the Transitions.

Importing this spreadsheet will result in three new “Unnamed” Layers.

<figure><figcaption><p>The result of the import</p></figcaption></figure>

## Import reference relationships

Reference assignments can be added to Entities loaded in using the tabular importer. This can be done by adding three extra columns to the csv in any of the above modes: `REFERENCE_MODEL_ID`, `LABEL`, and one of `TERM_ID` or `TERM_PATH`.

N.B. these extra three columns must be before the `PROPERTIES:` column if it exists.

| **Column Name**      | **Description**                                                                | **Notes**                                 |
| -------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| `REFERENCE_MODEL_ID` | The model ID of the reference from which a reference Entity is being assigned. | Required.                                 |
| `TERM_ID`            | The Entity ID of the reference Entity being assigned.                          | Either `TERM_ID` or `TERM_PATH` Required. |
| `TERM_PATH`          | The path within the reference model of the reference Entity being assigned.    | Either `TERM_ID` or `TERM_PATH` Required. |
| `LABEL`              | The label for the reference assignment.                                        | Required.                                 |
