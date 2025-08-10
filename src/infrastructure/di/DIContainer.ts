// Dependency Injection Container following SOLID principles
import { Logger, ILogger } from '../logger/Logger.js';
import { PostgreSQLWeatherRepository } from '../repositories/PostgreSQLWeatherRepository.js';
import { RedisCacheRepository } from '../repositories/RedisCacheRepository.js';
import { OpenWeatherMapApiRepository } from '../repositories/OpenWeatherMapApiRepository.js';
import { IWeatherRepository, ICacheRepository, IWeatherApiRepository } from '../../domain/repositories/IRepositories.js';

import { GetCurrentWeatherUseCase } from '../../application/usecases/GetCurrentWeatherUseCase.js';
import { GetWeatherForecastUseCase } from '../../application/usecases/GetWeatherForecastUseCase.js';
import { GetWeatherHistoryUseCase } from '../../application/usecases/GetWeatherHistoryUseCase.js';
import { GetCacheStatisticsUseCase } from '../../application/usecases/GetCacheStatisticsUseCase.js';

import { WeatherController } from '../../presentation/controllers/WeatherController.js';
import { HistoryController } from '../../presentation/controllers/HistoryController.js';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Register services following Dependency Inversion Principle
  register(): void {
    // Infrastructure Layer
    const logger: ILogger = new Logger();
    this.services.set('ILogger', logger);

    const weatherRepository: IWeatherRepository = new PostgreSQLWeatherRepository(logger);
    this.services.set('IWeatherRepository', weatherRepository);

    const cacheRepository: ICacheRepository = new RedisCacheRepository(logger);
    this.services.set('ICacheRepository', cacheRepository);

    const weatherApiRepository: IWeatherApiRepository = new OpenWeatherMapApiRepository(
      cacheRepository, 
      logger
    );
    this.services.set('IWeatherApiRepository', weatherApiRepository);

    // Application Layer (Use Cases)
    const getCurrentWeatherUseCase = new GetCurrentWeatherUseCase(
      weatherApiRepository,
      weatherRepository,
      cacheRepository,
      logger
    );
    this.services.set('GetCurrentWeatherUseCase', getCurrentWeatherUseCase);

    const getWeatherForecastUseCase = new GetWeatherForecastUseCase(
      weatherApiRepository,
      cacheRepository,
      logger
    );
    this.services.set('GetWeatherForecastUseCase', getWeatherForecastUseCase);

    const getWeatherHistoryUseCase = new GetWeatherHistoryUseCase(
      weatherRepository,
      logger
    );
    this.services.set('GetWeatherHistoryUseCase', getWeatherHistoryUseCase);

    const getCacheStatisticsUseCase = new GetCacheStatisticsUseCase(
      cacheRepository,
      logger
    );
    this.services.set('GetCacheStatisticsUseCase', getCacheStatisticsUseCase);

    // Presentation Layer (Controllers)
    const weatherController = new WeatherController(
      getCurrentWeatherUseCase,
      getWeatherForecastUseCase,
      getCacheStatisticsUseCase
    );
    this.services.set('WeatherController', weatherController);

    const historyController = new HistoryController(getWeatherHistoryUseCase);
    this.services.set('HistoryController', historyController);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  // Initialize all infrastructure services (repositories)
  async initialize(): Promise<void> {
    const cacheRepository = this.get<ICacheRepository>('ICacheRepository');
    const weatherRepository = this.get<IWeatherRepository>('IWeatherRepository');

    // Initialize cache connection
    if ('connect' in cacheRepository) {
      await (cacheRepository as any).connect();
    }

    // Initialize database connection
    if ('connect' in weatherRepository) {
      await (weatherRepository as any).connect();
    }
  }

  // Clean shutdown
  async shutdown(): Promise<void> {
    const cacheRepository = this.get<ICacheRepository>('ICacheRepository');
    const weatherRepository = this.get<IWeatherRepository>('IWeatherRepository');

    // Disconnect cache
    if ('disconnect' in cacheRepository) {
      await (cacheRepository as any).disconnect();
    }

    // Close database connection
    if ('close' in weatherRepository) {
      await (weatherRepository as any).close();
    }
  }
}
