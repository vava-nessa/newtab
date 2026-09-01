import React from 'react';
import { ClockSection } from './components/ClockSection';
import { WeatherSection } from './components/WeatherSection';
import { Topography } from './components/Topography';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Topography Dynamic Background at 50% Opacity */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <Topography
          lowColor="#3b15b3"
          midColor="#818cf8"
          highColor="#f8fafc"
          speed={0.25}
          morphAmount={2.5}
          morphSpeed={0.04}
          bands={2.5}
          thickness={0.012}
          scale={1.1}
          pixelSize={1.0}
          glow={0.4}
          colorMode="elevation"
          contrast={2.8}
          brightness={0.85}
          fillBands={false}
          opacity={0.5}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseRadius={0.35}
          mouseStrength={0.35}
        />
      </div>

      {/* Main Content: Pure Clock & Weather Strip */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center py-6">
        {/* 1. Big Centered Clock & Date */}
        <ClockSection />

        {/* 2. Comprehensive 15-Day Brutalist Weather Strip (Direct In-Column Graphs, Solar Times & Nature Photos) */}
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
