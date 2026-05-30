#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

paths=(
  "optional/legacy-multistack/runtime/jvm/java/backend/target"
  "starters/python-api-fastapi/__pycache__"
  "starters/python-api-fastapi/e2e/__pycache__"
  "starters/python-api-fastapi/tests/__pycache__"
  "starters/python-api-fastapi/microposts.db"
  "starters/python-gcp/__pycache__"
  "starters/python-gcp/microposts.db"
  "starters/python-ml/artifacts"
  "starters/python-ml/src/housing_ml/__pycache__"
  "starters/python-ml/src/housing_ml/infra/__pycache__"
  "starters/python-ml/tests/__pycache__"
  "starters/batch/data"
  "starters/rust-api-axum-fullstack/client/dist"
  "starters/rust-api-axum-fullstack/target"
  "starters/rust-api-axum/config/env.test"
  "starters/rust-api-axum/target"
  "starters/rust-batch/target"
  "starters/rust-cli/target"
  "starters/terraform/.terraform"
  "starters/terraform/.terraform.lock.hcl"
  "tools/project-generator/target"
)

for rel in "${paths[@]}"; do
  path="${ROOT}/${rel}"
  if [[ -e "$path" ]]; then
    rm -rf "$path"
    printf 'removed %s\n' "$rel"
  fi
done

mkdir -p "${ROOT}/starters/python-ml/artifacts"
touch "${ROOT}/starters/python-ml/artifacts/.gitkeep"
