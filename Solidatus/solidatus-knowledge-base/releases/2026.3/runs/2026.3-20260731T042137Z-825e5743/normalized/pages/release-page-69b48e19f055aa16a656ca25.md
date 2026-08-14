# Quick-start guide

{% hint style="success" %}
This guide introduces Solidatus’ key features and core concepts while providing practical steps to get you started.

For a reference on terminology, see the [Solidatus glossary](/additional-resources/solidatus-glossary), and for helpful how-to videos, see our [video library](/get-started/video-library).
{% endhint %}

## What are Solidatus models?

Solidatus models are many things at once: explorable visualizations, analytical tools, and queryable storehouses of metadata. Their core purpose is to make complex data landscapes understandable, governable, and transparent.

<figure>The Solidatus Model Viewer<figcaption><p>Simplify and analyse complex data landscapes</p></figcaption></figure>

Built-in features like filters and display rules transform technical diagrams into powerful analytical tools that simplify complex landscapes and highlight key information.

In the Solidatus platform, models serve as the foundation for user-friendly [Data Domains](/data-domains/data-domains-main) that make lineage and metadata captured in models discoverable and accessible to business users.

## What are models made up of?

Models are made up of hierarchically organised containers called **entities** that are linked via directional arrows to display meaningful connections, such sources and targets of data flows.

Each **entity** in a model has an **entity type**. The highest-level containers are **Layers**, and Layers appear as columns in a model. **Objects** are the next highest-level containers within Layers. Objects contain **Attributes** that can be further nested into **Groups** of Attributes.

{% hint style="success" %}
There is no limit to how many levels of nesting you can have in a Layer. You can create as many levels of hierarchy as you need to represent your data infrastructure.
{% endhint %}

<figure>Entity hierarchy in a Solidatus model<figcaption><p>Entity hierarchy: Layer → Object → Group → Attribute</p></figcaption></figure>

**Transitions** are directional arrows that show connectivity between Layers, Objects, Groups, and Attributes in a model.

{% hint style="success" %}
Layers, Objects, Groups, Attributes, and Transitions are collectively referred to as **entity types**. Understanding these terms is key to using Solidatus effectively—they appear throughout the documentation and interface.
{% endhint %}

## Modeling data lineage

**Layers** in a Lineage model typically represent stages in data processing within an organization. **Objects** within these Layers might represent specific databases or systems, each containing **Attributes** representing tables, which further contain **Attributes** representing columns, such as customer names, unique identifiers, or account numbers.

<figure>Data lineage from source systems to reports<figcaption><p>Data lineage from source systems to reports</p></figcaption></figure>

**Transitions** depict data lineage by showing upstream and downstream flows at any or all levels — database, table, and column — as data enters a system and is processed, analyzed, transformed, and distributed into key reports.

{% hint style="success" %}
Key visual analysis tools like **focus trace** allow you to track flow from, to, or through a single entity in the model, and you can analyse the pathways or routes that exist between entities.
{% endhint %}

## Why data lineage matters

Knowing the downstream sources and upstream targets of data at fine-grained levels provides insight into key factors like data quality, effects of transformation or changes in data architecture, trustworthiness of data, and responsibilities for data within an organization.

| *Use case example*            | *How lineage helps*                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **Data quality issues**       | Trace problems upstream to root cause                                                 |
| **Change impact analysis**    | See all downstream systems affected by changes                                        |
| **Compliance and governance** | Document data origins, data pipeline, and transformations contributing to key reports |
| **Build data trust**          | Understand data sources, processing, ownership, and governance                        |

Ultimately, a comprehensive map of data lineage allows you to trust the data you rely on by knowing what it is, where it came from, what has happened to it, how it is used, and who is responsible for it.

## Enhancing models with metadata

Solidatus models can be transformed from complex technical diagrams into powerful visual, analytical, and governance resources when you add metadata in the form of **Properties** and **Reference Relationships** that document, classify, and describe model entities.

**Properties** are key-value pairs that add descriptive metadata to entities. Common examples of information stored as properties include data quality scores, ownership information, descriptions, last updated timestamps, and business criticality ratings.

