# Deploying a Next.js App on Azure Container Apps with Terraform

A while back I rebuilt my portfolio as a Next.js 16 App Router site. The obvious
host is Vercel, but if you already live in Azure and want predictable,
container-based hosting with serverless scale-to-zero, **Azure Container Apps
(ACA)** is a great fit. This is the guide I wish I had: a single, reproducible
Terraform pipeline that takes a Dockerized Next.js app from zero to a public
HTTPS endpoint.

## Why Azure Container Apps?

Container Apps is a serverless container platform — you bring a container image,
ACA handles the orchestration, ingress, scaling, and logging. Compared to
managing your own AKS cluster, you give up node-level control and gain a lot of
quiet.

- **Scale to zero**: no traffic, no cost. Perfect for a portfolio or side project.
- **Built-in ingress + TLS**: a single FQDN with automatic certificate management.
- **Revision-based deployments**: every deploy is an immutable revision you can
  route traffic to or roll back.
- **Managed identity**: no credentials baked into images — the app authenticates
  to Key Vault and Storage with a managed identity.

## Prerequisites

- An Azure subscription and the Azure CLI logged in (`az login`)
- Terraform >= 1.5
- Docker (for building the image locally before pushing to a registry)
- A Next.js 16 app with a `Dockerfile`

## 1. Containerize the Next.js app

Next.js 16 standalone output keeps the image small. Enable it in
`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@aws-sdk/client-s3", "better-sqlite3"],
};

export default nextConfig;
```

Then a multi-stage `Dockerfile`:

```dockerfile
# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

> Note: with `output: "standalone"`, Next emits a `server.js` that bundles only
> the runtime bits — no `node_modules` copy needed in the runner.

## 2. Provision the infrastructure with Terraform

We need a Resource Group, a Container Registry, a Log Analytics workspace
(required by ACA), the Container App Environment, and the Container App itself.

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "portfolio-rg"
  location = "westeurope"
}

resource "azurerm_container_registry" "acr" {
  name                = "portfolioregistry"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_log_analytics_workspace" "law" {
  name                = "portfolio-law"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "env" {
  name                       = "portfolio-env"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
}
```

## 3. The Container App

The Container App defines the image, ingress, and environment variables. The
key settings for a Next.js server:

- `target_port = 3000` (matches the `EXPOSE` in the Dockerfile)
- `external = true` to expose it publicly
- `min_replicas = 0` for scale-to-zero
- `ingress_transport = "http"` with `allow_insecure = false` for automatic TLS

```hcl
resource "azurerm_container_app" "app" {
  name                         = "portfolio-app"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "web"
      image  = "${azurerm_container_registry.acr.login_server}/portfolio:latest"
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
    }

    min_replicas = 0
    max_replicas = 3
  }

  ingress {
    external           = true
    target_port        = 3000
    transport          = "http"
    allow_insecure_connections = false
  }
}
```

## 4. Build, push, deploy

Authenticate Docker to ACR, build the image, push it, then apply:

```bash
# log in and push the image
az acr login --name portfolioregistry
docker build -t portfolioregistry.azurecr.io/portfolio:latest .
docker push portfolioregistry.azurecr.io/portfolio:latest

# provision everything
terraform init
terraform apply -auto-approve
```

Once `apply` finishes, Terraform prints the Container App FQDN:

```bash
terraform output -raw container_app_url
# => https://portfolio-app.blueocean-1234.westeurope.azurecontainerapps.io
```

## 5. Custom domain + TLS

ACA provisions a default `*.azurecontainerapps.io` URL with a valid cert. To use
your own domain (`japnam.tech`), add a `custom_domain` block and point a CNAME
at the app's FQDN:

```hcl
resource "azurerm_container_app_custom_domain" "cdn" {
  name             = "japnam.tech"
  container_app_id = azurerm_container_app.app.id
  # A managed certificate is issued automatically once the CNAME is verified.
}
```

## Wrapping up

That's the whole loop: a standalone Next.js build, a tiny Docker image, and a
Terraform module that gives you scale-to-zero hosting with managed TLS. No
Kubernetes to babysit, no per-hour VM bills when nobody's visiting. For a
portfolio or a docs site, Container Apps hits the sweet spot between "too much
infra" and "can't customize anything."

If you want revision-based blue/green rollouts or GitHub Actions CI that builds
and pushes the image on every PR, that's a natural next step — say the word and
I'll extend the module.
