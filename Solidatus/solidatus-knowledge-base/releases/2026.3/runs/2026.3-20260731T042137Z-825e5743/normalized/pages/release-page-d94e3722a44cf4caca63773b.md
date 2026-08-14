# Model topology

**Model topology** refers to a workflow involving both automated actions of connectors and manual model design across multiple related models. It is aimed at building assured, publication-ready, fully trustworthy models that capture multiple interconnected systems or form the building blocks for a Data Domain and Data Map that stitches them together.

An optimal model topology utilises two key features in Solidatus:

* [Model forking](/models/build-and-edit-models/forks) : Feeding connector imports into forks of models allows you to separate raw, connector-generated model content from augmented, designed, and crafted content in the atomic model.
* [Model importing](/get-started/import-model-content/import-and-link-to-solidatus-models) : In Solidatus, you can use models like building blocks. Instead of creating one large, difficult-to-maintain store, we recommend building smaller, more manageable **atomic models** that can be combined into **composite models** via model importing. With Data Assets, you can publish **atomic models** directly to a Data Domain and it will stitch them together automatically in a **Data Map** that shows lineage across all atomics.

With this workflow approach, you can create a clear hierarchy of models, where source content is automatically updated and edits cascade upward toward finished, published models ready for sharing and consumption.

## Model topology hierarchy

An optimal model topology follows a clear hierarchy from bottom to top:

```
Published model (Distribution layer)
↑ (pull request)
Working composite model fork (Integration layer)
↑ (imports)
Atomic models ← Connector forks (Foundation layer)
```

### Atomic models (foundation layer)

**Atomic models** are your fundamental building blocks. They are individual, self-contained models that represent single systems or data sources.

The content in atomic models is usually derived wholly or in part from connectors that update the fork of an atomic model and merge updates via pull requests. This allows automated updates to flow in without overwriting manual augmentation and craft enhancements made to the atomic model.

**Characteristics:**

* Connector-derived in most cases
* Scope determined by ownership or automation boundaries
* Contain no imported content from other models
* All content is edited in atomic models and changes cascade upward
* Form the foundation of your topology

**Best practice workflow for connector-driven atomic models:**

1. **Create a blank atomic model** (this becomes your “parent”)
2. **Fork the atomic model** before adding any entities
3. **Configure connectors to update the fork** (not the parent)
4. **Enable “Automatically create pull requests”** on the fork
5. **Review and merge changes** through pull requests
6. **Augment the parent model** by designing the structure and adding additional metadata

{% hint style="warning" %}
Never sync changes down from an atomic to its connector-fed fork, or all augmentation made to the atomic will be lost the next time a pull request from the fork is merged.
{% endhint %}

**Benefits of the fork workflow:**

* Protects manual enhancements from being overwritten by connector updates
* Owners receive notifications when changes occur
* Visual merge allows inspection of proposed changes
* Maintains quality control over automated updates

### Composite models (integration layer)

We use **composite model** to refer to any model that consists of content imported from other atomic models. In the model topology workflow, **composite models** combine and stitch together multiple atomic models to show data flows across systems. A composite model should contain only imported elements from other models or manually entered entities that improve the readability of the layout.

**Characteristics:**

* Import content from atomic models
* Add transitions (usually via the Automapper) to create cross-model lineage
* Show cross-system data flows
* Can be nested (composites can import other composites)

**Types of composite models:**

| **Work In Progress (WIP) composite** | Created as forks of published models where you perform the stitching       |
| ------------------------------------ | -------------------------------------------------------------------------- |
| **Join composite**                   | Building-block composite models meant to be published to a Data Domain     |
| **Published composite**              | Composite that is the terminal output of your work, ready for distribution |

### Published models (distribution layer)

**Published models** are your final, curated products ready for wide distribution and consumption.

**Characteristics:**

* Contain finalized, assured content
* No editing is done directly on published models
* Edits made to fork of published model and merged through pull requests
* Distributed widely for public viewing
* Used in executive reports or regulatory submissions

**Best practice workflow for creating Published composite models:**

1. **Create a blank model** (this becomes your “parent”)
2. **Fork the model** before adding any entities (this becomes your WIP composite)
3. **Turn off** `Subscribe to` **for Import updates** on the parent model
4. **Import atomics into the fork** (not the parent)
5. **Add transitions** across atomic models (usually via the Automapper)
6. **Add Display Rules, Filters, and Views** to satisfy your use case
7. **Review and merge** the fork into the published composite through a pull request
8. **Share the published model** across your organisation

## Naming conventions for models in a topology

We strongly recommend naming models based on their role within a model topology. This clearly indicates the purpose of a model and avoids mistakes when editing or updating model content.