**Reference relationships** link entities in your Lineage models to entities in Reference models (such as business glossaries, data taxonomies, regulatory documents, or governance frameworks). This creates semantic connections that enrich the technical lineage with business context.

When enhanced with this metadata, models become visual maps of data architecture, stores of critical metadata, and queryable analytical tools that make it possible to simplify and analyse complex data landscapes.

## Creating and editing models

Upon logging in to Solidatus, you are presented with the Model Browser, which contains a list of models you have access to.

Click `Create` to start a new Lineage or Reference model from scratch. To open a previously created model, click the name of a model in the list; this will take you either to the [Model Viewer](/the-user-interface/models-ui/model-viewer) (for a Lineage model) or the [Model Overview](/the-user-interface/models-ui/model-overview) (for a Reference model).

The **Model Viewer** is your canvas for building, exploring, and analyzing models. When inside the Model Viewer, right-click to open a context menu with core functions for building and editing your model. From the context menu, you can add Layers, Objects, and Attributes. You can also add properties, rename entities, or cut, copy, and paste to move entities around.

It’s highly likely that you’ll create your first models by importing data from an existing source, such as a spreadsheet, or using one of our integrations to extract from an external system, such as a database.

You can import using the **Import** feature in the Model Viewer toolbar, which allows you to import data in various formats, including Excel.

## Creating data flow with transitions

To create a new Transition, find an Object, Group, or Attribute to be the source from which the directional arrow will originate.

Hover your mouse over your source entity to reveal dark grey squares on the right and left sides of the entity. Click the dark grey square on either side and then find the Object, Group, or Attribute you would like to be the target of the Transition, and click the dark grey square on either side of that entity. You will now see an arrow pointing from the source to the target.

If you’d like to create Transitions in bulk, you can use [Auto-mapping](/models/build-and-edit-models/automap-transitions) or a spreadsheet import.

## Add properties and relationships

To add a property that further describes or documents an entity in your model, select the entity, then find the `INSPECTOR` tab in the sidebar along the right-hand side of your browser window.

{% hint style="success" %}
The Inspector tab is open by default whenever you open a model, but you can also open it by clicking `INSPECTOR` in the sidebar.
{% endhint %}

Find the `Properties and Relationships` panel and add new properties and values by clicking **Add new property** and typing.

## Filters and display rules

Solidatus has two powerful features for customizing visual features of a model to highlight critical information: **Filters** and **Display Rules**. Both are available in the toolbar under `Filters` and `Rules`, respectively.

Creating a Filter or Display Rule involves writing a query statement that identifies entities in the model of which the statement is true.

**Filters** control which parts of the model are visible. Click the `Filters` button in the toolbar to create a new filter and to open the list of existing filters. When a filter is set to **SHOW**, all entities are hidden except for those that match the filter’s underlying query. When it is set to **HIDE**, everything is shown except whatever matches the filter query.

**Display rules** add tags to entities or change their appearance if they match a query. Using display rules, you can change the colors and styling of parts of the model to highlight crucial information or display properties of interest, such as owners or data quality metrics.

Together, filters and display rules make technical diagrams of complex infrastructure come alive and “paint” them to surface information relevant to particular questions or analyses. To read more about using filters and display rules effectively, visit [Filters and Display Rules](/models/explore-and-analyse-models/filters-and-display-rules).

## Importing data

Models can be built manually from scratch, but the **Import** feature is often a quicker way to get what you need into your model. You can import any type of model content. It is likely that you will want to import from Excel or another tabular source, so that is a useful starting point.

To import from Excel, find `Import` in the toolbar and click `Tabular` in the import window. You can upload a .csv or Excel worksheet, or you enter tabular data directly into the import window.

{% hint style="success" %}
In the `Sample Templates` tab, you can find downloadable template spreadsheets that are compatible with the importer and that you can fill in with your own content.
{% endhint %}

## Version control

Solidatus offers version control and full audit trails for models through two key features:

* Revision history
* Model forks and pull requests

**Revision history**

Every time you save a model, a unique **revision** is created that stores the state of the model when it was saved. All revisions are kept in the model history, and a description of revisions can be added to indicate changes that were made at a point in time.

If you navigate to the [Model Overview](/the-user-interface/models-ui/model-overview) of a model, you can see a full history of the model’s revisions.

