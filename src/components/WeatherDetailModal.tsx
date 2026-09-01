import React from 'react';
import { DailyForecast } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcons';
import { WeatherCharts } from './WeatherCharts';
import { X, Droplets, Sunrise, Sunset } from 'lucide-react';

interface WeatherDetailModalProps {
  day: DailyForecast | null;
  onClose: () => void;
}

export const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  day,
  onClose,
}) => {
  if (!day) return null;

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Faible', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (uv <= 5) return { text: 'Modéré', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (uv <= 7) return { text: 'Élevé', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    return { text: 'Très élevé', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const uvBadge = getUvLevel(day.uvIndexMax);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-900/95 border border-slate-700/60 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-200 backdrop-blur-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          aria-label="Fermer la boîte de dialogue"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-inner">
            <WeatherIcon code={day.weatherCode} className="w-12 h-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                {day.dayName}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Paris
              </span>
            </div>
            <p className="text-sm text-slate-400">{day.formattedDate}</p>
            <p className="text-sm font-medium text-sky-300 mt-0.5">
              {day.weatherDescription}
            </p>
          </div>
        </div>

        {/* 3 Periods Breakdown: Matin / Après-midi / Soirée */}
        <div className="my-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Découpage de la journée
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Matin */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-300 mb-1">Matin</span>
              <span className="text-[10px] text-slate-500 font-mono mb-2">9h00</span>
              <WeatherIcon code={day.morning.weatherCode} className="w-8 h-8 mb-1.5" />
              <span className="text-lg font-bold text-white font-mono">{day.morning.temp}°C</span>
              {day.morning.precipitationProbability > 0 && (
                <span className="text-[10px] text-sky-400 flex items-center gap-0.5 mt-1">
                  <Droplets className="w-2.5 h-2.5" />
                  {day.morning.precipitationProbability}%
                </span>
              )}
            </div>

            {/* Après-midi */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-300 mb-1">Après-midi</span>
              <span className="text-[10px] text-slate-500 font-mono mb-2">15h00</span>
              <WeatherIcon code={day.afternoon.weatherCode} className="w-8 h-8 mb-1.5" />
              <span className="text-lg font-bold text-white font-mono">{day.afternoon.temp}°C</span>
              {day.afternoon.precipitationProbability > 0 && (
                <span className="text-[10px] text-sky-400 flex items-center gap-0.5 mt-1">
                  <Droplets className="w-2.5 h-2.5" />
                  {day.afternoon.precipitationProbability}%
                </span>
              )}
            </div>

            {/* Soirée */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-300 mb-1">Soirée</span>
              <span className="text-[10px] text-slate-500 font-mono mb-2">21h00</span>
              <WeatherIcon code={day.evening.weatherCode} className="w-8 h-8 mb-1.5" isNight />
              <span className="text-lg font-bold text-white font-mono">{day.evening.temp}°C</span>
              {day.evening.precipitationProbability > 0 && (
                <span className="text-[10px] text-sky-400 flex items-center gap-0.5 mt-1">
                  <Droplets className="w-2.5 h-2.5" />
                  {day.evening.precipitationProbability}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Apple-Style Hourly Charts (Pluie + Température) */}
        <div className="my-5">
          <WeatherCharts hourly={day.hourly} />
        </div>

        {/* Detailed Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono my-5">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/70">
            <span className="text-slate-500 block">Max / Min</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {day.tempMax}° / {day.tempMin}°
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/70">
            <span className="text-slate-500 block">Vent max</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {day.windSpeedMax} km/h
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/70">
            <span className="text-slate-500 block">Humidité</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {day.humidityMean}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/70">
            <span className="text-slate-500 block">Indice UV</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {day.uvIndexMax} ({uvBadge.text})
            </span>
          </div>
        </div>

        {/* Sun times */}
        {(day.sunrise || day.sunset) && (
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
            {day.sunrise && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/50">
                <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block">Lever du soleil</span>
                  <span className="font-mono text-slate-200 font-medium">{day.sunrise}</span>
                </div>
              </div>
            )}
            {day.sunset && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/50">
                <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block">Coucher du soleil</span>
                  <span className="font-mono text-slate-200 font-medium">{day.sunset}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
