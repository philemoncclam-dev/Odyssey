# User Permissions

### Permissions Requirements

For running the Snowflake Connector to generate the initial lineage database model please follow the permissions document provided with the Snowflake documentation.

If a user and role already exist from the Snowflake Connector execution please skip to [Assigning Privileges to the Role](#assigning-privileges-to-the-role).

Our recommendation for user permissions is to create a restricted user with limited access and only to data dictionary information. Please execute the commands provided below.

Once the new username and password are generated, you can initiate the connector and create a Solidatus model complete with lineage. Metadata is sourced from the data dictionary tables and views in the Snowflake database.

The management of privileges is facilitated through the execution of GRANT and REVOKE statements, a task necessitating root permissions.

We advise reaching out to your Snowflake administrator to assist in setting up and creating this user for you.

### Creating a Custom Role

To begin, you can create a Snowflake custom role as follows. This role will be used to grant privileges against.

**Format**

```snowflake
CREATE ROLE <role>;
```

**Example**

The following example demonstrates the creation of the role `solidatus_role`;

```snowflake
CREATE OR REPLACE ROLE solidatus_role;
```

### Creating a User

Once a role has been created we can create a new user and assign it that role.

**Format**

```snowflake
CREATE USER <username> password=<password> DEFAULT_ROLE=<role> DEFAULT_WAREHOUSE=<warehouse> DISPLAY_NAME=<display_name>;
```

**Example**

The following example demonstrates the creation of a user `solidatus` assigned to `solidatus_role`;

```snowflake
CREATE USER solidatus password='H8MZRqa8gEe' DEFAULT_ROLE=solidatus_role DEFAULT_WAREHOUSE=COMPUTE_WH DISPLAY_NAME=SolidatusMetadata;
```

### Assigning Privileges to the Role

For Snowflake Column Lineage the following view is selected from: `SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY`

As these views are stored in the `ACCOUNT_USAGE` schema, the permissions must be set by a Snowflake ACCOUNTADMIN.

To enable access to ACCOUNT\_USAGE to extract column lineage, the following permissions are required:

**Format**

```snowflake
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE <role>;
```

**Example**

The following example demonstrates the assigning permissions to the role `solidatus_role`;
