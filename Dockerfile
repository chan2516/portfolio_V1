# Build Stage
FROM node:20 AS build
WORKDIR /app
ARG VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/meaodopp
ENV VITE_CONTACT_FORM_ENDPOINT=$VITE_CONTACT_FORM_ENDPOINT
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
