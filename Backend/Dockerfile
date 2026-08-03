# ==========================================
# Stage 1 - Install Dependencies
# ==========================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ==========================================
# Stage 2 - Development
# ==========================================
FROM node:22-alpine AS dev

WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# ==========================================
# Stage 3 - Production
# ==========================================
FROM node:22-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production

LABEL maintainer="Mohamed Ali"
LABEL project="Avicena Backend"
LABEL description="Production image for Avicena API"


RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup


COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force


COPY . .


RUN mkdir -p uploads && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s \
             --timeout=5s \
             --start-period=30s \
             --retries=3 \
CMD wget --no-verbose --spider http://localhost:${PORT:-4000}/api/health || exit 1

CMD ["node", "server.js"]