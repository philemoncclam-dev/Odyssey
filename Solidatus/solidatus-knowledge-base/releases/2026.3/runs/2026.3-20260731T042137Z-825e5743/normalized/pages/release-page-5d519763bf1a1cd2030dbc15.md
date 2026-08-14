# Three-stage model building approach

While there are many ways to build models, the following three-stage approach is a recommended pattern for most use cases.

This approach follows a natural progression from raw data to polished, actionable data lineage documentation that stakeholders can understand and use effectively.

| *Phase*        | *Primary Goal*                                                                | *Key Activities*                                                                                          |
| -------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **1. Ingest**  | Get raw lineage data into the model                                           | Import metadata and lineage, typically using automated connectors. Create basic structure.                |
| **2. Augment** | Add complete basis to deliver business use case                               | Add properties, relationships, and additional Transitions. Stitch end-to-end lineage in composite models. |
| **3. Craft**   | Optimize for consumers. Meet the requirements of the visual business use case | Create queries, filters, display rules, and views. Finalise model structure, hierarchy, and visual flow.  |

## Phase 1: Ingest

Import metadata and lineage into the model to establish the data inventory and basic structure.

### What ingestion accomplishes

**Primary objectives:**

* Import technical metadata (schemas, table structures, data types)
* Establish basic entity structure (Layers, Objects, Attributes)
* Add any additional Transitions not captured in import

**Success criteria:**

* All required and relevant data sources are represented
* Model structure matches source systems
* Basic lineage connections are established
* Model provides coverage of target scope

### Ingestion methods and strategies

| *Method*                | *Best for*                                               |
| ----------------------- | -------------------------------------------------------- |
| **Connectors**          | Third-party source systems that we have integrations for |
| **Excel/CSV import**    | Existing spreadsheet documentation and data inventories  |
| **JSON/XML/SQL import** | File exports from external tools                         |

**Manual vs. automated ingestion:**

* For automated ingestion, import into connector forks, then merge into atomic models.
* For manual atomic model augmentation, e.g. adding missing transitions, consider creating a separate fork for manual changes and merging into the atomic via pull requests. This enables a layer of approval and quality control.
* You can automate property updates through the API using [composable commands](/api-documentation/api-actions/api-use-the-api#composable-commands), which can match entities to update by their SOL.UID or another existing property.

### Ingestion best practices

**Start with high-value targets:**

* Focus on critical business reports
* “Look left”: locate systems feeding critical reports
* Prioritize regulated or audited data flows

**Plan for maintenance:**

* Use [model topology](/solidatus-best-practice/model-topology) patterns
* Refresh model content using automated connector jobs
* Establish fork workflows to preserve manual model design

**Quality control at ingestion:**

* Validate entities after import
* Check for missing or duplicate entities
* Check for missing or incomplete metadata

## Phase 2: Augment

Add properties, relationships, filters, and display rules to enrich the model with contextual information and targeted visualizations.

### What augmentation accomplishes

**Transform technical lineage diagrams into business-relevant data documentation:**

* Add properties to enrich business and technical metadata
* Link technical data to Reference models containing business glossaries, regulations, and frameworks
* Add data quality and governance information
* Enable powerful analysis by saving queries, filters, and display rules

### Augmentation best practices

*Focus on business value:*

* Prioritize information that helps users make decisions
* Use business language, not technical jargon
* Use properties to document “why” not just “what” and “how”

*Establish consistent patterns:*

* Create standard property keys for common metadata across models
* Use consistent naming conventions across models
* Establish organizational standards for descriptions

## Phase 3: Craft

Further refine the model structure, adding grouping and hierarchy to make it easier to understand and navigate. Add views that capture content needed to satisfy a particular use case or answer important questions.

### What crafting accomplishes

*Transform functional model into intuitive, navigable resource:*

* Optimize visual layout for user comprehension
* Create logical groupings and hierarchies
* Establish clear navigation patterns
* Apply [look left](/solidatus-best-practice/follow-the-thread-and-look-left) visual conventions
* Ensure model serves target audience effectively

**Key crafting activities:**

*Structural organization:*

* Group related entities for logical navigation
* Create hierarchical relationships between entities
* Establish clear Layer organization following data flow
* Apply consistent spatial conventions (sources left, targets right)

*Visual optimization:*

* Arrange entities in downstream order of data flow
* Use Groups to organize related Attributes
* Create clean, scannable visual layouts

*User experience design:*

* Create views that are entry points for different audiences
* Create views for primary use cases
* Share read-only views with stakeholders

### Crafting strategies

**Apply “look left” principles:**

* Place business targets (reports, decisions) on the right
* Arrange source systems on the left
* Show clear left-to-right data flow progression
* Make upstream/downstream relationships visually obvious

## Measuring success across all phases

**Phase 1 (Ingestion) success indicators:**

* Complete coverage of in-scope data sources and applications
* Accurate technical metadata representation
* Functional basic lineage connections
* Stakeholder validation of data inventory

**Phase 2 (Augmentation) success indicators:**

* Business users can understand entity purposes
* Data quality and governance information is accessible
* Models support common analytical questions
* Links between technical and business concepts are clear

**Phase 3 (Craft) success indicators:**

* Users can navigate models intuitively
* Common use cases are efficiently supported
* Models serve their intended audiences effectively
* Visual organisation enhances rather than hinders understanding

**Overall model maturity indicators:**

* Models are actively used for decision-making
* Data issues can be quickly traced and resolved
* New team members can learn from a model
* Models support compliance and governance requirements

## Integration with other best practices

This three-phase approach works best when combined with other Solidatus best practices:

**Model topology:** Use [model topology](/solidatus-best-practice/model-topology) patterns to organize relationships between multiple models and maintain them effectively.

**Look left methodology:** Apply [look left](/solidatus-best-practice/follow-the-thread-and-look-left) principles throughout all phases, especially during crafting for visual organization.

**Auto-mapping:** Leverage [auto-mapping](/models/build-and-edit-models/automap-transitions) during augmentation to efficiently create transitions.

**Collaboration workflows:** Use [collaboration](/models/share-and-collaborate/collaboration-concepts-and-features) features to coordinate team efforts across all three phases.

## Next steps

The three-phase approach provides a structured path from raw data to valuable business resource. Next, move on to [Model Topology](/solidatus-best-practice/model-topology) to learn how create collaborative, enterprise-scale model building workflows.
