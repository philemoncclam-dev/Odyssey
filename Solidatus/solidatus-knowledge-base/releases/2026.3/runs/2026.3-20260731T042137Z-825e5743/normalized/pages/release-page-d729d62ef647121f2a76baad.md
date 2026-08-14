# Prompt library and tips

This page covers two things: how to use the in-app Prompt Library to create, store, and manage reusable prompts; and best practice guidance for writing effective prompts for the AI Assistant.

You can use the table of contents along the right to jump to the topic that interests you.

### The Prompt Library

The Prompt Library is a built-in feature of the AI Assistant that lets you create, store, and manage reusable prompts directly within the panel. Rather than retyping the same analytical prompts each time, you can build a library of your most useful prompts and access them instantly across any model session.

Open the Prompt Library from the assistant panel using the library icon. From there you can create new prompts, browse your saved prompts, and apply them to the current conversation.

When creating a prompt, you can configure the following options:

<figure><figcaption></figcaption></figure>

* Scope: Set the prompt to apply to this model, or to your personal library.
* Type: Tag the prompt as a knowledge prompt (providing context) or a prompt type (an instruction to execute).
* Auto-include: Toggle on to have the prompt automatically injected into every new conversation.

Prompts that are active in a session are shown in the chat box, so you can always see which prompts are in context. The example prompts listed further down this page are good candidates for saving to your Prompt Library.

<figure><figcaption><p>Manage shared model prompts and personal prompts from the Prompt Library.</p></figcaption></figure>

## Prompt engineering for the AI Assistant

The results you get from the AI Assistant depend on the instructions you give it and the context you supply. The AI Assistant works best when you provide direct, explicit instructions that contain three elements: **context (or scope)**, **action**, and **details**.

**Be clear and direct**

Perhaps the most important tip to get the results you want from the AI Assistant is to give instructions that are **clear and direct**. If you want the assistant to do something — for example, to go above and beyond on a certain task — make sure to state that explicitly.

**Provide necessary context**

Think of the assistant as very clever but inexperienced: it needs you to tell it exactly what you want and to give it necessary background information to understand the task. Imagine a junior colleague reading your prompt and ask yourself whether you've included enough information for them to understand and complete the task you requested.

**Plan ahead (with the assistant)**

Think ahead about what you want to achieve and what the success criteria are. You can even prompt the assistant to help you plan a complex task, think about success criteria, or breakdown a complex task into a sequence of prompts.

**Prompt for reviewable results**

Asking the agent to perform a large task all at once can make it more difficult to review and approve changes because there are so many.

If you want the assistant to make large scale changes to a model, it's best to break them down into smaller changes that are easier to review and approve before moving on.

**Use Solidatus terminology**

Use Solidatus terms for entities (Layer, Object, Group, Attribute, Transition) and model tools (e.g., display rules, filters, highlighted and focused trace, views, trace depth) to ensure the assistant does exactly what you want it to do. For a reference on key terms, see the [Solidatus glossary](/additional-resources/solidatus-glossary).

### Basic prompt formula

\[Context/Scope] + \[Action] + \[Specific Details]

| **Context/Scope** | Where should this happen? What background knowledge do I need? | "In the 'Data Processing' layer..."                           |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| **Action**        | What do you want to do?                                        | "...create a new transformation object..."                    |
| **Details**       | Specific names, types, or logic.                               | "...named 'Currency Conversion' with inputs for USD and EUR." |

### Prompt chaining

Chaining is a method that uses a series of related prompts to achieve a desired result.

Common examples of chaining are **role assignment** and **self-correction.** These are effective when using the AI Assistant.

**Role assignment**

Role assignment involves telling the agent to assume a role that fits the task you want it to carry out. For example, you can tell it: "You are a data governance expert assigned to audit our use of data according to BCBS239 principles".

You can make effective use of role assignment in two ways:

* Assign a **local** role in a prompt before asking the assistant to carry out a task.
* Save recurring instructions as a reusable prompt in the **Prompt Library** and set it to auto-include when needed. This keeps the guidance visible, easy to refine, and consistent across sessions.

**Self-correction**

Another common and useful chaining pattern is **self-correction**:

1. Ask the assistant to make changes to a model
2. Ask the assistant review those changes against specific criteria
3. Ask the assistant to refine based on the review.

## Basic model building and editing

You can instruct the AI to create structure, assign metadata, and draw lineage connections. This is significantly faster than manual entry for bulk tasks.

### **Create structure**

Instead of clicking through menus, describe the hierarchy you want to build.

