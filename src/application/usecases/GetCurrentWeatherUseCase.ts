import { WeatherData } from '../../domain/entities/Weather.js';
import { IWeatherApiRepository, IWeatherRepository, ICacheRepository } from '../../domain/repositories/IRepositories.js';
import { ILogger } from '../../infrastructure/logger/Logger.js';

export interface GetCurrentWeatherRequest {
  city: string;
}

export interface GetCurrentWeatherResponse {
  success: boolean;
  data?: WeatherData;
  cached?: boolean;
  error?: string;
}

export class GetCurrentWeatherUseCase {
  constructor(
    private weatherApiRepo: IWeatherApiRepository,
    private weatherRepo: IWeatherRepository,
    private cacheRepo: ICacheRepository,
    private logger: ILogger
  ) {}

  async execute(request: GetCurrentWeatherRequest): Promise<GetCurrentWeatherResponse> {
    try {
      // Validate input
      if (!request.city || request.city.trim().length === 0) {
        this.logger.warn('Invalid city parameter provided');
        return {
          success: false,
          error: 'City parameter is required and cannot be empty'
        };
      }

      const city = request.city.trim();
      this.logger.info(`Getting current weather for ${city}`);
      
      const weather = await this.weatherApiRepo.getCurrentWeather(city);
      
      // Save to database for history
      await this.weatherRepo.saveWeatherData(weather);
      
      // Check if data was from cache
      const cacheKey = this.cacheRepo.generateKey('weather', city);
      const cached = await this.cacheRepo.exists(cacheKey);

      this.logger.info(`Weather data retrieved successfully for ${city}`, { cached });
      
      return {
        success: true,
        data: weather,
        cached
      };
    } catch (error) {
      this.logger.error(`Error getting weather for ${request.city}`, error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
}
