import React from 'react';
import { CloudSun, Clock } from 'lucide-react';

interface TopBarProps {
  use24Hour: boolean;
  onToggleTimeFormat: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  use24Hour,
  onToggleTimeFormat,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Brand / Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
          <span className="text-xs font-bold text-white tracking-wider">NT</span>
        </div>
        <span className="text-sm font-semibold text-slate-300 tracking-tight font-display">
          Nouvel onglet
        </span>
      </div>

      {/* Quick Settings Actions */}
      <div className="flex items-center gap-2">
        {/* 12h/24h toggle */}
        <button
          onClick={onToggleTimeFormat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
          title="Basculer le format 12h / 24h"
        >
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>{use24Hour ? '24h' : '12h'}</span>
        </button>

        {/* Minimal indicator in French */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-xs">
          <CloudSun className="w-3.5 h-3.5 text-amber-400" />
          <span>Météo Paris (°C)</span>
        </div>
      </div>
    </header>
  );
};
