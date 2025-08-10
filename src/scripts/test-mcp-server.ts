import { spawn } from 'child_process';

async function testMCPServer() {
  console.log('Testando MCP Server localmente...\n');

  // Definir variáveis de ambiente
  const env = {
    ...process.env,
    WEATHER_API_KEY: "57e0b31962ae34800b8c4142095d57fa",
    DATABASE_URL: "postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp",
    REDIS_URL: "redis://localhost:6379",
    NODE_ENV: "production",
    LOG_LEVEL: "info",
    MCP_DEBUG: "true"
  };

  console.log('Iniciando servidor MCP...');
  const child = spawn('node', ['dist/mcp-entry.js'], { 
    env,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.log('Debug:', data.toString().trim());
  });

  // Enviar mensagem de teste para listar ferramentas
  setTimeout(() => {
    console.log('\nEnviando request para listar tools...');
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };
    
    child.stdin.write(JSON.stringify(request) + '\n');
  }, 2000);

  // Aguardar resposta
  setTimeout(() => {
    console.log('\n Resposta do servidor:');
    if (output.trim()) {
      try {
        const response = JSON.parse(output.trim());
        console.log('Tools encontradas:', response.result?.tools?.length || 0);
        response.result?.tools?.forEach((tool: any) => {
          console.log(`  ${tool.name}: ${tool.description}`);
        });
      } catch (e) {
        console.log('Raw output:', output);
      }
    }
    
    if (errorOutput.trim()) {
      console.log('\n🐛 Debug output:');
      console.log(errorOutput);
    }
    
    child.kill('SIGTERM');
    console.log('\n✅ Teste concluído!');
  }, 5000);

  child.on('close', (code) => {
    console.log(`\n👋 Processo finalizado com código: ${code}`);
  });
}

testMCPServer().catch(console.error);
