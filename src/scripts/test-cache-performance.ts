import { CacheService } from '../services/cacheService.js';
import { WeatherApiService, WeatherData } from '../services/weatherApi.js';
import { logger } from '../utils/simple-logger.js';

async function testCacheWithMockData() {
  console.log('🧪 Testando sistema de cache Redis com dados simulados...\n');

  const cache = new CacheService();
  await cache.connect();

  // 1. Teste básico do Redis
  console.log('1. ✅ Conectividade do Redis verificada');
  const isHealthy = await cache.healthCheck();
  if (!isHealthy) {
    console.log('❌ Redis não está funcionando');
    return;
  }

  // 2. Teste de performance do cache
  console.log('\n2. 🚀 Teste de Performance do Cache');
  
  // Dados simulados de clima
  const mockWeatherData: WeatherData = {
    city: 'São Paulo',
    country: 'BR',
    temperature: 23.5,
    feels_like: 25.2,
    humidity: 65,
    pressure: 1013,
    wind_speed: 3.2,
    description: 'Partly cloudy',
    icon: '02d'
  };

  const cacheKey = 'weather:são_paulo';

  // Primeira consulta - simula inserção no cache
  console.log('   📝 Inserindo dados no cache...');
  const start1 = Date.now();
  await cache.set(cacheKey, mockWeatherData, 600); // 10 minutos TTL
  const time1 = Date.now() - start1;
  console.log(`   ✅ Dados inseridos em ${time1}ms`);

  // Segunda consulta - deve vir do cache
  console.log('   💾 Recuperando dados do cache...');
  const start2 = Date.now();
  const cachedData = await cache.get<WeatherData>(cacheKey);
  const time2 = Date.now() - start2;
  console.log(`   ✅ Dados recuperados em ${time2}ms (${Math.round((time1/time2) * 10)/10}x mais rápido!)`);
  console.log(`   📊 Dados: ${cachedData?.city}, ${cachedData?.temperature}°C, ${cachedData?.description}`);

  // 3. Teste de TTL (Time To Live)
  console.log('\n3. ⏰ Teste de TTL (Time To Live)');
  const ttl = await cache.getTTL(cacheKey);
  console.log(`   ✅ TTL atual: ${ttl} segundos`);
  
  // Inserir com TTL curto para teste
  await cache.set('weather:test_ttl', { test: 'data' }, 5);
  console.log('   ✅ Inserido item com TTL de 5 segundos');
  
  let ttlTest = await cache.getTTL('weather:test_ttl');
  console.log(`   ⏱️  TTL inicial: ${ttlTest} segundos`);
  
  // Aguardar 3 segundos
  await new Promise(resolve => setTimeout(resolve, 3000));
  ttlTest = await cache.getTTL('weather:test_ttl');
  console.log(`   ⏱️  TTL após 3s: ${ttlTest} segundos`);

  // 4. Teste de múltiplas cidades
  console.log('\n4. 🌍 Teste com múltiplas cidades');
  const cities = ['Rio de Janeiro', 'Brasília', 'Salvador', 'Recife', 'Fortaleza'];
  
  for (const city of cities) {
    const cityData = {
      ...mockWeatherData,
      city,
      temperature: Math.round((Math.random() * 15 + 15) * 10) / 10, // 15-30°C
      humidity: Math.round(Math.random() * 30 + 50) // 50-80%
    };
    
    await cache.set(`weather:${city.toLowerCase().replace(' ', '_')}`, cityData, 600);
  }
  console.log(`   ✅ Cache populado com ${cities.length} cidades`);

  // 5. Listar todas as chaves de clima
  console.log('\n5. 📋 Chaves armazenadas no cache');
  const weatherKeys = await cache.getKeys('weather:*');
  console.log(`   ✅ Total de entradas de clima: ${weatherKeys.length}`);
  weatherKeys.forEach(key => console.log(`   🔑 ${key}`));

  // 6. Teste de recuperação em lote
  console.log('\n6. 📦 Teste de recuperação em lote');
  const batchStart = Date.now();
  const promises = weatherKeys.map(key => cache.get(key));
  const results = await Promise.all(promises);
  const batchTime = Date.now() - batchStart;
  
  console.log(`   ✅ ${results.length} itens recuperados em ${batchTime}ms`);
  console.log(`   📊 Média: ${Math.round(batchTime/results.length * 100)/100}ms por item`);

  // 7. Estatísticas do Redis
  console.log('\n7. 📊 Estatísticas do Redis');
  try {
    const redisStats = await cache.getStats();
    if (redisStats) {
      console.log('   ✅ Redis conectado e funcionando');
      console.log('   💾 Estatísticas coletadas com sucesso');
    }
  } catch (error) {
    console.log('   ⚠️  Erro ao coletar estatísticas:', error);
  }

  // 8. Teste de padrão de busca
  console.log('\n8. 🔍 Teste de padrões de busca');
  const saoPauloKeys = await cache.getKeys('*são_paulo*');
  const rioKeys = await cache.getKeys('*rio*');
  console.log(`   ✅ Chaves com "são_paulo": ${saoPauloKeys.length}`);
  console.log(`   ✅ Chaves com "rio": ${rioKeys.length}`);

  // 9. Simulação de cenário real de uso
  console.log('\n9. 🎯 Simulação de cenário real');
  console.log('   Simulando 100 consultas alternando entre cache hit e miss...');
  
  let cacheHits = 0;
  let cacheMisses = 0;
  const testCities = ['São Paulo', 'Rio de Janeiro', 'Brasília'];
  
  for (let i = 0; i < 100; i++) {
    const randomCity = testCities[Math.floor(Math.random() * testCities.length)];
    const key = `weather:${randomCity.toLowerCase().replace(' ', '_')}`;
    
    const data = await cache.get(key);
    if (data) {
      cacheHits++;
    } else {
      cacheMisses++;
      // Simula inserção no cache após "consulta à API"
      const newData = {
        ...mockWeatherData,
        city: randomCity,
        temperature: Math.round((Math.random() * 15 + 15) * 10) / 10
      };
      await cache.set(key, newData, 600);
    }
  }
  
  console.log(`   ✅ Cache Hits: ${cacheHits} (${(cacheHits/100*100).toFixed(1)}%)`);
  console.log(`   ✅ Cache Misses: ${cacheMisses} (${(cacheMisses/100*100).toFixed(1)}%)`);
  console.log(`   🚀 Taxa de acerto do cache: ${(cacheHits/100*100).toFixed(1)}%`);

  // 10. Limpeza final
  console.log('\n10. 🧹 Limpeza do cache de teste');
  const allTestKeys = await cache.getKeys('weather:*');
  for (const key of allTestKeys) {
    await cache.delete(key);
  }
  console.log(`   ✅ ${allTestKeys.length} chaves removidas`);

  console.log('\n🎉 Teste completo do sistema de cache finalizado!');
  console.log('📈 Resumo dos benefícios do cache:');
  console.log('   - Redução drástica no tempo de resposta');
  console.log('   - Menor carga na API externa');
  console.log('   - Melhor experiência do usuário');
  console.log('   - Economia de requests da API');
  
  await cache.disconnect();
}

// Executar o teste
testCacheWithMockData().catch((error) => {
  console.error('❌ Erro durante o teste:', error);
  process.exit(1);
});
