# Private Endpoints for Azure SQL & Key Vault (with Managed Identity)

In the [first post](/blog/private-endpoints-a-practical-walkthrough) we
privatized a Storage Account and learned that DNS is where Private Endpoints
live or die. This time we go after the two services that hold your
crown jewels: **Azure SQL** and **Key Vault**. The twist is authentication —
done right, your app talks to both over a private link using a **managed
identity**, with *no secrets in connection strings or images*. That's the
holy grail: private network path **and** zero credentials to leak.

## The shape of the problem

A typical app needs:

- **Azure SQL** for data — historically reached by a connection string with a
  username/password (or a SQL admin login). Both are secrets.
- **Key Vault** for certificates, connection strings, and keys — reached by a
  URI + a secret/`clientId`/`clientSecret` (more secrets).

If those services are public, anyone who guesses the FQDN + has creds is in.
Private Endpoints close the network path; **managed identity** removes the
creds. Do both and there's simply nothing to exfiltrate.

## What managed identity buys you

A **User-Assigned Managed Identity (UAMI)** is an Azure AD identity you create
once and attach to your app (Container App, VM, App Service). At runtime, the
app gets a token for that identity *from the Azure IMDS endpoint* —
`http://169.254.169.254` — with no client secret involved.

- **SQL** can authenticate the UAMI via Azure AD (`Active Directory Default`
  / `ActiveDirectoryManagedIdentity` in drivers). No SQL login password.
- **Key Vault** grants the UAMI a `get`/`list` policy. The SDK uses
  `DefaultAzureCredential`, which picks up the managed identity automatically.

So the app holds **zero secrets**. The only thing it needs is the (private)
endpoint hostname.

## Terraform: SQL Private Endpoint + DNS

```hcl
resource "azurerm_mssql_server" "sql" {
  name                         = "japnam-sql"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = var.sql_admin_password # used only for bootstrap
  azuread_administrator {
    login_username = "japnam-azure-architect"
    object_id      = var.architect_object_id
  }
}

resource "azurerm_private_endpoint" "sql" {
  name                = "sql-pe"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.endpoint_subnet.id

  private_service_connection {
    name                           = "sql-conn"
    private_connection_resource_id = azurerm_mssql_server.sql.id
    is_manual_connection           = false
    subresource_names              = ["sqlServer"]
  }
}

resource "azurerm_private_dns_zone" "sql" {
  name                = "privatelink.database.windows.net"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "sql_link" {
  name                  = "sql-dns-link"
  resource_group_name   = azurerm_resource_group.rg.name
  private_dns_zone_name = azurerm_private_dns_zone.sql.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}

resource "azurerm_private_dns_a_record" "sql" {
  name                = azurerm_mssql_server.sql.name
  zone_name           = azurerm_private_dns_zone.sql.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.sql.private_ip_address]
}
```

Note `subresource_names = ["sqlServer"]` — SQL's sub-resource is `sqlServer`,
not `sql`. Get that wrong and the connection won't bind.

## Terraform: Key Vault Private Endpoint + DNS

Key Vault's sub-resource is `vault`:

```hcl
resource "azurerm_key_vault" "kv" {
  name                        = "japnam-kv"
  resource_group_name         = azurerm_resource_group.rg.name
  location                    = azurerm_resource_group.rg.location
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  # No public access — private endpoint only.
  public_network_access_enabled = false
  # Give our managed identity read access at the vault level:
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_user_assigned_identity.app.principal_id
    secret_permissions = ["Get", "List"]
    certificate_permissions = ["Get", "List"]
  }
}

resource "azurerm_private_endpoint" "kv" {
  name                = "kv-pe"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.endpoint_subnet.id

  private_service_connection {
    name                           = "kv-conn"
    private_connection_resource_id = azurerm_key_vault.kv.id
    is_manual_connection           = false
    subresource_names              = ["vault"]
  }
}

resource "azurerm_private_dns_zone" "kv" {
  name                = "privatelink.vaultcore.azure.net"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "kv_link" {
  name                  = "kv-dns-link"
  resource_group_name   = azurerm_resource_group.rg.name
  private_dns_zone_name = azurerm_private_dns_zone.kv.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}

resource "azurerm_private_dns_a_record" "kv" {
  name                = azurerm_key_vault.kv.name
  zone_name           = azurerm_private_dns_zone.kv.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.kv.private_ip_address]
}
```

