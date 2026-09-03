# n8n Traefik routing — add these labels to the n8n service in the VPS
# docker-compose.yml so that n8n-1lje.srv1948665.hstgr.cloud/webhook/*
# reaches the n8n container (port 5678) instead of falling through to the
# portfolio app's /convert endpoint (which returns a PDF for unknown routes).
#
# The n8n container currently has NO traefik labels — only a port mapping
# (0.0.0.0:32771->5678/tcp) which is not exposed externally.
#
# Add these labels to the n8n service:
#
#   labels:
#     - 'traefik.enable=true'
#     - 'traefik.http.routers.n8n.rule=Host(`n8n-1lje.srv1948665.hstgr.cloud`)'
#     - 'traefik.http.routers.n8n.entrypoints=websecure'
#     - 'traefik.http.routers.n8n.tls=true'
#     - 'traefik.http.routers.n8n.tls.certresolver=letsencrypt'
#     - 'traefik.http.services.n8n.loadbalancer.server.port=5678'
#
# Then restart: docker compose up -d
#
# After that, the production webhook URL
#   https://n8n-1lje.srv1948665.hstgr.cloud/webhook/sgpc-kirtan-duty
# will actually reach n8n, and the workflow can be toggled to "Active"
# for always-on behavior (no more -test suffix, no more one-shot).
#
# See: src/app/api/raghi/route.ts for the webhook URL config.

# --- Example n8n service block (add to VPS docker-compose.yml) ---
#
# services:
#   n8n:
#     image: docker.n8n.io/n8nio/n8n
#     restart: unless-stopped
#     network_mode: host
#     ports:
#       - "32771:5678"   # keep for direct access; not needed once Traefik labels are set
#     environment:
#       - N8N_HOST=n8n-1lje.srv1948665.hstgr.cloud
#       - N8N_PORT=5678
#       - N8N_PROTOCOL=https
#       - WEBHOOK_URL=https://n8n-1lje.srv1948665.hstgr.cloud/
#     labels:
#       - 'traefik.enable=true'
#       - 'traefik.http.routers.n8n.rule=Host(`n8n-1lje.srv1948665.hstgr.cloud`)'
#       - 'traefik.http.routers.n8n.entrypoints=websecure'
#       - 'traefik.http.routers.n8n.tls=true'
#       - 'traefik.http.routers.n8n.tls.certresolver=letsencrypt'
#       - 'traefik.http.services.n8n.loadbalancer.server.port=5678'
#
# volumes:
#   n8n-data:/home/node/.n8n
#
# volumes:
#   n8n-data:
#
