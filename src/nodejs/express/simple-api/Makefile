# Makefile for Node.js Express Simple API
# Japanese comments are included for Japanese documentation

.PHONY: help install start dev test test-watch test-coverage test-verbose test-debug build clean lint format docker docker-bg docker-down env-check deps update-deps security-audit kill-port

# Default target
help:
	@echo "Available commands for Express Simple API:"
	@echo ""
	@echo "Setup and Dependencies:"
	@echo "  install         Install npm dependencies"
	@echo "  deps           Install and update dependencies"
	@echo "  update-deps    Update all dependencies to latest versions"
	@echo "  security-audit Run npm security audit"
	@echo ""
	@echo "Development:"
	@echo "  start          Start production server"
	@echo "  dev            Start development server with hot reload"
	@echo "  env-check      Validate environment configuration"
	@echo ""
	@echo "Testing:"
	@echo "  test           Run all tests"
	@echo "  test-watch     Run tests in watch mode"
	@echo "  test-coverage  Run tests with coverage report"
	@echo "  test-verbose   Run tests with verbose output"
	@echo "  test-debug     Run tests in debug mode"
	@echo ""
	@echo "Build and Maintenance:"
	@echo "  build          Build the project (no-op for Node.js)"
	@echo "  clean          Clean temporary files and coverage"
	@echo "  lint           Run linter (placeholder)"
	@echo "  format         Format code (placeholder)"
	@echo ""
	@echo "Docker:"
	@echo "  docker         Run with Docker Compose (foreground)"
	@echo "  docker-bg      Run with Docker Compose (background)"
	@echo "  docker-down    Stop Docker Compose"
	@echo ""
	@echo "Utilities:"
	@echo "  kill-port      Kill processes on backend port (3000)"
	@echo ""

# Setup and Dependencies
install:
	@echo "Installing npm dependencies..."
	npm install

deps: install
	@echo "Dependencies installed successfully"

update-deps:
	@echo "Updating dependencies to latest versions..."
	npm update
	npm audit fix --force

security-audit:
	@echo "Running security audit..."
	npm audit
	npm audit fix

# Development
start:
	@echo "Starting production server..."
	npm start

dev:
	@echo "Starting development server with hot reload..."
	npm run dev

env-check:
	@echo "Checking environment configuration..."
	@if [ ! -f .env ]; then echo "Warning: .env file not found"; fi
	@echo "Environment check completed"

# Testing
test:
	@echo "Running all tests..."
	npm test

test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage
	@echo "Coverage report generated in coverage/ directory"

test-verbose:
	@echo "Running tests with verbose output..."
	npm run test:verbose

test-debug:
	@echo "Running tests in debug mode..."
	npm run test:debug

# Build and Maintenance
build:
	@echo "Building project..."
	npm run build

clean:
	@echo "Cleaning temporary files and coverage..."
	rm -rf coverage/
	rm -rf data/temp/
	rm -rf node_modules/.cache/
	@echo "Cleanup completed"

lint:
	@echo "Running linter..."
	npm run lint

format:
	@echo "Formatting code..."
	@echo "Code formatting not configured - consider adding prettier"

# Docker Operations (if docker-compose.yml exists)
docker:
	@if [ -f docker-compose.yml ]; then \
		echo "Starting with Docker Compose..."; \
		docker-compose up; \
	else \
		echo "docker-compose.yml not found"; \
	fi

docker-bg:
	@if [ -f docker-compose.yml ]; then \
		echo "Starting with Docker Compose in background..."; \
		docker-compose up -d; \
	else \
		echo "docker-compose.yml not found"; \
	fi

docker-down:
	@if [ -f docker-compose.yml ]; then \
		echo "Stopping Docker Compose..."; \
		docker-compose down; \
	else \
		echo "docker-compose.yml not found"; \
	fi

# Utilities
kill-port:
	@echo "Killing processes on port 3000..."
	@if [ -f script/kill-backend-port.sh ]; then \
		chmod +x script/kill-backend-port.sh; \
		./script/kill-backend-port.sh; \
	else \
		lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No processes found on port 3000"; \
	fi

# Development workflow shortcuts
quick-test: test-coverage
	@echo "Quick test with coverage completed"

full-check: deps test-coverage lint
	@echo "Full project check completed"

reset: clean install
	@echo "Project reset completed"