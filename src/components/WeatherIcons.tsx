import React from 'react';

interface WeatherIconProps {
  code: number;
  className?: string;
  isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = 'w-8 h-8', isNight = false }) => {
  // Clear Sky
  if (code === 0) {
    if (isNight) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          <path
            d="M26 18.5C25 24 20 28 14 28C7.5 28 2 22.5 2 16C2 10 6 5 11.5 4C10.5 6.5 10 9 10 12C10 18.5 15.5 24 22 24C23.5 24 24.8 23.6 26 18.5Z"
            fill="url(#moonGrad)"
          />
          <circle cx="24" cy="7" r="1.5" fill="#fef08a" />
          <circle cx="28" cy="11" r="1" fill="#fef08a" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="6.5" fill="url(#sunGrad)" />
        <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
          <line x1="16" y1="3" x2="16" y2="6" />
          <line x1="16" y1="26" x2="16" y2="29" />
          <line x1="3" y1="16" x2="6" y2="16" />
          <line x1="26" y1="16" x2="29" y2="16" />
          <line x1="6.8" y1="6.8" x2="9" y2="9" />
          <line x1="23" y1="23" x2="25.2" y2="25.2" />
          <line x1="6.8" y1="25.2" x2="9" y2="23" />
          <line x1="23" y1="9" x2="25.2" y2="6.8" />
        </g>
      </svg>
    );
  }

  // Mainly Clear / Partly Cloudy
  if (code === 1 || code === 2) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="partlySunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="partlyCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <circle cx="21" cy="11" r="5" fill="url(#partlySunGrad)" />
        <path
          d="M10 26C6.686 26 4 23.314 4 20C4 16.9 6.35 14.36 9.4 14.04C10.3 10.5 13.5 8 17.3 8C21.8 8 25.5 11.4 25.8 15.8C27.6 16.6 29 18.4 29 20.6C29 23.6 26.6 26 23.6 26H10Z"
          fill="url(#partlyCloudGrad)"
        />
      </svg>
    );
  }

  // Overcast
  if (code === 3) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="overcastBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <path
          d="M14 18C11.5 18 9.5 16 9.5 13.5C9.5 11.2 11.2 9.3 13.5 9.03C14.2 6.4 16.6 4.5 19.5 4.5C22.9 4.5 25.7 7.1 25.9 10.4C27.3 11 28.3 12.4 28.3 14C28.3 16.2 26.5 18 24.3 18H14Z"
          fill="url(#overcastBackGrad)"
          opacity="0.8"
        />
        <path
          d="M8.5 27C5.5 27 3 24.5 3 21.5C3 18.7 5.1 16.4 7.8 16.1C8.6 12.9 11.5 10.5 15 10.5C19 10.5 22.3 13.6 22.6 17.6C24.2 18.3 25.5 19.9 25.5 21.9C25.5 24.7 23.3 27 20.5 27H8.5Z"
          fill="url(#overcastGrad)"
        />
      </svg>
    );
  }

  // Fog
  if (code === 45 || code === 48) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="fogCloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M7 18C4.8 18 3 16.2 3 14C3 11.9 4.6 10.2 6.6 10C7.3 7.6 9.5 5.8 12.1 5.8C15.2 5.8 17.7 8.1 18 11.2C19.3 11.7 20.2 13 20.2 14.5C20.2 16.4 18.6 18 16.7 18H7Z"
          fill="url(#fogCloud)"
        />
        <line x1="4" y1="21" x2="28" y2="21" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="25" x2="26" y2="25" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="9" y1="29" x2="23" y2="29" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Drizzle
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="drizzleCloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <path
          d="M7 19C4.8 19 3 17.2 3 15C3 12.9 4.6 11.2 6.6 11C7.3 8.6 9.5 6.8 12.1 6.8C15.2 6.8 17.7 9.1 18 12.2C19.3 12.7 20.2 14 20.2 15.5C20.2 17.4 18.6 19 16.7 19H7Z"
          fill="url(#drizzleCloud)"
        />
        <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <line x1="7" y1="22" x2="6" y2="25" />
          <line x1="13" y1="22" x2="12" y2="25" />
          <line x1="19" y1="22" x2="18" y2="25" />
          <line x1="10" y1="26" x2="9" y2="29" />
          <line x1="16" y1="26" x2="15" y2="29" />
        </g>
      </svg>
    );
  }

  // Rain / Showers
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="rainCloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path
          d="M7.5 19C4.5 19 2 16.5 2 13.5C2 10.7 4.1 8.4 6.8 8.1C7.6 4.9 10.5 2.5 14 2.5C18 2.5 21.3 5.6 21.6 9.6C23.2 10.3 24.5 11.9 24.5 13.9C24.5 16.7 22.3 19 19.5 19H7.5Z"
          fill="url(#rainCloud)"
        />
        <g stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round">
          <line x1="7" y1="22" x2="5" y2="27" />
          <line x1="13" y1="22" x2="11" y2="27" />
          <line x1="19" y1="22" x2="17" y2="27" />
        </g>
        <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <line x1="10" y1="25" x2="8" y2="30" />
          <line x1="16" y1="25" x2="14" y2="30" />
        </g>
      </svg>
    );
  }

  // Snow
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="snowCloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M7.5 18C4.5 18 2 15.5 2 12.5C2 9.7 4.1 7.4 6.8 7.1C7.6 3.9 10.5 1.5 14 1.5C18 1.5 21.3 4.6 21.6 8.6C23.2 9.3 24.5 10.9 24.5 12.9C24.5 15.7 22.3 18 19.5 18H7.5Z"
          fill="url(#snowCloud)"
        />
        <g fill="#7dd3fc">
          <circle cx="8" cy="22" r="1.5" />
          <circle cx="14" cy="22" r="1.5" />
          <circle cx="20" cy="22" r="1.5" />
          <circle cx="11" cy="27" r="1.5" />
          <circle cx="17" cy="27" r="1.5" />
        </g>
      </svg>
    );
  }

  // Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className}>
        <defs>
          <linearGradient id="thunderCloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        <path
          d="M7.5 18C4.5 18 2 15.5 2 12.5C2 9.7 4.1 7.4 6.8 7.1C7.6 3.9 10.5 1.5 14 1.5C18 1.5 21.3 4.6 21.6 8.6C23.2 9.3 24.5 10.9 24.5 12.9C24.5 15.7 22.3 18 19.5 18H7.5Z"
          fill="url(#thunderCloud)"
        />
        <path
          d="M15 15L11 22H16L14 30L21 21H16L19 15H15Z"
          fill="url(#lightningGrad)"
          stroke="#ca8a04"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  // Fallback generic cloud
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M8.5 24C5.5 24 3 21.5 3 18.5C3 15.7 5.1 13.4 7.8 13.1C8.6 9.9 11.5 7.5 15 7.5C19 7.5 22.3 10.6 22.6 14.6C24.2 15.3 25.5 16.9 25.5 18.9C25.5 21.7 23.3 24 20.5 24H8.5Z"
        fill="#94a3b8"
      />
    </svg>
  );
};
