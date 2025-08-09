import dotenv from 'dotenv';
import { DatabaseService } from '../services/database.js';
import { logger } from '../utils/logger.js';

// Carregar variáveis de ambiente
dotenv.config();

async function migrate() {
  const database = new DatabaseService();
  
  try {
    logger.info('Starting database migration...');
    
    // Conectar ao banco
    await database.connect();
    
    // O banco já tem as tabelas criadas via init.sql no Docker
    // Este script pode ser usado para migrações futuras
    
    logger.info('Database migration completed successfully!');
    
  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  } finally {
    await database.close();
  }
}

// Executar migração
migrate()
  .then(() => {
    logger.info('Migration process finished');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Migration process failed:', error);
    process.exit(1);
  });
