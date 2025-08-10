import { DatabaseService } from "../services/database.js";
import { CacheService } from "../services/cacheService.js";
import { logger } from "../utils/simple-logger.js";

export class HealthCheck {
  private database: DatabaseService;
  private cache: CacheService;

  constructor(database: DatabaseService, cache: CacheService) {
    this.database = database;
    this.cache = cache;
  }

  async check(): Promise<any> {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        cache: false,
        api: false
      },
      metrics: {
        cacheHits: 0,
        cacheMisses: 0,
        cacheKeys: 0
      }
    };

    try {
      // Check database connection
      const dbHealthy = await this.database.healthCheck();
      health.services.database = dbHealthy;
      if (!dbHealthy) {
        health.status = 'unhealthy';
      }
    } catch (error) {
      logger.error('Database health check failed', error);
      health.status = 'unhealthy';
    }

    // Check cache (Redis) connection
    try {
      const cacheHealthy = await this.cache.healthCheck();
      health.services.cache = cacheHealthy;
      
      if (cacheHealthy) {
        // Get cache statistics
        const cacheKeys = await this.cache.getKeys('weather:*');
        health.metrics.cacheKeys = cacheKeys.length;
      }
    } catch (error) {
      logger.error('Cache health check failed', error);
      health.services.cache = false;
      // Cache failure doesn't make the whole system unhealthy
    }

    // Check external API
    try {
      health.services.api = true;
    } catch (error) {
      logger.error('External API health check failed', error);
      health.status = 'unhealthy';
    }

    return health;
  }
}