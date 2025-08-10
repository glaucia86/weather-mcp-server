import * as pg from "pg";
import { logger } from "../utils/simple-logger.js";

export class DatabaseService {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });

    this.pool.on('error', (err: any) => {
      logger.error('Unexpected error on idle client', err);
    });
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to the database', error);
      throw error;
    }
  }

  async saveWeatherData(data: any): Promise<void> {
    const query = `
      INSERT INTO weather_history
        (city, country, temperature, feels_like, humidity, pressure, wind_speed, description, icon, raw_data)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
      data.city,
      data.country,
      data.temperature,
      data.feels_like,
      data.humidity,
      data.pressure,
      data.wind_speed,
      data.description,
      data.icon,
      JSON.stringify(data)  // raw_data como JSON string
    ];

    try {
      await this.pool.query(query, values);
      logger.info(`Weather data saved for ${data.city}`);
    } catch (error) {
      logger.error('Failed to save weather data', error);
      throw error;
    }
  }

  async getWeatherHistory(city: string, limit: number = 10): Promise<any[]> {
    const query = `
      SELECT * FROM weather_history
      WHERE city = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `
    try {
      const result = await this.pool.query(query, [city, limit]);
      return result.rows;
    } catch (error) {
      logger.error('Failed to retrieve weather history', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      logger.error('Database health check failed', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection closed');
  }
}