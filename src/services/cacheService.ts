import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/simple-logger.js';

export class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.client.connect();
        this.isConnected = true;
        logger.info('Connected to Redis successfully');
      }
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      // Don't throw error - allow app to continue without cache
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
        logger.info('Disconnected from Redis');
      }
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      this.isConnected = false;
    }
  }

  /**
   * Set cache with TTL (Time To Live)
   */
  async set(key: string, value: any, ttlSeconds: number = 600): Promise<boolean> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache set');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttlSeconds, serializedValue);
      
      logger.info(`Cache set: ${key} (TTL: ${ttlSeconds}s)`);
      return true;
    } catch (error) {
      logger.error(`Failed to set cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get cached value
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, cache miss');
        return null;
      }

      const value = await this.client.get(key);
      
      if (value) {
        logger.info(`Cache hit: ${key}`);
        return JSON.parse(value) as T;
      }
      
      logger.info(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete cache key
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.del(key);
      logger.info(`Cache deleted: ${key}`);
      return result > 0;
    } catch (error) {
      logger.error(`Failed to delete cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Failed to check existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL (Time To Live) for a key
   */
  async getTTL(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return -1;
      }

      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Failed to get TTL for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Get all keys matching pattern
   */
  async getKeys(pattern: string = '*'): Promise<string[]> {
    try {
      if (!this.isConnected) {
        return [];
      }

      return await this.client.keys(pattern);
    } catch (error) {
      logger.error(`Failed to get keys with pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Clear all cache (use with caution!)
   */
  async clearAll(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.flushAll();
      logger.info('All cache cleared');
      return true;
    } catch (error) {
      logger.error('Failed to clear all cache:', error);
      return false;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      if (!this.isConnected) {
        return null;
      }

      const info = await this.client.info('stats');
      const memory = await this.client.info('memory');
      
      return {
        connected: this.isConnected,
        stats: info,
        memory: memory
      };
    } catch (error) {
      logger.error('Failed to get Redis stats:', error);
      return null;
    }
  }

  /**
   * Generate cache key
   */
  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`.toLowerCase();
  }
}
