# Examine entities and terms

Individual pages for entries in a domain display the metadata, lineage, and contextual information you need to locate, understand, manage, and govern a data element that lives in your organisation.

This page explains how to find and interpret information that appears on the domain page of a data entity or reference term.

For information on domain pages for data assets, see [Examine Data Assets](/models/explore-and-analyse-models/examine-data-assets).

<figure><figcaption></figcaption></figure>

| **Quick links to Entry Page tabs**                |
| ------------------------------------------------- |
| [Overview](#overview)                             |
| [Sub-entities/Sub-terms](#sub-entities-sub-terms) |
| [Lineage](#lineage)                               |
| [Related Entities](#related-entities)             |
| [History](#history)                               |

{% hint style="warning" %}
Entry information cannot currently be edited directly in a domain. If you would like to edit information that appears on an Entry Page, this must be done in the original model from which an entry is derived.

If you are a **Domain Browser**, this means that all questions about – or suggestions to edit – information that appears should be directed to the owner(s) of the Data Domain you are examining.
{% endhint %}

## Domain page layout

The tabs you will find on an Entry Page differ for Data **Entities** and Reference **Terms**.

For Data **Entities** that typically represent physical data assets with traceable lineage, the tabs you will find on the Entry Page are

<figure><figcaption></figcaption></figure>

* Overview
* Sub-entities
* Lineage
* History

For Reference **Terms** that typically represent governance, regulatory, and semantic metadata, the tabs you will find on the Entry Page are

<figure><figcaption></figcaption></figure>

* Overview
* Sub-terms
* Related Entities
* History

The header of an Entry Page contains the name of the entry and colorful circles representing initials of Solidatus users who own the original model from which the entry is derived.

The header also shows two paths:

* At the top of the domain window, the breadcrumbs of the entry in the structure of your Data Domain.

<figure><figcaption></figcaption></figure>

* Underneath the entry name, the path of the entity in the published Lineage or Reference Model from which this domain entry is derived.

<figure><figcaption></figcaption></figure>

Click any item in either breadcrumbs to navigate to that item. For example, you can use these breadcrumb links to return to the Search results, the Data Domain homepage, or to the main Data Domains landing page. Or, you can navigate to related entries through the model path.

From any Entry Page, you can click `OPEN IN MODEL VIEWER` in the top-right to open the published model in which the entity resides in the Model Viewer, where a focused lineage trace will be automatically applied.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
In most cases, when you access a model through a Data Domain, the model will open in read-only mode.

However, you will be able to edit the model in the Model Viewer if you have an Author licence **and** are an Owner or Author of the model you are accessing.
{% endhint %}

## Entry page tabs

### Overview

The Overview tab shows you:

* the description of the entry (if one has been supplied in the original model)
* the Relationships the entry has to Reference terms
* the Properties of the entry.

<figure><figcaption><p>The overview for an Entity</p></figcaption></figure>

{% hint style="success" %}
All of this information is derived from the original model that contains the entity represented by the domain entry.
{% endhint %}

The Description text box on an Entry Page is automatically filled in with the property value of any property named either Description, Definition, Summary, Explanation, Notes, Details, Context, Background, Meaning, Purpose, Usage, Information, or Remarks.

If and entity has more than one property in this list, the Description box will be filled in by the first property found in the following order of priority:

* Description
* Definition
* Summary
* Explanation
* Notes
* Details
* Context
* Background
* Meaning
* Purpose
* Usage
* Information
* Remarks

### Sub-entities/Sub-terms

Entity and sub-entity pages now include an entity hierarchy table, giving you a clearer view of structure without leaving the domain context.

The hierarchy table helps you:

* search within the local structure of the current entity
* page through larger hierarchies
* open specific sub-entities directly from the domain page

Sub-entries are derived from the position of the entry within the hierarchy of entity types in the original model (`Layer>Object>Group>Attribute`).

For example, an entry for a database that is an Object entity type in the original model should display tables (Group entity types) and columns (Attribute entity types) as sub-entries.

Property folders also help organise large property sets more clearly on entity pages.

Reference term pages continue to list sub-terms where relevant, while the Related Entities tab shows the lineage entities connected to a term.

<figure><figcaption><p>Use the entity hierarchy table to browse sub-entities in context.</p></figcaption></figure>

### Lineage

The Lineage page for an entry takes you into the [Data Map](/data-domains/data-maps), which will be focused on the lineage trace of the entry. Visit the [Explore a Data Map](/data-domains/explore-data-domains/explore-data-maps) page for information on how to navigate and analyse a Data Map.

Initially, the Data Map is unexpanded, with only the focal entity open and displaying a .

The datamap-show-trace-icon icon indicates that an entity is the focal target of the lineage visualisation, meaning the Data Map is only showing entities directly or indirectly connected to the focal entity.

In Solidatus terminology, the network of connections an entity is involved in is known as its **Trace**.

{% hint style="success" %}
The Context grouping function is included in the Data Map accessed through the Lineage tab. See [Understand Data Maps](/data-domains/data-maps/understand-data-maps) for more information on this context grouping function.
{% endhint %}

When you open the Lineage tab for an entry, you may be prompted to select a context to organise the Data Map layout. Choose a *Context* from the list to visually group the lineage of a focal entity into higher-level context categories.

<figure><figcaption></figcaption></figure>

You can also view the Data Map with no context grouping applied by clicking `Show only Physical Lineage`.

<figure><figcaption><p>Focused lineage without Context category groupings</p></figcaption></figure>

Here is the same focused Data Map in the Lineage tab with a `Business Landscape` context applied.

<figure><figcaption><p>Entity lineage grouped into Context Categories</p></figcaption></figure>

While in a focused Data Map, you can click any entity to view further details in a pop-out on the right-hand side of the screen.

<figure><figcaption><p>Popout displays entity properties and description</p></figcaption></figure>

Click `VIEW MORE` to go to the Entry Page in the Data Domain for that entity.

Click `SOURCES/TARGETS` to view the sources and targets of lineage connections to and from the selected entity.

<figure><figcaption></figcaption></figure>

You can click an item in either the Source or Target list to focus the Data Map visualisation on that entity.

{% hint style="success" %}
As you click Sources and Targets to follow a lineage trace, the Source and Target lists will be updated to show the sources and targets of whatever entity is currently selected in the Data Map.
{% endhint %}

You can navigate the full lineage of an entity by tracking its sources and targets in this way, or by following the Transition arrows in the map visualisation to find upstream and downstream connections.

### Related Entities

The Related Entities tab replaces the Lineage tab when the entry represents a Reference term rather than a physical Lineage entity.

This tab lists all entities either directly related to the entry or directly related to a sub-term (or **child**) of the entry.

{% hint style="success" %}
The Related Entities tab offers an efficient way to find all data assets related to a specific Reference term.

For example, you can use this tab to find data governed by a specific process or owner or falling under a set of policies or regulations that are represented by Reference terms in your domain.
{% endhint %}

<figure><figcaption><p>View a list of entities related to this term</p></figcaption></figure>

### History

The History tab shows you the history of changes made to the entry. This history is derived from changes to made to the entry in its original model.

<figure><figcaption><p>The history of a metadata entity in Solidatus</p></figcaption></figure>
