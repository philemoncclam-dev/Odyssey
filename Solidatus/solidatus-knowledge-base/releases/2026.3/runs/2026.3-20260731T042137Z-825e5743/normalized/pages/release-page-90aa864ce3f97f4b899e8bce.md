# SQL Parsing

With use of the SQL Parser, the JDBC Connector is able to separate views and procedures from the main schema, into its own layer, and display lineage between tables.

Currently, in order to make use of this functionality, four extra configuration options must be passed to the Connector:

* `solidatus.jdbc.sql-parsing`
* `solidatus.jdbc.default-schema`
* `solidatus.jdbc.dialect`
* `solidatus.jdbc.sql-directory` (if parsing files rather than procedures).

The details of these configurations are listed in the full configuration options section.

Available dialects:

* `azuresql`
* `bigquery`
* `db2`
* `hive`
* `impala`
* `mysql`
* `oracle`
* `postgresql`
* `redshift`
* `snowflake`
* `sparksql`
* `sqlserver`
* `sybase`
* `teradata`

Note that usually, the above dialects will match with the chosen JDBC driver, but other dialects must have a driver provided as per the custom drivers section. If this additional functionality fails for whatever reason, it will skip this, and the JDBC Connector's default functionality will remain.

Please keep in mind that the JDBC Connector can encounter errors parsing edge-case SQL or SQL written without best practice in mind. Should this occur, please raise this as a support ticket and the Solidatus Connectors team will schedule this work at earliest convenience.

## Views

In SQL, a view is a virtual table based off the result of a SQL statement. This can be represented as lineage in a Solidatus model; as metadata can be described as flowing from one table column to be represented in another. When parsing **View** lineage the Connector will parse the **View** definition retrieved and create direct transitions between the parsed view and table that is referenced.

The example SQL below shows a view definition that can exist within a database. The view `emp_details_view` selects from several tables `employees`, `departments`, `jobs`, `locations`, `countries` and `regions`; transitions are drawn between table columns that the view selects from. The `WHERE` clause will not affect the generated output as the Connector does not account for conditional dependencies.

### Example SQL

```oracle
create view emp_details_view as
SELECT e.employee_id,
       e.job_id,
       e.manager_id,
       e.department_id,
       e.first_name,
       e.last_name,
       e.salary,
       e.commission_pct,
       d.department_name,
       d.location_id,
       l.country_id,
       l.city,
       l.state_province,
       j.job_title,
       c.country_name,
       r.region_name
FROM employees e,
     departments d,
     jobs j,
     locations l,
     countries c,
     regions r
WHERE
...
```

This is represented in the model as shown:

View lineage from EMP_DETAILS_VIEW to a number of tables

View lineage transitions contain the following unique properties:

* CreatedBy: the name of the view which relates to the transitions
* CreatedFrom: `view`
* SOL.transitionType: VIEW or SQL\_PARSING (for procedures/scripts)

View lineage transition properties

## Parsing SQL from Procedures

Lineage from procedures is represented in its own layer `SCHEMA.PROCEDURES`. Procedures are represented as Solidatus objects containing source and targets which have transitions linking to the original extracted columns.

Procedure lineage of HR.emp_dump_by_location

The procedure `HR.emp_dump_by_location` is a simple `INSERT INTO SELECT FROM` SQL statement that shows lineage from `EMPLOYEES` to `EMPLOYEE_DUMP`.

### Simple Procedure Summary

If running SQL parsing with `solidatus.jdbc.simple-procedure-summary=false` then the procedure structure is represented differently. Statements inside a procedure/script are grouped and presented as individual source and target relations. They are labelled as either `INSERT` or `UPDATE` depending on the content of the SQL.

Non simple procedure summary lineage of HR.emp_dump_by_location

### Procedure filtering

When running the Connector there are two ways to provide procedure filtering to ensure only the relevant procedures show up in the model. This can help improve execution time and reduce memory issues. Setting `solidatus.jdbc.procedure-pattern` will ensure only certain procedures are included in the model. This must be provided as a list formatted as `{SCHEMA}.{PROCEDURE_NAME}`.

Alternatively using the exclusion filter options allow the Connector to remove certain procedures using pattern matching. Setting `solidatus.jdbc.exclusion-filter.procedure-pattern` removes chosen procedures from the model. This can be useful when removing system related procedures. Exclusion filters are provided as a list of procedure names, this can be used with wildcard values as well (`EMP_*`). This will remove all procedures starting with `EMP_`.

## Parsing SQL from Files

