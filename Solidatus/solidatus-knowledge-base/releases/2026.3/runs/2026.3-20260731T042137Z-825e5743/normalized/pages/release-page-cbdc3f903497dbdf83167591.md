# Auto-map transitions

Auto-mapping is an effective way to streamline the work of adding Transitions to represent lineage between entities, which can be time-consuming when done manually.

The Auto-mapper function detects and suggests potential Transitions, based on the comparison criteria and algorithm you select, which you can review before adding to a model in bulk.

There are two ways to use Auto-mapping in Solidatus:

> 1. Map entities in separate models
> 2. Map entities within a single model

Both methods are explained on this page, along with the special case of using the SOL.UID property (automatically created by many of our connectors to facilitate auto-mapping) as a comparison criterion and mapping algorithm.

{% hint style="success" %}
The process of auto-mapping within a single model is a step in the workflow of auto-mapping between models, as explained in the [Auto-mapping Models](#auto-mapping-models) section.
{% endhint %}

## Auto-mapper concepts and basics

A **mapping** is a suggestion, based on the comparison criteria and algorithm you select, that a `source` Attribute has a lineage connection to a `target` Attribute.

{% hint style="success" %}
The Auto-Mapper can only be used to add Transitions to and from Group Attributes and nested Attributes; it does not add Transitions to or from Objects and Layers.

If you would like to add Transitions involving Objects in bulk, use the [Tabular import](/get-started/import-model-content/import-from-spreadsheets) instead.
{% endhint %}

<figure><figcaption></figcaption></figure>

In the Auto-mapper dialog, you select one or more source parents (Layers, Objects, or Groups) and target parents (Layers, Objects, or Groups) and the Auto-Mapper suggests Transitions between their descendant Attributes (Attribute-to-Attribute).

You can generate mappings between Groups (with nested Attributes inside), but this must be selected as an [advanced configuration option](#advanced-auto-mapper-options).

Once you’ve generated suggested mappings, you can review them and add all accepted Transitions in one click.

## Auto-map across models

You can use the Auto-mapper to generate lineage connections between all Attributes in two separate models using the `Map Models` workflow. We refer to this as `stitching` two models together.

{% hint style="success" %}
Stitching models creates a new composite model into which the two models you are stitching together are imported, and then uses the Auto-mapper inside the new model to link them up.
{% endhint %}

<figure><figcaption></figcaption></figure>

At a high-level, stitching models works by creating a new composite model into which all entities from the two models you’ve chosen are imported. You then run the Auto-mapper inside the new model to suggest lineage Transitions from Attributes in the source model to Attributes in the target model.

To begin, open the `Map Models` workflow from the button at the top-right corner of the Model Browser.

<figure><figcaption></figcaption></figure>

This opens the `Map Models` dialog, in which you can set a comparison option, a `source` and `target` model, and the name of the new composite that will be created.

<figure><figcaption></figcaption></figure>

<table data-header-hidden><thead><tr><th width="182.92388916015625"></th><th></th></tr></thead><tbody><tr><td>SOL.UID mapping</td><td>Suggest Transitions based on matching values for the <code>SOL.UID property</code> (See <a href="#case-2-auto-map-by-sol.uid-property">Case 2: Auto-Map by SOL.UID Property</a>).</td></tr><tr><td>Custom mapping</td><td>By default, this sets entity <code>Name</code> as the comparison criterion, but this can be changed in the Auto-mapper dialog after you click START (See <a href="#step-2-configure-mapping-criteria">Step 2: Configure Mapping Criteria</a>).</td></tr></tbody></table>

{% hint style="success" %}
If you choose to map by SOL.UID, you can adjust the minimum number of matching parts in the Auto-mapper dialog that you are taken to after you click START (see [Case 2: Auto-Map by SOL.UID Property](#case-2-auto-map-by-sol.uid-property)).
{% endhint %}

Clicking <mark style="background-color:blue;">START</mark> creates and opens a new composite model into which your source and target models have been imported.

The new composite model opens to the Auto-mapper configuration dialog, which shows suggested mappings based on your comparison criterion.

{% hint style="success" %}
When the new composite model opens to the Auto-mapper dialog, you can still change any configuration you’d like (e.g., the comparison criteria or mapping algorithm), and then click *GENERATE MAPPINGS* to view new suggestions based on the new options you’ve chosen.
{% endhint %}

Since “stitching” models involves the creation of a new model and then running the Auto-mapper inside the new model, the configuration options and steps for using the Auto-mapper within a model also apply.

For more detail on these options and steps, follow the sections on Auto-mapping inside a model, especially [Step 2: Configure Mapping Criteria](#step-2-configure-mapping-criteria), [Step 3: Generate Suggested Mappings](#step-3-generate-suggested-mappings), and [Step 4: Review Suggested Mappings](#step-4-review-suggested-mappings).

## Auto-map within a model

Running the Auto-Mapper inside a single model is a five-stage workflow, in which new actions for configuring the mapper occur at each stage.

<figure><figcaption><p>The six-step Auto-Mapping process</p></figcaption></figure>

| [Step 1: Select Sources and Targets](#select-sources-and-targets-in-the-auto-mapper) | Select **source** and **target** entities before you open the Auto-Mapper or within the Auto-Mapper itself. |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [Step 2: Configure Mapping Criteria](#step-2-configure-mapping-criteria)             | Choose comparison criteria for suggesting Transitions, along with the acceptable confidence level.          |
| [Step 3: Generate Suggested Mappings](#step-3-generate-suggested-mappings)           | The Auto-Mapper examines the model and suggests Transitions according to the configuration choices.         |
| [Step 4: Review Suggested Mappings](#step-4-review-suggested-mappings)               | Accept or decline the suggested Transitions.                                                                |
| [Step 5: Add Accepted Mappings to Model](#step-5-add-accepted-mappings-to-model)     | Add Transitions that were not declined.                                                                     |

{% hint style="success" %}

* You can always move back and forward through the process, right up to clicking the `Done` button.
* You should always review added Transitions and be prepared to [undo the changes](/models/build-and-edit-models/add-and-edit-entities#undo-and-redo) if you’re at all uncertain about the results.
* If you’ve saved the model since you created Transitions with the Auto-Mapper and wish to undo the changes, consider [restoring the previous version](/models/build-and-edit-models/version-control#fully-restore-a-previous-version) of the model.
  {% endhint %}

## Step 1: Select sources and targets

You can select sources and targets in a variety of ways:

* In the Auto-mapper dialog,
* Preselect up to two entities before opening the Auto-mapper dialog
* In the `Mapping Models` dialog, you select sources and targets by choosing two models to connect up with lineage.

{% hint style="success" %}
The only difference between using the Auto-mapper to connect models and using it to connect entities in a model is the first step: selecting sources and targets.
{% endhint %}

### Select sources and targets in the Auto-mapper

The Auto-Mapper dialogue can be opened by clicking on `Auto map` on the toolbar.

<figure><figcaption><p>Open the Auto-Mapper tool from the toolbar</p></figcaption></figure>

{% hint style="success" %}
Any or all of the source and target entities can be [imported from another model](/get-started/import-model-content/import-and-link-to-solidatus-models), enabling the modeller to use Auto-Mapper to stitch together lineage across multiple models.
{% endhint %}

The first step is to select the source entity (or entities) and target entity (or entities) to examine for potential Transitions.

Select a single source or target at a time by:

* Selecting them from the drop-down list
* Clicking the blue target icon, which takes you to the Model Viewer where you can click a Layer, Object, or Group to select it as a source or target.

<figure><figcaption><p>Type to filter the selection</p></figcaption></figure>

{% hint style="success" %}

* You can swap the source and target Entities in the Auto-Mapper if they’re the wrong way around
* Any text that you type into `Source` or `Target` will filter the list, making it simpler to find what you’re looking for
  {% endhint %}

### Pre-select a source and target before opening the Auto-mapper

If you only have a single source and a single target, you can select the source and target in the model **before** you start the Auto-Mapper.

The Auto-Mapper will assume that the left-most entity is the source, and the other is the target; if the two entities are in the same Layer, the entity nearest the top of the Layer is assumed to be the source.

If you only select one entity before opening the Auto-Mapper, it will automatically be considered the source. Remember that you can always swap the source and target entities if you need to.

<figure><figcaption><p>Select source and target Entities - in this example they were preselected</p></figcaption></figure>

Click `Next` after selecting the source(s) and target(s).

{% hint style="success" %}
Unless your model is a simple one, there may be many potential Transitions, so it is helpful to restrict the scope of the Auto-Mapper to manageable subsets of the model.
{% endhint %}

### Auto-select sources and targets

If you select **Auto** to populate a source or targets, the Auto-Mapper will focus on Objects (and their descendants) that are **already connected by Transitions**. The Auto-Mapper will look for new Transitions between Objects that are already connected, or whose descendants are already connected, in the model.

Selecting **Auto** for the source and a specific entity for the target would extend the scope of the Auto-Mapper to every entity in the model that already has Transitions to entities in the Target.

<figure><figcaption><p>Auto source and a named target</p></figcaption></figure>

In this example, selecting the **Auto** source and a layer (Reports) as the target focuses attention on the *Top Level Items*, *Board Meeting* and *Reports 2023/24* Objects in the right-hand Layer. The Auto-Mapper will look for new Transitions between these Objects and every other Object in the model that is already connected to them. It will ignore any Objects in the target Layer that have no existing Transitions.

## Step 2: Configure mapping criteria

Configuring a mapping involves specifying three settings:

* Set comparison criteria (What will the mapping algorithm compare across entities to determine if a Transition should connect them?)
* Set Acceptable Confidence threshold
* Set Mapping Algorithm

There are also more options you can choose from in the `ADVANCED` section, which are explained below.

### Comparison criteria

To configure the mapping, select criteria according to which the Auto-Mapper will compare potential sources and targets for new Transitions. You can compare entities by matching *Name*, *Path*, or *Property/Property Value*.

{% hint style="success" %}
When running the Auto-Mapper, it helps to keep a few tips in mind:

* When matching by name, the Auto-Mapper ignores parent entities (i.e., the *PATH*) and finds the first target with a matching name (provided you haven’t selected the `one-to-many` advanced config option).
* To get the results you want, it helps to narrow the sources and targets to specific parts of the model (i.e., use lower level entity types as sources and targets, such as Objects or Groups instead of Layers).
* Mapping by *PATH* can miss potential targets when Attributes with the same *PATH* have the same names.
* Selecting the `one-to-many` advanced config option will suggest more mappings, and then you can reject or delete the ones that aren’t desired.
  {% endhint %}

The Attribute *Name* is a good starting point, and it’s the default option. Changing this to mapping based on a property is useful in situations where a property contains an identifier (such as a business name or a field ID), or some form of classification, and you would like to connect entities with the same property value. The `SOL.UID` property (or an equivalent property) is essential when using the *SOL.UID* algorithm - see [Case 1: Auto-map by Entity Path](#case-1-auto-map-by-entity-path).

### Confidence levels for Auto-mapping

When configuring the Auto-Mapper, the slider allows you to select the required accuracy level or confidence threshold for suggested Transitions. **100%** will require names (or properties) of the source and target Attributes to be **identical** for the Auto-Mapper to suggest a transition. To allow for variations in Attribute features, reducing the confidence threshold will – most likely – result in more suggestions.

For example, if the accuracy is set at 80%, only mappings above that confidence threshold will be suggested.

{% hint style="success" %}
The slider is disabled if you select the *SOL.UID* algorithm because this option requires a customisable number of matching parts for transitions to be suggested.
{% endhint %}

In the example below, the source and target entities are Layers, the accuracy level is the default (80%), and the Auto-Mapper will compare Attributes by both *name* and the *Object Type* property.

<figure><figcaption><p>The comparison will be performed on the Attribute name and the <em>Object Type</em> property.</p></figcaption></figure>

{% hint style="success" %}
If you make a mistake or change your mind about the source and target Entities, click on the `Back` button to change the selection or reverse the mapping direction.
{% endhint %}

### Advanced Auto-mapper options

Click on the *Advanced* bar (above the *Generate mappings* button) to open the advanced options. The advanced options allow you to extend the search for potential mappings and to change the logic used by the comparison.

<table data-header-hidden><thead><tr><th width="241.04867553710938"></th><th></th></tr></thead><tbody><tr><td>Search for Date and Time matches</td><td>Improve the confidence of matches where the property values are a date time format.</td></tr><tr><td>Select mapping algorithm<br><br><br><br><br><br><br><br><br><br><br><br><br></td><td>Choose from the available algorithms:<br><strong>Fast</strong> - case-insensitive (recommended when there is a largenumber of entities)<br><strong>Exhaustive 1</strong> - case-sensitive (gives better matches than the<em>Fast</em> option)<br><strong>Exhaustive 2</strong> - case-insensitive (better for matchinglong strings)<br><strong>SOL.UID mapping</strong> - matches SOL.UID properties createdby connectors. If you select this option, ensure that you chose the<em>SOL.UID</em> property as the Attribute feature to compare.</td></tr><tr><td>Ignore XML Attributes</td><td>Ignore all XML Attributes in xpaths when performing Auto-Mapping by xpath property.</td></tr><tr><td>Include Attribute Groups</td><td>Search for potential mappings for Groups as well as for Attributes</td></tr><tr><td>Allow one-to-many</td><td>Allow multiple potential mappings per source and target Attribute</td></tr></tbody></table>

{% hint style="success" %}
When mapping by name or path, the Auto-Mapper will suggest only one Transition per source and target Attribute. If you’d like to see more than one suggestion per source and target Attribute, select the *Allow one-to-many* option.

When mapping based only on properties, the Auto-Mapper will suggest all mappings between entities in the chosen range that share the same value, so the one-to-many option is always active.
{% endhint %}

When any `Advanced` option is changed, you can generate suggested mappings again. Note that this will replace the previously generated list of suggestions, and it may re-select changes that you previously declined.

## Step 3: Generate suggested mappings

Click the `Generate mappings` button to view suggested Transitions. When suggestions have been generated, the button changes to display the message *No new possible mappings*, but making changes to the Attribute features or advanced options will cause the *Generate mappings* button to be available again.

## Step 4: Review suggested mappings

After you click `Generate mappings` button, Solidatus will display a high-level summary of the Attribute mappings that have been detected. Each mapping displays a coloured badge showing the number of potential Transitions detected. You can expand each of these high-level mappings to see the individual Attribute-to Attribute mappings.

By default, all suggested mappings are accepted (as indicated by a check in the box to the right of the suggestion) and would be added to the model were you to click the `Done` button. But you can use the checkboxes next to either the Object-level or Attribute-level mappings to toggle whether or not to accept the suggestions. When you are ready and click `Done`, only accepted mappings will be added to the model as Transitions.

<figure><figcaption></figcaption></figure>

Most of the suggested mappings in this example are based on identical Object and Attribute names (such as the *Customer fax* Attributes, which show a 100% confidence level. Three of the suggestions also rely on the *Object Type* property – the names are not identical – with confidence levels of 92%, 93%, and 95%.

The confidence threshold functions such that if the accuracy level is raised to 95% and the suggestions are re-generated, those suggestions at or below 95% will no longer appear.

{% hint style="success" %}
If there are too many suggestions, consider going back through the Auto-Mapper to reduce the scope by choosing a more specific source and/or target.
{% endhint %}

Alternatively, you can experiment with different Attribute features, accuracy level, or other config options. After each change, press the `Generate mappings` button to see the results.

## Step 5: Add accepted mappings to model

Clicking `Done` will add the selected suggestions to the model as new Transitions. The confidence level associated with each suggestion is recorded as a property on the newly-created Transition.

## Case 1: Auto-map by entity path

The **path** of an entity is the entity’s ‘address’ within the model. It includes the names of all the entity’s parents in hierarchical order up to the name of the Layer it is contained in.

<figure><figcaption><p>The path of an Attribute</p></figcaption></figure>

It is possible to map by **path** instead of mapping by name. When mapping by path, mappings are determined using the full path **excluding the Layer name**. The path automapping algorithm excludes the Layer in a path so that it will suggest mappings across Layers.

Mapping by path is useful when there is more than one Attribute with the same name within the same Object, where mapping by just the name may introduce unwanted Transitions.

<figure><figcaption><p>Mapping by path</p></figcaption></figure>

In this example, the Auto-Mapper takes the group name (database 1) into consideration when mapping.

## Case 2: Auto-map by SOL.UID property

Tools that analyse or transform data often hold a detailed description of data assets, such as database schemas and XML messages, but how each tool represents the same asset varies considerably.

As a result, when [Solidatus connectors](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/connectors/index.html) extract metadata from different tools, we often see different representations of the same source data entity in Solidatus. For example, the same database schema could be ingested directly via the JDBC connector, and also via connectors for an ETL tool and a Data Quality tool. The model created by the ETL connector might also include definitions of multiple schemas, all containing the same *Customer* table, all having a *Customer\_Name* column.

In such cases, identifying mappings between different representations of the same database column can be challenging: how can Solidatus be sure which *Customer\_Name* columns are the same? The `SOL.UID` property solves this problem. This unique hierarchical key, created by connectors, identifies a data entity according to its hierarchical location within a source technology. It enables the Automapper to recognise identical data assets by comparing `SOL.UID` values.

{% hint style="success" %}
`SOL.UID` properties are automatically added by many of our connectors to make auto-mapping easier and more effective.
{% endhint %}

### Structure of the SOL.UID property

While the number of `parts` in a SOL.UID key varies depending on how a source technology represents data hierarchies, it has a general structure:

The structure of the SOL.UID property

{% code fullWidth="false" %}

```
Technology|level 1|level 2|level 3|level 4|level n
```

{% endcode %}

* **Separator:** ( **|** ) splits the property value into several `parts`.
* **First Part:** Specifies the technology type (e.g., RELATIONAL, JSON, FILE) from which the data entity was ingested
* **Remaining Parts:** describe the entity’s hierarchical location within that technology.

Here is an example SOL.UID for a column in a relational database:

<figure><figcaption></figcaption></figure>

### How to Auto-map by SOL.UID

The Automapper includes a specialised algorithm for mapping by `SOL.UID` property values. To auto-map based on `SOL.UID`, follow these steps:

<figure><figcaption><p>Steps for configuring Auto-mapper to map by SOL.UID</p></figcaption></figure>

{% hint style="success" %}
When mapping by SOL.UID, the *Match Accuracy level* slider cannot be adjusted.
{% endhint %}

The `SOL.UID` mapping algorithm applies the following rules to determine whether a mapping is suggested:

> 1. The correct separator ( **|** ) must be used in `SOL.UID` values
> 2. The first part of the value (Technology) must match
> 3. The mininum number of parts of SOL.UIDs must match, *starting from the end*
> 4. If matches are found with **exactly** the same SOL.UIDs, only those mappings **and no others** are suggested
> 5. If no exact matches are found, mappings are suggested based on the selected minimum number of matching parts. Always check the confidence level of suggestions before accepting them.

You can adjust the minimum number of parts that must match for a mapping to be suggested.

<figure><figcaption><p>Set the minimum number of final parts that must match for mappings to be suggested</p></figcaption></figure>

This number indicates how many parts, *starting from the end*, must match between SOL.UIDs of two Attributes for the auto-mapper to suggest adding a Transition to connect them. For example, `1` requires only the last part of SOL.UIDs to match, while `2` requires the last two parts to match.

{% hint style="success" %}
No matter what minimum number of final parts you set, the first part representing the source technology must always match.
{% endhint %}

SOL.UID auto-mapping is available for any source technology, but the mapping algorithm can detect if the source is a FILE, JSON source, or RELATIONAL database. Depending on what source is detected, there is a default minimum number of matching parts, which can be adjusted in the dialog.

| **Source Technology**          | **Default minimum matching parts** |
| ------------------------------ | ---------------------------------- |
| FILE                           | 1                                  |
| JSON                           | 2                                  |
| RELATIONAL                     | 2                                  |
| Custom (not any of the others) | 2                                  |

{% hint style="success" %}
The confidence level for each suggested mapping depends on how many parts of the SOL.UID match (including the type of Technology).
{% endhint %}

### Auto-map by SOL.UID example

{% hint style="success" %}
To make the following images easier to understand, a name replacement Display Rule has been used to replace Attribute names in the model with their SOL.UID property value.
{% endhint %}

A Solidatus model contains two Layers that we wish to map, each containing representations of a table called **Cust**:

<figure><figcaption><p>Identical SOL.UID properties in two different Layers</p></figcaption></figure>

The Auto-Mapper results show 100% confidence in the suggested mappings, because the SOL.UID values are identical.

<figure><figcaption><p>Exact SOL.UID matches</p></figcaption></figure>

If the exact matches are out of scope (or removed from the target layer), the algorithm will suggest more possible mappings:

<figure><figcaption><p>Other possible SOL.UID matches</p></figcaption></figure>

As you can see in the example below, the confidence level for each suggested mapping reflects how many parts of the SOL.UID match (including the type of Technology).

<figure><figcaption><p>80% confident when four parts match, and 60% when only three parts match</p></figcaption></figure>

{% hint style="success" %}
The SOL.UID algorithm can be used with any property that has values conforming to the SOL.UID pattern: the first part of the value must match one of the listed technology types, and the set number of final parts must also match.
{% endhint %}
