# Transfer models between instances

It is possible to transfer models between Solidatus instances. You can export multiple Lineage (and/or Reference) models with the queries/views, reference relationships and full linked Reference models all in a single action. The resulting SOL file (.sol) can then be imported into another instance.

You can also import the SOL file back into the original instance, for example under a different user account. However, this is not a recommended way of collaborating on models. Importing a SOL file of a model when it already exists on an instance will entirely overwrite the existing model with the imported model.

To distribute models among users on the same Solidatus instance, you should use the built-in [sharing and forking functionality](/models/share-and-collaborate). The export is also not intended to be opened outside of Solidatus, to do that you should export the model to CSV or JSON from inside the [Model Viewer](/the-user-interface/models-ui/model-viewer).

All the steps below are applicable for exporting both lineage models and reference models.

{% hint style="success" %}
SOL file imports are for transferring models between instances and are not intended for cloning models in the same instance.

The first time you import a SOL file that contains links to Reference models, the Reference models will be created (with a special metadata item that is not visible in UI); subsequent imports referencing these Reference models will not create new ones, they will link to the Reference models created by the first import.
{% endhint %}

## Export a single model

On the Model Overview of the model you want to export, expand the ‘Actions’ tab and press ‘Export’:

<figure><figcaption><p>Export a model to a file from the Model Overview</p></figcaption></figure>

This will start an automatic download of the SOL file export that will include the Model, as well as any Reference Models used by that Model.

{% hint style="success" %}
The list of actions shown here is short - the user is only a Viewer of the model, so is unable to carry out any actions that could update the model.
{% endhint %}

## Export multiple models

1. In the Model Browser, select one or more models that you wish to export.
2. Click ‘Export’ from the options section in the navigation bar.

<figure><figcaption><p>Export multiple models to a file from the Model Browser</p></figcaption></figure>

1. Decide whether you wish to export the referenced models that the reference relationships of the selected models link to. Confirm by pressing the ‘Export’ button to initiate the SOL file download.

<figure><figcaption><p>Export multiple models to a file from the Model Browser - confirmation dialogue</p></figcaption></figure>

## Export a specific revision as a SOL file

Version control stores the history of saved changes to a model as revisions. You can also export a past revision of a model as a SOL file.

To do this:

> * Go to the `REVISIONS` tab on the Model Overview of the model.
> * Find the revision you would like to export
> * Click the `ACTIONS` button on the right-hand side of the revision entry
> * Select `Export model as .sol file`

<figure><figcaption><p>Export a revision of a model as a SOL file</p></figcaption></figure>

## Model creation/match rules on import

Whether you are importing into a different Solidatus instance or the same instance, the following rules apply to matching or creating imported models. These happen for each import for each user individually.

When a model is imported, the possible import type can be one of three:

* **Created** This model has not been imported before by the current user. It is created anew.
* **Matched** This model has been imported before. The contents of the model are replaced with what the SOL file contains.
* **Imported Into** The model contents were replaced with the model from the SOL file. This only happens when you import from the Model Overview.

{% hint style="success" %}
If you import a SOL file of a model that you are the sole owner of, the import will entirely overwrite the existing Model. Similarly, if you are the sole owner of a model and you re-import a SOL file of that model, you will also entirely overwrite the previously imported Model.

Note that importing the SOL file of a model you co-own, or have Owner permissions to via a Group, will not overwrite the existing model; instead, it will create a new model that you are the sole owner of. If you then re-import the model, the above warning applies.
{% endhint %}

## Import a SOL file

You can create a new model from a SOL file directly from the Model Browser. This will not open the original Model; instead, it will create an exact copy on your instance.

1. In the Model Browser, click the spoked-wheel icon next to the `Create` button in the top right. In the dropdown menu, select ‘Import SOL file’.
2. Select whether you’d like to skip the import of any referenced models found within the SOL file. Note this does not mean any explicitly exported reference models, only reference models that were included due to the ‘include referenced models’ flag being true during exporting.
3. Drag and drop or click and select the SOL file you wish to import.

<figure><figcaption></figcaption></figure>

1. On success, an import overview page will show you the imported lineage/reference models and their import type (Created, Matched).

<figure><figcaption><p>Import multiple models to a file from the Model Browser - overview dialogue</p></figcaption></figure>

## Replace a model with a SOL file

It is possible to import the contents of the SOL file directly into an existing Model (which may not have originally been imported). This will replace the contents of the target Model with the contents of the SOL file. It also requires the SOL file to contain only a single lineage or reference model. It may, however, contain one or more linked reference models.

1. On the Model Overview of the model you want to import into, expand the ‘Actions’ tab and select Import. This will open a similar dialogue to that from the Model Browser.

<figure><figcaption><p>Replace a Model with the contents of a file</p></figcaption></figure>

2. Now follow the same instructions from step 2 above. The file contents will however be imported directly into the model.

<figure><figcaption><p>Import multiple models to a file from the Model Overview page - overview dialogue</p></figcaption></figure>

The overview page will show the ‘Imported Into’ import type next to the target model.

## Export/import as BSON (Deprecated)

It is still possible to export and import to/from a BSON file.

* **To export** On the Model Overview of the model you want to export, expand the ‘Actions’ tab and press Export to BSON.
* **To import** BSON files can only be imported into a particular model. Hence, from the Model Overview of the model you want to import into, expand the ‘Actions’ tab and press Import. Then click ‘Go to BSON importer’ at the bottom of the dialogue and drag or click to select BSON file to import.

{% hint style="success" %}
BSON exports do not include Reference relationships and related Reference models.
{% endhint %}
