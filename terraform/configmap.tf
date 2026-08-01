resource "kubernetes_config_map" "backend_config" {

  metadata {
    name = "${var.app_name}-config"
  }

  data = {
    NODE_ENV = "production"

    PORT = tostring(var.container_port)

    PAYMENT_PROVIDER = "manual"

  }
}
