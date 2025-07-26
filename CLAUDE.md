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
make build       # Build the application
make run         # Run the application
make test        # Run tests with test database (uses Docker)
make test-local  # Run tests with Docker test DB
make dev         # Run with hot reload (requires air)
make swagger     # Generate Swagger documentation (requires swag)
make fmt         # Format code
make lint        # Run linter (requires golangci-lint)
make docker      # Run with Docker Compose
make docker-bg   # Run with Docker Compose in background
make docker-down # Stop Docker Compose

# Environment management
make env-init ENV=development  # Initialize environment file
make env-validate             # Validate environment files
make env-backup               # Backup environment files
make env-restore FILE=backup  # Restore from backup
make env-list                 # List available environments

# Test-specific commands
make test-db-up   # Start test database only
make test-db-down # Stop test database
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
- Tests use a separate PostgreSQL instance via Docker Compose
- Environment variables are automatically configured for test runs
- Test database is automatically started/stopped during test execution
- Support for multiple testing approaches (standard Go tests, BDD-style tests, API contract tests)

## Important Notes

1. Always check for existing Makefiles in each project directory - they contain the most up-to-date commands
2. Many projects have hot-reload configured for development
3. Test databases are typically managed via Docker Compose
4. Swagger/OpenAPI documentation is available for most backend APIs
5. Frontend projects often include MSW (Mock Service Worker) for API mocking during development
6. For Go + Chi backend, the test database will automatically start when running `make test`
7. Environment files are managed through scripts in the `script/` directory for consistency