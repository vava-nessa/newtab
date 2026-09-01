export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  time: string;
}

export interface PeriodForecast {
  name: string;
  hourLabel: string;
  temp: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationProbability: number;
}

export interface HourlyPoint {
  time: string;
  hour: number;
  hourLabel: string;
  temp: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  humidityMean: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  morning: PeriodForecast;
  afternoon: PeriodForecast;
  evening: PeriodForecast;
  hourly: HourlyPoint[];
}

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  lastUpdated: string;
}

export const WMO_WEATHER_MAP_FR: Record<number, { label: string; iconKey: string }> = {
  0: { label: 'Ciel dégagé', iconKey: 'clear' },
  1: { label: 'Généralement dégagé', iconKey: 'mainly-clear' },
  2: { label: 'Partiellement nuageux', iconKey: 'partly-cloudy' },
  3: { label: 'Couvert', iconKey: 'overcast' },
  45: { label: 'Brouillard', iconKey: 'fog' },
  48: { label: 'Brouillard givrant', iconKey: 'fog' },
  51: { label: 'Bruine légère', iconKey: 'drizzle' },
  53: { label: 'Bruine modérée', iconKey: 'drizzle' },
  55: { label: 'Bruine dense', iconKey: 'drizzle' },
  56: { label: 'Bruine verglaçante légère', iconKey: 'freezing-drizzle' },
  57: { label: 'Bruine verglaçante dense', iconKey: 'freezing-drizzle' },
  61: { label: 'Pluie faible', iconKey: 'rain' },
  63: { label: 'Pluie modérée', iconKey: 'rain' },
  65: { label: 'Forte pluie', iconKey: 'heavy-rain' },
  66: { label: 'Pluie verglaçante légère', iconKey: 'freezing-rain' },
  67: { label: 'Pluie verglaçante dense', iconKey: 'freezing-rain' },
  71: { label: 'Chute de neige légère', iconKey: 'snow' },
  73: { label: 'Chute de neige modérée', iconKey: 'snow' },
  75: { label: 'Forte chute de neige', iconKey: 'snow' },
  77: { label: 'Grains de neige', iconKey: 'snow' },
  80: { label: 'Averses faibles', iconKey: 'showers' },
  81: { label: 'Averses modérées', iconKey: 'showers' },
  82: { label: 'Averses violentes', iconKey: 'showers' },
  85: { label: 'Averses de neige légères', iconKey: 'snow' },
  86: { label: 'Averses de neige fortes', iconKey: 'snow' },
  95: { label: 'Orage', iconKey: 'thunderstorm' },
  96: { label: 'Orage avec grêle légère', iconKey: 'thunderstorm' },
  99: { label: 'Orage violent avec grêle', iconKey: 'thunderstorm' },
};

export function getWeatherDescription(code: number): string {
  return WMO_WEATHER_MAP_FR[code]?.label || 'Non déterminé';
}

export interface TempStyle {
  textClass: string;
  color: string;
  isHot: boolean; // > 26°C
  isCold: boolean; // < 5°C
}

export function getTempStyle(temp: number): TempStyle {
  if (temp < 5) {
    // Froid glacial (< 5°) : Bleu cyan très clair / givre
    return {
      textClass: 'text-cyan-200 font-extrabold drop-shadow-[0_0_10px_rgba(165,243,252,0.9)]',
      color: '#a5f3fc',
      isHot: false,
      isCold: true,
    };
  }
  if (temp <= 9) {
    // Froid modéré (5-9°) : Bleu ciel clair
    return {
      textClass: 'text-sky-300 font-bold',
      color: '#7dd3fc',
      isHot: false,
      isCold: false,
    };
  }
  if (temp <= 14) {
    // Frais (10-14°) : Bleu roi plus foncé
    return {
      textClass: 'text-blue-400 font-bold',
      color: '#60a5fa',
      isHot: false,
      isCold: false,
    };
  }
  if (temp <= 20) {
    // Tempéré / Doux (15-20°) : Vert menthe
    return {
      textClass: 'text-emerald-400 font-bold',
      color: '#34d399',
      isHot: false,
      isCold: false,
    };
  }
  if (temp <= 26) {
    // Tempéré chaud (21-26°) : Vert riche éclatant
    return {
      textClass: 'text-green-400 font-bold',
      color: '#4ade80',
      isHot: false,
      isCold: false,
    };
  }
  // Très chaud (> 26°C) : Rouge vif flamboyant avec effet flammes
  return {
    textClass: 'text-red-500 font-black drop-shadow-[0_0_14px_rgba(239,68,68,0.95)]',
    color: '#ef4444',
    isHot: true,
    isCold: false,
  };
}

const PARIS_COORDINATES = {
  latitude: 48.8566,
  longitude: 2.3522,
};

