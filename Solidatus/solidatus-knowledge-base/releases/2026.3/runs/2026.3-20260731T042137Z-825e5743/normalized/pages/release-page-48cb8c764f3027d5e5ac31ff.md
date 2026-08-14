# Model Output

The MongoDB connector uses MongoDB's API to extract database and collection metadata for the construction of a Solidatus model representative of customers' MongoDB instance.

## Entities

### Layer

A Solidatus layer represents a database on a MongoDB instance.

Layers will have the following properties representing various document metadata. Below is a table of MongoDB metadata properties.

| Property key | Description                                                   | Type    |
| ------------ | ------------------------------------------------------------- | ------- |
| `empty`      | Specifies whether the database is empty.                      | Boolean |
| `name`       | Name of the database.                                         | String  |
| `sizeOnDisk` | Total size of the database files on disk, expressed in bytes. | Integer |

### Object

A Solidatus object represents a collection of documents housed inside a particular database.

Objects will have the following properties representing various document metadata. Below is a table of MongoDB metadata properties.

| Property key          | Description                                                 | Type     |
| --------------------- | ----------------------------------------------------------- | -------- |
| `type`                | Type of data store                                          | String   |
| `name`                | Name of the collection.                                     | String   |
| `options`             | Collection options                                          | Document |
| `info`                | Additional metadata that is currently not explicitly parsed | Document |
| `Number of documents` | Number of documents in the collection                       | Integer  |

### Attribute

Solidatus attributes all represent fields in a document in that collection. Certain fields will have multiple levels of nesting; these represent nested fields in a MongoDB document.

**NOTE** that the fields modeled in the Solidatus model may vary depending on the value of the `--solidatus.mongodb.first-document-only` configuration field. As MongoDB does not specify a schema for a collection. The connector will either read the structure of the first document in the collection or all documents in the collection. It is also important to note that the latter may result in performance concerns.

Attributes will have the following properties representing various document metadata. Below is a table of MongoDB metadata properties.

| Property key    | Description                              | Type           |
| --------------- | ---------------------------------------- | -------------- |
| `type`          | Type of document field                   | String         |
| `Mongo Indexes` | List of indexes that apply to this field | List of string |
