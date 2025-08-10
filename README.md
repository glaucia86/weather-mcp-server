# 🌤️ Weather MCP Server

Um servidor MCP (Model Context Protocol) robusto desenvolvido em TypeScript que fornece informações meteorológicas para o Claude Desktop.

## 📋 O que é este projeto?

Este projeto é um **servidor MCP (Model Context Protocol)** que permite ao Claude Desktop consultar informações meteorológicas em tempo real. O MCP é um protocolo que permite ao Claude AI acessar dados externos através de ferramentas personalizadas.

### 🎯 O que o projeto faz:
- **Consulta clima atual**: Obter temperatura, umidade, condições meteorológicas de qualquer cidade
- **Previsão do tempo**: Consultar a previsão meteorológica para os próximos dias
- **Histórico meteorológico**: Acessar dados históricos de consultas anteriores
- **Cache inteligente**: Armazena dados no Redis para consultas mais rápidas
- **Banco de dados**: Mantém histórico das consultas no PostgreSQL

### 🏗️ Arquitetura do Sistema
- **Linguagem**: TypeScript (JavaScript tipado)
- **Protocolo**: MCP (Model Context Protocol) para comunicação com Claude Desktop
- **API Externa**: OpenWeatherMap para dados meteorológicos
- **Cache**: Redis para performance
- **Banco de Dados**: PostgreSQL para persistência
- **Containerização**: Docker para facilitar a execução

## 🚀 Pré-requisitos

Antes de começar, você precisa ter instalado em seu computador:

### Softwares Necessários:
1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Escolha a versão LTS (recomendada)

2. **Docker Desktop** 
   - Download: https://www.docker.com/products/docker-desktop/
   - Necessário para executar PostgreSQL e Redis

3. **Claude Desktop**
   - Download: https://claude.ai/download
   - Aplicativo oficial da Anthropic

4. **Git** (opcional, mas recomendado)
   - Download: https://git-scm.com/

### Chaves de API:
1. **OpenWeatherMap API Key**
   - Acesse: https://openweathermap.org/api
   - Crie uma conta gratuita
   - Obtenha sua API key gratuita

## 📥 Instalação Passo a Passo

### Passo 1: Baixar o projeto
```bash
git clone https://github.com/glaucia86/weather-mcp-server.git
cd weather-mcp-server
```

### Passo 2: Instalar dependências
```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente
1. Crie um arquivo `.env` na raiz do projeto
2. Adicione suas configurações:

```env
# API do OpenWeatherMap
OPENWEATHER_API_KEY=sua_api_key_aqui

# Configurações do Banco de Dados
DATABASE_URL=postgresql://weather_user:weather_pass@localhost:5432/weather_db

