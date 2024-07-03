terraform {
  required_version = ">=1.4.2"
  cloud {
    organization = "ResetData"

    workspaces {
      tags = ["frontend", "api"]
    }
  }
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.19.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.9.0"
    }
  }
}


provider "kubernetes" {
  host                   = var.k8s_cluster_endpoint
  client_certificate     = base64decode(var.k8s_cluster_certificate)
  client_key             = base64decode(var.k8s_client_key)
  cluster_ca_certificate = base64decode(var.k8s_cluster_ca_certificate)
}