export async function fetchParis15DayWeather(): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', PARIS_COORDINATES.latitude.toString());
  url.searchParams.set('longitude', PARIS_COORDINATES.longitude.toString());
  url.searchParams.set(
    'hourly',
    'temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean,uv_index_max,sunrise,sunset'
  );
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation'
  );
  url.searchParams.set('timezone', 'Europe/Paris');
  url.searchParams.set('forecast_days', '15');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Échec de récupération de la météo: ${response.statusText}`);
  }

  const data = await response.json();

  const hourlyTimes: string[] = data.hourly?.time || [];
  const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
  const hourlyRainProbs: number[] = data.hourly?.precipitation_probability || [];
  const hourlyPrecip: number[] = data.hourly?.precipitation || [];
  const hourlyCodes: number[] = data.hourly?.weather_code || [];
  const hourlyWinds: number[] = data.hourly?.wind_speed_10m || [];
  const hourlyHumidities: number[] = data.hourly?.relative_humidity_2m || [];

  const daily: DailyForecast[] = (data.daily.time || []).map((dateStr: string, index: number) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const isToday =
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
      dateObj.getFullYear() === tomorrow.getFullYear() &&
      dateObj.getMonth() === tomorrow.getMonth() &&
      dateObj.getDate() === tomorrow.getDate();

    let dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
    dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    if (isToday) dayName = "Aujourd'hui";
    else if (isTomorrow) dayName = 'Demain';

    const formattedDate = dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });

    const code = data.daily.weather_code[index] ?? 0;

    const startIndex = index * 24;
    const hourly: HourlyPoint[] = [];

    for (let h = 0; h < 24; h++) {
      const idx = startIndex + h;
      const t = hourlyTimes[idx] || `${dateStr}T${String(h).padStart(2, '0')}:00`;
      hourly.push({
        time: t,
        hour: h,
        hourLabel: `${String(h).padStart(2, '0')}h`,
        temp: Math.round(hourlyTemps[idx] ?? 0),
        precipitationProbability: hourlyRainProbs[idx] ?? 0,
        precipitation: hourlyPrecip[idx] ?? 0,
        weatherCode: hourlyCodes[idx] ?? 0,
        windSpeed: Math.round(hourlyWinds[idx] ?? 0),
        humidity: Math.round(hourlyHumidities[idx] ?? 60),
      });
    }

    const mPoint = hourly[9] || hourly[8] || hourly[0];
    const morning: PeriodForecast = {
      name: 'Matin',
      hourLabel: '9h',
      temp: mPoint.temp,
      weatherCode: mPoint.weatherCode,
      weatherDescription: getWeatherDescription(mPoint.weatherCode),
      precipitationProbability: mPoint.precipitationProbability,
    };

    const aPoint = hourly[15] || hourly[14] || hourly[12];
    const afternoon: PeriodForecast = {
      name: 'Après-midi',
      hourLabel: '15h',
      temp: aPoint.temp,
      weatherCode: aPoint.weatherCode,
      weatherDescription: getWeatherDescription(aPoint.weatherCode),
      precipitationProbability: aPoint.precipitationProbability,
    };

    const ePoint = hourly[21] || hourly[20] || hourly[18];
    const evening: PeriodForecast = {
      name: 'Soirée',
      hourLabel: '21h',
      temp: ePoint.temp,
      weatherCode: ePoint.weatherCode,
      weatherDescription: getWeatherDescription(ePoint.weatherCode),
      precipitationProbability: ePoint.precipitationProbability,
    };

    return {
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode: code,
      weatherDescription: getWeatherDescription(code),
      tempMax: Math.round(data.daily.temperature_2m_max[index] ?? 0),
      tempMin: Math.round(data.daily.temperature_2m_min[index] ?? 0),
      apparentTempMax: Math.round(data.daily.apparent_temperature_max[index] ?? 0),
      apparentTempMin: Math.round(data.daily.apparent_temperature_min[index] ?? 0),
      precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0,
      precipitationSum: data.daily.precipitation_sum[index] ?? 0,
      windSpeedMax: Math.round(data.daily.wind_speed_10m_max[index] ?? 0),
      humidityMean: Math.round(data.daily.relative_humidity_2m_mean?.[index] ?? 60),
      uvIndexMax: data.daily.uv_index_max[index] ?? 0,
      sunrise: data.daily.sunrise[index] ? data.daily.sunrise[index].split('T')[1] : '',
      sunset: data.daily.sunset[index] ? data.daily.sunset[index].split('T')[1] : '',
      morning,
      afternoon,
      evening,
      hourly,
    };
  });

  return {
    city: 'Paris',
    country: 'France',
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      temperature: Math.round(data.current.temperature_2m ?? 0),
      apparentTemperature: Math.round(data.current.apparent_temperature ?? 0),
      relativeHumidity: data.current.relative_humidity_2m ?? 0,
      weatherCode: data.current.weather_code ?? 0,
      windSpeed: Math.round(data.current.wind_speed_10m ?? 0),
      precipitation: data.current.precipitation ?? 0,
      time: data.current.time,
    },
    daily,
    lastUpdated: new Date().toISOString(),
  };
}