As an alternative to parsing SQL lineage from procedures the Connector is able to read local SQL scripts and display lineage. Scripts can be provided through the `solidatus.jdbc.sql-directory` configuration options.

Lineage from procedures is represented in its own layer `SCHEMA.FILES`. The structure produced is the same as procedures however the object name is the filename parsed.

Files lineage of script hr_derivations.sql

If scripts provided contain `SELECT *` references, `CREATE TABLE` DDL should be provided in the same directory for the tables referenced in the scripts.

## Example SQL parsing configuration

```bash
java -jar solidatus-jdbc-connectors.jar \
--spring.profiles.active="standalone" \
--solidatus.jdbc.driver="oracle12" \
--solidatus.jdbc.url={JDBC_URL} \
--solidatus.jdbc.username={JDBC_USERNAME} \
--solidatus.jdbc.password={JDBC_PASSWORD} \
--solidatus.jdbc.schema-pattern="HR"  \
--solidatus.jdbc.simple-procedure-summary=true \
--solidatus.jdbc.sql-parsing=true \
--solidatus.jdbc.dialect="oracle" \
--solidatus.api.host={SOLIDATUS_HOST} \
--solidatus.api.token={SOLIDATUS_TOKEN} \
--solidatus.api.model-name="Oracle HR Lineage"
```

## SQL Proxy Objects

The following option is now available to enable SQL Proxy Objects: `--solidatus.jdbc.createSqlProxyObjects`.

When parsing SQL, if the connector encounters a table that is not present in the database schema, a proxy/placeholder object will be created.

Lineage is derived from the SQL files provided or extracted from the database through views and procedures. This lineage is applied to the metadata structure model of the database. If the extracted database structure does not contain either the source or target column then a proxy object is created to represent the missing column. This allows the lineage to be represented in the model even if the column is not present. Proxy objects will be generated recursively for a missing column's parent structures (i.e. its table and schema).

This entity will contain a property `SOL.isProxy` with a value of `true` to denote that it is a proxy entity.

This feature can be used to calculate cross-database views and procedures as well as providing lineage for missing tables and columns.

When utilizing this feature, it is advisable to set `--solidatus.jdbc.experimental-features.sol-path-v2` to true. By employing this `SOL.path` strategy, tables located in different databases that have identical schema names and table names can be accurately identified, thereby ensuring the generation of correct cross-database lineage.

Please note that, at present, the new SOL.UID strategy is only available for `snowflake`, `sqlserver`, and `azuresql`.

### Example view

As an example we consider the following view definition:

```sql
create or replace view COVID19.PUBLIC.CDC_TOTAL_BEDS
            (
             STATE,
             ALL_TOTAL_INPATIENT_BEDS,
             COVID_19_TOTAL_INPATIENT_BEDS,
             ICD_TOTAL_BEDS
                )
as
SELECT beds.STATE,
       beds.TOTAL_INPATIENT_BEDS   AS ALL_TOTAL_INPATIENT_BEDS,
       beds.TOTAL_INPATIENT_BEDS   AS COVID_19_TOTAL_INPATIENT_BEDS,
       beds.TOTAL_STAFFED_ICU_BEDS AS ICD_TOTAL_BEDS
FROM COVID19_REPORT.TRANSFORM.CDC_INPATIENT_BEDS_ALL beds
```

This view represents taking certain columns from `COVID19_REPORT.TRANSFORM.CDC_INPATIENT_BEDS_ALL`. The view is stored in the database `COVID19` but references a table in another database `COVID19_REPORT`. When running the connector against the database `COVID19` database this view would be extracted. However, without the proxy objects implementation this cross-database view would be empty and without lineage as there is no source entity `COVID19_REPORT.TRANSFORM.CDC_INPATIENT_BEDS_ALL` in the extracted model for this database.

With `--solidatus.jdbc.createSqlProxyObjects` enabled, instead of this view not having any lineage, the requisite missing entities will be created and labelled as proxies in the model.

Cross database view lineage using proxy objects

In the screenshot we can see the table `CDC_INPATIENT_BEDS_ALL` under the `COVID19_REPORT` database and `TRANSFORM` schema which are labelled as proxies. This shows that this table is not present in the extracted model but is required for the lineage of the view `CDC_TOTAL_BEDS`.

### Example procedure

As an example lets consider the following procedure definition:

