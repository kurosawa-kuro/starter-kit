# ECS Run Task Hello World - Makefile
# ====================================

# Configuration
ACCOUNT_ID := 889082311746
REGION := ap-northeast-1
ECR_REPO := hello-ecs
IMAGE_TAG := latest
CLUSTER := default
TASK_FAMILY := hello-run-task
SUBNET := subnet-01f2666b2d0e7c2f2
SECURITY_GROUP := sg-04123efb77d7f204e
LOG_GROUP := /ecs/hello-run
VPC_ID := vpc-0deefc43af5b1b076

ECR_URI := $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(ECR_REPO)

.PHONY: help setup setup-iam setup-ecr setup-logs setup-cluster build push register run run-with-env logs status all clean local

help:
	@echo "ECS Run Task Hello World (with MongoDB)"
	@echo "========================================"
	@echo ""
	@echo "Setup:"
	@echo "  make setup        - Create all AWS resources (IAM, ECR, Logs, Cluster)"
	@echo "  make setup-iam    - Create ecsTaskExecutionRole"
	@echo "  make setup-ecr    - Create ECR repository"
	@echo "  make setup-logs   - Create CloudWatch Log Group"
	@echo "  make setup-cluster - Create ECS cluster"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build        - Build Docker image"
	@echo "  make push         - Push image to ECR"
	@echo "  make register     - Register task definition"
	@echo "  make run          - Run ECS task (without MongoDB)"
	@echo "  make run-with-env - Run ECS task (with MongoDB URI)"
	@echo ""
	@echo "Local Development:"
	@echo "  make local        - Run locally without MongoDB"
	@echo "  make local-mongo  - Run locally with MongoDB"
	@echo ""
	@echo "Utilities:"
	@echo "  make logs         - Tail CloudWatch logs"
	@echo "  make status       - Check task status"
	@echo "  make all          - Full setup + build + push + register + run"
	@echo "  make clean        - Delete all AWS resources"

# ============================================================
# Setup Commands
# ============================================================

setup: setup-iam setup-ecr setup-logs setup-cluster
	@echo "✅ All AWS resources created"

setup-iam:
	@echo "Creating ecsTaskExecutionRole..."
	@echo '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}' > /tmp/trust-policy.json
	@aws iam create-role \
		--role-name ecsTaskExecutionRole \
		--assume-role-policy-document file:///tmp/trust-policy.json \
		--description "ECS Task Execution Role" 2>/dev/null || echo "Role may already exist"
	@aws iam attach-role-policy \
		--role-name ecsTaskExecutionRole \
		--policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || echo "Policy may already be attached"
	@rm -f /tmp/trust-policy.json
	@echo "✅ IAM role ready"

setup-ecr:
	@echo "Creating ECR repository..."
	@aws ecr create-repository --repository-name $(ECR_REPO) 2>/dev/null || echo "Repository may already exist"
	@echo "✅ ECR repository ready"

setup-logs:
	@echo "Creating CloudWatch Log Group..."
	@aws logs create-log-group --log-group-name $(LOG_GROUP) 2>/dev/null || echo "Log group may already exist"
	@echo "✅ CloudWatch Log Group ready"

setup-cluster:
	@echo "Creating ECS cluster..."
	@aws ecs create-cluster --cluster-name $(CLUSTER) 2>/dev/null || echo "Cluster may already exist"
	@echo "✅ ECS cluster ready"

# ============================================================
# Build & Deploy Commands
# ============================================================

build:
	@echo "Building Docker image..."
	docker build -t $(ECR_REPO):$(IMAGE_TAG) .
	@echo "✅ Image built: $(ECR_REPO):$(IMAGE_TAG)"

push: ecr-login
	@echo "Pushing to ECR..."
	docker tag $(ECR_REPO):$(IMAGE_TAG) $(ECR_URI):$(IMAGE_TAG)
	docker push $(ECR_URI):$(IMAGE_TAG)
	@echo "✅ Image pushed: $(ECR_URI):$(IMAGE_TAG)"

