# Changelog

#### What's new in 5.2.21

* \[SOL-20012] \[Snowflake] Access History column lineage now creates proxy objects for columns not found in the extracted model, when `solidatus.jdbc.createSqlProxyObjects` is enabled

#### What's new in 5.2.18

* \[CVE-2026-54512] \[General] dependency updated to com.fasterxml.jackson.core:jackson-databind:2.22.0
* \[CVE-2026-54513] \[General] dependency updated to com.fasterxml.jackson.core:jackson-databind:2.22.0
* \[CVE-2026-54514] \[General] dependency updated to com.fasterxml.jackson.core:jackson-databind:2.22.0
* \[CVE-2026-54515] \[General] dependency updated to com.fasterxml.jackson.core:jackson-databind:2.22.0
* \[GHSA-72hv-8253-57qq] \[General] dependency updated to com.fasterxml.jackson.core:jackson-core:2.22.0
* \[CVE-2026-54515] \[General] dependency updated to com.fasterxml.jackson.core:jackson-databind:2.22.1
* \[SOL-19931] \[Sybase IQ] Update Sybase IQ DDL extraction to read from SYSPROCEDURE instead of syscomments
* \[SOL-19931] \[Sybase IQ] Update Sybase IQ view DDL extraction to read from SYSVIEWS instead of syscomments
* \[SOL-19931] \[Sybase IQ] \[SQL Parsing] Update Sybase IQ DDL preprocessing syntax to account for inline comment syntax within message strings
* \[CVE-2026-10532] \[General] dependency updated to ch.qos.logback:logback-core:1.5.35

#### What's new in 5.2.7

* \[Sybase IQ] \[SQL Parsing] Fix bug where single semicolon on new line causing SQL parsing error.
* \[Sybase IQ] \[SQL Parsing] Fix bug with "ON COMMIT PRESERVE" syntax.
* \[Sybase IQ] \[SQL Parsing] Fix bug with inline comment syntax.
* \[SOL-19685] \[Postgres] Bump jdbc driver to v42.2.11 resolves CVE-2025-49146 CVE-2026-42198
* \[SOL-19685] \[Postgres] Catalog name no longer used for Instance name
* \[SOL-19685] \[Snowflake] Bump jdbc driver to v4.3.1 resolves CVE-2026-3293
* \[SOL-19685] \[Snowflake] Changed driver class used to net.snowflake.client.jdbc.SnowflakeDriver as per v4.x driver
* \[SOL-19685] \[General] Fixed issue where jdbc connections were not closed properly in some cases

#### What's new in 5.2.1

* \[SOL-16093] \[General] Support creation of Solidatus Data Assets in the produced models. See the Solidatus documentation for more information on Data Assets.
  * \[General] WARNING: Running with Data Assets enabled will result in many "modified" entities in the first connector run with Data Assets enabled. We recommend that a connector run is performed before the upgrade to ensure any actual changes to scanned systems are discovered and viewed separately from the Data Asset changes.
  * \[General] Data Asset creation is enabled by default. See `solidatus.jdbc.create-data-assets` in the configuration documentation if you wish to disable this feature.
* \[General] Performance improvements for models with large numbers of SQL Variables in procedures.
* \[SOL-19292] \[Oracle] Oracle synonym transition orientation is now determined by usage of the synonym, i.e., writes to the synonym will result in a transition from the synonym to the underlying object, whereas reads of the synonym will result in a transition from the underlying object to the synonym.
* \[SOL-19279] \[Oracle] Oracle database links are now created in a dedicated `DBLINKS` layer, while also creating proxy entities with the host service name and layers with the foreign schema.
* \[CVE] Removed bundled Cassandra JDBC driver, please use custom driver provided by your database vendor.
* \[SOL-19701] \[Snowflake] Fixed some excessive connection activity by closing connection pools after jobs finish executing
* \[BigQuery] Fix missing source for complex WITH statements
* \[SOL-19467] \[Sybase IQ] Fix invalid syntax error from "sql security invoker"
* \[SOL-19473] \[Sybase IQ] Fix invalid syntax error from "exception when other" statements

