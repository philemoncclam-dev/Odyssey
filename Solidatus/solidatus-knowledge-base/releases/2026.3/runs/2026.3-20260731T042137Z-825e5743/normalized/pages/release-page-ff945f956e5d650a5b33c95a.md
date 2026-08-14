# Aggregate attributes by property or relationship label

Aggregation is a method of grouping entities together that share the same property values or reference relationship labels. You can use aggregation on **Attributes** and **Group Attributes**, but not on Objects or Layers.

When you aggregate by property or reference label, entities with the same values for a selected property or the same reference relationship labels to the same terms are grouped together as a single Attribute, and the property values or reference terms to which they are related replace their names.

Essentially, aggregation allows you to quickly access lists of Attributes that have the same property value or the same relationship to a reference term. It performs a similar function to a display rule: it makes it easier to organise and visualise model content so information about properties or relationships is easy to access, digest, and analyse.

{% hint style="success" %}
There are two key things you need to know about aggregation:

1. Aggregation only applies to Groups and Attributes, it does not affect Layers or Objects
2. Aggregation is only available if you are viewing a model in **read-only mode**. There are four ways to open a Model in read-only mode:
   * If you only have [Viewer](/models/share-and-collaborate/model-roles-and-permissions) access to a model, it will open in **read-only mode** automatically.
   * Access the model through a [read-only shared link](/models/share-and-collaborate/read-only-sharing)
   * Open the model from the [Revision tab](/the-user-interface/models-ui/model-overview#revisions-tab) in the Model Overview.
   * Open the model through a Data Domain to which it is published.
     {% endhint %}

## Aggregate by property

In a Solidatus Lineage Model, you can aggregate entities by a selected property. This will group Attributes that have the same property value for that selected property into a single Attribute. It will also replace the name of any entity that has the selected property with this property value.

The below image shows a segment of a model before aggregation. The current selection (including attributes: *Date* and *Date Key*) both have the property *GDPR.ContainsPersonalData* with value “No”.

<figure><figcaption><p>The model before aggregating</p></figcaption></figure>

To aggregate, open the Property Manager and click the aggregate button next to one of the properties (this button will only appear in read-only mode).

<figure><figcaption><p>Selecting aggregation properties</p></figcaption></figure>

As you can see in the image below, the two attributes were replaced by a new attribute labelled “No”, which represents the shared property values of the original attributes. Furthermore, when we select an aggregated entity, we can view a list of all aggregated attributes in the Sidebar. In this case we see both “Date” and “Date Key” in the “Assigned to” list.

In the image below, we can also see that an Object whose children have been aggregated turns green and aggregated children have a small green bar on their left.

<figure><figcaption><p>After aggregation by property</p></figcaption></figure>

## Aggregate by reference label

You can also aggregate entities by [relationship labels](/models/understand-solidatus-models/understand-reference-relationships#relationship-labels), which will group together Attributes that have the same reference relationship to the same reference term.

This can be useful for viewing a model through the lens of specific reference relationships. You can easily access lists of entities in particular locations in a Model that share the same reference relationships to the same terms.

<figure><figcaption><p>Before aggregation by reference label</p></figcaption></figure>

In the Reference Panel, you can aggregate entities in the model by reference label.

In the image below, we have clicked the three-dots in the top right of the Reference Model Panel to open the dropdown menu. You will see a list of all labels that have been assigned in your Model, and in this example we are selecting “Relates to” as the label to aggregate by.

{% hint style="success" %}
Unlike aggregating by property, you do not have to be in read-only mode to aggregate Attributes by reference label.

However, if you aggregate by reference label when you are not in rea-only mode, the Model will open in a separate tab in read-only mode with the results of the aggregation.
{% endhint %}

<figure><figcaption><p>Selecting reference label for aggregation</p></figcaption></figure>

You can view the results of the aggregation in the next image. Aggregated Attributes are now grouped together as single entities that are named using the reference terms the original entities are related to. When you click on an aggregated entity, you can easily see a list of Attributes that have been grouped together in the Sidebar.

<figure><figcaption><p>After aggregation by reference label</p></figcaption></figure>

We can see that “Personal Customer” is assigned to “Middle Name,” which was the original entity, along with all other Attributes related to Personal Customer that were in the “US Sales Force System” Object. All other entities – i.e. those not related to Personal Customer – are aggregated under “Unassigned entities”.

Unlike aggregation by properties, when we aggregate by reference label, we also visualise where exactly in the reference model the reference term resides. This is demonstrated by the nesting of Attributes “Business Terms” and “Personal Customer”. This means that in the reference model “Personal Customer” is the child of “Business Terms”.
