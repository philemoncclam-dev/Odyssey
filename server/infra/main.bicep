// Odyssey model-storage backend, full enterprise topology:
//
//   Internet ──> APIM (public gateway, JWT-validated, rate-limited)
//                  │  (over the VNet, never the internet)
//                  ▼
//              Function App (locked to APIM's subnet only)
//                  │  (over the VNet, via Private Endpoint)
//                  ▼
//              Cosmos DB (public network access OFF)
//
// Everything keyless (Managed Identity + RBAC), everything logged to one
// Log Analytics workspace, everything tagged for cost allocation.
//
// Deploy:
//   az deployment group create --resource-group <rg> --template-file main.bicep \
//     --parameters entraTenantId=<tenant-id> entraApiAudience=api://<api-app-id>/access_as_user \
//                  alertEmail=<team-email> publisherEmail=<team-email> \
//                  corsAllowedOrigins='["https://<spa-hostname>"]'
//
// What this does NOT create: the two Entra app registrations (needs Graph
// permissions this template doesn't assume you've granted the deployer),
// and the GitHub Actions OIDC federated credential (see
// .github/workflows/deploy-server.yml's header). Both are one-time manual
// steps documented in server/README.md.

@description('Entra tenant id that issues the tokens this API verifies.')
param entraTenantId string

@description('The audience this API validates — api://<its-app-id>/access_as_user.')
param entraApiAudience string

@description('Prefix for every resource name; must be globally-unique-safe for the Function App, Cosmos, and APIM.')
param namePrefix string = 'odyssey-${uniqueString(resourceGroup().id)}'

@description('Region for every resource.')
param location string = resourceGroup().location

@description('Region for the Cosmos account specifically — override when the main region has no Cosmos capacity. The Private Endpoint still lives in `location`\'s VNet; PaaS resources don\'t need to share their target\'s region.')
param cosmosLocation string = location

@description('Email alerts (Function errors, Cosmos throttling, gateway errors) go to. Required.')
param alertEmail string

@description('APIM\'s required publisher contact — shown in its developer portal, not a user-facing address.')
param publisherEmail string = alertEmail

@description('Organization name shown in APIM\'s developer portal.')
param publisherName string = 'Odyssey'

@allowed(['Developer', 'Premium'])
@description('APIM SKU. Developer has no SLA — fine for a pilot; use Premium once this is past pilot.')
param apimSku string = 'Developer'

@description('Origins allowed to call the API from a browser — the deployed SPA\'s URL(s).')
param corsAllowedOrigins array

@description('Tags applied to every resource — cost allocation and ownership, not optional at enterprise scale.')
param tags object = {
  application: 'odyssey'
  environment: 'production'
}

// --- Network isolation ---------------------------------------------------

module network 'modules/network.bicep' = {
  name: 'network'
  params: { location: location, namePrefix: namePrefix, tags: tags }
}

// --- Monitoring/governance ------------------------------------------------

module monitoring 'modules/monitoring.bicep' = {
  name: 'monitoring'
  params: { location: location, namePrefix: namePrefix, tags: tags, alertEmail: alertEmail }
}

// --- Cosmos DB (serverless, public access OFF, reached via Private Endpoint) --

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: '${namePrefix}-cosmos'
  location: cosmosLocation
  tags: tags
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    capabilities: [{ name: 'EnableServerless' }]
    locations: [{ locationName: cosmosLocation, failoverPriority: 0, isZoneRedundant: false }]
    disableLocalAuth: true
    publicNetworkAccess: 'Disabled'
  }
}

resource cosmosPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-cosmos-pe'
  location: location
  tags: tags
  properties: {
    subnet: { id: network.outputs.privateEndpointsSubnetId }
    privateLinkServiceConnections: [
      {
        name: 'cosmos-connection'
        properties: {
          privateLinkServiceId: cosmos.id
          groupIds: ['Sql']
        }
      }
    ]
  }
}

resource cosmosPrivateDnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: cosmosPrivateEndpoint
  name: 'cosmos-dns-group'
  properties: {
    privateDnsZoneConfigs: [
      { name: 'cosmos', properties: { privateDnsZoneId: network.outputs.cosmosDnsZoneId } }
    ]
  }
}

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-05-15' = {
  parent: cosmos
  name: 'odyssey'
  properties: { resource: { id: 'odyssey' } }
}

resource modelsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-05-15' = {
  parent: cosmosDb
  name: 'Models'
  properties: {
    resource: {
      id: 'Models'
      // Every document belonging to one model shares this partition key —
      // what makes functions/commit.ts's TransactionalBatch possible. See
      // src/lib/cosmos.ts's header.
      partitionKey: { paths: ['/modelId'], kind: 'Hash' }
    }
  }
}

resource cosmosDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-law'
  scope: cosmos
  properties: {
    workspaceId: monitoring.outputs.workspaceId
    logs: [
      { category: 'DataPlaneRequests', enabled: true }
      { category: 'QueryRuntimeStatistics', enabled: true }
    ]
    metrics: [{ category: 'Requests', enabled: true }]
  }
}

