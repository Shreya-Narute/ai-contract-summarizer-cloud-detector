# ── Stage 1: build ──────────────────────────────────────────────────────────
# Build the React app into static files.
# REACT_APP_API_URL is baked in at build time (CRA replaces process.env.*
# references during the webpack bundle step).
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

COPY . .

# Accept the backend URL as a build argument.
# Local default: empty string → api.ts falls back to http://localhost:8000
# Production:    pass --build-arg REACT_APP_API_URL=https://your-backend-url
ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
# Serve the built static files with nginx.
# This replaces the CRA dev server (npm run start) which is not suitable
# for production — it is slow, memory-heavy, and exposes source maps.
FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