For example, atomic models should have "atomic model" in their names, while composite WIP models should have "composite WIP model", or something similar, in their names. Published models that are the final product of the topology workflow can have "Published composite" at the end of their name.

For connector forks, either add a [model tag](/the-user-interface/models-ui/model-tags) to the fork to indicate that it is a connector fork used only for ingesting raw content via connector jobs, or add "connector fork" to the model name. For example: "Informatica atomic model connector fork".

## Model topology patterns

Here are recommended topology patterns for Lineage and Reference models that uses forks and importing to generate curated, assured models ready for organisation-wide consumption.

### Lineage model topology

```
Published Model (Top)
↑ (pull request)
Working Composite Model (Fork)
↑ (imports)
Atomic Models ← Connector Forks
(Foundation)
```

**Implementation steps:**

1. Create a new, empty model - this will be your published composite model
2. Fork the model to create a WIP composite
3. Turn off `Subscribe to` for Import updates on the parent model
4. Create atomic models for each system you will ingest from
5. Fork atomic models to create connector forks
6. Run connector jobs into connector forks
7. Merge changes into atomic models via pull requests
8. Augment and craft raw connector output in parent atomic models
9. Import atomic models into WIP composite
10. Add Transitions (likely using the Auto-mapper) for end-to-end lineage
11. Add Display Rules, Filters, and Views in WIP composite to satisfy your use case
12. Submit and merge pull request from the WIP composite to the published composite model

{% hint style="warning" %}
Entities, properties, or relationships should be edited in the atomic models and merged up the chain through [Imported Model Updates](/models/share-and-collaborate/activities-and-activity-types/import-model-updates) activities to the WIP composite model. With the exception of adding cross-model Transitions, entities, properties, and relationships should not be edited in the WIP composite.

However, some aspects of crafting the model — adding queries, filters, display rules, and views — can only be done in the WIP composite:
{% endhint %}

### Reference model topology

For semantic data and business glossaries:

```
Published Semantic Enterprise Model
↑ (pull request)
Work-in-Progress Composite Reference Model (Fork)
↑ (imports)
Domain Models ← Domain Forks
(by business area)
```

**Domain examples:**

* Business Terms Model (CSV import)
* Critical Data Elements (Informatica EDC connector)
* Risk Domain, Product Domain, Finance Domain

## Workflow management

*Use forks for all connector updates*

* Protect parent models from accidental changes
* Enable visual review of automated updates
* Maintain audit trail of all changes
* Consider auto-merging only for stable, well-understood sources

{% hint style="warning" %}
Remember: never sync changes down from an atomic to its connector-fed fork, or all augmentation made to the atomic will be lost the next time a pull request from the fork is merged.
{% endhint %}

*Establish clear ownership*

* Assign owners to each atomic model
* Define responsibilities for composite models
* Create governance processes for published models
* Document who can approve changes

*Augmentation strategy*

* Add properties at the atomic model level
* Create relationships to reference models
* Use display rules and filters to highlight key information
* Build Views tailored to specific audiences

## Common topology challenges

**Model sprawl**

* *Problem:* Too many unorganised models
* *Solution:* Establish clear ownership and naming conventions for models, and use descriptions to clarify model content.

**Connector conflicts**

* *Problem:* Automated updates overwriting manual work
* *Solution:* Always use the fork workflow for connectors, and don't sync parent model changes from atomic model into the fork.

**Quality control**

* *Problem:* Changes propagating without review
* *Solution:* Use pull requests and formal approval processes (don't automate all pull request merging)

**Scope creep**

* *Problem:* Models becoming too large and complex
* *Solution:* Apply “look left” principle and stick to defined use cases

## Advanced topology concepts

**Automapper and SOL.UID properties**

Use the Automapper with connector-generated SOL.UID properties to automatically create transitions between systems, reducing manual stitching work.

**Reference model integration**

* Create published composite Reference models for cross-taxonomy associations
* Use transitions (not relationships) to link different reference taxonomies in the same Reference model
* Create links to the published composite Reference model in the atomic Lineage models (a form of augmentation)
* Relationships in atomic Lineage models carry through to composite and published models

## Get started with model topology

**Step 1: Plan your approach**

1. Define your visual business use case
2. Identify key systems and data flows
3. Determine ownership and responsibilities
4. Choose your starting point (usually the end goal)

**Step 2: Build foundation**

1. Create atomic models for core systems
2. Set up fork workflows for connector-driven models
3. Add basic augmentation (properties, relationships)
4. Review and validate individual models

**Step 3: Integrate atomics**

1. Design your composite model structure
2. Import atomic models and create transitions
3. Apply “look left” principle to ensure completeness
4. Add visual enhancements for clarity

**Step 4: Publish and maintain**

1. Create published models for distribution
2. Establish review and approval processes
3. Monitor and maintain model currency
4. Gather feedback and iterate
