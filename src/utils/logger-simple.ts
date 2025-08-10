import winston from 'winston';

// Simple logger without path dependencies
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Debug function for MCP
export const debugLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[INFO] ${message}`, ...args);
  }
}

export const errorLog = (message: string, ...args: any[]): void => {
  console.error(`[ERROR] ${message}`, ...args);
}

export const warnLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[WARN] ${message}`, ...args);
  }
}

export { logger };
