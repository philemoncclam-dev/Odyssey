# Reference relationships 101

This page focuses on the "what" of Reference relationships: here you can learn key terminology and find out what Reference relationships are.

For more on the how, when, and why of using Reference Models, see [Reference Models 101](/models/understand-solidatus-models/reference-models-101).

## What are Reference relationships?

At the most basic level, a Reference relationship is a connection — whose meaning is defined by the modeller — between a term in a Reference model and an entity or term in another model.

A Reference Relationship is composed of three things: an entity, a relationship label, and a Reference term.

<figure><figcaption></figcaption></figure>

The Relationship **label** describes the meaning of the connection between the entity and the term, and it is defined by the modeller when a relationship is created.

{% hint style="success" %}
Usually Reference Relationships are created to link **entities** in Lineage models to **terms** in Reference models, but you can also use Reference Relationships to link terms in separate Reference models.
{% endhint %}

## Reference Terms

The word **Term** refers to any entity in a Reference Model.

{% hint style="success" %}
The semantic distinction between **term** and **entity** makes life easier when we’re discussing different ways to connect ‘things’ in Solidatus.

But, it is also helpful to note that a term is simply an entity that sits in a Reference model.
{% endhint %}

When we mention ‘related terms’, for example, we know we’re talking about linking things that are defined in different models, not about linking things *within* a model using Transitions.

## Relationship Labels

A *Label* is a string of text associated with a Reference Relationship, intended to name the reason why a Reference Relationship exists.

The default Label for a Reference Relationship created in the *Reference Models* tab in the Sidebar is `Relates to`, which is not at all meaningful, and should be replaced. If you create a Reference Relationship in the *Inspector* tab there is no default value, you have to supply the Label.

For example, what does it mean when an entity called *Facility* is related to a term called *Exploration* in a Reference Model of type *Asset Inventory*? What does it mean if they are connected by two relationships?

<figure><figcaption><p>Different Labels</p></figcaption></figure>

<table data-header-hidden><thead><tr><th width="241"></th><th width="241"></th><th></th></tr></thead><tbody><tr><td><strong>Entity</strong></td><td><strong>Label</strong></td><td><strong>Term</strong></td></tr><tr><td>Facility</td><td>(is) <strong>Owned by</strong></td><td>Divisions \ Exploration</td></tr><tr><td>Facility</td><td>(is) <strong>Used by</strong></td><td>Divisions \ Exploration</td></tr><tr><td>Facility</td><td>(is) <strong>Used by</strong></td><td>Divisions \ Research</td></tr><tr><td>EMEA Operations Division</td><td>(is) <strong>subject to jurisdiction of</strong></td><td>Country \ France</td></tr><tr><td>DW_Staging_1</td><td>(is) <strong>located on</strong></td><td>Data Centre 5 \ Server 1</td></tr><tr><td>customer-email-address</td><td>(is) <strong>an instance of</strong></td><td>Party Email Address</td></tr><tr><td>customer-email-address</td><td>(has) <strong>GDPR classification</strong></td><td>Personal Data</td></tr><tr><td>KYC \ Amount of Cash</td><td>(is) <strong>due to</strong></td><td>Detection Scenarios \ Transaction Monitoring \ Small dollar transactions</td></tr></tbody></table>

## View and edit relationships

Reference relationships can be created, viewed, and managed in two sections of the sidebar in the Model Viewer:

> * The `Properties and Relationships` panel in the Inspector tab
> * The `Reference Model Panel` in the Reference Models tab

For full information on adding and editing relationships, see [Add and Edit Reference Relationships](/models/build-and-edit-models/add-and-edit-reference-relationships).

For information on viewing and analysing existing relationships, see [Examine Reference Relationships](/models/explore-and-analyse-models/examine-reference-relationships)

For information on creating Filters and Display Rules based on existing relationships, or to surface information about related Reference terms in a Display Rule tag, see [Filters and Display Rules](/models/explore-and-analyse-models/filters-and-display-rules).

