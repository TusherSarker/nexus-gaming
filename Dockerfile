# Multi-stage Dockerfile for Nexus Gaming Full-Stack
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root dependencies and install
COPY package*.json ./
RUN npm install

# Copy all source files and build frontend
COPY . .
RUN npm run build

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000

# Copy built frontend, server, public assets, and admin portal
COPY --from=builder /app /app

EXPOSE 10000

CMD ["node", "server/server.js"]
