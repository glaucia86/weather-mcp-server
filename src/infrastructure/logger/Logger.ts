import winston from 'winston';

export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

export class Logger implements ILogger {
  private winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger({
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
      this.winston.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }

  info(message: string, meta?: any): void {
    // For MCP compatibility, also log to stderr
    if (process.env.MCP_MODE === 'true') {
      console.error(`[INFO] ${message}`, meta || '');
    } else {
      this.winston.info(message, meta);
    }
  }

  error(message: string, meta?: any): void {
    console.error(`[ERROR] ${message}`, meta || '');
    this.winston.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    if (process.env.MCP_MODE === 'true') {
      console.error(`[WARN] ${message}`, meta || '');
    } else {
      this.winston.warn(message, meta);
    }
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV !== 'production' || process.env.MCP_DEBUG === 'true') {
      console.error(`[DEBUG] ${message}`, meta || '');
    }
    this.winston.debug(message, meta);
  }
}

// Singleton instance
export const logger = new Logger();
