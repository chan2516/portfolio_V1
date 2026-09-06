import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  FileText, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Server, 
  Database,
  ExternalLink
} from 'lucide-react';
import { candidateInfo, contactData, candidateStats } from '../data/portfolioData';

interface HeroProps {
  isDarkMode: boolean;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ isDarkMode, onOpenResume }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
    >
      {/* Subtle Background Glow and Tech Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15), transparent 65%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-colors bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Java Developer</span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span>Strategic ERP Solutions</span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-xs opacity-90">Open to Opportunities</span>
            </div>

            {/* Candidate Identity */}
            <div className="space-y-3">
              <h1 className={`text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
                Hi, I'm <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 bg-clip-text text-transparent">{candidateInfo.name}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="font-mono">JAVA DEVELOPER</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="font-mono">SOFTWARE ENGINEER</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="font-mono">SDE-1</span>
              </div>

              {/* Location & Quick Contact Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{contactData.location}</span>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <button
                  onClick={() => copyToClipboard(contactData.phone, 'phone')}
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Click to copy phone number"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{contactData.phone}</span>
                  {copiedPhone ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-50" />}
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <button
                  onClick={() => copyToClipboard(contactData.email, 'email')}
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Click to copy email address"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span className="underline decoration-dotted underline-offset-2">{contactData.email}</span>
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-50" />}
                </button>
              </div>
            </div>

            {/* Professional Summary */}
            <p className={`text-base sm:text-lg leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {candidateInfo.summary}
            </p>

            {/* CTAs & External Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                id="hero-projects-cta"
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all duration-150"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-resume-cta"
                onClick={onOpenResume}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all duration-150 ${
                  isDarkMode
                    ? 'border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 hover:border-zinc-600'
                    : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 hover:border-zinc-400 shadow-xs'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>View ATS Resume</span>
              </button>

              <a
                id="hero-contact-cta"
                href="#contact"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all duration-150 ${
                  isDarkMode
                    ? 'border-zinc-800 bg-transparent hover:bg-zinc-800/60 text-zinc-300'
                    : 'border-zinc-200 bg-transparent hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>Contact Me</span>
              </a>

              {/* GitHub and LinkedIn Links */}
              <div className="flex items-center gap-2 ml-1">
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isDarkMode 
                      ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 shadow-xs'
                  }`}
                  title="View GitHub (Chan236)"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isDarkMode 
                      ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 shadow-xs'
                  }`}
                  title="View LinkedIn (chan2004)"
                >
                  <Linkedin className="w-4 h-4 text-blue-500" />
                </a>
              </div>
            </div>

            {/* Toast feedback for copy action */}
            {(copiedEmail || copiedPhone) && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-bottom-1">
                <Check className="w-3.5 h-3.5" />
                <span>{copiedEmail ? 'Email address copied to clipboard!' : 'Phone number copied to clipboard!'}</span>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Tech Architecture Snapshot Card */}
          <div className="lg:col-span-5">
            <div className={`rounded-2xl border p-6 transition-all relative shadow-xl ${
              isDarkMode
                ? 'bg-zinc-900/90 border-zinc-800/90 shadow-black/40'
                : 'bg-white border-zinc-200 shadow-zinc-200/50'
            }`}>
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    chandan@sde-environment:~
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Java 17 LTS
                </span>
              </div>

              {/* Code Preview Content */}
              <div className="pt-4 space-y-3 font-mono text-xs leading-relaxed">
                <div className="text-zinc-400 dark:text-zinc-500">
                  // Core Enterprise Profile
                </div>
                <div className="text-zinc-800 dark:text-zinc-200 space-y-1">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400">class</span>{' '}
                    <span className="text-amber-600 dark:text-amber-400">SoftwareEngineer</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">implements</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">SdeOne</span> {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-indigo-600 dark:text-indigo-400">String</span> currentRole ={' '}
                    <span className="text-emerald-600 dark:text-emerald-400">"Java Developer @ Strategic ERP"</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-indigo-600 dark:text-indigo-400">String[]</span> coreTech = {'{'}
                  </div>
                  <div className="pl-8 text-zinc-600 dark:text-zinc-300">
                    "Java 17", "Spring Boot 3", "Spring Security",<br />
                    "REST Microservices", "PostgreSQL", "Docker",<br />
                    "Next.js", "AWS EC2", "Banking APIs"
                  </div>
                  <div className="pl-4">{'}'};</div>
                  <div className="pl-4 pt-1">
                    <span className="text-purple-600 dark:text-purple-400">public void</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">deliverEnterpriseSolutions</span>() {'{'}
                  </div>
                  <div className="pl-8 text-emerald-600 dark:text-emerald-400">
                    integrateBankingGateways(3);<br />
                    optimizeQueryPerformance();<br />
                    enforceZeroDowntimeDeployments();
                  </div>
                  <div className="pl-4">{'}'}</div>
                  <div>{'}'}</div>
                </div>

                {/* Live Core Competencies Highlights */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Specialization</div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">Microservices & APIs</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Deployments</div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">Docker & AWS EC2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {candidateStats.map((stat, idx) => (
              <div 
                key={stat.label} 
                className={`p-4 rounded-xl border transition-all ${
                  isDarkMode 
                    ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
