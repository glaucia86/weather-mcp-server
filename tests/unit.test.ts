import { GetCurrentWeatherUseCase } from '../src/application/usecases/GetCurrentWeatherUseCase.js';
import { MockCacheRepository } from './test-helpers.js';
import { IWeatherApiRepository, IWeatherRepository } from '../src/domain/repositories/IRepositories.js';
import { ILogger } from '../src/infrastructure/logger/Logger.js';
import { WeatherData } from '../src/domain/entities/Weather.js';

// Mock implementations
class MockWeatherApiRepository implements IWeatherApiRepository {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    return {
      city,
      country: 'Test Country',
      temperature: 25,
      feels_like: 27,
      humidity: 50,
      pressure: 1013,
      wind_speed: 5,
      description: 'clear sky',
      icon: '01d'
    };
  }

  async getWeatherForecast(city: string, days?: number) {
    return {
      city,
      country: 'Test Country',
      forecasts: []
    };
  }

  async clearCacheForCity(city: string): Promise<void> {}
  async getCacheStats(): Promise<any> {
    return {};
  }
}

class MockWeatherRepository implements IWeatherRepository {
  private data: WeatherData[] = [];

  async saveWeatherData(data: WeatherData): Promise<void> {
    this.data.push(data);
  }

  async getWeatherHistory(city: string, limit?: number) {
    return this.data
      .filter(d => d.city === city)
      .slice(0, limit || 10)
      .map(d => ({
        id: Math.random(),
        city: d.city,
        country: d.country,
        temperature: d.temperature,
        feels_like: d.feels_like,
        humidity: d.humidity,
        pressure: d.pressure,
        wind_speed: d.wind_speed,
        description: d.description,
        icon: d.icon,
        created_at: new Date()
      }));
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

class MockLogger implements ILogger {
  debug(message: string, meta?: any): void {}
  info(message: string, meta?: any): void {}
  warn(message: string, meta?: any): void {}
  error(message: string, meta?: any): void {}
}

describe('Weather Use Cases - Unit Tests', () => {
  let getCurrentWeatherUseCase: GetCurrentWeatherUseCase;
  let mockWeatherApi: MockWeatherApiRepository;
  let mockWeatherRepo: MockWeatherRepository;
  let mockCache: MockCacheRepository;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockWeatherApi = new MockWeatherApiRepository();
    mockWeatherRepo = new MockWeatherRepository();
    mockCache = new MockCacheRepository();
    mockLogger = new MockLogger();

    getCurrentWeatherUseCase = new GetCurrentWeatherUseCase(
      mockWeatherApi,
      mockWeatherRepo,
      mockCache,
      mockLogger
    );
  });

  test('should get current weather for a city', async () => {
    const result = await getCurrentWeatherUseCase.execute({ city: 'London' });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('city', 'London');
    expect(result.data).toHaveProperty('temperature', 25);
    expect(result.data).toHaveProperty('country', 'Test Country');
  });

  test('should handle invalid city input', async () => {
    const result = await getCurrentWeatherUseCase.execute({ city: '' });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should cache weather data', async () => {
    // First call
    await getCurrentWeatherUseCase.execute({ city: 'London' });
    
    // Check that data was cached
    const cachedData = await mockCache.get('weather:current:london');
    expect(cachedData).toBeDefined();
  });
});
