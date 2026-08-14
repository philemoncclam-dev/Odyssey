# Features

## JDBC driver version

The packaged JDBC driver in the connector is the 19c release JDBC driver. Please see the [Oracle JDBC FAQ](https://www.oracle.com/uk/database/technologies/faq-jdbc.html) for more information and the supported interoperability between database and JDBC version.

## Packages

Procedures that are stored in packages can be retrieved during SQL parsing processing. Each procedure will inside a package is represented as separate entities in the model layout, however if they come from a package there are 2 primary differences.

Procedures returned from a package represented in the .PROCEDURES layer

Firstly a new property on the procedure called `SOL.package` is added which contains as a value the package name. Secondly the `SOL.path` of the attributes inside the procedure entity contain the package name as a prefix on the procedure name. These property updates can be used in display rules and filters to group certain procedures and trace back where they came from.

Property panel of a procedure &#x60;hire_employee&#x60; coming from package &#x60;emp_admin&#x60;

## Synonyms

If `TABLE-TYPE` contains `SYNONYM` a synonym reference is added as new objects to the extracted structure model. With sql-parsing synonym lineage can be derived and applied to the model. Transition orientation between synonyms and their underlying objects is determined by the usage of the synonym, i.e., outgoing from the synonym if it is read from, or incoming to the synonym if it is written to. Bidirectional transitions are also possible if the synonym is both read from and written to.

Model representation of a synonym VEHICLES created from table CARS

Synonyms contain the property `TABLE_TYPE` with value `SYNONYM`. Synonyms which are not found in lineage will be suppressed and removed from the model. Synonyms also contain 2 unique properties on the table object providing information about the synonym:

* `SOURCE_NAME`
* `SOURCE_SCHEMA`

Properties of a synonym object

## Database Links

Database links is a schema object in one database that enables you to access objects on another database. Database links are extracted only if sql-parsing is enabled. They are represented in the model in a separate layer \*\*DBLINKS\*\* representing the local \* \*SCHEMA\*\* and \*\*TABLE\*\*. The name of the database link in the model is `[DBLINKS/Schema.Table>@[Database Link]`. Creating a database link also creates a proxy entity representing the foreign schema and table linked to by the database link. These proxy entities are in their own schema layer of name `ServiceName/Schema`.

Objects surrounded by a blue border are database links formatted with the @ between Table and Database Link name

The database link tables also contain a unique property DBLINK which contains as a value the name of the database link. The `SOL.path` and `TABLE\_NAME` of the database link entity are also formatted in the same way.

Properties of tables retrieved from a database link

### Synonyms Using Database Links

Access of objects on another database may be hidden behind a synonym that uses a database link. SQL objects and queries can reference this synonym and access database objects on another database, via the database link.

{% hint style="warning" %}
Synonyms using database links are not supported.

The database link used in the synonym will not be detected and will be missing; the synonym will appear empty and unused. There will be no lineage between the synonym and anything that may reference it.
{% endhint %}
