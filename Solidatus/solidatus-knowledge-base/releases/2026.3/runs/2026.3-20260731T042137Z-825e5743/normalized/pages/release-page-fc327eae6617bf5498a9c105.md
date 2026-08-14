# Solidatus AI Assistant

{% hint style="info" %}
The AI Assistant is under active development. Your feedback is valuable—please share it with your customer success manager.
{% endhint %}

The Solidatus AI Assistant is a comprehensive AI-powered tool for building and analysing models. It combines agent and chat functions, allowing you to get detailed answers to your questions and make specific changes using conversational requests.

The user-friendly, familiar AI chat interface is built into the Model Viewer sidebar, and the assistant can access all data stored in the open model. You can work confidently using built-in transparency and review tools, giving you complete control before committing any changes.

<figure><figcaption></figcaption></figure>

{% hint style="success" %}
Customers can choose their own LLM provider when deploying the AI Assistant in their own environments. Our Solidatus preview environment uses supported Google Gemini models.
{% endhint %}

### What the assistant can do

* **Read and analyse:** Summarise models, explain lineage and entity relationships, identify upstream dependencies and downstream impacts
* **Query:** Build queries from natural language descriptions
* **Create and edit:** Add/remove entities, modify properties, perform bulk editing operations
* **Navigate:** Trace lineage, expand/collapse entities
* **Visualise**: Create and apply display rules and filters
* **Import/export:** Build from external file content (images, diagrams, PDFs, CSV, JSON, HTML, code), export CSV tables
* **Work with reference models:** Load and explain Reference models, create and edit reference relationships

### Workflow features

The AI Assistant includes several workflow features that make longer-running analysis easier to manage.

* **Conversation History:** Previous sessions are stored by recency, so you can search, rename, delete, and resume them from the assistant panel.
* **Chat Rollup:** When a conversation reaches its context limit, the assistant creates a concise rollup and offers a fresh chat with working context carried forward.
* **Quick Actions:** The assistant can suggest contextual next steps that run in one click. You can also queue a follow-up message while a response is still generating.
* **Prompt Library:** Save and reuse prompts, scope them to a model or all sessions, and auto-include key prompts so the right context is supplied in every chat.

### What the assistant cannot do (yet)

* Create forks
* Import or export entire models
* Import and link to content from other models
* Generate or export grid reports
* Undo operations through the AI chat (use the undo button in the toolbar or [revert to a checkpoint ](#review-results)in the chat history)
* Create views or apply existing view&#x73;**\***
* Modify permissions or sharing settings
* Access external systems or databases

**\***&#x57;hile the assistant cannot create or apply existing views directly, it can reference them in a response and referenced views can be selected to enable or disable them.

## LLM deployment options

There are two paths for deploying the underlying LLM:

* Customers can bring their own LLM. The customer procures, manages, and monitors the model and agrees data privacy and security policy directly with LLM provider. Solidatus connects to it using an API URL and key.
* For SaaS customers, Solidatus can provide a managed LLM via Google Vertex AI. Strict tenant isolation is enforced. Each customer site operates as an isolated tenant with separate credentials, meaning LLM traffic is never shared.

## Technical overview

### MCP support

Solidatus exposes an MCP server for customers using AI-powered tooling around the platform.

This allows compatible external tools and AI agents to read and write model data through the Model Context Protocol.

Availability depends on your environment. Contact your Account Manager if you need access to Solidatus MCP.

### Configuration requirements

#### Supported models

Several models are supported out of the box.

* **Google Gemini (Vertex AI)**: 3.1 Pro, 3.5 Flash
* **OpenAI (incl. Azure AI Foundry)**: GPT-5.5, GPT-5.4, GPT-5.4 mini
* **Anthropic**: Claude Opus 4.8, Claude Sonnet 5 *(in testing)*

We recommend the fast models: **Gemini 3.5 Flash**, **GPT-5.4 mini**, and **Claude Sonnet 5**.

They match the flagships on most tasks at lower cost and latency. Choose a flagship only for the hardest reasoning.

**GPT-5.4 mini** holds less conversation history than the others, so it can lose earlier context in long chats or when working with large documents.

Connections can also be made to any provider exposing an OpenAI-compatible API. This works well for self-hosted models or third-party providers implementing the specification. However, your mileage may vary when using an LLM not tested by the Solidatus team.

#### Required credentials

Each setup requires specific credentials depending on the chosen provider:

* **Google Gemini (AI Studio):** API Key
* **Google Vertex AI:** Location, Project ID, Client Email, and Private Key (requires Vertex AI User role)
* **OpenAI / Azure AI Foundry:** API Key
* **OpenAI-Compatible APIs:** Base URL, Model identifier, API Key (optional), and Custom API Header (defaults to `api-key`)

If the network setup uses IP whitelisting, the Solidatus IP address must be whitelisted to allow the connection.

### Information security and data privacy

**What data is shared:**

* User input prompts and model data are sent to the Large Language Model (LLM) provider (in the case of our preview environment, this is Google). Solidatus does not use customer inputs, prompts, responses, or model metadata to train the underlying models.

**Data retention:**

* The AI Assistant now features persistent conversation history. Conversations are stored across browser sessions, allowing you to pick up where you left off. Conversations are automatically organised by recency in the assistant panel, and can be searched, renamed, or deleted at any time.
* Conversation history is configurable and can be disabled by an administrator. If disabled, chat history will only be retained for the duration of the browser session and will be cleared when the model is refreshed or chats are closed.

**Information security**

* Information security considerations relating to the use of the AI Assistant should be raised directly with the LLM provider (e.g., Google or Azure/OpenAI).

### Feature enablement

Administrators can enable or disable the AI Assistant globally per environment. Access can also be provisioned on a per-user basis. Once a user has the assistant enabled, they can use it across all models they have permission to view; it cannot be toggled on a per-model basis.

### Model access and permissions

The AI Assistant has the same level of access to models (both Lineage and Reference) as the user account in which it is used.

This means:

* If you only have **Viewer** access to a model, the AI Assistant is not able to edit or update the model. It can answer questions, analyse the model, and create and apply new display rules and filters, but these are not saved beyond the current browser session.
* If you have **Owner** or **Author** access to a model, the AI Assistant can edit it and save changes. However, even if you have **Owner** access, the assistant cannot share the model or modify existing access permissions.

### **Built-in hallucination detection**

Before running any action, the browser checks that anything the AI refers to (like entities, assets, or display rules) actually exists in the model data and metadata it has loaded.

If something doesn’t match (i.e., it doesn't exist in the model), it’s flagged and fixed locally before any tool is executed, helping prevent incorrect actions. The Solidatus application also keeps context tightly limited, sending only the metadata needed for the current task.

## Performance and best practices

The AI Assistant handles concurrent workloads using the same methods as the core application. If the external LLM becomes rate-limited or slow, the assistant will reflect those constraints.

**Optimal performance:**

* Small models: 100K-200K entities
* Performance can slow down with models over 500K entities

**Token and context limits:**

* Context window limit: 1 million tokens (approximately 5 average-length English novels)
* When a conversation reaches its context limit, the assistant automatically generates a Chat Rollup - a concise summary of the session - and prompts you to start a new conversation with full context carried over.
