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

# إنشاء User غير root
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# تثبيت Production Dependencies فقط
COPY package*.json ./

RUN npm ci --omit=dev && \
    npm cache clean --force

# نسخ المشروع
COPY . .

# إنشاء uploads
RUN mkdir -p uploads && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

# Railway هيعتبر الكونتينر Healthy
HEALTHCHECK --interval=30s \
             --timeout=5s \
             --start-period=30s \
             --retries=3 \
CMD wget --no-verbose --spider http://localhost:${PORT:-4000}/api/health || exit 1

CMD ["node", "server.js"]