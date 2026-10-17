/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Project, TabType, Theme } from './types';
import { PROJECTS } from './data/projectsData';
import { StatusBar } from './components/StatusBar';
import { TopAppBar } from './components/TopAppBar';
import { BottomTabBar } from './components/BottomTabBar';
import { HomeScreen } from './components/HomeScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { SavedScreen } from './components/SavedScreen';
import { ContactScreen } from './components/ContactScreen';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { LightboxModal } from './components/LightboxModal';
import { BrochurePreviewModal } from './components/BrochurePreviewModal';
import { BlueprintModal } from './components/BlueprintModal';
import { DeviceFrameToggle } from './components/DeviceFrameToggle';

export default function App() {
  // Persistent language
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dusur_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // Persistent theme
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dusur_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Saved bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dusur_saved_projects');
      return saved ? JSON.parse(saved) : ['project-mediterranean-villa'];
    } catch {
      return ['project-mediterranean-villa'];
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; index: number; title: string } | null>(null);
  const [brochureProject, setBrochureProject] = useState<Project | null>(null);
  const [blueprintProject, setBlueprintProject] = useState<Project | null>(null);

  // Desktop device frame simulation
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Synchronize document dir and lang attributes
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('dusur_lang', language);
  }, [language]);

  // Synchronize theme attribute & storage
  useEffect(() => {
    localStorage.setItem('dusur_theme', theme);
  }, [theme]);

  // Synchronize bookmarks storage
  useEffect(() => {
    localStorage.setItem('dusur_saved_projects', JSON.stringify(savedIds));
  }, [savedIds]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleSave = (projectId: string) => {
    setSavedIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleClearAllSaved = () => {
    setSavedIds([]);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('projects');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col items-center justify-start ${
        isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-100 text-stone-900'
      }`}
    >
      {/* Desktop Mode Switcher */}
      <DeviceFrameToggle
        isDeviceFrame={isDeviceFrame}
        onToggleFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        language={language}
        theme={theme}
      />

      {/* Main Container - Either iPhone Device Mockup Frame or Responsive Viewport */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isDeviceFrame
            ? 'max-w-md my-0 lg:my-8 lg:rounded-[48px] lg:border-[10px] lg:border-stone-800 lg:shadow-2xl overflow-hidden min-h-screen lg:min-h-[850px] lg:max-h-[920px] flex flex-col'
            : 'max-w-xl mx-auto min-h-screen flex flex-col'
        } ${isDark ? 'bg-stone-950' : 'bg-stone-50'}`}
      >
        {/* Mobile Status Bar */}
        <StatusBar theme={theme} />

        {/* Top App Bar */}
        <TopAppBar
          language={language}
          onToggleLanguage={handleToggleLanguage}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenSearch={() => {
            setActiveTab('projects');
          }}
          onOpenSaved={() => setActiveTab('saved')}
          savedCount={savedIds.length}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {activeTab === 'home' && (
            <HomeScreen
              projects={PROJECTS}
              language={language}
              theme={theme}
              onSelectProject={(project) => setSelectedProject(project)}
              onSelectCategory={handleSelectCategory}
              onViewAllProjects={() => {
                setSelectedCategory('all');
                setActiveTab('projects');
              }}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
              onRequestInquiry={() => setActiveTab('contact')}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsScreen
              projects={PROJECTS}
              language={language}
              theme={theme}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProject={(project) => setSelectedProject(project)}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
              onQuickDownload={(project) => setBrochureProject(project)}
              onQuickPreview={(project) => setSelectedProject(project)}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesScreen
              language={language}
              theme={theme}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === 'saved' && (
            <SavedScreen
              projects={PROJECTS}
              savedIds={savedIds}
              language={language}
              theme={theme}
              onSelectProject={(project) => setSelectedProject(project)}
              onToggleSave={handleToggleSave}
              onClearAllSaved={handleClearAllSaved}
              onExploreProjects={() => {
                setSelectedCategory('all');
                setActiveTab('projects');
              }}
            />
          )}

          {activeTab === 'contact' && (
            <ContactScreen language={language} theme={theme} />
          )}
        </main>

        {/* Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          language={language}
          theme={theme}
          savedCount={savedIds.length}
        />

        {/* Home Indicator line on mobile device frame */}
        {isDeviceFrame && (
          <div className="hidden lg:flex justify-center pb-2 pt-1 pointer-events-none">
            <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-stone-700' : 'bg-stone-300'}`} />
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          allProjects={PROJECTS}
          language={language}
          theme={theme}
          isSaved={savedIds.includes(selectedProject.id)}
          onToggleSave={() => handleToggleSave(selectedProject.id)}
          onClose={() => setSelectedProject(null)}
          onSelectRelated={(p) => setSelectedProject(p)}
          onOpenLightbox={(images, index) =>
            setLightboxData({
              images,
              index,
              title: language === 'ar' ? selectedProject.titleAr : selectedProject.titleEn,
            })
          }
          onOpenBrochure={(p) => setBrochureProject(p)}
          onOpenBlueprint={(p) => setBlueprintProject(p)}
          onRequestConsultation={() => {
            setSelectedProject(null);
            setActiveTab('contact');
          }}
        />
      )}

      {/* Full-Screen Image Lightbox */}
      {lightboxData && (
        <LightboxModal
          images={lightboxData.images}
          initialIndex={lightboxData.index}
          projectTitle={lightboxData.title}
          language={language}
          onClose={() => setLightboxData(null)}
        />
      )}

      {/* Architectural Brochure / Dossier Viewer Modal */}
      {brochureProject && (
        <BrochurePreviewModal
          project={brochureProject}
          language={language}
          theme={theme}
          onClose={() => setBrochureProject(null)}
        />
      )}

      {/* Architectural CAD Blueprint Modal */}
      {blueprintProject && (
        <BlueprintModal
          project={blueprintProject}
          language={language}
          theme={theme}
          onClose={() => setBlueprintProject(null)}
        />
      )}
    </div>
  );
}
