variable "environment" {
  description = "Environment name for project"
  type        = string

  default = "recipe_ai_serverless"
}

variable "region" {
  description = "AWS Region where resources will be deployed"
  type        = string

  default = "us-east-2"
}

variable "tags" {
  description = "Tags to be applied to resources"
  type        = map(string)

  default = {}
}