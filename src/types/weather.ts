import { DateTime } from 'luxon';

export interface WeatherData {
  current: {
    time: DateTime;
    temperature2m: number;
    relativeHumidity2m: number;
    rain: number;
    weatherCode: number;
    windSpeed10m: number;
  };
  hourly: {
    time: DateTime[];
    temperature2m: Float32Array;
    dewPoint2m: Float32Array;
    weatherCode: Float32Array;
  };
  daily: {
    weatherCode: Float32Array;
    time: Date[];
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
    sunrise: bigint;
    sunset: bigint;
    rainSum: Float32Array;
  };
  timezone: string;
}

export interface Location {
  lat: number;
  lon: number;
}

export type TemperatureUnit = "C" | "F"; 