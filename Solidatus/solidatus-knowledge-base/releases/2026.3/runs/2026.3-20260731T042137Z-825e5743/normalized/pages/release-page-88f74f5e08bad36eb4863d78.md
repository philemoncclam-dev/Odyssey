# Property types

Solidatus provides eight different property types (the default type is `Text`), each of which has its own validation rules and visualisation. If a property value is invalid for its property type, it is highlighted in the `Properties and Relationships section` in the [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar) and in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager).

<table data-header-hidden><thead><tr><th width="203.15106201171875"></th><th></th></tr></thead><tbody><tr><td><strong>Type</strong></td><td><strong>Validation</strong></td></tr><tr><td>4th-type</td><td>Value must be <em>true</em> or <em>false</em> (an empty value is assumed to be <em>false</em>)</td></tr><tr><td>1st-type</td><td>A date (and time, if included) in one of the formats listed in <a href="#date-property-type">Date property type</a></td></tr><tr><td>2nd-type</td><td>A syntactically-correct formula</td></tr><tr><td>7th-type</td><td>A link is created if the content commences with <code>ftp://</code>. <code>http://</code>, or <code>https://</code>. If the content starts with <code>www.</code> we assume that it’s <code>https://</code>.</td></tr><tr><td>6th-type</td><td>Can select from one or more of the available values</td></tr><tr><td>8th-type</td><td>Must be a valid number</td></tr><tr><td>3rd-type</td><td>Can only select one of the available values</td></tr><tr><td>5th-type</td><td>Any content is allowed</td></tr></tbody></table>

## Essential facts about property types

