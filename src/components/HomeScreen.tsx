import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Compass, Sparkles, Building, ChevronRight, Bookmark } from 'lucide-react';
import { Language, Project, Theme } from '../types';
import { CATEGORIES, PORTFOLIO_STATS } from '../data/projectsData';
import { translations } from '../data/translations';
import { formatProjectMetrics } from '../utils/portfolioLogic';

interface HomeScreenProps {
  projects: Project[];
  language: Language;
  theme: Theme;
  onSelectProject: (project: Project) => void;
  onSelectCategory: (categoryId: string) => void;
  onViewAllProjects: () => void;
  savedIds: string[];
  onToggleSave: (projectId: string) => void;
  onRequestInquiry: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  language,
  theme,
  onSelectProject,
  onSelectCategory,
  onViewAllProjects,
  savedIds,
  onToggleSave,
  onRequestInquiry,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const featuredProjects = projects.filter((p) => p.featured);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroProject = featuredProjects[activeHeroIndex] || featuredProjects[0] || projects[0];

  return (
    <div className="flex flex-col pb-24">
      {/* Brand Hero Welcome Banner */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500">
              {t.brandTagline}
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">
              {t.welcome}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Sparkles size={20} />
          </div>
        </div>
        <p
          className={`text-xs mt-2 leading-relaxed ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}
        >
          {t.brandDescription}
        </p>
      </section>

      {/* Featured Masterpiece Hero Showcase Card */}
      {heroProject && (
        <section className="px-4 mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-tight flex items-center gap-1.5 text-amber-500">
              <Compass size={14} />
              {t.featuredProjects}
            </span>
            <div className="flex items-center gap-1">
              {featuredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    activeHeroIndex === idx
                      ? 'w-5 bg-amber-500'
                      : isDark
                      ? 'w-1.5 bg-stone-700'
                      : 'w-1.5 bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            onClick={() => onSelectProject(heroProject)}
            className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 shadow-md ${
              isDark
                ? 'bg-stone-900 border-stone-800 hover:border-amber-500/50'
                : 'bg-white border-stone-200 hover:border-amber-600/50'
            }`}
          >
            {/* Image container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-800">
              <img
                src={heroProject.thumbnail}
                alt={language === 'ar' ? heroProject.titleAr : heroProject.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Bookmark quick button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(heroProject.id);
                }}
                aria-label={t.bookmarkProject}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all hover:bg-black/70 active:scale-90"
              >
                <Bookmark
                  size={16}
                  className={
                    savedIds.includes(heroProject.id)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-white'
                  }
                />
              </button>

              {/* Typology Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium tracking-wide">
                {language === 'ar' ? heroProject.categoryAr : heroProject.categoryEn}
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium mb-1">
                  <span>{language === 'ar' ? heroProject.locationAr : heroProject.locationEn}</span>
                  <span>·</span>
                  <span>{formatProjectMetrics(heroProject.areaSqm, heroProject.year, language).areaString}</span>
                </div>
                <h2 className="text-lg font-bold leading-snug drop-shadow-sm">
                  {language === 'ar' ? heroProject.titleAr : heroProject.titleEn}
                </h2>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Studio Credibility Stats Strip */}
      <section className="px-4 mt-5">
        <div
          className={`grid grid-cols-4 gap-2 p-3 rounded-2xl border ${
            isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-100/80 border-stone-200'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <span className="text-base font-bold text-amber-500 font-sans tabular-nums">
              {PORTFOLIO_STATS.totalProjects}+
            </span>
            <span className="text-[9px] opacity-70 mt-0.5 leading-tight">
              {t.statProjectsCompleted}
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-s border-stone-700/20">
            <span className="text-base font-bold text-amber-500 font-sans tabular-nums">
              {PORTFOLIO_STATS.yearsOfExperience}
            </span>
            <span className="text-[9px] opacity-70 mt-0.5 leading-tight">
              {t.statYearsExperience}
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-s border-stone-700/20">
            <span className="text-base font-bold text-amber-500 font-sans tabular-nums">
              {PORTFOLIO_STATS.awardsCount}+
            </span>
            <span className="text-[9px] opacity-70 mt-0.5 leading-tight">
              {t.statAwards}
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-s border-stone-700/20">
            <span className="text-base font-bold text-amber-500 font-sans tabular-nums">
              185k
            </span>
            <span className="text-[9px] opacity-70 mt-0.5 leading-tight">
              {t.statSqmDesigned}
            </span>
          </div>
        </div>
      </section>

      {/* Project Typologies Horizontal Scroll */}
      <section className="mt-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-tight">
            {t.categoriesTitle}
          </h2>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-medium text-amber-500 hover:text-amber-400 flex items-center gap-0.5"
          >
            <span>{t.viewAllProjects}</span>
            <ArrowIcon size={13} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 group flex flex-col items-start p-2.5 rounded-xl border transition-all text-start w-32 ${
                isDark
                  ? 'bg-stone-900 border-stone-800 hover:border-amber-500/50'
                  : 'bg-white border-stone-200 hover:border-amber-500/50 shadow-xs'
              }`}
            >
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-800 mb-2">
                <img
                  src={cat.coverImage}
                  alt={language === 'ar' ? cat.nameAr : cat.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-semibold line-clamp-1">
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </span>
              <span className="text-[10px] opacity-60 mt-0.5">
                {cat.count} {language === 'ar' ? 'مشاريع' : 'Projects'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Architectural Creations List */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-tight">
            {t.recentProjects}
          </h2>
          <button
            onClick={onViewAllProjects}
            className="text-xs font-medium text-amber-500 hover:text-amber-400 flex items-center gap-0.5"
          >
            <span>{t.allCategories}</span>
            <ArrowIcon size={13} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {projects.slice(1, 4).map((project) => {
            const isSaved = savedIds.includes(project.id);
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isDark
                    ? 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
                  <img
                    src={project.thumbnail}
                    alt={language === 'ar' ? project.titleAr : project.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-medium text-amber-500 uppercase tracking-wide">
                    {language === 'ar' ? project.categoryAr : project.categoryEn}
                  </span>
                  <h3 className="text-xs font-bold truncate mt-0.5">
                    {language === 'ar' ? project.titleAr : project.titleEn}
                  </h3>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {language === 'ar' ? project.locationAr : project.locationEn} · {project.areaSqm} {t.sqmUnit}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(project.id);
                  }}
                  aria-label={t.bookmarkProject}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
                  }`}
                >
                  <Bookmark
                    size={15}
                    className={isSaved ? 'text-amber-500 fill-amber-500' : 'opacity-40'}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Consultation Call to Action */}
      <section className="px-4 mt-6">
        <div
          className={`p-4 rounded-2xl border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-stone-900 to-amber-950/30 border-amber-500/20'
              : 'bg-gradient-to-br from-amber-50/80 to-stone-100 border-amber-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">
                {t.brandName}
              </span>
              <h3 className="text-sm font-bold mt-1">
                {t.contactTitle}
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isDark ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {t.contactDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onRequestInquiry}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs tracking-wide shadow-sm shadow-amber-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.formSubmit}</span>
            <ArrowIcon size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};
