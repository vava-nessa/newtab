import { useQuery } from '@tanstack/react-query';
import { fetchParis15DayWeather, WeatherData } from '../services/weatherApi';

export function useWeather() {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather', 'paris', '15days'],
    queryFn: fetchParis15DayWeather,
    staleTime: 1000 * 60 * 15, // 15 minutes fresh
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 mins
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
