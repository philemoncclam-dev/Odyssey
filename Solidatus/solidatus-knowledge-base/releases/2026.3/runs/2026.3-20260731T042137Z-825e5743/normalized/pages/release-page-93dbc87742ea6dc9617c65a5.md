# Capabilities and limitations

The Solidatus Databricks Connector provides the following capabilities:

## Metadata Extraction

* Extracts catalogs, schemas, and tables from Databricks Unity Catalog.
* Supports filtering by specific schemas and jobs.

## Data Lineage

* Builds end-to-end lineage models from Databricks sources.
* Optionally includes Databricks jobs as a lineage layer.
* Visualizes data flows between tables, schemas, and jobs in Solidatus.

## Job Integration

* Retrieves and maps Databricks jobs, including job names and relationships.
* Allows filtering by specific jobs to include in the lineage.

## Model Publishing

* Publishes lineage models directly to Solidatus via the Solidatus API.
* Supports model updates.

## Configuration Flexibility

* Can be run in both agent and standalone modes.
* Supports configuration via YAML, environment variables, or command-line arguments.
* Allows granular control over which metadata and jobs are included.

## Security & Compliance

* Connects securely using Databricks personal access tokens or OAuth client credentials (service principal).
* Supports SSL verification for Solidatus API connections.

## Supported Databricks Features

* Unity Catalog (required for full metadata extraction)
* Databricks jobs (optional, for job lineage)
* Databricks Runtime 11.3 LTS or above for streaming lineage (if applicable)

## Limitations

* Only supports Unity Catalog-enabled workspaces.
* Does not extract notebook code or non-Unity Catalog assets.
