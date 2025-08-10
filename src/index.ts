import dotenv from 'dotenv';
import { WeatherMCPServer } from './presentation/servers/WeatherMCPServer.js';
import { ILogger } from './infrastructure/logger/Logger.js';
import { DIContainer } from './infrastructure/di/DIContainer.js';

// Load environment variables
dotenv.config();

async function main() {
  const container = DIContainer.getInstance();
  container.register();
  
  const logger = container.get<ILogger>('ILogger');
  
  try {
    // Initialize infrastructure
    await container.initialize();
    
    logger.info('🌤️ Weather MCP Server - Starting...');
    logger.info('Environment:', {
      nodeEnv: process.env.NODE_ENV || 'development',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      hasWeatherApiKey: !!process.env.WEATHER_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });

    const server = new WeatherMCPServer();
    
    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      try {
        await server.stop();
        await container.shutdown();
        logger.info('Server stopped successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    await server.start();
    logger.info('🚀 Weather MCP Server started successfully!');
    
  } catch (error) {
    logger.error('Failed to start Weather MCP Server:', error);
    await container.shutdown();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
