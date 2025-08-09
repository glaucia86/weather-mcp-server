#!/usr/bin/env node

// PRIMEIRO: Configurar variáveis ANTES de qualquer import
process.env.MCP_MODE = 'true';
process.env.NODE_ENV = 'production';
process.env.LOG_LEVEL = 'silent';

// Silenciar console ANTES dos imports
console.log = () => {};
console.error = () => {};
console.warn = () => {};
console.info = () => {};
console.debug = () => {};

// Interceptar process.stdout.write também
process.stdout.write = function() {
  return true;
};

// Interceptar process.stderr.write
process.stderr.write = function() {
  return true;
};

// AGORA sim importar (com ambiente já configurado)
import dotenv from 'dotenv';
import { WeatherMCPServer } from './server.js';

dotenv.config();

async function main() {
  const server = new WeatherMCPServer();
  
  try {
    await server.start();
    
    process.on('SIGINT', async () => {
      await server.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    process.exit(1);
  }
}

main().catch(() => {
  process.exit(1);
});