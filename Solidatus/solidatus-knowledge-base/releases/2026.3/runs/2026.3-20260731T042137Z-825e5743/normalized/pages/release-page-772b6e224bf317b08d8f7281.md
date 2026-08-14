# Understand Data Maps

Data Maps are interactive visualizations that combine lineage from multiple models into unified, business-friendly views. They transform complex technical data flows into clear visual representations organized around meaningful business categories.

Data Maps provide a number of capabilities:

* **Cross-model lineage**: Automatically stitch together data flows from multiple models into a single, comprehensive view
* **Business context groupings**: Organize technical lineage around meaningful categories like systems, departments, or business processes
* **Interactive exploration**: Navigate large-scale data landscapes using intuitive pan, zoom, and expand/collapse controls
* **Display rules**: Surface critical metadata and use colorful tags to support governance and impact analysis

## Data Maps and Data Domains

Data Maps are automatically generated when you publish Lineage models to a Data Domain. They serve as the primary visualization tool for exploring the data lineage landscape of a domain.

**Use Data Maps when:**

* Visualizing end-to-end data flows that span multiple systems or models
* Presenting technical lineage in business-friendly groupings
* Building enterprise-wide data blueprints that are easy to navigate
* Showing data context using organizational structures (systems, departments, processes)

## How Data Maps work

Data Maps combine lineage from published Lineage models and allow you to organize it using business context from designated Context models.

<figure>A Data Map showing technical lineage in the context of a Systems Catalog<figcaption><p>Data Maps organize technical lineage within business-friendly context groupings</p></figcaption></figure>

The process involves:

1. **Publishing models**: Lineage models provide the data flows; Context Reference models provide business context
2. **Mapping relationships**: Create relationships between lineage entities and Context terms to enable groupings
3. **Designating Context models**: Select the Reference models to use for visual groupings when creating a domain or in the domain settings
4. **Automatic generation**: The Data Map is available automatically when a domain is created, and it is updated automatically as models are published or updated

## What’s inside a Data Map

Data Maps contain two types of content that work together to create valuable visual and analytical resources:

<table data-header-hidden><thead><tr><th width="200.4178466796875"></th><th></th></tr></thead><tbody><tr><td><strong>Lineage flows</strong></td><td>Data flows from your published Lineage models, automatically stitched across models when Data Assets are configured.</td></tr><tr><td><strong>Context groupings</strong></td><td>Visual containers from your Context models that organize and summarise lineage around business-meaningful categories.</td></tr></tbody></table>

**How lineage and context work together:**

* Context models create expandable visual containers (boxes) in the Data Map
* Lineage entities are grouped and embedded in these containers based on Reference relationships to Context terms
* Users can expand/collapse containers to examine fine-grained lineage details

**Context model examples:**

Context model categories are flexible and should align with your organization’s structure and terminology. Common examples include:

* **Systems catalog**: Applications, databases, platforms
* **Business glossary**: Customers, products, processes
* **Organizational chart**: Departments, teams, roles
* **Geographic model**: Regions, countries, offices

{% hint style="success" %}
**Start simple**: Begin with one Context model (like a systems catalog) before adding multiple context layers.
{% endhint %}

## Data Maps vs. Model Viewer

Data Maps complement the Model Viewer by addressing different visualisation needs:

| **Model Viewer**       | **Data Maps**                    |
| ---------------------- | -------------------------------- |
| Single model           | Multiple models combined         |
| Technical structure    | Business-friendly groupings      |
| Traditional model view | Interactive map-style navigation |
| Limited by model size  | Optimized for enterprise scale   |

**When to use each:**

* **Model Viewer**: Detailed analysis of individual models, technical model building, source model building in preparation for domains
* **Data Maps**: Cross-model exploration, high-level business summary views, enterprise overviews

## How to use Data Maps in domains

Data Maps are automatically created when you publish models to a Data Domain. You can access and explore the the Data Map belonging to a domain in three different ways, each designed for specific tasks.

| *Data Map access point* | *Purpose*                            | *Best For*                                       |
| ----------------------- | ------------------------------------ | ------------------------------------------------ |
| **Domain Data Map**     | View all lineage in the domain       | Enterprise overviews, full landscape exploration |
| **Focused Data Map**    | View lineage for one specific entity | Impact analysis, tracing data flows              |
| **Data Map View**       | Save and share custom map snapshots  | Presentations, recurring analysis                |

### Domain Data Maps

The main Data Map belonging to a domain is for exploring all lineage in that domain. It contains all entities, assets, and data flows from every Lineage model published to the domain and can be organized according to cateogries supplied by designated Context Reference models.

