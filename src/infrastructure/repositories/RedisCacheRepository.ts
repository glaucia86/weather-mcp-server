import { createClient, RedisClientType } from 'redis';
import { ICacheRepository } from '../../domain/repositories/IRepositories.js';
import { ILogger } from '../logger/Logger.js';

export class RedisCacheRepository implements ICacheRepository {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor(private logger: ILogger) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            this.logger.error('Redis connection failed after 10 retries');
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
        this.logger.info('Connected to Redis successfully');
      }
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      // Don't throw error - allow app to continue without cache
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
        this.logger.info('Disconnected from Redis');
      }
    } catch (error) {
      this.logger.error('Error disconnecting from Redis:', error);
      this.isConnected = false;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 600): Promise<boolean> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis not connected, skipping cache set');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttlSeconds, serializedValue);
      
      this.logger.info(`Cache set: ${key} (TTL: ${ttlSeconds}s)`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${key}:`, error);
      return false;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis not connected, cache miss');
        return null;
      }

      const value = await this.client.get(key);
      
      if (value) {
        this.logger.info(`Cache hit: ${key}`);
        return JSON.parse(value) as T;
      }
      
      this.logger.info(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.del(key);
      this.logger.info(`Cache deleted: ${key}`);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence for key ${key}:`, error);
      return false;
    }
  }

  async getTTL(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return -1;
      }

      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}:`, error);
      return -1;
    }
  }

  async getKeys(pattern: string = '*'): Promise<string[]> {
    try {
      if (!this.isConnected) {
        return [];
      }

      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Failed to get keys with pattern ${pattern}:`, error);
      return [];
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.flushAll();
      this.logger.info('All cache cleared');
      return true;
    } catch (error) {
      this.logger.error('Failed to clear all cache:', error);
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return false;
    }
  }

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
      this.logger.error('Failed to get Redis stats:', error);
      return null;
    }
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`.toLowerCase();
  }
}
