import React from 'react';
import { ClockSection } from './components/ClockSection';
import { WeatherSection } from './components/WeatherSection';
import { WebGLLiquid } from './components/WebGLLiquid';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* WebGL Liquid Background with Auto-Sleep Lifecycle */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <WebGLLiquid speed={0.6} flowStrength={0.8} grain={0.02} opacity={0.9} />
      </div>

      {/* Main Content: Fliqlo Clock & Weather Strip */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center py-6">
        {/* 1. Big Fliqlo Flip Clock with SlidingNumber */}
        <ClockSection />

        {/* 2. Comprehensive 15-Day Brutalist Weather Strip */}
        <WeatherSection />
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-600 font-mono">
        Météo Paris &bull; Open-Meteo
      </footer>
    </div>
  );
};

export default App;
