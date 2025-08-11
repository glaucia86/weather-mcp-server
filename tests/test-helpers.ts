import { DIContainer } from '../src/infrastructure/di/DIContainer.js';
import { ICacheRepository, IWeatherRepository } from '../src/domain/repositories/IRepositories.js';

// Mock Cache Repository for testing
export class MockCacheRepository implements ICacheRepository {
  private cache = new Map<string, any>();
  private hits = 0;
  private misses = 0;

  async get<T = any>(key: string): Promise<T | null> {
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key);
    }
    this.misses++;
    return null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    this.cache.set(key, value);
    return true;
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async getTTL(key: string): Promise<number> {
    return -1; // No TTL in mock
  }

  async getKeys(pattern?: string): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  async clearAll(): Promise<boolean> {
    this.cache.clear();
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getStats(): Promise<any> {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0
    };
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`;
  }
}

// Test helper to get configured DIContainer
export async function getTestContainer(): Promise<DIContainer> {
  const container = DIContainer.getInstance();
  container.register();

  // Replace cache repository with mock if Redis is not available
  if (!process.env.REDIS_URL || process.env.CI) {
    const mockCache = new MockCacheRepository();
    (container as any).services.set('ICacheRepository', mockCache);
  }

  try {
    await container.initialize();
  } catch (error) {
    console.warn('Some services failed to initialize (expected in CI):', error);
  }

  return container;
}

// Clean shutdown helper
export async function cleanupTestContainer(container: DIContainer): Promise<void> {
  try {
    await container.shutdown();
  } catch (error) {
    console.warn('Warning during test cleanup:', error);
  }
}
