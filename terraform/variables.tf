variable "environment" {
  type = map(any)
  default = {
    develop = "dev"
    staging = "staging"
    master  = "prod"
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

variable "app_name" {
  type = string
}

variable "replicas" {
  type = map(any)
  default = {
    develop = 2
    staging = 3
    master  = 3
  }
}

variable "app_name" {
  type    = string
  default = "dashboard"
}
