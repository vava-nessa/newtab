import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const ClockSection: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // Format full date in French
  const rawDate = time.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fullDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pt-6 pb-4 transition-all duration-300">
      {/* Big Main Clock */}
      <div className="relative group flex items-baseline justify-center tracking-tighter font-display font-bold">
        <div className="text-8xl sm:text-9xl md:text-[10.5rem] lg:text-[12.5rem] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-baseline">
          <span>{hours}</span>
          <span className="text-sky-400/80 mx-1 sm:mx-2 animate-pulse-subtle">:</span>
          <span>{minutes}</span>
        </div>

        {/* Seconds Counter */}
        <div className="ml-2 sm:ml-4 flex flex-col items-start justify-center font-mono">
          <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-400/70">
            :{seconds}
          </span>
        </div>
      </div>

      {/* Formatted Date */}
      <div className="mt-2 text-slate-400 text-sm sm:text-base md:text-lg font-medium tracking-wide flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-500" />
        <span>{fullDate}</span>
      </div>
    </div>
  );
};
