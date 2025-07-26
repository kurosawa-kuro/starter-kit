# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a multi-language starter project collection containing backend and frontend templates for various technology stacks. The project is organized under the `src/` directory with separate folders for each language/framework combination.

## Project Structure

```
src/
├── go/
│   ├── chi/backend/         # Go + Chi REST API
│   └── gin/backend/         # Go + Gin REST API
├── jvm/
│   ├── java/backend/        # Java + Spring Boot
│   └── kotlin/backend/      # Kotlin + Spring Boot
├── nodejs/
│   ├── express/backend/     # JavaScript + Express.js
│   ├── hono/backend/        # TypeScript + Hono
│   ├── nextjs/frontend/     # Next.js (React)
│   ├── nuxt/frontend/       # Nuxt.js (Vue)
│   └── vue/frontend/        # Vue.js + Vite
└── python/
    └── fastapi/             # Python + FastAPI
```

## Common Development Commands

### Go + Chi Backend (src/go/chi/backend/)
```bash
# Build and Run
make build         # Build the application (outputs to bin/hello-world-api)
make build-prod    # Production build (CGO_ENABLED=0, Linux)
make run           # Run the application
make dev           # Run with hot reload (requires air - install with: go install github.com/cosmtrek/air@latest)
make clean         # Clean build artifacts

# Testing (Docker-based test DB on port 15434)
make test          # Run tests (auto-starts test DB if needed)
make test-only     # Run tests without starting/stopping DB (faster)
make test-setup    # Initial test setup (creates test DB)
make test-coverage # Run tests with coverage and display summary
make test-coverage-html # Generate HTML coverage report
make test-db-up    # Manually start test database
make test-db-down  # Manually stop test database
make test-swagger  # Run Swagger-specific tests

# Docker Operations
make docker        # Run with Docker Compose (foreground)
make docker-bg     # Run with Docker Compose (background)
make docker-down   # Stop Docker Compose

# Code Quality
make fmt           # Format code (go fmt)
make swagger       # Generate Swagger docs (requires: go install github.com/swaggo/swag/cmd/swag@latest)
make deps          # Update dependencies (go mod tidy)

# Environment Management
make env-init ENV=development  # Initialize environment file from template
make env-validate             # Validate all environment files
make env-backup               # Backup current environment files
make env-restore FILE=backup  # Restore from backup file
make env-list                 # List available environments

# Test Utilities
make install-gotestsum  # Install gotestsum for better test output
make test-color-setup   # Configure terminal for colored test output
```

### Running a Single Test
```bash
cd src
# Run a specific test file
go test -v ./test/hello_world_test.go

# Run tests matching a pattern
go test -v ./... -run TestHealthCheck

# Run tests in a specific package
go test -v ./handler/...
```

### Go + Gin Backend (src/go/gin/backend/)
```bash
make build       # Build the application
make run         # Run the application
make test        # Run tests with test database
make dev         # Run with hot reload (requires air)
make swagger     # Generate Swagger documentation
make fmt         # Format code
make lint        # Run linter (requires golangci-lint)
make docker      # Run with Docker Compose
```

### Java + Spring Boot (src/jvm/java/backend/)
```bash
make build       # Build the project (mvn compile)
make run         # Run application (mvn spring-boot:run)
make test        # Run tests (mvn test)
make package     # Create JAR (mvn package)
make format      # Format code (mvn spring-javaformat:apply)
```

### Kotlin + Spring Boot (src/jvm/kotlin/backend/)
```bash
make build       # Build project (./gradlew build)
make run         # Run application (./gradlew bootRun)
make test        # Run tests (./gradlew test)
make format      # Format code (./gradlew ktlintFormat)
```

### Node.js + Express Backend (src/nodejs/express/backend/)
```bash
npm install      # Install dependencies
npm run dev      # Run with nodemon (hot reload)
npm test         # Run Jest tests
npm start        # Run production server
```

### TypeScript + Hono Backend (src/nodejs/hono/backend/)
```bash
npm install      # Install dependencies
npm run dev      # Development server
npm run build    # Build TypeScript
npm test         # Run tests
```

### Vue.js Frontend (src/nodejs/vue/frontend/)
```bash
npm install           # Install dependencies
npm run dev           # Development server
npm run dev:mock      # Dev server with MSW mocking
npm run build         # Production build
npm test              # Run Vitest tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Test coverage
```

### Next.js Frontend (src/nodejs/nextjs/frontend/)
```bash
npm install      # Install dependencies
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Python + FastAPI (src/python/fastapi/)
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run application
uvicorn main:app --reload
```

## Architecture Patterns

### Backend Projects
All backend projects follow a clean architecture pattern with:
- **Controllers/Handlers**: HTTP request handling
- **Services**: Business logic layer
- **Models**: Data structures and DTOs
- **Config**: Configuration management
- **Middleware**: Cross-cutting concerns (error handling, logging, etc.)

