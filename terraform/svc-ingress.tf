resource "kubernetes_service" "this" {
  metadata {
    name      = "dashboard-frontend"
    namespace = data.kubernetes_namespace.this.metadata.0.name
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
