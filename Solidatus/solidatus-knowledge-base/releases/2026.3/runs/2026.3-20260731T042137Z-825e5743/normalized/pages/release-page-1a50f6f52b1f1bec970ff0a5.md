# Features

## Temporary tables

If SQL parsing is enabled, the connector is able to correctly produce lineage if a temporary table is used in a SQL script or procedure.

```tsql
CREATE TABLE #TempTable ...
```

Lineage related to a temporary table will be displayed as transitions from source to target based on the permanent tables used in the query.

## Temporary Table Representation

If SQL is parsed, temporary tables can be represented in the model similarly to a normal table. These can be distinguished by their `TABLE_TYPE` property being equal to `TEMP_TABLE`.

Temporary Table entity

If a procedure creates a temporary table, the temporary table will be found in the same schema that the originating procedure belongs to.

If a temporary table is marked as a global temporary table such as:

```sqlserver
  CREATE TABLE ##temp1 
    (c1 INT);
```

then the temporary table will be contained in its own Solidatus layer named `GLOBAL_TEMP_TABLES`.

Temporary Table entity