```sql
CREATE OR REPLACE PROCEDURE COVID19.PUBLIC.MOVE_CDC_DATA() returns NUMBER
language SQL
strict
AS
$$
BEGIN
    INSERT INTO COVID19_REPORT.PUBLIC.CDC_INPATIENT_BEDS_ALL(STATE, DATE, ISO3166_1, LAST_REPORTED_FLAG)
    SELECT C19.STATE, C19.DATE, C19.ISO3166_1, C19.LAST_REPORTED_FLAG
    FROM COVID19.PUBLIC.CDC_INPATIENT_BEDS_COVID_19 C19
             JOIN COVID19.PUBLIC.CDC_INPATIENT_BEDS_ALL AL
                  ON C19.STATE = AL.STATE
    WHERE C19.STATE IS NOT NULL;
END
$$;
```

This procedure is inserting data into the table `COVID19_REPORT.PUBLIC.CDC_INPATIENT_BEDS_ALL` from the table `COVID19.PUBLIC.CDC_INPATIENT_BEDS_COVID_19`. In this scenario where the connector is executed against the database `COVID19`, this procedure will be extracted. However, the target table `COVID19_REPORT.PUBLIC.CDC_INPATIENT_BEDS_ALL` is not present in the extracted model. With the proxy objects implementation enabled, the missing target table will be created as a proxy object.

Procedure lineage using proxy objects

This allows us to view missing lineage that would otherwise be lost.

### Example entity properties

Proxy objects are all created with the property `SOL.isProxy` set to `true`. This allows for easy identification of these objects in the model. A new display rule **Proxy Entities Tag** has been added in the JDBC module along with a default enabled view which highlights all proxy entities in the model.

Display rule for proxy entities

Using the information derived from SQL parsing, other properties are included at best effort basis to provide more context to the proxy object. These properties differ depending on the type of object being created.

For tables, the following properties are included:

* `TABLE_NAME`: The name of the table that the proxy object is representing.
* `TABLE_TYPE`: The type of the table that the proxy object is representing, attempting to match against JDBC table types.
* `TABLE_SCHEM`: The name of the schema that the proxy object is stored in.
* `TABLE_CAT`: The catalog/database of the table that the proxy object is stored in.

For columns, the following properties are included:

* `COLUMN_NAME`: The name of the column that the proxy object is representing.
* `TABLE_SCHEM`: The name of the schema that the proxy object is stored in.
* `TABLE_NAME`: The name of the table that the proxy object is representing.

For schemas, the following property is included:

* `SOL.proxyDatabase` : The name of the database that the proxy object is stored in.

These properties are added to mimic the properties included in regular extracted objects. This allows for the proxy objects to be used in the same way as regular objects in the model.

Properties of a proxy object

## Result Sets

The following option is now available to enable display/processing of procedures/SQL scripts which return result sets: `--solidatus.jdbc.showSqlResultSets`.

Unlike SQL of the type `INSERT INTO/UPDATE SET`, procedures or SQL scripts which return result sets do not have target tables. Enabling the `--solidatus.jdbc.showSqlResultSets` option will allow the Connector to display the result set columns on the procedure object.

If `solidatus.jdbc.simple-procedure-summary=false` is also set then the encompassing Solidatus entity will be labelled `Result Set`. The `Result Set` entity represents the **top level** columns produced as a result set for the given SQL script or procedure. Other internal `Updates` or `Inserts` statements will be displayed as usual on the entity.

### Example procedure with result set

```tsql
CREATE PROCEDURE [dbo].[getPersons]
AS
BEGIN
SELECT REPLACE(TRIM([BusinessEntityID]), ',', '') [BusinessEntityID],
       Trim([PersonType])                         [PersonType],
       Trim([NameStyle])                          [NameStyle],
       Trim([Title])                              [Title],
       Trim([FirstName])                          [FirstName],
       Trim([MiddleName])                         [MiddleName],
       Trim([LastName])                           [LastName],
       Trim([Suffix])                             [Suffix],
       REPLACE(TRIM([EmailPromotion]), ',', '')   [EmailPromotion],
       [AdditionalContactInfo]                    [AdditionalContactInfo],
       [Demographics]                             [Demographics],
       [rowguid]                                  [rowguid],
       CASE
           WHEN LEN(TRIM([ModifiedDate])) > 0
               THEN SUBSTRING(TRIM([ModifiedDate]), 9, 2) + '-' + SUBSTRING(TRIM([ModifiedDate]), 6, 2) + '-' +
                    SUBSTRING(TRIM([ModifiedDate]), 1, 4)
           ELSE [ModifiedDate]
           END AS                                 [ModifiedDate]
FROM [Person].[Person];
END;
```

Properties of a proxy object
