resource "kubernetes_namespace" "this" {
  metadata {
    name = "${var.app_name}-${var.environment[terraform.workspace]}"
  }
}