#### What's new in 5.1.27

* \[General] Improved performance of split view model processing.

#### What's new in 5.1.24

* \[SOL-19153] Fix schema duplication across catalogs in wizard step 2 when multiple catalogs are selected.
* \[SOL-19143] \[Oracle] The feature of suppression of unused (Oracle) synonyms removes all the unused, disconnected synonym attributes from the synonym objects.
  * Now, further to the above, all empty synonym objects will also be removed from the model.
  * We think this better reflects the spirit of this feature. This removal will be reflected in the model diff following the first run of updated connector.

#### What's new in 5.1.2

* \[SOL-18805] \[SQLParsing] \[SybaseIQ] Add support for Sybase IQ temporary tables
* \[SQLParsing] \[BigQuery] Address issue of missing lineage through nested queries (namely the coalesce function)
* \[SQLParsing] \[BigQuery] Fix bugs regarding nested derivations
* \[SQLParsing] \[Oracle] Fix issue regarding additional lineage introduced due to leniency of SQL parsing syntax.
* \[SQLParsing] \[SybaseIQ] Add syntax support for `sql security definer` and `current timestamp` for use in procedure definition and body.
* \[SQLParsing] \[SybaseIQ] Add syntax support for `first_value(X) over Y as Z` syntax in procedure body.

#### What's new in 5.0.1

* \[SOL-17483] \[SQLParsing] \[Snowflake] Add support for Snowflake Query history parsing.
  * To enable, use `jdbcConfig.snowflakeEnricher.queryHistory.insertQueryHistory`. See documentation for more detail.
* \[SOL-17483] \[SQLParsing] \[Snowflake] BREAKING: Snowflake Access history time configuration will no longer default to 30 days. Instead, all jobs enabling Snowflake Access history are now required to explicitly set either the range or timespan. Please update your jobs accordingly. You can set the timespan to 30 days to maintain previous behaviour.

#### What's new in 4.0.14

* \[SOL-18325] \[General] \[SQLServer] Fix bug where schema step in wizard mode does not return system schemas (like dbo and INFORMATION\_SCHEMA)

#### What's new in 4.0.9

* \[SOL-18093] \[General] Add a default tag display rule for sql derivations
* \[General] Bump Solidatus Connector Java SDK solidatus-spring-boot-starter to 2.0.97

#### What's new in 4.0.1

* \[SOL-17477] \[General] Added the labeling of the catalog to schema and table types (prerequisite to multi-catalog jobs)
* \[SOL-17478] \[SQLServer] \[Snowflake] Added configuration options to support multi-catalog selection for agent.
* \[SOL-17918] \[SQLParsing] \[SQLServer] \[Snowflake] Throw error in wizard mode when catalog field is empty for snowflake or sqlserver dialect (multi catalog supporting technologies)
* \[SOL-17919] \[General] Fix checkpoint logging to unique schema number based on both catalog and schema (unique `<catalog>.<schema>`)
* \[SOL-17920] \[General] \[SQLServer] \[Snowflake] In standalone mode when multiple catalogs are selected, the connector will run as if the v2 sol path option is always selected
* \[SOL-17923] \[SQLParsing] \[SQLServer] \[Snowflake] Implement multi-catalog sql parsing support for Snowflake and SQLServer dialects
* \[SOL-17923] \[Snowflake Data Governance] Implement multi-catalog column lineage through access history for Snowflake.
* \[SOL-17971] \[General] Fixed issue where drivers that do not have a catalog produce null.schema in schemaPattern dropdown
* \[SOL-17995] \[SQLParsing] \[Snowflake] Allow parsing of CTAS (create table as select) statements in Snowflake
* \[General] Add `SOL.catalog` property display rule

**Known Issues**

* The connector now supports multi catalogs jobs for the Snowflake and SQLServer technologies. This requires a change in configuration from a deprecated `catalog` field to a new `catalogs` field. Please see the new multi catalog extraction documentation for more details.

