# Solidatus 4.0

After many months of development, we are pleased to announce the general availability of Solidatus 4.0.

This release includes new functionality, interface enhancements and performance improvements.

Highlights include:

* **Reference models** - Define **business glossaries** and **data dictionaries** and create relationships to these from your Solidatus models!
* **Model Overview** - Browse Solidatus models and their entities
* **Property maths** - Embed mathematical aggregations in properties and display rules
* **Lineage explorer** - Selective (filtered) visualisation of a model
* **Property view** - View a model through the lens of a property
* **Customisable sidebar** - Multiple sidebars, reorderable, site-wide settings

We look forward to building on this and enhancing each of the features in the coming months.

### Reference Models

Create and curate a rich hierarchy of terminology in the form of a reference model. This could be a data glossary, a business glossary or an asset inventory. Quickly associate terms in these with physical entities across Solidatus models and then utilise this in navigation, queries and visualisations.

* Collaboratively define business glossaries and data glossaries with a hierarchy of terms
* Annotate terms with additional customisable properties
* Relate Solidatus entities to one or more terms in reference models
* Browse and search data dictionaries and business glossaries and then look up usage of terms across all Solidatus models
* Visualise a model in the terminology of its glossary or dictionary, e.g. to see class-level data lineage vs physical-level lineage.
* Intelligently suggest and assign terms to Solidatus attributes

The Reference Model Overview for defining, searching and browsing business glossaries and data dictionaries.

Find entities related to terms in data dictionaries and business glossaries.

Extended query language support

### Model Overview

* Enhanced overview for models
  * Visualise the activity of a model over time
  * See which people and groups are contributing to a model
  * Simplified “pending changes” section for pull requests, submitted tasks and updated submodels
* Dedicated page for each model entity
  * No need to open the full model to see details or link to an entity
  * See history for individual entity
  * See which forks/branches an entity exists on

### Property Maths

Create properties with numerical aggregations over child entities’ properties.

**Examples:**

* `mean(children.DataQualityScore)` The mean of all direct children’s’ DataQualityScore properties
* `max([Risk Value])` Equivalent to max(children\[Risk Value]) Square brackets for property names with spaces and other special characters
* `sum(descendants.Throughput)` The sum of the Throughput property for all descendants
* Available aggregations: sum, min, max, avg, median, mode, variance, stdev

### Lineage Explorer

* Search for entities within a model and visualise them and their traces in isolation
* Allows to selectively drill into individual subsections of models without having to navigate from the full model view

### New Sidebar

* Multiple sidebars to group related functionality (you can still use the classic layout!)
* Sidebar sections can be hidden if not needed
* Sidebar sections are reorderable (drag and drop!)
* Sidebar sections can be dragged out of the sidebar and into a floating window
* New “Tools” section for power users
* New “Entity history” section to see a single entity’s changes since the first revision
* Activate the new layout by clicking the menu button on the right-hand side of the sidebar and selecting “Reset to new layout”.

### Feedback

As always, we encourage all feedback to be shared with [support@solidatus.com](mailto:support%40solidatus.com).
