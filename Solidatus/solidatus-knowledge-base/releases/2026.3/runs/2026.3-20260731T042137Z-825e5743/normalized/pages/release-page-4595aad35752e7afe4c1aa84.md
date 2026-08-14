# Inspector tab

The Inspector tab provides information about the currently selected entity or entities. It contains the panels described individually below.

{% hint style="success" %}
The Relationships to Selected Term panel only appears if you are viewing a Reference Model.
{% endhint %}

| [The Selection Panel](#the-selection-panel)                                           |
| ------------------------------------------------------------------------------------- |
| [The Properties and Relationships Panel](#the-properties-and-relationships-panel)     |
| [The Relationships to Selected Term Panel](#the-relationships-to-selected-term-panel) |
| [The Transitions Panel](#the-transitions-panel)                                       |
| [The Entity History Panel](#the-entity-history-panel)                                 |
| [The Document Viewer Panel](#the-document-viewer-panel)                               |

## The Selection panel

The Selection panel gives you details about the currently selected entity or entities.

At the top, you can see the **path** of the entity, which is made up of all higher-level entities that contain the selected entity. For example, if the selected entity is an Attribute, the path will contain the Layer, Object, and Group(s) - in the order of highest to lowest level - that contain the selected Attribute.

The panel also lists the selected entity’s Name, Type, Entity ID, and number of Children along with any display rules applied to it.

<figure><figcaption><p>One Entity Selected</p></figcaption></figure>

If you select more than one entity in the Model Viewer, the Selection panel will tell you how many of each type of entity you have selected (ignoring any entity types you have not selected).

<figure><figcaption><p>Multiple Entities Selected</p></figcaption></figure>

## The Properties and Relationships panel

The Properties and Relationships panel is for viewing and editing the properties of a selected entity/entities, and for creating, viewing, and removing [Reference Relationships](/models/build-and-edit-models/add-and-edit-reference-relationships).

{% hint style="success" %}
See the [Add and Edit Properties](/models/build-and-edit-models/add-and-edit-properties) page for a more extensive discussion of how to create and use properties.

See [Add and Edit Reference Relationships](/models/build-and-edit-models/add-and-edit-reference-relationships) for an extensive discussion of creating and editing Reference Relationships using this panel.
{% endhint %}

<figure><figcaption><p>View and edit properties and relationships</p></figcaption></figure>

The default view of the `Properties and Relationships` section in the Sidebar can be amended in several useful ways:

* choose between vertical and horizontal layouts
* disable folder layout
* float the section by dragging it away from the Sidebar

<figure><figcaption><p>Dropdown menu for Properties and Relationships</p></figcaption></figure>

### **Vertical and horizontal layouts**

| **Horizontal view of Properties**                                           | **Vertical view of Properties - can avoid truncating property names**     |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ../../../\_images/horizontal-properties.png | ../../../\_images/vertical-properties.png |

***

### **Expanded and compact relationship layouts**

The dropdown menu for the Relationships section of the `Properties and Relationships` panel allows you to choose between the *expanded* and *compact* layouts for the section; the default view is the *expanded* layout.

<figure><figcaption><p>Expanded view of Relationships - click the Model name to open it</p></figcaption></figure>

<figure><figcaption><p>Compact view of Relationships - hover over the <strong>i</strong> to see the Model name</p></figcaption></figure>

### **Expanded and compact relationship layouts**

The dropdown menu for the Relationships section of the `Properties and Relationships` panel allows you to choose between the *expanded* and *compact* layouts for the section; the default view is the *expanded* layout.

<figure><figcaption><p>Expanded view of Relationships - click the Model name to open it</p></figcaption></figure>

<figure><figcaption><p>Compact view of Relationships - hover over the <strong>i</strong> to see the Model name</p></figcaption></figure>

## The Relationships to Selected Term panel

The Relationships to Selected Term panel will only appear in the Inspector Tab if you are viewing a Reference Model.

View a list of existing relationships to a single Reference Term by selecting a Term in the Model Viewer and clicking `Load Usage` in the Relationships to Selected Term panel.

Clicking `Load Usage` generates a table that lists the Label, Model, and Entity to which the Term is related for each existing relationship to the selected Term.

<figure><figcaption><p>Load usage for a single selected Reference Term</p></figcaption></figure>

<figure><figcaption><p>List of relationships to a selected Reference Term</p></figcaption></figure>

## The Transitions panel

The Transitions panel is for viewing and selecting the incoming and outgoing transitions of a single selected entity and its children.

The panel lists all source entities with transitions to the selected entity or its descendants (i.e. the selected entity or descendants are targets) and all target entities receiving transitions from the selected entity or its descendants (i.e. the selected entity or descendants are sources).

<figure><figcaption><p>The Transitions panel</p></figcaption></figure>

### Transition actions

Hover your mouse over an entry in the Transitions Panel to see a set of buttons appear on the right hand side of the entry:

* bin-icon - Delete the Transition
* pointer-icon - Select the Transition
* arrows-icon - Reverse the direction of the Transition

{% hint style="success" %}
Selecting a transition using the pointer-icon button is very useful when Transitions overlap and intersect with other Transitions.
{% endhint %}

More useful things you can do using the Transitions panel are:

> * Hover over a source or target entry to highlight the Transitions in red in the Model Viewer.
> * Click on the name of a source or target entity in the list to select that entity in the Model Viewer
> * Switch between lists of **combined** or **direct** Transitions.

<table data-header-hidden><thead><tr><th width="145"></th><th></th></tr></thead><tbody><tr><td><strong>Direct</strong></td><td>Lists the entities that are directly connected to the selected entity <strong>or its descendants</strong>.</td></tr><tr><td><strong>Combined</strong></td><td>Combines all transitions to and from descendants into single transitions to and from parent entities.</td></tr></tbody></table>

## The Entity History panel

The Entity History panel shows the history of all **saved** changes to a selected entity.

<figure><figcaption><p>History of saved changes to selected entity</p></figcaption></figure>

## The Document Viewer panel

The Document Viewer is used to view and export the full contents of a Model Layer in the format of a text document.

From the Document Viewer panel, you can open the Document Viewer and customise its contents. See the [Document Viewer](/models/explore-and-analyse-models/document-viewer) page for full information.

<figure><figcaption></figcaption></figure>
