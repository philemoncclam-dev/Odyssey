# Import JSON structures

The JSON import takes as input an arbitrary JSON file. This is converted into a nested object which describes the structure of the given file.

After selecting an import file or supplying content, the import dialogue provides a common [customisation page](/get-started/import-model-content/customise-imports) that allows you to customise the results of the import.

Each JSON property is converted into an attribute. If the value is itself a JSON object, then a nested group is created.

## Example JSON file import

```json
 {
     "client": {
         "id": "abc123",
         "first_name": "John",
         "last_name": "Smith"
     },
     "amount": 123.0,
     "timestamp": "2019-04-02T14:08:36.441Z"
 }
```

<figure><figcaption><p>The imported object</p></figcaption></figure>
