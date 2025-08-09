import { z } from 'zod';
import { DatabaseService } from '../services/database.js';
import { logger } from '../utils/logger.js';


const GetHistorySchema = z.object({
  city: z.string().describe('Nome da cidade'),
  limit: z.number().min(1).max(100).default(10).describe('Número de registros')
}) 

export class HistoryTools {
  private database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async getWeatherHistory(args: z.infer<typeof GetHistorySchema>) {
    try {
      const history = await this.database.getWeatherHistory(args.city, args.limit);

      return {
        success: true,
        data: history,
      }
    } catch (error) {
      logger.error('Error in getWeatherHistory tool', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }

  getToolDefinitions() {
    return [
      {
        name: 'get_weather_history',
        description: 'Obtém o histórico de clima de uma cidade',
        inputSchema: GetHistorySchema,
        handler: this.getWeatherHistory.bind(this)
      }
    ];
  }
}