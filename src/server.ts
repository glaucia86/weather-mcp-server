import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    CallToolRequestSchema, 
    ListToolsRequestSchema 
  } from '@modelcontextprotocol/sdk/types.js'
import { DatabaseService } from "./services/database.js";
import { WeatherApiService } from "./services/weatherApi.js";
import { CacheService } from "./services/cacheService.js";
import { HistoryTools } from "./tools/history.js";
import { WeatherTools } from "./tools/weather.js";
import { logger } from './utils/simple-logger.js';

export class WeatherMCPServer {
  private server: Server;
  private database: DatabaseService;
  private cache: CacheService;
  private weatherApi: WeatherApiService;
  private weatherTools: WeatherTools;
  private historyTools: HistoryTools;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'weather-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.database = new DatabaseService();
    this.cache = new CacheService();
    this.weatherApi = new WeatherApiService(this.cache);
    this.weatherTools = new WeatherTools(this.weatherApi, this.database, this.cache);
    this.historyTools = new HistoryTools(this.database);

    this.registerTools();
    this.setupHandlers();
  }

  private registerTools() {
    // Registrar ferramentas de clima
    const weatherToolDefs = this.weatherTools.getToolDefinitions();
    weatherToolDefs.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    //Registrar ferramentas de histórico
    const historyToolDefs = this.historyTools.getToolDefinitions();
    historyToolDefs.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    logger.info(`Registered ${this.tools.size} tools.`);
  }

  private setupHandlers() {
    // Handler para listar ferramentas
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools };
    });

    // Handler para chamar ferramentas:
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if(!tool) {
        throw new Error(`Tool ${name} not found`);
      }

      logger.info(`Calling tool: ${name}`, { args });

      try {
        const result = await tool.handler(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error calling tool ${name}`, error);
        throw error;
      }
    });
  }

  async start() {
  try {
    // Conectar ao banco de dados
    await this.database.connect();
    
    // Conectar ao cache Redis
    await this.cache.connect();

    // SEMPRE usar StdioServerTransport para MCP
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('MCP Server started successfully with StdioServerTransport and Redis cache');
  } catch (error) {
    logger.error('Error starting MCP Server', error);
    throw error;
  }
}

  async stop() {
    await this.database.close();
    await this.cache.disconnect();
    logger.info('MCP Server stopped successfully');
  }
}