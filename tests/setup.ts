// Jest setup for CI/CD environments
import { DIContainer } from '../src/infrastructure/di/DIContainer.js';

// Mock external dependencies in test environment
if (process.env.NODE_ENV === 'test') {
  // Mock Redis if not available
  if (!process.env.REDIS_URL || process.env.CI) {
    console.log('Mocking Redis for test environment');
    jest.mock('../src/infrastructure/repositories/RedisCacheRepository.js', () => ({
      RedisCacheRepository: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
        getStatistics: jest.fn().mockResolvedValue({
          hits: 0,
          misses: 0,
          hitRate: 0
        })
      }))
    }));
  }
}

// Global test setup
beforeAll(async () => {
  // Ensure clean state before tests
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup after tests - no cleanup needed for unit tests with mocks
  console.log('Test cleanup completed');
});
