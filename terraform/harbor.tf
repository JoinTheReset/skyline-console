resource "kubernetes_secret" "harbor" {
  metadata {
    name      = "dashboard-frontend-harbor"
    namespace = data.kubernetes_namespace.this.metadata.0.name
  }

  data = {
    ".dockerconfigjson" = <<DOCKER
{
  "auths": {
    "${var.docker_registry_server}": {
      "auth": "${base64encode("${var.docker_registry_username}:${var.docker_registry_password}")}"
    }
  }
}
DOCKER
  }

  type = "kubernetes.io/dockerconfigjson"
}
