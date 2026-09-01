import React, { useState, useEffect } from 'react';
import { SlidingNumber } from './ui/sliding-number';

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

  return (
    <div className="flex items-center justify-center text-center select-none pt-4 pb-6">
      {/* Main Fliqlo Clock Container (No colon between cards) */}
      <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
        {/* Hours Card (Fliqlo Style) */}
        <div className="relative group flex items-center justify-center bg-[#14151a] border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-5 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.12)] min-w-[130px] sm:min-w-[180px] md:min-w-[240px] lg:min-w-[280px]">
          {/* Top highlight gradient */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[2rem] pointer-events-none" />

          {/* Center Horizontal Flip Divider / Seam */}
          <div className="absolute top-1/2 inset-x-0 h-[2px] sm:h-[3px] bg-[#090a0f] shadow-[0_1px_0_rgba(255,255,255,0.06)] z-20 pointer-events-none" />

          {/* Left / Right hinge notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-r-md z-30 pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-l-md z-30 pointer-events-none" />

          {/* Digits */}
          <div className="relative z-10 text-7xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-extrabold text-[#f8fafc] tracking-tighter font-mono leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex justify-center">
            <SlidingNumber value={hours} padStart={true} />
          </div>
        </div>

        {/* Minutes Card (Fliqlo Style) */}
        <div className="relative group flex items-center justify-center bg-[#14151a] border border-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2rem] px-5 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.12)] min-w-[130px] sm:min-w-[180px] md:min-w-[240px] lg:min-w-[280px]">
          {/* Top highlight gradient */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent rounded-t-2xl sm:rounded-t-3xl md:rounded-t-[2rem] pointer-events-none" />

          {/* Center Horizontal Flip Divider / Seam */}
          <div className="absolute top-1/2 inset-x-0 h-[2px] sm:h-[3px] bg-[#090a0f] shadow-[0_1px_0_rgba(255,255,255,0.06)] z-20 pointer-events-none" />

          {/* Left / Right hinge notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-r-md z-30 pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3 sm:h-4 bg-[#090a0f] rounded-l-md z-30 pointer-events-none" />

          {/* Digits */}
          <div className="relative z-10 text-7xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-extrabold text-[#f8fafc] tracking-tighter font-mono leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex justify-center">
            <SlidingNumber value={minutes} padStart={true} />
          </div>
        </div>

        {/* Small Seconds Fliqlo Card */}
        <div className="flex flex-col justify-end self-end mb-2 sm:mb-3 md:mb-4">
          <div className="relative flex items-center justify-center bg-[#14151a] border border-white/10 rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.7)] min-w-[50px] sm:min-w-[65px] md:min-w-[80px]">
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
    </div>
  );
};

export default ClockSection;
