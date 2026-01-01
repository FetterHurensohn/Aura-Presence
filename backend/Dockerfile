# ============================================
# Aura Presence Backend - Railway Dockerfile
# ============================================
# Simplified single-stage build for Railway
# Build timestamp: 2026-01-01 Force rebuild to clear Railway cache

FROM node:20-alpine

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# --omit=dev excludes devDependencies
# bcrypt NEEDS to be built (native module for password hashing)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]