Using the `Actions` button to the right of any revision, you can view the model at any point in its history, compare previous versions to the current version, and reinstate a previous version.

**Forks and pull requests**

In Solidatus, you can create working branches of a model called **forks**. Forks are exact copies of a model at a point in time that maintain connection to the original model, so changes can be exchanged back and forth.

When you modify a fork and wish to merge your changes into the original model (referred to as the **parent model** of the fork), you can submit a **pull request** from the [Model Overview](/the-user-interface/models-ui/model-overview) of the fork. Pull requests go to Owners and Authors of the parent model and allow them to review, accept, and reject changes before merging them.

## Sharing and collaboration

There are several ways to **share** a model:

* From the [Model Browser](/the-user-interface/models-ui/model-browser), open the model information side panel for a model. Then click the **OPEN OVERVIEW** button at the bottom of the panel. Find and click the `SHARE` button that appears on the list of `People` along the right-hand side. This makes the model visible in the Model Browser for other individuals or [Groups](/models/share-and-collaborate/groups) registered to your Solidatus environment.
* From the [Model Overview](/the-user-interface/models-ui/model-overview), you can also go to the `Settings` tab and find `Permissions` to add other people or groups and assign them access roles.
* From the [Model Viewer](/the-user-interface/models-ui/model-viewer), you can share a **read-only version** of a model with other registered Solidatus users by clicking the `Share` button in the toolbar and copying the link to share with others. You can even apply a specific **View** to a read-only share link, so the model opens to a specific, preserved state when accessed through the link.

### Activities and collaboration workflows

A model Owner can select other users and groups to act as co-owners or co-authors of a model. Each Owner or Author can work on the model independently, merging their changes with those made by other users as they save the model.

**Tasks** can be used to delegate specific work on a model to other users. Click `Create Task` in the toolbar to start a new task. To see all tasks that have been assigned to or created by you, click `Activities` in the navigation bar at the top of the Model Browser page. The Task’s creator sets the objective of the task and the assignee. Once the assignee has completed their work, they submit the modified model for review. The creator can then accept or reject the changes or designate others as reviewers to sign off on changes.

Group members can also work together on models. Once a model has been shared with a group, members of the group can view the model and save a working copy, known as a **Fork**. If a Fork is modified, the original is unchanged and the Fork editor can petition the model’s owner(s) to merge the modifications into the original model: this is called a **Pull Request**.

Individual users with Viewer access to a model can also create their own **fork** of a model, which allows them to make changes and submit **pull requests** to merge their changes back into the **parent model**.

See [Collaboration scenarios](/models/share-and-collaborate/collaboration-concepts-and-features) for more information on these important features.

## Data domains

Click `Domains` in the Navigation Bar at the top of the window to access Data Domains you have access to.

Here you can create individual **Data Domains** that contain metadata and lineage from a set of models that you publish to them. Data Domains make the content of your models discoverable through a user-friendly search portal interface.

Data Domains also contain their own lineage visualisation tool, called **Data Maps**, which are optimised for cross-model, enterpise scale lineage visualisation. Data Maps are uniquely designed to stitch lineage across several individual models, and to display lineage in the context of meaningful high-level business structures, semantics, and operations.

To learn more about Data Domains and Data Maps, visit the [Data Domains](/data-domains/data-domains-main) section.

## What’s next?

This is a basic introduction to the capabilities of Solidatus and to creating, editing, sharing, and viewing models. To find out more, search or browse the full documentation, where you can find conceptual explanations, practical how-tos, and examples for each feature.

Key areas to explore:

* [Model building best practices](/solidatus-best-practice/best-practice-main) for principles of effective model and workflow design
* [Understand Solidatus models](/models/understand-solidatus-models) for more about use-cases, model types, and model functionality
* [Connectors](/connectors/connectors-overview) for learning how to extract lineage directly from third-party technologies
* [Filters and display rules](/models/explore-and-analyse-models/filters-and-display-rules) for analysing a data landscape using advanced visualisation features
* [Solidatus glossary](/additional-resources/solidatus-glossary) for a comprehensive reference on terminology
* [Video library](/get-started/video-library) for short, focused, visual learning aids
