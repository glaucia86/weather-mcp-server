import { Server } from "@modelcontextprotocol/sdk/server/index";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types";
import { DatabaseService } from "./services/database";
import { WeatherApiService } from "./services/weatherApi";
import { WeatherTools } from "./tools/weather";
import { HistoryTools } from "./tools/history";

export class WeatherMCPServer {
  private server: Server;
  private database: DatabaseService;
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
    this.weatherApi = new WeatherApiService();
    this.weatherTools = new WeatherTools(this.weatherApi, this.database);
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

    console.error(`[MCP] Registered ${this.tools.size} tools`);
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

    this.server.setRequestHandler(CallToolRequestSchema, async(request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if(!tool) {
        throw new Error(`Tool ${name} not found`);
      }

      console.error(`[MCP] Calling tool ${name}`);

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
        console.error(`[MCP] Error calling tool ${name}:`, error);
        throw error;
      }
    });
  }

  async start() {
    try {
      await this.database.connect();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      console.error('[MCP] Server started successfully');
    } catch (error) {
      console.error('[MCP] Error starting server:', error);
      throw error;
    }
  }

  async stop() {
    await this.database.close();
    console.error('[MCP] Server Stopped');
  }
}

async function main() {
  const server = new WeatherMCPServer();

  try {
    await server.start();

    process.on('SIGINT', async() => {
      console.error('[MCP] Received SIGINT, shutting down...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('[MCP] Received SIGTERM, shutting down...');
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('[MCP] Failed to start server:', error);
    process.exit(1); 
  }
}

main().catch((error) => {
  console.error('[MCP] Unhandled error:', error);
  process.exit(1);
});
