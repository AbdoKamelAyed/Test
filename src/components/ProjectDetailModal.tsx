import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  FileDown,
  ExternalLink,
  MapPin,
  Calendar,
  Maximize2,
  Building,
  CheckCircle2,
  Sparkles,
  Layers,
  Compass,
  Check
} from 'lucide-react';
import { Language, Project, Theme } from '../types';
import { translations } from '../data/translations';
import { formatProjectMetrics, formatSharePayload } from '../utils/portfolioLogic';

interface ProjectDetailModalProps {
  project: Project;
  allProjects: Project[];
  language: Language;
  theme: Theme;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  onSelectRelated: (project: Project) => void;
  onOpenLightbox: (images: string[], index: number) => void;
  onOpenBrochure: (project: Project) => void;
  onOpenBlueprint: (project: Project) => void;
  onRequestConsultation: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  allProjects,
  language,
  theme,
  isSaved,
  onToggleSave,
  onClose,
  onSelectRelated,
  onOpenLightbox,
  onOpenBrochure,
  onOpenBlueprint,
  onRequestConsultation,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isRtl = language === 'ar';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const metrics = formatProjectMetrics(project.areaSqm, project.year, language);

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.featured))
    .slice(0, 3);

  const handleShare = async () => {
    const payload = formatSharePayload(project, language);
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(payload.url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className={`w-full max-w-lg h-[94vh] sm:h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden border shadow-2xl transition-colors ${
          isDark ? 'bg-stone-950 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Sticky Top Action Bar */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shrink-0 backdrop-blur-md z-20 ${
            isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-white/80 border-stone-200'
          }`}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            aria-label={t.back}
            className={`min-h-[40px] px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all ${
              isDark ? 'hover:bg-stone-800 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
            }`}
          >
            <BackIcon size={16} />
            <span>{t.back}</span>
          </button>

          {/* Right actions: Bookmark, Share, Close */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSave}
              aria-label={t.bookmarkProject}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
              }`}
            >
              <Bookmark
                size={17}
                className={isSaved ? 'text-amber-500 fill-amber-500' : 'opacity-70'}
              />
            </button>

            <button
              onClick={handleShare}
              aria-label={t.shareProject}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
              }`}
            >
              {copiedShare ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Share2 size={17} className="opacity-70" />
              )}
            </button>

            <button
              onClick={onClose}
              aria-label={t.close}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          {/* Main Image Showcase Stage */}
          <div className="relative aspect-[16/10] w-full bg-stone-900 overflow-hidden">
            <img
              src={project.images[activeImageIndex] || project.thumbnail}
              alt={language === 'ar' ? project.titleAr : project.titleEn}
              referrerPolicy="no-referrer"
              onClick={() => onOpenLightbox(project.images, activeImageIndex)}
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Tap to expand icon badge */}
            <button
              onClick={() => onOpenLightbox(project.images, activeImageIndex)}
              aria-label={t.fullscreenGallery}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 border border-white/10"
            >
              <Maximize2 size={12} />
              <span>{t.fullscreenGallery}</span>
            </button>

            {/* Title & Category overlay */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {language === 'ar' ? project.categoryAr : project.categoryEn}
              </span>
              <h1 className="text-xl font-bold leading-tight mt-0.5">
                {language === 'ar' ? project.titleAr : project.titleEn}
              </h1>
            </div>
          </div>

          {/* Gallery Thumbnails Strip */}
          {project.images.length > 1 && (
            <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-amber-500 scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quick Action Buttons (Brochure, Blueprint, Preview) */}
          <div className="px-4 py-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenBrochure(project)}
              className="min-h-[42px] px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <FileDown size={15} />
              <span>{t.downloadBrochure}</span>
            </button>

            <button
              onClick={() => onOpenBlueprint(project)}
              className={`min-h-[42px] px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isDark
                  ? 'bg-stone-900 border-stone-800 text-stone-200 hover:border-amber-500/50'
                  : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-amber-600/50'
              }`}
            >
              <Compass size={15} className="text-amber-500" />
              <span>{t.viewBlueprint}</span>
            </button>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="px-4 mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              {t.specs}
            </h2>
            <div
              className={`grid grid-cols-2 gap-2.5 p-3 rounded-2xl border ${
                isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <span className="text-[10px] opacity-60 block">{t.location}</span>
                <span className="text-xs font-semibold mt-0.5 block truncate">
                  {language === 'ar' ? project.locationAr : project.locationEn}
                </span>
              </div>

              <div>
                <span className="text-[10px] opacity-60 block">{t.area}</span>
                <span className="text-xs font-mono font-bold text-amber-500 mt-0.5 block">
                  {metrics.areaString}
                </span>
              </div>

              <div>
                <span className="text-[10px] opacity-60 block">{t.year}</span>
                <span className="text-xs font-mono font-semibold mt-0.5 block">
                  {project.year}
                </span>
              </div>

              <div>
                <span className="text-[10px] opacity-60 block">{t.client}</span>
                <span className="text-xs font-semibold mt-0.5 block truncate">
                  {language === 'ar' ? project.clientAr : project.clientEn}
                </span>
              </div>

              <div className="col-span-2 pt-1 border-t border-stone-800/20">
                <span className="text-[10px] opacity-60 block">{t.scope}</span>
                <span className="text-xs font-medium mt-0.5 block">
                  {language === 'ar' ? project.scopeAr : project.scopeEn}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="px-4 mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1.5">
              {language === 'ar' ? 'الرؤية والبيان المعماري' : 'Design Philosophy'}
            </h2>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              {language === 'ar' ? project.descriptionAr : project.descriptionEn}
            </p>
          </div>

          {/* Architectural Highlights */}
          <div className="px-4 mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              {t.architecturalHighlights}
            </h2>
            <div className="flex flex-col gap-2">
              {(language === 'ar' ? project.highlightsAr : project.highlightsEn).map((hl, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                    isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <Sparkles size={13} className="text-amber-500 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="px-4 mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
                {t.relatedProjects}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {relatedProjects.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className={`rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                      isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-stone-800 overflow-hidden">
                      <img
                        src={rel.thumbnail}
                        alt={language === 'ar' ? rel.titleAr : rel.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-[11px] font-bold truncate">
                        {language === 'ar' ? rel.titleAr : rel.titleEn}
                      </h4>
                      <span className="text-[10px] opacity-60 block mt-0.5">
                        {formatProjectMetrics(rel.areaSqm, rel.year, language).areaString}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Prompt */}
          <div className="px-4 mt-6">
            <button
              onClick={onRequestConsultation}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-amber-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{t.contactTitle}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
