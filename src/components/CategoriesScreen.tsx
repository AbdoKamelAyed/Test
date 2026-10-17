import React from 'react';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { Language, Theme } from '../types';
import { CATEGORIES } from '../data/projectsData';
import { translations } from '../data/translations';

interface CategoriesScreenProps {
  language: Language;
  theme: Theme;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  language,
  theme,
  onSelectCategory,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col pb-24 px-4 pt-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">
          {t.categoriesTitle}
        </h1>
        <p
          className={`text-xs mt-1 leading-relaxed ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}
        >
          {language === 'ar'
            ? 'استكشف مشاريع دُسُر المعمارية مقسمة حسب النمط الهندسي والاستخدام الوظيفي.'
            : 'Explore DUSUR architectural creations classified by spatial typology and design function.'}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm ${
              isDark
                ? 'bg-stone-900 border-stone-800 hover:border-amber-500/50'
                : 'bg-white border-stone-200 hover:border-amber-500/50'
            }`}
          >
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone-800">
              <img
                src={cat.coverImage}
                alt={language === 'ar' ? cat.nameAr : cat.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {cat.count} {language === 'ar' ? 'مشاريع معمارية' : 'Curated Works'}
                  </span>
                  <h3 className="text-base font-bold mt-0.5">
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ArrowIcon size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Card */}
        <div
          onClick={() => onSelectCategory('all')}
          className={`p-4 rounded-2xl border border-dashed cursor-pointer text-center transition-all flex items-center justify-center gap-2 ${
            isDark
              ? 'border-stone-700 hover:border-amber-500 text-stone-300'
              : 'border-stone-300 hover:border-amber-600 text-stone-700'
          }`}
        >
          <Layers size={16} className="text-amber-500" />
          <span className="text-xs font-bold">{t.viewAllProjects}</span>
        </div>
      </div>
    </div>
  );
};
