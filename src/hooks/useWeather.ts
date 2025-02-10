import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Location, TemperatureUnit } from '../types/weather';
import { fetchWeather, reverseGeocode } from '../utils/weatherApi';

export const useWeather = () => {
  const [location, setLocation] = useState<Location>({ lat: 6.4541, lon: 3.3947 });
  const [locationAddress, setLocationAddress] = useState<string>("Lagos, Nigeria");
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>("C");

  const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32;
  };

  const formatTemperature = (celsius: number): number => {
    return tempUnit === "C" ? celsius : celsiusToFahrenheit(celsius);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });

          try {
            const address = await reverseGeocode(latitude, longitude);
            setLocationAddress(address);
          } catch (error) {
            console.error("Error getting address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const { data: weatherData, isLoading, isRefetching } = useQuery({
    queryKey: ["weather", location.lat, location.lon],
    queryFn: () => fetchWeather(location.lat, location.lon),
    refetchInterval: 300000,
    enabled: location.lat !== 0 && location.lon !== 0,
  });

  return {
    weatherData,
    isLoading,
    isRefetching,
    location,
    setLocation,
    locationAddress,
    setLocationAddress,
    tempUnit,
    setTempUnit,
    formatTemperature
  };
}; 