# JavaScript + Express Hello World API Makefile

.PHONY: help clean install test test-watch test-coverage test-unit test-docker dev docker-build docker-run docker-compose-up docker-compose-down docker-compose-logs docker-compose-clean docker-compose-dev docker-compose-prod docker-compose-test env-init env-validate env-backup env-restore env-list env-gen-local env-gen-local-test info quick-start quick-test dev-setup prod-prep docker-quick-start

# Default target
help:
	@echo "JavaScript + Express Hello World API - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  install    - Install dependencies"
	@echo "  dev        - Start development server"
	@echo "  test       - Run database integration tests"
	@echo "  test-watch - Run tests in watch mode"
	@echo "  test-coverage - Run tests with coverage"
	@echo "  test-unit  - Run unit tests only"
	@echo "  test-docker - Run tests with Docker Compose"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build       - Build Docker image"
	@echo "  docker-run         - Run Docker container"
	@echo ""
	@echo "Docker Compose:"
	@echo "  docker-compose-up    - Start all services (PostgreSQL + App)"
	@echo "  docker-compose-down  - Stop all services"
	@echo "  docker-compose-logs  - Show logs from all services"
	@echo "  docker-compose-clean - Remove all containers and volumes"
	@echo "  docker-compose-dev   - Start development environment"
	@echo "  docker-compose-prod  - Start production environment"
	@echo "  docker-compose-test  - Start test environment"
	@echo ""
	@echo "Environment Management:"
	@echo "  env-init [ENV]     - Initialize environment file"
	@echo "  env-validate       - Validate environment file"
	@echo "  env-backup         - Backup current .env file"
	@echo "  env-restore [FILE] - Restore from backup"
	@echo "  env-list           - List available environments"
	@echo ""
	@echo "Utilities:"
	@echo "  clean      - Clean node_modules and logs"
	@echo "  info       - Show project information"
	@echo ""
	@echo "Environment Types:"
	@echo "  development - Docker development environment"
	@echo "  test        - Test environment"
	@echo "  local       - Local PostgreSQL environment"
	@echo "  production  - Production environment"
	@echo ""
	@echo "Examples:"
	@echo "  make env-init ENV=development"
	@echo "  make env-init ENV=test"
	@echo "  make test"
	@echo "  make dev"
	@echo "  make docker-compose-up"

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Start development server
dev:
	@echo "Starting development server..."
	npm run dev

# Run database integration tests
test:
	@echo "Running database integration tests..."
	@echo "Setting up test environment..."
	@chmod +x script/gen-local-test-env.sh
	@./script/gen-local-test-env.sh
	@echo "Cleaning up existing test containers..."
	@docker stop postgres-test-integration || true
	@docker rm postgres-test-integration || true
	@echo "Starting test database..."
	@docker run --name postgres-test-integration \
		-e POSTGRES_USER=sampleuser \
		-e POSTGRES_PASSWORD=samplepass \
		-e POSTGRES_DB=sampledb_test \
		-p 15433:5432 \
		-d postgres:15-alpine
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Running integration tests..."
	@NODE_ENV=test DB_HOST=localhost DB_PORT=15433 DB_USER=sampleuser DB_PASSWORD=samplepass DB_NAME=sampledb_test npm test
	@echo "Cleaning up test database..."
	@docker stop postgres-test-integration || true
	@docker rm postgres-test-integration || true
	@echo "✅ Database integration tests completed"

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage

# Run unit tests only
test-unit:
	@echo "Running unit tests only..."
	npm run test:unit

# Run tests with Docker Compose
test-docker:
	@echo "Running tests with Docker Compose..."
	@echo "Starting test environment..."
	@docker compose -f docker-compose.test.yml up -d postgres-test
	@echo "Waiting for test database to be ready..."
	@sleep 10
	@echo "Running integration tests..."
	@docker compose -f docker-compose.test.yml run --rm test-runner
	@echo "Stopping test environment..."
	@docker compose -f docker-compose.test.yml down
	@echo "✅ Docker Compose tests completed"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf node_modules
	rm -rf coverage
	rm -rf .nyc_output
	rm -f *.log
	rm -f .env.backup.*

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t express-hello-world-api .

# Run Docker container
docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 express-hello-world-api

# Docker Compose commands
docker-compose-up:
	@echo "Starting all services with Docker Compose..."
	docker compose up -d
	@echo "Services started!"
	@echo "API: http://localhost:8080"
	@echo "API Docs: http://localhost:8080/api-docs"
	@echo "Health Check: http://localhost:8080/api/health"
	@echo "PostgreSQL: localhost:5432"

docker-compose-down:
	@echo "Stopping all services..."
	docker compose down

