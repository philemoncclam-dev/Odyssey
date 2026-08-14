# Cross Database SQL Parsing

The Snowflake Multiple Database Connector is used in conjunction with the Snowflake Connector to link up multiple database models and add missing cross-database lineage from SQL parsing.

## Pre-requisites

The Snowflake Connector input model must have been executed using the `--solidatus.jdbc.createSqlProxyObjects` flag to create the SQL parsing objects. These objects are required to link the proxy entities to the entities in a different database model. These entities will contain a property `SOL.isProxy` with a value of `true`, and a recreated `SOL.UID` property which references the expected entity in a different database.

When running the Snowflake Multiple Database Connector, the `--solidatus.snowflake.resolveProxyEntities` flag must be set to `true` to enable the proxy resolution feature.

## How it works

The Snowflake Multiple Database Connector will combine the individual Snowflake connector database models into a single model and attempt to stitch them together using existing entities in the model. The SQL parsing lineage will be created by linking proxy entities to their source. If the `--solidatus.jdbc.createSqlProxyObjects` is set and cross-database views or procedures are found, then the Solidatus Snowflake connector will create a proxy entity in the model as a placeholder and create a transition to it. This entity will contain a property `SOL.isProxy` with a value of `true` to denote that it is a proxy entity.

When the Solidatus Snowflake Multiple Database Connector is executed these proxy entities and the `SOL.UID` property stored on it will be used to search for a non-proxy entity with the same `SOL.UID` in the other database models. If a match is found, a transition will be created between the proxy entity and the non-proxy entity. This will create the cross-database lineage and allowing viewing of lineage between databases created through SQL views or procedures.

## Example Model

In this example we will show examples for the following scenarios:

* Missing view sources
* Missing procedure targets

### Missing view sources

The following image shows a view definition where the source table is missing from the model. The proxy entity is created to represent the missing source. The direction of the lineage indicates the view as the target and the proxy entity as the source.

<figure><figcaption></figcaption></figure>

View definition:

```snowflake
create or replace view COVID19_PROCESSED.PUBLIC.META_TIME(
	COUNTRY_REGION,
	CASES_TOTAL,
	DEATHS_TOTAL,
	TRANSMISSION_CLASSIFICATION,
	DATE,
	ISO3166_1,
	SOURCE
) as
SELECT
mt.COUNTRY_REGION as COUNTRY_REGION,
mt.CASES_TOTAL as CASES_TOTAL,
mt.DEATHS_TOTAL as DEATHS_TOTAL,
mt.TRANSMISSION_CLASSIFICATION as TRANSMISSION_CLASSIFICATION, 
mt.DATE as DATE,
mt.ISO3166_1 as ISO3166_1,
mt.source as SOURCE
FROM
COVID19_STAGE.PUBLIC.META_TIME mt
;
```

From the definition we can see the view is created in the COVID19\_PROCESSED database in the PUBLIC schema and refers to the COVID19\_STAGE database in the PUBLIC schema. The COVID19\_STAGE database table entity is missing from the model and therefore the view source is missing. The proxy entity is created to represent the missing source as a placeholder in the original Snowflake connector generated model.

<figure><figcaption><p>Snowflake composite model of view connected to real table</p></figcaption></figure>

When the Snowflake Multiple Database Connector is run with both source database models (COVID19\_PROCESSED and COVID19\_STAGE), the proxy entity META\_TIME is resolved to the real table view source in the COVID19\_STAGE database. The transition is created between the view and the table entity in both directions. This is to ensure that whether the proxy object is a source/target or both that the trace capability in the model viewer functions correctly.

### Missing procedure targets

The following image shows a procedure definition where the target table is missing from the model. The proxy entity is created to represent the missing target.

<figure><figcaption></figcaption></figure>

Procedure definition:

```snowflake
CREATE OR REPLACE PROCEDURE COVID19_STAGE.PUBLIC.MOVE_NYT_HEALTH_PROCESSED()
RETURNS NUMBER(38,0)
LANGUAGE SQL
EXECUTE AS OWNER
AS '
INSERT INTO COVID19_PROCESSED.PUBLIC.NYC_HEALTH_TESTS
(
MODIFIED_ZCTA,
COVID_CASE_COUNT,
TOTAL_COVID_TESTS,
PERCENT_POSITIVE,
DATE,
FIPS,
COUNTRY_REGION,
ISO3166_1,
ISO3166_2,
LAST_UPDATED_DATE,
LAST_REPORTED_DATE
)
SELECT 
MODIFIED_ZCTA,
COVID_CASE_COUNT,
TOTAL_COVID_TESTS,
PERCENT_POSITIVE,
DATE,
FIPS,
COUNTRY_REGION,
ISO3166_1,
ISO3166_2,
LAST_UPDATED_DATE,
LAST_REPORTED_DATE
FROM
COVID19_STAGE.PUBLIC.NYC_HEALTH_TESTS;
';
```

The procedure definition describes an INSERT INTO statement with target in COVID19\_PROCESSED from COVID19\_STAGE. The target table entity is in another database and therefore is missing from the model. The proxy entity is created as a placeholder in the original Snowflake connector generated model.

<figure><figcaption><p>Snowflake model of procedure with stitched target</p></figcaption></figure>

When the Snowflake Multiple Database Connector is run with both source database models (COVID19\_PROCESSED and COVID19\_STAGE), the proxy entity NYT\_HEALTH\_TESTS is resolved to the real table entity in the COVID19\_PROCESSED database. The transition is between the proxy table and real table entity in both directions.

### Properties

<figure><figcaption><p>Transition property on proxy lineage</p></figcaption></figure>

All transitions created from proxy entity resolution will contain the `SOL.isProxy` transition with value `true`.
