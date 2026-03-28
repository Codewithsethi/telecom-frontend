# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Stage 2: NGINX
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular browser build output (Universal has browser/server folders)
COPY --from=build /app/dist/telecom-frontend/browser /usr/share/nginx/html

# Ensure nginx fallback index exists for Angular SPA routing
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Copy nginx config (for routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]