#### What's new in 3.9.1

* \[SOL-16638] \[SQLParsing] \[Oracle] Fix support for MERGE INTO sql statement
* \[SOL-16900] \[SQLParsing] \[Snowflake] Fix syntax errors for disallowed symbols in PROCEDURE definition
* \[SOL-17401] \[SQLParsing] \[Oracle] Add basic support for FETCH BULK COLLECT

#### What's new in 3.8.20

* \[SOL-17789] Add new configuration flag, `solidatus.jdbc.dumpSqlExtractedFromDatabase`, that when set to `true`, will dump the SQL extracted from a database into a file before SQL parsing takes place. See the Configuration section of documentation for more information

#### What's new in 3.8.18

* \[SOL-17291] Fix issue where connector's loss of connection to Solidatus would cause the connector process to terminate rather than attempt to reconnect

#### What's new in 3.8.12

* \[SOL-17661] \[DDL Extractor] \[Sybase ASE] Updated to support catalog..table syntax in view definitions
* \[SQLParsing] Improve logging for sql parsing errors

#### What's new in 3.8.2

* \[SOL-15906] \[SQLParsing] \[Big Query] Fix issue where lineage doesn't flow through user-defined functions (UDF). The expectation is that the output flows from all inputs to all outputs.
* \[SOL-15935] \[SQLParsing] \[Snowflake] Fix issue where SQL parsing fails against `BEGIN WORK` type syntax
* \[SOL-16106] \[SQLParsing] \[Snowflake] Add support for additional arithmetic operations in `$$` delimited Snowflake SQL.
* \[SOL-17161] \[General] Fix issue where out of memory failure was not marked as an error by the Connector job.
* \[SOL-15933/SOL-17420/SOL-17532] \[SQLParsing] \[SQLServer] Add lineage support through input parameters of nested procedures.

#### What's new in 3.7.18

* \[SOL-16535] Fix bug of procedures disappearing and materialized view turning into tables when an exclude views filter is set

#### What's new in 3.7.12

* \[SOL-16667] Revert default value for 'jdbcConfig.experimentalFeatures.solPathV2' to false due to a wizard mode step erroring for non-supported databases.
* \[SOL-16769] Fix bug in wizard mode step preventing progressing to next configuration step

#### What's new in 3.7.9

* \[SOL-16290] Default value for 'Enable Foreign key transitions' option set to false - solidatus.jdbc.with-fk-transitions
* \[SOL-16667] Change default value for 'jdbcConfig.experimentalFeatures.solPathV2' to true. Note that new jobs targeting models created by older versions of the connector may produce a migration revision.

#### What's new in 3.6.40

* \[SOL-16398] Fix error that arises from unexpected input during when proxy objects are enabled.

#### What's new in 3.6.36

*(no changelog entries)*

#### What's new in 3.6.34

* \[SOL-16363] \[General] The container image now executes under the user `3737` and primary group `0`. All files are owned by `3737:0` and have permissions `770`.

#### What's new in 3.6.30

* \[SOL-16073] \[SQLParsing] \[General] Ensure that excluded views are also excluded from SQL Parsing to improve performance

#### What's new in 3.6.11

