import { DIContainer } from "../infrastructure/di/DIContainer.js";
import { IWeatherRepository, ICacheRepository } from "../domain/repositories/IRepositories.js";
import { ILogger } from "../infrastructure/logger/Logger.js";

export class HealthCheck {
  private weatherRepository: IWeatherRepository;
  private cacheRepository: ICacheRepository;
  private logger: ILogger;

  constructor() {
    const container = DIContainer.getInstance();
    this.weatherRepository = container.get<IWeatherRepository>('IWeatherRepository');
    this.cacheRepository = container.get<ICacheRepository>('ICacheRepository');
    this.logger = container.get<ILogger>('ILogger');
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
      const dbHealthy = await this.weatherRepository.healthCheck();
      health.services.database = dbHealthy;
      if (!dbHealthy) {
        health.status = 'unhealthy';
      }
    } catch (error) {
      this.logger.error('Database health check failed', error);
      health.status = 'unhealthy';
    }

    // Check cache (Redis) connection
    try {
      const cacheHealthy = await this.cacheRepository.healthCheck();
      health.services.cache = cacheHealthy;
      
      if (cacheHealthy) {
        // Get cache statistics
        const cacheKeys = await this.cacheRepository.getKeys('weather:*');
        health.metrics.cacheKeys = cacheKeys.length;
      }
    } catch (error) {
      this.logger.error('Cache health check failed', error);
      health.services.cache = false;
      // Cache failure doesn't make the whole system unhealthy
    }

    // Check external API
    try {
      health.services.api = true;
    } catch (error) {
      this.logger.error('External API health check failed', error);
      health.status = 'unhealthy';
    }

    return health;
  }
}