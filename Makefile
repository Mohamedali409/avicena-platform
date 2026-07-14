# ══════════════════════════════════════════
#  Avicena — Docker shortcuts
# ══════════════════════════════════════════

# ── Dev ───────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f backend

restart:
	docker compose restart backend

build:
	docker compose build --no-cache

shell:
	docker compose exec backend sh

seed:
	docker compose exec backend npm run seed
# docker compose logs backend --tail=200
# ── Production ────────────────────────────
prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f backend

prod-build:
	docker compose -f docker-compose.prod.yml build --no-cache

# ── Cleanup ───────────────────────────────
clean:
	docker compose down -v --remove-orphans
	docker system prune -f

.PHONY: up down logs restart build shell seed prod-up prod-down prod-logs prod-build clean
