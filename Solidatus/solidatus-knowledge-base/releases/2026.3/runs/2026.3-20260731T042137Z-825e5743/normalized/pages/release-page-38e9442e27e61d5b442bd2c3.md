# Metric examples

To help you use Analytics reports to their fullest extent, this page contains example metrics that demonstrate the fine-grained quantitative insights you can derive from a domain.

Given that metrics can be defined using the broad scope and flexibility of the [domain query language](/data-domains/explore-data-domains/query-data-domains), there is virtually no limit to the criteria you can create to gather numbers useful to your organisation.

{% hint style="success" %}
As these examples show, the way to configure a metric depends on how data is represented in the underlying models published to a domain.

For example, it is crucial to know

* whether metadata is represented as a property or Reference relationship,
* whether data assets (e.g., tables) are represented by a particular entity type (e.g., Object or Attribute),
* whether you want to count entities in all models in a domain or only particular models.
  {% endhint %}

## Example 1

In this example, we have a property, `compliant`, that holds a boolean value indicating whether a data element has passed formal reviews for GDPR compliance.

In our domain, tables in our Customer database are all prefixed with the code `POD`. We want to know how many tables **do not** have columns that have passed a GDPR compliance review.

To target characteristics of children of an entity, we need to configure our metric using the query language. The `HasChild:` predicate enables us to count entities whose children have specified characteristics (the `ParentOf:` predicate is an alias of `HasChild` and can also be used).

<figure><figcaption></figcaption></figure>

## Example 2

In this example, we are looking for columns that do not have assigned checks for data quality controls. Assigned checks are represented by Reference relationships with the label “is controlled by”, and columns are all Attributes in the models in this domain.

However, we want to scope our metric to count only entities in two models in the domain: “Banking Template Lineage Model” and “Template EUC”.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
In this query, we used the `HasDirectRelationship:` predicate, but we could have also used the `HasRelationship:` predicate.

`HasDirectRelationship:` matches entities related to a specified term, and `HasRelationship:` matches entities related to a term **or its children**. However, in this query, these predicates are equivalent because we are only interested in whether an entity has **any** relationship with the specified label, and we are not specifying a term of the relationship.
{% endhint %}

## Example 3

In this example, we are looking for tables that contain data classified as “Personal Data”. Tables are Objects in the models in this domain, and “Personal Data” is a Reference term related to all columns containing data that falls under GDPR regulations.

Since we are looking for tables containing GDPR protected data, but the tables themselves are not related to the term “Personal Data”, we need a query to count Objects whose children have a relationship to “Personal Data”.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
In this query, we used `HasRelationship:` , which matches entities related to the term you specify **or to children of** the term you specify. This means that if the term “Personal Data” contained sub-terms for specific types of personal data (e.g., “Name”, “Address”, etc.), the metric would count tables containing columns related to any of these sub-terms as well.
{% endhint %}
