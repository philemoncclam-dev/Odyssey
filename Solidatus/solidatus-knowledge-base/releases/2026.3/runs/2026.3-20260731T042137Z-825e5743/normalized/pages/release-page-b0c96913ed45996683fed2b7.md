# Create a new model

Solidatus models are collections of entities, and connections between entities, that are part of a data flow (lineage models) or reference framework (reference models).

A common type of model would be a visualisation that enables or enhances comprehension of, and governance over, the interplay of data, within a context framed by the modeller.

{% hint style="warning" %}
Users with Practitioner or Read-only [licences](/account-management/licences-capabilities-and-roles) cannot create or own models; however, Practitioners can participate in model development at the request of other users, via [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks).
{% endhint %}

## Different ways to create a Model

There are several ways to create a model in Solidatus, and the approach to take depends on your circumstances.

### **Create a new, empty model**

If you're starting from scratch, your first step is likely to create a new, empty model from the Model Browser. See the [next section on this page](#create-a-new-empty-model-1) for details.

### **Use a Solidatus connector**

Solidatus connectors create and update models by extracting from an external source technology and generating a Solidatus model from source metadata. They can be used to update model content automatically to reflect changes in the source.

### **Import a SOL file**

See the separate page on [importing a .SOL file](/get-started/import-model-content/import-a-sol-file).

### **Clone or fork a model**

See the page on how to [copy an existing model](/models/build-and-edit-models/copy-clone-or-fork-a-model).

### **Create a model from selected entities**

Right-click on a selected entity in the Model Viewer, and choose **Create model from {selection}** . This creates a new model containing the selected entities (and their entire hierarchy — ancestors and descendants) plus transitions that connect them.

### **Extract source to new model**

Right-click on a selected entity in the Model Viewer, and choose **Extract source to new model** . This creates a new model containing the selected entities (and their path) plus transitions that connect them. **It also imports those new entities into the current model to replace the original selection**.

This is very useful if, for example, you want one of the model layers to form a separate model with a different set of users and permissions.

## Create a new, empty model

After logging in, you are presented with the [Model Browser](/the-user-interface/models-ui/model-browser) (which may be empty if you are just starting in Solidatus).

<figure><figcaption></figcaption></figure>

Select **Create** at the top-right of the Model Browser, then choose **Lineage model** or **Reference model** to open the create model dialogue.

In the dialogue, enter a name for the model (duplicate names are allowed, but not advised!), provide a description for the model, and add appropriate tags.

{% hint style="success" %}
Adding a **Description** is a really good idea: it lets your colleagues know why you created the model (you may welcome this reminder later on yourself).

The model description is also used by the AI assistant to understand the purpose of the model.
{% endhint %}

**Tags** can be used to help you and your colleagues organise models in a way that makes them easier to find and understand - personal tags (highlighted by a padlock symbol) are only visible to the user that created them ([read more about tagging models](/the-user-interface/models-ui/model-tags)).

We recommend using tags to keep track of the function of the model within a [model topology](/solidatus-best-practice/model-topology). For example, tag models with **Connector fork**, **Atomic**, **Composite WIP**, and **Published composite** to quickly show what they are used for within the ingestion, augmentation, review, and publication stages of a model building workflow.
