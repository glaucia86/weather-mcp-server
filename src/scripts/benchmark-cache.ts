import { CacheService } from '../services/cacheService.js';
import { WeatherData } from '../services/weatherApi.js';

// Simula uma chamada de API lenta
async function simulateApiCall(city: string): Promise<WeatherData> {
  // Simula latência da API (100-500ms)
  const delay = Math.random() * 400 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return {
    city,
    country: 'BR',
    temperature: Math.round((Math.random() * 15 + 15) * 10) / 10, // 15-30°C
    feels_like: Math.round((Math.random() * 15 + 17) * 10) / 10,
    humidity: Math.round(Math.random() * 30 + 50), // 50-80%
    pressure: Math.round(Math.random() * 50 + 990), // 990-1040 hPa
    wind_speed: Math.round(Math.random() * 10 * 10) / 10, // 0-10 m/s
    description: ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
    icon: '01d'
  };
}

async function benchmarkCachePerformance() {
  console.log('🏁 Benchmark: Cache vs No Cache Performance\n');

  const cache = new CacheService();
  await cache.connect();

  const cities = ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Recife'];
  const iterations = 50;

  console.log(`🎯 Configuração do teste:`);
  console.log(`   • ${cities.length} cidades diferentes`);
  console.log(`   • ${iterations} consultas totais`);
  console.log(`   • API simulada com latência 100-500ms`);
  console.log(`   • Cache TTL: 10 minutos\n`);

  // =============================
  // Teste SEM cache (baseline)
  // =============================
  console.log('🐌 Testando SEM cache (baseline)...');
  const noCacheStart = Date.now();
  let noCacheRequests = 0;

  for (let i = 0; i < iterations; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    await simulateApiCall(randomCity);
    noCacheRequests++;
  }

  const noCacheTime = Date.now() - noCacheStart;
  const avgNoCacheTime = noCacheTime / iterations;

  console.log(`   ✅ Concluído em ${noCacheTime}ms`);
  console.log(`   📊 ${noCacheRequests} chamadas de API`);
  console.log(`   ⏱️  Tempo médio: ${avgNoCacheTime.toFixed(2)}ms por consulta\n`);

  // =============================
  // Teste COM cache
  // =============================
  console.log('🚀 Testando COM cache...');
  const cacheStart = Date.now();
  let cacheHits = 0;
  let cacheMisses = 0;
  let apiRequests = 0;

  for (let i = 0; i < iterations; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const cacheKey = `benchmark:${randomCity.toLowerCase().replace(' ', '_')}`;

    // Tentar buscar no cache primeiro
    let weatherData = await cache.get<WeatherData>(cacheKey);

    if (weatherData) {
      // Cache hit - dados encontrados no cache
      cacheHits++;
    } else {
      // Cache miss - precisa chamar a API
      cacheMisses++;
      apiRequests++;
      weatherData = await simulateApiCall(randomCity);
      
      // Armazenar no cache
      await cache.set(cacheKey, weatherData, 600); // 10 minutos TTL
    }
  }

  const cacheTime = Date.now() - cacheStart;
  const avgCacheTime = cacheTime / iterations;

  console.log(`   ✅ Concluído em ${cacheTime}ms`);
  console.log(`   💾 Cache hits: ${cacheHits} (${(cacheHits/iterations*100).toFixed(1)}%)`);
  console.log(`   📡 Cache misses: ${cacheMisses} (${(cacheMisses/iterations*100).toFixed(1)}%)`);
  console.log(`   🔌 Chamadas de API: ${apiRequests}`);
  console.log(`   ⏱️  Tempo médio: ${avgCacheTime.toFixed(2)}ms por consulta\n`);

  // =============================
  // Comparação e Análise
  // =============================
  const improvement = ((noCacheTime - cacheTime) / noCacheTime) * 100;
  const speedup = noCacheTime / cacheTime;
  const apiSavings = ((noCacheRequests - apiRequests) / noCacheRequests) * 100;

  console.log('📊 RESULTADOS FINAIS:');
  console.log('═'.repeat(50));
  console.log(`🐌 Sem Cache:`);
  console.log(`   • Tempo total: ${noCacheTime}ms`);
  console.log(`   • Tempo médio: ${avgNoCacheTime.toFixed(2)}ms`);
  console.log(`   • Chamadas de API: ${noCacheRequests}`);
  console.log();
  console.log(`🚀 Com Cache:`);
  console.log(`   • Tempo total: ${cacheTime}ms`);
  console.log(`   • Tempo médio: ${avgCacheTime.toFixed(2)}ms`);
  console.log(`   • Chamadas de API: ${apiRequests}`);
  console.log(`   • Taxa de acerto: ${(cacheHits/iterations*100).toFixed(1)}%`);
  console.log();
  console.log(`🏆 MELHORIA COM CACHE:`);
  console.log(`   • ${improvement.toFixed(1)}% mais rápido`);
  console.log(`   • ${speedup.toFixed(1)}x de speedup`);
  console.log(`   • ${apiSavings.toFixed(1)}% menos chamadas de API`);
  console.log(`   • Economia de ${noCacheRequests - apiRequests} requests de API`);

  if (improvement > 50) {
    console.log('\n🎉 EXCELENTE! O cache está proporcionando uma melhoria significativa!');
  } else if (improvement > 20) {
    console.log('\n✅ BOM! O cache está melhorando a performance consideravelmente.');
  } else {
    console.log('\n⚠️  O cache pode precisar de ajustes para melhor performance.');
  }

  // =============================
  // Teste de cenário real
  // =============================
  console.log('\n🌍 Teste de cenário real (consultas repetidas)...');
  const realWorldStart = Date.now();
  let realWorldHits = 0;
  let realWorldMisses = 0;

  // Simula 100 consultas com padrão mais realista (70% consultas repetidas)
  for (let i = 0; i < 100; i++) {
    let city;
    if (Math.random() < 0.7) {
      // 70% chance de ser uma das cidades populares (simula consultas frequentes)
      city = ['São Paulo', 'Rio de Janeiro'][Math.floor(Math.random() * 2)];
    } else {
      // 30% chance de ser qualquer cidade
      city = cities[Math.floor(Math.random() * cities.length)];
    }

    const cacheKey = `real:${city.toLowerCase().replace(' ', '_')}`;
    let data = await cache.get<WeatherData>(cacheKey);

    if (data) {
      realWorldHits++;
    } else {
      realWorldMisses++;
      data = await simulateApiCall(city);
      await cache.set(cacheKey, data, 600);
    }
  }

  const realWorldTime = Date.now() - realWorldStart;
  console.log(`   ✅ 100 consultas em ${realWorldTime}ms`);
  console.log(`   💾 Cache hits: ${realWorldHits}% | Misses: ${realWorldMisses}%`);
  console.log(`   🎯 Taxa de acerto em cenário real: ${realWorldHits}%`);

  // Limpeza
  console.log('\n🧹 Limpeza do cache de teste...');
  const testKeys = await cache.getKeys('benchmark:*');
  const realKeys = await cache.getKeys('real:*');
  
  for (const key of [...testKeys, ...realKeys]) {
    await cache.delete(key);
  }
  
  console.log(`   ✅ ${testKeys.length + realKeys.length} chaves removidas`);
  
  await cache.disconnect();
  console.log('\n✅ Benchmark concluído!');
}

benchmarkCachePerformance().catch(console.error);
