import { logger } from '../utils/simple-logger.js';
import axios from 'axios';
import { CacheService } from './cacheService.js';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  city: string;
  country: string;
  forecasts: any[];
}

export class WeatherApiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';
  private cache: CacheService;

  // Cache TTL configurations (in seconds)
  private readonly WEATHER_CACHE_TTL = 10 * 60; // 10 minutes for current weather
  private readonly FORECAST_CACHE_TTL = 60 * 60; // 1 hour for forecasts

  constructor(cacheService: CacheService) {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cache = cacheService;
    
    if (!this.apiKey) {
      logger.warn('Weather API key not configured')
    } 
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    const cacheKey = this.cache.generateKey('weather', city);

    try {
      // First, try to get from cache
      const cachedWeather = await this.cache.get<WeatherData>(cacheKey);
      if (cachedWeather) {
        logger.info(`Weather data retrieved from cache for ${city}`);
        return cachedWeather;
      }

      // If not in cache, fetch from API
      logger.info(`Fetching weather data from API for ${city}`);
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;

      const weatherData: WeatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind_speed: data.wind?.speed || 0,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };

      // Cache the result
      await this.cache.set(cacheKey, weatherData, this.WEATHER_CACHE_TTL);
      
      logger.info(`Weather data fetched and cached for ${city}`);
      return weatherData;
    } catch (error) {
      logger.error(`Failed to fetch weather for ${city}`, error);
      throw new Error(`Failed to fetch weather data: ${error}`);
    }
  }

  async getWeatherForecast(city: string, days: number = 5): Promise<ForecastData> {
    const cacheKey = this.cache.generateKey('forecast', city, days.toString());

    try {
      // First, try to get from cache
      const cachedForecast = await this.cache.get<ForecastData>(cacheKey);
      if (cachedForecast) {
        logger.info(`Forecast data retrieved from cache for ${city} (${days} days)`);
        return cachedForecast;
      }

      // If not in cache, fetch from API
      logger.info(`Fetching forecast data from API for ${city} (${days} days)`);
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 previsões por dia (a cada 3 horas)
        }
      });

      const forecastData: ForecastData = {
        city: response.data.city.name,
        country: response.data.city.country,
        forecasts: response.data.list
      };

      // Cache the result
      await this.cache.set(cacheKey, forecastData, this.FORECAST_CACHE_TTL);

      logger.info(`Forecast data fetched and cached for ${city} (${days} days)`);
      return forecastData;
    } catch (error) {
      logger.error(`Failed to fetch forecast for ${city}`, error);
      throw new Error(`Failed to fetch forecast data: ${error}`);
    }
  }

  /**
   * Clear cache for a specific city
   */
  async clearCacheForCity(city: string): Promise<void> {
    const weatherKey = this.cache.generateKey('weather', city);
    const forecastKeys = await this.cache.getKeys(`forecast:${city.toLowerCase()}:*`);
    
    await this.cache.delete(weatherKey);
    for (const key of forecastKeys) {
      await this.cache.delete(key);
    }
    
    logger.info(`Cache cleared for city: ${city}`);
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    const weatherKeys = await this.cache.getKeys('weather:*');
    const forecastKeys = await this.cache.getKeys('forecast:*');
    
    return {
      weatherCacheCount: weatherKeys.length,
      forecastCacheCount: forecastKeys.length,
      totalCacheEntries: weatherKeys.length + forecastKeys.length,
      redisStats: await this.cache.getStats()
    };
  }
}