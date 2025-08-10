import { DIContainer } from '../src/infrastructure/di/DIContainer.js';
import { GetCurrentWeatherUseCase } from '../src/application/usecases/GetCurrentWeatherUseCase.js';
import { GetWeatherHistoryUseCase } from '../src/application/usecases/GetWeatherHistoryUseCase.js';
import { IWeatherRepository } from '../src/domain/repositories/IRepositories.js';

describe('Weather System Tests', () => {
  let container: DIContainer;
  let getCurrentWeatherUseCase: GetCurrentWeatherUseCase;
  let getWeatherHistoryUseCase: GetWeatherHistoryUseCase;
  let weatherRepository: IWeatherRepository;

  beforeAll(async () => {
    container = DIContainer.getInstance();
    container.register();
    await container.initialize();
    
    getCurrentWeatherUseCase = container.get<GetCurrentWeatherUseCase>('GetCurrentWeatherUseCase');
    getWeatherHistoryUseCase = container.get<GetWeatherHistoryUseCase>('GetWeatherHistoryUseCase');
    weatherRepository = container.get<IWeatherRepository>('IWeatherRepository');
  });

  afterAll(async () => {
    if (container) {
      await container.shutdown();
    }
  });

  test('should fetch weather data through use case', async () => {
    const result = await getCurrentWeatherUseCase.execute({ city: 'London' });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('city');
    expect(result.data).toHaveProperty('temperature');
    expect(result.data?.city).toBe('London');
  });

  test('should save and retrieve weather history', async () => {
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

    await weatherRepository.saveWeatherData(mockWeather);
    
    const historyResult = await getWeatherHistoryUseCase.execute({ 
      city: 'Test City', 
      limit: 1 
    });

    expect(historyResult.success).toBe(true);
    expect(historyResult.data).toHaveLength(1);
    expect(historyResult.data?.[0].city).toBe('Test City');
  });
});
