# Add and edit reference relationships

A **reference relationship** connects an entity in a Lineage or Reference model to a term in a distinct Reference model under a label that describes the relationship.

{% hint style="success" %}
This page focuses on the how-tos of creating and editing relationships, for background and conceptual context, see [Understand Reference Relationships](/models/understand-solidatus-models/understand-reference-relationships).
{% endhint %}

There are several permissions issues to consider when creating relationships:

* You can create a reference relationship for any entity that you can edit in a model. This requires Owner or Author access to the model in which you are creating relationships.
* You **cannot** create relationships for entities that are either imported or out of scope in a [Task](/models/share-and-collaborate/activities-and-activity-types/tasks) model.
* You do not need to be able to edit a reference term to create a relationship to it. You can create relationships to terms in Reference models that you only have Viewer (read-only) access to.

## Summary of steps

You can create reference relationships to entities in a model from the Model Viewer. To create one or more relationships to a Reference model term, you must:

| Select one or more entities you want to relate to Reference model terms                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p>1) Load the Reference model containing the term to relate to, if not already loaded</p><p>2) Find a term to relate to</p><p>3) Enter a reference label or select an existing label</p> |

## **Create new relationships**

You can create new relationships from either the `Properties and Relationships` panel in the Inspector tab, or from the Reference models tab in the sidebar.

{% hint style="success" %}
Relationships to Reference terms must be created within, and reside within, the model containing the entity you are relating a term to, not the Reference model containing the Reference term.
{% endhint %}

### From the Inspector tab

#### 1) Load a Reference model

Find the relationships section in the `Properties and Relationships` panel, then click the `Select a Reference model` button and select a model from the list.

The list contains every Reference model you have at least Viewer access to. Reference models with their names in bold text are already linked to the model.

{% hint style="success" %}
Use the search bar to filter the list by name, and change the sort sequence to help you find the right model.
{% endhint %}

<figure><figcaption><p>Loading a Reference model</p></figcaption></figure>

Remember, the list only contains models that you have at least Viewer access to.

#### **2) Find and select a term to relate to**

Select `Add a relationship` to choose a term to relate to in the loaded Reference model.

The full hierarchy of times is shown, and you can use the search bar to find the required term - just click the term to select it.

When you click the `i` icon to the right of a term in the list, you can examine the term's properties. You can also use the same `Search` and `Show usage` capabilities that are available in the Reference model panel to see which entities in the model are already related to the term, if any.

<figure><figcaption><p>Previewing the properties for a term</p></figcaption></figure>

#### **3) Enter a label to describe the relationship**

To add a label, select `Enter label` and start typing. If there are existing relationships to entities in the open model, a dropdown appears showing already used labels that you can choose from.

{% hint style="success" %}
You can type in a label before loading a Reference model, or you can edit the label name at any time after that.
{% endhint %}

<figure><figcaption></figcaption></figure>

#### **Help, I made a mistake!**

If you make a mistake, you can:

> * edit the Label at any time
> * use the `Delete` option in the dropdown menu next to the Label and Reference model combination to delete all the Relationships shown to the right
> * click on the cross next to an individual term to remove a single Relationship

<figure><figcaption><p>Deleting relationships in the Inspector tab</p></figcaption></figure>

