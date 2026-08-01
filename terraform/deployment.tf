resource "kubernetes_deployment" "backend" {

  metadata {
    name = var.app_name

    labels = {
      app = var.app_name
    }
  }


  spec {

    replicas = var.replicas


    selector {
      match_labels = {
        app = var.app_name
      }
    }


    template {

      metadata {
        labels = {
          app = var.app_name
        }
      }


      spec {

        container {

          name = var.app_name

          image = var.docker_image


          port {
            container_port = var.container_port
          }


          env_from {

            config_map_ref {
              name = kubernetes_config_map.backend_config.metadata[0].name
            }

          }


          env_from {

            secret_ref {
              name = kubernetes_secret.backend_secret.metadata[0].name
            }

          }


          readiness_probe {

            http_get {
              path = "/api/health"
              port = var.container_port
            }

            initial_delay_seconds = 10
            period_seconds        = 10
          }


          liveness_probe {

            http_get {
              path = "/api/health"
              port = var.container_port
            }

            initial_delay_seconds = 30
            period_seconds        = 20
          }

        }

      }

    }

  }

}