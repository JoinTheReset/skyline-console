resource "kubernetes_service" "this" {
  metadata {
    name      = "dashboard"
    namespace = kubernetes_namespace.this.metadata.0.name
  }

  spec {
    selector = {
      application = kubernetes_deployment.this.metadata.0.labels.application
      component   = kubernetes_deployment.this.metadata.0.labels.component
    }

    port {
      port        = 8080
      target_port = 80
    }
  }
}

resource "kubernetes_ingress_v1" "this" {
  metadata {
    name      = "api"
    namespace = kubernetes_namespace.this.metadata.0.name
    annotations = {
      "cert-manager.io/cluster-issuer" = "letsencrypt-production-frontend"
    }
  }

  spec {
    ingress_class_name = "frontend-nginx"
    tls {
      hosts       = [var.ingress_domain]
      secret_name = "dashboard-tls"
    }

    rule {
      host = var.ingress_domain
      http {
        path {
          backend {
            service {
              name = kubernetes_service.this.metadata.0.name
              port {
                number = kubernetes_service.this.spec.0.port.0.port
              }
            }
          }
          path      = "/"
          path_type = "ImplementationSpecific"
        }
      }
    }
  }
}
