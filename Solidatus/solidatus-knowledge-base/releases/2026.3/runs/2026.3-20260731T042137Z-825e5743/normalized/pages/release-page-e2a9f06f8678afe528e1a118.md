# Import from other Solidatus models

You can import entities from one model into another within the Model Viewer, without having to create an external file.

With this method, imported content cannot be edited directly, but a link is created and maintained between the source model and the target model that enables you to update imported content in the source model and merge updates into the target model.

You can use model importing to create **composite models** that combine data structures and lineage from multiple sources while maintaining connection to the original models.

{% hint style="success" %}
You must be an **Owner** or **Author** of a model to import content into it, and you can only import from models you have at least viewer access to.
{% endhint %}

## Understand model importing

Model importing is a separate workflow from other types of importing. It does not involve importing from an external file that stores structured data. Instead, it involves directly selecting another model, or subset of entities from another model, from within the Model Viewer to bring into your model.

{% hint style="success" %}
Only entities, their properties, and their relationships can be imported through the model importing workflow. You cannot import other model features like filters, display rules, grid-reports, or views in this way.
{% endhint %}

Importing entities directly from another model creates and maintains a live connection to the original source model. **Imported entities have the same entity ID in their target model as in their source model**, which enables Solidatus to track changes and updates.

You cannot edit entities, their properties, or their reference relationships imported from other models, but you can create transitions to and from them. Imported content must be edited in the original source model and merged into other models via [imported model update activities](/models/share-and-collaborate/activities-and-activity-types/import-model-updates).

### **When to use model importing**

Importing allows you to create comprehensive views across models without requiring edit access to every source model. For organizational scenarios where different teams manage different parts of your data landscape, importing enables collaboration while maintaining clear ownership boundaries.

### **Key capabilities and limitations**

You can import entities, along with their properties and relationships, but you cannot import filters, display rules, or views. Entities maintain their hierarchical structure and properties from the source model.

You cannot edit imported entities or their properties and relationships directly, but you can create transitions connecting imported content to other imported and non-imported entities.

Model type restrictions apply to model importing: Reference Models can only import and link to other Reference models, and Lineage models can only import and link to other Lineage models.

When changes are made to a source model, you are automatically notified that an imported model update activity has been created. You can choose when and how to apply updates, maintaining control over your model while staying informed about changes in dependencies.

## Composite models: Building cross-model views

**Composite models** are models that consist primarily or entirely of imported content from multiple source models, with added lineage connections that show how data flows between the different systems represented by each imported model.

Consider a scenario where your organization has separate models for different databases, ETL tools, and reporting systems, each maintained by different teams or generated automatically by connectors. A composite model allows you to import content from all these sources and define the lineage connections between them, creating a comprehensive end-to-end view of your data landscape without requiring you to modify the individual source models.

<figure>A composite model showing layers imported from multiple models<figcaption><p>A composite model showing layers imported from multiple models</p></figcaption></figure>

## The model import workflow

To import content from one model into another:

1. Open the target model you want to import into in the Model Viewer
2. Select Import from the side toolbar.
3. Select the **Model** tile to see a list of available models for import.

{% hint style="success" %}
Previously imported models appear in a separate section at the top of the dialog, allowing you to modify existing imports if needed. If there are import update activities for an already imported model, you will see a yellow banner that you can select to go to the activity page of the import model update.
{% endhint %}

<figure>Dialog showing available models for import<figcaption><p>Selecting a source model for import</p></figcaption></figure>

## **Import a whole model**

For whole model imports, simply click the **Import whole model** button to include all content from the source.

After making your selections, you’ll proceed to the customization screen where you can fine-tune the placement of imported content in your model.

## **Import a subset of entities from a model**

When selecting a source model to import from, you can choose to import a subset of entities from the model or the whole model.

If you choose to import a subset, you are taken to the entity selection interface where the source model’s structure is presented as an expandable tree, allowing you to navigate and select exactly the content you need.

