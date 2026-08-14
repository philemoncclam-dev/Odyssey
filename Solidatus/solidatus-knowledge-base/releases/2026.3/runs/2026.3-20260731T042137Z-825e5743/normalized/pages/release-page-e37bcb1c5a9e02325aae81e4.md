# Views

**Views** give you the ability to build a sophisticated library of use-case-specific, shareable snapshots of a model.

Using views, you can:

* Store and return to a specific state of the Model Viewer in a few clicks
* Direct attention to parts of a model needed for a specific analysis or use case
* Capture content relevant to periodic reports or presentations
* Share verifiable answers to critical questions with colleagues

A **view** is much more than just a screenshot: Any **current state** of the Model Viewer – (i.e., a combination of zoom settings, expanded entities, active filters and display rules, and more) – can be captured and stored as a view.

You can also customise how much of the current state of the Model Viewer to return to when the view is applied. For example, a view might simply apply filters and display rules to highlight areas in the model suffering from poor data quality.

{% hint style="success" %}
Stored views can be applied at any time without having to re-create the model state manually. All views available for a model can be found and applied in a few clicks through the [Model Viewer toolbar](/the-user-interface/models-ui/model-viewer/model-viewer-toolbar).
{% endhint %}

<figure><figcaption><p>The views menu and dialogue</p></figcaption></figure>

You can nominate one or more views to set as a **Default view**, which means the view is applied whenever the model is opened or refreshed.

Views are only saved when you save the model, so make sure you save the model after making changes to views to ensure the changes are accessible the next time you open the model.

## Create a view

Creating a view is a straightforward process that allows you to capture the current state of the Model Viewer and save it for future use.

### Step 1: Prepare the Model Viewer

Before creating a view, ensure that the current state of the model in the Model Viewer reflects what you want to see when the view is applied.

{% hint style="success" %}
Only model Owners and Authors can create and edit views. Model Viewers can apply views that have already been created, but they cannot create or edit views.
{% endhint %}

### Step 2: Create the view

To create a view, follow these steps:

1. Click `Views` in the Model Viewer toolbar
2. Click `New View` at the bottom of the Views dialogue
3. Supply a name and possibly a description. Views are listed by name, so choose a name that is descriptive and easy to remember.
4. Select a set of configuration options to specify which aspects of the current model state to include in the view.

<div align="center">View configuration options</div>

By default, all options are enabled, which will ensure that applying the view completely reproduces how the model currently appears in the Model Viewer.

However, you can specify only a subset of settings to activate when the view is applied, and each combination of settings has a unique effect on how the view behaves.

5. Finally, click **CREATE VIEW** in the bottom right corner of the dialogue to save the view.

## View configuration options

When you create a view, you can select from a range of configuration options that determine how the view behaves when applied.

This table describes how each configuration option affects a view. The overall behaviour of the model when a view is applied depends on the how the various options interact.

<table data-header-hidden><thead><tr><th width="264.36669921875"></th><th></th></tr></thead><tbody><tr><td><strong>Set as Default view</strong></td><td>Toggle allows you to set a view to be applied when the model is opened. The view will have the <em>On load</em> icon next to its name in the toolbar menu.</td></tr><tr><td><strong>Collapsed entities</strong></td><td>Expand and collapse entities to ensure that the view of entities is as close as possible to the current view - it will only be different if there is a query in the search bar.</td></tr><tr><td><strong>Whether “show trace” is enabled</strong></td><td>Enables or disables <code>Show trace</code> and preserves selected settings in the Lineage panel of the Tools sidebar tab.</td></tr><tr><td><strong>Active filters and display rules</strong></td><td>Deactivates all filters and display rules and replaces them with those active when the View was created or edited.</td></tr><tr><td><strong>Selected entities</strong></td><td>Replaces the current entity selection with those selections that were active when the view was created or edited.</td></tr><tr><td><strong>Zoom settings</strong></td><td>Sets the zoom level, object width, and layer spacing to the values active when the view was created or edited.</td></tr><tr><td><strong>Options selected</strong></td><td>Sets the options to the values that were active when the view was created or edited. This can be very useful, for example, for switching between the <code>Root entity types</code> (layer and object).</td></tr></tbody></table>

### How view configurations interact

The more configuration options you select, the closer the view will be to how the model appeared when you created or updated the view.

The settings you **should** select depend on the intended purpose of the view.

For example, if the only purpose of your view is to ensure that certain filters or display rules are applied, only select the *Active filters and display rules* option.

If you applied a view with only this setting activated, neither the collapsed and expanded entities, zoom settings, or highlighted trace would be affected. Only the combination of filters and display rules would be altered to those active when the view was created.

{% hint style="warning" %}
When you edit an existing view, the original view is overwritten by the settings active in the **current** model display. For example, the filters and display rules active in the original view are replaced by the currently active filters and display rules.

To avoid unexpected changes when editing a view, it's a good idea to [Apply the view](#apply-a-view) immediately before editing it.
{% endhint %}

## Apply a view

