# Copy a model

Solidatus provides several ways to create a new model based on an existing model:

* Create a full or partial **clone** (an exact copy) of a model.
* Create a full or partial **fork** of a model.
* [Export and reimport a model as a .SOL file](/models/build-and-edit-models/export-and-reimport-to-edit-model-content).
* Use standard **cut, copy, and paste** techniques to copy content from one model to another.
* Use the **Create model from selection** or **Extract source to new model** options to create a new model from selected content in an existing model.

{% hint style="info" %}
All of the above methods can be used to create a completely new model from an existing model (or from an existing fork or clone of a model).
{% endhint %}

This page covers how to clone a model, how to cut, copy, and paste from one model into another, and how to create new models from selected content.

* For information on forks, see [Version control: forks and pull requests](/models/build-and-edit-models/forks).
* For information on exporting and importing .SOL files, see [Export to a SOL file](/models/explore-and-analyse-models/export-model-content/export-to-sol-file).

## Clones vs. forks

A **clone** is an independent model that is an exact copy of an original model. **Clones** are different from **forks** in that a clone is not linked as a working branch to its original parent model. Edits can be exchanged between a fork and its parent model via pull requests, but they cannot be exchanged between a clone and the original model from which it was created.

{% hint style="success" %}
Entities in clones and forks have the same entity IDs as entities in their original models.

In addition, when importing directly from another model (not via a separate file, e.g. CSV or JSON) imported entities have the same entity ID in the model they are imported into as in their source model.
{% endhint %}

Cloning is useful when you want to create a new model that is very similar to an existing model, or when you want to create a new model based on an existing model but with a different name, description, or tags.

Full details on creating and using forks are provided on the [Version Control: Forks and Pull Requests](/models/build-and-edit-models/forks) page.

## Create a clone of a model

{% hint style="success" %}
You must have an Author licence and at least a Viewer role on a model to clone it.
{% endhint %}

**From the Model Viewer:**

1. Select **Save As** in the toolbar
2. Select **Clone** in the Save As dialog.
3. Change the suggested name for the new model, revise the tags, and provide an appropriate description. You can also share the new model with one or more groups.

Apart from the model name and any changes made to the model description and tags, the new model is an exact copy of the original model. The user that cloned the model is the Owner of the new model; the model will not inherit any of the activities or users from the original model.

## Create a partial clone of a model

If you want the clone to contain just part of the original model, here’s how to do it:

1. In your model, [select entities](/models/build-and-edit-models/add-and-edit-entities#select-entities) you would like to include in the clone
2. Select **Save As** in the toolbar
3. Select **Clone** in the Save As dialog.
4. Select the **Partial Save** option
5. Select **Create clone**

<figure><figcaption></figcaption></figure>

## Cut or copy and paste entities between models

1. In your model, [select entities](/models/build-and-edit-models/add-and-edit-entities#select-entities) you would like to cut or copy.
2. Right-click one of the selected entities and select **Cut** or **Copy** in the context menu. If only one entity is selected you will need to select **Cut, Copy and Paste** first to open the **Cut** and **Copy** actions.

<figure><figcaption><p>Cut, copy, and paste for multiple entities</p></figcaption></figure>

If multiple entities are selected, there are fewer Copy and Paste options, so the menu is simpler

<figure><figcaption><p>Cut, copy, and paste for multiple entities</p></figcaption></figure>

3. Open the model where you want to paste the content in a new browser tab.
4. Right-click the location where you want to paste the content and select one of the following options in the context menu:

> * **Paste** – paste content as descendants of a selected the entity
> * **Paste before** – paste content as a sibling of a selected ntity, before it in the hierarchy list
> * **Paste after** – paste content as a sibling of a selected entity, after it in the hierarchy list

## Control how pasted entities are arranged

When you paste copied entities, you can choose how they are arranged in the new model, thereby created a completely different model structure.

For example, before copying the object called *contacts2.csv*, select it:

<figure><figcaption><p>Select the object, then right-click it to copy it</p></figcaption></figure>

Choose *Copy* from the context menu; now you can paste the Object into one or more locations. For example, you could paste it as one or more of the following, in the same model or a different model:

<table data-header-hidden><thead><tr><th width="227.80029296875"></th><th></th></tr></thead><tbody><tr><td>a new Layer at right-hand end of model</td><td>right-click the blank space after the last Layer on the right then select <em>Paste</em></td></tr><tr><td>a new Layer anywhere within the model</td><td>right-click the layer,select <em>Cut, Copy &#x26; Paste</em> then <em>Paste before</em> or <em>Paste after</em></td></tr><tr><td>a new Object at the end of a Layer</td><td>right-click the layer, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste</em></td></tr><tr><td>a new Object within a Layer</td><td>right-click an object, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste before</em> or <em>Paste after</em></td></tr><tr><td>a new Attribute</td><td>right-click an object, group attribute, or attribute, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste</em></td></tr></tbody></table>

**As a new Object in an existing Layer**

<figure><figcaption><p>Pasted as an object in a different model</p></figcaption></figure>

**As a new Layer after an existing Layer**

<figure><figcaption><p>Pasted as a new layer after the Staging layer</p></figcaption></figure>

**As a new nested Attribute**

<figure><figcaption><p>Pasted as a new nested attribute within another attribute</p></figcaption></figure>

## Create a new model from selected content

The right-click context menu in the Model Viewer provides two options for creating a new model directly from selected content:

<figure><figcaption></figcaption></figure>

* **Create model from selection** - create a new model containing the selected entities (and their paths) plus transitions that connect them.
* **Extract source to new model** - create a new model containing the selected entities (and their paths) plus transitions that connect them, but this action also imports the newly created entities from the new model into the current model to replace the original selection. The selection then becomes imported content that can only be edited in the new model and updated via [import model update](/models/share-and-collaborate/activities-and-activity-types/import-model-updates) activities.

**Extract source to new model** can be useful if, for example, you want to establish a different set of users and permissions for a subset of model content.

To use either option, in the Model Viewer:

1. [Select entities](/models/build-and-edit-models/add-and-edit-entities#select-entities) you would like to include in the new model.
2. Right-click a selected entity and select either **Create model from selection** or **Extract source to new model** from the context menu.
3. In the dialog that appears, choose whether to copy queries and property definitions to the new model.
4. Add an optional description to the new model.
5. Select **CREATE MODEL**

<figure><figcaption></figcaption></figure>
