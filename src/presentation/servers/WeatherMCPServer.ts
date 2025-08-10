import dotenv from 'dotenv';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { DIContainer } from '../../infrastructure/di/DIContainer.js';
import { WeatherController } from '../controllers/WeatherController.js';
import { HistoryController } from '../controllers/HistoryController.js';
import { ILogger } from '../../infrastructure/logger/Logger.js';

export class WeatherMCPServer {
  private server: Server;
  private container: DIContainer;
  private weatherController: WeatherController;
  private historyController: HistoryController;
  private logger: ILogger;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "weather-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Setup dependency injection
    this.container = DIContainer.getInstance();
    this.container.register();
    
    // Get dependencies from container
    this.logger = this.container.get<ILogger>('ILogger');
    this.weatherController = this.container.get<WeatherController>('WeatherController');
    this.historyController = this.container.get<HistoryController>('HistoryController');

    this.registerTools();
    this.setupHandlers();
  }

  private registerTools() {
    // Register weather tools
    const weatherTools = this.weatherController.getToolDefinitions();
    weatherTools.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });

    // Register history tools
    const historyTools = this.historyController.getToolDefinitions();
    historyTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    this.logger.debug(`[MCP] Registered ${this.tools.size} tools`);
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools };
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "weather://current",
            mimeType: "application/json",
            name: "Current Weather",
            description: "Get current weather for any city"
          },
          {
            uri: "weather://history",
            mimeType: "application/json",
            name: "Weather History",
            description: "Historical weather data"
          }
        ]
      };
    });

    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: "weather-summary",
            description: "Generate a weather summary for a city",
            arguments: [
              {
                name: "city",
                description: "City name",
                required: true
              }
            ]
          }
        ]
      }
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if(!tool) {
        throw new Error(`Tool ${name} not found`);
      }

      this.logger.debug(`[MCP] Calling tool ${name}`, args);

      try {
        const result = await tool.handler(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        this.logger.error(`[MCP] Error calling tool ${name}:`, error);
        throw error;
      }
    });
  }

  async start() {
    try {
      // Initialize infrastructure services
      await this.container.initialize();
      
      // Connect server to stdio
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      this.logger.info('Weather MCP Server started successfully');
    } catch (error) {
      this.logger.error('Failed to start MCP server:', error);
      throw error;
    }
  }

  async stop() {
    try {
      await this.container.shutdown();
      this.logger.info('Weather MCP Server stopped successfully');
    } catch (error) {
      this.logger.error('Error stopping MCP server:', error);
      throw error;
    }
  }
}