# Configurações do Redis
REDIS_URL=redis://localhost:6379

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Debug do MCP (opcional)
MCP_DEBUG=false
```

### Passo 4: Compilar o TypeScript
```bash
npm run build
```

### Passo 5: Iniciar os serviços (PostgreSQL e Redis)
```bash
docker-compose up -d
```

### Passo 6: Configurar o Claude Desktop

1. **Localize o arquivo de configuração do Claude Desktop:**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Adicione a configuração do servidor MCP:** [for Windows-user]

```json
{
  "mcpServers": {
    "weather-mcp": {
      "command": "node",
      "args": ["C:/Users/seu-caminho-aqui/weather-mcp-server/dist/mcp-entry.js"],
      "env": {
        "WEATHER_API_KEY": "sua-open-weather-api-aqui",
        "DATABASE_URL": "postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp",
        "REDIS_URL": "redis://localhost:6379",
        "NODE_ENV": "production",
        "LOG_LEVEL": "error",
        "MCP_DEBUG": "false"
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Substitua `C:\\caminho\\para\\seu\\projeto` pelo caminho real onde você baixou o projeto!

## 🎮 Como Usar

### 1. Iniciar os serviços
```bash
# Iniciar PostgreSQL e Redis
docker-compose up -d

# Verificar se os serviços estão funcionando
docker ps
```

### 2. Testar o servidor MCP
```bash
# Testar a funcionalidade
npm run test:mcp
```

### 3. Usar no Claude Desktop

1. **Abra o Claude Desktop**
2. **Verifique se o servidor está conectado** (você deve ver uma confirmação no início)
3. **Faça perguntas sobre o clima:**

#### Exemplos de perguntas que você pode fazer:

```
🌡️ Clima atual:
"Qual é o clima atual em São Paulo?"
"Como está o tempo em Londres agora?"
"Temperatura atual no Rio de Janeiro"

🔮 Previsão:
"Qual será a previsão do tempo para amanhã em Paris?"
"Como estará o clima nos próximos 3 dias em Tokyo?"

📊 Histórico:
"Me mostre o histórico de consultas meteorológicas"
"Quais foram as últimas consultas de clima que fiz?"
```

## 🛠️ Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Build | `npm run build` | Compila TypeScript para JavaScript |
| Start | `npm start` | Inicia o servidor principal |
| Test MCP | `npm run test:mcp` | Testa o servidor MCP |
| Start MCP | `npm run start:mcp` | Inicia servidor MCP standalone |
| Build MCP | `npm run build:mcp` | Compila especificamente para MCP |
| Dev | `npm run dev` | Modo desenvolvimento com auto-reload |

## 🔧 Estrutura do Projeto

```
weather-mcp-server/
├── 📁 src/                          # Código fonte
│   ├── 📄 index.ts                  # Entrada principal da aplicação
│   ├── 📄 mcp-entry.ts             # Entrada específica para MCP
│   ├── 📄 server.ts                # Classe principal do servidor
│   ├── 📁 services/                # Serviços (API, banco, etc)
│   ├── 📁 tools/                   # Ferramentas MCP (clima, histórico)
│   ├── 📁 models/                  # Modelos de dados
│   └── 📁 utils/                   # Utilitários
├── 📁 docker/                      # Configurações Docker
├── 📁 build/                       # Código compilado (JavaScript)
├── 📄 package.json                 # Dependências e scripts
├── 📄 tsconfig.json               # Configuração TypeScript
├── 📄 docker-compose.yaml         # Orquestração dos containers
└── 📄 .env                        # Variáveis de ambiente (você cria)
```

## 🗃️ Banco de Dados

O projeto usa **PostgreSQL** para armazenar:
- Histórico de consultas meteorológicas
- Cache de dados para melhor performance
- Logs de sistema

### Tabelas principais:
- `weather_queries`: Histórico de consultas
- `weather_cache`: Cache de respostas da API

## ⚡ Cache com Redis

O **Redis** é usado para:
- Cache de respostas da API OpenWeatherMap
- Redução de chamadas desnecessárias à API
- Melhoria significativa na velocidade de resposta

## 🚨 Solução de Problemas Comuns

### ❌ Erro: "Cannot find module"
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Erro: "Connection refused" (PostgreSQL/Redis)
```bash
# Verificar se os containers estão rodando
docker ps

# Reiniciar containers
docker-compose down
docker-compose up -d
```

### ❌ Erro: "Invalid API key" (OpenWeatherMap)
1. Verifique se a API key está correta no arquivo `.env`
2. Confirme se a chave está ativa no OpenWeatherMap
3. Aguarde alguns minutos após criar a chave (pode demorar para ativar)

### ❌ Claude Desktop não conecta
1. Verifique se o caminho no `claude_desktop_config.json` está correto
2. Confirme se o arquivo `build/mcp-entry.js` existe
3. Feche completamente o Claude Desktop e abra novamente
4. Verifique se não há saídas de console contaminando o JSON

## 📚 Tecnologias Utilizadas

- **TypeScript**: JavaScript com tipagem estática
- **Node.js**: Runtime JavaScript
- **MCP SDK**: Kit de desenvolvimento para Model Context Protocol
- **OpenWeatherMap API**: Dados meteorológicos em tempo real
- **PostgreSQL**: Banco de dados relacional
- **Redis**: Banco de dados em memória para cache
- **Docker**: Containerização
- **Winston**: Sistema de logs

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👩‍💻 Autora

**Glaucia Lemos** 
- GitHub: [@glaucia86](https://github.com/glaucia86)
- LinkedIn: [glaucia-lemos](https://linkedin.com/in/glaucia-lemos)
- Twitter: [@glaucia_lemos86](https://twitter.com/glaucia_lemos86)

## 🆘 Precisa de Ajuda?

Se você encontrar problemas ou tiver dúvidas:

1. **Verifique a seção "Solução de Problemas"** acima
2. **Abra uma issue** no GitHub com detalhes do problema
3. **Inclua sempre**:
   - Sistema operacional
   - Versão do Node.js (`node --version`)
   - Mensagem de erro completa
   - Passos que levaram ao erro

---

⭐ **Se este projeto te ajudou, não esqueça de dar uma estrela no GitHub!** ⭐