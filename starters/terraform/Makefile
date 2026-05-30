# ============================================================
# Terraform (IaC) - Makefile
# ============================================================
# ENV で環境を切り替える (既定: dev)。 例: make plan ENV=prod
ENV ?= dev
TFVARS = environments/$(ENV).tfvars

.PHONY: help init plan apply destroy fmt validate clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

init: ## terraform init
	terraform init

plan: ## terraform plan (ENV=dev|prod)
	terraform plan -var-file=$(TFVARS)

apply: ## terraform apply (ENV=dev|prod)
	terraform apply -var-file=$(TFVARS)

destroy: ## terraform destroy (ENV=dev|prod)
	terraform destroy -var-file=$(TFVARS)

fmt: ## Format .tf files
	terraform fmt -recursive

validate: ## Validate configuration
	terraform validate

clean: ## Remove local terraform state cache
	rm -rf .terraform .terraform.lock.hcl
