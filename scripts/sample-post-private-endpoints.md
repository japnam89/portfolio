# Private Endpoints: A Practical Walkthrough

If you've spent any time locking down an Azure workload, you've hit the moment
where "just make it private" turns into a rabbit hole of VNets, DNS, and
service-specific quirks. Azure **Private Endpoints** are the cleanest answer
for most of those cases — but the docs explain the *what* and skip the
*practical gotchas* that bite you at 2am. This is the walkthrough I wish I'd
had: when to use them, how to wire one up with Terraform, and the DNS traps
that silently break connectivity.

## What a Private Endpoint actually is

A Private Endpoint is a **network interface (NIC) in your own VNet** that
connects privately and securely to an Azure PaaS resource (Storage, SQL,
Key Vault, Container Registry, Postgres, …) over the Microsoft backbone. Once
it exists:

- The PaaS resource gets a **private IP inside your VNet** (e.g. `10.1.2.7`).
- Traffic from your VNet to that resource **never traverses the public
  internet** — no public IP, no exposure to the open web.
- You can (and usually should) **disable public network access** on the target
  service, closing the attack surface entirely.

The mental model: the Private Endpoint is the *door* into the service; the
**Private DNS zone** is the *sign* that tells clients which door to use.

## When to reach for one

- You're putting a database, storage account, or key vault behind a private
  network and want zero public exposure.
- Compliance requires data to stay on the Microsoft network.
- You're connecting from an App Service / Container App / VM that lives in a VNet
  and shouldn't egress to the internet to reach a PaaS dependency.

**When NOT to:** if the consumer is outside your VNet and has no VPN/Express
Route, a Private Endpoint doesn't help — you'd need a public endpoint or a
gateway. Private Endpoints are intra-VNet (or peered-VNet) tools.

## Architecture at a glance

```text
┌──────────────────────────┐         ┌───────────────────────────┐
│  Your VNet (10.1.0.0/16) │         │  Azure PaaS (e.g. Storage)│
│                          │         │                          │
│  app-subnet 10.1.1.0/24  │   NIC   │  public network access:   │
│   └─ Container App ──────┼────────►│   Disabled                │
│                          │ 10.1.2.7│  private endpoint IP       │
│  private-dns-zone        │         │                          │
│   privatelink.blob...    │         └───────────────────────────┘
└──────────────────────────┘
```

The Container App resolves `mystorage.blob.core.windows.net` to `10.1.2.7`
(via the Private DNS zone) and talks to Storage entirely on the backbone.

## Terraform walkthrough

We'll privatize a Storage Account. You need: a VNet + subnet, a Private
Endpoint, and a Private DNS zone linked to your VNet.

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "private-endpoint-rg"
  location = "westeurope"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "core-vnet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.1.0.0/16"]
}

resource "azurerm_subnet" "endpoint_subnet" {
  name                 = "private-endpoints"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  # Disable private endpoint network policies so the NIC can be created.
  private_endpoint_network_policies = "Disabled"
  address_prefixes     = ["10.1.2.0/24"]
}

resource "azurerm_storage_account" "sa" {
  name                = "japnamprivatesa"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  account_tier        = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_private_endpoint" "sa_blob" {
  name                = "sa-blob-pe"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.endpoint_subnet.id

  private_service_connection {
    name                           = "sa-blob-conn"
    private_connection_resource_id = azurerm_storage_account.sa.id
    is_manual_connection           = false
    subresource_names              = ["blob"]
  }
}
```

The `subresource_names = ["blob"]` is the key line — it targets the **blob**
sub-resource of the storage account specifically.

## The DNS half (don't skip this)

A Private Endpoint gives you a private IP, but clients still resolve the
*public* FQDN unless you tell them otherwise. That's the Private DNS zone's
job. Without it, your app resolves `mystorage.blob.core.windows.net` to the
public IP and gets blocked (because you'll disable public access).

```hcl
resource "azurerm_private_dns_zone" "blob" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "blob_link" {
  name                  = "blob-dns-link"
  resource_group_name   = azurerm_resource_group.rg.name
  private_dns_zone_name = azurerm_private_dns_zone.blob.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
  registration_enabled  = false
}

resource "azurerm_private_dns_a_record" "blob" {
  name                = azurerm_storage_account.sa.name
  zone_name           = azurerm_private_dns_zone.blob.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.sa_blob.private_ip_address]
}
```

> The A record must point at `azurerm_private_endpoint.sa_blob.private_ip_address`
> — the NIC's private IP. Automating this (instead of hardcoding) keeps the
> link correct across redeploys.

## Lock it down

Now disable public access so the only path in is the Private Endpoint:

```hcl
resource "azurerm_storage_account_network_rules" "sa_rules" {
  storage_account_id = azurerm_storage_account.sa.id
  default_action     = "Deny"
  # Allow the VNet via a service endpoint (optional belt-and-braces)
  virtual_network_subnet_ids = [azurerm_subnet.endpoint_subnet.id]
  private_endpoints_enabled   = true
}
```

With `default_action = "Deny"` and `private_endpoints_enabled = true`, the
storage account is reachable **only** through the Private Endpoint.

## Common gotchas

1. **DNS is 90% of the failures.** If connectivity works from the VNet but
   resolves to a public IP, your Private DNS link or A record is missing/wrong.
   From inside the VNet, run `nslookup mystorage.blob.core.windows.net` — it
   should return the `10.1.2.x` address, not a `20.x` public one.

2. **`private_endpoint_network_policies = "Disabled"`** on the subnet. If it's
   enabled, Endpoint creation fails or the NIC can't be programmed.

3. **Cross-VNet? You need peering + a DNS link in each VNet.** A Private
   Endpoint in VNet A is resolvable from VNet B only if the VNets are peered
   and B has its own link to the Private DNS zone (or forwards DNS).

4. **`is_manual_connection`** — leave `false` for resources you own. Set `true`
   only when requesting access to *someone else's* resource (they must approve).

5. **Sub-resource matters.** Storage has `blob`, `file`, `queue`, `table`,
   `dfs`. Pick the right one or the connection won't bind.

## Verify it worked

```bash
# From a VM / container in the VNet:
nslookup japnamprivatesa.blob.core.windows.net
# -> Address:  10.1.2.7   (private IP, not public)

# And a quick connectivity test:
curl -sI https://japnamprivatesa.blob.core.windows.net/
# -> HTTP/1.1 200 (served over the private link)
```

If `nslookup` returns a public IP, stop and fix DNS before touching anything
else — the endpoint is fine; the name resolution isn't.

## Wrapping up

Private Endpoints are deceptively simple: create a NIC in your VNet, point it
at a PaaS sub-resource, and disable public access. The entire operational
burden is really **DNS** — get the Private DNS zone, the VNet link, and the A
record right, and everything else follows. For a portfolio or production
workload that touches Storage, SQL, or Key Vault, this is the difference
between "it's on the internet, hope the firewall holds" and "it simply isn't
reachable from outside the VNet."

Next up: I'll cover **Private Endpoints for Azure SQL and Key Vault** with
managed identity, so your apps authenticate without a single secret in an
image.
