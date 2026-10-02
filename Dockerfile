FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/meaodopp
ENV VITE_CONTACT_FORM_ENDPOINT=$VITE_CONTACT_FORM_ENDPOINT
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm run build

# sqlite3's published binary may require a newer glibc than Bookworm.
# Compile it against our runtime OS and Node headers instead of shipping that
# downloaded binary. Keep compilers out of the final image.
FROM node:22-bookworm-slim AS production-deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev && npm_config_nodedir=/usr/local npm rebuild sqlite3 --build-from-source && node -e "require('sqlite3'); console.log('SQLite native binding loads successfully')" && npm cache clean --force

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=5000 DB_STORAGE=/data/database.sqlite UPLOAD_DIR=/data/uploads
COPY package*.json ./
COPY --from=production-deps /app/node_modules ./node_modules
RUN mkdir -p /data/uploads && chown -R node:node /data
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
USER node
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=6 CMD node -e "fetch('http://127.0.0.1:5000/api/health',{signal:AbortSignal.timeout(4000)}).then(async r=>{const body=await r.text();if(!r.ok){console.error(r.status,body);process.exit(1)}console.log(body)}).catch(e=>{console.error(e.message);process.exit(1)})"
CMD ["npm", "start"]
