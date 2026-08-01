# ══════════════════════════════════════════
#  Avicena — Kubernetes shortcuts
# ══════════════════════════════════════════

APP_NAME=avicena-backend
IMAGE=mohamedali77i/avicena-backend:latest


# ── Kubernetes Deploy ─────────────────────

apply:
	terraform apply -auto-approve

destroy:
	terraform destroy -auto-approve


# ── Docker Image ──────────────────────────

build:
	docker build -t $(IMAGE) ../Backend

push:
	docker push $(IMAGE)

build-push:
	make build
	make push


# ── Kubernetes Rollout ────────────────────

restart:
	kubectl rollout restart deployment $(APP_NAME)

rollout-status:
	kubectl rollout status deployment $(APP_NAME)

update:
	make build-push
	make restart
	make rollout-status


# ── Logs & Debug ──────────────────────────

logs:
	kubectl logs -l app=$(APP_NAME) --tail=100 -f

status:
	kubectl get pods

services:
	kubectl get svc

describe:
	kubectl describe deployment $(APP_NAME)


shell:
	kubectl exec -it $$(kubectl get pod -l app=$(APP_NAME) -o jsonpath="{.items[0].metadata.name}") -- sh


# ── Testing ───────────────────────────────

url:
	minikube service $(APP_NAME)-service --url

health:
	curl $$(minikube service $(APP_NAME)-service --url)/api/health


# ── Minikube ──────────────────────────────

start:
	minikube start

stop:
	minikube stop

restart-cluster:
	minikube stop
	minikube start


# ── Cleanup ───────────────────────────────

clean:
	kubectl delete deployment $(APP_NAME)
	kubectl delete service $(APP_NAME)-service


.PHONY: apply destroy build push build-push restart rollout-status update logs status services describe shell url health start stop restart-cluster clean