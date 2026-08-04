# Multi-stage build for the Japnam.tech Next.js app, ready to run in AKS.
#
# Why Node 22 on a FULL (glibc) base:
#   - better-sqlite3 is a native addon; we COMPILE it inside the image (no
#     prebuilt-mismatch), so the running container always matches its own Node.
#   - Hostinger's Node hosting runs 22.x, so this keeps behavior identical.
#   - Alpine (musl) would need a musl-compiled better-sqlite3 and breaks the
#     prebuilt lookup, so we use the Debian-based image.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
# Install build toolchain needed to compile better-sqlite3 from source.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM deps AS builder
WORKDIR /app
COPY . .
# Compile native addons (better-sqlite3) for THIS Node, then build the app.
RUN npm rebuild better-sqlite3 \
    && npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Runtime deps + build tools so better-sqlite3 loads/relinks if needed.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# Data dir for the SQLite blog DB (mounted PVC in AKS; local volume here).
RUN mkdir -p /app/data
EXPOSE 3000
# Next binds to PORT and 0.0.0.0 in production by default.
CMD ["npm", "run", "start"]
