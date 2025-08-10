import dotenv from 'dotenv';

// Load environment variables with quiet mode
dotenv.config({ quiet: true });

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DatabaseService } from "./services/database.js";
import { CacheService } from "./services/cacheService.js";
import { WeatherApiService } from "./services/weatherApi.js";
import { WeatherTools } from "./tools/weather.js";
import { HistoryTools } from "./tools/history.js";

// Silent debug function - only logs to stderr in debug mode
const debugLog = (message: string, ...args: any[]) => {
  if (process.env.MCP_DEBUG === 'true') {
    console.error(message, ...args);
  }
};

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

    this.database = new DatabaseService();
    this.cache = new CacheService();
    this.weatherApi = new WeatherApiService(this.cache);
    this.weatherTools = new WeatherTools(this.weatherApi, this.database, this.cache);
    this.historyTools = new HistoryTools(this.database);

    this.registerTools();
    this.setupHandlers();
  }

  private registerTools() {
    const weatherToolDefs = this.weatherTools.getToolDefinitions();
    weatherToolDefs.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });

    const historyToolDefs = this.historyTools.getToolDefinitions();
    historyToolDefs.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    debugLog(`[MCP] Registered ${this.tools.size} tools`);
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

      debugLog(`[MCP] Calling tool ${name}`);

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
        debugLog(`[MCP] Error calling tool ${name}:`, error);
        throw error;
      }
    });
  }

  async start() {
    try {
      await this.database.connect();
      await this.cache.connect(); // Conectar ao Redis
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      debugLog('[MCP] Server started successfully with Redis cache');
    } catch (error) {
      console.error('[MCP] Error starting server:', error);
      throw error;
    }
  }

  async stop() {
    await this.database.close();
    await this.cache.disconnect(); // Desconectar do Redis
    debugLog('[MCP] Server Stopped');
  }
}

async function main() {
  const server = new WeatherMCPServer();

  try {
    await server.start();

    process.on('SIGINT', async() => {
      debugLog('[MCP] Received SIGINT, shutting down...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      debugLog('[MCP] Received SIGTERM, shutting down...');
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    debugLog('[MCP] Failed to start server:', error);
    process.exit(1); 
  }
}

main().catch((error) => {
  debugLog('[MCP] Unhandled error:', error);
  process.exit(1);
});
