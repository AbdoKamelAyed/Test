export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';
export type TabType = 'home' | 'projects' | 'categories' | 'saved' | 'contact';
export type ViewMode = 'grid' | 'list';

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string; // Machine key e.g. 'villas', 'compounds'
  categoryAr: string;
  categoryEn: string;
  thumbnail: string;
  images: string[];
  previewUrl: string;
  downloadUrl: string;
  featured: boolean;
  // Extended architectural specifications
  locationAr: string;
  locationEn: string;
  areaSqm: number;
  year: number;
  clientAr: string;
  clientEn: string;
  scopeAr: string;
  scopeEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  blueprintTitleAr?: string;
  blueprintTitleEn?: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  coverImage: string;
  count?: number;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  estimatedArea: string;
  location: string;
  notes: string;
}

export interface PortfolioStats {
  totalProjects: number;
  totalAreaSqm: number;
  featuredCount: number;
  yearsOfExperience: number;
  awardsCount: number;
}
