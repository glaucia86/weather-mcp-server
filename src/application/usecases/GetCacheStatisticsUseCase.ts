import { ICacheRepository } from '../../domain/repositories/IRepositories.js';
import { ILogger } from '../../infrastructure/logger/Logger.js';

export interface GetCacheStatisticsResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class GetCacheStatisticsUseCase {
  constructor(
    private cacheRepo: ICacheRepository,
    private logger: ILogger
  ) {}

  async execute(): Promise<GetCacheStatisticsResponse> {
    try {
      this.logger.info('Getting cache statistics');
      
      const weatherKeys = await this.cacheRepo.getKeys('weather:*');
      const forecastKeys = await this.cacheRepo.getKeys('forecast:*');
      const redisStats = await this.cacheRepo.getStats();
      
      const stats = {
        weatherCacheCount: weatherKeys.length,
        forecastCacheCount: forecastKeys.length,
        totalCacheEntries: weatherKeys.length + forecastKeys.length,
        redisStats
      };

      this.logger.info('Cache statistics retrieved successfully', stats);
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      this.logger.error('Error getting cache statistics', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
}
