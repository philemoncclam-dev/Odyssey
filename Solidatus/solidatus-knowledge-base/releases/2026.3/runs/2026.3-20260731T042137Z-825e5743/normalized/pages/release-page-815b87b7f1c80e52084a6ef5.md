# Features

## Nested structures

BigQuery supports nested and repeated fields as columns in a table. The connector is able to automatically parse and process these columns and represent them in the model as nested groups.

Entity representation of nested structures

Entity representation of multiple nested structures

Nested and array structures contain unique properties which can be used to differentiate normal columns from nested columns. For the top-level nested structure the property `TYPE_NAME` with value `STRUCT` or `ARRAY` is added. Fields that are nested multiple times, have the property `TYPE_NAME` with value which is the BigQuery record structure. Along with this fields inside the nested structure contain a property `FIELD_PATH` with value NESTED\_STRUCT.FIELD.

## Script Lineage

Unlike most of the databases supported by the JDBC connector, BigQuery procedure source code is not pulled from a BigQuery instance. Instead, the source code must be provided as SQL files using the `solidatus.jdbc.sql-directory` config option. For more information on SQL parsing using this option, please see [Parsing SQL from Files](/connectors/connector-specific-documentation/solidatus-jdbc-connectors/sqlparsing#Parsing-SQL-from-Files).

## DDL Extraction

When parsing SQL through script files in the connector a further configuration option `solidatus.jdbc.extractDDL`. This configuration option will fetch the DDL of `CREATE TABLE` statements used for the tables extracted in the connector. This is useful to correctly parse scripts containing `SELECT * FROM` where the structure of the tables are not immediately obvious. If this configuration option is not enabled, DDL should be provided in the same folder as the scripts to parse.

## Batch processing SQL files

The connector supports batch processing of SQL files. This option is only available if processing SQL files through `solidatus.jdbc.sql-directory`. This is useful for parsing large numbers of SQL files for a single model, if encountering out of memory exceptions (`java.lang.OutOfMemoryError`). To enable this feature set `solidatus.jdbc.sqlBatching.processInBatches` to `true`. This will process SQL files in batches of 100 files at a time. This can be configured by setting `solidatus.jdbc.sqlBatching.batchSize` to the desired batch size. Consistent parsing relies on the assumption that SQL files are distinct and do not reference each other.
