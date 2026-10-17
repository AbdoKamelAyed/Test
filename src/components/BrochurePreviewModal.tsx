import React, { useState } from 'react';
import { X, Download, Printer, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Language, Project, Theme } from '../types';
import { translations } from '../data/translations';
import { formatProjectMetrics } from '../utils/portfolioLogic';

interface BrochurePreviewModalProps {
  project: Project;
  language: Language;
  theme: Theme;
  onClose: () => void;
}

export const BrochurePreviewModal: React.FC<BrochurePreviewModalProps> = ({
  project,
  language,
  theme,
  onClose,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const metrics = formatProjectMetrics(project.areaSqm, project.year, language);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create and trigger mock PDF brief download blob
      const content = `
=============================================================================
DUSUR (دُسُر) - ARCHITECTURAL PROJECT DOSSIER & SPECIFICATIONS
=============================================================================

Project Name (EN): ${project.titleEn}
Project Name (AR): ${project.titleAr}
Typology: ${project.categoryEn} / ${project.categoryAr}
Location: ${project.locationEn} / ${project.locationAr}
Gross Built-up Area: ${project.areaSqm} sqm (${metrics.areaString})
Completion Year: ${project.year}
Client: ${project.clientEn}
Scope of Work: ${project.scopeEn}

KEY ARCHITECTURAL HIGHLIGHTS:
${project.highlightsEn.map((h, i) => `${i + 1}. ${h}`).join('\n')}

DESCRIPTION:
${project.descriptionEn}

ARABIC BRIEF:
${project.descriptionAr}

OFFICIAL CHANNELS & VERIFICATION:
Studio: DUSUR Luxury Architecture & Design (دُسُر)
Offices: Dubai · Abu Dhabi · Riyadh
Website: https://dusur.me
Contact: contact@dusur.me | +971 4 234 5678
=============================================================================
`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DUSUR_${project.id.toUpperCase()}_BRIEF.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden border shadow-2xl transition-all ${
          isDark ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-stone-800/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              D
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight">
                {language === 'ar' ? 'كتيب العرض المعماري الرسمي' : 'Official Architectural Dossier'}
              </span>
              <span className="text-[10px] opacity-60 block">
                DUSUR · {project.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label={t.printOrSave}
              className={`p-2 rounded-full border transition-all ${
                isDark ? 'hover:bg-stone-800 border-stone-800' : 'hover:bg-stone-100 border-stone-200'
              }`}
            >
              <Printer size={15} />
            </button>

            <button
              onClick={onClose}
              aria-label={t.close}
              className={`p-2 rounded-full border transition-all ${
                isDark ? 'hover:bg-stone-800 border-stone-800' : 'hover:bg-stone-100 border-stone-200'
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-5">
          {/* Cover Strip */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/8] bg-stone-800 border border-stone-700/30">
            <img
              src={project.thumbnail}
              alt={language === 'ar' ? project.titleAr : project.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {language === 'ar' ? project.categoryAr : project.categoryEn}
              </span>
              <h2 className="text-lg font-bold">
                {language === 'ar' ? project.titleAr : project.titleEn}
              </h2>
            </div>
          </div>

          {/* Verification Badge */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
              isDark ? 'bg-stone-950/60 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <ShieldCheck size={18} className="text-amber-500 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-amber-500">
                {language === 'ar' ? 'وثيقة هندسية معتمدة' : 'Verified Architectural Commission'}
              </span>
              <p className="text-[10px] opacity-70">
                {language === 'ar'
                  ? 'تمت مراجعة المواصفات واعتمادها من استوديو دُسُر للتصميم المعماري.'
                  : 'Technical drawings and spatial parameters certified by DUSUR Principal Architects.'}
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
              {t.specs}
            </h3>
            <div
              className={`rounded-2xl border divide-y overflow-hidden text-xs ${
                isDark ? 'bg-stone-950/40 border-stone-800 divide-stone-800' : 'bg-stone-50 border-stone-200 divide-stone-200'
              }`}
            >
              <div className="p-3 flex items-center justify-between">
                <span className="opacity-70">{t.location}</span>
                <span className="font-semibold">{language === 'ar' ? project.locationAr : project.locationEn}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="opacity-70">{t.area}</span>
                <span className="font-mono font-semibold">{metrics.areaString}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="opacity-70">{t.year}</span>
                <span className="font-mono font-semibold">{project.year}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="opacity-70">{t.client}</span>
                <span className="font-semibold">{language === 'ar' ? project.clientAr : project.clientEn}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="opacity-70">{t.scope}</span>
                <span className="font-semibold">{language === 'ar' ? project.scopeAr : project.scopeEn}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1.5">
              {language === 'ar' ? 'البيان المعماري والتصميمي' : 'Architectural Concept Statement'}
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              {language === 'ar' ? project.descriptionAr : project.descriptionEn}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              {t.architecturalHighlights}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {(language === 'ar' ? project.highlightsAr : project.highlightsEn).map((item, idx) => (
                <li
                  key={idx}
                  className={`text-xs flex items-center gap-2 ${
                    isDark ? 'text-stone-300' : 'text-stone-700'
                  }`}
                >
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800/20 flex items-center justify-between gap-3">
          <a
            href={project.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark ? 'hover:bg-stone-800 border-stone-800' : 'hover:bg-stone-100 border-stone-200'
            }`}
          >
            <ExternalLink size={14} />
            <span>{t.interactivePreview}</span>
          </a>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 min-h-[44px] px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-amber-900/30 transition-all active:scale-[0.98]"
          >
            {downloading ? (
              <span>{t.downloadingPDF}</span>
            ) : downloaded ? (
              <>
                <Check size={16} />
                <span>{t.downloadComplete}</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>{t.downloadBrochure}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
