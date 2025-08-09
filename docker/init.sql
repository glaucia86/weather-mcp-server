-- Criar tabela de histórico de clima
CREATE TABLE IF NOT EXISTS weather_history (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    temperature DECIMAL(5,2),
    feels_like DECIMAL(5,2),
    humidity INTEGER,
    pressure INTEGER,
    wind_speed DECIMAL(5,2),
    description TEXT,
    icon VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB
);

-- Criar índices
CREATE INDEX idx_weather_city ON weather_history(city);
CREATE INDEX idx_weather_timestamp ON weather_history(timestamp);

-- Criar tabela de cache
CREATE TABLE IF NOT EXISTS api_cache (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB,
    expires_at TIMESTAMP
);