Views can be applied from two places: the `Views` button on the [Model Viewer toolbar](https://ci-rc.solidatus.dev/help/user-interface/models-ui/model-viewer.html#model-viewer-toolbar) or the `Tools` panel in the [Model Viewer sidebar](/the-user-interface/models-ui/model-viewer#the-model-viewer-sidebar).

**From the toolbar**

Applying a view is very simple: just click **Views** in the toolbar, then click the name of the view you want to apply.

If you have a lot of views, you can type the name of a view in the search bar to find the one you need.

<figure>See a list of your views and select views to apply<figcaption><p>See a list of your views and select views to apply</p></figcaption></figure>

When you apply a view, the content shown in the Model Viewer is changed according to the configurations selected when the view was created or updated.

For example, a view called **DQ Rules**, in which only active filters and display rules were included, would not affect the zoom level, but it would activate the display rules and filters that were applied when the view was last updated and deactivate all others.

**From the sidebar**

All available views are also listed in the `Views` section of the `Tools` sidebar tab. Just click the name of a view to apply it.

### Apply multiple views

You can apply multiple views at the same time, but if aspects of two views conflict, the view that was last selected takes precedence.

For example, let's say you have one view in which all entities are expanded and another in which only a sub-set are expanded. These views conflict with one another: they cannot both be active at the same time. If you try to apply multiple views with conflicting view settings, the view that was last selected will be applied to the model and will override the other views.

Views normally come into conflict if they include the same configuration options. This is because the views have likely stored different states of the model for those configuration options - i.e., different Zoom settings, active filters and display rules, or collapsed/expanded entities.

Using multiple views is **most effective** if you have a collection of views that modify different aspects of the model. For example, one view applies display rules while another applies zoom settings, and another selects a set of entities. These can be applied simultaneously, leading to unique and quick applications of complex combinations of settings that would be difficult to achieve manually.

{% hint style="success" %}
When creating a complex view that includes many configuration options, consider creating multiple views that each include one or a few of the options separately.

This way, you can achieve the view by applying all views together, and you can use the individual views separately in combination with other views.
{% endhint %}

## Check whether a view is active

[The navigation bar](https://ci-rc.solidatus.dev/help/user-interface/navigation-bar.html) displays an icon for each of the views that are matched by the current view of the model.

For example, the following image shows that the current view of the model matches the conditions set by both the view called **Colourful** and the view called **Trace of Employee concept**.

The icon for a view will appear on the navigation Bar **whenever** the current view of the model **matches** the conditions stored in that view. This will be applied immediately after applying a view and whenever the current view of the model happens to match the settings stored in that view. As soon as you make a change that results in those conditions no longer being met, the icon disappears.

## Set a default view

You can nominate one or more views to set as a **default view**, which means the view is applied when the model is opened or refreshed.

If you set more than one **default view**, these will applied in the sequence in which they are listed views menu in the toolbar. The first one in the list is applied, followed by the second, and so on.

Because views can conflict with one another, this means that the last **default view** in the list will override any of the previous views if there are any conflicts.

## Edit a view

You can edit a view by clicking on the pencil icon next to the view’s name.

{% hint style="success" %}
If all you want to do is rename the view, click `Update Settings` after typing the new name.
{% endhint %}

You can update or amend any view by making the model look exactly as you want the view to appear in the Model Viewer (including zoom levels, selected entities, traces, etc). Then go to `views` in the toolbar and click the `pencil icon` next to the view you want to update. In the dialogue that appears, select all options and click `Update State`.

{% hint style="warning" %}
Be careful when editing an existing view, as the original view is overwritten by settings active in the **current** model display. For example, the filters and display rules active in the original view are replaced by the currently active filters and display rules.

To avoid unexpected changes when editing the view, it's a good idea to [Apply the view](#apply-a-view) immediately before editing it.
{% endhint %}

The *Edit view* window allows you to edit all the information you provided in the *Create view* window, and has two separate buttons for saving changes.

<table data-header-hidden><thead><tr><th width="188.088623046875"></th><th></th></tr></thead><tbody><tr><td><code>Update Settings</code></td><td>Will save the changes you have made to the view name or description, and to the <em>Set as default view</em> option</td></tr><tr><td><code>Update Selection</code></td><td>Will save all of the other configuration options</td></tr></tbody></table>

## Deactivate all views

By clicking `Reset` in the list of views, the model reverts to its original state with all objects collapsed, all Layers expanded, and no Display Rules or Filters applied.

{% hint style="success" %}
The `Reset` option can be set as the **default view** that is applied whenever the model is opened or refreshed.
{% endhint %}

## View examples

Here are examples of views captured from the same model. Each example shows information relevant to a different analysis or use case involving the same underlying technical systems, such as data quality, lineage, or ownership.

Here is the model after `Reset` has been applied to deactivate all views:

<figure>Model after Reset has been applied<figcaption><p>Model after Reset has been applied</p></figcaption></figure>

No filters or display rules are applied, all entities are collapsed, and the zoom level is set to the default.

### Example 1: DQ Rules

Here is the model after the view called **DQ Rules** has been applied:

<figure>Model after DQ Rules view has been applied<figcaption><p>Model after DQ Rules view has been applied</p></figcaption></figure>

This is the same model as above, but now the application and results of DQ Rules stored as properties are clearly highlighted. This view can be shared to allow others to quickly assess the state of data quality in the systems represented in the model.

### Example 2: CDEs

Here is the model after a view called **CDE relationships to technical data** has been applied:

<figure><figcaption></figcaption></figure>

This view provides business context to technical data by clearly displaying each entity's relationships to Critical Data Elements (CDEs).

### Example 3: Ownership

Here is the model after the view called **Ownership** has been applied:

<figure>Model after Ownership View has been applied<figcaption></figcaption></figure>

In this view, the ownership of each entity is clearly displayed, allowing users to quickly identify who is responsible for each part of the model.

### Example 4: At risk lineage

Here is the model after the view called **At Risk Trace** has been applied that shows downstream effects of risky data on a Market Risk Report:

<figure>Model after At Risk Trace view has been applied<figcaption><p>Model after At Risk Trace view has been applied</p></figcaption></figure>

Notice that the zoom level of the model has been changed to show the entire trace, and only entities feeding the Market Risk Report are visible.
