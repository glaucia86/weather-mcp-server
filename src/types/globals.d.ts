// Minimal type definitions
declare global {
  var process: {
    env: Record<string, string | undefined>;
    on: (event: string, listener: (...args: any[]) => void) => any;
    exit: (code?: number) => never;
  };
  
  var console: {
    log: (...data: any[]) => void;
    error: (...data: any[]) => void;
    warn: (...data: any[]) => void;
  };
}

// Module declarations
declare module 'pg' {
  export class Pool {
    constructor(config: any);
    connect(): Promise<any>;
    query(text: string, values?: any[]): Promise<any>;
    end(): Promise<void>;
    on(event: string, listener: (err: any) => void): this;
  }
}

export {};
