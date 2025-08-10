// Simplified logger for MCP server
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.error(`[INFO] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.error(`[WARN] ${message}`, ...args);
  }
};

export const mcpSafeLog = logger;
