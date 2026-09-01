import React, { useState, useEffect } from 'react';
import { SlidingNumber } from './ui/sliding-number';
import { Calendar } from 'lucide-react';

export const ClockSection: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Format full date in French
  const rawDate = time.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fullDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pt-4 pb-6 transition-all duration-300">
      {/* Main Fliqlo Clock Container */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Hours Card (Fliqlo Style) */}
        <div className="relative group flex items-center justify-center bg-[#13151b]/95 border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-5 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl min-w-[130px] sm:min-w-[180px] md:min-w-[240px] lg:min-w-[280px]">
          {/* Top highlight gradient */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[2rem] pointer-events-none" />

          {/* Center Horizontal Flip Divider / Seam */}
          <div className="absolute top-1/2 inset-x-0 h-[2px] sm:h-[3px] bg-[#090a0f] shadow-[0_1px_0_rgba(255,255,255,0.08)] z-20 pointer-events-none" />

          {/* Left / Right hinge notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-r-md z-30 pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-l-md z-30 pointer-events-none" />

          {/* Digits */}
          <div className="relative z-10 text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-extrabold text-[#f8fafc] tracking-tighter font-mono leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] flex justify-center">
            <SlidingNumber value={hours} padStart={true} />
          </div>
        </div>

        {/* Colon Separator with subtle glow */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center py-2">
          <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse" />
          <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse" />
        </div>

        {/* Minutes Card (Fliqlo Style) */}
        <div className="relative group flex items-center justify-center bg-[#13151b]/95 border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-5 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl min-w-[130px] sm:min-w-[180px] md:min-w-[240px] lg:min-w-[280px]">
          {/* Top highlight gradient */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.07] to-transparent rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[2rem] pointer-events-none" />

          {/* Center Horizontal Flip Divider / Seam */}
          <div className="absolute top-1/2 inset-x-0 h-[2px] sm:h-[3px] bg-[#090a0f] shadow-[0_1px_0_rgba(255,255,255,0.08)] z-20 pointer-events-none" />

          {/* Left / Right hinge notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-r-md z-30 pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-l-md z-30 pointer-events-none" />

          {/* Digits */}
          <div className="relative z-10 text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-extrabold text-[#f8fafc] tracking-tighter font-mono leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] flex justify-center">
            <SlidingNumber value={minutes} padStart={true} />
          </div>
        </div>

        {/* Small Seconds Fliqlo Card */}
        <div className="flex flex-col justify-end self-end mb-2 sm:mb-3 md:mb-4">
          <div className="relative flex items-center justify-center bg-[#13151b]/90 border border-white/10 rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl min-w-[50px] sm:min-w-[65px] md:min-w-[80px]">
            {/* Center Horizontal Flip Divider */}
            <div className="absolute top-1/2 inset-x-0 h-[1.5px] bg-[#090a0f] z-20 pointer-events-none" />

            <div className="relative z-10 text-xl sm:text-2xl md:text-3xl font-bold text-sky-300 font-mono tracking-tight flex justify-center">
              <SlidingNumber value={seconds} padStart={true} />
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 text-center mt-1">
            sec
          </span>
        </div>
      </div>

      {/* French Date Badge */}
      <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 text-slate-300 text-xs sm:text-sm md:text-base font-medium shadow-lg backdrop-blur-md">
        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
        <span>{fullDate}</span>
      </div>
    </div>
  );
};

export default ClockSection;
