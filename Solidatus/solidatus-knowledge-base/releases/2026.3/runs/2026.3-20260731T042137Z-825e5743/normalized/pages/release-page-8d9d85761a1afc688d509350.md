# Create a Data Domain

To get started, click DOMAINS in the top Navigation Bar, which will take you to your Data Domains landing page. Then click + CREATE to start building a new Data Domain.

<figure>The empty Data Domains landing page<figcaption><p>The empty Data Domains landing page</p></figcaption></figure>

If you’ve already created a Data Domain, or Data Domains have been shared with you, your landing page will not be empty and you can click + CREATE in the top-right corner to create a new domain.

<figure>The Data Domains landing page<figcaption><p>The Data Domains landing page</p></figcaption></figure>

## Build a domain: step by step

* [Step 1: Name and describe your domain](#step-1-name-and-describe-your-domain) - Provide a name and description
* [Step 2: Publish models to your domain](#step-2-publish-models-to-your-domain) - Publish a set of Lineage and Reference models
* [Step 3: Designate Context models for your domain](#step-3-designate-context-models-for-your-domain) - Designate Reference models to function as *Context* models
* [Step 4: Review your domain and Data Map](#step-4-review-your-domain-and-data-map) - Review your domain homepage and Data Map

### Step 1: Name and describe your domain

In the `Summary` tab, provide a name and description for the Data Domain.

Since Data Domains are ideally a resource for a broad audience in an organisation, a clear name and description can help **Domain Explorers** know where to look to find the information they need.

The name and description you enter will appear on the tile for your Data Domain on the main Data Domains landing page.

{% hint style="success" %}
It can help to provide a description not only of what is in the domain, but also of how it is organised.
{% endhint %}

<figure>Give your Data Domain a name and description<figcaption><p>Give your Data Domain a name and description</p></figcaption></figure>

Click SAVE when you are ready to move on, and then click MODELS to go to the Models section.

### Step 2: Publish models to your domain

In the `Models` tab, select a set of models to publish to the Data Domain.

As explained on the [Understand Data Domains](/data-domains/understand-data-domains) page, a Data Domain is essentially a portal interface that surfaces content from models you publish to it. As such, only content in the models you select here will be discoverable in the Data Domain.

{% hint style="info" %}
Reference models you publish in the `Models` tab become available to be designated as context models when in the `Data Map` tab. Designating a Reference model as context model makes it available to apply to a Data Map as a visual grouping mechanism.

See [Context model design](/data-domains/understand-data-domains/domain-context-model-requirements) more information on how context models work and how to configure them.
{% endhint %}

<figure>Choosing the models to publish to a Data Domain<figcaption><p>Choosing the Models to publish to a Data Domain</p></figcaption></figure>

1. Filter the list of models by filter type.
2. Search for models by name.
3. Tick the box next to a model to publish it to the domain.
4. Sort the model list by various criteria.

### Step 3: Designate *Context* models for your domain

The *Data Map* tab is for designating a Reference model in your domain as a context model to be used for grouping a Data Map.

We recommend that you only **add one context model per domain** to simplify the domain structure and use case objective. If you'd like to group the same lineage models by another set of context categories, create a new domain for that context model.

{% hint style="success" %}
For an explanation of what a context model is and for full instructions on how to set one up, see [Context Model Design](/data-domains/understand-data-domains/domain-context-model-requirements) and [Configure a context model](/data-domains/build-data-domains/configure-a-context-model).
{% endhint %}

In the `Data map` tab, you will see a list of **all and only** Reference models that you selected to publish in the `Models` tab.

To designate a Reference model as a context model, click the checkbox next to it in the `Data Map` tab and click SAVE in the top-right corner.

<figure>Select *Context* models for use with the Data Map<figcaption><p>Select <em>Context</em> models for use with the Data Map</p></figcaption></figure>

Ticking the box next to a Reference model in the `Data map` tab makes it available to apply as a visual grouping mechanism when you open the domain Data Map or by selecting it from the dropdown menu at the top-left of the Data Map.

<figure>Select Context to apply to a Data Map<figcaption><p>Select context to apply to a Data Map</p></figcaption></figure>

{% hint style="success" %}
Once you’ve given your Data Domain a name, selected models to publish to it, and selected your context models, click SAVE in the top right to go to the homepage of your new Data Domain.
{% endhint %}

### Step 4: Review your domain and Data Map

<figure>Review the homepage of the Data Domain you have created<figcaption><p>Review the homepage of the Data Domain you have created</p></figcaption></figure>

## Layout of the domain homepage

All of the actions you can perform in a Data Domain are accessible from the homepage.

<figure>The homepage of a Data Domain<figcaption><p>The homepage of a Data Domain</p></figcaption></figure>

1. Click to open the [Browse Tree](/data-domains/explore-data-domains/browse-domain) to find an entry in the domain.
2. Breadcrumbs with clickable links to navigate to domain areas.
3. Click the three-dots icon to open the domain and Data Map [Settings](/data-domains/build-data-domains/edit-data-domains).
4. Click to open the domain [Data Map](/data-domains/data-maps).
5. Enter search terms or a query in the search bar and press `Enter` to view the results.
6. Click to open the [The Query Helper](/data-domains/explore-data-domains/query-data-domains) with examples of valid predicate syntax that you can fill in with your own terms.
7. Click to open the [Data Assets](/data-domains/understand-data-domains/data-assets-in-data-domains) section, which lists all Data Assets in the domain.
8. View, open, and create [Analytics reports](/data-domains/analytics-reports).
9. View, open, and create [Data Map views](/data-domains/explore-data-domains/save-and-share-data-map-views).
10. Explore Reference models published to the domain. Click a Reference model to view its contents.

{% hint style="success" %}
The options visible here reflect what an Owner of a Data Domain would see on the homepage.

If you are a Member of the domain with read-only access, you will not see the three-dots to access domain `Settings`.
{% endhint %}

To help find the Analytics Reports or Data Map views you need, click the arrow at the top-right corner of the Analytics reports or Data Map views tiles to open a full, expanded list.

<figure>../_images/reports-view-more.png<figcaption></figcaption></figure>

{% hint style="success" %}
For more information about how to explore a Data Map, and about the integration of Data Maps in Data Domains, visit the [Data Maps](/data-domains/data-maps) section.
{% endhint %}

## Analytics Reports

<figure>../_images/analytics-reports-expanded.png<figcaption></figcaption></figure>

1. Click the name of an Analytics Report to open it.
2. Click the three-dots menu to delete an Analytics Report (!Be careful: once deleted, it can’t be recovered!).

## Data Map Views

<figure>../_images/map-views-expanded.png<figcaption></figcaption></figure>

1. Search for Data Map views by name.
2. Click the name of a view to open it.
3. Click the three-dots menu to delete a Data Map view (!Be careful: once deleted, it can’t be recovered!).

{% hint style="success" %}
Only Owners of a Data Domain are able to delete Data Map views and Analytics reports. The three-dots menu will not appear in the expanded dialog if you are not an Owner of the domain.
{% endhint %}
