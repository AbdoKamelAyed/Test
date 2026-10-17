import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Compass, Layers, Check } from 'lucide-react';
import { Language, Project, Theme } from '../types';
import { translations } from '../data/translations';

interface BlueprintModalProps {
  project: Project;
  language: Language;
  theme: Theme;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  project,
  language,
  theme,
  onClose,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const [scale, setScale] = useState(1);
  const [activeFloor, setActiveFloor] = useState<'ground' | 'upper' | 'site'>('ground');

  const title = language === 'ar' ? project.blueprintTitleAr : project.blueprintTitleEn;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
      <div
        className={`w-full max-w-2xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border shadow-2xl transition-all ${
          isDark ? 'bg-stone-950 border-stone-800 text-stone-100' : 'bg-stone-900 border-stone-800 text-stone-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Compass size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-tight">
                {title || t.blueprintTitle}
              </h2>
              <span className="text-[10px] text-stone-400 block font-mono">
                CAD / BIM DWG-101 · Scale 1:100 · {project.areaSqm} sqm
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.75))}
              aria-label="Zoom out"
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setScale((s) => Math.min(s + 0.25, 2.5))}
              aria-label="Zoom in"
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={onClose}
              aria-label={t.close}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-200"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Floor selector tabs */}
        <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800 flex items-center gap-2">
          <button
            onClick={() => setActiveFloor('ground')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activeFloor === 'ground' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'المسقط الأرضي (Level 00)' : 'Ground Level 00'}
          </button>
          <button
            onClick={() => setActiveFloor('upper')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activeFloor === 'upper' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'المسقط العلوي (Level 01)' : 'Upper Level 01'}
          </button>
          <button
            onClick={() => setActiveFloor('site')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activeFloor === 'site' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'مخطط الموقع العام (Site Plan)' : 'Master Site Plan'}
          </button>
        </div>

        {/* Blueprint Canvas Graphic Stage */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#0d1624] relative min-h-[320px]">
          {/* Blueprint Grid Lines Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#2d4b73 1px, transparent 1px), linear-gradient(90deg, #2d4b73 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div
            style={{ transform: `scale(${scale})` }}
            className="relative border-2 border-cyan-500/40 rounded-xl p-6 bg-slate-950/70 shadow-2xl transition-transform duration-200 max-w-md w-full"
          >
            {/* Architectural stamp */}
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
              <div className="text-[10px] text-cyan-400">
                <span className="font-bold font-mono tracking-wider">DUSUR ARCHITECTURE</span>
                <span className="block opacity-90 text-[10px] mt-0.5 tracking-wide font-sans">
                  {language === 'ar' ? project.titleEn : project.titleEn}
                </span>
              </div>
              <div className="px-2 py-0.5 rounded border border-cyan-400/30 text-[9px] font-mono text-cyan-300">
                REV. 04 APPROVED
              </div>
            </div>

            {/* Geometric Floor Plan Diagram */}
            <div className="grid grid-cols-3 gap-2 h-44 text-[11px] text-cyan-200">
              <div className="col-span-2 border border-cyan-500/30 rounded p-2 bg-cyan-950/20 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-semibold">{language === 'ar' ? 'صالة المعيشة الرئيسية' : 'Grand Living Gallery'}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">8.4m × 6.2m</span>
                </div>
                <div className="border border-dashed border-cyan-500/30 rounded p-1 text-center text-[10px] text-cyan-300/80">
                  {language === 'ar' ? 'واجهات زجاجية ممتدة' : 'Frameless Glazing Axis'}
                </div>
              </div>

              <div className="border border-cyan-500/30 rounded p-2 bg-cyan-950/30 flex flex-col justify-between">
                <span className="font-semibold">{language === 'ar' ? 'مطبخ الشيف' : 'Bespoke Kitchen'}</span>
                <span className="text-[10px] text-cyan-400 font-mono">4.5m × 3.8m</span>
              </div>

              <div className="border border-cyan-500/30 rounded p-2 bg-cyan-950/20 flex flex-col justify-between">
                <span className="font-semibold">{language === 'ar' ? 'الجناح الشرقي' : 'East Suite'}</span>
                <span className="text-[10px] text-cyan-400 font-mono">5.0m × 4.2m</span>
              </div>

              <div className="col-span-2 border border-cyan-500/40 rounded p-2 bg-cyan-900/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{language === 'ar' ? 'حوض السباحة والتراس' : 'Infinity Pool & Teak Deck'}</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">12.0m × 4.0m</span>
              </div>
            </div>

            {/* Blueprint Dimensions footer */}
            <div className="mt-4 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[9px] font-mono text-cyan-400/80">
              <span>N 25° 11\' 48.2" E 55° 16\' 27.8"</span>
              <span>TOTAL BUILT AREA: {project.areaSqm} SQM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
