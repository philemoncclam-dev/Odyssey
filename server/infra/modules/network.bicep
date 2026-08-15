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

// APIM's internal load balancer rejects all inbound traffic by default —
// an NSG explicitly allowing it is a hard prerequisite for VNet injection,
// not optional hardening. Minimum rule set per Microsoft's External mode
// docs (learn.microsoft.com/azure/api-management/api-management-using-with-vnet).
resource apimNsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: '${namePrefix}-apim-nsg'
  location: location
  tags: tags
  properties: {
    securityRules: [
      {
        name: 'Allow-Client-Communication'
        properties: {
          direction: 'Inbound'
          access: 'Allow'
          priority: 100
          protocol: 'Tcp'
          sourceAddressPrefix: 'Internet'
          sourcePortRange: '*'
          destinationAddressPrefix: 'VirtualNetwork'
          destinationPortRanges: ['80', '443']
        }
      }
      {
        name: 'Allow-Management-Endpoint'
        properties: {
          direction: 'Inbound'
          access: 'Allow'
          priority: 110
          protocol: 'Tcp'
          sourceAddressPrefix: 'ApiManagement'
          sourcePortRange: '*'
          destinationAddressPrefix: 'VirtualNetwork'
          destinationPortRange: '3443'
        }
      }
      {
        name: 'Allow-Load-Balancer'
        properties: {
          direction: 'Inbound'
          access: 'Allow'
          priority: 120
          protocol: 'Tcp'
          sourceAddressPrefix: 'AzureLoadBalancer'
          sourcePortRange: '*'
          destinationAddressPrefix: 'VirtualNetwork'
          destinationPortRange: '6390'
        }
      }
      {
        name: 'Allow-Traffic-Manager'
        properties: {
          direction: 'Inbound'
          access: 'Allow'
          priority: 130
          protocol: 'Tcp'
          sourceAddressPrefix: 'AzureTrafficManager'
          sourcePortRange: '*'
          destinationAddressPrefix: 'VirtualNetwork'
          destinationPortRange: '443'
        }
      }
      {
        name: 'Allow-Certificate-Validation-Out'
        properties: {
          direction: 'Outbound'
          access: 'Allow'
          priority: 100
          protocol: 'Tcp'
          sourceAddressPrefix: 'VirtualNetwork'
          sourcePortRange: '*'
          destinationAddressPrefix: 'Internet'
          destinationPortRange: '80'
        }
      }
      {
        name: 'Allow-Storage-Out'
        properties: {
          direction: 'Outbound'
          access: 'Allow'
          priority: 110
          protocol: 'Tcp'
          sourceAddressPrefix: 'VirtualNetwork'
          sourcePortRange: '*'
          destinationAddressPrefix: 'Storage'
          destinationPortRange: '443'
        }
      }
      {
        name: 'Allow-Sql-Out'
        properties: {
          direction: 'Outbound'
          access: 'Allow'
          priority: 120
          protocol: 'Tcp'
          sourceAddressPrefix: 'VirtualNetwork'
          sourcePortRange: '*'
          destinationAddressPrefix: 'SQL'
          destinationPortRange: '1433'
        }
      }
      {
        name: 'Allow-KeyVault-Out'
        properties: {
          direction: 'Outbound'
          access: 'Allow'
          priority: 130
          protocol: 'Tcp'
          sourceAddressPrefix: 'VirtualNetwork'
          sourcePortRange: '*'
          destinationAddressPrefix: 'AzureKeyVault'
          destinationPortRange: '443'
        }
      }
      {
        name: 'Allow-Monitor-Out'
        properties: {
          direction: 'Outbound'
          access: 'Allow'
          priority: 140
          protocol: 'Tcp'
          sourceAddressPrefix: 'VirtualNetwork'
          sourcePortRange: '*'
          destinationAddressPrefix: 'AzureMonitor'
          destinationPortRanges: ['1886', '443']
        }
      }
    ]
  }
}

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
          networkSecurityGroup: { id: apimNsg.id }
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
