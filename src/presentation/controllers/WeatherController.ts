import { z } from 'zod';
import { GetCurrentWeatherUseCase } from '../../application/usecases/GetCurrentWeatherUseCase.js';
import { GetWeatherForecastUseCase } from '../../application/usecases/GetWeatherForecastUseCase.js';
import { GetCacheStatisticsUseCase } from '../../application/usecases/GetCacheStatisticsUseCase.js';

// Input validation schemas
const GetWeatherSchema = z.object({
  city: z.string().describe('Nome da cidade para buscar o clima')
});

const GetForecastSchema = z.object({
  city: z.string().describe('Nome da cidade'),
  days: z.number().min(1).max(5).default(3).describe('Número de dias de previsão')
});

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export class WeatherController {
  constructor(
    private getCurrentWeatherUseCase: GetCurrentWeatherUseCase,
    private getWeatherForecastUseCase: GetWeatherForecastUseCase,
    private getCacheStatisticsUseCase: GetCacheStatisticsUseCase
  ) {}

  async getCurrentWeather(args: z.infer<typeof GetWeatherSchema>) {
    return await this.getCurrentWeatherUseCase.execute({ city: args.city });
  }

  async getWeatherForecast(args: z.infer<typeof GetForecastSchema>) {
    return await this.getWeatherForecastUseCase.execute({ 
      city: args.city, 
      days: args.days 
    });
  }

  async getCacheStatistics() {
    return await this.getCacheStatisticsUseCase.execute();
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'get_current_weather',
        description: 'Obtém o clima atual de uma cidade específica',
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "Nome da cidade para buscar o clima"
            }
          },
          required: ["city"]
        },
        handler: this.getCurrentWeather.bind(this)
      },
      {
        name: 'get_weather_forecast',
        description: 'Obtém a previsão do tempo para os próximos dias',
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "Nome da cidade"
            },
            days: {
              type: "number",
              minimum: 1,
              maximum: 5,
              default: 3,
              description: "Número de dias de previsão"
            }
          },
          required: ["city"]
        },
        handler: this.getWeatherForecast.bind(this)
      },
      {
        name: 'get_cache_statistics',
        description: 'Obtém estatísticas do sistema de cache Redis',
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        },
        handler: this.getCacheStatistics.bind(this)
      }
    ];
  }
}
