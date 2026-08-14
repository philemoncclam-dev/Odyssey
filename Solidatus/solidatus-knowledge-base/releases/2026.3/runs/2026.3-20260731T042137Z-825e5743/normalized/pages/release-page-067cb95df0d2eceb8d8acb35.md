# Document Viewer

The Document Viewer is a feature inside the Model Viewer that allows you to view and export the contents of a single Model Layer as a text document.

<figure><figcaption><p>View/Export your Model as a Text Document</p></figcaption></figure>

The exportable content in the Document Viewer window can be customised: you choose which properties to include, the font size and style used for entity names and property values, and the order in which you want property values displayed.

The Document Viewer displays one single Layer at a time. It will display the Layer that is currently active in the Model Viewer (e.g. an entity within the Layer has been selected), but you can also choose a Layer to display from the drop-down menu at the top of the Document Viewer window.

If you select an entity in the Model Viewer, it will be selected in the Document Viewer and vice versa, which offers an intuitive way to locate and examine entities in your Model.

The active content of the Document Viewer can be downloaded as a [Markdown file](https://en.wikipedia.org/wiki/Markdown), which can be edited further or converted to another format for document design in a word processor.

{% hint style="success" %}
While the Document Viewer is available for every Solidatus Model, it’s likely to be especially useful for visualising and exporting the text content of [Reference Models](/models/understand-solidatus-models/reference-models-101), which often contain business glossaries, regulatory or policy documents, and data dictionaries.
{% endhint %}

## Open the Document Viewer

The Document Viewer can be opened from the Document Viewer panel in the Inspector tab in the [sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab).

Click `View Model as Document` to open the Document Viewer in a new window to the right of the sidebar.

{% hint style="success" %}
You can increase the width of the Document Viewer window by hovering your mouse over the left margin until the mouse pointer turns into widendocviewer. Then click the left mouse button and drag the divider sideways.

You can also drag the Document Viewer panel out of the Inspector tab and close the sidebar to rearrange your workspace and view more of the Model alongside the Document Viewer and Document Viewer panel.
{% endhint %}

<figure><figcaption><p>The Document Viewer</p></figcaption></figure>

{% hint style="success" %}
The Document Viewer ignores active filters and display rules; it displays all entities whose type is selected to `Show` in the Document Viewer panel.
{% endhint %}

When you first open the Document Viewer, the names of all entities in a single Layer will be displayed. You can select which Layer is displayed by clicking the drop down menu at the top right of the Viewer window or by selecting an entity in the Model Viewer.

The contents of the Layer are shown in the same sequence as they are in the Model Viewer, with selected Properties (if any) shown beneath the entity that owns them.

By default, Layer names are displayed in the largest heading, followed by Object names as the second largest, and finally Group and Attribute names as the smallest. Property values are initially shown in plain text. However, the style of all entity names and property values is customisable (see [Customise text styles](#customise-text-styles)).

<figure><figcaption><p>Options in the Document Viewer panel</p></figcaption></figure>

## Customise your document

The Document Viewer panel allows you customise your Document in a number of ways:

> * Select which entity types to hide/show in the document
> * Display property values belonging to specific entity types
> * Choose order in which property values are displayed
> * Change text size and style for each text source (see [Customising Document Viewer Text Styles](#customising-document-viewer-text-styles)).

<figure><figcaption><p>The Document Viewer Panel</p></figcaption></figure>

{% hint style="success" %}
Document Viewer settings are saved when you save a Model. The Document Viewer opens with the settings that were selected when the Model was last saved.
{% endhint %}

To **Hide** a text source listed in the panel, click the box labeled `Show` to uncheck it.

You can **Hide** any entity type name or any property value in the list, and you can remove an item from the list by clicking the `Bin`.

{% hint style="success" %}
While you can show or hide Layer, Object, Group, and Attribute names in the Document Viewer, you cannot rearrange the hierarchical order in which they are displayed.
{% endhint %}

The Document Viewer displays entity type names in the order in which they appear in the Model. To rearrange the order of entity names in the Document Viewer, you must rearrange the entities in the Model Viewer.

Property values are displayed in the order in which they appear in the Document Viewer panel. However, you can choose the order in which property values are displayed by clicking and dragging the six dots to the left of the property name in the panel.

## Display property values in the Document Viewer

To add property values to the document, click `ADD TEXT SOURCE` underneath any of the entity types (Layer, Object, Group, or Attribute).

<figure><figcaption></figcaption></figure>

Click the empty text source field to open a list of properties that have been assigned in this Model.

Click a property to display the value of that property just below the entities it has been assigned to.

You can then choose whether to display the property values only for specific entity types in the Document Viewer.

<figure><figcaption><p>Customising your Document</p></figcaption></figure>

{% hint style="success" %}
Property values will always be displayed in the Document Viewer in the order in which they appear in the `Text source` list. Click and drag the six dots next to a text source to rearrange the order of the list.
{% endhint %}

## Customise text styles

You can choose the font size and style individually for all entity names and property values in the each `Text source` list.

<figure><figcaption></figcaption></figure>

The possible text styles to choose from are:

| Heading 1     |
| ------------- |
| Heading 2     |
| Heading 3     |
| Plain Text    |
| **Bold Text** |
| *Italic Text* |
| Markdown      |

The default styles are:

<table data-header-hidden data-full-width="false"><thead><tr><th width="373.6158447265625"></th><th></th></tr></thead><tbody><tr><td>Layer name</td><td><em>Heading 1</em></td></tr><tr><td>Object name</td><td><em>Heading 2</em></td></tr><tr><td>Group name</td><td><em>Heading 3</em></td></tr><tr><td>Attribute name</td><td><em>Plain Text</em></td></tr><tr><td>Property value</td><td><em>Plain Text</em></td></tr></tbody></table>

## Save Document Viewer settings

The active Document Viewer settings are stored every time you save a Model.

The particular Layer that is displayed is not stored, so you may have to select it again to return to specific content from a previous session.

## Navigate a model using the Document Viewer

The Document Viewer can be a useful tool for navigating your model and finding entities: when the Document Viewer is open, selecting a line in the Viewer will select that entity in the Model and vice-versa.

You can only select one entity at a time in the Document Viewer, but if you select multiple entities in your model, they will all be highlighted in the Document Viewer.

## Export Document Viewer content

The content visible in the Document Viewer can be exported as a text file in MarkDown format, which can be converted into other formats for further editing and document design.

<figure><figcaption><p>Download as Markdown file</p></figcaption></figure>

Click the `Download` icon at the top of the Document Viewer window to download the current contents of the Viewer as a Markdown file.

## Close the Document Viewer

Closing the Document Viewer is very simple to do - just click the `Close Document Viewer` button at the top of the Document Viewer panel.

<figure><figcaption><p>Close the Document Viewer</p></figcaption></figure>

You can also close the Document Viewer by clicking the `X` in the top right corner of the Document Viewer

(*Note*: if you see an `X` in the top right of the Document Viewer panel, it means you’ve removed the panel from the sidebar. Clicking that `X` will return it to the sidebar.)

{% hint style="success" %}
Before closing the Document Viewer, remember to save the Model if you want to return to the same Document Viewer settings!
{% endhint %}
