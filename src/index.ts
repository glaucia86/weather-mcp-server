import dotenv from 'dotenv';
import { logger } from './utils/simple-logger.js';
import { WeatherMCPServer } from './server.js';

dotenv.config();

async function main() {
  const server = new WeatherMCPServer();

  try {
    await server.start();
    logger.info('Weather MCP server is running');

    // Configurar handlers de sinal antes de qualquer coisa
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

    // Em produção, manter o processo ativo
    if (process.env.NODE_ENV === 'production') {
      logger.info('Running in production mode - keeping process alive');
      await new Promise<void>(() => {
      });
    }
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error', error);
  process.exit(1);
});