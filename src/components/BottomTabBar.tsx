import React from 'react';
import { Home, Layers, Grid3X3, Bookmark, Send } from 'lucide-react';
import { Language, TabType, Theme } from '../types';
import { translations } from '../data/translations';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
  theme: Theme;
  savedCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  language,
  theme,
  savedCount,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const tabs: Array<{ id: TabType; label: string; icon: React.FC<{ size?: number; className?: string }> }> = [
    { id: 'home', label: t.tabHome, icon: Home },
    { id: 'projects', label: t.tabProjects, icon: Layers },
    { id: 'categories', label: t.tabCategories, icon: Grid3X3 },
    { id: 'saved', label: t.tabSaved, icon: Bookmark },
    { id: 'contact', label: t.tabContact, icon: Send },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 pb-safe transition-colors duration-200 border-t backdrop-blur-xl ${
        isDark
          ? 'bg-stone-950/90 border-stone-800 text-stone-400'
          : 'bg-white/95 border-stone-200 text-stone-600 shadow-lg'
      }`}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all group ${
                isActive
                  ? 'text-amber-500 font-semibold'
                  : isDark
                  ? 'hover:text-stone-200'
                  : 'hover:text-stone-900'
              }`}
            >
              {/* Icon container */}
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'group-hover:scale-105 stroke-[1.7]'
                  }`}
                />
                {tab.id === 'saved' && savedCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-600 text-white text-[8px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 tracking-tight transition-all truncate max-w-[64px] ${
                  isActive ? 'font-bold opacity-100' : 'font-normal opacity-80'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
