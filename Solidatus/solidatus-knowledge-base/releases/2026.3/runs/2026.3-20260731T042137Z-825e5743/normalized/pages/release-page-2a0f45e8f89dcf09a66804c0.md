# Azure Data Factory

The Solidatus Azure Data Factory Connector application is a Java based tool to connect to a Microsoft Azure Data Factory, and extract its Linked Services, Datasets, Pipelines and Dataflows. It is capable of creating attributes for supported Linked Services and Datasets, along with transitions to represent the Pipelines and Dataflows that depend on them.

### Terminology

Entities in Solidatus exist as a hierarchy of Layers, Objects and Attributes. Entities in Solidatus can have Properties attached to them as well as Transitions going between entities representing different relationships.

In Azure Data Factory, there are Datasets which belong to a LinkedService. These Datasets are used in Pipeline activities to do actions such as copying data. Datasets can also be used in DataFlows to do more complex data transformation.

Solidatus represents Azure Data Factory objects in layers. Linked Services, Datasets, Dataflows and Pipelines will each have their own layer, with objects that represent an individual Azure DF object. These objects contain attributes to represent finer details, such as column schema in Datasets. Transitions represent two concepts:

* Parentage of objects i.e. a Linked service can parent Datasets; such a relationship is visualized as a transition.
* Metadata transformation i.e. a Pipeline activity may copy data from one Dataset to another, in which case there would be a transition to represent this lineage.

These transitions will have properties that allow them to be filtered.
