// The VNet everything else attaches to. Three subnets, three jobs:
//   snet-functions        — VNet integration for the Function App's OUTBOUND
//                            calls (to Cosmos), delegated to Microsoft.App —
//                            Flex Consumption's VNet integration reuses the
//                            Container Apps environment delegation, not the
//                            classic App Service one (Microsoft.Web/serverFarms).
//   snet-privateendpoints — where Cosmos's Private Endpoint gets its NIC.
//   snet-apim             — APIM injected here (External mode: its gateway
//                            keeps a public IP, but it reaches the Function
//                            App over this VNet instead of the internet).
//
// This does NOT make the Function App unreachable from the public internet
// by itself — that's main.bicep's `ipSecurityRestrictions`, which locks
// inbound to only this VNet's APIM subnet. A VNet without that restriction
// is a private back door, not a front gate.
@description('Region for every resource.')
param location string

@description('Prefix for every resource name.')
param namePrefix string

@description('Tags applied to every resource this module creates.')
param tags object

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: '${namePrefix}-vnet'
  location: location
  tags: tags
  properties: {
    addressSpace: { addressPrefixes: ['10.20.0.0/16'] }
    subnets: [
      {
        name: 'snet-functions'
        properties: {
          addressPrefix: '10.20.1.0/24'
          delegations: [
            {
              name: 'functions-delegation'
              properties: { serviceName: 'Microsoft.App/environments' }
            }
          ]
        }
      }
      {
        name: 'snet-privateendpoints'
        properties: {
          addressPrefix: '10.20.2.0/24'
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'snet-apim'
        properties: {
          addressPrefix: '10.20.3.0/24'
        }
      }
    ]
  }
}

// Cosmos's Private Endpoint resolves through this zone — without it, DNS for
// the account's hostname still returns its PUBLIC ip even after the Private
// Endpoint exists, and traffic quietly keeps leaving the VNet.
resource cosmosDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  name: 'privatelink.documents.azure.com'
  location: 'global'
  tags: tags
}

resource cosmosDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2024-06-01' = {
  parent: cosmosDnsZone
  name: '${namePrefix}-cosmos-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: { id: vnet.id }
  }
}

output vnetId string = vnet.id
output functionsSubnetId string = vnet.properties.subnets[0].id
output privateEndpointsSubnetId string = vnet.properties.subnets[1].id
output apimSubnetId string = vnet.properties.subnets[2].id
output cosmosDnsZoneId string = cosmosDnsZone.id
