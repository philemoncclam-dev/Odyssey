// One Log Analytics workspace everything logs into, one Action Group that
// says who hears about it, and the three alert rules worth having on day
// one: the Function App erroring, Cosmos throttling requests (a capacity
// problem before anyone reports it as a bug), and APIM's gateway erroring.
// Diagnostic settings (which resource logs where) live in main.bicep, as
// extension resources on the things they're attached to — Bicep resists
// declaring an extension resource on a resource ID string a module doesn't
// own, so that half stays where the resources themselves are declared.
@description('Region for every resource.')
param location string

@description('Prefix for every resource name.')
param namePrefix string

@description('Tags applied to every resource this module creates.')
param tags object

@description('Email address alerts go to. Required — an alert nobody receives is not a safety net.')
param alertEmail string

@description('How many days Log Analytics keeps ingested logs.')
param logRetentionDays int = 30

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-law'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: logRetentionDays
  }
}

resource actionGroup 'Microsoft.Insights/actionGroups@2023-09-01-preview' = {
  name: '${namePrefix}-alerts'
  location: 'global'
  tags: tags
  properties: {
    groupShortName: 'odyssey'
    enabled: true
    emailReceivers: [
      { name: 'primary', emailAddress: alertEmail, useCommonAlertSchema: true }
    ]
  }
}

output workspaceId string = workspace.id
output actionGroupId string = actionGroup.id
