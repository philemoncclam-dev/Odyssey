# Import model content

It's likely that your first steps in Solidatus will involve importing information stored in external systems or files.

[Connectors](/connectors/connectors-overview) are one solution, as they enable you to scan external tools and extract lineage and other metadata from them into a Solidatus model. See the [Connector Framework](/connectors/connectors-overview/connectors-framework).

However, you can also import data in many widely used formats directly into a model: just select `Import` in the [Model Viewer toolbar](/the-user-interface/models-ui/model-viewer/model-viewer-toolbar).

{% hint style="info" %}
[Exporting model content, editing in an external tool, and reimporting](/models/build-and-edit-models/export-and-reimport-to-edit-model-content) can also be an efficient way to perform bulk editing operations.
{% endhint %}

You can import data in the following formats directly into the Model Viewer:

* Tabular (CSV)
* JSON
* XML
* SPARQL
* Control-M XML
* Informatica XML
* Autosys JIL
* RDF
* SQL

Using the import options available in the Model Viewer, you can import Layers, Objects, Groups, Attributes, Transitions, properties, relationships, or any combination of these. It is possible, for example, to upload a full Lineage model with all of its metadata, just a single Object, or just a property.

{% hint style="success" %}
Importing can be used to create entities, but it can also update entities that already exist.
{% endhint %}

The most generic importers are the tabular (Excel/CSV), JSON, and XML importers.

* The **tabular** importer uses your column headings and values to infer structure, so you may need to structure and clean the data in a spreadsheet before importing.
* The **JSON** and **XML** importers create a single object, which describes the JSON or XML structure - no attempt is made to interpret the content. If you want to import directly into more usable Solidatus entities we suggest you use a suitable tool or create simple scripts to convert the XML or JSON into the Solidatus JSON format.

## **The import process**

There is generally a five-step process to follow when importing content. Some of the more technical importers follow a slightly different process.

<figure><figcaption><p>The five-step import process</p></figcaption></figure>

<table data-header-hidden><thead><tr><th width="219"></th><th></th></tr></thead><tbody><tr><td><strong>Select the Importer</strong></td><td>Select <code>Import</code> in the <a href="/pages/bwf66p0eYCiZRRQX1vJ1">Model Viewer</a> toolbar, and click on the appropriate tile</td></tr><tr><td><strong>Provide content</strong></td><td>Choose a file or Solidatus model, or type / paste content</td></tr><tr><td><strong>Customise the Import</strong></td><td>View warning messages, and fine-tune the import - see <a href="/pages/zzYV2LCJNHd7L3aX9skW">Customise Imports</a></td></tr><tr><td><strong>Preview the outcome</strong></td><td>See how many entities of each type would be added, deleted or updated</td></tr><tr><td><strong>Import the content</strong></td><td>Run the import and update the model</td></tr></tbody></table>

* You can always step back through the process, right up to clicking the `Import` button.
* You should always review the results of the import, and be prepared to [undo the changes](/models/build-and-edit-models/add-and-edit-entities#undo-and-redo) if you’re at all uncertain about the results.
* If you saved the model since you ran the import and you wish to undo the changes, consider [restoring the previous version](/models/build-and-edit-models/version-control#how-to-fully-restore-a-previous-version) of the model.

## **Alternative approaches**

If you are thinking of importing content, you may want to consider several other options, depending on your goals:

* You can create a new model directly from the contents of another model, with or without using an import connection - see [Create model from selection](/models/build-and-edit-models/create-a-new-model#create-model-from-selection) and [Extract source to new model](/models/build-and-edit-models/create-a-new-model#extract-source-to-new-model)
* If you need to replace all the content of your model with all the content of another model, consider exporting a SOL file from the other model and then importing it into your current model - see [Transferring models between Solidatus instances](/additional-resources/advanced-topics/transfer-models-between-instances)
* You can [clone](/models/build-and-edit-models/copy-clone-or-fork-a-model#create-a-clone-of-a-model) a model
* You can use Connectors through our [Connectors Framework](/connectors/connectors-overview/connectors-framework)

## Importing and linking models

With the exception of [importing Solidatus models](/get-started/import-model-content/import-and-link-to-solidatus-models), there is no connection made between the imported source and the content created in Solidatus. You can, of course, repeat the import to update the Solidatus model if the source has changed, but it will not update automatically.

However, when you [import content from a Solidatus Model](#importing-and-linking-content), the imported content is linked back to the source model: content cannot be edited directly in the model it was imported into and must be changed in the source model.

If content is changed in the source model, an [Activity](/models/share-and-collaborate/activities-and-activity-types/activities) called an [Imported Model Update](/models/share-and-collaborate/activities-and-activity-types/import-model-updates) is raised for every model that imported content from the original source model. This activity prompts you to review and merge updates to imported content.

{% hint style="success" %}
If a model that was imported and linked to other models is deleted:

* Previously imported content from the model remains in other models.
* Import Update Activities (whether active or closed) from that model are removed from a user's list of Activities.
  {% endhint %}

## Importers

* [Import from Spreadsheets](/get-started/import-model-content/import-from-spreadsheets)
* [Import JSON Structures](/get-started/import-model-content/import-json-structures)
* [Import XML Structures](/get-started/import-model-content/import-xml-structures)
* [Import from a Solidatus SOL File](/get-started/import-model-content/import-a-sol-file)
* [Import Solidatus JSON](/get-started/import-model-content/import-solidatus-json)
* [Customise Imports](/get-started/import-model-content/customise-imports)
* [Import from Database Schemas](/get-started/import-model-content/import-from-database-schemas)
* [Import and Link to Solidatus Models](/get-started/import-model-content/import-and-link-to-solidatus-models)

## **Further references**

[Export and import models from another Solidatus instance](/additional-resources/advanced-topics/transfer-models-between-instances)

[Export and reimport model content](/models/build-and-edit-models/export-and-reimport-to-edit-model-content)

[Connectors](/connectors/connectors-overview)

[Importing queries from another model](/models/explore-and-analyse-models/filters-and-display-rules#importing-queries-from-another-model)
