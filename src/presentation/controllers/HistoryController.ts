import { z } from 'zod';
import { GetWeatherHistoryUseCase } from '../../application/usecases/GetWeatherHistoryUseCase.js';

const GetHistorySchema = z.object({
  city: z.string().describe('Nome da cidade'),
  limit: z.number().min(1).max(100).default(10).describe('Número de registros')
});

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export class HistoryController {
  constructor(private getWeatherHistoryUseCase: GetWeatherHistoryUseCase) {}

  async getWeatherHistory(args: z.infer<typeof GetHistorySchema>) {
    return await this.getWeatherHistoryUseCase.execute({
      city: args.city,
      limit: args.limit
    });
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'get_weather_history',
        description: 'Obtém o histórico de clima de uma cidade',
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "Nome da cidade"
            },
            limit: {
              type: "number",
              minimum: 1,
              maximum: 100,
              default: 10,
              description: "Número de registros"
            }
          },
          required: ["city"]
        },
        handler: this.getWeatherHistory.bind(this)
      }
    ];
  }
}
