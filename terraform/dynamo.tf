module "dynamodb_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "3.3.0"

  name                           = var.environment
  server_side_encryption_enabled = false
  deletion_protection_enabled    = false

  hash_key    = "user_id"
  range_key   = "date"
  table_class = "STANDARD"

  attributes = [
    {
      name = "user_id"
      type = "S"
    },
    {
      name = "date"
      type = "S"
  }]

  tags = var.tags
}
