locals {
  domain = "brewsentry.com"

  environment = replace(var.environment, "_", "-")

  site_domain = "recipes.${local.domain}"
}