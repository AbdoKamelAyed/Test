import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  theme: 'dark' | 'light';
}

export const StatusBar: React.FC<StatusBarProps> = ({ theme }) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs select-none transition-colors duration-200 z-50 ${
        isDark ? 'text-stone-200' : 'text-stone-800'
      }`}
    >
      {/* Time */}
      <span className="font-semibold tracking-tight text-[13px]">{time}</span>

      {/* Dynamic Island pill representation */}
      <div className="hidden sm:flex items-center justify-center w-24 h-5 rounded-full bg-black/80 border border-white/10 px-2 gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        <span className="text-[9px] text-stone-300 font-medium tracking-wide">DUSUR</span>
      </div>

      {/* Device status icons */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-wider">5G</span>
        <Wifi size={14} className="opacity-90" />
        <div className="flex items-center gap-0.5">
          <Battery size={16} className="opacity-90" />
          <span className="text-[10px] font-mono font-medium">98%</span>
        </div>
      </div>
    </div>
  );
};