docker-compose-logs:
	@echo "Showing logs from all services..."
	docker compose logs -f

docker-compose-clean:
	@echo "Removing all containers and volumes..."
	docker compose down -v
	docker compose rm -f

docker-compose-dev:
	@echo "Starting development environment..."
	docker compose up -d postgres app-dev
	@echo "Development services started!"
	@echo "API: http://localhost:8081"
	@echo "API Docs: http://localhost:8081/api-docs"
	@echo "PostgreSQL: localhost:5432"

docker-compose-prod:
	@echo "Starting production environment..."
	docker compose up -d postgres app
	@echo "Production services started!"
	@echo "API: http://localhost:8080"
	@echo "API Docs: http://localhost:8080/api-docs"
	@echo "PostgreSQL: localhost:5432"

docker-compose-test:
	@echo "Starting test environment..."
	docker compose -f docker-compose.test.yml up -d postgres-test
	@echo "Test database started!"
	@echo "PostgreSQL: localhost:15433"
	@echo "Run tests with: make test"

# Environment Management
env-init:
	@if [ -z "$(ENV)" ]; then \
		echo "Error: ENV variable is required"; \
		echo "Usage: make env-init ENV=development"; \
		echo "Available environments: development, test, local, production"; \
		exit 1; \
	fi
	@echo "Initializing environment: $(ENV)"
	@chmod +x script/env-manager.sh
	@./script/env-manager.sh init $(ENV)

env-validate:
	@echo "Validating environment file..."
	@chmod +x script/env-manager.sh
	@./script/env-manager.sh validate

env-backup:
	@echo "Backing up environment file..."
	@chmod +x script/env-manager.sh
	@./script/env-manager.sh backup

env-restore:
	@if [ -z "$(FILE)" ]; then \
		echo "Error: FILE variable is required"; \
		echo "Usage: make env-restore FILE=.env.backup.20240101_120000"; \
		exit 1; \
	fi
	@echo "Restoring environment file from: $(FILE)"
	@chmod +x script/env-manager.sh
	@./script/env-manager.sh restore $(FILE)

env-list:
	@echo "Listing available environments..."
	@chmod +x script/env-manager.sh
	@./script/env-manager.sh list

# Legacy environment scripts (for backward compatibility)
env-gen-local:
	@echo "Generating local development environment..."
	@chmod +x script/gen-local-env.sh
	@./script/gen-local-env.sh

env-gen-local-test:
	@echo "Generating local test environment..."
	@chmod +x script/gen-local-test-env.sh
	@./script/gen-local-test-env.sh

# Show project info
info:
	@echo "Project: JavaScript + Express Hello World API"
	@echo "Version: 1.0.0"
	@echo "Node.js Version: 18+"
	@echo "Express Version: 4.18.2"
	@echo "PostgreSQL Version: 15"
	@echo "Port: 8080 (Production), 8081 (Development), 8082 (Test)"
	@echo "Health Check: http://localhost:8080/api/health"
	@echo "API Documentation: http://localhost:8080/api-docs"
	@echo "API Base URL: http://localhost:8080/api/hello-world"
	@echo ""
	@echo "Docker Compose Services:"
	@echo "  - PostgreSQL (port 5432)"
	@echo "  - API (port 8080/8081)"
	@echo "  - Test PostgreSQL (port 15433)"
	@echo ""
	@echo "Test Commands:"
	@echo "  make test              # Database integration tests"
	@echo "  make test-unit         # Unit tests only"
	@echo "  make test-docker       # Docker Compose tests"
	@echo ""
	@echo "Environment Management:"
	@echo "  make env-init ENV=development"
	@echo "  make env-validate"
	@echo "  make env-list"
	@echo ""
	@echo "Docker Compose:"
	@echo "  make docker-compose-up"
	@echo "  make docker-compose-dev"
	@echo "  make docker-compose-prod"
	@echo "  make docker-compose-test"

# Quick start commands
quick-start: install env-init
	@echo "Quick start completed!"
	@echo "Next steps:"
	@echo "  1. make dev"
	@echo "  2. Visit http://localhost:8080/api-docs"

quick-test: install env-init test
	@echo "Quick test completed!"

# Development workflow
dev-setup: install env-init
	@echo "Development setup completed!"
	@echo "Run 'make dev' to start the development server"

# Production preparation
prod-prep: install env-init
	@echo "Production preparation completed!"
	@echo "Remember to update production environment variables"

# Docker Compose quick start
docker-quick-start: docker-compose-up
	@echo "Docker Compose quick start completed!"
	@echo "Services are running:"
	@echo "  - API: http://localhost:8080"
	@echo "  - API Docs: http://localhost:8080/api-docs"
	@echo "  - PostgreSQL: localhost:5432" 