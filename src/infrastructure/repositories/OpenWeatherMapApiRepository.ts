import axios from 'axios';
import { IWeatherApiRepository, ICacheRepository } from '../../domain/repositories/IRepositories.js';
import { WeatherData, ForecastData } from '../../domain/entities/Weather.js';
import { ILogger } from '../logger/Logger.js';

export class OpenWeatherMapApiRepository implements IWeatherApiRepository {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  // Cache TTL configurations (in seconds)
  private readonly WEATHER_CACHE_TTL = 10 * 60; // 10 minutes for current weather
  private readonly FORECAST_CACHE_TTL = 60 * 60; // 1 hour for forecasts

  constructor(
    private cacheRepo: ICacheRepository,
    private logger: ILogger
  ) {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    
    if (!this.apiKey) {
      this.logger.warn('Weather API key not configured')
    } 
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    const cacheKey = this.cacheRepo.generateKey('weather', city);

    try {
      // First, try to get from cache
      const cachedWeather = await this.cacheRepo.get<WeatherData>(cacheKey);
      if (cachedWeather) {
        this.logger.info(`Weather data retrieved from cache for ${city}`);
        return cachedWeather;
      }

      // If not in cache, fetch from API
      this.logger.info(`Fetching weather data from API for ${city}`);
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
      await this.cacheRepo.set(cacheKey, weatherData, this.WEATHER_CACHE_TTL);
      
      this.logger.info(`Weather data fetched and cached for ${city}`);
      return weatherData;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${city}`, error);
      throw new Error(`Failed to fetch weather data: ${error}`);
    }
  }

  async getWeatherForecast(city: string, days: number = 5): Promise<ForecastData> {
    const cacheKey = this.cacheRepo.generateKey('forecast', city, days.toString());

    try {
      // First, try to get from cache
      const cachedForecast = await this.cacheRepo.get<ForecastData>(cacheKey);
      if (cachedForecast) {
        this.logger.info(`Forecast data retrieved from cache for ${city} (${days} days)`);
        return cachedForecast;
      }

      // If not in cache, fetch from API
      this.logger.info(`Fetching forecast data from API for ${city} (${days} days)`);
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
      await this.cacheRepo.set(cacheKey, forecastData, this.FORECAST_CACHE_TTL);

      this.logger.info(`Forecast data fetched and cached for ${city} (${days} days)`);
      return forecastData;
    } catch (error) {
      this.logger.error(`Failed to fetch forecast for ${city}`, error);
      throw new Error(`Failed to fetch forecast data: ${error}`);
    }
  }

  async clearCacheForCity(city: string): Promise<void> {
    const weatherKey = this.cacheRepo.generateKey('weather', city);
    const forecastKeys = await this.cacheRepo.getKeys(`forecast:${city.toLowerCase()}:*`);
    
    await this.cacheRepo.delete(weatherKey);
    for (const key of forecastKeys) {
      await this.cacheRepo.delete(key);
    }
    
    this.logger.info(`Cache cleared for city: ${city}`);
  }

  async getCacheStats(): Promise<any> {
    const weatherKeys = await this.cacheRepo.getKeys('weather:*');
    const forecastKeys = await this.cacheRepo.getKeys('forecast:*');
    
    return {
      weatherCacheCount: weatherKeys.length,
      forecastCacheCount: forecastKeys.length,
      totalCacheEntries: weatherKeys.length + forecastKeys.length,
      redisStats: await this.cacheRepo.getStats()
    };
  }
}
