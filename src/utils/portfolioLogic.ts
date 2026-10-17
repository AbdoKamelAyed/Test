import type { InquiryFormData, Language, Project } from '../types/index.ts';

export interface FilterOptions {
  category?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
  lang?: Language;
}

/**
 * Filter and search projects based on category, text query, and featured state
 */
export function filterProjects(projects: Project[], options: FilterOptions): Project[] {
  const { category = 'all', searchQuery = '', featuredOnly = false } = options;
  const query = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    // Category match
    if (category !== 'all' && project.category !== category) {
      return false;
    }

    // Featured only
    if (featuredOnly && !project.featured) {
      return false;
    }

    // Search query matching across title, description, category, and location
    if (query) {
      const matchAr =
        project.titleAr.toLowerCase().includes(query) ||
        project.descriptionAr.toLowerCase().includes(query) ||
        project.categoryAr.toLowerCase().includes(query) ||
        project.locationAr.toLowerCase().includes(query);

      const matchEn =
        project.titleEn.toLowerCase().includes(query) ||
        project.descriptionEn.toLowerCase().includes(query) ||
        project.categoryEn.toLowerCase().includes(query) ||
        project.locationEn.toLowerCase().includes(query);

      if (!matchAr && !matchEn) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculate dynamic portfolio statistics from project list
 */
export function calculateDynamicStats(projects: Project[]) {
  const total = projects.length;
  const totalArea = projects.reduce((acc, p) => acc + (p.areaSqm || 0), 0);
  const featured = projects.filter((p) => p.featured).length;

  const categoryCounts: Record<string, number> = {};
  for (const p of projects) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  return {
    total,
    totalArea,
    featured,
    categoryCounts,
  };
}

/**
 * Format project metrics nicely based on language
 */
export function formatProjectMetrics(areaSqm: number, year: number, lang: Language) {
  const formattedArea = areaSqm.toLocaleString(lang === 'ar' ? 'ar-AE' : 'en-US');
  const unit = lang === 'ar' ? 'م²' : 'sqm';
  return {
    areaString: `${formattedArea} ${unit}`,
    yearString: String(year),
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof InquiryFormData, string>>;
}

/**
 * Validate inquiry consultation form
 */
export function validateInquiryForm(data: InquiryFormData, lang: Language): ValidationResult {
  const errors: Partial<Record<keyof InquiryFormData, string>> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName =
      lang === 'ar' ? 'يرجى إدخال الاسم الكامل (حرفين على الأقل)' : 'Please enter your full name (at least 2 letters)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email =
      lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please provide a valid email address';
  }

  if (!data.phone || data.phone.trim().length < 6) {
    errors.phone =
      lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح للتواصل' : 'Please provide a valid telephone number';
  }

  if (!data.notes || data.notes.trim().length < 5) {
    errors.notes =
      lang === 'ar' ? 'يرجى كتابة نبذة مختصرة عن متطلبات المشروع' : 'Please provide a brief summary of your project vision';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generate a shareable URL or message payload
 */
export function formatSharePayload(project: Project, lang: Language) {
  const title = lang === 'ar' ? project.titleAr : project.titleEn;
  const desc = lang === 'ar' ? project.descriptionAr : project.descriptionEn;
  const brand = lang === 'ar' ? 'دُسُر (DUSUR) للعمارة والتصميم' : 'DUSUR Luxury Architecture';

  return {
    title: `${title} | ${brand}`,
    text: `${title}\n${desc.slice(0, 140)}...`,
    url: window?.location?.href || 'https://dusur.me',
  };
}
