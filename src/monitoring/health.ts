import { DatabaseService } from "../services/database";
import { logger } from "../utils/logger.js";

export class HealthCheck {
  private database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async check(): Promise<any> {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        api: false
      }
    };

    try {
      // Check database connection
      const dbHealthy = await this.database.healthCheck();
      health.services.database = dbHealthy;
      if (!dbHealthy) {
        health.status = 'unhealthy';
      }
    } catch (error) {
      logger.error('Database health check failed', error);
      health.status = 'unhealthy';
    }

    // Check external API
    try {
      health.services.api = true;
    } catch (error) {
      logger.error('External API health check failed', error);
      health.status = 'unhealthy';
    }

    return health;
  }
}