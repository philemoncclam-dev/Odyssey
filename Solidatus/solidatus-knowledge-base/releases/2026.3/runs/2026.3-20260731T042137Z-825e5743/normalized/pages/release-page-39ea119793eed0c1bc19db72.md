# Snowflake Tags

Tags are represented as Solidatus Objects in the `TAGS` layer. `Tag Names` are shown as Objects with the `Tag Values` as attributes nested in the `Tag Name`. Each Tag Name will contain relevant Snowflake metadata including:

* `ALLOWED_VALUES`: A list of pre-defined tag values
* `TAG_OWNER`: Who created the tag
* `TAG_SCHEMA`: Which schema the tag was defined in
* And more...

Once a tag has been created it can be applied to a Snowflake column using an `ALTER TABLE` statement and providing the specifying the tag value.

### Example SQL

```sql
create
tag ISO_GEOGRAPHY_CODES
    allowed_values 'COUNTRY_CODE', 'COUNTRY_SUBDIVISION_CODE', 'FORMER_COUNTRY_CODE'
```

### Solidatus Representation

<figure><figcaption></figcaption></figure>

## Enriched Lineage Model

Once the Governance reference model has been built, running the Snowflake connector enriched with the reference model enables you to display policies and tags directly over the Snowflake database structure.

Policies and tags are represented as Solidatus Relationships which allows easy linking to the original Governance reference model.

Along with the linked relationships, a number of pre-defined display rules can be enabled for easy visualisation as shown below. For tags display rules can represent the `Tag Name` and `Tag Value` directly on the `Column` in the model.

### Solidatus representation

<figure><figcaption></figcaption></figure>
