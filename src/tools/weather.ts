import { z } from 'zod';
import { WeatherApiService } from '../services/weatherApi';
import { DatabaseService } from '../services/database';
import { logger } from '../utils/logger';

const GetWeatherSchema = z.object({
  city: z.string().describe('Nome da cidade para buscar o clima')
});

const GetForecastSchema = z.object({
  city: z.string().describe('Nome da cidade'),
  days: z.number().min(1).max(5).default(3).describe('Número de dias de previsão')
});

export class WeatherTools {
  private weatherApi: WeatherApiService;
  private database: DatabaseService;

  constructor(weatherApi: WeatherApiService, database: DatabaseService) {
    this.weatherApi = weatherApi;
    this.database = database;
  }

  async getCurrentWeather(args: z.infer<typeof GetWeatherSchema>) {
    try {
      const weather = await this.weatherApi.getCurrentWeather(args.city);

      // save to the database
      await this.database.saveWeatherData(weather);

      return {
        success: true,
        data: weather
      };
    } catch (error) {
      logger.error('Error in getCurrentWeather tool', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }

  async getWeatherForecast(args: z.infer<typeof GetForecastSchema>) {
    try {
      const forecast = await this.weatherApi.getWeatherForecast(args.city, args.days);

      return {
        success: true,
        data: forecast,
      };
    } catch (error) {
      logger.error('Error in getWeatherForecast tool', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }

  getToolDefinitions() {
    return [
      {
        name: 'get_current_weather',
        description: 'Obtém o clima atual de uma cidade específica',
        inputSchema: GetWeatherSchema,
        handler: this.getCurrentWeather.bind(this)
      },
      {
        name: 'get_weather_forecast',
        description: 'Obtém a previsão do tempo para os próximos dias',
        inputSchema: GetForecastSchema,
        handler: this.getWeatherForecast.bind(this)
      }
    ]
  }
}