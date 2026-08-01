variable "app_name" {
  description = "Application name"
  type        = string
  default     = "avicena-backend"
}

variable "docker_image" {
  description = "Docker Hub Image"
  type        = string
  default     = "mohamedali77i/avicena-backend:latest"
}


variable "container_port" {
  description = "Backend port"
  type        = number
  default     = 4000
}

variable "replicas" {
  description = "Number of pods"
  type        = number
  default     = 3
}

variable "mongodb_url" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}


variable "redis_url" {
  description = "Redis URL"
  type        = string
  default     = "redis://redis:6379"
}

variable "qdrant_url" {
  description = "Qdrant URL"
  type        = string
  default     = "http://qdrant:6333"
}

variable "gemini_api_key" {
  description = "Gemini API Key"
  type        = string
  sensitive   = true
}

variable "cerebras_api_key" {
  description = "Cerebras API Key"
  type        = string
  sensitive   = true
}