Setting `public_network_access_enabled = false` on the vault means the *only*
way in is the Private Endpoint. Combined with the DNS link, your app resolves
`japnam-kv.vault.azure.net` to the private IP.

## The managed identity itself

```hcl
resource "azurerm_user_assigned_identity" "app" {
  name                = "app-uami"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Let the UAMI log into SQL as an Azure AD user (no SQL password).
resource "azurerm_mssql_active_directory_administrator" "sql_aad" {
  server_id = azurerm_mssql_server.sql.id
  login    = "japnam-azure-architect"
  object_id = var.architect_object_id
}

# SQL: create a contained user for the UAMI and grant db_datareader/writer.
# (Run via az sql or a post-deploy script using the AAD admin login.)
```

Then your app code uses the identity — here's a Node.js example with the
`@azure/identity` + `mssql` drivers:

```ts
import { DefaultAzureCredential } from "@azure/identity";
import { connect } from "mssql";

// No password anywhere — the token comes from the managed identity at runtime.
const credential = new DefaultAzureCredential();
const token = await credential.getToken("https://database.windows.net/.default");

const pool = await connect({
  server: "japnam-sql.database.windows.net", // resolves to the private IP
  authentication: {
    type: "azure-active-directory-access-token",
    options: { token: token.token },
  },
  options: { encrypt: true, port: 1433 },
  database: "appdb",
});
```

For Key Vault, the SDK finds the identity automatically:

```ts
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const client = new SecretClient(
  "https://japnam-kv.vault.azure.net", // private DNS resolves this
  credential,
);
const secret = await client.getSecret("db-connection-string");
```

`DefaultAzureCredential` checks the IMDS endpoint first when running on an
Azure resource with a managed identity — no env vars, no secrets file.

## Closing the loops

1. **Disable SQL public access** once the endpoint + DNS are verified:
   ```hcl
   resource "azurerm_mssql_server_security_alert_policy" "sql_sec" {
     resource_group_name    = azurerm_resource_group.rg.name
     server_name            = azurerm_mssql_server.sql.name
     state                   = "Enabled"
     # ... and set public_network_access_enabled = false on the server
   }
   ```
   (Set `public_network_access_enabled = false` on `azurerm_mssql_server` once
   DNS is confirmed.)
2. **Verify DNS from inside the VNet:**
   ```bash
   nslookup japnam-sql.database.windows.net   # -> private IP
   nslookup japnam-kv.vault.azure.net         # -> private IP
   ```
   If either returns a public IP, the DNS link/A-record is wrong — fix before
   declaring victory (same lesson as post #1).

## Gotchas specific to SQL + Key Vault

- **SQL AAD admin must exist before creating the UAMI user** — bootstrap the
  AAD admin, then create the contained DB user for the identity in a
  post-deploy step.
- **Key Vault `public_network_access_enabled = false` is strict** — even the
  Azure portal's "secret value" view goes through the data plane, so you'll
  need to be on the VNet (or peered) to read secrets. Plan your
  break-glass access.
- **Token audience matters:** SQL uses
  `https://database.windows.net/.default`; Key Vault uses
  `https://vault.azure.net` (or `.vault.azure.net`). Mismatched audiences →
  `401`.
- **Private DNS links are per-VNet** — consumers in a peered VNet need their
  own link (or DNS forwarding).

## Wrapping up

Private Endpoints get your SQL and Key Vault off the public internet; managed
identity removes the secrets that would otherwise ride along in connection
strings. Together they're the difference between "we hope the firewall holds"
and "there is no public door, and even if there were, there's no password."
The Terraform is mechanical; the DNS half and the AAD-bootstrap ordering are
where the real work hides — exactly like the storage walkthrough.

Next: **private ingress with Application Gateway + Private Endpoints** — putting
a WAF in front of your privatized services without exposing anything public.
