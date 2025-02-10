import { DateTime } from "luxon";
import { assetIcons } from "../assets";

export const weatherCodeToIcon = (weatherCode: number) => {
  if (weatherCode === 0) return assetIcons.sunSmall;
  if ([1, 2].includes(weatherCode)) return assetIcons.sunCloudSmall;
  if ([3, 4, 61, 80].includes(weatherCode)) return assetIcons.cloudSmall;
  if ([63, 65, 81, 82].includes(weatherCode)) return assetIcons.rain;
  return assetIcons.sunCloudSmall;
};


export const weatherCodeToBigIcon = (weatherCode: number) => {
  if (weatherCode === 0) return assetIcons.sunBig;
  if ([1, 2].includes(weatherCode)) return assetIcons.sunCloudBig;
  if ([3, 4, 61, 80].includes(weatherCode)) return assetIcons.sunRainBig;
  if ([ 63, 65, 80, 81, 82].includes(weatherCode)) return assetIcons.rainyStormBig;
  return assetIcons.sunCloudBig;
};


export const weatherCodeToWeather = (weatherCode: number) => {
  if (weatherCode === 0) return 'Clear';
  if (weatherCode === 1) return 'Mainly Clear';
  if (weatherCode === 2) return 'Partly Cloudy';
  if ([3, 4].includes(weatherCode)) return 'Very Cloudy';
  if (weatherCode === 80) return 'Slight Rain Showers';
  if (weatherCode === 81) return 'Moderate Rain Showers';
  if (weatherCode === 82) return 'Heavy Rain Showers';
  return 'Weather';
};

export const formatTime24 = (timestamp: bigint, timezone: string) => {
  const date = DateTime.fromSeconds(Number(timestamp), { zone: timezone });
  const hours = date.hour;
  const minutes = date.minute.toString().padStart(2, "0");
  return { hours, minutes };


}; 