import { CacheService } from '../services/cacheService.js';
import { WeatherApiService } from '../services/weatherApi.js';
import { logger } from '../utils/simple-logger.js';

async function testCache() {
  console.log('🧪 Iniciando teste do sistema de cache Redis...\n');

  const cache = new CacheService();
  await cache.connect();

  // 1. Teste básico do Redis
  console.log('1. Testando conectividade básica do Redis...');
  const isHealthy = await cache.healthCheck();
  console.log(`   ✅ Redis está ${isHealthy ? 'funcionando' : 'com problemas'}\n`);

  if (!isHealthy) {
    console.log('❌ Redis não está funcionando. Verifique se o container está rodando.');
    return;
  }

  // 2. Teste de operações básicas de cache
  console.log('2. Testando operações básicas de cache...');
  const testKey = 'test:cache:basic';
  const testData = { message: 'Hello Redis!', timestamp: new Date().toISOString() };

  // Set
  await cache.set(testKey, testData, 60);
  console.log('   ✅ Dados inseridos no cache');

  // Get
  const retrievedData = await cache.get(testKey);
  console.log('   ✅ Dados recuperados:', retrievedData);

  // Exists
  const exists = await cache.exists(testKey);
  console.log(`   ✅ Chave existe no cache: ${exists}`);

  // TTL
  const ttl = await cache.getTTL(testKey);
  console.log(`   ✅ TTL da chave: ${ttl} segundos\n`);

  // 3. Teste do WeatherApiService com cache
  console.log('3. Testando WeatherApiService com cache...');
  
  const weatherService = new WeatherApiService(cache);

  // Primeira requisição (deve ir para a API)
  console.log('   📡 Primeira consulta (API + Cache)...');
  const start1 = Date.now();
  
  try {
    const weather1 = await weatherService.getCurrentWeather('São Paulo');
    const time1 = Date.now() - start1;
    console.log(`   ✅ Dados obtidos em ${time1}ms:`, {
      city: weather1.city,
      temperature: weather1.temperature,
      description: weather1.description
    });
  } catch (error) {
    console.log('   ⚠️  Erro na primeira consulta (pode ser devido à API key):', error);
  }

  // Pequena pausa
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Segunda requisição (deve vir do cache)
  console.log('   💾 Segunda consulta (deve vir do Cache)...');
  const start2 = Date.now();
  
  try {
    const weather2 = await weatherService.getCurrentWeather('São Paulo');
    const time2 = Date.now() - start2;
    console.log(`   ✅ Dados obtidos em ${time2}ms (cache):`, {
      city: weather2.city,
      temperature: weather2.temperature,
      description: weather2.description
    });
    
    // Comparar tempos
    if (time2 < 100) {
      console.log('   🚀 Cache funcionando! Consulta muito mais rápida.');
    }
  } catch (error) {
    console.log('   ⚠️  Erro na segunda consulta:', error);
  }

  // 4. Teste de estatísticas do cache
  console.log('\n4. Estatísticas do cache...');
  const stats = await weatherService.getCacheStats();
  console.log('   📊 Estatísticas:', {
    weatherCacheCount: stats?.weatherCacheCount || 0,
    forecastCacheCount: stats?.forecastCacheCount || 0,
    totalCacheEntries: stats?.totalCacheEntries || 0
  });

  // 5. Teste de limpeza de cache
  console.log('\n5. Testando limpeza de cache...');
  await cache.delete(testKey);
  const existsAfterDelete = await cache.exists(testKey);
  console.log(`   ✅ Chave removida com sucesso: ${!existsAfterDelete}\n`);

  // 6. Lista todas as chaves
  console.log('6. Chaves no cache:');
  const allKeys = await cache.getKeys();
  console.log(`   📋 Total de chaves: ${allKeys.length}`);
  if (allKeys.length > 0) {
    console.log('   🔑 Chaves encontradas:', allKeys.slice(0, 10)); // Mostra até 10 chaves
  }

  console.log('\n✅ Teste de cache concluído!');
  
  await cache.disconnect();
}

// Executar o teste
testCache().catch((error) => {
  console.error('❌ Erro durante o teste:', error);
  process.exit(1);
});
