import React, { useState } from 'react';
import { HourlyPoint, getTempStyle } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcons';
import { Droplets, Thermometer, CloudRain, Flame, Snowflake } from 'lucide-react';

interface WeatherChartsProps {
  hourly: HourlyPoint[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourly }) => {
  const [hoveredHour, setHoveredHour] = useState<HourlyPoint | null>(null);

  if (!hourly || hourly.length === 0) return null;

  // Temperature calculations
  const temps = hourly.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 4);

  // SVG dimensions
  const width = 760;
  const rainHeight = 110;
  const tempHeight = 120;
  const paddingX = 24;
  const paddingY = 16;

  const chartWidth = width - paddingX * 2;
  const stepX = chartWidth / (hourly.length - 1);

  // Build points for temperature bezier curve
  const tempPoints = hourly.map((h, idx) => {
    const x = paddingX + idx * stepX;
    const normalized = (h.temp - minTemp) / tempRange;
    const y = tempHeight - paddingY - normalized * (tempHeight - paddingY * 2);
    return { x, y, ...h };
  });

  const tempPath = tempPoints.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  const tempAreaPath = `${tempPath} L ${tempPoints[tempPoints.length - 1].x} ${tempHeight} L ${tempPoints[0].x} ${tempHeight} Z`;

  const maxRainHour = hourly.reduce((max, h) =>
    h.precipitationProbability > max.precipitationProbability ? h : max,
    hourly[0]
  );

  return (
    <div className="w-full space-y-5 select-none font-sans text-slate-200">
      {/* 1. Precipitation Probability Chart (Style Apple Weather) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Risque de pluie heure par heure
              </span>
              <span className="text-[11px] text-slate-500">
                Prévisions sur 24 heures (00h - 23h)
              </span>
            </div>
          </div>
          {maxRainHour.precipitationProbability > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-400" />
              Pic {maxRainHour.precipitationProbability}% à {maxRainHour.hourLabel}
            </span>
          )}
        </div>

        {/* Rain Bars SVG */}
        <div className="relative overflow-x-auto custom-scrollbar">
          <svg
            viewBox={`0 0 ${width} ${rainHeight}`}
            className="w-full h-28 overflow-visible"
          >
            <defs>
              <linearGradient id="rainBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="rainBarHighlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="1" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Background grid guide lines */}
            <line
              x1={paddingX}
              y1={rainHeight - 20}
              x2={width - paddingX}
              y2={rainHeight - 20}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={(rainHeight - 20) / 2}
              x2={width - paddingX}
              y2={(rainHeight - 20) / 2}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="4 4"
            />

            {/* Reference labels */}
            <text x={paddingX - 4} y="14" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
              100%
            </text>
            <text x={paddingX - 4} y={(rainHeight - 20) / 2 + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
              50%
            </text>
            <text x={paddingX - 4} y={rainHeight - 22} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
              0%
            </text>

            {/* Hourly rain bars */}
            {hourly.map((h, i) => {
              const x = paddingX + i * stepX;
              const barMaxH = rainHeight - 28;
              const barH = Math.max((h.precipitationProbability / 100) * barMaxH, 3);
              const y = rainHeight - 20 - barH;
              const isHovered = hoveredHour?.hour === h.hour;
              const showLabel = i % 3 === 0;

              return (
                <g
                  key={i}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredHour(h)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  {/* Rain vertical pill bar */}
                  <rect
                    x={x - 6}
                    y={y}
                    width={12}
                    height={barH}
                    rx={4}
                    fill={isHovered ? 'url(#rainBarHighlight)' : 'url(#rainBarGrad)'}
                    opacity={h.precipitationProbability > 0 ? (isHovered ? 1 : 0.85) : 0.25}
                    className="transition-all duration-150"
                  />

                  {/* Percentage label above peak */}
                  {h.precipitationProbability >= 20 && (
                    <text
                      x={x}
                      y={Math.max(y - 4, 10)}
                      fill={isHovered ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {h.precipitationProbability}%
                    </text>
                  )}

                  {/* Hour label on X axis */}
                  {showLabel && (
                    <text
                      x={x}
                      y={rainHeight - 4}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {h.hourLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Temperature Curve Chart */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Courbe de température sur 24 heures
              </span>
              <span className="text-[11px] text-slate-500">
                Min: {minTemp}°C &bull; Max: {maxTemp}°C
              </span>
            </div>
          </div>
          {hoveredHour && (
            <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center gap-2">
              <WeatherIcon code={hoveredHour.weatherCode} className="w-4 h-4" />
              <span>{hoveredHour.hourLabel}</span>
              <span className={getTempStyle(hoveredHour.temp).textClass}>
                {hoveredHour.temp}°C
              </span>
              {hoveredHour.temp >= 30 && <Flame className="w-3.5 h-3.5 text-orange-400" />}
              {hoveredHour.temp < 5 && <Snowflake className="w-3.5 h-3.5 text-cyan-300" />}
            </div>
          )}
        </div>

        {/* Temperature Spline SVG */}
        <div className="relative overflow-x-auto custom-scrollbar">
          <svg
            viewBox={`0 0 ${width} ${tempHeight}`}
            className="w-full h-32 overflow-visible"
          >
            <defs>
              <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="tempLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="30%" stopColor="#34d399" />
                <stop offset="60%" stopColor="#fde047" />
                <stop offset="85%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Gradient area underneath */}
            <path d={tempAreaPath} fill="url(#tempAreaGrad)" />

            {/* Smooth Temperature Line */}
            <path
              d={tempPath}
              fill="none"
              stroke="url(#tempLineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Dots and Labels at points */}
            {tempPoints.map((pt, i) => {
              const isHovered = hoveredHour?.hour === pt.hour;
              const isMin = pt.temp === minTemp;
              const isMax = pt.temp === maxTemp;
              const showLabel = i % 3 === 0 || isMin || isMax;
              const tempStyle = getTempStyle(pt.temp);

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHour(hourly[i])}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  {/* Temperature Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : isMin || isMax ? 4.5 : 3}
                    fill="#0f172a"
                    stroke={tempStyle.color}
                    strokeWidth={isHovered ? 3 : 2}
                  />

                  {/* Temperature Text */}
                  {showLabel && (
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      fill={isHovered ? '#ffffff' : tempStyle.color}
                      fontSize={isMin || isMax ? '11' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.temp}°
                    </text>
                  )}

                  {/* Hour label below */}
                  {i % 3 === 0 && (
                    <text
                      x={pt.x}
                      y={tempHeight - 2}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.hourLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
