import React, { useState } from 'react';
import { Bookmark, Trash2, Share2, ArrowLeft, ArrowRight, Layers, Check } from 'lucide-react';
import { Language, Project, Theme } from '../types';
import { translations } from '../data/translations';
import { formatProjectMetrics } from '../utils/portfolioLogic';

interface SavedScreenProps {
  projects: Project[];
  savedIds: string[];
  language: Language;
  theme: Theme;
  onSelectProject: (project: Project) => void;
  onToggleSave: (projectId: string) => void;
  onClearAllSaved: () => void;
  onExploreProjects: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  projects,
  savedIds,
  language,
  theme,
  onSelectProject,
  onToggleSave,
  onClearAllSaved,
  onExploreProjects,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [copied, setCopied] = useState(false);

  const savedProjects = projects.filter((p) => savedIds.includes(p.id));

  const handleExportSummary = () => {
    const lines = savedProjects.map((p, idx) => {
      const title = language === 'ar' ? p.titleAr : p.titleEn;
      const location = language === 'ar' ? p.locationAr : p.locationEn;
      return `${idx + 1}. ${title} (${location}) - ${p.areaSqm} sqm [${p.year}]`;
    });

    const textToCopy = `DUSUR (دُسُر) - Selected Architectural Projects:\n\n${lines.join(
      '\n'
    )}\n\nWebsite: https://dusur.me`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {t.savedTitle}
          </h1>
          <span className="text-xs opacity-60">
            {savedProjects.length} {language === 'ar' ? 'مشاريع محفوظة' : 'Saved Works'}
          </span>
        </div>

        {savedProjects.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSummary}
              title={t.exportSavedSummary}
              className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isDark
                  ? 'bg-stone-900 border-stone-800 text-stone-200 hover:border-stone-700'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-500">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  <span>{t.exportSavedSummary}</span>
                </>
              )}
            </button>

            <button
              onClick={onClearAllSaved}
              title={t.clearAllSaved}
              className="min-h-[36px] min-w-[36px] rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedProjects.length === 0 ? (
        <div
          className={`p-8 rounded-2xl text-center border my-8 flex flex-col items-center justify-center ${
            isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
            <Bookmark size={24} />
          </div>
          <h3 className="text-sm font-bold">{t.noSavedTitle}</h3>
          <p
            className={`text-xs mt-1.5 max-w-xs leading-relaxed ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {t.noSavedDesc}
          </p>
          <button
            onClick={onExploreProjects}
            className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Layers size={14} />
            <span>{t.viewAllProjects}</span>
            <ArrowIcon size={13} />
          </button>
        </div>
      ) : (
        /* Saved Projects List */
        <div className="flex flex-col gap-3">
          {savedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`group rounded-2xl overflow-hidden border p-3 cursor-pointer transition-all flex gap-3 shadow-xs ${
                isDark
                  ? 'bg-stone-900 border-stone-800 hover:border-amber-500/40'
                  : 'bg-white border-stone-200 hover:border-amber-600/40'
              }`}
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-800 shrink-0">
                <img
                  src={project.thumbnail}
                  alt={language === 'ar' ? project.titleAr : project.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-500">
                      {language === 'ar' ? project.categoryAr : project.categoryEn}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(project.id);
                      }}
                      className="text-amber-500 hover:text-rose-500 p-1"
                    >
                      <Bookmark size={15} className="fill-amber-500" />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold truncate mt-0.5">
                    {language === 'ar' ? project.titleAr : project.titleEn}
                  </h3>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {language === 'ar' ? project.locationAr : project.locationEn}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] mt-2">
                  <span className="opacity-60 font-mono">
                    {formatProjectMetrics(project.areaSqm, project.year, language).areaString}
                  </span>
                  <span className="text-amber-500 font-semibold">{t.projectDetails}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
