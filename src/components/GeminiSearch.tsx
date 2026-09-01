import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, X, Check, Copy } from 'lucide-react';

export const GeminiSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut to focus search input only when user types '/' or 'Cmd+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText = query.trim();
    if (!promptText) return;

    try {
      // Copy to clipboard for easy paste on Gemini
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptText);
        setIsCopied(true);
      }
    } catch {
      // Ignore clipboard failure
    }

    setIsRedirecting(true);

    // Redirect to Gemini web app
    const geminiUrl = `https://gemini.google.com/app?prompt=${encodeURIComponent(promptText)}`;
    
    setTimeout(() => {
      window.location.href = geminiUrl;
    }, 400);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4">
      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative group transition-all duration-300"
      >
        {/* Glow ambient layer */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-40 group-focus-within:opacity-100 group-hover:opacity-70 transition duration-500 pointer-events-none" />

        {/* Input bar */}
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/70 group-focus-within:border-sky-500/60 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 glow-gemini">
          {/* Gemini Sparkle Icon with animated gradient */}
          <div className="pl-3 pr-2 text-sky-400 flex items-center justify-center shrink-0">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-500/30">
              <Sparkles className="w-5 h-5 text-sky-300 animate-pulse-subtle" />
            </div>
          </div>

          {/* Text Input without autofocus */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Poser une question à Gemini... (ou appuyer sur /)"
            className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none font-normal"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 pr-1 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                title="Effacer la saisie"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Keyboard shortcut badge */}
            {!query && (
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-400">
                /
              </span>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!query.trim() || isRedirecting}
              className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition-all duration-200 ${
                query.trim() && !isRedirecting
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 scale-100 cursor-pointer'
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
              }`}
              title="Envoyer le prompt à Gemini"
            >
              {isRedirecting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isCopied ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Redirect / Copied notification feedback */}
      {isRedirecting && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-sky-400 animate-fade-in font-medium">
          <Copy className="w-3.5 h-3.5" />
          <span>Prompt copié dans le presse-papier ! Redirection vers Gemini...</span>
        </div>
      )}
    </div>
  );
};
