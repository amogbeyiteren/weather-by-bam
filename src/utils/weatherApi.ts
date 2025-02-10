import { fetchWeatherApi } from "openmeteo";
import tzLookup from "tz-lookup";
import { DateTime } from 'luxon';
import { WeatherData } from "../types/weather";

function getTimezone(latitude: number, longitude: number): string {
  try {
    return tzLookup(latitude, longitude);
  } catch (error) {
    console.error("Failed to determine timezone:", error);
    return "UTC"; // fallback timezone
  }
}

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const fetchWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const now = new Date();
  const timezone = await getTimezone(latitude, longitude);
  const currentHour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false, // Use 24-hour format
    }).format(now)
  );


  // Target range is 6am to 5pm (12 hours inclusive)
  const startHour = 6; // 6am
  const endHour = 17; // 5pm

  let pastHours = 0;
  let forecastHours = 0;

  if (currentHour < startHour) {
    // Before 6am - need hours from current time to 5pm
    forecastHours = endHour - currentHour;
    pastHours = 0;
  } else if (currentHour > endHour) {
    // After 5pm - need hours from 6am to current time
    pastHours = currentHour - startHour;
    forecastHours = 0;
  } else {
    // Between 6am-5pm - need both past and future hours
    pastHours = currentHour - startHour;
    forecastHours = endHour - currentHour + 1; // +1 to include current hour
  }


  const params = {
    latitude: latitude,
    longitude: longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "rain",
      "weather_code",
      "wind_speed_10m",
    ],
    hourly: ["temperature_2m", "dew_point_2m", "weather_code"],
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "rain_sum",
    ],
    timezone,
    forecast_hours: forecastHours,
    past_hours: pastHours,
    models: "best_match",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;


  const hourlyTimes = range(
    Number(hourly.time()),
    Number(hourly.timeEnd()),
    hourly.interval()
  ).map((t) => DateTime.fromSeconds(t , { zone: timezone }));
  

  const targetStartIndex = hourlyTimes.findIndex((time) => {
    return time.hour === startHour;
  });

  const sliceEnd = targetStartIndex + 12; 

  return {
    current: {
      time: DateTime.fromSeconds(Number(current.time()), {
        zone: timezone,
      }),
      temperature2m: current.variables(0)!.value(),
      relativeHumidity2m: current.variables(1)!.value(),
      rain: current.variables(2)!.value(),
      weatherCode: current.variables(3)!.value(),
      windSpeed10m: current.variables(4)!.value(),
    },
    hourly: {
      time: hourlyTimes.slice(targetStartIndex, sliceEnd),
      temperature2m: hourly
        .variables(0)!
        .valuesArray()!
        .slice(targetStartIndex, sliceEnd),
      dewPoint2m: hourly
        .variables(1)!
        .valuesArray()!
        .slice(targetStartIndex, sliceEnd),
      weatherCode: hourly
        .variables(2)!
        .valuesArray()!
        .slice(targetStartIndex, sliceEnd),
    },
    daily: {
      weatherCode: daily.variables(0)!.valuesArray()!,
      time: range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2mMax: daily.variables(1)!.valuesArray()!,
      temperature2mMin: daily.variables(2)!.valuesArray()!,
      sunrise: daily.variables(3)!.valuesInt64(0)!,
      sunset: daily.variables(4)!.valuesInt64(0)!,
      rainSum: daily.variables(5)!.valuesArray()!,
    },
    timezone: timezone,
  };
};

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  const response = await fetch(
    `https://api.locationiq.com/v1/reverse?key=${
      import.meta.env.VITE_LOCATIONIQ_API_KEY
    }&lat=${latitude}&lon=${longitude}&format=json`
  );

  if (!response.ok) {
    throw new Error("Failed to reverse geocode location");
  }

  const data = await response.json();
  return data.address.name || data.address.city || data.address.state + ", " + data.address.country;
}
