# Script Lineage

Some dialects supported by the JDBC connector don't pull source code directly from the database instance. Instead, the source code must be provided as SQL files using the `solidatus.jdbc.sql-directory` config option. At the moment under the `solidatus.jdbc.dialect` field, this affects the `sybaseASE`, `sybaseIQ` and `bigquery` dialects. For more information on SQL parsing using this option, please see [Parsing SQL from Files](https://github.com/solidatus/Solidatus-docs-gitbook/tree/stable/solidatus-core/connectors/solidatus-connectors/sqlParsing.md#Parsing-SQL-from-Files).