ecr-login:
	@echo "Logging in to ECR..."
	@aws ecr get-login-password --region $(REGION) | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com

register:
	@echo "Registering task definition..."
	aws ecs register-task-definition --cli-input-json file://taskdef.json
	@echo "✅ Task definition registered"

run:
	@echo "Running ECS task..."
	aws ecs run-task \
		--cluster $(CLUSTER) \
		--task-definition $(TASK_FAMILY) \
		--launch-type FARGATE \
		--network-configuration "awsvpcConfiguration={subnets=[$(SUBNET)],securityGroups=[$(SECURITY_GROUP)],assignPublicIp=ENABLED}"
	@echo "✅ Task started! Check logs with: make logs"

# MongoDB URI を環境変数で渡して実行
# 使用例: make run-with-env MONGODB_URI='mongodb+srv://...'
run-with-env:
	@if [ -z "$(MONGODB_URI)" ]; then \
		echo "Usage: make run-with-env MONGODB_URI='mongodb+srv://...'"; \
		exit 1; \
	fi
	@echo "Running ECS task with MongoDB..."
	aws ecs run-task \
		--cluster $(CLUSTER) \
		--task-definition $(TASK_FAMILY) \
		--launch-type FARGATE \
		--network-configuration "awsvpcConfiguration={subnets=[$(SUBNET)],securityGroups=[$(SECURITY_GROUP)],assignPublicIp=ENABLED}" \
		--overrides '{"containerOverrides":[{"name":"hello","environment":[{"name":"MONGODB_URI","value":"$(MONGODB_URI)"}]}]}'
	@echo "✅ Task started with MongoDB! Check logs with: make logs"

# ============================================================
# Local Development
# ============================================================

local:
	@echo "Running locally..."
	docker run --rm $(ECR_REPO):$(IMAGE_TAG)

local-mongo:
	@if [ -z "$(MONGODB_URI)" ]; then \
		echo "Usage: make local-mongo MONGODB_URI='mongodb+srv://...'"; \
		exit 1; \
	fi
	@echo "Running locally with MongoDB..."
	docker run --rm -e MONGODB_URI="$(MONGODB_URI)" $(ECR_REPO):$(IMAGE_TAG)

# ============================================================
# Utility Commands
# ============================================================

logs:
	@echo "Tailing CloudWatch logs (Ctrl+C to stop)..."
	aws logs tail $(LOG_GROUP) --follow

status:
	@echo "Checking task status..."
	@aws ecs list-tasks --cluster $(CLUSTER) --family $(TASK_FAMILY) --query 'taskArns' --output table
	@echo ""
	@echo "Recent tasks:"
	@aws ecs describe-tasks --cluster $(CLUSTER) --tasks $$(aws ecs list-tasks --cluster $(CLUSTER) --query 'taskArns[0]' --output text 2>/dev/null) --query 'tasks[*].[taskArn,lastStatus,stoppedReason]' --output table 2>/dev/null || echo "No running tasks"

all: setup build push register run
	@echo ""
	@echo "🎉 ECS Run Task Hello World deployed!"
	@echo "   Check logs: make logs"

# ============================================================
# Cleanup Commands
# ============================================================

clean:
	@echo "⚠️  This will delete all resources. Press Ctrl+C to cancel..."
	@sleep 3
	@echo "Deleting task definition..."
	@aws ecs deregister-task-definition --task-definition $(TASK_FAMILY):1 2>/dev/null || true
	@echo "Deleting ECR repository..."
	@aws ecr delete-repository --repository-name $(ECR_REPO) --force 2>/dev/null || true
	@echo "Deleting CloudWatch Log Group..."
	@aws logs delete-log-group --log-group-name $(LOG_GROUP) 2>/dev/null || true
	@echo "Deleting ECS cluster..."
	@aws ecs delete-cluster --cluster $(CLUSTER) 2>/dev/null || true
	@echo "✅ Cleanup complete (IAM role preserved)"
