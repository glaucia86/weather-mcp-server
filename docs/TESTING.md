# Testing Guide

## Types of Tests

### Unit Tests
- **File**: `tests/unit.test.ts`
- **Purpose**: Test individual functions and classes in isolation
- **Dependencies**: Uses mocks, no external services required
- **Command**: `npm run test:unit`

### Integration Tests
- **File**: `tests/integration.test.ts`
- **Purpose**: Test the full application with real databases
- **Dependencies**: Requires PostgreSQL and Redis to be running
- **Command**: `npm run test:integration`

### CI Tests
- **Purpose**: Tests that run in the CI/CD pipeline
- **Dependencies**: Uses services provided by GitHub Actions
- **Command**: `npm run test:ci`

## Running Tests Locally

### Prerequisites for Integration Tests
```bash
# Start services with Docker
docker-compose up -d postgres redis

# Or start services individually
# PostgreSQL on localhost:5432
# Redis on localhost:6379
```

### Environment Variables
Copy `.env.example` to `.env` and set:
```bash
DATABASE_URL=postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp_test
REDIS_URL=redis://localhost:6379
WEATHER_API_KEY=your_api_key_here
NODE_ENV=test
```

### Commands
```bash
# Run all tests
npm test

# Run only unit tests (no external dependencies)
npm run test:unit

# Run only integration tests (requires services)
npm run test:integration

# Run tests with coverage
npm run test:ci

# Watch mode for development
npm run test:watch
```

## CI/CD Pipeline

The CI pipeline runs only unit tests to avoid dependency issues. Integration tests can be run separately when services are available.

### Pipeline Stages:
1. **Lint & Type Check**: Code quality checks
2. **Test**: Unit tests with mocks
3. **Build**: TypeScript compilation
4. **Security**: Vulnerability scanning
5. **Docker**: Container build and push
6. **Deploy**: Deployment to staging/production
