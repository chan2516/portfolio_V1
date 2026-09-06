import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CodeSnippetPreview } from './components/CodeSnippetPreview';
import { SkillsSection } from './components/SkillsSection';
import { EducationCertifications } from './components/EducationCertifications';
import { ContactSection } from './components/ContactSection';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check user preference or default to sleek dark theme
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default to developer dark theme
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white ${
        isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50/50 text-zinc-900'
      }`}
    >
      {/* Navigation Header */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          isDarkMode={isDarkMode}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <ExperienceSection isDarkMode={isDarkMode} />
        <ProjectsSection isDarkMode={isDarkMode} />
        <CodeSnippetPreview isDarkMode={isDarkMode} />
        <SkillsSection isDarkMode={isDarkMode} />
        <EducationCertifications isDarkMode={isDarkMode} />
        <ContactSection isDarkMode={isDarkMode} />
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Full ATS Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
