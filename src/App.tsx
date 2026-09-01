import React, { useState, useEffect } from 'react';
import { ClockSection } from './components/ClockSection';
import { WeatherSection } from './components/WeatherSection';

export const App: React.FC = () => {
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const raw = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setDateStr(raw.charAt(0).toUpperCase() + raw.slice(1));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Raw White Date in Top Left (Zero Border, Pure Minimal Typography) */}
      <header className="w-full px-6 sm:px-8 pt-5 sm:pt-6">
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-normal font-sans">
          {dateStr}
        </h1>
      </header>

      {/* Main Content: Fliqlo Clock & 15-Day Weather Strip */}
      <main className="w-full flex-1 flex flex-col justify-center py-4">
        {/* 1. Big Fliqlo Flip Clock (No colons, pure 24h cards) */}
        <ClockSection />

        {/* 2. Comprehensive 15-Day Brutalist Weather Strip */}
        <WeatherSection />
      </main>

      {/* Minimal Footer */}
      <footer className="py-3 text-center text-xs text-slate-600 font-mono">
        Météo Paris &bull; Open-Meteo
      </footer>
    </div>
  );
};

export default App;
