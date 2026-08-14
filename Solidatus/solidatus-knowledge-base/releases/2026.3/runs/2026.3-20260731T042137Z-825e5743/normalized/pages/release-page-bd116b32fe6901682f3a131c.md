# Model Structure

Solidatus PowerBI connector will process and represent the report into 4 layers:

* Source Database
* Data Model Tables
* Data Sources
* Report Layer

### Source Database

This layer represents the source system where the data is originally from. If the source system is a database the structure of this layer is:

* System type (Type of database, Excel, Documents)
* Schema
* Table
* Column

These objects are parsed from PowerBI source expressions. See [PowerQuery M](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/solidatus-core/connectors/solidatus-connectors/power-bi/broken-reference/README.md) for more details.

#### Auto Mapping

Each column in the source database layer will contain a `SOL.UID` property which can be used with the automapper to combine different connector output models. As an example a model produced by a database connector can be linked to the source database layer of the PowerBI connector model so that full coverage of where data has come from can be shown.

#### Unsupported Datasources

When the connector encounters sources that it does not support (yet), it groups them all into an object called "Unsupported Datasources" in the source database layer. It attemtps to categorise the sources on a best-effort basis. The columns may contain the following property fields with additional information:

* sourceExpression: Raw source expression string
* powerQueryFunctions: PowerQuery functions called in the source expression

### Data Model Tables

This layer represents all the tables PowerBI uses which are linked to the Data Sources layer.

PowerBI measures could contain error if the source table or field that the expression formula references does not exist.

In the image below, the measure `SUM_OF_SALES` contains an error where the expression references a table 'Sales' which cannot be found.

A display rule called `Semantic Error` can be enabled in Solidatus model to view measures with such error.

Upon enabling the display rule, the error message will be shown in a yellow tag next to the entity

### Data Sources

This layer represents the generated data models that are used in report visualisation.

### Report Layer

The final layer which will be named `{REPORT_NAME}.pbit` which contains all PowerBI visualisations categorised by type and contain lineage back through to the datasource's layer.

Each object in this layer represents a section in the report. Each section can contain a number of different visualisations. A visualisation in PowerBI will contain a nested group relating to the type of visualisation e.g. slicer, chart, card. Along with this an attribute summarising the visualisation input data will have a transition to an entity in the `Data Sources` layer.
