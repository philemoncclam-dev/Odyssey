# Solidatus glossary

## Activity

An **activity** is a self-contained unit of work relating to a Model, which may be controlled via the Approvals Workflow.

Examples of activities include pull requests, task submissions, parent model updates, import model updates, and questions/comments needing review.

{% hint style="success" %}
See also [Approvals Workflow](#approvals-workflow), [Pull Request](#pull-request), [Task](#task), and [Collaboration](#collaboration)
{% endhint %}

## Agent

An **agent** is the visible representation of a Connector in the Solidatus user interface.

Agents are created when Connectors are registered with a Solidatus host, and they provide the environment wherein Connector jobs can be created, configured, executed, and tracked.

{% hint style="success" %}
See also [Connector](#connector), [Job (Connector Job)](#job-connector-job), and [Job Run](#job-run)
{% endhint %}

## Analytics report

**Analytics reports** are tools inside Data Domains for building charts and deriving metrics that count items with specified characteristics in a domain. The Domain query language can be used to define which items to count.

{% hint style="success" %}
See also [Metric](#metric)
{% endhint %}

## Ancestor(s)

The **ancestors** of an entity are all entities that contain it and are above it in a given heirarchy.

While the concept of **parent** captures only the entity immediately above another entity in a hierarchy, ancestors captures all generations, including the parent of a parent, and so on.

For example, the parent of a given Attribute is either the Group or Object that contains it, while the ancestors of an Attribute are the Group (if any), Object, and Layer that contain it.

## API Token

An **API token** is a short string of alphanumeric characters that authenticate a user to the server, typically used when accessing Solidatus from an external process, such as running a Connector.

{% hint style="success" %}
See also [Agent](#agent) and [Job (Connector Job)](#job-connector-job)
{% endhint %}

## Approvals Workflow

The **Approvals Workflow** adds an approval process to the powerful collaboration features built in to Solidatus. The owner of a Model can require that potential changes in an Activity must be approved before being applied to the Model. If auto-merging is enabled, approved changes will be automatically merged into the Model.

{% hint style="success" %}
See also [Collaboration](#collaboration) and [Activity](#activity)
{% endhint %}

## Atomic model

An **Atomic** model is an original model (i.e., not a Fork) that does not contain any content imported from other Models.

{% hint style="success" %}
See also [Composite Model](#composite-model)
{% endhint %}

## Attribute

**Attributes** are the lowest-level entity type in the hierarchy of model entity types (Layers -> Objects -> Groups -> Attributes). Attributes can be children of either Objects or Groups. Groups are collections of nested Attributes that can contain multiple levels of nesting.

An Attribute in an Object that represents a database table might represent a column in the table; in an Object that represents functions or departments in a business sector, Attributes might represent individual roles.

In a [Reference model](#reference-model), an Attribute might represent a term in a Business Glossary or a specific regulatory principle or statute.

## Child/Children

The **children** of an entity are the entities immediately (one-level) below it in a given hierarchy within a model.

For example, the children of a Layer are the Objects it contains, while the children of an Object are the Attributes and Groups one-level below it.

The parent-to-child relationship is one-to-many, since child entities can only have one parent entity in Solidatus. However, the child-to-parent relationship is many-to-one, since an entity can have more than one child entity.

{% hint style="success" %}
See also [Entity](#entity), [Parent](#parent), [Descendant(s)](#descendant-s), and [Ancestor(s)](#ancestor-s)
{% endhint %}

## Clone

A **clone** is an exact copy of a model that can be created using the `Save as` button in the Model Viewer toolbar. Unlike a Fork, a clone is no longer connected to the original model and updates cannot be exchanged between an original model and a clone via [Pull Requests](#pull-request) or [Parent Model Updates](#parent-model-changes).

## Collaboration

The **collaboration** features built into Solidatus enable architects, modellers, and subject matter experts across the organisation to work together to define metadata and build and edit Models.

{% hint style="success" %}
See also [Activity](#activity), [Approvals Workflow](#approvals-workflow), and [Read-only sharing](#read-only-sharing)
{% endhint %}

## Composite Model

A **composite Model** is a Model that stitches together content imported from one or more other Solidatus Models.

A composite Model may include some original content, but the primary purpose of composite Models is to link together content authored in and imported from other Models.

In a composite Model, imported content is still linked to the original Model and updates can be exchanged via import model updates.

{% hint style="success" %}
See also [Atomic Model](#atomic-model), [Imported Model](#imported-model), and [Imported Model Update](#imported-model-update)
{% endhint %}

## Connector

A Solidatus **Connector** is a process (written using our **Connector Framework**) that can extract, transform, and load information from external technology into a Solidatus Model using the Solidatus JSON-based API. A Connector can also extract information from Solidatus for reporting or transmission to another tool.

{% hint style="success" %}
See also [Connector Framework](#connector-framework)
{% endhint %}

## Connector Framework

The **Connector Framework** is a combination of the Connector Software Development Kit (SDK) and features that enable the Solidatus user interface to interact with a Connector without writing any software code specific to that Connector.

{% hint style="success" %}
See also [Connector](#connector)
{% endhint %}

## Context Model

A Context model is a Reference model built specifically for the purpose of providing visual grouping boxes for a Data Map.

When visual context is applied to a Data Map, lineage entities are embedded within grouping boxes labeled according to terms in Context models to which they, or their ancestors, are related.

{% hint style="success" %}
See also [Data Domain](#data-domain) and [Data Map](#data-map)
{% endhint %}

## Data Domain

A Data Domain is a curated, explorable library of metadata and lineage from the set of models that are published to it.

Data Domains can be searched and browsed to locate critical information about data assets in an organisation.

Each Data Domain contains a Data Map that displays aggregated lineage from all Lineage models published to the domain. Entities and stages in lineage flows can be visually grouped by higher-level categories that match meaningful business structures and functions.

{% hint style="success" %}
See also [Data Map](#data-map)
{% endhint %}

## Data Map

A Data Map is an explorable visualisation of lineage and metadata that can stitch lineage together across multiple atomic and composite models.

Data Maps are integrated in Data Domains and are automatically generated when Lineage models are published to a Data Domain.

Data Maps offer the ability to summarise stages and entities in a lineage flow visually according to high-level business categories, taxonomies, and structures. This enhanced visual capability makes physical data items easy for everyone in an organisation to discover and understand through terminology that is meaningful across the business.

{% hint style="success" %}
See also [Data Domain](#data-domain)
{% endhint %}

## Descendant(s)

The **descendants** of an entity are all entities it contains, all entities below it in the hierarchy.

While the concept of **children** captures only entities immediately below another entity in the hierarchy, descendants captures all generations, including children of children, and so on.

For example, the children of a Layer are only the Objects it contains, while the descendants of a Layer are all Objects, Groups, and Attributes it contains.

{% hint style="success" %}
See also [Entity](#entity), [Parent](#parent), [Child/Children](#child-children), and [Query Language](#query-language-s)
{% endhint %}

## Diff mode

**Diff mode** is a user interface capability in Solidatus that allows you to view and, in many cases, accept or reject differences between two Models, Model revisions, Forks and Parents, etc.

Certain actions in Solidatus - visually merging pull requests, reviewing Tasks, viewing changes since a revision - take you into Diff mode, where color coding allows you to easily compare Models or Model versions.

## Display Rule

A **Display Rule** changes how entities that match the conditions expressed in a query appear in a Model.

Display Rules can highlight entities in a different color, add colorful text or tags, add a hyperlink, or modify the appearance of transitions. They are the tools used to “paint” Models so that crucial information is easily visible and accessible.

{% hint style="success" %}
See also [Filter](#filter) and [Query](#query)
{% endhint %}

## Draft

A **draft** is an unsaved, working version of a Model.

As you work on a Model in the Model Viewer, your changes are automatically preserved periodically in a Draft. When you save the Model, all the changes in the Draft are merged into the Model. A user can have multiple concurrent drafts for a Model, listed in the Model tab in the sidebar.

## Entity

**Entity** is a generic term for Layers, Objects, Groups, Attributes and Transitions. Models are made up of these five entity types.

{% hint style="success" %}
See also [Term](#term)
{% endhint %}

## Filter

A **Filter** controls which parts of the model are visible by only showing or hiding entities that match an underlying query.

{% hint style="success" %}
See also [Query](#query) and [Display Rule](#display-rule)
{% endhint %}

## Fork (Fork Model)

A **Fork** is a copy of a Model that is linked to the original **parent Model**. The Fork allows a user or group to edit a Model in a separate workspace that can then be merged back into the parent Model via a pull request.

{% hint style="success" %}
See also [Parent Model](#parent-model) and [Pull Request](#pull-request)
{% endhint %}

## Graph Explorer

The **Graph Explorer** enables you to view a Model as an animated graph, displaying entities as *nodes* and links between entities (Transitions, parent-child relations and Relationships to Reference Models) as *edges*.

## Grid report

A **Grid Report** is a template for extracting information from a Model in a grid (column and row) format; you can view the results in the grid and export them to a CSV or JSON file.

## Group (User group)

A **Group** is collection or team of Solidatus users with whom a set of Models can be shared with specific access permissions.

{% hint style="success" %}
See also [Group (Group Attribute)](#group-group-attribute)
{% endhint %}

## Group (Group Attribute)

The term **Group** is also used to describe an Attribute that has one or more Attributes nested within it.

{% hint style="success" %}
See also [Group (User Group)](#group-user-group)
{% endhint %}

## Imported model

An **Imported Model** is a Model that has been included - either in part or as a whole - in another Model. Imported content cannot be edited directly, but it can be connected using Transitions or Reference Relationships.

## Imported Model Update

An **Imported model Update** is an activity that is created when changes are made to a Model that has been imported into the current Model; the activity alerts you that those changes need to be applied to imported content in the current Model.

## Job (Connector job)

A **Job** is a particular action configured through and performed by an Agent representing a Connector. The configuration of a job identifies the source, targets, and other parameters needed for an individual Connector action.

{% hint style="success" %}
See also [Agent](#agent) and [Job Run](#job-run)
{% endhint %}

## Job run

A **Job run** is created when a connector job is executed; it provides progress messages and records the results of the job, along with a snapshot of the configuration at the time of execution.

{% hint style="success" %}
See also [Agent](#agent) and [Job (Connector Job)](#job-connector-job)
{% endhint %}

## Label

A **Label** describes the meaning of a Reference Relationship that links a Term in a Reference Model to an entity in a Lineage Model or to another Term.

Labels are not restricted and they can be customised to capture any relevant information. The default label for a Reference Relationship is simply “Relates to”.

{% hint style="success" %}
See also [Reference Relationship](#reference-relationship), [Reference Model](#reference-model), and [Term](#term)
{% endhint %}

## Layer

**Layers** are the highest-level entities in the hierarchy of a Model. Layers are typically shown as columns in Models. and they often represent a recognisable collection of objects, systems, or concepts. Layers contain Objects, Groups, and Attributes.

In data lineage, a Layer might represent an application or system involved in processing data or a collection of reports that use data from various upstream systems. The sequence of Layers in such a model is usually from left-to-right, showing source system Layers on the left and reporting system Layers on the right.

{% hint style="success" %}
See also [Entity](#entity)
{% endhint %}

## Lineage model

A Lineage Model is a visualisation of relationships between data and/or other types of object within a context framed by the modeller.

Lineage Models can, theoretically, be used to represent anything, but in the world of data governance, they allow business, risk, and technology communities to visualise data architecture and the flow of data through an organisation. A typical use of Lineage Models is to visualise how data flows though an organisation from its original source to various departments and reports.

Lineage Models are made up of Layers, Objects, Groups, and Attributes, with Transitions that connect these entity types to show meaningful relationships.

A Lineage Model can be linked to one or more [Reference Models](#reference-model) that can contain business terminology, enterprise models of some kind, regulatory principles, etc.

The combination of Lineage and Reference Models gives Solidatus its full potential to inform and guide organisations in their use of data; for example, a visualisation of data lineage can be combined with a business glossary to catalogue data assets according to business rules or functional areas, or with a regulatory document to tell organisations which specific regulations apply to which data sources.

{% hint style="success" %}
See also [Model](#model) and [Reference Model](#reference-model)
{% endhint %}

## Metric

As an integral part of Dashboards, **metrics** count entities or properties in Models based on criteria defined by the user.

The term metric refers to two separate, but related, things in Solidatus: a **set of instructions** and a single **numeric value**. Metrics are sets of instructions for counting entities or property values that satisfy selected criteria in a set of Models. Metrics are also the single numeric values that are returned when the set of instructions has been executed.

Metric values can be used to populate charts and infographics that are displayed on a Dashboard

{% hint style="success" %}
See also [Dashboards](#dashboards)
{% endhint %}

## Model

A Solidatus **Model** is a visualisation of metadata entities and their relationships, usually with a common purpose and ownership. A Model may include read-only content imported from other Solidatus Models.

There are two types of Solidatus Model: Lineage Model and Reference Model.

{% hint style="success" %}
See also [Entity](#entity), [Lineage Model](#lineage-model), and [Reference Model](#reference-model)
{% endhint %}

## Model Viewer

The **Model Viewer** is the main workspace in Solidatus for building, exploring, visualising and analysing a Lineage or Reference model.

## Module

A **Module** is a collection of related queries that allows users to enable or disable multiple related Display Rules, and to disable, show, or hide multiple filters. A module can also contain other modules.

## Nested Attribute

A **Nested Attribute** is an Attribute whose parent is another Attribute.

{% hint style="success" %}
See also [Attribute](#attribute) and [Group (Group Attribute)](#group-group-attribute)
{% endhint %}

## Object

**Objects** are the second highest-level entities in the hierarchy of a Model. An Object is an entity whose parent is a Layer, and Objects contain Groups and Attributes.

An Object in a Layer that represents a database might represent a database table; in a Layer that represents a sector of a business, Objects might represent functions or departments in that sector.

## Parent

The **Parent** of an entity is the entity in which it is contained, the entity that is immediately above it in the hierarchy of entities in a Model.

For example, the parent of an Object is the Layer that contains it, while the parent of an Attribute is the Group or Object one-step above it.

The parent-to-children relationship is one-to-many, since an entity can only have one parent entity in Solidatus. However, the children-to-parent relationship is many-to-one, since an entity can have more than one child entity.

{% hint style="success" %}
See also [Child/Children](#child-children), [Descendant(s)](#descendant-s), and [Query Language](#query-language-s)
{% endhint %}

## Parent model

A **Parent model** is an original model from which Fork or Task Models have been created.

Fork Models are still linked to their original Parent Models, and updates can be exchanged between Parent Models and Forks via Parent Model Changes and Pull Requests.

{% hint style="success" %}
See also [Fork (Fork Model)](#fork-fork-model), [Task](#task), [Pull Request](#pull-request), and [Parent Model Changes](#parent-model-changes)
{% endhint %}

## Parent Model Changes

**Parent Model Changes** refers to an activity that is created when changes are made to a Model from which Fork or Task Models have been created.

A Parent Model Changes activity invites Fork or Task Models to incorporate the changes made to the Parent Model.

{% hint style="success" %}
See also [Fork (Fork Model)](#fork-fork-model), [Task](#task), [Pull Request](#pull-request), and [Parent Model](#parent-model)
{% endhint %}

## Predicate

A **Predicate** is a functional semantic unit in the **Models Query Language** or the **Data Domain Query Language** that matches entities based on specific characteristics, such as type, name, or property.

## Property

A **Property** is an item of metadata that further describes, categories, or documents an entity.

A property could contain a description of a database or regulation, the name of the owner of a data source, a hyperlink to a document or webpage, a date that represents last reviewed or review by date, or a risk score.

Properties document metadata, and adding them transforms Lineage and Reference Models into rich repositories of information about an organisation’s data assets and architecture.

## Pull Request

A **Pull Request** is an activity that propose to merge changes made to a Fork into a parent Model.

## Query

A **Query** is a statement in the **Models Query Language** or the **Data Domain Query Language** that matches entities based on criteria specified in the statement.

For example, a query can be general and match all Attributes, or it can be more specific and match only Attributes with a specific property and property value.

Queries in the **Models Query Language** underpin Filters and Display Rules in the Model Viewer in the sense that they specify the entities a Filter or Display Rule applies to.

Queries in the **Data Domain Query Language** can be used to search a domain, tag entities in a Data Map, and count entities in a domain via Analytics Reports.

{% hint style="success" %}
See also [Query Builder](#query-builder), [Display Rule](#display-rule), [Filter](#filter), and [Query Language](#query-language-s)
{% endhint %}

## Query Builder

As the name suggests, the **Query Builder** is a tool in the Model Viewer that helps you build valid queries to use in the search bar or in a Filter or Display Rule.

{% hint style="success" %}
See also [Display Rule](#display-rule), [Filter](#filter), and [Query Language](#query-language-s)
{% endhint %}

## Query Language(s)

Solidatus has two powerful **Query Languages**: the **Models Query Language (MQL)** and the **Data Domain Query Language (DQL)**.

Both query languages comprise a unique set of language components (predicates, comparators, logical operators, and special properties) and syntax. They allow you to formulate meaningful, precise logical statements that can be tested against entities to retrieve only those entities that match the conditions specified in the query statement.

## Read-only sharing

A **Read-only sharing** link can be created from the SHARE button on the Model Viewer toolbar.

A link enables a Model Owner or Author to share a specified model View with other registered Solidatus users.

It is possible to set an expiry date for the link, and also to fix the link to a specific model revision or to keep it updated with the latest version.

## Reference model

A **Reference model** is a Solidatus model that represents information that can be used to classify entities in Lineage models or other Reference models.

Reference models often contain business concepts, data dictionaries, or regulatory principles and documents that catalog the contents of other models.

{% hint style="success" %}
See also [Model](#model), [Term](#term), and [Lineage Model](#lineage-model)
{% endhint %}

## Reference relationship

A **Reference relationship** connects an entity in a Lineage Model or a Reference Model to a Term in a Reference Model. The purpose and meaning of a Relationship is indicated through the Label of the Relationship.

{% hint style="success" %}
See also [Term](#term) and [Reference Model](#reference-model)
{% endhint %}

## Report

{% hint style="success" %}
See also [Grid Report](#grid-report).
{% endhint %}

## Search

The **Search** feature allows you to search Models that you have access to using a dialogue familiar from your regular internet searches.

You can fine-tune the search results based on dynamic filters, enabling you to navigate the complex estate of your Models to better understand and utilise the information in them.

## Service account

A **Service Account** is a ‘synthetic account’ owned by a ‘real’ user, which has permissions and roles like any other user, but does not represent a real person. Usually, Service Accounts are used to manage and execute actions performed by Connectors.

{% hint style="success" %}
See also [API Token](#api-token) and [Connector](#connector)
{% endhint %}

## Source

A Transition is an arrow that connects two entities within a Model, where the connection flows from the **Source** entity, in which the Transition originates, to the Target entity.

## Tag

Tags are free-form labels that you can apply to Models, revisions, and activities, allowing you to categorise and sort them in whatever way is useful. The tags on models are displayed (and can be edited if you have the privilege) in the [Model Browser](/the-user-interface/models-ui/model-browser) and [Model Overview](/the-user-interface/models-ui/model-overview) and can be used to sort and filter models in the Model Browser.

Tag is a term also used to describe a type of [Display Rule](#display-rule) that adds specified content and color to entities matching an underlying query.

## Target

A Transition is an arrow that connects two entities within a Model, where the connection flows from the Source entity to the **Target** entity.

## Task

A **Task** is an activity created by the author or owner of a Model that temporarily delegates the editing of all or part of the Model to one or more users.

## Term

**Term** is a generic name for an entity in a Reference Model.

Reference Models differ from Lineage Models in that entities in Reference Models (which we refer to as Terms) can be linked to entities in other Models via Reference Relationships, while entities in Lineage Models cannot.

{% hint style="success" %}
See also [Entity](#entity), [Reference Relationship](#reference-relationship), and [Reference Model](#reference-model)
{% endhint %}

## Trace

A **Trace** is the entire network of connections via Transitions, including all hops, in which a given entity is involved in a model.

In data lineage, a trace refers to the downstream sources and upstream targets into which data flows as it is transformed, moved, and used across an enterprise.

However, Transitions that connect entities in a model can carry other meanings, and so a trace need not represent a data lineage pathway.

The trace of an entity involves all other entities connected to it in a network by any degree of separation, i.e., all "hops".

{% hint style="success" %}
See also [Source](#source), [Target](#target), and [Transition](#transition)
{% endhint %}

## Transition

A **Transition** is a special type of entity that connects Layers, Objects, Groups, and Attributes.

Transitions are represented by arrows that flow from a Source entity, in which they originate, to a Target entity.

Transitions establish an entity's Trace network by connecting it to other entities.

{% hint style="success" %}
See also [Source](#source) and [Target](#target).
{% endhint %}

## View

A **View** is a tailored snapshot of a Model that enables an Author or Owner to capture a visualisation relevant to a particular question or purpose.

Views can be applied at any time while exploring and analysing models to return to a visualisation that highlights useful information.

Read-only links can be shared with a view applied to focus attention on content relevant to a given question or to simplify model content for a particular audience.
