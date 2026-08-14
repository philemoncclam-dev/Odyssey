# Import XML structures

The XML import takes as input an arbitrary XML file. This is converted into a nested object which describes the structure of the given file.

Each XML element is converted into an attribute. If the element has child elements, then a nested group is created.

## Example XML file import

```xml
 <?xml version="1.0" encoding="utf-8"?>
 <rootElement>
     <client>
         <id>abc123</id>
         <firstName>John</firstName>
         <lastName>Smith</lastName>
     </client>
     <amount>123.0</amount>
     <timestamp>2019-04-02T14:08:36.441Z</timestamp>
 </rootElement>
```

<figure><figcaption><p>The imported object</p></figcaption></figure>
