# Configure Connection Management Providers

This is a guide on how to configure connection manager providers for a connector job. This configuration can be ignored if there is no usage of OLE DB connection manager in the SSIS package.

A connection manager provider requires two inputs: an OLE DB connection manager reference ID and its database provider. When parsing a SQL command or database object name from a OLE DB component, the database provider value will be used by SQL parser to select the right SQL dialect for parsing. Failing to provide database provider for an OLE DB connection manager may result in poor or incomplete lineage generation.

See next sections on how to configure for Agent and Standalone mode.

## Agent Mode

We recommend using Solidatus job configuration wizard (`Edit` -> `Edit using wizard`) for the following steps.

The config step to specify connection manager providers will be shown after providing DTSX file either by file path or file upload.

1. Click `Add a value` to add a new entry<br>

   <figure><figcaption></figcaption></figure>
2. A list of retrieved reference IDs will be displayed in the dropdown for `Reference ID`. Select an OLE DB connection manager from the dropdown.
3. A list of [database providers](#database-providers) will be displayed in the dropdown for `Database Provider`. Select database provider for the OLE DB connection manager.<br>

   <figure><figcaption></figcaption></figure>
4. Optionally, a user can provide connection manager files (`.conmgr` files) that can be found in a SSIS project directory either via path of via file upload. This supplies the connector model with database connectivity metadata.<br>

   <figure><figcaption></figcaption></figure>

### Ensuring protection of sensitive data in a `.conmgr` file

It is important to note that a connection manager file may contain sensitive information such as an unencrypted password. Before sharing these files please ensure that these files are generated with the appropriate protection level. Please see [here](https://learn.microsoft.com/en-us/sql/integration-services/security/access-control-for-sensitive-data-in-packages?view=sql-server-ver16) for more detail.

## Standalone Mode

### Find Connection Manager Reference ID

These are the XPath queries to find all connection manager reference IDs from DTSX file:

XPath #1: `//*[local-name()='ConnectionManagers']/*[local-name()='ConnectionManager']/@*[local-name()='refId']`

XPath #2: `//*[local-name()='connection']/@*[local-name()='connectionManagerRefId']`

You may use `Select-Xml` utility in Windows Powershell or `xmllint` command in Linux terminal to run the XPath queries.

#### Example with Windows Powershell

```powershell
# Set DTSX file path variable
PS> $Dtsx = "C:\Users\ABC\sample.dtsx"

# Set XPath variable
PS> $Xpath = "//*[local-name()='ConnectionManagers']/*[local-name()='ConnectionManager']/@*[local-name()='refId']"

# XPath query
PS> Select-Xml -Path $Dtsx -XPath $Xpath | Select-Object -ExpandProperty Node | Select-Object '#text' -Unique

#text
-----
Package.ConnectionManagers[Flat File Extract]
Package.ConnectionManagers[Ole DB Extract]
Package.ConnectionManagers[Ole DB Load]
```

#### Example with xmllint (Linux)

```bash
// Set DTSX file path variable
$ DTSX="/home/sample.dtsx"

// Set XPath variable
$ XPATH="//*[local-name()='connection']/@*[local-name()='connectionManagerRefId']"

// XPath query
$ xmllint -xpath $XPATH $DTSX | awk -F '"' '{print $2}' | sort -u

Package.ConnectionManagers[Flat File Extract]
Package.ConnectionManagers[Ole DB Extract]
Package.ConnectionManagers[Ole DB Load]
```

### Job Configuration

We recommend configuring connection manager providers `solidatus.ssis.connection-manager-providers` in a YAML properties file. `ref-id` should be specified with the reference ID of an OLE DB connection manager and `database-provider` can be selected from [database providers](#database-providers) supported by SQL parsing.

#### Configuration snippet

```yaml
solidatus:
    ssis:
        dtsx-file-path: "/home/sample.dtsx"
        connection-manager-providers:
            -   ref-id: "Package.ConnectionManagers[Ole DB Extract]"
                database-provider: "oracle"
            -   ref-id: "Package.ConnectionManagers[Ole DB Load]"
                database-provider: "sqlserver"
```

### Database Providers

| Database Provider |
| ----------------- |
| `azuresql`        |
| `bigquery`        |
| `db2`             |
| `hive`            |
| `impala`          |
| `mysql`           |
| `oracle`          |
| `postgresql`      |
| `redshift`        |
| `snowflake`       |
| `sparksql`        |
| `sqlserver`       |
| `sybase`          |
| `teradata`        |