### Frontend Projects  
Frontend projects use modern component-based architectures:
- **Vue/Nuxt**: Composition API, Pinia for state management
- **Next.js**: App Router, React Server Components
- **Common patterns**: API service layers, composables/hooks, state management

## Testing Approach

- **Go**: Standard `go test` with test database via Docker
- **Java/Kotlin**: JUnit with Spring Boot Test
- **Node.js**: Jest for Express, Vitest for Vue
- **Python**: Standard pytest (when configured)

Most projects include test databases configured via Docker Compose for integration testing.

## Environment Configuration

Backend projects use environment-specific configuration files:
- `.env` or `.env.local` for local development
- `config/env.*` files for different environments
- Docker Compose files include necessary services (databases, etc.)

## Go + Chi Backend Architecture (src/go/chi/backend/)

The Chi backend follows a clean architecture pattern with clear separation of concerns:

### Directory Structure
```
src/
├── config/           # Configuration management
│   ├── config.go     # App configuration loader
│   └── database.go   # Database configuration and connection
├── handler/          # HTTP handlers (Controller layer)
│   ├── health.go     # Health check endpoints
│   └── hello_world.go # Hello World API handlers
├── middleware/       # HTTP middleware
│   └── error_handler.go # Global error handling and CORS
├── models/           # Data models and DTOs
│   ├── response.go   # Standard API response structures
│   └── hello_world.go # Hello World domain models
├── router/           # HTTP routing
│   └── router.go     # Chi router setup with middleware chain
├── services/         # Business logic layer
│   └── hello_world_service.go # Hello World business logic
├── test/             # Test files
│   ├── hello_world_test.go    # API integration tests
│   ├── testify_sample_test.go # Testify usage examples
│   ├── httpexpect_sample_test.go # HTTPExpect examples
│   └── apitest_sample_test.go # APITest examples
├── utils/            # Utility functions
│   ├── constants.go  # Application constants
│   └── mock.go       # Mock helpers for testing
├── db/migrations/    # Database migrations
└── docs/             # Generated Swagger documentation
```

### Key Architectural Patterns

1. **Router Setup**: Uses Chi router with comprehensive middleware chain including request logging, recovery, request ID, rate limiting (100 req/s), and 60s timeout
2. **Error Handling**: Centralized error handling middleware that wraps all responses in standard format
3. **Database**: Optional PostgreSQL support with graceful fallback when DB is unavailable
4. **Testing**: Comprehensive test setup with Docker-based test database and multiple testing libraries (testify, httpexpect, apitest)
5. **Environment Management**: Sophisticated environment configuration system with backup/restore capabilities

### API Response Format
All API responses follow a consistent structure:
```json
{
  "status": "success|error",
  "message": "Operation message",
  "timestamp": "2025-07-26T01:55:51.425125974+09:00",
  "data": { ... }  // Only for success responses
}
```

### Testing Strategy
- Tests use a separate PostgreSQL instance via Docker Compose on port 15434
- Environment variables are automatically configured from config/env.test
- Test database remains running between test executions for speed
- Supports multiple testing libraries:
  - **testify**: Standard assertions and mocking
  - **httpexpect**: Fluent API for HTTP testing
  - **apitest**: BDD-style API testing
- Coverage reports available in text, HTML, and terminal formats

### Development Workflow

1. **Initial Setup**:
   ```bash
   make env-init ENV=development
   make deps
   make test-setup  # One-time test DB setup
   ```

2. **Development Cycle**:
   ```bash
   make dev         # Hot reload development
   make test-only   # Fast test execution
   make fmt         # Format code before commit
   ```

3. **Before Committing**:
   ```bash
   make fmt
   make test-coverage
   make swagger     # If API changes were made
   ```

### Port Configuration
- **Application**: 8080 (configurable via PORT env var)
- **PostgreSQL (Dev)**: 15432 (avoids WSL conflicts)
- **PostgreSQL (Test)**: 15434 (separate test instance)
- **pgAdmin**: 5050

### Required Tools Installation
```bash
# Hot reload
go install github.com/cosmtrek/air@latest

# Swagger generation
go install github.com/swaggo/swag/cmd/swag@latest

# Better test output
go install gotest.tools/gotestsum@latest

# Linter (optional)
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

## Important Notes

1. Always check for existing Makefiles in each project directory - they contain the most up-to-date commands
2. Many projects have hot-reload configured for development
3. Test databases are typically managed via Docker Compose
4. Swagger/OpenAPI documentation is available for most backend APIs
5. Frontend projects often include MSW (Mock Service Worker) for API mocking during development
6. For Go + Chi backend, the test database will automatically start when running `make test`
7. Environment files are managed through scripts in the `script/` directory for consistency