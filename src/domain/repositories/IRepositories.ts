import { WeatherData, ForecastData, WeatherHistoryRecord } from '../entities/Weather.js';

// Repository interfaces (ports)
export interface IWeatherRepository {
  saveWeatherData(data: WeatherData): Promise<void>;
  getWeatherHistory(city: string, limit?: number): Promise<WeatherHistoryRecord[]>;
  healthCheck(): Promise<boolean>;
}

export interface ICacheRepository {
  set(key: string, value: any, ttlSeconds?: number): Promise<boolean>;
  get<T = any>(key: string): Promise<T | null>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  getTTL(key: string): Promise<number>;
  getKeys(pattern?: string): Promise<string[]>;
  clearAll(): Promise<boolean>;
  healthCheck(): Promise<boolean>;
  getStats(): Promise<any>;
  generateKey(prefix: string, ...parts: string[]): string;
}

export interface IWeatherApiRepository {
  getCurrentWeather(city: string): Promise<WeatherData>;
  getWeatherForecast(city: string, days?: number): Promise<ForecastData>;
  clearCacheForCity(city: string): Promise<void>;
  getCacheStats(): Promise<any>;
}
