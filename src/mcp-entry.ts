// MCP Entry point using Clean Architecture
import dotenv from 'dotenv';
import { WeatherMCPServer } from './presentation/servers/WeatherMCPServer.js';

// Load environment variables
dotenv.config({ quiet: true });

// Set MCP mode for logger
process.env.MCP_MODE = 'true';

// Silent debug function - only logs to stderr in debug mode
const debugLog = (message: string, ...args: any[]) => {
  if (process.env.MCP_DEBUG === 'true') {
    console.error(`[MCP DEBUG] ${message}`, ...args);
  }
};

async function main() {
  const server = new WeatherMCPServer();
  
  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.stop();
    process.exit(0);
  });

  try {
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
