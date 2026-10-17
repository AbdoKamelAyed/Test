import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  calculateDynamicStats,
  formatProjectMetrics,
  validateInquiryForm,
} from './portfolioLogic.ts';
import type { Project } from '../types/index.ts';

const mockProjects: Project[] = [
  {
    id: 'p1',
    titleAr: 'فيلا الساحل',
    titleEn: 'Coastal Villa',
    descriptionAr: 'تصميم بحري فاخر في دبي',
    descriptionEn: 'Luxury coastal design in Dubai',
    category: 'villas',
    categoryAr: 'فيلات',
    categoryEn: 'Villas',
    thumbnail: '/img1.jpg',
    images: ['/img1.jpg'],
    previewUrl: 'https://dusur.me/p1',
    downloadUrl: '/p1.pdf',
    featured: true,
    locationAr: 'دبي',
    locationEn: 'Dubai',
    areaSqm: 450,
    year: 2024,
    clientAr: 'عميل 1',
    clientEn: 'Client 1',
    scopeAr: 'تصميم معماري',
    scopeEn: 'Architecture',
    highlightsAr: ['مسبح'],
    highlightsEn: ['Pool'],
  },
  {
    id: 'p2',
    titleAr: 'مجمع تجاري',
    titleEn: 'Commercial Mall',
    descriptionAr: 'مركز تسوق ضخم في أبوظبي',
    descriptionEn: 'Grand retail center in Abu Dhabi',
    category: 'commercial',
    categoryAr: 'تجاري',
    categoryEn: 'Commercial',
    thumbnail: '/img2.jpg',
    images: ['/img2.jpg'],
    previewUrl: 'https://dusur.me/p2',
    downloadUrl: '/p2.pdf',
    featured: false,
    locationAr: 'أبوظبي',
    locationEn: 'Abu Dhabi',
    areaSqm: 15000,
    year: 2023,
    clientAr: 'عميل 2',
    clientEn: 'Client 2',
    scopeAr: 'تصميم تجاري',
    scopeEn: 'Commercial design',
    highlightsAr: ['بهو زجاجي'],
    highlightsEn: ['Glass atrium'],
  },
];

test('filterProjects filters by category accurately', () => {
  const villas = filterProjects(mockProjects, { category: 'villas' });
  assert.equal(villas.length, 1);
  assert.equal(villas[0].id, 'p1');

  const commercial = filterProjects(mockProjects, { category: 'commercial' });
  assert.equal(commercial.length, 1);
  assert.equal(commercial[0].id, 'p2');

  const all = filterProjects(mockProjects, { category: 'all' });
  assert.equal(all.length, 2);
});

test('filterProjects filters by featured flag', () => {
  const featuredOnly = filterProjects(mockProjects, { featuredOnly: true });
  assert.equal(featuredOnly.length, 1);
  assert.equal(featuredOnly[0].id, 'p1');
});

test('filterProjects searches across Arabic and English terms', () => {
  const searchAr = filterProjects(mockProjects, { searchQuery: 'أبوظبي' });
  assert.equal(searchAr.length, 1);
  assert.equal(searchAr[0].id, 'p2');

  const searchEn = filterProjects(mockProjects, { searchQuery: 'coastal' });
  assert.equal(searchEn.length, 1);
  assert.equal(searchEn[0].id, 'p1');

  const nonExistent = filterProjects(mockProjects, { searchQuery: 'nonexistenttermxyz' });
  assert.equal(nonExistent.length, 0);
});

test('calculateDynamicStats computes total projects and area correctly', () => {
  const stats = calculateDynamicStats(mockProjects);
  assert.equal(stats.total, 2);
  assert.equal(stats.totalArea, 15450);
  assert.equal(stats.featured, 1);
  assert.equal(stats.categoryCounts['villas'], 1);
  assert.equal(stats.categoryCounts['commercial'], 1);
});

test('formatProjectMetrics formats area and year properly', () => {
  const arMetrics = formatProjectMetrics(1200, 2024, 'ar');
  assert.match(arMetrics.areaString, /م²/);
  assert.equal(arMetrics.yearString, '2024');

  const enMetrics = formatProjectMetrics(1200, 2024, 'en');
  assert.equal(enMetrics.areaString, '1,200 sqm');
  assert.equal(enMetrics.yearString, '2024');
});

test('validateInquiryForm detects errors and passes valid inputs', () => {
  const invalid = validateInquiryForm(
    {
      fullName: '',
      email: 'bad-email',
      phone: '',
      projectType: 'villas',
      estimatedArea: '500',
      location: 'Dubai',
      notes: '',
    },
    'en'
  );

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.notes);

  const valid = validateInquiryForm(
    {
      fullName: 'Sultan Al Qasimi',
      email: 'sultan@example.ae',
      phone: '+971501234567',
      projectType: 'villas',
      estimatedArea: '800',
      location: 'Dubai',
      notes: 'Planning to build a private seaside villa with sustainable materials.',
    },
    'ar'
  );

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
