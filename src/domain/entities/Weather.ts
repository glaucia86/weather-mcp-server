// Domain entities
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  city: string;
  country: string;
  forecasts: any[];
}

export interface WeatherHistoryRecord {
  id?: number;
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
  timestamp?: Date;
  raw_data?: any;
}
