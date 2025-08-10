import dotenv from 'dotenv';
import { DIContainer } from '../infrastructure/di/DIContainer.js';
import { IWeatherRepository } from '../domain/repositories/IRepositories.js';
import { ILogger } from '../infrastructure/logger/Logger.js';

// Carregar variáveis de ambiente
dotenv.config();

async function migrate() {
  const container = DIContainer.getInstance();
  container.register();
  
  try {
    await container.initialize();
    const weatherRepository = container.get<IWeatherRepository>('IWeatherRepository');
    const logger = container.get<ILogger>('ILogger');
    
    logger.info('Starting database migration...');
    
    // Test connection
    const isHealthy = await weatherRepository.healthCheck();
    if (!isHealthy) {
      throw new Error('Database connection failed');
    }
    
    // O banco já tem as tabelas criadas via init.sql no Docker
    // Este script pode ser usado para migrações futuras
    
    logger.info('Database migration completed successfully!');
    
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  } finally {
    await container.shutdown();
  }
}

// Executar migração
migrate()
  .then(() => {
    console.log('Migration process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });
