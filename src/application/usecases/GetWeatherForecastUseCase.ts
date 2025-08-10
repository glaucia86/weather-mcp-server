import { ForecastData } from '../../domain/entities/Weather.js';
import { IWeatherApiRepository, ICacheRepository } from '../../domain/repositories/IRepositories.js';
import { ILogger } from '../../infrastructure/logger/Logger.js';

export interface GetWeatherForecastRequest {
  city: string;
  days?: number;
}

export interface GetWeatherForecastResponse {
  success: boolean;
  data?: ForecastData;
  cached?: boolean;
  error?: string;
}

export class GetWeatherForecastUseCase {
  constructor(
    private weatherApiRepo: IWeatherApiRepository,
    private cacheRepo: ICacheRepository,
    private logger: ILogger
  ) {}

  async execute(request: GetWeatherForecastRequest): Promise<GetWeatherForecastResponse> {
    try {
      const { city, days = 3 } = request;
      
      this.logger.info(`Getting weather forecast for ${city} (${days} days)`);
      
      const forecast = await this.weatherApiRepo.getWeatherForecast(city, days);
      
      // Check if data was from cache
      const cacheKey = this.cacheRepo.generateKey('forecast', city, days.toString());
      const cached = await this.cacheRepo.exists(cacheKey);

      this.logger.info(`Weather forecast retrieved successfully for ${city}`, { cached, days });
      
      return {
        success: true,
        data: forecast,
        cached
      };
    } catch (error) {
      this.logger.error(`Error getting weather forecast for ${request.city}`, error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
}
