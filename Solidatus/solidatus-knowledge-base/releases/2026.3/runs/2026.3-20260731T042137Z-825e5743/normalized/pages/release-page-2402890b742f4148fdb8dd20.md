# Snowflake Policies

There are two types of policies Snowflake currently support; Row-Access Policies and Masking Policies. For the Snowflake Data Governance connector these policies are grouped and represented as Solidatus Objects in the `Policy` layer.

Each policy will contain relevant Snowflake metadata including:

* `POLICY_BODY`: Represents the policy logic
* `POLICY_OWNER`: Who created the policy
* `POLICY_SIGNATURE`: Description of the policy arguments and return values
* And more...

Once a policy has been created it can be applied to a Snowflake column using an `ALTER TABLE` statement.

## Row-Access Policies

### Example SQL

```sql
create
or
replace
row access policy REG_A_DATES_ACCESS as (val date) returns boolean ->
case
    when current_role() in ('ACCOUNTADMIN') THEN true
    else false
end;
```

### Solidatus representation

The row access policy is represented as an attribute in the `ROW_ACCESS_POLICIES` object.

<figure><figcaption></figcaption></figure>

## Masking Policies

### Example SQL

```sql
create
or
replace
masking policy STATE_MASK as (val string) returns string ->
case
    when current_role() in ('ACCOUNTADMIN') THEN val
    else '***'
end;
```

### Solidatus representation

The row access policy is represented as an attribute in the `MASKING_POLICY` object.

<figure><figcaption></figcaption></figure>

## Enriched Lineage Model

Once the Governance reference model has been built, running the Snowflake connector enriched with the reference model enables you to display policies and tags directly over the Snowflake database structure.

Policies and tags are represented as Solidatus Relationships which allows easy linking to the original Governance reference model.

Along with the linked relationships, a number of pre-defined display rules can be enabled for easy visualisation as shown below. For policies this allows for fast identification of affected downstream columns for the respective policy or tag.

### Solidatus representation

<figure><figcaption></figcaption></figure>