* **Add Layers/Objects**: "Create a new Layer called 'Archive' and add an Object inside it called 'Legacy CRM'."
* **Bulk attribute creation**: "In the Customer Data Warehouse, add the following attributes: 'churn\_risk' (String), 'last\_login' (Date), and 'total\_spend' (Number)."
* **Cloning/templating**: "Create a new object 'European Billing' in Source Systems with the same attributes as the Billing API."

### **Define lineage**

The AI assistant can infer and create connections based on names or explicit instructions. The existing Model Viewer [Auto-mapper tool](/models/build-and-edit-models/automap-transitions) works best for string similarity in names and properties, but AI Assistant excels for semantic and hierarchy mapping.

* **Direct mapping**: "Connect the 'customer\_id' in CRM Database to the 'customer\_id' in Customer ETL."
* **Intelligent-mapping**: "Map all attributes from Marketing Platform to the Business glossary layer by finding the glossary term that matches the name, properties, and lineage of each attribute."

When using the AI Assistant to map entities in bulk, make sure the mapping criteria are as explicit as possible in the prompt.

### **Update properties in bulk**

Assign properties, edit property key and values, and change property types,

* **Tagging PII**: "Find all attributes with 'email' or 'phone' in their name and set the 'pii' property to 'true'."
* **Assigning ownership**: "Set the owner to 'Data Governance Team' for all objects in the Glossary layer."
* **Standardizing types**: "Update the property 'record\_count' to have the property type 'Number'. Check that every entity with the property 'record\_count' has a numerical value for the property."

## Basic governance and quality checks

Use the AI to enforce standards on your model.

* **Metadata quality scorecard**: "Score this model on quality of metadata. Check for standardised properties, normalised property values, and clean metadata. Give advice on how to remediate any issues you detect."
* **Gap analysis**: "Show me all attributes in Data Processing that do *not* have a description."
* **Orphan detection**: "Identify any objects in the Analytics Layer that have no incoming lineage (transitions)."
* **Rule validation**: "Check if all attributes marked as `pii: true` also have an owner assigned."

## Prompt examples for specific use cases

This section offers examples of strong prompts for specific use cases. You can use these for ideas or as templates. You can also copy and paste them into the AI Assistant chat, but make sure to replace any example values or missing values to fit your model and goal.

#### Model summary and analysis

> Perform a deep-dive analysis of this model and provide a structured report covering the following:
>
> 1. **Model Architecture:** Summarize the high-level purpose of the model based on its description and metadata. List the primary **Layers** and the number of **Objects** within each to establish the 'zones' of the data landscape.
> 2. **Core Lineage Flow:** Identify the 'Backbone' of the model. Trace the primary data flow from the initial **Source Layers** to the final **Target/Reporting Layers**. Highlight any significant 'bottleneck' objects that have a high number of both incoming and outgoing transitions.
> 3. **Metadata & Governance Profile:**
>    * Identify the most frequently used **Properties** (e.g., pii, data\_type, owner).
>    * Report on the distribution of sensitive data markers (like PII or Confidentiality).
>    * List the **Technologies** (technology) involved across the pipeline.
> 4. **Semantic Alignment:** Check for connections to **Reference Models** or **Glossaries**. Summarize how technical attributes are mapped to business terms and identify any layers that lack glossary coverage.
> 5. **Data Quality & Gaps:** Identify any 'Orphaned' objects (those with no incoming or outgoing transitions) and any entities missing critical metadata like description or owner.

#### Glossary mapping and creation

> I want to establish a business semantic layer for this model. Please execute the following workflow:
>
> 1. **Domain Discovery:** Analyze the **Layer** and **Object** names to identify the top 5-10 core business domains represented by entities in the model (e.g., 'Customer', 'Product', 'Transaction').
> 2. **Glossary Creation:**
>    * Create a new Layer named 'Business Glossary'.
>    * Populate it with a hierarchy of **Terms** based on the domains identified in Step 1.
>    * Add a definition placeholder for each term.
> 3. **Automated Mapping:** For each **Term** in the new glossary, use a query to find matching **Attributes** in the lineage model.
>    * *Logic:* Match if the Attribute name contains the Term name. Use the hierarchy path to disambiguate Attributes with the same name. Compare descriptions and technical properties of Attributes and Terms.
> 4. **Coverage Report:** Provide a table showing the mapping results:
>
>    | Glossary Term | Count of Linked Attributes | Mapping Logic Used |
>    | ------------- | -------------------------- | ------------------ |
> 5. **Semantic Visualization:** Create a **Display Rule** that shows the linked term as a tag on each attribute so I can see the business context in real-time.

#### Governance: BCBS 239

> Execute queries against this model to do a comprehensive controls gap analysis according to the BCBS239/RDARR policy and guidelines.

#### Build from SQL code

