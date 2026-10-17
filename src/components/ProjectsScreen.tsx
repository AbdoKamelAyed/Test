import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, X, Bookmark, FileDown, Eye, Filter, Sparkles } from 'lucide-react';
import { Language, Project, Theme, ViewMode } from '../types';
import { CATEGORIES } from '../data/projectsData';
import { translations } from '../data/translations';
import { filterProjects, formatProjectMetrics } from '../utils/portfolioLogic';

interface ProjectsScreenProps {
  projects: Project[];
  language: Language;
  theme: Theme;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectProject: (project: Project) => void;
  savedIds: string[];
  onToggleSave: (projectId: string) => void;
  onQuickDownload: (project: Project) => void;
  onQuickPreview: (project: Project) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  language,
  theme,
  selectedCategory,
  onSelectCategory,
  onSelectProject,
  savedIds,
  onToggleSave,
  onQuickDownload,
  onQuickPreview,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Filtered projects
  const filtered = useMemo(() => {
    return filterProjects(projects, {
      category: selectedCategory,
      searchQuery,
      featuredOnly,
      lang: language,
    });
  }, [projects, selectedCategory, searchQuery, featuredOnly, language]);

  return (
    <div className="flex flex-col pb-24">
      {/* Top Header & Search Bar */}
      <section className="px-4 pt-4 pb-2 sticky top-[57px] z-30 backdrop-blur-md transition-colors border-b border-stone-800/10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight">
            {t.projectsTitle}
          </h1>

          {/* View mode toggle (Grid vs List) */}
          <div
            className={`flex items-center p-0.5 rounded-lg border ${
              isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-200/80 border-stone-300'
            }`}
          >
            <button
              onClick={() => setViewMode('grid')}
              aria-label={t.gridView}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label={t.listView}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Search input field */}
        <div className="relative flex items-center">
          <Search
            size={16}
            className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} opacity-50`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full h-10 rounded-xl text-xs font-medium transition-all outline-none border ${
              language === 'ar' ? 'pr-9 pl-8' : 'pl-9 pr-8'
            } ${
              isDark
                ? 'bg-stone-900/90 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-amber-500'
                : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} opacity-60 hover:opacity-100`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Data-driven category filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
          {/* 'All' tab */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                : isDark
                ? 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            {t.allCategories} ({projects.length})
          </button>

          {/* Featured toggle chip */}
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1 ${
              featuredOnly
                ? 'bg-amber-700 border-amber-700 text-white shadow-xs'
                : isDark
                ? 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <Sparkles size={12} className={featuredOnly ? 'text-amber-200' : 'text-amber-500'} />
            <span>{t.filterFeaturedOnly}</span>
          </button>

          {/* Dynamic Categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects count summary */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] opacity-60">
        <span>
          {t.showingCount
            .replace('{count}', String(filtered.length))
            .replace('{total}', String(projects.length))}
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
              setFeaturedOnly(false);
            }}
            className="text-amber-500 font-semibold hover:underline"
          >
            {t.resetFilters}
          </button>
        )}
      </div>

      {/* Project Cards Grid / List View */}
      <section className="px-4 mt-1">
        {filtered.length === 0 ? (
          <div
            className={`p-8 rounded-2xl text-center border my-8 flex flex-col items-center justify-center ${
              isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <Filter size={20} />
            </div>
            <h3 className="text-sm font-bold">{t.noProjectsFound}</h3>
            <p className="text-xs opacity-60 mt-1 max-w-xs">{t.searchPlaceholder}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setFeaturedOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View (2-column on mobile, responsive) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filtered.map((project) => {
              const isSaved = savedIds.includes(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 flex flex-col shadow-xs ${
                    isDark
                      ? 'bg-stone-900 border-stone-800 hover:border-amber-500/40'
                      : 'bg-white border-stone-200 hover:border-amber-600/40'
                  }`}
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-800">
                    <img
                      src={project.thumbnail}
                      alt={language === 'ar' ? project.titleAr : project.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Bookmark action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(project.id);
                      }}
                      aria-label={t.bookmarkProject}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all hover:bg-black/80"
                    >
                      <Bookmark
                        size={14}
                        className={isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}
                      />
                    </button>

                    {/* Category pill */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-medium">
                      {language === 'ar' ? project.categoryAr : project.categoryEn}
                    </span>
                  </div>

                  {/* Body content */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-semibold mb-1">
                        <span>{language === 'ar' ? project.locationAr : project.locationEn}</span>
                        <span>·</span>
                        <span>{project.year}</span>
                      </div>
                      <h2 className="text-xs font-bold line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {language === 'ar' ? project.titleAr : project.titleEn}
                      </h2>
                      <p
                        className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                          isDark ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        {language === 'ar' ? project.descriptionAr : project.descriptionEn}
                      </p>
                    </div>

                    {/* Quick action buttons (Preview & Brochure) */}
                    <div className="pt-3 mt-2 border-t border-stone-800/10 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-medium opacity-60">
                        {formatProjectMetrics(project.areaSqm, project.year, language).areaString}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickPreview(project);
                          }}
                          title={t.interactivePreview}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isDark
                              ? 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200'
                              : 'bg-stone-100 border-stone-200 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickDownload(project);
                          }}
                          title={t.downloadBrochure}
                          className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-all"
                        >
                          <FileDown size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-3">
            {filtered.map((project) => {
              const isSaved = savedIds.includes(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`group rounded-2xl overflow-hidden border p-3 cursor-pointer transition-all duration-200 flex gap-3 shadow-xs ${
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
                          className="opacity-70 hover:opacity-100"
                        >
                          <Bookmark
                            size={14}
                            className={isSaved ? 'text-amber-500 fill-amber-500' : ''}
                          />
                        </button>
                      </div>

                      <h2 className="text-xs font-bold truncate mt-0.5 group-hover:text-amber-500 transition-colors">
                        {language === 'ar' ? project.titleAr : project.titleEn}
                      </h2>
                      <p
                        className={`text-[11px] line-clamp-1 mt-0.5 ${
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
                      <div className="flex items-center gap-2 text-amber-500 font-semibold">
                        <span>{t.projectDetails}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
