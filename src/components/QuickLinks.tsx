import React from 'react';
import { Mail, Compass, FileCode2, Sparkles, Bookmark } from 'lucide-react';

interface QuickLinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

const DEFAULT_LINKS: QuickLinkItem[] = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: 'hover:text-white hover:border-slate-500',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    icon: <Sparkles className="w-4 h-4 text-sky-400" />,
    color: 'hover:text-sky-400 hover:border-sky-500/50',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: 'hover:text-red-400 hover:border-red-500/50',
  },
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    icon: <Mail className="w-4 h-4 text-amber-400" />,
    color: 'hover:text-amber-400 hover:border-amber-500/50',
  },
  {
    name: 'DevDocs',
    url: 'https://devdocs.io',
    icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
    color: 'hover:text-emerald-400 hover:border-emerald-500/50',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    icon: <Compass className="w-4 h-4 text-orange-400" />,
    color: 'hover:text-orange-400 hover:border-orange-500/50',
  },
];

export const QuickLinks: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-2 mb-8 px-4 flex items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-1 px-2.5 py-1 text-slate-500 text-xs font-medium border-r border-slate-800/80 mr-1">
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Raccourcis</span>
        </div>
        {DEFAULT_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-400 text-xs font-medium transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 ${link.color}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
