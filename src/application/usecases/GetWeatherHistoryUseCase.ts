import { WeatherHistoryRecord } from '../../domain/entities/Weather.js';
import { IWeatherRepository } from '../../domain/repositories/IRepositories.js';
import { ILogger } from '../../infrastructure/logger/Logger.js';

export interface GetWeatherHistoryRequest {
  city: string;
  limit?: number;
}

export interface GetWeatherHistoryResponse {
  success: boolean;
  data?: WeatherHistoryRecord[];
  error?: string;
}

export class GetWeatherHistoryUseCase {
  constructor(
    private weatherRepo: IWeatherRepository,
    private logger: ILogger
  ) {}

  async execute(request: GetWeatherHistoryRequest): Promise<GetWeatherHistoryResponse> {
    try {
      const { city, limit = 10 } = request;
      
      this.logger.info(`Getting weather history for ${city} (limit: ${limit})`);
      
      const history = await this.weatherRepo.getWeatherHistory(city, limit);
      
      this.logger.info(`Retrieved ${history.length} weather history records for ${city}`);
      
      return {
        success: true,
        data: history
      };
    } catch (error) {
      this.logger.error(`Error getting weather history for ${request.city}`, error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
}
