variable "environment" {
  type = map(any)
  default = {
    customer-dashboard-develop = "dev"
    customer-dashboard-staging = "staging"
    customer-dashboard-master  = "prod"
  }
}
variable "k8s_cluster_endpoint" {
  type = string
}

variable "k8s_cluster_certificate" {
  type = string
}

variable "k8s_client_key" {
  type = string
}

variable "k8s_cluster_ca_certificate" {
  type = string
}

variable "docker_registry_server" {
  type = string
}
variable "docker_registry_username" {
  type = string
}
variable "docker_registry_password" {
  type = string
}

variable "docker_image_uri" {
  type = string
}

variable "git_sha" {
  type = string
}

variable "ingress_domain" {
  type = string
}

variable "replicas" {
  type = map(any)
  default = {
    customer-dashboard-develop = 2
    customer-dashboard-staging = 3
    customer-dashboard-master  = 3
  }
}

variable "app_name" {
  type    = string
  default = "dashboard"
}
