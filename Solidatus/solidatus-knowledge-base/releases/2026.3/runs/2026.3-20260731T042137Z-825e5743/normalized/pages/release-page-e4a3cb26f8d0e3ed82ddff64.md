# Add and edit entities

Model content can be edited in the [Model Viewer](/the-user-interface/models-ui/model-viewer) by model owners and authors, as well as users that have been assigned to [Tasks](/models/share-and-collaborate/activities-and-activity-types/tasks).

Unless [restricted by a Task](/models/share-and-collaborate/activities-and-activity-types/tasks#restricting-the-scope-of-a-task), a user can edit any part of a model that has not been imported from another model. Transitions can be added to content that has been imported from another model - see [working with imported content](/get-started/import-model-content/import-and-link-to-solidatus-models#working-with-imported-content).

There are several ways to add and edit Model content:

* Using the keyboard and mouse to manually edit in the Model Viewer
* [Importing model content](/get-started/import-model-content)
* Ingesting content using [Connectors](https://github.com/solidatus/Solidatus-docs-gitbook/blob/stable/solidatus-core/models/build-and-edit-models/broken-reference/README.md)

This page focuses on how to add and edit a model manually using keyboard and mouse functions in the Model Viewer.

{% hint style="success" %}
A useful way to edit entities in bulk is to [export model content](/models/explore-and-analyse-models/export-model-content), edit it in a format of your choice (i.e., CSV, JSON, spreadsheet) and then reimport it. To learn how to export and reimport, visit .
{% endhint %}

## Add content to a model

Your keyboard can be used to navigate your way around a model, [select entities](#select-entities), [rename](#rename-entities) a single selected entity, [undo and redo](#undo-and-redo), and [delete](#delete-entities) selected entities, but it cannot be used to add content to your model - for this you will need to use your mouse, trackpad or touchscreen.

## Context menus

If you right-click anywhere in the Model Viewer one of three context menus will appear.

> 1. If you click to the right of any existing layers in the model, the context menu will allow you to add a new layer or paste from the clipboard.
> 2. If multiple entities are selected and you right-click one of them, the context menu provides actions that will apply to every selected entity. Notice, for example, that there are no options for inserting new content. The options outlined by boxes are explained on this page.

<figure><figcaption><p>These actions will apply to every selected entity</p></figcaption></figure>

> 3. If you right-click a single entity, you will see a longer menu, with some options grouped together. The options outlined by boxes are explained on this page.

<figure><figcaption><p>These actions will apply to one entity – in this case, an Object</p></figcaption></figure>

## Add Layers

To create a Layer in your Model, simply right click in an empty part of the model and select the “Add Layer” option from the context menu.

Alternatively, right-click a Layer (being careful not to right-click any of the Entities within the Layer) and select the “Add layer before” or “Add layer after” option from the context menu.

After you have created a Layer, it will automatically be labelled as “Unnamed”. To replace this name, simply overtype the name as soon as the Layer is created.

## Add Objects

A Layer contains Objects. An Object is a top-level entity within a Layer, and generally contains Attributes. Attributes that contain their own Attributes are referred to as Group Attributes.

Objects typically represent systems, or tables, or departments, or processes, depending on what the layer represents.

To add an Object to a Layer, right click on the Layer and select “Add object” from the context menu. An Object will be added to the Layer at the location you clicked – this may be between two existing Objects.

{% hint style="success" %}
The selected Layer will be highlighted in blue – make sure you clicked on the right one!

Press \<enter> after typing the Object name to create another “Unnamed” Object
{% endhint %}

A newly created Object will automatically be named “Unnamed”. To replace this name, simply overtype the name as soon as the Object is created.

## Add Attributes

To add a new Attribute to the end of the list of Attributes for an Object, right click on the Object you’d like to add it to and select “Add attribute” from the context menu.

A newly created Attribute will automatically be labelled as “Unnamed”. To replace this name, simply overtype the name as soon as the Attribute is created.

{% hint style="success" %}
Press \<enter> after typing the Attribute name to create another “Unnamed” Attribute.
{% endhint %}

## Add Groups (also referred to as Group Attributes)

A Solidatus Layer can have more than two levels of content (i.e., Objects and Attributes). Attributes can also contain other Attributes, which can themselves contain Attributes, which can contain Attributes, and so on ad infinitum. There is no limit to the number of levels of Attributes within Attributes, and so no limit to the number of levels in a hierarchy.

<figure><figcaption></figcaption></figure>

An Attribute inside another Attribute is called a **nested Attribute**, and an Attribute that contains nested Attributes is called a **Group** or **Group Attribute**. In other words, it’s still an Attribute, but an Attribute that contains nested Attributes.

An Attribute that contains nested Attibutes (i.e. a Group Attribute) is indicated by a drop-down arrow on the left-hand side. Click the arrow to view the nested Attributes inside.

To add a nested Attribute, right click on the Attribute you’d like to add it to and select “Add nested attribute” from the context menu. To add subsequent levels of nested Attributes, right click on a nested Attribute and select “Add nested attribute” from the context menu.

A newly created Attribute will automatically be labelled as “Unnamed”. To replace this name, simply overtype the name as soon as the Attribute is created.

{% hint style="success" %}
Press \<enter> after typing the Attribute name to create another “Unnamed” Attribute.
{% endhint %}

## Add an Attribute at a specified location

The previous instructions have shown you how to add an Attribute to the end of a list of Attributes. Very often, you’ll want to insert an attribute in between two existing attributes. To do this, right click on an Attribute and select “Add attribute before” or “Add attribute after” from the context menu.

{% hint style="info" %}
Press \<enter> after typing the Attribute name to create another “Unnamed” Attribute.
{% endhint %}

## Add Transitions

It takes just two clicks to create a transition from a *source* entity to a *target* entity. The source and target entities can be any combination of Objects or Attributes.

1. Click on the small square at either edge of the source entity - it will turn blue
2. Solidatus indicates potential target entities for the transition by presenting green squares alongside similar entity names in Layers either side of the current Layer - dark green squares are a closer match than pale green squares. The green squares will appear to the right or left of the entity you clicked, depending on which end of the entity you clicked on, though you can connect your Transition to any entity anywhere in the model. The green squares will only appear on the same type of entity as the one you clicked on.

<figure><figcaption><p>Green squares indicate possible matches</p></figcaption></figure>

3. Click on the small square at either edge of the target entity
4. A Transition will be created, linking the first entity you clicked (the *source* entity) to the second entity (the *target* entity)

{% hint style="success" %}
If you accidentally create a Transition linking an entity to itself, remember to use [Undo](#undo-and-redo)

If you change your mind about adding a Transition, click on any empty space in the model to cancel
{% endhint %}

You can change the direction of an existing Transition:

1. hover the mouse over the Transition - it will become bold
2. right click the Transition and select “Reverse transition” from the context menu.

### Add multiple Transitions to the same target

You can save time when you need to create multiple Transitions to the same target entity.

1. select the first source entity as above
2. hold down the \<Ctrl> key in Windows or the \<Command> key in MacOS while you click on the edges of the remaining source entities
3. release the key, then click on the target entity

<figure><figcaption><p>Creating multiple Transitions to the same target</p></figcaption></figure>

{% hint style="success" %}
To create multiple Transitions linked to the same source Entity, create the Transitions following the instructions above, then reverse them.
{% endhint %}

## Add and edit properties

Layers, objects, attributes, and transitions can be augmented with additional metadata in the form of properties. To add properties, right click on the entity and choose properties (or hit the ‘p’ key).

Properties have both names and values. For example, ‘Owner’ is a property name and ‘John’ is a value.

Properties can be used to support project requirements and typical properties include:

* owner
* data type
* class
* department
* description
* notes
* transformation logic
* risk metrics
* data quality issues
* URLs (e.g. to Jira or SharePoint).

[Click here to find out more about Properties](/models/understand-solidatus-models/understand-properties)

## Undo and redo

Solidatus remembers all the changes made in the current modelling session; you can undo changes and redo them again as many times as you like until you close the model viewer.

The Model Viewer toolbar provides **Undo** and **Redo** commands, and you can also use your standard operating system commands for undo and redo, for example:

<table data-header-hidden><thead><tr><th width="141"></th><th width="155"></th><th></th></tr></thead><tbody><tr><td>Undo</td><td><p>Linux</p><p>macOS</p><p>Windows</p></td><td><p><code>Ctrl + Z</code> or <code>Command + Z</code></p><p><code>Command + Z</code></p><p><code>Ctrl + Z</code></p></td></tr><tr><td>Redo</td><td><p>Linux</p><p>macOS</p><p>Windows</p></td><td><p><code>Ctrl + Shift + Z</code> or <code>Command + Shift + Z</code></p><p><code>Command + Shift + Z</code></p><p><code>Ctrl + Y</code></p></td></tr></tbody></table>

The Model History in the Model Viewer [sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar) lists the actions taken in the current modelling session - click an entry to restore the model to the content it contained after that action had completed.

| <p>The History before clicking on <em>Delete 1 Object</em></p><p></p> | <p>After clicking, light grey actions have been undone</p><p></p> |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |

Another, perhaps more drastic, way to undo changes is to delete the current model draft via the **Model** section of the sidebar.

{% hint style="warning" %}
Before you delete the current draft, remember that the History shown in the Model section of the sidebar only covers the current modelling session, so the draft may include changes you made on previous occasions.
{% endhint %}

## Select entities

Selecting a single entity in a Solidatus model is as easy as clicking your mouse or tapping your phone screen.

There are times when you need to work on multiple entities together, perhaps to add a property to multiple entities, or to delete or copy those entities. To do this, you’ll need to extend your selection using standard operating system keyboard and mouse actions or the [context menu](#context-menus).

{% hint style="success" %}
In the Model Viewer, selected entities are highlighted with a blue background or line.
{% endhint %}

### Select multiple entities

You can add individual Entities to your selection by clicking on them using the **left** mouse button, while holding down a key on the keyboard. Clicking on Entities that are already selected will remove them from the selection.

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

For example, to select the highlighted attributes in the entity list above, plus their transitions, you could:

1. click on *First name*

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

2. press `Shift`, and press the `cursor down` key four times, to extend the selection to include the attributes from *Last name* to *Job title*

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

3. press `Ctrl` (Windows) or `Command` (macOS) and click on *Employee Function* to remove it from the selection

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

4. press `Ctrl` (Windows) or `Command` (macOS) and click on *Annual salary amount* to add it to the selection

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

5. press `Shift` and click on *Initial salary amount* to extend the selection

```
Employee
   Name
      First name
      Last name
   Employee function
      Start date
      Job title
   Employee salary
      Annual salary amount
      Last review date
      Initial salary amount
```

### Select the children or descendants of an entity

If you click on an Entity with the **right** menu button you can see the [context menu](#context-menus). The *Select* section allows you to select two categories of Entities related to the current Entity:

> 1. Entities below the current Entity in the hierarchy of Entities
>    * Entities directly owned by the Entity are *children* (for example, the Attributes owned by a Group)
>    * Entities that disappear from view when you [collapse](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/user-interface/models-ui/navigating.html#collapse-expand) the Entity are *descendants*
> 2. Transitions

<figure><figcaption><p>The selection options in the context menu</p></figcaption></figure>

{% hint style="success" %}
Selecting Entities using the context menu will always **replace** the current selection.

If you need to extend the selection after using the context menu, use the features built into the [Tools Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-tools-tab) in the *Sidebar*.
{% endhint %}

### Select everything in a Layer

To select all the Objects, Groups and Attributes in a Layer, right-click the Layer and choose the `Select all descendants` option in the context menu.

### Extend your selection into the trace

Open the [Tools Tab](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-tools-tab) in the *Sidebar* then:

1. enable *Add to selection* by clicking on the slider
2. click on the *Incoming* and *Outgoing* buttons to include all transitions in the selection
3. if you also want to include the source and target entities in the transitions, click on the *Source* and *Target* buttons
4. if you want to include all entities in the trace (as defined in the *Lineage* section of the panel, just click on the *Trace* button in the *Select* options.

<figure><figcaption><p>The Tools Panel in the Sidebar</p></figcaption></figure>

## Sort entities

You can sort the list of child entities for any selected entity alphabetically by name, either A-Z or Z-A. Only the child entities are sorted, lower levels are not affected.

To sort entities, open the context menu for the parent entity, the entity for which you want to sort the children. Select `Sort` and then choose `Sort A-Z` or `Sort Z-A`. Numbers are sorted before alphabetic characters.

For example, sorting the child entities within the *Customer Home Address* object:

Before sorting

<figure><figcaption><p>Before sorting the object’s attributes</p></figcaption></figure>

After sorting - note that the attributes within *Country* have not been sorted

<figure><figcaption><p>After sorting the object’s attributes</p></figcaption></figure>

## Copy and move entities in a model

### Copy one or more entities using the context menus

**Step 1 – Select the entities to be copied**

> If you need to select more than one entity, you can extend the selection using the standard key and mouse combinations for your operating system. See [Select entities](#select-entities).

**Step 2 - Copy the entity or entities into the clipboard**

> Right-click one of the selected entities and select `Copy` in the context menu. If only one entity is selected you will need to select `Cut, Copy and Paste` first

<figure><figcaption><p>Cut,copy and paste for a single entity</p></figcaption></figure>

> If multiple entities are selected, there are fewer Copy and Paste options, so the menu is simple

<figure><figcaption><p>Cut,copy and paste for multiple entities</p></figcaption></figure>

**Step 3 – Right-click on the entity that you want the content to appear within, before or after and select the appropriate Paste option**

> * Paste – will paste the content inside the Entity
> * Paste before – will paste the content as a sibling of the Entity, before it in the list
> * Paste after – will paste the content as a sibling of the Entity, after it in the list

If you copy multiple entities, you will also paste multiple entities. For example, you could copy three Objects and two Attributes from model A and paste them into Model B as five Layers, creating a radically different model structure and preserving all transitions (except those that would link two of the new Layers to each other).

For example, before copying the object called *contacts2.csv*, select it

<figure><figcaption><p>Select the object, ready to copy it</p></figcaption></figure>

Choose *Copy* from the context menu; now you can paste the Object into one or more locations. For example, you could paste it as one or more of the following, in the same model or a different model:

<table data-header-hidden><thead><tr><th width="242"></th><th></th></tr></thead><tbody><tr><td>a new Layer at right-hand end of model</td><td>right-click the blank space after the last Layer on the right then select <em>Paste</em></td></tr><tr><td>a new Layer anywhere within the model</td><td>right-click the layer,select <em>Cut, Copy &#x26; Paste</em> then <em>Paste before</em> or <em>Paste after</em></td></tr><tr><td>a new Object at the end of a Layer</td><td>right-click the layer, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste</em></td></tr><tr><td>a new Object within a Layer</td><td>right-click an object, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste before</em> or <em>Paste after</em></td></tr><tr><td>a new Attribute</td><td>right-click an object, group attribute, or attribute, select <em>Cut, Copy &#x26; Paste</em> then <em>Paste</em></td></tr></tbody></table>

#### **As a new Object in the original Layer**

<figure><figcaption><p>Pasted as a new Object in the Staging Layer</p></figcaption></figure>

#### **As a new Layer after the&#x20;*****Staging*****&#x20;Layer**

<figure><figcaption><p>Pasted as a new Layer after the Staging Layer</p></figcaption></figure>

#### **As a new Attribute – pasted in the LAST\_NAME attribute**

<figure><figcaption><p>Pasted as a new Attribute within an Attribute</p></figcaption></figure>

#### **As an Object in a different model**

<figure><figcaption><p>Pasted as an Object in a different model</p></figcaption></figure>

### Move one or more Objects

An Object can be moved in one of three ways - dragging with the mouse, using *Move* on the context menu, and using *Cut* and *Paste* on the context menu.

To move a Layer, Group, or Attribute see [Cut and Paste to move entities](#cut-and-paste-to-move-entities).

### **Drag Objects with the mouse**

Select one or more Objects, drag them to a location on the model, then release the mouse button to move the Object(s) to the new location. The target location is indicated while dragging the Objects, as a grey line.

{% hint style="success" %}

* If you change your mind before releasing the mouse button, press the \<esc> key on your keyboard.
* If you moved something by mistake, you can undo the action.
  {% endhint %}

Before

<figure><figcaption><p>The model before dragging the selection</p></figcaption></figure>

After

<figure><figcaption><p>The model after dragging the selection - all properties and transitions are preserved.</p></figcaption></figure>

### **Moving an Object using the context menus**

Step 1 – right-click the object (just one can be selected) to be moved, select *Move* then *Before* or *After*

<figure><figcaption><p>I want to move this entity before another entity</p></figcaption></figure>

Step 2 – select the entity that you want the moved entity to be located next to (either before or after it) - the entity will be pasted into position. If you’ve made a mistake, you can [undo](#undo-and-redo) the action.

<figure><figcaption><p>The model after moving the selection</p></figcaption></figure>

### Cut and paste to move entities

<figure><figcaption></figcaption></figure>

To move multiple entities or any entity that is not an Object, use the Cut and Paste capabilities.

The process is identical to that described in [Copy one or more entities using the context menus](#context-menus) - just start the process with **Cut** instead of **Copy**.

For example, to move a Layer, simply `right click on a Layer` and select **Cut** from the context menu. Then right-click another Layer next to which you would like to place the Layer you’ve cut and choose **Paste before** or **Paste after** from the context menu.

{% hint style="success" %}
Cutting and pasting entities to move them around a Model will preserve existing Transitions.
{% endhint %}

## Delete entities

If an entity is deleted, all child entities are also deleted. If you delete an Object, for example, you will also delete all group attributes and attributes that it contains. You will also delete all transitions linked to those entities unless you choose to preserve them (see below).

If you want to remove an entity without removing the child entities, you must move the child entities first. For example, to remove *Name* from the following structure without removing the *First name* or *Last name* attributes you must use *Cut* and *Paste* to move the attributes into *Employee* **before** deleting *Name*.

```
Employee
   Name
      First name
      Last name
```

To delete one or more entities, select them and do one of the following:

* Press the `delete` key - also deletes any linked transitions
* Select *Cut* on the context menu - also deletes any linked transitions
* Select *Delete* on the context menu - also deletes any linked transitions
* Select *Delete (preserve transitions)* on the context menu - this will preserve the flow of transitions, bypassing the deleted entities

#### **The model before deleting an attribute**

<figure><figcaption><p>The model before deleting an attribute</p></figcaption></figure>

#### **The same model, after deleting the attribute and preserving transitions**

<figure><figcaption><p>The model after deleting an attribute</p></figcaption></figure>

## Rename entities

To rename an entity, double-click the entity in the Model Viewer to select the name - the whole name is selected at first, which makes is easy to replace the name. To avoid replacing the name in this way, using the cursor keys or the home and end keys to move the cursor to your preferred typing location. You can commit the new name by pressing `Enter` or clicking the mouse elsewhere in the model. Press the `esc` key to cancel editing.

{% hint style="success" %}

* If the entity you want to rename is already selected (and nothing else is selected), press the `Enter` key to start editing
* If you press `Enter` while editing the name of a Group Attribute or an Attribute, Solidatus will insert a new attribute below it, with the cursor positioned ready to type the name - press `esc` or click elsewhere to cancel this.
* Right-click any entity and select *Rename* on the context menu
  {% endhint %}

## Notes on properties when moving, copying, or deleting entities

**1. Moving content**

> Moving Entities around a Model does not affect their properties.

**2. Copying content**

> When copying Entities within the same Model, all property assignments in the copied content are duplicated.
>
> When copying Entities in one Model and pasting them into a **different** Model, the properties are copied into the new Model. If the name (including folders) of a pasted property matches the name of an existing property, the two properties are merged, and the property type of the pasted content will replace the property type of the original content.
>
> > For example, *Model A* has a `Date` property called **Approval** and *Model B* has a `Text` property called **Approval**. If we copy content from *Model A* into *Model B*, the property type in *Model B* will change from `Text` to `Date`.

**3. Deleting content**

> When you delete Entities that have properties assigned, the property values are not removed from the Model - they can still be seen in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager), possibly showing zero usage, and will be available for use in other Entities. You can remove the values completely in the Property Manager.
>
> When you delete all the content **imported** from another Model, any properties that are only assigned to that content will be removed when the Model is saved and you close the Model Viewer.

## Notes on Transitions when moving, copying or deleting entities

Transitions are replicated when copying and pasting entities within the same model, preserved when moving entities, and can be preserved when deleting entities.

* All transitions between the copied entities are replicated
* Where the copy takes place within the same model, all transitions linked to the copied entities from entities outside the selection are also replicated
* If the pasted entities are Layers, any Transitions that would link two of the new Layers are not created

## Notes on reference relationships when moving, copying, or deleting entities

Relationships to entities in Reference models are replicated when copying entities, preserved when moving entities, and deleted when deleting entities.

## Create new models via the context menu

See [Create model from selection](/models/build-and-edit-models/create-a-new-model#create-model-from-selection) and [Extract source to new model](/models/build-and-edit-models/create-a-new-model#extract-source-to-new-model).
