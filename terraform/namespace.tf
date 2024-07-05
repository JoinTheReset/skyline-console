data "kubernetes_namespace" "this" {
  metadata {
    name = "dashboard-${var.environment[terraform.workspace]}"
  }
}
