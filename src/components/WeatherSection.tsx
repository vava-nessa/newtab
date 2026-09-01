import React, { useRef } from 'react';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcon } from './WeatherIcons';
import { ColumnDayCharts } from './ColumnDayCharts';
import { getTempStyle } from '../services/weatherApi';
import { Droplets, Wind, AlertCircle, RefreshCw, Flame, Snowflake, Sunrise, Sunset } from 'lucide-react';

export const WeatherSection: React.FC = () => {
  const { data: weather, isLoading, isError, refetch } = useWeather();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="w-full my-6 border-y border-slate-800 bg-slate-950/40 py-8 px-6">
        <div className="flex divide-x divide-slate-800 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[320px] h-96 p-6 animate-pulse bg-slate-900/20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="w-full max-w-md mx-auto my-6 px-4">
        <div className="rounded-2xl p-5 border border-red-900/30 bg-slate-900/80 text-center backdrop-blur-xl">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-200">
            Impossible de charger la météo de Paris
          </h4>
          <button
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4 select-none">
      {/* Continuous Brutalist Weather Strip */}
      <div className="w-full border-y border-slate-800/90 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
        <div
          ref={scrollContainerRef}
          className="flex divide-x divide-slate-800/90 overflow-x-auto custom-scrollbar scroll-smooth"
        >
          {weather.daily.map((day, idx) => {
            const isToday = idx === 0;
            const maxTempStyle = getTempStyle(day.tempMax);
            const minTempStyle = getTempStyle(day.tempMin);

            return (
              <div
                key={day.date}
                className={`flex-shrink-0 w-[310px] sm:w-[340px] p-5 sm:p-6 flex flex-col justify-between transition-colors duration-150 relative ${
                  isToday ? 'bg-slate-900/75' : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Top indicator for Today */}
                {isToday && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-sky-400 opacity-90" />
                )}

                {/* 1. Day Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
                  <div>
                    <span
                      className={`text-lg sm:text-xl font-extrabold block tracking-tight font-display ${
                        isToday ? 'text-sky-300' : 'text-white'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium block mt-0.5">
                      {day.formattedDate} &bull; <span className="text-slate-300">{day.weatherDescription}</span>
                    </span>
                  </div>

                  {/* Big Max/Min temperature with Fire or Frost badges */}
                  <div className="flex items-center gap-1.5">
                    {maxTempStyle.isHot && (
                      <span className="flex items-center justify-center p-1 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 animate-pulse">
                        <Flame className="w-4 h-4 text-orange-400" />
                      </span>
                    )}

                    {maxTempStyle.isCold && (
                      <span className="flex items-center justify-center p-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 animate-pulse">
                        <Snowflake className="w-4 h-4 text-cyan-300" />
                      </span>
                    )}

                    <div className="flex items-baseline gap-1 font-mono">
                      <span className={`text-2xl sm:text-3xl ${maxTempStyle.textClass}`}>
                        {day.tempMax}°
                      </span>
                      <span className="text-slate-600 text-base">/</span>
                      <span className={`text-sm font-semibold ${minTempStyle.textClass}`}>
                        {day.tempMin}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. 3 Diurnal Periods: Matin | Midi | Soir */}
                <div className="grid grid-cols-3 divide-x divide-slate-800/80 py-3.5">
                  {/* Matin */}
                  <div className="flex flex-col items-center text-center px-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Matin
                    </span>
                    <div className="my-1">
                      <WeatherIcon code={day.morning.weatherCode} className="w-9 h-9 sm:w-10 sm:h-10" />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {day.morning.temp >= 30 && <Flame className="w-2.5 h-2.5 text-orange-400" />}
                      {day.morning.temp < 5 && <Snowflake className="w-2.5 h-2.5 text-cyan-300" />}
                      <span className={`text-base font-mono ${getTempStyle(day.morning.temp).textClass}`}>
                        {day.morning.temp}°
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-[10px] font-mono">
                      {day.morning.precipitationProbability > 0 ? (
                        <span className="text-sky-400 font-semibold flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5" />
                          {day.morning.precipitationProbability}%
                        </span>
                      ) : (
                        <span className="text-slate-600">0%</span>
                      )}
                    </div>
                  </div>

                  {/* Midi */}
                  <div className="flex flex-col items-center text-center px-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Midi
                    </span>
                    <div className="my-1">
                      <WeatherIcon code={day.afternoon.weatherCode} className="w-9 h-9 sm:w-10 sm:h-10" />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {day.afternoon.temp >= 30 && <Flame className="w-2.5 h-2.5 text-orange-400" />}
                      {day.afternoon.temp < 5 && <Snowflake className="w-2.5 h-2.5 text-cyan-300" />}
                      <span className={`text-base font-mono ${getTempStyle(day.afternoon.temp).textClass}`}>
                        {day.afternoon.temp}°
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-[10px] font-mono">
                      {day.afternoon.precipitationProbability > 0 ? (
                        <span className="text-sky-400 font-semibold flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5" />
                          {day.afternoon.precipitationProbability}%
                        </span>
                      ) : (
                        <span className="text-slate-600">0%</span>
                      )}
                    </div>
                  </div>

                  {/* Soir */}
                  <div className="flex flex-col items-center text-center px-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Soir
                    </span>
                    <div className="my-1">
                      <WeatherIcon code={day.evening.weatherCode} className="w-9 h-9 sm:w-10 sm:h-10" isNight />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {day.evening.temp >= 30 && <Flame className="w-2.5 h-2.5 text-orange-400" />}
                      {day.evening.temp < 5 && <Snowflake className="w-2.5 h-2.5 text-cyan-300" />}
                      <span className={`text-base font-mono ${getTempStyle(day.evening.temp).textClass}`}>
                        {day.evening.temp}°
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-[10px] font-mono">
                      {day.evening.precipitationProbability > 0 ? (
                        <span className="text-sky-400 font-semibold flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5" />
                          {day.evening.precipitationProbability}%
                        </span>
                      ) : (
                        <span className="text-slate-600">0%</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Direct In-Column Graphs: Pluie & Température */}
                <ColumnDayCharts hourly={day.hourly} />

                {/* 4. Solar Times & Daily Metrics */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono text-slate-400">
                  {/* Sunrise & Sunset */}
                  {(day.sunrise || day.sunset) && (
                    <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                        <span>{day.sunrise || '--:--'}</span>
                      </div>
                      <div className="text-slate-600">&bull;</div>
                      <div className="flex items-center gap-1.5">
                        <Sunset className="w-3.5 h-3.5 text-orange-400" />
                        <span>{day.sunset || '--:--'}</span>
                      </div>
                    </div>
                  )}

                  {/* Humidity & Wind */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/40 border border-slate-800/50">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>{day.humidityMean}%</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/40 border border-slate-800/50">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      <span>{day.windSpeedMax} km/h</span>
                    </div>

                    <div className="px-2 py-0.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-[11px] text-slate-300">
                      <span>UV {day.uvIndexMax}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
