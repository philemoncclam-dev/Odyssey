# Import Solidatus JSON

The JSON format is useful for importing information directly into recognisable Solidatus entities.

After selecting an import file or supplying content, the import dialogue provides a common [customisation page](/get-started/import-model-content/customise-imports) that allows you to customise the results of the import.

A Solidatus JSON file can contain three properties: `entities`, `layers` and `transitions`.

* `entities` – an object mapping IDs to entity definitions.

  There is one entry for each layer, object, group and attribute. Entity definitions can have three properties:

  * `name` – the name of the layer, object, group or attribute
  * `properties` – an object mapping property keys to property values
  * `children` – an array of child IDs also defined in the entities array in this file
* `layers` – an array of IDs of layers defined in the entities object in this file
* `transitions` – an object mapping transition IDs to transition definitions.

  Transition definitions can have three properties:

  * `source` – an attribute ID also defined in the entities array in this file
  * `target` – an attribute ID also defined in the entities array in this file
  * `properties` – an object mapping property keys to property values

## Creating a sample JSON file by exporting an existing model

The example below was created by exporting a simple model as JSON from Solidatus.

To export to JSON:

* Click export in the toolbar
* Click JSON
* Click next

Example Solidatus JSON file

```json
{
  "entities": {
    "LYR-8MHv6G4I": {
      "name": "Source layer",
      "properties": {},
      "children": [
        "OBJ-7sp7Qd5E"
      ]
    },
    "OBJ-7sp7Qd5E": {
      "name": "Object 1",
      "properties": {
        "Owner": "Dan"
      },
      "children": [
        "ATR-zUHTUzVz",
        "ATR-uXpkEsrE"
      ]
    },
    "ATR-zUHTUzVz": {
      "name": "FirstName",
      "properties": {
        "DataType": "string"
      }
    },
    "ATR-uXpkEsrE": {
      "name": "LastName",
      "properties": {
        "DataType": "string"
      }
    },
    "LYR-uP5Qa3Au": {
      "name": "Target layer",
      "properties": {},
      "children": [
        "OBJ-jkFDy8MP"
      ]
    },
    "OBJ-jkFDy8MP": {
      "name": "Object 2",
      "properties": {
        "Owner": "Dan"
      },
      "children": [
        "ATR-geGbKTCp"
      ]
    },
    "ATR-geGbKTCp": {
      "name": "FullName",
      "properties": {
        "DataType": "string"
      }
    }
  },
  "layers": [
    "LYR-8MHv6G4I",
    "LYR-uP5Qa3Au"
  ],
  "transitions": {
    "TRAN-Eac1tp1B": {
      "source": "ATR-zUHTUzVz",
      "target": "ATR-geGbKTCp",
      "properties": {}
    },
    "TRAN-DIU8EzhT": {
      "source": "ATR-uXpkEsrE",
      "target": "ATR-geGbKTCp",
      "properties": {}
    }
  }
}
```

<figure><figcaption><p>The imported model</p></figcaption></figure>
