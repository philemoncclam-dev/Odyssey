# Follow the thread and look left

When modeling lineage from a data source to an eventual target, it helps to start with the final target and work step-wise back to the original source. This is often referred to as “looking left” and “following the thread” — a fundamental best practice for effective lineage mapping in Solidatus.

The “look left” principle works on two levels:

* As a **discovery methodology** (working backwards from business artifacts)
* and as a **visual layout convention** (placing targets on the right side of models and tracing upstream sources to the left).

## Why the “look left” approach works

### Discovery methodology

This principle comes from the observation that owners and stewards of data systems often know the immediate source of their data — which system fed their own — but not where it goes or the source of its source.

By starting with the target, you can work backwards to fill each step in a data pipeline that leads from source to final destination, making sure no steps are missed.

*What data owners typically know:*

* ✅ **Immediate upstream** - “This data comes from System X”
* ✅ **Data format and structure** - “We receive it as JSON/CSV/API calls”
* ✅ **Timing and frequency** - “We get updates daily at 2 AM”
* ✅ **Data quality issues** - “Sometimes the customer ID field is missing”

*What they typically don’t know:*

* ❌ **Downstream consumers** - “Who uses our data after we process it?”
* ❌ **Ultimate origins** - “Where did System X originally get this data?”
* ❌ **Full data journey** - “What happens to this data before it reaches reports?”
* ❌ **Cross-system dependencies** - “What breaks if our system goes down?”

This knowledge asymmetry makes the “look left” approach more practical and reliable than trying to trace forward from sources.

### Visual layout convention

In Solidatus models, “looking left” also refers to the spatial arrangement of your lineage. Place your **end targets** (reports, dashboards, decisions) on the **right side** of the model, then trace data lineage **leftward** to discover upstream sources. This creates an intuitive **right-to-left flow** that mirrors the discovery process.

```
Source Systems → ETL Processing → Data Warehouse → Analytics → Reports/Dashboards
(Left side)                                                    (Right side)

← ← ← "Look left" discovery direction ← ← ←
→ → → Data flow direction → → →
```

This layout convention makes models easier to read and aligns the visual representation with the discovery methodology.

## Model layout best practices

When building your Solidatus model, apply the “look left” visual convention:

**Right side placement (targets):** - Final business reports and dashboards - Decision-making systems - Customer-facing outputs - Regulatory submissions - Executive KPIs

**Left side placement (sources):** - Operational source systems - Data entry points - External data feeds - Manual input systems - Third-party APIs

**Center placement (processing):** - ETL and data transformation layers - Data warehouses and data lakes - Message queues and streaming systems - Data validation and cleansing processes

**Visual flow benefits:**

* **Intuitive reading** - Follows natural left-to-right reading patterns while showing data flow
* **Clear causality** - Sources on left clearly feed targets on right
* **Consistent orientation** - All models follow same visual convention
* **Easier troubleshooting** - Issues can be traced leftward to find root causes

The “look left” approach combines discovery methodology with visual layout principles:

**Discovery process:** Start with business outcomes and work backwards

**Visual layout:** Place targets on the right, sources on the left

## Step 1: Start with business outputs (place on right side)

Begin with the most important business deliverables and position them on the **right side** of your model:

* **Executive dashboards** - Board reports, KPI dashboards
* **Regulatory reports** - Compliance filings, audit reports
* **Customer-facing outputs** - Bills, statements, product recommendations
* **Critical decisions** - Credit scoring, risk assessments, pricing models

**Why start here:**

* These outputs have clear business owners who understand their importance
* Data quality issues here have immediate business impact
* Stakeholders can clearly articulate what “good” looks like
* These systems typically have the most rigorous regulatory and quality requirements
* These systems typically have the most rigorous data governance

## Step 2: Map one layer at a time (working leftward)

Work systematically backwards through each processing layer, **moving leftward** in your model layout:

```
Source Systems ← ETL ← Data Warehouse ← Analytics DB ← Final Report
(Left side)                                            (Right side)
```

**As you discover each layer moving left, document:**

* **System name and owner** - Who is responsible for this data?
* **Data transformation** - What processing happens at this stage?
* **Data quality checks** - What validation occurs here?
* **Update frequency** - How often does data refresh?
* **Dependencies** - What other systems does this layer rely on?

## Step 3: Interview the right people

**Target layer (business users):**

* “What reports/dashboards do you rely on?”
* “How do you know if the data is wrong?”
* “What happens when this data is unavailable?”

**Processing layers (data engineers/analysts):**

* “Where does this data come from?”
* “What transformations do you apply?”
* “What are the most common data quality issues?”
* “How long does it take data to flow through your system?”

**Source layers (system owners):**

* “What triggers data updates in your system?”
* “How is data entered or collected?”
* “What validation happens at entry?”

## Step 4: Validate the complete thread (right to left)

Once you’ve mapped the full lineage backwards and laid it out spatially, validate the complete data flow from left (sources) to right (targets):

* **End-to-end path** - is the full data flow from source to target captured?

## Tips for effective “look left” execution

*Start small and expand*

* **Begin with one critical report** (place on right side) rather than trying to map everything
* **Focus on high-value, high-risk data flows** first
* **Build incrementally** and validate at each step
* **Maintain consistent visual layout** as you expand the model

*Use Solidatus features effectively*

* **Properties** to capture metadata about each system and transformation
* **Reference relationships** to link technical lineage to business glossaries and terms
* **Display rules** to highlight critical paths and quality issues
* **Filters** to isolate specific entities and flows
* **Automapping** can be used to add lineage connections between Attributes
