# ---- Stage 1: install production dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Stage 2: final runtime image ----
FROM node:22-alpine
ENV NODE_ENV=production

# Remove package managers: the app only needs the node binary at runtime
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
           /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app.js server.js package.json ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]