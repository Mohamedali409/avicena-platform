resource "kubernetes_service" "backend" {

  metadata {
    name = "${var.app_name}-service"

    labels = {
      app = var.app_name
    }
  }


  spec {

    selector = {
      app = var.app_name
    }


    type = "NodePort"


    port {

      port = 4000

      target_port = 4000

    }

  }

}