You can access the domain Data Map by clicking `DATA MAP` at the top right of your domain homepage.

<figure>Access the domain Data Map<figcaption><p>Access the domain Data Map from your domain homepage</p></figcaption></figure>

When you open a domain Data Map, you are prompted to select a context to apply.

The contexts available in this menu come from Reference models you designated as Context models in the domain settings.

Select **Show only Physical Lineage** to view raw aggregated lineage from Lineage models without any additional groupings.

{% hint style="success" %}
Domain Data Maps show everything published to your domain. You cannot filter to show only specific models.
{% endhint %}

### Focused Data Maps

A focused Data Map is for examining the lineage of one specific item in a Data Map. It shows only data flows and other entities connected to that item by any degree of separation, which allows you to trace upstream and downstream lineage in detail.

You can access a focused Data Map in two ways:

* *Option 1*: Go to any domain entry and click the **Lineage** tab

<figure>Entity lineage with business context applied<figcaption><p>Focused lineage organised by business context</p></figcaption></figure>

{% hint style="success" %}
You cannot deactivate the focused trace when viewing a Data Map via the Lineage tab. You can navigate to the domain pages of other entities in the trace by selecting them in the map and using the **VIEW MORE** button in the side panel on the right.
{% endhint %}

* *Option 2*: From any Data Map, select an entity and click the target button

<figure>Focus on specific entity lineage<figcaption><p>Focus on a specific entity from within any Data Map</p></figcaption></figure>

A focused Data Map shows only data connected to your selected entity by any degree of separation (i.e., you will see entities connected via other entities). The focal entity is clearly marked with a datamap-show-trace-icon icon.

{% hint style="success" %}
When viewing a focused Data Map, you can also apply context using the context dropdown menu in the top left to organize the focal entity’s lineage according to context groupings.
{% endhint %}

### Data Map views

In the course of exploring the domain Data Map or a focused Data Map, you can save and share specific views that preserve the current state of the Data Map.

Data Map views are intended for presentations, reports, sharing information, or recurring analysis tasks, where you want to return to a specific perspective quickly.

In the course of investigating a Data Map, or a focused Data Map through the Lineage tab of an entry, you can save a Data Map view.

A Data Map **view** is a snapshot that preserves the current state of a Data Map at the point the view is saved.

{% hint style="success" %}
The **current state** of a Data Map includes applied context groupings and applied focused-lineage trace (if the view is saved when a focused trace is applied).
{% endhint %}

A **view** is more than just a screenshot or frozen image – the initial state of the Data Map preserved in a view can be modified in the course of exploring it.

### Save a Data Map view

To save a Data Map in its current state, click the save-data-map-icon icon next to the context dropdown menu.

<figure>Save and share a Data Map view<figcaption><p>Save and share a Data Map view</p></figcaption></figure>

Give your view a name and description that will appear in the Data Map views tile on the domain homepage, then click Save.

A link to the view will appear on the `Data map views` tile on the homepage of the Data Domain.

<figure>Save and share a Data Map view<figcaption><p>Save and share a Data Map view</p></figcaption></figure>

The Data map views tile displays when the view was saved and the account name of who saved it.

When you open a view, icons to the left of the view’s name indicate whether the Data Map is in an open or focused state.

<table data-header-hidden><thead><tr><th width="102.373291015625"></th><th></th></tr></thead><tbody><tr><td></td><td>The Data Map is focused on the lineage of a target entity. Entities that do not belong to the lineage of the focal entity are hidden.</td></tr><tr><td></td><td>The Data Map is not focused on a target entity and it includes all entities from Lineage models published to the domain. All lineage in the domain can be viewed and explored in an “open-world” fashion.</td></tr></tbody></table>

{% hint style="info" %}
Views do not currently preserve active Display Settings or the state of expanded and collapsed entities, except for the expanded hierarchy of the target entity in a focused Data Map view.
{% endhint %}

### Share a Data map view

{% hint style="success" %}
Only Owners of a Data Domain can save Data map views, but saved views can be opened by anyone with access to the domain.
{% endhint %}

When you save a Data map view, it is automatically shared via a link on the `Data map views` tile on the domain homepage with everyone who can access the Data Domain .

It is not possible to share a view with Solidatus users who do not have access to a domain or to restrict access to the view to only a subset of domain Owners and Members.

## Next steps

Ready to start exploring? See [Explore a Data Map](/data-domains/explore-data-domains/explore-data-maps) for detailed navigation instructions and tips for analyzing your data landscape.