* When you create a new property in the `Properties and Relationships` section of the `Inspector` tab and then enter a value, Solidatus will attempt to [infer the property type from the value you supply](/models/build-and-edit-models/add-and-edit-properties#infer-property-types).
* If you create your properties in the Property Manager you can use the [Infer Types button](/models/build-and-edit-models/add-and-edit-properties#infer-property-types) to infer property types for all text properties.
* For example, a property may need to hold a valid date (and we know how many different ways dates can be represented, don’t we) or a valid number.
* Inconsistent or invalid property values are a prime cause of issues occurring when Display Rules or Filters don’t produce the expected effect on a Model.
* Establishing conventions and patterns while modelling also allows for smoother data entry.

## **Property type examples**

Entities that represent the contents of a regulatory report could have the following properties, each of which has an appropriate property type given the purpose of the property.

| **Property**         | **Type**                                                                | **Purpose**                                                       |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Approval date        | 1st-type | The date when the definition was approved                         |
| Average Population % | 2nd-type | The average value of a property for all descendants of the entity |
| Confidentiality      | 3rd-type | The confidentiality level for the data                            |
| Critical             | 4th-type | Is this data regarded as *Critical*?                              |
| Description          | 5th-type | A business description of the data                                |
| Owners               | 6th-type | The internal owner(s) of the data                                 |
| Regulation           | 7th-type | A link to an external definition of the regulatory requirement    |
| Version Number       | 8th-type | The version number for the definition                             |

{% hint style="success" %}
Property values are only highlighted or reformatted according to the rules defined for each property type (including applying Markdown syntax to `Text` properties)
{% endhint %}

{% hint style="warning" %}
If you want to provide pre-defined lists of values for modellers to use in your properties, you are advised to use only [Multi-select](#multi-select-property-type) or [Select](#select-property-type) property types. Unused values contained in all other property types will be removed when the model is saved.
{% endhint %}

## Characteristics of property types

Solidatus provides eight different property types, each of which has its own validation rules and visualisation:

> [Checkbox](#checkbox-property-type), [Date](#date-property-type), [Formula](#formula-property-type), [Link](#link-property-type), [Multi-Select](#multi-select-property-type), [Number](#number-property-type), [Select](#select-property-type), [Text](#text-property-type).

The default property type is *Text*, though Solidatus may change that to something more appropriate, depending on how you format the first value that you enter (in the [Properties and Relationships section](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar/the-inspector-tab#the-properties-and-relationships-panel) in the [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar)).

For example:

<table data-header-hidden><thead><tr><th width="220"></th><th></th></tr></thead><tbody><tr><td><strong>Value entered</strong></td><td><strong>Assumed property type</strong></td></tr><tr><td>false</td><td>Checkbox</td></tr><tr><td>true</td><td>Checkbox</td></tr><tr><td>no</td><td>Checkbox</td></tr><tr><td>yes</td><td>Checkbox</td></tr><tr><td>on</td><td>Checkbox</td></tr><tr><td>off</td><td>Checkbox</td></tr><tr><td><em>a valid date</em></td><td>Date</td></tr><tr><td>www.solidatus.com</td><td>Link</td></tr><tr><td>1234.6789</td><td>Number</td></tr><tr><td>=anything</td><td>Formula</td></tr></tbody></table>

{% hint style="success" %}
Here’s a quick way to create a new *Checkbox* property:

* Click `Add new property` and type the property name
* Press `Return` and type `yes` or `no`
* Press `Return` - Solidatus will change the property type to `Checkbox`
  {% endhint %}

Invalid property values are highlighted in the [Model Overview](/the-user-interface/models-ui/model-overview), the `Properties and Relationships section` in the [Model Viewer Sidebar](/the-user-interface/models-ui/model-viewer/model-viewer-sidebar), and in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager).

<table data-header-hidden><thead><tr><th width="357"></th><th></th></tr></thead><tbody><tr><td><p><strong>Model Overview</strong></p><p><em>Can only view problems, cannot fix them here</em></p></td><td>../_images/invalid-properties-overview.png</td></tr><tr><td><p><strong>Properties and Relationships</strong></p><p><em>The value is shown in the middle of the message, after</em> <code>value:</code> <em>- click the message to edit the value</em></p></td><td>../_images/invalid-properties.png</td></tr><tr><td><p><strong>Property Manager</strong></p><p><em>Click the pencil icon to edit the value</em></p></td><td><a href="file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/_images/invalid-property-manager.png">../_images/invalid-property-manager.png</a></td></tr></tbody></table>

If more precise validation is needed, it could be based on queries - see [Filters and Display Rules](/models/explore-and-analyse-models/filters-and-display-rules).

### Checkbox property type

A simple indication that something is true or false - make sure the property name makes it very obvious what *true* or *false* actually mean.

<table data-header-hidden><thead><tr><th width="177"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>If the value is <em>true</em> a completed checkbox is displayed; otherwise an empty checkbox is displayed</td></tr><tr><td>Default value</td><td>false</td></tr><tr><td>Editing</td><td>Click on the value to toggle between <code>true</code> and <code>false</code></td></tr><tr><td>Validation</td><td>Value must be <em>true</em> or <em>false</em> (an empty value is assumed to be <em>false</em>)</td></tr></tbody></table>

### Date property type

<table data-header-hidden><thead><tr><th width="162"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>YYYY-MM-DD (e.g. 2022-03-31)</td></tr><tr><td>Default value</td><td>Today’s date (the default time is 12:00 AM)</td></tr><tr><td>Editing</td><td>Click the property value to start editing, use the date picker to select a date. To include the time as well as the date, click on the clock icon on the right and set the time (below the date picker). BEWARE - if your property includes a time, and you toggle the time setting off and back on again, you will lose the original time value, and will need to use <code>Undo</code> to bring it back again.</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Date</em> property type, the following formats are valid - <code>‘YYYY-MM-DD’</code>, <code>‘YYYY-MM-DDTHH:mm’</code>, <code>‘YYYY-MM-DD HH:mm’</code>, <code>‘YYYY-MM-DDTHH:mm:ss’</code>, <code>‘YYYY-MM-DD HH:mm:ss’</code></td></tr><tr><td>Validation</td><td>The date and time pickers will ensure the property is stored correctly</td></tr><tr><td>Querying</td><td>If a date property contains a time, a simple query such as <code>[Due date] &#x3C; "2022-07-22"</code> will not find a match - use <code>beginsWith([Due date],"2022-07-01")</code> or <code>contains([Due date],"2022-07-01")</code> instead</td></tr></tbody></table>

You can query against specific date-time values, or you can use [date and time predicates](/models/explore-and-analyse-models/model-query-language#date-and-time-predicates) to query against time intervals relative to the current date and time.

<figure><figcaption></figcaption></figure>

### Formula property type

**Available formula functions**

<table data-header-hidden><thead><tr><th width="143"></th><th></th></tr></thead><tbody><tr><td>Function</td><td>Purpose</td></tr><tr><td><strong>{xyz}</strong></td><td>Returns the value of the property "xyz"</td></tr><tr><td><strong>sum()</strong></td><td>Returns the sum of the values for a property</td></tr><tr><td><strong>min()</strong></td><td>Returns the smallest value for a property</td></tr><tr><td><strong>max()</strong></td><td>Returns the largest value for a property</td></tr><tr><td><strong>avg()</strong></td><td>Returns the average of the values for a property</td></tr><tr><td><strong>median()</strong></td><td>Returns the middle value from a set of values for a property</td></tr><tr><td><strong>mode()</strong></td><td>Returns the value that appears most often for a property</td></tr><tr><td><strong>variance()</strong></td><td>Returns the variance of the values for a property</td></tr><tr><td><strong>stdev()</strong></td><td>Returns the standard deviation of the values for a property</td></tr></tbody></table>

A formula property is effectively a template that allows you to combine any of the following:

> * text
> * the values of one or more properties of an entity (surround each property name with `{}`)
> * the results of a [calculation](file:///Users/peterwoodford/Documents/GitHub/solidatus-docs/build/html/design/properties.html#formula-functions) performed on the values of properties in entities above or below the current entity in the hierarchy. For example, you can sum the values of properties present on an Object’s children. The depth of the aggregation reach can be controlled, the syntax is very simple and intuitive, and a range of mathematical functions are available. All of these are covered in more detail below.

{% hint style="success" %}
Instead of creating a property to hold the results of a formula, you might prefer to create a [property formula Display Rule](/models/explore-and-analyse-models/filters-and-display-rules#property-formula-tags) instead. This will display the formula results in the Model Viewer, reducing the size of the Model.
{% endhint %}

This example shows a formula (`=sum(descendants[Num pencil])`) that sums the value of the property "Num pencil" in all descendants of the current entity and the result (100), in two separate properties:

<figure><figcaption></figcaption></figure>

This example shows how you can combine text with a couple of property values (in this case the properties are called *First* and *Second*)

<figure><figcaption><p>A more complex example of a formula</p></figcaption></figure>

<table data-header-hidden><thead><tr><th width="179"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td><p>If the content does not start with <code>=</code>, an error message is displayed. Otherwise, the formula is evaluated to show the result.</p><p>If the named property does not exist in any of the children or descendants of the Entity, the following is returned - <strong>NaN</strong> (which means “Not a Number”)</p></td></tr><tr><td>Default value</td><td>T<em>here is no default value for the formula, but there may be some plain text displayed.</em></td></tr><tr><td>Editing</td><td>Click the property value to start editing, and either select a previously-used value from the dropdown list, or type the formula directly into the property value box</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Link</em> property type, the value is evaluated</td></tr></tbody></table>

{% hint style="warning" %}
If you experiment with a formula and take several attempts to get it right, Solidatus remembers **every** attempt. All attempts appear in the drop-down list of potential values. You may need to remove the unwanted values in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager).
{% endhint %}

#### **Syntax**

> * All formula properties must start with an equals sign `=`
> * This can be followed by any text - anything that is not recognised as a formula function will be displayed ‘as-is’
> * If an otherwise valid function refers to a non-existent property, the formula itself is displayed.
> * All formula functions require one or more arguments within parentheses `( )` (unless you are returning the value of a single property)
> * The first argument will usually be the *depth control* - `children` or `descendants`. If omitted, the default of `children` is used
> * This should be followed by the name of the property we wish to examine. If the property name contains spaces or other special characters, it should be wrapped in square brackets (`[ ]`). If it doesn’t, and a depth control object was specified, the two should be separated using a period (`.`).

#### **Controlling the depth of a formula**

The depth of a formula (i.e. how far down the hierarchy do we look) can be controlled via two options: `children` and `descendants`.

Assume we have a Model with a single Layer that contains multiple Objects, and each Object contains multiple attributes. We will be adding a formula property to the Layer.

> 1. If we specify `children` (or in fact don’t specify anything, as the default is children only) the formula will only look at the direct children of the Laye: only properties of child Objects are included in the calculation.
>    * The properties of descendant Attributes are NOT be considered when evaluating the formula
> 2. If, instead, `descendants` is specified, all children, direct and deep alike, will be examined when evaluating the formula - all the dependent Objects and Attributes will have an effect on the final property value.

The formula `=sum(descendants[Num pencil])` sums the value of the *Num pencil* property in all descendants of the current Entity.

### Link property type

A link property contains a single string of text that provides a hyperlink to other content.

<table data-header-hidden><thead><tr><th width="168"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>If the link is valid, it is displayed as a hyperlink, with a shortcut icon that can be clicked on to follow the link. If it is invalid, an error message is displayed.</td></tr><tr><td>Default value</td><td><em>no default value</em></td></tr><tr><td>Editing</td><td>Click the property value to start editing, and either select a previously-used value from the dropdown list, or type the link directly into the property value box</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Link</em> property type, the link is evaluated</td></tr><tr><td>Validation</td><td>A link is created if the content commences with <code>ftp://</code>. <code>http://</code>, or <code>https://</code>. If the content starts with <code>www.</code> we assume that it’s <code>https://</code>.</td></tr></tbody></table>

### Multi-Select property type

A multi-select property allows you to select one or more values from the list of previously-used values, and to add further values to the list.

<table data-header-hidden><thead><tr><th width="183"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>Each value is displayed as a coloured tag.</td></tr><tr><td>Default value</td><td><em>no default value</em></td></tr><tr><td>Editing</td><td>Click the + icon to open the list of possible values - use the checkboxes to select one or more values from the dropdown list; to add a new value, type it into the search bar and press <code>Return</code> (this will create and assign the new value, and close the list), or click on the + Add [value] entry to add the value to the list (the list will stay open)</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Multi-Select</em> property type, every current property value becomes a valid selection.</td></tr><tr><td>Validation</td><td>Can select from one or more of the available values</td></tr><tr><td>Importing</td><td>When importing from Excel, must be in valid JSON format - for example - <code>["J.S. Bach","F. Handel"]</code> or <code>["J.S. Bach","F. Handel","big one \"with quotes\" in it"]</code></td></tr></tbody></table>

{% hint style="success" %}

* To remove values from the list of possible values, use the three-dot menu to the right of the property name to open the property in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager)
* To change the background colour for a value, click on the coloured square to the right of the value to open the colour picker (the chosen colour can also be used in *Tag* Display Rules)



*The current colour is shown at the right-hand end of the colour scale, indicated by the red frame above the number 235*.

*Press* `escape` *to cancel the colour change*

*Click* **inside** *the value selection dialogue to accept the new colour, dismiss the colour picker, and keep the selection dialogue open*

*Click* **anywhere else** *to accept the new colour and close the selection dialogue*
{% endhint %}

### Number property type

<table data-header-hidden><thead><tr><th width="179"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>If the number has less than 22 digits before the decimal point it is displayed in full, with commas as separators (every third digit from the right). If the number has more than 3 decimal places, it is rounded up to 3 decimal places for display. Long numbers (22 or more digits before the decimal point) are shown in scientific notation (such as 1.235E24).</td></tr><tr><td>Default value</td><td><em>no default value</em></td></tr><tr><td>Editing</td><td>Type the value, and/or click on the <em>up</em> and <em>down</em> arrows to the right of the value.</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Number</em> property type, the current property value is validated - this may result in an error message being displayed.</td></tr><tr><td>Validation</td><td>Must be a valid number</td></tr></tbody></table>

{% hint style="success" %}
Leading zeros in number properties (e.g., 001234) are not displayed in the `Properties and Relationships` panel, but they are preserved in the underlying model data.

Queries treat number values with leading zeros as numerically equivalent (e.g., *00001234*, *01234*, and *1234* are the same number).

To retain and display leading zeros, use a *Text* property instead.
{% endhint %}

### Select property type

A Select property allows you to select one or more values from the list of previously-used values, and to add further values to the list.

<table data-header-hidden><thead><tr><th width="181"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>The value is displayed as a coloured tag.</td></tr><tr><td>Default value</td><td><em>no default value</em></td></tr><tr><td>Editing</td><td>Click the dropdown icon to open the list of possible values - the current value, if any, is highlighted in a green band - click a value to select it; to add a new value, type it into the search bar and press <code>Return</code> (this will create and assign the new value, and close the list), or click on the + Add [value] entry to add the value to the list and assign it to the property (the list will stay open).</td></tr><tr><td>Conversion</td><td>If a text property is converted to the <em>Select</em> property type, every property value is viewed as a tag.</td></tr><tr><td>Validation</td><td>Can only select one of the available values</td></tr></tbody></table>

{% hint style="success" %}

* To remove values from the list of possible values, use the three-dot menu to the right of the property name to open the property in the [Property Manager](/models/build-and-edit-models/add-and-edit-properties#the-property-manager)
* To change the background colour for a value, click on the coloured square to the right of the value to open the colour picker (the chosen colour can also be used in *Tag* Display Rules



*The current colour is shown at the right-hand end of the colour scale, indicated by the red frame above the number 226*.

*Press* `escape` *to cancel the colour change*

*Click* **inside** *the value selection dialogue to accept the new colour, dismiss the colour picker, and keep the selection dialogue open*

*Click* **anywhere else** *to accept the new colour and close the selection dialogue*
{% endhint %}

### Text property type

A Text property will accept any content you can type on your keyboard, plus images accessed via links.

<table data-header-hidden><thead><tr><th width="193"></th><th></th></tr></thead><tbody><tr><td>Displayed as</td><td>The value is displayed as text formatted according to any <em>Markdown</em> syntax - it can be previewed in the <em>Full text editor</em>.</td></tr><tr><td>Default value</td><td><em>no default value</em></td></tr><tr><td>Editing</td><td>Click the property value - if the value is empty or does not contain a carriage return, you can type directly into the property value box - press <code>Return</code> to commit the value. If you need to format the property value or include carriage returns, click on the pencil icon to the right, to open the <code>Full text editor</code>.</td></tr><tr><td>Validation</td><td>Any content is allowed</td></tr></tbody></table>

Hover over a property and click the pencil icon to open the property in the **full text editor**.

## **Property text editor**

The full text editor provides formatting capabilities via a toolbar which applies a markup syntax known as *Markdown* ([click here to learn about Markdown](https://guides.github.com/features/mastering-markdown/)). The property selector at the top allows you to edit other properties (not every property type is supported by this editor):

<figure><figcaption><p>Edit multi line properties using the full text editor</p></figcaption></figure>

The example above includes several types of Markdown syntax - `**` for bold text, `>` to indent a paragraph and format it as a quote, and `` ` `` to mark text for highlighting. The effects can be seen in the `Preview` tab:

<figure><figcaption><p>Previewing text format</p></figcaption></figure>
