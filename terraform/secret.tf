resource "kubernetes_secret" "backend_secret" {

  metadata {
    name = "${var.app_name}-secret"
  }
    data = {
    MONGODB_URL       = var.mongodb_url
    JWT_SECRET        = var.jwt_secret
    REDIS_URL         = var.redis_url
    QDRANT_URL        = var.qdrant_url
    GEMINI_API_KEY    = var.gemini_api_key
    CEREBRAS_API_KEY  = var.cerebras_api_key
    }

  type = "Opaque"
}