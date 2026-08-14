# Features

## SQL Proxy Objects for External Tables

External tables in AzureSQL can be integrated into composite models by enabling proxy mode and applying the new `SOL.UID strategy`.

When SQL parsing is enabled and the dialect is set to AzureSQL, external table entities will automatically be converted into proxy objects. This conversion allows these entities to connect to the actual external resources when combining atomic models into a composite model, ensuring accurate representation of cross-database data lineage.

This feature is useful for ensuring that external resources are properly referenced and integrated within complex models.

To enable this feature, the following configuration is required:

* `--solidatus.jdbc.driver` is `sqlserver`
* `--solidatus.jdbc.sql-parsing` is true and `--solidatus.jdbc.dialect` is `azuresql`
* `--solidatus.jdbc.experimental-features.sol-path-v2` is true
* `--solidatus.jdbc.create-sql-proxy-objects` is true

If the configuration differs from the above, the external table entities will remain as standard table entities.