{% hint style="success" %}
See also [Customise the Sidebar panels](https://github.com/pjwsolidatus/Gitbook-test/blob/rc-gitbook-test/get-started/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/README.md#customise-the-sidebar)
{% endhint %}

### From the Reference Models tab

The Reference Model Panel in the Reference Models sidebar tab acts as a control panel for relationships to model you are currently viewing or editing in the Model Viewer.

You can view, search, and filter the Reference models from this panel. The dropdown menu allows to you to export the relationships as a CSV file, to expand all Reference models fully, and to use [Aggregate by Reference Label](/additional-resources/advanced-topics/aggregate-attributes-by-property-or-reference-label) to group entities according to their Reference Relationships.

<figure><figcaption><p>The dropdown menu for the Reference Model panel</p></figcaption></figure>

{% hint style="success" %}
See also [Finding and modifying existing relationships](#finding-and-modifying-existing-relationships).
{% endhint %}

#### **Step 1: Load a Reference model**

Before creating relationships to terms in a Reference model, you must first load the Reference model into the open model by clicking the green `+` button at the top of the Reference Model Panel and choosing model from the list.

<figure><figcaption><p>Load a Reference model</p></figcaption></figure>

The Reference Model Panel contains a number of useful actions for examining, managing, and creating relationships.

<figure><figcaption><p>The Reference Models panel</p></figcaption></figure>

For optimal performance, the Reference Model Panel only loads terms that have existing relationships in the open model. This can limit your view of all terms in the model that you might want to relate to.

You can load the full model in the *Reference Models* tab using the download icon next to the Reference model name or via the three-dots dropdown menu on the right.

<figure><figcaption></figcaption></figure>

**Step 2: Find and select a term to relate to**

Assuming you've selected one or more entities in your model, and you've loaded a Reference model, you have two ways to create a Relationship in the Reference Models tab:

> 1. Click one of the entries in the Relationship Suggestions panel
> 2. Expand the contents of a loaded Reference model in the Reference Model Panel to find a term, hover your mouse over it, and then select `+ Assign` . You can also click the arrow next to `+ Assign` to add a relationship with a label you have already used in the model.

<figure><figcaption><p>The panels in the Reference Models tab</p></figcaption></figure>

Remember, you can only add relationships to entities that have not been imported. If you try to assign a relationship to an imported entity through the Reference Models panel, you will see an error message:

<figure><figcaption><p>Unable to assign relationship to imported entity</p></figcaption></figure>

{% hint style="success" %}
See also [Finding and modifying existing relationships](#finding-and-modifying-existing-relationships)
{% endhint %}

## Find and modify existing relationships

Existing relationships for the currently selected entities can be viewed and edited in both the `Inspector` and `Reference Models` tabs in the Sidebar.

### In the Inspector tab

This tab focuses on relationships for the current selected entities in the model.

Select one or more entities, and the `Properties and Relationships` section in the Inspector tab will list all the Relationships for the selection. You can edit existing relationships from this panel, add new relationships, and also [delete one or more Relationships](#deleting-relationships).

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
To view all entities related to a given term, use the Reference Models sidebar tab.
{% endhint %}

### In the Reference Models tab

This tab focuses on Reference models and terms, providing a filterable view of terms in Reference models and how they are used in your Lineage model.

If the view of a Reference model is limited to just the terms that are related, you can load the full model using the download icon next to the Reference model name or via the three-dots dropdown menu on the right.

<figure><figcaption></figcaption></figure>

## **Intelligent relationship suggestions**

Solidatus automatically suggests Reference relationships that could be assigned to one or more selected entities. Suggestions appear in the *Inspector* and *Reference Models* tabs in the Sidebar.

<table data-header-hidden><thead><tr><th width="195"></th><th width="308"></th><th></th></tr></thead><tbody><tr><td><em><strong>Tab</strong></em></td><td><em><strong>Can suggest</strong></em></td><td><em><strong>Can create</strong></em></td></tr><tr><td><strong>Inspector Tab</strong></td><td>Labels and Reference models already in use (does <strong>not</strong> suggest individual terms to relate to)</td><td>Identical relationships to <strong>multiple</strong> entities (the current selection) at the same time - there is no default label; you must choose an existing label or type your own.</td></tr><tr><td><strong>Reference Models Tab</strong></td><td>Labels and individual terms in Reference models, based on similarities to the entity name, and on existing relationships to entities in the trace - suggestions only appear if a single entity is selected</td><td>Can only create one relationship at a time - the default label is <em>Relates to</em></td></tr></tbody></table>

### In the Inspector tab

In this tab, Solidatus suggests possible additional combinations of Reference models and labels you could also use. The panel does not suggest individual terms to connect to - see the Reference Models tab for these suggestions.

To see suggestions, click where it says *Add new label* and a dropdown menu appears with a list of Relationship labels currently used in the model, along with the Reference models those relationships link to.

<figure><figcaption><p>Relationship suggestions in the Inspector tab</p></figcaption></figure>

{% hint style="success" %}
The list does not include label and model combinations that are already referenced by the current selection.
{% endhint %}

Click an entry in the list to select a label and a Reference model to relate to, then click `Add a relationship` to choose a term to relate to in that model. To choose a second or subsequent term with the same label, click the `+` button next to the term you chose.

### In the Reference Models tab

The *Relationships Suggestions* panel is situated below the Reference Models Panel.

When an entity is selected, this section shows auto-generated suggestions of relationships to assign to the selected entity. It generates these suggestions based on entities with similar names, entities with similar relationships, or the selected entity's trace.

The button to the right of each suggestion can be used to create the relationship, similar to the main Reference Model Panel.

If you're happy with the label that is displayed alongside the term, just click it to create the relationship. Otherwise, click the dropdown for a suggestion, which allows you to choose an existing label for the relationship or create a new label.

<figure><figcaption><p>Using a suggestion</p></figcaption></figure>

{% hint style="success" %}
If the *Relationship Suggestions* panel displays "Try turning on the lineage trace to get more suggestions", you do not have *Show trace* enabled.

Click the message or the `Show trace` button in the Toolbar to enable the trace, which may result in relationship suggestions being displayed.
{% endhint %}

{% hint style="success" %}
If the contents of the Reference model seem to be incomplete (perhaps you've just saved it in a different browser tab), you can refresh the list by refreshing the browser tab.
{% endhint %}

## Delete relationships

You can delete relationships as easily as you can create them from both the Inspector and Reference models tabs.

### **In the Inspector tab**

Here you can:

> * use the `Delete` option in the dropdown menu next to the Label and Reference model combination to delete all the Relationships shown to the right
> * click on the cross next to an individual term to remove a single Relationship

<figure><figcaption><p>Deleting relationships in the Inspector tab</p></figcaption></figure>

### **In the Reference Models tab**

Here you can:

> * delete **every** Relationship between your model and a Reference model
> * delete **all** the Relationships between your current selection and a term
> * be **selective** about which Relationships to delete

| Delete all Relationships between your model and a Reference model - use the dropdown menu on the Reference model row                                                                                                               |                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Delete all Relationships between your current selection and a Reference model term - use the dropdown menu on the Reference model term row                                                                                         | ../\_images/ref-models-delete-relationship2.png |
| Choose the Relationships between your current selection and a Reference model term that you want to remove - click on the dropdown next to the Relationship Label (in this case, it shows the number of Relationships to the term) | ../\_images/ref-models-delete-relationship3.png |

## Remove a Reference model

Unused Reference models are automatically removed from the Reference Model panel when you save the model (a Reference model is *Unused* if there are no Reference Relationships linking to it)

<figure><figcaption><p>Unused Reference Models can be removed</p></figcaption></figure>

Alternatively, select `Remove reference model` in the dropdown menu next to the name of the Reference model in the `Reference Models` tab.

You will only see the `Remove reference model` option in the menu if there are no existing Relationships to the Reference model.

{% hint style="success" %}
Removing a Reference model will remove all existing relationships to terms in that model.
{% endhint %}
