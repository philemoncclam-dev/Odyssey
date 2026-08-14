# SetMetadata

The `SetMetadata` command can update existing metadata for the model specified in the endpoint path.

Existing metadata keys that can be modified include `views` , `gridReports`, and `queries`, which define and modify characteristics the views, Grid reports, and queries stored in a model.

To retrieve existing model metadata that you may wish to modify, use `GET /api/v1/models/{modelId}/metadata`.

## Endpoint

```
POST /api/v1/models/{modelId}/update
```

The path parameter `modelId` is the ID of the model you are updating. Model IDs can be found at the end of the URL in your browser when you have the model open in the Model Viewer or Model Overview.

For example, the URL `demo.solidatus.com/viewer/66e014e145377388ae99ac48` contains the ID of the open model at the end: `66e014e145377388ae99ac48`.

You will likely need to copy and paste the Model ID of the model you’d like to update from the URL in your browser to the endpoint path in your cURL command or REST client.

## Request Body Example

Here is an example of the body of a request formatted in JSON for the `SetMetadata` command.

{% code overflow="wrap" %}

```
{
 "cmds": [
     {
     "cmd": "SetMetadata",
     "key": "queries",
     "value": "{\"version\":\"3\",\"moduleColours\":{\"Uncategorised\":\"#9013fe\"},\"queryOrder\":[\"86374c7a-853f-46a5-a042-70b46955f9a2\"]}"
     }
 ],
 "commit": true,
 "commitMessage": "Remove name key from model metadata",
 "preview": false,
 "includeChangeset": true,
 "expectDraft": false
}
```

{% endcode %}

{% hint style="success" %}
To modify metadata for views, queries, and Grid reports, retrieve existing model metadata first, then change specific elements to make sure the new values you are posting are formatted correctly.
{% endhint %}

You can retrieve existing model metadata by calling the `GET /api/v1/models/{modelId}/metadata` endpoint, or you can find it in the Model Viewer interface by clicking the `i` icon in the Model Info panel in the Model sidebar tab.

<figure><figcaption></figcaption></figure>

## Command Schema

<table data-header-hidden><thead><tr><th width="102.28460693359375"></th><th width="78.21630859375"></th><th width="99.34356689453125"></th><th></th></tr></thead><tbody><tr><td><strong>Field</strong></td><td><strong>Type</strong></td><td><strong>Required/Optional</strong></td><td><strong>Description</strong></td></tr><tr><td><code>"key"</code></td><td>String</td><td>Required</td><td>The metadata property key for the value you wish to modify.</td></tr><tr><td><code>"value"</code></td><td>String</td><td>Required</td><td>The new value to replace the existing metadata property value with.</td></tr></tbody></table>

## Response Schema

Responses are in JSON and contain a standard set of fields.

<table data-header-hidden><thead><tr><th width="190.2291259765625"></th><th></th></tr></thead><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td></tr><tr><td><code>"changeset"</code></td><td>Shows model data that was updated by the request.</td></tr><tr><td><code>"ids"</code></td><td>If user-defined IDs were provided, this field shows new Solidatus generated IDs of added entities.</td></tr><tr><td><code>"errors"</code></td><td>Shows error message if an error was encountered while executing command.</td></tr><tr><td><code>"revisionId"</code></td><td>If <code>commit</code> was set to <code>true</code>, this shows the ID of the new model revision that contains the added entity.</td></tr><tr><td><code>"draftId"</code></td><td>If <code>commit</code> was set to <code>false</code>, this shows the ID of the draft containing the added entity.</td></tr><tr><td><code>"draftRevisionId"</code></td><td>If <code>commit</code> was set to <code>false</code>, this shows the ID of revision on the draft that contains the added entity.</td></tr></tbody></table>

### **Response Codes**

200: Success

### **Error codes**

400: Bad Request

404: Not Found

500: Internal Server Error
