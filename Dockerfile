FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/meaodopp
ENV VITE_CONTACT_FORM_ENDPOINT=$VITE_CONTACT_FORM_ENDPOINT
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=5000 DB_STORAGE=/data/database.sqlite UPLOAD_DIR=/data/uploads
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force && mkdir -p /data/uploads && chown -R node:node /data
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist
USER node
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=6 CMD node -e "fetch('http://127.0.0.1:5000/api/health',{signal:AbortSignal.timeout(4000)}).then(async r=>{const body=await r.text();if(!r.ok){console.error(r.status,body);process.exit(1)}console.log(body)}).catch(e=>{console.error(e.message);process.exit(1)})"
CMD ["npm", "start"]
