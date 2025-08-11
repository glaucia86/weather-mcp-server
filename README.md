<!-- Project Quality Badges -->
![GitHub release (latest by date)](https://img.shields.io/github/v/release/glaucia86/weather-mcp-server?style=flat-square&logo=github&logoColor=white)
![GitHub issues](https://img.shields.io/github/issues/glaucia86/weather-mcp-server?style=flat-square&logo=github&logoColor=white)
![GitHub pull requests](https://img.shields.io/github/issues-pr/glaucia86/weather-mcp-server?style=flat-square&logo=github&logoColor=white)
![GitHub last commit](https://img.shields.io/github/last-commit/glaucia86/weather-mcp-server?style=flat-square&logo=github&logoColor=white)
![GitHub repo size](https://img.shields.io/github/repo-size/glaucia86/weather-mcp-server?style=flat-square&logo=github&logoColor=white)
![GitHub language count](https://img.shields.io/github/languages/count/glaucia86/weather-mcp-server?style=flat-square&logo=typescript&logoColor=white)
![GitHub top language](https://img.shields.io/github/languages/top/glaucia86/weather-mcp-server?style=flat-square&logo=typescript&logoColor=white)

# 🌤️ Weather MCP Server - Clean Architecture Edition [Docker + Redis]

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-FFA500?style=for-the-badge&logo=openweathermap&logoColor=white)
![MCP](https://img.shields.io/badge/Model_Context_Protocol-000000?style=for-the-badge&logo=protocol&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean_Architecture-00D4AA?style=for-the-badge&logo=architecture&logoColor=white)
![SOLID](https://img.shields.io/badge/SOLID_Principles-FF6B6B?style=for-the-badge&logo=solid&logoColor=white)
![DI](https://img.shields.io/badge/Dependency_Injection-45B7D1?style=for-the-badge&logo=injection&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/glaucia86/weather-mcp-server/pulls)

</div>

### **Servidor MCP de Clima com Clean Architecture para Claude Desktop - Production Ready** 
*Claude AI transformado em estação meteorológica profissional usando princípios SOLID*

<br>

**🎉 VERSÃO ATUAL: 2.0.0 - Clean Architecture Completa**
*✅ Refatoração concluída • ✅ Zero legacy code • ✅ Production ready*

### 📊 **Status do Projeto**

| **Aspecto** | **Status** | **Descrição** |
|:------------|:-----------|:--------------|
| **Build** | [![Build Status](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml/badge.svg)](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml) | TypeScript compilation + Docker build |
| **Tests** | [![Tests](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml/badge.svg?event=push&job=test)](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml) | Unit tests + Integration tests |
| **Security** | [![Security](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml/badge.svg?event=push&job=security)](https://github.com/glaucia86/weather-mcp-server/actions/workflows/deploy.yml) | Trivy vulnerability scan + npm audit |
| **Docker** | ![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker) | Multi-stage build otimizado |
| **Deploy** | ![Deployment](https://img.shields.io/badge/Deploy-Automated-green?style=flat-square&logo=github-actions) | CI/CD pipeline automatizado |

### 🔄 **CI/CD Pipeline**

Este projeto implementa um pipeline CI/CD completo com GitHub Actions:

```yaml
🔍 Lint & Type Check → 🧪 Tests → 🏗️ Build → 🔒 Security → 🐳 Docker → 🚀 Deploy
```

**Pipeline Stages:**
- **🔍 Lint & Type Check**: ESLint + TypeScript compilation check
- **🧪 Tests**: Unit tests com mocks + Integration tests com PostgreSQL/Redis
- **🏗️ Build**: TypeScript compilation + artifact generation  
- **🔒 Security**: Trivy vulnerability scanner + npm audit
- **🐳 Docker**: Multi-stage build + push to GitHub Container Registry
- **🚀 Deploy**: Automated deployment para staging/production

**Comandos de Teste Locais:**
```bash
npm run test:unit        # Tests unitários (sem dependências)
npm run test:integration # Tests de integração (requer Docker)
npm run test:ci          # Tests para CI com coverage
```

---

## 🎯 **O que é este projeto?**

O **Weather MCP Server** é um servidor **Model Context Protocol (MCP)** que expande as capacidades do Claude Desktop, permitindo que ele consulte **informações meteorológicas em tempo real** de qualquer lugar do mundo usando uma arquitetura limpa e profissional.

### 🧠 **Entendendo o MCP (Model Context Protocol)**

O **MCP** é um protocolo desenvolvido pela Anthropic que permite ao Claude AI:
- 🔌 **Conectar-se a APIs externas** e bancos de dados
- 🛠️ **Usar ferramentas personalizadas** criadas pela comunidade
- 📊 **Acessar dados em tempo real** que não estão em seu conhecimento base
- 🎮 **Executar ações específicas** através de plugins

**Em outras palavras**: O MCP transforma o Claude de uma IA com conhecimento limitado em uma IA que pode acessar **informações atualizadas do mundo real**!

### 🌟 **Funcionalidades Disponíveis**

| 🎯 **Funcionalidade** | 📋 **Descrição** | 💡 **Exemplo de Uso** |
|:--------------------:|:----------------:|:---------------------:|
| **🌡️ Clima Atual** | Consulta temperatura, umidade, pressão e condições meteorológicas atuais | *"Qual é a temperatura atual em São Paulo?"* |
| **🔮 Previsão do Tempo** | Fornece previsões detalhadas para os próximos 5 dias | *"Como estará o clima amanhã em Londres?"* |
| **📊 Histórico Meteorológico** | Mantém registro de todas as consultas realizadas | *"Mostre-me as últimas consultas de clima que fiz"* |
| **⚡ Cache Inteligente** | Sistema Redis para consultas ultrarrápidas | *95% das consultas vêm do cache* |

---

## 🚀 **Demonstração Prática**

### **Antes** (Claude Desktop sem MCP):
```
🙋 Você: "Qual é a temperatura atual em Tóquio?"
🤖 Claude: "Desculpe, não tenho acesso a dados meteorológicos em tempo real..."
```

### **Depois** (Claude Desktop com Weather MCP Server):
```
🙋 Você: "Qual é a temperatura atual em Tóquio?"
🤖 Claude: "🌤️ Em Tóquio agora:
           🌡️ Temperatura: 23°C (sensação térmica: 25°C)
           💧 Umidade: 68%
           🌬️ Vento: 12 km/h
           ☁️ Condições: Parcialmente nublado
           📊 Dados atualizados em tempo real via OpenWeatherMap"
```

---

## 🏗️ **Arquitetura Clean + SOLID**

```mermaid
graph TB
    subgraph "🎮 Presentation Layer"
        A[👤 Claude Desktop] --> B[🤖 MCP Server]
        B --> C[🎮 Weather Controller]
        B --> D[🎮 History Controller]
    end
    
    subgraph "🔧 Application Layer (Use Cases)"
        C --> E[🌤️ Get Weather Use Case]
        C --> F[🔮 Get Forecast Use Case]  
        C --> G[📊 Get Cache Stats Use Case]
        D --> H[📚 Get History Use Case]
    end
    
    subgraph "🏛️ Domain Layer"
        E --> I[⚡ Weather Entity]
        F --> I
        H --> J[📊 History Entity]
        K[🔗 Repository Interfaces]
    end
    
    subgraph "🏗️ Infrastructure Layer (Adapters)"
        E --> L[🌍 OpenWeather API Repository]
        E --> M[🗄️ PostgreSQL Repository]
        E --> N[⚡ Redis Cache Repository]
        F --> L
        F --> N
        H --> M
        L --> O[🌤️ OpenWeatherMap API]
        M --> P[🗄️ PostgreSQL Database]
        N --> Q[⚡ Redis Cache]
    end
```

### **✅ Princípios SOLID Aplicados:**

| 🔤 **Princípio** | ✅ **Como foi aplicado** | 💡 **Benefício** |
|:----------------:|:------------------------:|:----------------:|
| **S** - Single Responsibility | Cada classe tem apenas uma responsabilidade | Código mais limpo e focado |
| **O** - Open/Closed | Extensível via interfaces, fechado para modificação | Fácil adicionar novas APIs |
| **L** - Liskov Substitution | Implementações intercambiáveis via contratos | Flexibilidade total |
| **I** - Interface Segregation | Interfaces pequenas e específicas | Sem dependências desnecessárias |
| **D** - Dependency Inversion | Dependências injetadas via abstrações | Testabilidade e desacoplamento |

---

## 📋 **Pré-requisitos**

### **🔧 Software Necessário:**

| 📦 **Software** | 📏 **Versão Mínima** | 🔗 **Download** | ✅ **Verificar** |
|:---------------:|:--------------------:|:---------------:|:----------------:|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) | `node --version` |
| **Docker Desktop** | Mais recente | [docker.com](https://www.docker.com/products/docker-desktop/) | `docker --version` |
| **Claude Desktop** | Mais recente | [claude.ai/download](https://claude.ai/download) | Abrir aplicativo |
| **Git** | Qualquer | [git-scm.com](https://git-scm.com/) | `git --version` |

### **🔑 Chaves de API:**

1. **🌍 OpenWeatherMap API Key (GRATUITA)**
   - 🔗 Acesse: [openweathermap.org/api](https://openweathermap.org/api)
   - 📝 Crie uma conta gratuita
   - 🗝️ Obtenha sua API key (sem custo)
   - 💡 Permite 1.000 consultas por dia grátis

---

## 📥 **Instalação Completa**

### **🗂️ Passo 1: Baixar o Projeto**
```bash
# Clonar repositório
git clone https://github.com/glaucia86/weather-mcp-server.git

# Entrar na pasta
cd weather-mcp-server

# Verificar estrutura
ls -la
```

### **📦 Passo 2: Instalar Dependências**
```bash
# Instalar pacotes Node.js
npm install

# Verificar instalação
npm list --depth=0
```

### **⚙️ Passo 3: Configurar Ambiente**

#### **Criar arquivo `.env`:**
```bash
# Copiar exemplo
cp .env.example .env
```

#### **Configuração do `.env`:**
```env
# 🌍 API do OpenWeatherMap (OBRIGATÓRIO)
WEATHER_API_KEY=sua_api_key_aqui

# 🗄️ Banco de Dados (PostgreSQL)
DATABASE_URL=postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp

# ⚡ Cache (Redis) 
REDIS_URL=redis://localhost:6379

# 🖥️ Configurações do Servidor
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

### **🔨 Passo 4: Compilar e Iniciar**
```bash
# Compilar TypeScript
npm run build

# Iniciar infraestrutura (PostgreSQL + Redis)
npm run docker:up

# Aguardar inicialização
sleep 30

# Testar sistema
npm run test:manual
```

---

## 🎮 **Configuração do Claude Desktop**

### **📍 Localizar Arquivo de Configuração:**

| 🖥️ **Sistema** | 📂 **Caminho do Arquivo** |
|:--------------:|:-------------------------:|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

### **⚙️ Configuração:**
```json
{
  "mcpServers": {
    "weather-mcp": {
      "command": "node",
      "args": ["/caminho/completo/para/weather-mcp-server/dist/mcp-entry.js"],
      "env": {
        "WEATHER_API_KEY": "SUA_API_KEY_OPENWEATHERMAP",
        "DATABASE_URL": "postgresql://mcp_user:mcp_pass@localhost:5432/weather_mcp",
        "REDIS_URL": "redis://localhost:6379",
        "NODE_ENV": "production",
        "LOG_LEVEL": "error",
        "MCP_MODE": "true"
      }
    }
  }
}
```

### **⚠️ IMPORTANTE:**
- **Substitua** `/caminho/completo/para/` pelo seu caminho real
- **Substitua** `SUA_API_KEY_OPENWEATHERMAP` pela sua chave OpenWeatherMap
- **Feche COMPLETAMENTE** o Claude Desktop e reabra após salvar

---

## 🎪 **Como Usar**

### **1️⃣ Consultas de Clima Atual**
```
💬 "Qual é o clima atual em São Paulo?"
💬 "Como está o tempo em Londres agora?"
💬 "Temperatura atual no Rio de Janeiro"
```

### **2️⃣ Previsões do Tempo**
```
💬 "Qual será a previsão do tempo para amanhã em Paris?"
💬 "Como estará o clima nos próximos 3 dias em Tokyo?"
💬 "Previsão de 5 dias para London"
```

### **3️⃣ Histórico e Análises**
```
💬 "Me mostre o histórico de consultas meteorológicas"
💬 "Quais foram as últimas cidades que consultei?"
💬 "Histórico de clima de São Paulo dos últimos 10 registros"
```

### **4️⃣ Estatísticas do Sistema**
```
💬 "Mostre as estatísticas do cache Redis"
💬 "Qual é a performance do sistema?"
```

---

## 🛠️ **Scripts Disponíveis**

| 🎯 **Finalidade** | 💻 **Comando** | 📋 **Descrição** |
|:-----------------:|:--------------:|:----------------:|
| **Start Server** | `npm start` | Servidor principal |
| **MCP Server** | `npm run start:mcp` | Servidor MCP para Claude Desktop |
| **Build** | `npm run build` | Compila TypeScript |
| **Test MCP** | `npm run test:manual` | Testa servidor MCP |
| **Dev Mode** | `npm run dev` | Desenvolvimento com hot-reload |
| **Clean** | `npm run clean` | Remove builds anteriores |
| **Docker Up** | `npm run docker:up` | Inicia PostgreSQL + Redis |
| **Docker Down** | `npm run docker:down` | Para containers |
| **Migrate** | `npm run migrate` | Executa migrações de banco |

---

## 🏗️ **Estrutura do Projeto**

```
src/
├── 🏛️ domain/                    # Camada de Domínio (Business Rules)
│   ├── entities/                # Entidades do domínio
│   │   └── Weather.ts          # Modelos meteorológicos
│   └── repositories/           # Contratos/Interfaces
│       └── IRepositories.ts    # Interfaces dos repositórios
│
├── 🔧 application/              # Camada de Aplicação (Use Cases)
│   └── usecases/               # Casos de uso específicos
│       ├── GetCurrentWeatherUseCase.ts
│       ├── GetWeatherForecastUseCase.ts
│       ├── GetWeatherHistoryUseCase.ts
│       └── GetCacheStatisticsUseCase.ts
│
├── 🏗️ infrastructure/          # Camada de Infraestrutura (Adapters)
│   ├── logger/                 # Sistema de logging
│   │   └── Logger.ts
│   ├── repositories/           # Implementações dos repositórios
│   │   ├── PostgreSQLWeatherRepository.ts
│   │   ├── RedisCacheRepository.ts
│   │   └── OpenWeatherMapApiRepository.ts
│   └── di/                     # Dependency Injection
│       └── DIContainer.ts
│
├── 🎮 presentation/             # Camada de Apresentação
│   ├── controllers/            # Controllers
│   │   ├── WeatherController.ts
│   │   └── HistoryController.ts
│   └── servers/               # Servidores
│       └── WeatherMCPServer.ts
│
├── 🛡️ middleware/              # Middleware de Segurança
│   └── security.ts
│
├── 📊 monitoring/              # Monitoramento
│   └── health.ts
│
├── 🧪 scripts/                 # Scripts Utilitários (3 essenciais)
│   ├── benchmark-cache.ts     # Benchmark de performance
│   ├── migrate.ts            # Migração de banco
│   └── test-mcp-server.ts    # Teste do servidor MCP
│
├── index.ts                   # Entry point principal
└── mcp-entry.ts              # Entry point MCP
```

---

## ⚡ **Performance e Cache**

### **📈 Métricas de Performance Reais:**

| 📊 **Métrica** | ⚡ **Com Cache** | 🐌 **Sem Cache** | 🎯 **Melhoria** |
|:--------------:|:---------------:|:----------------:|:---------------:|
| **Resposta API** | 23ms | 315ms | **13.6x mais rápido** |
| **Taxa de Acerto** | 95% | 0% | **Economia massiva** |
| **Chamadas API** | 5 (em 50 requests) | 50 | **90% menos** |

### **🔍 Verificar Cache:**
```bash
# Ver todas as chaves do cache
docker exec weather-cache redis-cli keys "*"

# Estatísticas do Redis
docker exec weather-cache redis-cli info stats

# Ver TTL de uma chave
docker exec weather-cache redis-cli ttl "weather:sao paulo"
```

---

## 🚨 **Solução de Problemas**

### **❌ "Cannot find module"**
```bash
# Limpeza completa
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

### **❌ "Connection refused" (PostgreSQL)**
```bash
# Verificar containers
docker ps

# Reiniciar infrastructure
npm run docker:down
npm run docker:up

# Aguardar inicialização
sleep 30
```

### **❌ MCP não conecta no Claude Desktop**
1. ✅ Verifique se o caminho no `claude_desktop_config.json` está correto
2. 📂 Confirme se `dist/mcp-entry.js` existe (`npm run build`)
3. 🔄 Feche **completamente** o Claude Desktop e reabra
4. 🧪 Teste manual: `node dist/mcp-entry.js`

---

## 📊 **Status Atual - Agosto 2025**

### ✅ **Clean Architecture 100% Implementada:**

- **Arquitetura Completa**: `domain/`, `application/`, `infrastructure/`, `presentation/`
- **Dependency Injection**: Container DI funcionando perfeitamente
- **Princípios SOLID**: Aplicados rigorosamente
- **4 MCP Tools**: Registradas e funcionando no Claude Desktop
- **Database + Cache**: PostgreSQL + Redis operacionais
- **Zero Legacy Code**: Arquivos desnecessários removidos

### 🎯 **MCP Tools Funcionais:**
| 🔧 **Tool** | 📋 **Função** | ✅ **Status** |
|:-----------:|:-------------:|:-------------:|
| `get_current_weather` | Clima atual de qualquer cidade | ✅ Funcionando |
| `get_weather_forecast` | Previsão 5 dias | ✅ Funcionando |
| `get_weather_history` | Histórico de consultas | ✅ Funcionando |
| `get_cache_statistics` | Estatísticas do sistema | ✅ Funcionando |

---

## 🤝 **Contribuindo**

1. 🍴 **Fork** este repositório
2. 🌿 Crie uma **branch** (`git checkout -b feature/MinhaFeature`)
3. 💻 **Desenvolva** sua funcionalidade
4. ✅ **Teste** completamente
5. 📝 **Commit** (`git commit -m 'Adiciona MinhaFeature'`)
6. 📤 **Push** (`git push origin feature/MinhaFeature`)
7. 🔄 Abra um **Pull Request**

---

## 📄 **Licença**

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👩‍💻 **Autora**

<div align="center">

### **Glaucia Lemos**
*Software AI Engineer | ex-Microsoft*

[![GitHub](https://img.shields.io/badge/GitHub-glaucia86-181717?style=for-the-badge&logo=github)](https://github.com/glaucia86)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-glaucia--lemos-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/glaucialemos/)
[![Twitter](https://img.shields.io/badge/Twitter-@glaucia_lemos86-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/glaucia_lemos86)
[![YouTube](https://img.shields.io/badge/YouTube-@GlauciaLemos-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/@GlauciaLemos)

---

### **⭐ Gostou do projeto? Deixe uma estrela! ⭐**

**Feito com ❤️ e ☕ por [Glaucia Lemos](https://github.com/glaucia86)**

*Transformando dados meteorológicos em conversas inteligentes* 🌤️🤖

</div>