Solidatus will suggest possible new Reference Relationships - see [Intelligent relationship suggestions](/models/build-and-edit-models/add-and-edit-reference-relationships#creating-reference-relationships).

## Direct, inherited, and inferred relationships

Relationships to a Reference term can be **direct**, **inherited**, or **inferred**.

<table data-header-hidden><thead><tr><th width="220.32159423828125"></th><th></th></tr></thead><tbody><tr><td><strong>Direct relationship</strong></td><td>A relationship an entity itself has to a given Reference term.</td></tr><tr><td><strong>Inherited relationship</strong></td><td>A relationship an entity has to a Reference term when its ancestor is directly related to the term.</td></tr><tr><td><strong>Inferred relationship</strong></td><td>A relationship an entity has to a Reference term when it is directly related to a descendant of the term, but not directly to the term itself.</td></tr></tbody></table>

{% hint style="success" %}
Inherited and inferred relationships are also collectively referred to as **indirect** relationships.
{% endhint %}

<figure>../../_images/direct-inherited-inferred.png<figcaption></figcaption></figure>

## Comparison with Transitions and properties

### **Transitions**

Like Transitions, Reference relationships connect things in models, but they serve different purposes and have distinct characteristics.

Transitions are primarily **visual** and capture directional lineage, tracing the flow of data from a source to a target. They depict the step-by-step movement of data assets through an organization’s architecture, allowing you to visualize and follow this path.

While Transitions can represent connections other than data lineage —- such as the movement of goods or steps in a supply chain —- they are typically used to depict lineage.

Reference relationships, on the other hand, are primarily **semantic** and not visible in a model’s map structure. They derive meaning from term names, relationship labels, and the Reference model context.

Unlike Transitions, relationships connect things in separate models, they are not visually represented in a model, and they cannot have properties.

Designed to classify and document physical data, Reference relationships connect data entities to broader semantic, regulatory, or reference frameworks, such as business and regulatory taxonomies.

### **Properties**

Like Properties, Reference relationships add metadata to describe and document entities. However, unlike Properties, relationships connect entities to metadata in a separate model, which enhances functionality and flexibility.

Imagine a Lineage Model with the structure (Tables and Columns) of a database where you want to record specific information about tables and columns containing ‘business’ rather than ‘technical’ data:

> * The latest Data Quality Outcome for each column
> * An indication of the type of data in each Table, using established business Concepts
> * A GDPR classification for each column

While all of this information could be recorded using Properties, this approach isn’t recommended. Why?

<table data-header-hidden><thead><tr><th width="226.09295654296875"></th><th></th></tr></thead><tbody><tr><td><strong>Data Quality Outcome</strong></td><td>Typically binary (Pass/Fail), suitable for a property if automated, e.g., by a Solidatus connector.</td></tr><tr><td><strong>Business Concepts</strong></td><td>Though possible in a multi-select property, Reference relationships allow standardized, governed concepts that can be used across models and by everyone in an organisation.</td></tr><tr><td><strong>GDPR Classifications</strong></td><td>Similarly, Reference relationships support standardized classifications organization-wide.</td></tr></tbody></table>

The general reasons to use Reference relationships rather than properties for certain types of content are summed up here:

> * Properties are limited to a name and values, with no capacity to record additional details like ownership or meaning, which restricts their usefulness in linking enterprise-wide *Concepts*.
> * Display rules can reference properties of related Reference terms.
> * Using properties could result in duplicated, inconsistent values, whereas Reference relationships offer consistent labeling.
> * An entity may be tagged with a semantic term like an Owner or Department for various reasons. Relationship labels allow multiple, distinct links to the same term, each with its own unique meaning.
> * Properties or their values cannot be traced across models.

If you need to enter numerous unique values into a single property, consider storing them in a Reference model and applying them to Lineage entities through relationships.

## Advanced functions involving relationships

This page is meant to be an introduction to Reference models. However, it is useful to end by mentioning a few of the advanced features that you can take advantage of when you start using Reference models to connect your physical data lineage to broader semantic content.

### **Filter a model visualisation by relationships**

By using the `Show usage` function in the sidebar Reference Model Panel, you can filter a model to show only the entities related to a Reference term and hide all others.

Additionally, you can switch on `Show usage` for multiple Reference terms and choose whether to see entities related to **any** term or to **all** selected terms.

For further information and how-tos, see [Examine Reference Relationships](/models/explore-and-analyse-models/examine-reference-relationships).

### **Query by relationships**

Both the [Models query language](/models/explore-and-analyse-models/model-query-language) and the [Data Domain query language](/data-domains/explore-data-domains/query-data-domains) (DQL) allow you to match entities by their relationships to Reference terms. You can match entities by the names of terms they related to or by relationship labels. The DQL also allows you to match entities by the name or ID of a Reference model that contains a term they are related to.

### **Tag entities with characteristics of related terms**

There is a type of tag Display Rule that will show the name of a related Reference term or a property value of a related Reference term on all entities matched by a query.

For example, you can match all Attributes in a model and display the name of terms they are related to under the label “Owned by”.

For further information and how-tos, see [Filters and Display Rules](/models/explore-and-analyse-models/filters-and-display-rules).

### **Aggregation by relationship label**

You can aggregate Attributes in a model by [reference labels](#aggregation-by-relationship-label), which will group together Attributes that are related to the same reference term under the same label.

This can be useful for viewing a model through the lens of specific reference relationships. When you aggregate a model by Reference labels, the aggregated model opens in a separate window in read-only mode. You can easily access lists of entities in particular locations in the model that share the same reference relationship to the same terms.

For more info and how-tos, see [Aggregate Attributes by Property or Reference Label](/additional-resources/advanced-topics/aggregate-attributes-by-property-or-reference-label).
