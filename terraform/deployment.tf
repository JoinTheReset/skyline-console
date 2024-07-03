resource "kubernetes_deployment" "this" {
  metadata {
    name      = "dashboard"
    namespace = kubernetes_namespace.this.metadata.0.name
    labels = {
      application = "dashboard"
      component   = "frontend"
    }
  }

  spec {
    replicas = var.replicas[terraform.workspace]

    selector {
      match_labels = {
        application = "dashboard"
        component   = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          application = "dashboard"
          component   = "frontend"
        }
      }

      spec {
        image_pull_secrets {
          name = kubernetes_secret.harbor.metadata.0.name
        }
        container {
          image = "${var.docker_image_uri}:${var.git_sha}"
          name  = "api"

          resources {
            limits = {
              cpu    = "1"
              memory = "1Gi"
            }

            requests = {
              cpu    = "128m"
              memory = "128Mi"
            }
          }

          port {
            name           = "http"
            container_port = 80
          }
        }
      }
    }
  }
}
