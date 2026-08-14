// The one public door: APIM in EXTERNAL VNet mode — its gateway keeps a
// public IP (reachable without ExpressRoute/VPN into the org network), but
// every call it makes to the Function App backend routes over the VNet
// (snet-apim), never the internet. The Function App's own access
// restriction (main.bicep) then refuses anything that didn't come from
// that subnet — so APIM is not "an extra hop", it's the only way in.
//
// Two auth checks happen, on purpose: APIM's `validate-jwt` policy below
// rejects a bad token before it costs a Function invocation; the Function
// App's own `src/lib/auth.ts` validates it again. Redundant by design —
// the gateway is a cost/DDoS boundary, not a substitute for the service
// trusting its own input.
//
// SKU: Developer (cheap, VNet-capable, NO SLA — fine for a first
// deployment). Upgrade to `Premium` (param below) for an SLA, availability
// zones, and multi-region gateways once this is past pilot.
@description('Region for every resource.')
param location string

@description('Prefix for every resource name.')
param namePrefix string

@description('Tags applied to every resource this module creates.')
param tags object

@description('Contact for APIM\'s own required publisher info — not a user-facing email.')
param publisherEmail string

@description('Organization name shown in APIM\'s developer portal.')
param publisherName string

@allowed(['Developer', 'Premium'])
@description('Developer has no SLA; use Premium for production with an availability guarantee.')
param sku string = 'Developer'

param apimSubnetId string
param functionAppUrl string
param entraTenantId string
param entraApiAudience string
param logAnalyticsWorkspaceId string

@description('Origins allowed to call the API from a browser — the SPA\'s own deployed URL(s).')
param corsAllowedOrigins array

resource apim 'Microsoft.ApiManagement/service@2024-05-01' = {
  name: '${namePrefix}-apim'
  location: location
  tags: tags
  sku: { name: sku, capacity: 1 }
  identity: { type: 'SystemAssigned' }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
    virtualNetworkType: 'External'
    virtualNetworkConfiguration: { subnetResourceId: apimSubnetId }
  }
}

resource backend 'Microsoft.ApiManagement/service/backends@2024-05-01' = {
  parent: apim
  name: 'model-api'
  properties: {
    url: functionAppUrl
    protocol: 'http'
    tls: { validateCertificateChain: true, validateCertificateName: true }
  }
}

resource api 'Microsoft.ApiManagement/service/apis@2024-05-01' = {
  parent: apim
  name: 'model-api'
  properties: {
    displayName: 'Odyssey model storage'
    path: ''
    protocols: ['https']
    subscriptionRequired: false // auth is the Entra JWT below, not a second APIM-subscription-key credential
    serviceUrl: functionAppUrl
  }
}

// One passthrough operation per verb this API actually uses (see
// server/src/functions/*.ts) — APIM has no true method-agnostic wildcard
// operation, so this is the standard pattern for fronting a custom API that
// isn't modeled as a full OpenAPI import.
var methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
var corsOriginsXml = join(map(corsAllowedOrigins, o => '<origin>${o}</origin>'), '')
resource operations 'Microsoft.ApiManagement/service/apis/operations@2024-05-01' = [
  for method in methods: {
    parent: api
    name: 'passthrough-${toLower(method)}'
    properties: {
      displayName: '${method} passthrough'
      method: method
      urlTemplate: '/*'
      templateParameters: []
    }
  }
]

resource policy 'Microsoft.ApiManagement/service/apis/policies@2024-05-01' = {
  parent: api
  name: 'policy'
  properties: {
    format: 'xml'
    // NOT a triple-quoted ('''...''') string: Bicep's triple-quote strings
    // are RAW/LITERAL — no ${} interpolation happens inside them at all,
    // which silently produced a policy with the literal text "${entraTenantId}"
    // in it rather than a real tenant id (the linter's no-unused-params
    // warning on those three params is what actually caught this). A regular
    // interpolated string, with \n for line breaks, is what makes the
    // substitution real.
    value: '<policies>\n  <inbound>\n    <base />\n    <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Missing or invalid token.">\n      <openid-config url="${environment().authentication.loginEndpoint}${entraTenantId}/v2.0/.well-known/openid-configuration" />\n      <audiences>\n        <audience>${entraApiAudience}</audience>\n      </audiences>\n      <issuers>\n        <issuer>${environment().authentication.loginEndpoint}${entraTenantId}/v2.0</issuer>\n      </issuers>\n    </validate-jwt>\n    <rate-limit-by-key calls="120" renewal-period="60" counter-key="@(context.Request.Headers.GetValueOrDefault(&quot;Authorization&quot;,&quot;&quot;))" />\n    <cors allow-credentials="false">\n      <allowed-origins>\n        ${corsOriginsXml}\n      </allowed-origins>\n      <allowed-methods>\n        <method>GET</method><method>POST</method><method>PUT</method><method>PATCH</method><method>DELETE</method>\n      </allowed-methods>\n      <allowed-headers>\n        <header>authorization</header><header>content-type</header>\n      </allowed-headers>\n    </cors>\n    <set-backend-service backend-id="model-api" />\n  </inbound>\n  <backend><base /></backend>\n  <outbound><base /></outbound>\n  <on-error><base /></on-error>\n</policies>'
  }
  dependsOn: [backend, operations]
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-law'
  scope: apim
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      { category: 'GatewayLogs', enabled: true }
    ]
    metrics: [
      { category: 'AllMetrics', enabled: true }
    ]
  }
}

output apimGatewayUrl string = apim.properties.gatewayUrl
output apimPrincipalId string = apim.identity.principalId
