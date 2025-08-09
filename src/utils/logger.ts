import path from "path";
import { fileURLToPath } from 'url';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = process.env.NODE_ENV === "production" 
  ? '/app/logs'
  : path.join(__dirname, '../../logs');

// Verificar se está em modo MCP ou silent
const isSilent = process.env.LOG_LEVEL === 'silent' || process.env.MCP_MODE === 'true';

export const logger = winston.createLogger({
  level: isSilent ? 'silent' : (process.env.LOG_LEVEL || 'info'),
  silent: isSilent,  // IMPORTANTE: Desativa completamente se true
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
      silent: isSilent
    }),
    // arquivo para todos os logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      silent: isSilent
    })
  ]
});

// NÃO adicionar Console transport se em modo MCP ou produção
if (process.env.NODE_ENV !== "production" && !isSilent) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}