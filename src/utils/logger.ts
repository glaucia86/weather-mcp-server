import path from "path";
import { fileURLToPath } from 'url';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = process.env.NODE_ENV === "production" 
  ? '/app/logs'
  : path.join(__dirname, '../../logs');

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'weather-mcp' },
  transports: [
    // arquivo para erros
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // arquivo para todos os logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    })
  ]
});

export const mcpSafeLog = {
  info: (message: string, ...args: any[]) => {
    // Escrever para arquivo
    logger.info(message, ...args);
    // Para debug, pode usar stderr (não interfere com MCP stdout)
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    logger.error(message, ...args);
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    logger.warn(message, ...args);
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[WARN] ${message}`, ...args);
    }
  }
};