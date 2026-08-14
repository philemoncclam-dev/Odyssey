# Model Browser

The Model Browser lists all models you have at least **Viewer** access to and provides further information about models.

It is the default Solidatus home page: when you log into Solidatus, you first land on the Model Browser, and the **HOME** and **Solidatus logo** buttons in the top navigation bar take you to the Model Browser.

<figure><figcaption></figcaption></figure>

The Model Browser enables you to find and open both Lineage and Reference models, and it also provides quick access to actions like creating a new model and deleting, sharing, and exporting a model.

You can [perform actions](#model-actions) on one or several models at once using the checkboxes to the left of models in the list.

## How to access the Model Browser

The Model Browser is the default home page in Solidatus: it automatically opens when you log into Solidatus, and it is the landing page when you click the **Solidatus logo** or **HOME** in the top navigation bar.

<figure><figcaption></figcaption></figure>

## Model Browser interface

The Model Browser is a customisable table listing all Lineage and Reference models you have at least **Viewer** (read-only) access to. It allows you to perform several actions involved in managing and interacting with models, such as exporting, sharing, and deleting one or several models at a time.

<figure><figcaption><p>The Model Browser interface</p></figcaption></figure>

1. Buttons for [auto-mapping across two models](/models/build-and-edit-models/automap-transitions#auto-map-across-models) (**Map models**) or creating a new model (**Create**). Use the **three-dots** menu to import a SOL file and export the model list in CSV format.
2. Filter the model list to include both Lineage and Reference models, Lineage models only, or Reference models only.
3. Search the model list to find models whose name contains your search text.
4. List customisation tools:

* **Favorite** toggle — filters the model list to show only models you've added to favorites.
* **Gear wheel** — opens a menu for adding, removing, or rearranging columns.
* **PRESERVE VIEW** — saves the current layout of your model list (this includes column layout and any applied filters or sorting criteria, including whether Favorites filter is active).

5. Select a checkbox next to one or several models to open a banner above the model list with [action buttons](#model-actions): **Favorite**, **Edit tags**, **Delete**, **Share**, **Export**. Visible action options depend on model permissions and the action applies to all selected models.

## Model Browser actions

Several actions are available through buttons at the top-right of the Model Browser:

<figure><figcaption><p>Action options</p></figcaption></figure>

* Click **Map models** to open a tool for auto-mapping lineage across two models (see [Auto-map lineage](/models/build-and-edit-models/automap-transitions#auto-map-across-models) for documentation).
* Click **Create** to [create a new lineage or reference model](/models/build-and-edit-models/create-a-new-model).
* Click the **three-dots** for options to [import a SOL file](/get-started/import-model-content/import-a-sol-file) to create a new model or export the current model list as a CSV file.

### Import a .SOL file

Importing a .SOL file is used specifically for transferring a model between Solidatus environments (see the page on [importing a SOL file](/get-started/import-model-content/import-a-sol-file) for full documentation).

For sharing or copying models within the same instance, we recommend using either built-in [sharing and permissions](/models/share-and-collaborate/model-roles-and-permissions) functionality or using [forks or clones](/models/build-and-edit-models/copy-clone-or-fork-a-model) to create a copy of an existing model.

### Export the model list

Exporting the model list downloads a CSV file containing columns with the values shown below for all models in the current list.

{% hint style="info" %}
The export includes models from every page (not just the page you’re viewing), and it includes only models that match your current filters—including Favorites. The export also matches the current sort order.
{% endhint %}

* Model ID and name
* Public (shared) tags
* Personal tags
* Owners, authors, and viewers
* Number of revisions
* Number of unresolved activities
* Number of entities in the model
* When the model was created and last updated
* How many users have "starred" the model

## Customise the model list

The Model Browser is a table with a row for each model you have at least **Viewer** access to.

You can customise the model list in a number of ways:

* Add, remove, and rearrange the column order (**Gear wheel** button)
* Filter and sort the list (Hover your mouse over a column heading to see buttons for these options)
* Preserve customisations as default so the list opens the same way next time (**PRESERVE VIEW** button)

{% hint style="success" %}
The default sorting criteria for the model list is the "Last Viewed" time and date. Models viewed most recently are at the top of the list.
{% endhint %}

### Add, remove, and rearrange columns

Click the **Gear wheel** at the top right of the table to add, move, or rearrange model list columns.

**Add and remove columns**

Select the checkbox next to columns in the dropdown menu to include them; deselect them to remove them from the model list table.

<figure><figcaption></figcaption></figure>

**Rearrange column order**

Click and hold the two lines to the left of a column, then drag them up or down in the menu to change the column order—higher items are on the left in the table, and lower items are on the right.

<figure><figcaption></figcaption></figure>

### Preserve customised layout

The **PRESERVE VIEW** button allows you to save changes you've made to the model list table, so the changes persist as the default settings whenever you refresh or return to the Model Browser.

<figure><figcaption></figcaption></figure>

The **PRESERVE VIEW** function stores:

* Visible/hidden columns
* Column order
* Applied sort criteria
* Applied filters (including Favorites filter)

### Filter and sort models

The list of models can be filtered or sorted by column values. Some column values can be used for filtering, some for sorting.

To find out which options are available for a particular column, hover your mouse over the column label to find buttons for filtering and sorting.

<figure><figcaption></figcaption></figure>

<table data-header-hidden><thead><tr><th width="127.170166015625"></th><th></th></tr></thead><tbody><tr><td></td><td>Sort in descending order. Once selected, arrow turns upside down to allow you reverse to ascending order.</td></tr><tr><td></td><td>Open a dropdown menu with available values to use as filters. When using filters, models appear in the list if they satisfy <strong>any</strong> selected filter.</td></tr></tbody></table>

**The following columns allow filtering**

* Tags
* Data domains
* Owners
* Groups

**The following columns allow sorting**

* Name - sort in alphabetical order
* Last modified - sort by date
* Last viewed - sort by date
* Created - sort by date

## Model list hover menu

Hover over the name of a model to view additional buttons that give you access to useful features.

<figure><figcaption></figcaption></figure>

<table><thead><tr><th width="114.24072265625"></th><th></th></tr></thead><tbody><tr><td></td><td>Open side peek information panel</td></tr><tr><td></td><td>Open the model actions context menu</td></tr><tr><td></td><td>Select the star to add the model to Favorites</td></tr></tbody></table>

### Side peek panel

The model information side panel gives you key information about a model and has buttons at the top of adding tags and at the bottom for opening the model in the Model Overview or Model Viewer.

The side peek panel contains information about a model, including access and ownership, contents, and reference relationships.

<figure><figcaption></figcaption></figure>

**Side peek panel actions**

* Add or edit model tags using the **+ ADD TAG** button at the top, under the model name (only available for model Owners and Authors).
* Sections can be expanded or collapsed
* Open the Model Overview from the **OPEN OVERVIEW** button at the bottom
* Open the model itself from the **VIEW MODEL** button at the bottom

### Context menu

<figure><figcaption></figcaption></figure>

**Context menu actions**

* Open viewer — Open the model in the [Model Viewer](/the-user-interface/models-ui/model-viewer) canvas
* Open model overview — Open the [Model Overview](/the-user-interface/models-ui/model-overview) of the model
* Open graph — Open the model in the [Graph explorer](/models/explore-and-analyse-models/graph-explorer)
* Open lineage explorer — Open the model in the [Lineage explorer](/models/explore-and-analyse-models/lineage-explorer)

## Model actions

The check boxes to the left of each Model name allow you to perform actions on one or several models at a time.

<figure><figcaption><p>Actions on multiple Models</p></figcaption></figure>

Note that actions available depend on your model role and permissions. If you are an Author or Viewer on a selected model, only the **Favorite** and **Export** options are available.

{% hint style="info" %}
If you select multiple models and see fewer capabilities than shown here, that’s because you don’t have the required privileges on all selected models.
{% endhint %}

<table data-header-hidden><thead><tr><th width="122.77902221679688"></th><th></th></tr></thead><tbody><tr><td><strong>Favorite</strong></td><td>Start the selected models to add them to your favorites. You can then use the Favorites toggle to filter the list.</td></tr><tr><td><strong>Edit tags</strong></td><td>Edit the tags for one or more Models</td></tr><tr><td><strong>Delete</strong></td><td>Delete one or more Models - a deleted Model cannot be restored</td></tr><tr><td><strong>Share</strong></td><td>Displays a list of the users and groups that have access to <strong>all</strong> selected Models, allowing you to select more users or groups to share them with. When shared this way, users and groups are given the Viewer role on a model. This can only be changed in the settings for each model.</td></tr><tr><td><strong>Export</strong></td><td>Create a single SOL file (a file in Solidatus JSON) containing all selected models, plus (optionally) any reference models they have relationships with. This is useful for transferring models between Solidatus instances. It is not a recommended way of sharing models within an instance; to do that, use the built-in sharing and forking functionality. It is also not intended to be opened outside of Solidatus; to do that, export the model to CSV or JSON from inside the Model Viewer.</td></tr></tbody></table>

{% hint style="success" %}
To select or deselect all models in the list, use the top checkbox next to the **Name** column.
{% endhint %}

## Model tags

Tags are free-form labels that you apply to models, revisions, and activities that allow you to categorise them in whatever way is useful to you.

Model tags are displayed (and can be edited if you have the privilege) in the [Model Browser](/the-user-interface/models-ui/model-browser) and the [Model Overview](/the-user-interface/models-ui/model-overview), and can be used to filter models in the Model Browser.

See [Model tags](/the-user-interface/models-ui/model-tags) for more information and instructions.
