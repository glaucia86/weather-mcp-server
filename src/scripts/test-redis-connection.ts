import { CacheService } from '../services/cacheService.js';
import { logger } from '../utils/simple-logger.js';

async function testRedisDirectConnection() {
  console.log('🔧 Testando conexão direta com Redis...\n');

  const cache = new CacheService();
  
  try {
    await cache.connect();
    console.log('✅ Conectado ao Redis com sucesso!');

    // Teste de ping
    const isHealthy = await cache.healthCheck();
    console.log(`✅ Health check: ${isHealthy ? 'PASS' : 'FAIL'}`);

    if (isHealthy) {
      // Teste básico de set/get
      const testData = {
        message: 'Cache test',
        timestamp: new Date().toISOString(),
        performance: 'excellent'
      };

      console.log('\n📝 Testando operações básicas...');
      
      // Set
      const setResult = await cache.set('test:performance', testData, 120);
      console.log(`✅ Set operation: ${setResult ? 'SUCCESS' : 'FAILED'}`);

      // Get
      const getData = await cache.get('test:performance');
      console.log(`✅ Get operation: ${getData ? 'SUCCESS' : 'FAILED'}`);
      console.log(`📊 Retrieved data:`, getData);

      // TTL
      const ttl = await cache.getTTL('test:performance');
      console.log(`✅ TTL: ${ttl} seconds`);

      // Exists
      const exists = await cache.exists('test:performance');
      console.log(`✅ Key exists: ${exists}`);

      // Test multiple operations
      console.log('\n🚀 Testando performance...');
      const start = Date.now();
      
      // Set 10 items
      for (let i = 0; i < 10; i++) {
        await cache.set(`perf:test:${i}`, { index: i, data: `test-data-${i}` }, 60);
      }
      
      // Get 10 items
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = await cache.get(`perf:test:${i}`);
        results.push(result);
      }
      
      const end = Date.now();
      console.log(`✅ 20 operações (10 SET + 10 GET) completadas em ${end - start}ms`);
      console.log(`📊 Média: ${((end - start) / 20).toFixed(2)}ms por operação`);

      // Cleanup
      console.log('\n🧹 Limpeza...');
      await cache.delete('test:performance');
      for (let i = 0; i < 10; i++) {
        await cache.delete(`perf:test:${i}`);
      }
      console.log('✅ Limpeza completa');

      // Show cache stats
      console.log('\n📊 Estatísticas do cache:');
      const allKeys = await cache.getKeys();
      console.log(`Total de chaves no Redis: ${allKeys.length}`);
      
      if (allKeys.length > 0) {
        console.log('Chaves encontradas:');
        allKeys.slice(0, 10).forEach(key => console.log(`  🔑 ${key}`));
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await cache.disconnect();
    console.log('👋 Desconectado do Redis');
  }

  console.log('\n✅ Teste completo!');
}

testRedisDirectConnection();