If you’re modifying a previous import and deselect content that was imported earlier, the dialog clearly indicates which entities would be removed, allowing you to make informed decisions about what to keep and what to remove.

<figure>Select specific entities to import from the source model<figcaption><p>Select specific entities to import from the source model</p></figcaption></figure>

{% hint style="success" %}
When selecting entities, remember that importing child entities doesn’t automatically include their parent or ancestor entities. If you need the ancestor entities to provide context or structure, select them explicitly.
{% endhint %}

## Reimport from the same model

You can import new content from the same model while replacing or maintaining previously imported content. Each import operation is independent, and you can import from the same model multiple times into different locations within your target model.

### **Import new content without replacing**

You can import different subsets of the same model into different locations within your target model. This is useful when you want some imported content in one layer and other content elsewhere.

To do this:

* Each import operation must be run separately
* Use the **selected entities** import option instead of **whole model**
* Select the new content you want to include from the tree hierarchy, while ensuring previously imported content remains selected (it is selected automatically by default)
* Use the **Set unmatched** option in the import customization dialog to specify the location of new content without affecting existing imported content.

{% hint style="success" %}
Because you cannot modify imported content, you cannot import entities as descendants of other imported entities.
{% endhint %}

### **Replace previously imported content**

Reimporting also allows you to replace or overwrite previous imports from a source model. The reimport process preserves existing transitions and customizations while allowing you to adjust the imported content scope.

To do this:

* Run a new import operation from the same source model
* Use the **selected entities** import option instead of **whole model**
* Select any new content you want to include from the tree hierarchy and unselect previously imported content you want to remove
* Use the **Set unmatched** option in the import customization dialog to specify the location of new content without affecting existing imported content.

If you unselect previously imported entities when performing a new import, unselected entities are automatically removed from the model along with any transitions connected to them.

## Work with imported content

A **chain link icon** appears on *root entities* in imported entity hierarchies. For example, if you imported an object and its descendant attributes, only the object would have the chain link icon. However, all entities in the imported hierarchy are still imported and linked to the source model.

These visual indicators help you distinguish between locally created content and imported content in a model.

<figure>Visual indicator for imported content<figcaption><p>Chain link icons identify imported entities</p></figcaption></figure>

The Selection panel in the Inspector tab provides additional information about imported entities, including a shortcut to open the source model.

<figure><figcaption><p>Detailed import information available in the sidebar</p></figcaption></figure>

While you cannot directly edit imported entities, you have complete freedom to create transitions connecting imported content to other entities in your model. This capability is fundamental to building composite models that capture lineage across imported content from multiple models.

<figure>Composite model with transitions between imported content<figcaption><p>Custom transitions connecting imported content from multiple sources</p></figcaption></figure>

Transitions you create exist only in the composite model and don’t affect the source models. When your composite model is itself imported into other models, all your custom transitions are included, preserving the lineage work you’ve done.

## Remove imported content

When you no longer need imported content, you can delete it from your model. This removal also deletes any transitions you’ve created that connect to the deleted content.

{% hint style="info" %}
You can only delete the top-level entities that you imported directly; you cannot selectively remove descendants of imported entities.

If you need to change which parts of a source model are included, use the reimport functionality to modify your selection rather than attempting to delete individual components.
{% endhint %}

## Keep up with source changes

When source models change, your model receives **import update activities** that notify you of the changes and allow you to selectively apply updates.

Imported model update activities appear in the Activities tab of the model you imported into and in your personal Activities list. Open the activity to review and apply the updates.

## Next steps

For more information, see related documentation:

* **Imported model update activity workflow**: [Imported Model Updates](/models/share-and-collaborate/activities-and-activity-types/import-model-updates)
* **Customising how content is imported**: [Customise Imports](/get-started/import-model-content/customise-imports)
* **Approvals workflow** : [Approvals Workflow](/models/share-and-collaborate/approvals-workflow)
