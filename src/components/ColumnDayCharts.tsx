import React from 'react';
import { HourlyPoint, getTempStyle } from '../services/weatherApi';

interface ColumnDayChartsProps {
  hourly: HourlyPoint[];
}

export const ColumnDayCharts: React.FC<ColumnDayChartsProps> = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  const temps = hourly.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 4);

  const width = 300;
  const rainHeight = 52;
  const tempHeight = 56;
  const paddingX = 12;
  const paddingY = 8;

  const chartWidth = width - paddingX * 2;
  const stepX = chartWidth / (hourly.length - 1);

  // Temperature spline points
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
    <div className="w-full space-y-3 pt-3 border-t border-slate-800/80">
      {/* 1. In-Column Rain Probability Bars */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-slate-400">
          <span className="font-semibold text-slate-300">Pluie 24h</span>
          {maxRainHour.precipitationProbability > 0 ? (
            <span className="text-sky-400 font-bold">
              max {maxRainHour.precipitationProbability}% à {maxRainHour.hourLabel}
            </span>
          ) : (
            <span className="text-slate-600">0%</span>
          )}
        </div>

        <svg viewBox={`0 0 ${width} ${rainHeight}`} className="w-full h-12 overflow-visible">
          <defs>
            <linearGradient id="colRainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Reference line */}
          <line
            x1={paddingX}
            y1={rainHeight - 12}
            x2={width - paddingX}
            y2={rainHeight - 12}
            stroke="rgba(255,255,255,0.06)"
          />

          {hourly.map((h, i) => {
            const x = paddingX + i * stepX;
            const barMaxH = rainHeight - 16;
            const barH = Math.max((h.precipitationProbability / 100) * barMaxH, 2);
            const y = rainHeight - 12 - barH;
            const showHour = i === 0 || i === 6 || i === 12 || i === 18 || i === 23;

            return (
              <g key={i}>
                <rect
                  x={x - 3}
                  y={y}
                  width={6}
                  height={barH}
                  rx={2}
                  fill="url(#colRainGrad)"
                  opacity={h.precipitationProbability > 0 ? 0.9 : 0.2}
                />
                {showHour && (
                  <text
                    x={x}
                    y={rainHeight - 1}
                    fill="#64748b"
                    fontSize="8"
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

      {/* 2. In-Column Temperature Spline Curve (Blue -> Green -> Red) */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-slate-400">
          <span className="font-semibold text-slate-300">Température 24h</span>
          <div className="flex gap-2">
            <span className={getTempStyle(minTemp).textClass}>min {minTemp}°</span>
            <span className={getTempStyle(maxTemp).textClass}>max {maxTemp}°</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${tempHeight}`} className="w-full h-14 overflow-visible">
          <defs>
            <linearGradient id="colTempArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="colTempLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="45%" stopColor="#34d399" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <path d={tempAreaPath} fill="url(#colTempArea)" />
          <path
            d={tempPath}
            fill="none"
            stroke="url(#colTempLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Dots on key hours */}
          {tempPoints.map((pt, i) => {
            const isMin = pt.temp === minTemp;
            const isMax = pt.temp === maxTemp;
            const showPoint = i % 6 === 0 || isMin || isMax;
            if (!showPoint) return null;

            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isMin || isMax ? 3.5 : 2.5}
                  fill="#0f172a"
                  stroke={getTempStyle(pt.temp).color}
                  strokeWidth={2}
                />
                {(isMin || isMax) && (
                  <text
                    x={pt.x}
                    y={pt.y - 5}
                    fill={getTempStyle(pt.temp).color}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {pt.temp}°
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
