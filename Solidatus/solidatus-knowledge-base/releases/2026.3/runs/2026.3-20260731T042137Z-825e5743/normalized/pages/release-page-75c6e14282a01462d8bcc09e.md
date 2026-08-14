# Understand Analytics reports and metrics

Analytics Reports are designed to give you quantitative insight into the data and metadata landscapes captured in your Data Domains.

Analytics Reports enable you to create **metrics** that count items in a Data Domain that possess characteristics you specify. You can count items by entity type, name, property and value, relationship, or a combination of these characteristics.

You can use Analytics Reports for a variety of objectives:

* Calculate important figures from the contents of your Data Domains
* Build charts and graphs to improve monitoring, analysis, and decision-making
* Share charts easily across the business with everyone who can access a domain

The rest of this page explains two key concepts involved in the functionality of Analytics Reports: **metrics** and **match criteria**.

## What is a Metric?

The term `metric` in Analytics Reports refers to two separate, but related, things:

* An executable `set of instructions` that define which entities to count in a Data Domain.
* A `single numeric value` that is returned when the instructions have been executed (i.e., the entities have been counted).

Metrics count entities in a domain that possess characteristics you specify when defining the metric. A metric (`single numeric value`) represents how many entities in your domain match your defined criteria (`set of instructions`).

Once you’ve created metrics, they can be used to populate charts and other data infographics that are displayed in **Tiles** on the landing page of an Analytics Report.

{% hint style="success" %}
To use Analytics Reports and metrics effectively, you need to obtain an accurate number that captures what you are looking for. Understanding the components of a metric can help you ensure that your metrics count what you want them to.
{% endhint %}

## What are Match Criteria?

Metrics are also `sets of instructions` for counting entities, and **match criteria** are the core of these instructions. **Match criteria** define `what` your metric will count in your Data Domain, and, therefore, what the numeric value returned by a metric represents.

**Match Criteria** are identifying features of entities, like entity type, name, properties, and Reference relationships. If entities possess the features you specify, they **match**; if they do not have the features you specify, they do not.

You can create simple metrics that have one or two **match criteria**, or you can create complex, fine-grained metrics that **include** entities with certain characteristics and **exclude** entities with others.

Since match criteria are defined by queries in the Domain Query Language, the full range and precision of the query language can be used to define what to count in a domain.

## Match Criteria and Queries

**Match criteria** are defined by creating a query that matches items satisfying the conditions expressed in the query. The value returned by a metric represents how many entities match the query conditions.

{% hint style="success" %}
You don’t need to know how to write a query in the Domain Query Language (DQL) to create a metric.

The metric creation workflow allows you to choose whether to build a query using simple interface menus and buttons (Basic mode) or to write a query in the Domain Query Language (Advanced mode).
{% endhint %}

<table data-header-hidden><thead><tr><th width="106.3582763671875"></th><th></th></tr></thead><tbody><tr><td><strong>Basic</strong></td><td>Set match criteria using a simple dialog interface with menus and buttons.</td></tr><tr><td><strong>Advanced</strong></td><td>Set match criteria by writing a query in the <a href="/pages/8TPcuB1I1cP0GCFgAnbw">Domain Query Language</a>.</td></tr></tbody></table>

{% hint style="success" %}
You can use all available predicates in the [Domain Query Language](/data-domains/explore-data-domains/query-data-domains) to tell your metric `what` to count in a domain.

For example, if you only want to count entities in a specific set of source models published to your domain, use the `Model=` or `ModelId=` predicates to restrict which models in a domain matching entities will be counted in.
{% endhint %}

Let’s illustrate **match criteria** with an example:

Let’s say the Lineage models you published to a domain represent tables in a database as Objects with a property called `Type` that has the value `table`. Not all Objects in the models published to the domain are tables, but all tables are Objects, and they are distinguished from Objects that aren’t tables by the `Type` property.

To count how many tables you have, you need to set your match criteria to count only Objects and add a property criteria to pick out only the Objects with the value `table` for the property `Type`.

This is the metric defined in Basic mode:

<figure><figcaption><p>Set match criteria in Basic mode</p></figcaption></figure>

This is the same metric, but defined by writing a query in Advanced mode:

<figure><figcaption><p>Set match criteria in Advanced mode</p></figcaption></figure>

There is much more detail on setting match criteria in Basic and Advanced mode on the [Create and Edit Metrics](/data-domains/analytics-reports/create-and-edit-metrics) page.
