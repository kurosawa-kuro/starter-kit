# Spring Boot Hello World API Makefile (Kotlin)

.PHONY: help clean build test run package docker-build docker-run

# Default target
help:
	@echo "Spring Boot Hello World API (Kotlin) - Available commands:"
	@echo "  clean      - Clean build artifacts"
	@echo "  build      - Build the project"
	@echo "  test       - Run tests"
	@echo "  run        - Run the application"
	@echo "  package    - Create JAR package"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"
	@echo "  install    - Install dependencies"
	@echo "  format     - Format code"
	@echo "  check      - Run all checks (build, test, format)"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	./gradlew clean

# Build the project
build: clean
	@echo "Building the project..."
	./gradlew build

# Install dependencies
install:
	@echo "Installing dependencies..."
	./gradlew dependencies

# Run tests
test:
	@echo "Running tests..."
	./gradlew test

# Run the application
run:
	@echo "Starting Spring Boot application..."
	./gradlew bootRun

# Create JAR package
package: clean
	@echo "Creating JAR package..."
	./gradlew bootJar

# Format code
format:
	@echo "Formatting code..."
	./gradlew ktlintFormat

# Run all checks
check: clean build test format
	@echo "All checks completed successfully!"

# Docker commands (if Dockerfile exists)
docker-build:
	@echo "Building Docker image..."
	docker build -t helloworld-api-kotlin .

docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 helloworld-api-kotlin

# Development helpers
dev-run:
	@echo "Starting development server..."
	./gradlew bootRun --args='--spring.profiles.active=dev'

# Show project info
info:
	@echo "Project: Spring Boot Hello World API (Kotlin)"
	@echo "Version: 1.0.0"
	@echo "Kotlin Version: 1.9.20"
	@echo "Java Version: 17"
	@echo "Spring Boot Version: 3.2.0"
	@echo "Port: 8080"
	@echo "Health Check: http://localhost:8080/actuator/health"
	@echo "API Base URL: http://localhost:8080/api/v1/hello" 