import dotenv from 'dotenv';
import { WeatherApiService } from '../services/weatherApi.js';
import { CacheService } from '../services/cacheService.js';
import { DatabaseService } from '../services/database.js';
import { logger } from '../utils/simple-logger.js';

dotenv.config();

async function testWeatherSystem() {
  const cache = new CacheService();
  const weatherApi = new WeatherApiService(cache);
  const database = new DatabaseService();
  
  try {
    logger.info('Testing weather system...');
    
    // Conectar aos serviços
    await database.connect();
    await cache.connect();
    
    // Testar API do clima
    console.log('Testing weather API...');
    const weatherData = await weatherApi.getCurrentWeather('London');
    console.log('Weather data received:', {
      city: weatherData.city,
      temperature: weatherData.temperature,
      description: weatherData.description
    });
    
    // Salvar no banco de dados
    console.log('Saving to database...');
    await database.saveWeatherData(weatherData);
    
    // Buscar histórico
    console.log('Retrieving history...');
    const history = await database.getWeatherHistory('London', 5);
    console.log(`Found ${history.length} records in history`);
    
    logger.info('Weather system test completed successfully!');
    
  } catch (error) {
    logger.error('Weather system test failed:', error);
    throw error;
  } finally {
    await database.close();
  }
}

// Executar teste
testWeatherSystem()
  .then(() => {
    console.log('✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