// --- Function App (Flex Consumption, VNet-integrated outbound, locked
//     inbound to APIM's subnet only) -----------------------------------

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: replace('${namePrefix}func', '-', '')
  location: location
  tags: tags
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: { allowSharedKeyAccess: false }
}

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${namePrefix}-plan'
  location: location
  tags: tags
  sku: { name: 'FC1', tier: 'FlexConsumption' }
  kind: 'functionapp'
  properties: { reserved: true }
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: '${namePrefix}-func'
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    virtualNetworkSubnetId: network.outputs.functionsSubnetId
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storage.properties.primaryEndpoints.blob}app-package'
          authentication: { type: 'SystemAssignedIdentity' }
        }
      }
      runtime: { name: 'node', version: '20' }
      scaleAndConcurrency: { maximumInstanceCount: 40, instanceMemoryMB: 2048 }
    }
    siteConfig: {
      appSettings: [
        { name: 'AzureWebJobsStorage__accountName', value: storage.name }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
        { name: 'ENTRA_TENANT_ID', value: entraTenantId }
        { name: 'ENTRA_API_AUDIENCE', value: entraApiAudience }
        { name: 'COSMOS_ENDPOINT', value: cosmos.properties.documentEndpoint }
      ]
      // The actual "front door lock": nothing reaches this app except from
      // APIM's own subnet. Direct calls to <func>.azurewebsites.net from
      // anywhere else are refused before auth is even checked.
      // Straight from the network module, not from the `apim` module below:
      // `apim` takes this Function App's OWN hostname as an input, so
      // depending on `apim`'s output here would be a cycle. The subnet id
      // is the same value either way — it's `network`'s to hand out.
      ipSecurityRestrictions: [
        {
          vnetSubnetResourceId: network.outputs.apimSubnetId
          action: 'Allow'
          priority: 100
          name: 'Allow APIM subnet only'
        }
      ]
      ipSecurityRestrictionsDefaultAction: 'Deny'
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${namePrefix}-ai'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: monitoring.outputs.workspaceId
  }
}

resource functionDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-law'
  scope: functionApp
  properties: {
    workspaceId: monitoring.outputs.workspaceId
    logs: [{ categoryGroup: 'allLogs', enabled: true }]
    metrics: [{ category: 'AllMetrics', enabled: true }]
  }
}

// --- API Management (the public door) -----------------------------------

module apim 'modules/apim.bicep' = {
  name: 'apim'
  params: {
    location: location
    namePrefix: namePrefix
    tags: tags
    publisherEmail: publisherEmail
    publisherName: publisherName
    sku: apimSku
    apimSubnetId: network.outputs.apimSubnetId
    functionAppUrl: 'https://${functionApp.properties.defaultHostName}'
    entraTenantId: entraTenantId
    entraApiAudience: entraApiAudience
    logAnalyticsWorkspaceId: monitoring.outputs.workspaceId
    corsAllowedOrigins: corsAllowedOrigins
  }
}

// --- RBAC ------------------------------------------------------------

// Cosmos data-plane role (NOT an Azure RBAC role — see the well-known GUID
// note below). Grants the Function App's identity read/write on data.
resource cosmosDataContributor 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = {
  parent: cosmos
  // `00000000-0000-0000-0000-000000000002` is Cosmos's BUILT-IN "Data
  // Contributor" role id — a fixed GUID Microsoft documents, not something
  // this deployment defines. It does not appear under the account's Azure
  // "Access control (IAM)" blade; only under Cosmos's own Data Explorer or
  // `az cosmosdb sql role assignment list`.
  name: guid(cosmos.id, functionApp.id, 'cosmos-data-contributor')
  properties: {
    roleDefinitionId: '${cosmos.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002'
    principalId: functionApp.identity.principalId
    scope: cosmos.id
  }
}

var storageBlobDataContributorId = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
var storageQueueDataContributorId = '974c5e8b-45b9-4653-ba55-5f855dd0fb88'

resource storageBlobRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionApp.id, storageBlobDataContributorId)
  scope: storage
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageBlobDataContributorId)
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource storageQueueRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionApp.id, storageQueueDataContributorId)
  scope: storage
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageQueueDataContributorId)
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// --- Alert rules -------------------------------------------------------

// Flex Consumption doesn't expose the classic App Service Http5xx metric
// (confirmed empty on a live plan) — scoped to App Insights' requests/failed
// instead, which this Function App already reports into.
resource functionErrorAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: '${namePrefix}-func-errors'
  location: 'global'
  tags: tags
  properties: {
    severity: 2
    enabled: true
    scopes: [appInsights.id]
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'StaticThresholdCriterion'
          name: 'FailedRequests'
          metricName: 'requests/failed'
          operator: 'GreaterThan'
          threshold: 5
          timeAggregation: 'Count'
        }
      ]
    }
    actions: [{ actionGroupId: monitoring.outputs.actionGroupId }]
  }
}

resource cosmosThrottleAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: '${namePrefix}-cosmos-throttling'
  location: 'global'
  tags: tags
  properties: {
    severity: 2
    enabled: true
    scopes: [cosmos.id]
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
      allOf: [
        {
          criterionType: 'StaticThresholdCriterion'
          name: 'TooManyRequests'
          metricName: 'TotalRequestUnits'
          metricNamespace: 'Microsoft.DocumentDB/databaseAccounts'
          operator: 'GreaterThan'
          threshold: 1000
          timeAggregation: 'Total'
          dimensions: [
            { name: 'StatusCode', operator: 'Include', values: ['429'] }
          ]
        }
      ]
    }
    actions: [{ actionGroupId: monitoring.outputs.actionGroupId }]
  }
}

output functionAppName string = functionApp.name
output cosmosEndpoint string = cosmos.properties.documentEndpoint
output apiGatewayUrl string = apim.outputs.apimGatewayUrl
output logAnalyticsWorkspaceId string = monitoring.outputs.workspaceId
