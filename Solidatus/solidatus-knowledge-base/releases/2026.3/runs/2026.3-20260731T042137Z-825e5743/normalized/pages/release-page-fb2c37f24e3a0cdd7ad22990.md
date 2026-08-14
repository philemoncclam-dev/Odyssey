# SQL Derivations

Enabling the `solidatus.jdbc.sql-derivations` configuration option will insert SQL derivation logic into the Solidatus model. This feature can be enabled if the selected `JDBC driver` is BigQuery, Oracle, SQLServer or AzureSQL; `simple-procedure-summary` is set to false and `sql-parsing` is enabled.

The `sql-derivations` configuration adds a SQL derivation property to columns and objects used in Tables, Views, and Procedures.

This property contains the derived SQL code used in a statement.

## Stored Procedures

For procedure objects this results in column-level SQL derivation text as an attribute property for each `Target` column model attribute.

For the following simple script the following derivations are as follows:

```bigquery
INSERT INTO ` JDBC_test.Orders `
SELECT *
FROM (SELECT SAFE_CAST(NULL AS INT64)                                       AS ORDERNUMBER,
             SAFE_CAST(NULL AS INT64)                                       AS CUSTOMERNUMBER,
             SAFE_CAST(NULL AS INT64),
             SAFE_CAST(NULL AS DATE)                                        AS ORDERDATE,
             SAFE_CAST(CASE WHEN 1 > 2 THEN true ELSE false END AS boolean) AS ORDERCOMPLETE,
      WHERE FALSE);
```

which is represented in the model as:

Script object

#### Column Level

Column level derivations are added as a property `SOL.sqlDerivation` on the target column inside a procedure/script object.

Column level derivation properties for column &#x60;ORDERCOMPLETE&#x60;

#### Table Level

Table level derivation are added as a property on the INSERT/UPDATE group entity that contains the source and targets. There can be multiple table level derivations for a single script object. They are added to the `SOL.sqlDerivation{X}` property.

Table level derivation properties

## Views

For view objects this results in column-level SQL derivation text as an attribute property for each column model attribute.

Below is a view derivation example:

View object

#### Table Level

Table level derivations of the FROM clause are not currently supported.

#### Column Level

Column level derivations are added as a property group named `SOL.sqlDerivation` on the view column object. When a view column value is the result of an expression, each source column referenced in the expression will result in a sql derivation property with a text value representing the expression.

In the example above, the column `LONG_TERM_RATING` is the result of a `CASE` expression which uses 2 column sources `CR_RAY_MY_PARAMETERS.TARGET_VALUE_1` and `STG_MBB_MY_ISS_CR_RT.LONG_TERM_RATING`; This results in 2 children of `SOL.sqlDerivation` group, each child representing each source. As the column is given an alias in the sql, the alias `"LONG_TERM_RATING"` is displayed as a sibling of the derivation expression text.
