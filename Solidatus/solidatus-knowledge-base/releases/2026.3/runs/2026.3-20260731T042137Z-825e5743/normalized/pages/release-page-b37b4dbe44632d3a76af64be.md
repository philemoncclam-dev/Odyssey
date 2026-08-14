# Object Dependencies

[Snowflake Object Dependencies](https://docs.snowflake.com/en/user-guide/object-dependencies) can be extracted using the configuration option:

`--solidatus.jdbc.snowflake-enricher.insert-object-dependencies`

when set to true. The permissions required in the pre-requisites are also required for the user account specified in the configuration.

Object dependencies are pulled from the Snowflake instance and will be represented as transitions between Solidatus Objects. They are categorised as table-level lineage. Object dependency lineage as an example can be between Tables and View objects. If the objects are not in the model the transition will not be created. A log statement will be provided for any object dependencies where the source or target objects are not included in the model.

Object dependency transitions can be easily visualised using the display rule in the Snowflake Data Governance module. This will highlight the object dependency lineage compared to lineage from other means.

<figure><figcaption></figcaption></figure>

Each transition will contain the following properties:

* `REFERENCED_DATABASE`
* `REFERENCED_SCHEMA`
* `REFERENCED_OBJECT_NAME`
* `REFERENCED_OBJECT_ID`
* `REFERENCED_OBJECT_DOMAIN`
* `REFERENCING_DATABASE`
* `REFERENCING_SCHEMA`
* `REFERENCING_OBJECT_NAME`
* `REFERENCING_OBJECT_ID`
* `REFERENCING_OBJECT_DOMAIN`
* `DEPENDENCY_TYPE`

<figure><figcaption></figcaption></figure>
