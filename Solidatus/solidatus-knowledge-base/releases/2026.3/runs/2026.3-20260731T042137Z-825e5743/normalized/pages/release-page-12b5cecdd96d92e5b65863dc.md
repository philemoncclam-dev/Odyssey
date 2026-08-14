# Solidatus 5.1.1

This is a minor feature update.

### Feature Improvements

**Can now provide Approval / Rejection messages via Model Overview**

When you approve or reject an Activity via the [Model Overview](/the-user-interface/models-ui/model-overview), you can now provide information to explain why you made that decision, without having to add a separate comment afterwards.

**Additional API commands**

<table data-header-hidden><thead><tr><th width="224"></th><th></th></tr></thead><tbody><tr><td><code>UpdateBy</code></td><td>Allows you to update entities in a Model with a given set of commands (currently, only <code>SetProperty</code> and <code>SetProperties</code> are supported). These entities are identified either by a property key they possess or a property key and value they possess.</td></tr><tr><td><code>SetProperties</code></td><td>As the name suggests, this command allows you to set multiple Properties in one command, avoiding the necessity for running <code>SetProperty</code> multiple times.</td></tr></tbody></table>
