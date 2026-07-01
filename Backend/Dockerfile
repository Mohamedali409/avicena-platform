# ── Stage 1: deps ─────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile

# ── Stage 2: dev ──────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]

# ── Stage 3: production ───────────────────────────────
FROM node:22-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev --frozen-lockfile

COPY . .

# مجلد للـ uploads المؤقتة
RUN mkdir -p uploads && chmod 755 uploads

# مش بنشغل كـ root في production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000
CMD ["node", "server.js"]