> Create a model based on the following DDL and stored procedure:
>
> **1. Hierarchy & Structure:**
>
> * **Layer 1 (Physical Schema):** Place all tables and views here.
> * **Layer 2 (Logic Layer):** Place all stored procedures here.
> * **Procedure Modeling:** For each procedure, create two **Groups** named 'Inputs' and 'Outputs'. Place the respective parameters/fields as **Attributes** within these groups.
>
> **2. Lineage Requirements:**
>
> * **Column-Level Only:** Define transitions exclusively at the Attribute level.
> * **The 'Three-Hop' Rule:** Lineage must follow this exact path: `Source Table Attribute` → `Procedure Input Attribute` → `Procedure Output Attribute` → `Target Table Attribute`.
> * **No Direct Mapping:** Never create transitions directly between two physical tables.
>
> **3. Metadata Enrichment:**
>
> * **Properties:** Include data\_type, description (inferred from context), and Transformation (for procedure output attributes).
> * **Ownership:** Assign 'David Smith' as the Data Owner for all schema objects.
> * **PII Assessment:** Evaluate fields for PII risk (e.g., names, emails, IDs). If risk is found, set PII Risk: `High` or `Medium`.
>
> **4. Visualization:**
>
> * Create a **Display Rule** to show the `PII Risk` as a tag on the **left** of attributes, prefixed with 'PII: '.
> * Create a **Display Rule** to show the `data_type` as a tag on the **right** of attributes.
>
> **\[INSERT DDL AND SQL HERE]**

#### Model an ER diagram or other data model

> Analyse the attached ER diagram and translate it into a structured Solidatus lineage model by following these steps:
>
> 1. **Structural Mapping:**
>    * Create a **Layer** named 'Logical Data Model'.
>    * For every entity (table) in the diagram, create an **Object** within this layer.
>    * For every field (column) within an entity, create an **Attribute** within the corresponding object.
> 2. **Lineage & Relationships:**
>    * Identify all **Primary Key (PK)** to **Foreign Key (FK)** relationships.
>    * Create a **Transition** from the PK Attribute to the FK Attribute to represent the data dependency.
>    * If the diagram shows many-to-many relationships via a join table, ensure the lineage flows through the join table attributes.
> 3. **Metadata Enrichment:**
>    * **Properties:** For each attribute, include data\_type and nullability as shown in the diagram.
>    * **Key Identification:** Add a key\_type: `PK` or `FK` to the relevant attributes.
>    * **Descriptions:** Provide a brief description for each object and attribute, inferring the business purpose from the names and relationships.
> 4. **Governance & Risk:**
>    * Identify potential **PII** (e.g., names, addresses, tax IDs). For these attributes, set pii: true.
> 5. **Visualization:**
>    * Create a **Display Rule** that adds a '🔑' tag to the **left** of any attribute where `key_type` is 'PK'.
>    * Create a **Display Rule** that adds a '🔗' tag to the **left** of any attribute where `key_type` is 'FK'.
>    * Create a **Display Rule** that highlights attributes with `pii=true` in a distinct colour (e.g., red text or background)."

#### Auto-mapping using the AI Assistant

> "I need to auto-map the lineage between **Layer A** and **Layer B** using a multi-criteria semantic approach. Please execute the following logic:
>
> 1. **Candidate Selection:** Identify all **Attributes** in the 'Source' and 'Target' layers that are currently unmapped (i.e., have no outgoing/incoming transitions).
> 2. **Matching Logic:** Create a **Transition** between a Source Attribute and a Target Attribute ONLY if they meet **at least two** of the following criteria:
>    * **Technical Alignment:** They share the exact same data\_type (e.g., `varchar(255)` to `varchar(255)`).
>    * **Semantic Alignment:** Both attributes are linked to the same **Business Glossary Term**.
>    * **Metadata Alignment:** They share common properties and values.
>    * **Contextual Alignment:** The parent **Object** names are identical, even if the attribute names differ (e.g., `Customer_Table.ID` to `Customer_Table.Cust_Num`).
> 3. **Conflict Resolution:** If a Source Attribute matches multiple Target Attributes, do not create the transition. Instead, list these 'Ambiguous Matches' in a table for my review.
> 4. **Execution & Reporting:**
>    * Create the transitions for all 'High Confidence' matches.
>    * Provide a summary table:
>
>      | Source Attribute | Target Attribute | Matching Criteria Met | Confidence Level |
>      | ---------------- | ---------------- | --------------------- | ---------------- |
> 5. **Visual Validation:** Create a **Display Rule** that styles these new transitions in a specific colour (e.g., dashed blue lines) so I can distinguish them from existing manual mappings."
