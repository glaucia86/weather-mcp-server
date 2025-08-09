import { WeatherApiService } from '../src/services/weatherApi';
import { DatabaseService } from '../src/services/database';

describe('Weather Service Tests', () => {
  let weatherApi: WeatherApiService;
  let database: DatabaseService;

  beforeAll(() => {
    weatherApi = new WeatherApiService();
    database = new DatabaseService();
  });

  afterAll(async () => {
    await database.close();
  });

  test('should fetch weather data', async () => {
    const weather = await weatherApi.getCurrentWeather('London');

    expect(weather).toHaveProperty('city');
    expect(weather).toHaveProperty('temperature');
    expect(weather.city).toBe('London');
  });

  test('should save weather to database', async () => {
    const mockWeather = {
      city: 'Test City',
      country: 'Test Country',
      temperature: 25,
      feels_like: 27,
      humidity: 50,
      pressure: 1013,
      wind_speed: 5,
      description: 'clear sky',
      icon: '01d'
    };

    await database.saveWeatherData(mockWeather);
    const history = await database.getWeatherHistory('Test City', 1);

    expect(history).toHaveLength(1);
    expect(history[0].city).toBe('Test City');
  });
});
