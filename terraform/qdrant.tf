resource "kubernetes_deployment" "qdrant" {
  metadata {
    name = "qdrant"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "qdrant"
      }
    }

    template {
      metadata {
        labels = {
          app = "qdrant"
        }
      }

      spec {
        container {
          name  = "qdrant"
          image = "qdrant/qdrant:latest"

          port {
            container_port = 6333
          }

          port {
            container_port = 6334
          }
        }
      }
    }
  }
}


resource "kubernetes_service" "qdrant" {
  metadata {
    name = "qdrant"
  }

  spec {
    selector = {
      app = "qdrant"
    }

    port {
      name        = "http"
      port        = 6333
      target_port = 6333
    }

    port {
      name        = "grpc"
      port        = 6334
      target_port = 6334
    }

    type = "ClusterIP"
  }
}