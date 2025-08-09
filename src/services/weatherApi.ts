import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import axios from 'axios';

dotenv.config();

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

export class WeatherApiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('Weather API key not configured')
    } 
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
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
        wind_speed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };

      logger.info(`Weather data fetched for ${city}`);

      return weatherData;
    } catch (error) {
      logger.error(`Failed to fetch weather for ${city}`, error);
      throw new Error(`Failed to fetch weather data: ${error}`);
    }
  }

  async getWeatherForecast(city: string, days: number = 5): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 previsões por dia (a cada 3 horas)
        }
      });

      logger.info(`Forecast fetched for ${city}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch forecast for ${city}`, error);
      throw new Error(`Failed to fetch forecast data: ${error}`);
    }
  }
}