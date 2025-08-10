# Guia de Integração com Claude Desktop

## 🎯 Status da Aplicação

✅ **Build local funcionando**  
✅ **Servidor MCP operacional**  
✅ **4 tools registradas com sucesso**  
✅ **Conexões Redis e PostgreSQL OK**  

## 📋 Pré-requisitos

1. **Docker containers rodando:**
   ```bash
   docker-compose up -d
   ```

2. **Build da aplicação atualizado:**
   ```bash
   npm run clean
   npm run build
   ```

## 🔧 Configuração do Claude Desktop

### Passo 1: Localizar arquivo de configuração

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Passo 2: Adicionar configuração MCP

Copie o conteúdo do arquivo `claude_desktop_config.json` do projeto para sua configuração do Claude Desktop:

```json
{
  "mcpServers": {
    "weather-mcp": {
      "command": "node",
      "args": ["C:\\Users\\glauc\\OneDrive\\Documents\\Labs\\weather-mcp-server\\dist\\mcp-entry.js"],
      "env": {
        "NODE_ENV": "development",
        "MCP_MODE": "true",
        "REDIS_URL": "redis://localhost:6379",
        "DATABASE_URL": "postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp",
        "WEATHER_API_KEY": "your_openweathermap_api_key_here"
      }
    }
  }
}
```

**⚠️ Importante:** Ajuste o caminho absoluto para o seu diretório local!

### Passo 3: Reiniciar Claude Desktop

1. Feche completamente o Claude Desktop
2. Abra novamente
3. Aguarde o carregamento dos MCP servers

## 🧪 Testando a Integração

### Tools Disponíveis

1. **get_current_weather** - Clima atual de uma cidade
2. **get_weather_forecast** - Previsão do tempo
3. **get_cache_statistics** - Estatísticas do Redis
4. **get_weather_history** - Histórico de consultas

### Comandos de Teste

```
Por favor, me dê o clima atual em São Paulo
```

```
Qual a previsão do tempo para Rio de Janeiro?
```

```
Mostre as estatísticas do cache
```

```
Histórico do tempo consultado recentemente
```

## 🔍 Troubleshooting

### Se o MCP não carregar:

1. **Verificar containers:**
   ```bash
   docker-compose ps
   ```

2. **Verificar build:**
   ```bash
   npm run build
   ```

3. **Testar manualmente:**
   ```bash
   npm run test:manual
   ```

4. **Testar MCP entry:**
   ```bash
   $env:MCP_MODE="true"
   node dist/mcp-entry.js
   ```

### Logs de Debug

O servidor está configurado para logar no stderr (compatível com MCP):
- `[DEBUG]` - Informações de depuração
- `[INFO]` - Conexões e status
- `[ERROR]` - Problemas e falhas

## ✅ Verificações de Funcionamento

- [x] Compilação TypeScript limpa
- [x] Conexão Redis estabelecida
- [x] Conexão PostgreSQL estabelecida  
- [x] 4 tools MCP registradas
- [x] Servidor MCP iniciado com sucesso
- [x] Comunicação via stdio funcionando

---

**Status:** ✅ **Pronto para integração com Claude Desktop**

O projeto Weather MCP Server está completamente funcional e pronto para uso com Claude Desktop. A limpeza da arquitetura foi bem-sucedida e todas as funcionalidades foram preservadas!
