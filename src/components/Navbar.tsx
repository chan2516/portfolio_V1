import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Github, 
  Linkedin, 
  Mail, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { candidateInfo, contactData } from '../data/portfolioData';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'experience', 'projects', 'code', 'skills', 'education', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Architecture & Code', href: '#code' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education & Certs', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? isDarkMode
            ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 shadow-md shadow-black/20'
            : 'bg-white/85 backdrop-blur-md border-b border-zinc-200/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <a
          id="nav-brand-link"
          href="#hero"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>
              <Terminal className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className={`font-bold text-base tracking-tight flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              <span>Chandan</span>
              <span className="text-indigo-500 font-mono text-sm">.java</span>
            </div>
            <div className={`text-xs font-mono hidden sm:block ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Java SDE-1 • Spring Boot
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                id={`nav-link-${sectionId}`}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? isDarkMode
                      ? 'text-indigo-400 bg-zinc-800/80 font-semibold'
                      : 'text-indigo-600 bg-indigo-50/80 font-semibold'
                    : isDarkMode
                    ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions & Socials */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub & LinkedIn quick icons */}
          <a
            id="nav-github-link"
            href={contactData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Github className="w-4.5 h-4.5" />
          </a>
          <a
            id="nav-linkedin-link"
            href={contactData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Linkedin className="w-4.5 h-4.5" />
          </a>

          {/* Theme Switcher */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-amber-400 hover:bg-zinc-800'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Resume Modal Trigger */}
          <button
            id="nav-resume-btn"
            onClick={onOpenResume}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-sm shadow-indigo-500/25 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className={`p-2 rounded-lg lg:hidden transition-colors ${
              isDarkMode
                ? 'text-zinc-300 hover:bg-zinc-800'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-menu"
          className={`lg:hidden border-b px-4 pt-2 pb-6 space-y-2 transition-all ${
            isDarkMode
              ? 'bg-zinc-950/95 border-zinc-800 text-white'
              : 'bg-white/95 border-zinc-200 text-zinc-900'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isDarkMode
                  ? 'hover:bg-zinc-800 hover:text-indigo-400 text-zinc-300'
                  : 'hover:bg-zinc-100 hover:text-indigo-600 text-zinc-700'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-zinc-800/40 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Resume</span>
            </button>
            <a
              href={`mailto:${contactData.email}`}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                isDarkMode
                  ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Chandan Directly</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
