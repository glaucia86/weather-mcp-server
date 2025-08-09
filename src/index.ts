import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { WeatherMCPServer } from './server.js';

dotenv.config();

async function main() {
  const server = new WeatherMCPServer();

  try {
    await server.start();
    logger.info('Weather MCP server is running');

    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down...');
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error', error);
  process.exit(1);
});