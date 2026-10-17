import React from 'react';
import { Search, Sun, Moon, Bookmark, Globe } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../data/translations';

interface TopAppBarProps {
  language: Language;
  onToggleLanguage: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  onOpenSearch,
  onOpenSaved,
  savedCount,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-40 w-full px-4 py-2.5 transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-stone-950/85 border-stone-800/80 text-stone-100'
          : 'bg-stone-50/90 border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-950/20">
            <span className="font-extrabold text-sm tracking-widest font-sans">D</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-wider text-base text-amber-500">
                {language === 'ar' ? 'دُسُر' : 'DUSUR'}
              </span>
              <span
                style={{ fontFamily: 'var(--font-ar)' }}
                className="text-[11px] font-medium opacity-60"
              >
                {language === 'ar' ? 'DUSUR' : 'دُسُر'}
              </span>
            </div>
            <span className="text-[10px] opacity-60 leading-tight mt-0.5 truncate max-w-[130px] sm:max-w-none">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Quick Actions (Search, Language, Theme, Saved) */}
        <div className="flex items-center gap-1.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label={t.searchPlaceholder}
            className={`min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : 'hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <Search size={17} />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            aria-label={t.switchLanguage}
            className={`min-h-[40px] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-all border ${
              isDark
                ? 'bg-stone-900/90 border-stone-800 text-amber-400 hover:border-amber-500/50'
                : 'bg-white border-stone-200 text-amber-700 hover:border-amber-600/50 shadow-xs'
            }`}
          >
            <Globe size={13} />
            <span
              style={{ fontFamily: language === 'ar' ? 'var(--font-en)' : 'var(--font-ar)' }}
              className="text-[11px] font-bold"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={t.toggleTheme}
            className={`min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-amber-400'
                : 'hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Saved Bookmarks Quick Icon */}
          <button
            onClick={onOpenSaved}
            aria-label={t.savedTitle}
            className={`relative min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-all ${
              isDark
                ? 'hover:bg-stone-800 text-stone-300'
                : 'hover:bg-stone-200/80 text-stone-700'
            }`}
          >
            <Bookmark size={17} className={savedCount > 0 ? 'text-amber-500 fill-amber-500' : ''} />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
