import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../data/translations';

interface DeviceFrameToggleProps {
  isDeviceFrame: boolean;
  onToggleFrame: () => void;
  language: Language;
  theme: Theme;
}

export const DeviceFrameToggle: React.FC<DeviceFrameToggleProps> = ({
  isDeviceFrame,
  onToggleFrame,
  language,
  theme,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  return (
    <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-1.5 p-1 rounded-full bg-stone-900/90 border border-stone-700/60 shadow-xl backdrop-blur-md text-stone-200">
      <button
        onClick={onToggleFrame}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          isDeviceFrame ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-white opacity-80'
        }`}
      >
        <Smartphone size={14} />
        <span>{t.deviceFrameMode}</span>
      </button>

      <button
        onClick={onToggleFrame}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          !isDeviceFrame ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-white opacity-80'
        }`}
      >
        <Monitor size={14} />
        <span>{t.responsiveMode}</span>
      </button>
    </div>
  );
};