* \[SOL-15266] \[SQLParsing] \[Sybase IQ] Fix Sybase IQ Syntax error on `trigger` keyword
* \[SOL-15427] \[SQLParsing] \[Oracle] Fix bug with simple Oracle procedure relationships not being produced
* \[SOL-15488] \[SQLParsing] \[SQL Server] Fix missing column level SQL derivations for a summation (i.e. a + b + c as sum)
* \[SOL-11000] \[SQLParsing] \[MySQL] Fix extraction of MySQL procedure relationships. Note that in MySQL, database is specified by the `use <database>` keyword
* \[SOL-15025] \[FD-8368] \[SQLParsing] \[Oracle] Fix relationship extraction through multiple cursor variables in Oracle
* \[SOL-15654] \[FD-8644] \[SQLParsing] \[Snowflake] Fix parsing errors for procedure definition using SnowflakeSQL wrapped in single quotes (')
* \[SOL-15653] \[FD-8644] \[SQLParsing] \[Snowflake] Fix parsing errors for procedure definition using SnowflakeSQL when omitting the return column names and types
* \[SOL-15657] \[FD-8644] \[SQLParsing] \[Snowflake] Fix determining the incorrect source of a relationship through variables in SnowflakeSQL script
* \[SOL-15655] \[FD-8644] \[SQLParsing] \[Snowflake] Fix error and lineage for procedure creating and interacting with a temporary table in Snowflake
* \[SOL-15656] \[FD-8644] \[SQLParsing] \[Snowflake] Fix parsing errors for procedure definition in SnowflakeSQL that includes an ALTER TABLE statement
* \[SQLParsing] \[Oracle] Remove incorrect transitions for `decode` statements

**Known Issues**

* Big query SQL parsing lineage may show as incomplete through user-defined functions.
* Oracle SQL parsing lineage through cursors may show as incomplete.
* SQL parsing lineage derived through stacked procedure calls (input parameters being passed to other procedures) may show as incomplete or incorrect.

#### What's new in 3.6.1

* \[SOL-16049] \[General] Fix agent mode bug regarding the reliability of the connector querying for existing tables and views in wizard mode

#### What's new in 3.6.0

* \[SOL-15948] \[General] SQL Derivations supported on views for Big Query, MS SQL Server, Azure SQL and Oracle
* \[SOL-15913] \[SQL Parsing] \[Snowflake] BREAKING: Snowflake extraction of stored procedures no longer requires 'GRANT USAGE ON ALL PROCEDURES IN DATABASE' and instead only needs the `OBJECT_VIEWER` database role to access the `SNOWFLAKE.ACCOUNT_USAGE` schema (in addition to the ability to use a warehouse)
* \[SOL-15971] \[SQLServer] Allow for Fabric Lakehouse schema extraction via ActiveDirectoryDefault authentication
* \[SOL-15997] \[General] Allow logging of potentially useful chained `SQLException` exceptions when debug logging is enabled

#### What's new in 3.5.50

*(no changelog entries)*

#### What's new in 3.5.40

* \[SOL-15618] \[Sybase ASE] Support added for Sybase ASE procedure parsing of procedures which contain non-shareable temporary tables (by specifying a pound sign (#) before the table name in the 'CREATE TABLE' statement), when the proxy objects option is enabled.

#### What's new in 3.5.30

*(no changelog entries)*

#### What's new in 3.5.26

* \[SOL-15192] \[General] Generate FK model transitions only when withFKTransitions toggle is set to true. Default is true.
* \[SOL-15346] \[AzureSQL] Implement handling of external tables for AzureSQL. Please see AzureSQL features document for more details.

#### What's new in 3.5.5

* \[SOL-14923] \[Sybase IQ] Implement DDL extraction for `sybaseIQ`
* \[SAP-IQ] \[SQLParsing] \[General] Fix syntax error on 'COMPRESS OFF' in table column definition
* \[BigQuery] \[SQLParsing] \[General] Fix issue with COALESCE sources not being properly identified when multiple CTEs are used
* \[SOL-14589] \[SQLParsing] \[Snowflake] Fixes parse issue for extracted Snowflake procedures
* \[SOL-14205] \[SQLParsing] \[BigQuery] Fixes parse issue for SQL with re-aliasing within subqueries
* \[SQLParsing] \[BigQuery] Fixes parse issue for SQL with column names defined as 'key'
* \[SOL-14392] \[SQLParsing] \[General] Introduces new configuration option `--solidatus.jdbc.showSqlResultSets` which parses and visualises result sets returned from stored procedures. This option is disabled by default.
* \[SQLParsing] \[SQLServer] Fixes parsing issue that creates more transitions for relationships associated with a temporary table.
* \[SOL-14807] \[Oracle] Fix loss of column lineage in Oracle package procedure returning a cursor
* \[SOL-14768] \[Oracle] Fix loss of column from Oracle SQL parsing
* \[SOL-15192] \[General] Fix issue when database connection is not terminated when navigating wizard mode when running the connector as an agent

#### What's new in 3.4.13

* \[SOL-14962] \[Snowflake Data Governance] Fix bug where incorrect error thrown when Snowflake credentials are omitted during execution under the Snowflake Data Governance profile
* \[SOL-15067] \[Sybase ASE] Add permissions documentation for Sybase ASE
* \[SOL-15077] \[Sybase ASE] Implement DDL extraction for views, procedures and triggers for `sybaseASE`
* \[SOL-15079] \[Sybase ASE] Implement DDL construction for tables for `sybaseASE`
* \[SOL-15152] \[General] Support for Basic authentication scheme when tunneling HTTPS over a proxy with the HTTP CONNECT method

**Known Issues**

* Connectivity for SybaseASE has an issue where transaction sessions may be left idling when configuring a job in wizard mode in the connector agent. These idling transactions should close when the connector process is terminated. It is recommended that for this version of the connector in agent mode, when configuring a job for a SybaseASE database, that manual configuration is used.

#### What's new in 3.4.0

* \[SOL-14920] \[Sybase ASE] Rename `sybase` driver option to `sybaseASE`
* \[SOL-14920] \[Sybase IQ] Add `sybaseIQ` driver option and remove `sybase2` driver option
* \[SOL-14924] \[Sybase IQ] Add permissions documentation for Sybase IQ
* \[SOL-14536] \[Snowflake Data Governance] Support for using a single job to extract tags and policies from schemas from multiple databases into a single reference model has been added. **NOTE that this includes breaking changes for any existing Snowflake Data Governance Connector jobs.** All schemas now need to include the corresponding database, a configuration option has been renamed and the model structure has a slight change. ALL existing Snowflake Data Governance Connector jobs need to be updated:
  1. **jobs that specify include/exclude schemas:** each schema now needs to be prepended with the database name, separated by a period (`.`). E.g. `database-name.schema-name`
  2. **jobs that don't specify any schemas but specified a database:** due to a rename, the database name needs to be re-entered, under the renamed `snowflake.gov.catalogs` configuration field, instead of the previous `snowflake.gov.catalog`. The new field is now a list of `string`, from the previous just being a `string` The generated model structure has also changed, with an object-per-database now grouping all related entities within each layer.

#### What's new in 3.3.20

* \[SOL-14757] \[General] Improve per database technology documentation
* \[SOL-13908] \[Oracle] Remove self-referencing transition for synonym columns

#### What's new in 3.3.8

* \[SOL-14656] \[General] Added toggle for default Solidatus model views, enabled by default.

#### What's new in 3.3.4

* \[SOL-14399] \[General] Add new flag to disable upload of output models to Solidatus instance, generate local JSON file instead.
* \[SOL-14552] \[FD-8203] \[General] Update Oracle JDBC driver to version 19.x. Fixes extraction of VARRAY column data types in model. Fix model building of extracted error columns.
* \[SOL-14387] \[General] Fix extraction of primary and foreign keys when failure has occurred during column extraction.

#### What's new in 3.3.2

* \[SOL-13348] \[General] \[SQLParsing] Adds a new configuration option `--solidatus.jdbc.createSqlProxyObjects` which when enabled with a valid SQL parsing configuration will create proxy/placeholder entities for any missing source and target columns derived as lineage from SQL parsing. Please see the documentation for more information.
* \[SOL-14369] \[General] \[SDK] Fix "Multiple models found with name" error when running model migrations when 2 or more models' names begin with the same prefix
* \[SOL-13639] \[Snowflake] Adds a new configuration option `--solidatus.jdbc.experimentalFeatures.solPathV2` which when enabled will add the database name as a prefix to the `SOL.path` property on each entity. A model migration will take place if an existing model is using the older `SOL.path` format. Currently this option is only enabled for the `snowflake` driver.

#### What's new in 3.2.1

* \[SOL-13638] \[Snowflake] Extract Snowflake instance name and store in the `instanceName` key in the model metadata.
* \[SOL-13358] \[General] Implements model revision migrations. Migration 1: Uppercase SOL.path properties on all entities in the model. This may affect view columns, synonyms, and database links. If older models exist and model migration is not required (this may break lineage in composite models) please set `--solidatus.jdbc.ignore-migration` to `true`.
* \[SOL-13614] \[General] \[SQLParsing] Fixes issue of SQL extraction pulling definitions from all databases when schema pattern is empty.
* \[SNOW-1163212] \[Snowflake] Snowflake driver updated to 3.15.1. Fixes issue of InvalidPathException thrown on Windows due to nested file system in path
* \[FD-7900] \[BigQuery] Fix SQL parsing issue with nested CTEs and coalesce statement.
* \[FD-7831] \[BigQuery Derivations] Fix hierarchical derivations issue with nested WITH statements.
* \[Oracle] Improved oracle procedure lineage parsing with union all statements.
* \[SOL-13715] \[FD-7888] \[BigQuery Derivations] Fix hierarchical derivations issue with UNION ALL statements.
* \[SOL-14137] \[Oracle] Fix SQL parsing issue with relationships between table and view for a CREATE VIEW statement without aliased columns.
* \[SOL-14068] \[BigQuery] Fixes regression regarding 'CREATE TEMPORARY FUNCTION' statements where lineage isn't generated

#### What's new in 3.1.36

* \[SOL-12965] \[FD-7778] \[BigQuery] Fix nested array attributes that are one nest deep having incorrect extra sources.
* \[SOL-13563] \[FD-7816] \[General] Add configuration option `solidatus.jdbc.maximumPoolSize` to allow for overriding the default Hikari Datasource maximum pool size which represents the maximum number of connections to the database.
* \[SOL-13838] \[SQLServer] \[AzureSQL] \[SQLParsing] Fix global temporary table lineage not being created correctly.

**Notable changes:**

* For custom driver configuration the class path for the properties launcher has been updated to: `-Dloader.main=com.solidatus.app.Main org.springframework.boot.loader.launch.PropertiesLauncher`. Please update your command line scripts accordingly.

#### What's new in 3.1.17

* \[SOL-13537] \[General] Improve metadata extraction documentation
* \[SOL-13537] \[Snowflake] Add high-level Snowflake overview page to documentation
* \[SOL-13646] \[FD-7880] \[General] Improve error handling when materialised view entity cannot be found for processing
* \[SOL-13110] \[FD-7687] \[BigQuery] Fix issue where use of UNNEST creates lineage from the ARRAY STRUCT fields to all target columns
* \[SOL-12966] \[FD-7593] \[BigQuery] Fix issue with incorrect transition mapping
* \[FD-7706] \[BigQuery] Fix issue with incorrect transition mapping
* \[Oracle] \[SQLParsing] Fix issue where NULL constant lineage is missing.
* \[SQLServer] \[SQLParsing] Add rudimentary support for XML column types and inherent view lineage.
* \[SOL-13046] \[BigQuery Derivations] Fix incorrect hierarchical derivations.
* \[SOL-12828] \[BigQuery Derivations] Implement hierarchical derivations. Previously, top level derivations were only provided for referenced columns in Big Query scripts; now the derivations for intermediate transformations in a script will be visualised as part of a property folder called SOL.sqlDerivations on these column entities.
* \[SOL-13450] \[FD-7794] \[BigQuery] Fix file structure ingestion inconsistency issue.
* \[SOL-13601] \[General] Add configuration option `solidatus.jdbc.supported-derivations-dialects` to allow for override the default list of supported dialects for derivations.
* \[SOL-13351] \[Solidatus Views] Add functionality for creating views when running a job.

#### What's new in 3.1.2

* \[SOL-12829] \[BigQuery] Adds batch processing for SQL parsing from files to improve memory optimisation. Please see documentation under BigQuery for more information.
* \[SOL-12702] Fix TableTypes only retrieving Table / View objects in wizard mode dropdown list
* \[SOL-12715] \[FD-7554] \[Postgres] Fix lineage for Materialized Views
* \[SOL-11715] \[FD-6529] \[Big Query] Fix issue with select \* and array struct causing the array structs to have incorrect transitions
* \[SOL-11158] \[FD-6599] \[Big Query] Fix issue with select \* and array struct causing the array structs to have incorrect transitions
* \[SOL-12144] \[FD-7051] \[Big Query] Fix lineage not being linked between array structs from source to target
* \[SOL-12631] \[Big Query Derivations] Fixed regression with simple derivations not appearing
* \[SOL-11178] \[FD-6133] \[Big Query] Fix outstanding issue on UNION ALL statements in complex CTE structures producing incorrect lineage
* \[SOL-12591] \[FD-7051] \[Big Query] Fix missing lineage between source and target array structs with same named array elements
* \[SOL-12617] \[FD-7517] \[Oracle] Fix procedure parsing with parameter type containing NAME or SEQUENCE
* \[SOL-12625] \[FD-7477] \[Oracle] Fix null pointer exception when using array index
* \[SOL-12861] \[Big Query Derivations] Fix select replace statement derivations

#### What's new in 3.0.4

* \[SOL-12346] \[General] Updated to require Java 17. **WARNING**: Requires downloading the Java Development Kit (JDK) 17 (or greater) from JDK8 to run the connector JAR. Please inform your infrastructure team regarding updates to Java 17, or email <support@solidatus.com> if there are further issues.

**Known Issues**

* Setting Spring `standalone` or `connector` profiles via `spring.profiles` is deprecated and must be replaced with `spring.config.activate.on-profile`. Please see updated documentation or the official Spring migration guide for more information.
* If loading a JDBC driver for `custom` parsing please ensure a compatible `SLF4J` version is available otherwise exclude the conflicting `SLF4J` version from the classpath.

#### What's new in 2.6.54

* \[SOL-12833] \[General] Add configuration option `--solidatus.jdbc.suppress-unused-synonyms` to remove unused synonyms from the model if not used in lineage. Defaults to true.
* \[SOL-12429] \[FD-5563] Added support for temporary tables with the SQL Server and Azure SQL dialects, when SQL parsing.
* \[SOL-10878] \[MySql] Fixes `--solidatus.jdbc.split-views` configuration option creating NULL.VIEWS layer

#### What's new in 2.6.44

* \[SOL-12619] \[General] Update agent mode checkpoint logging for SQL parsing errors
* \[SOL-12619] \[General] Add agent mode host site pre-fill for configuration
* \[SOL-12619] \[General] Add required fields for agent mode job configuration
* \[SOL-12619] \[General] \[SQL Parsing] Log extracted views and procedures
* \[SOL-12322] \[FD-7477] \[General] \[SQL Parsing] Fix NullPointerException thrown from getFullyQualifiedName
* \[SOL-11689] \[FD-6993] \[Snowflake] Access History column lineage will now default to all users rather than authenticated user.

#### What's new in 2.6.27

* \[SOL-11462] \[Redshift] Update Redshift stored procedure extraction SQL to use metadata views
* \[SOL-11724] \[Snowflake] Allow Snowflake RSA authentication for SQL Parsing
* \[SOL-10997] \[Oracle] Fix bug where Oracle databases containing a `.` would not filter stored procedures
* \[SOL-12213] \[General] Update and fix SOL.UID formatting for standard JDBC URLs.
* \[SOL-8297] \[General] Adds support for the agent description when the connector agent is created
* \[SOL-12310] \[FD-7415] \[Oracle] Include synonyms referencing an object over a DBLink in the Solidatus model.

#### What's new in 2.6.15

* \[SOL-10919] \[SQLParsing] \[Hive] Fix Hive error when parsing metadata json
* \[SQLParsing] \[BigQuery] Fix SUBSTR function integer inputs being counted as column sources
