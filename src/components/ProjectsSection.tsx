import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Layers, 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  CheckCircle, 
  ArrowUpRight, 
  Box, 
  RefreshCw,
  Terminal,
  Columns
} from 'lucide-react';
import { projectsData } from '../data/portfolioData';

interface ProjectsSectionProps {
  isDarkMode: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isDarkMode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('localcart');
  const [viewMode, setViewMode] = useState<'details' | 'architecture'>('details');

  const currentProject = projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];

  return (
    <section id="projects" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>FEATURED WORK</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
              Full-Stack & Systems Projects
            </h2>
            <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Production-grade software architectures engineered with Java Spring Boot, Next.js/React, Docker orchestration, and cloud infrastructure.
            </p>
          </div>

          {/* Project Switcher Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start">
            {projectsData.map((project) => (
              <button
                key={project.id}
                id={`project-tab-${project.id}`}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setViewMode('details');
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  selectedProjectId === project.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Project Card */}
        <div className={`rounded-2xl border transition-all overflow-hidden ${
          isDarkMode
            ? 'bg-zinc-900/80 border-zinc-800 shadow-2xl shadow-black/40'
            : 'bg-white border-zinc-200/90 shadow-lg shadow-zinc-200/50'
        }`}>
          {/* Project Banner & Meta Header */}
          <div className={`p-6 sm:p-8 border-b ${
            isDarkMode ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-100 bg-zinc-50/80'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                    {currentProject.category}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {currentProject.subtitle}
                  </span>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
                  {currentProject.title}
                </h3>
              </div>

              {/* View Switcher & External Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700">
                  <button
                    onClick={() => setViewMode('details')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === 'details'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Project Details
                  </button>
                  <button
                    onClick={() => setViewMode('architecture')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === 'architecture'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Architecture Diagram
                  </button>
                </div>

                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    isDarkMode
                      ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Project Body */}
          <div className="p-6 sm:p-8">
            {viewMode === 'details' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Narrative & Bullets */}
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      System Overview
                    </h4>
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {currentProject.summary}
                    </p>
                  </div>

                  {/* Resume Bullets */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Key Engineering Accomplishments
                    </h4>
                    <div className="space-y-2.5">
                      {currentProject.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                          <span className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="pt-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                      Core Functional Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentProject.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
                            isDarkMode
                              ? 'bg-zinc-950/40 border-zinc-800 text-zinc-300'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Tech Stack & System Highlights */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Key Metrics */}
                  {currentProject.metrics && (
                    <div className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Operational Specs
                      </h4>
                      <div className="space-y-2.5">
                        {currentProject.metrics.map((m) => (
                          <div key={m.label} className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">{m.label}</span>
                            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack List */}
                  <div className={`p-5 rounded-xl border space-y-3 ${
                    isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Technologies & Tools
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
                            isDarkMode
                              ? 'bg-zinc-900 text-indigo-300 border-zinc-700/70'
                              : 'bg-white text-indigo-700 border-zinc-200'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Note */}
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isDarkMode ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}>
                    <span className="font-semibold block mb-1">Architecture Highlights:</span>
                    {selectedProjectId === 'localcart' ? (
                      <span>
                        Utilizes multi-stage Dockerfiles, Nginx TLS termination, and Watchtower polling Docker Hub every 5 mins to enable automated rolling updates without server downtime.
                      </span>
                    ) : (
                      <span>
                        Implements dual JWT token model (short-lived access tokens + secured refresh tokens) alongside Spring Data JPA custom sorting & pageable repositories.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Architecture Diagram View */
              <div className="space-y-6">
                <div className="space-y-1">
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {currentProject.title} — System Topology & Data Flow
                  </h4>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Detailed breakdown of each tier across client, edge proxy, application server, and persistence storage.
                  </p>
                </div>

                {/* Interactive Topology Cards */}
                <div className="space-y-3">
                  {currentProject.architectureDetails.map((step, idx) => (
                    <div
                      key={step.title}
                      className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isDarkMode
                          ? 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
                            {step.title}
                          </h5>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 self-start sm:self-center">
                        <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {step.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LocalCart Docker Compose Visualization */}
                {selectedProjectId === 'localcart' && (
                  <div className={`p-5 rounded-xl border font-mono text-xs ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}>
                    <div className="text-zinc-500 mb-2 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>AWS EC2 Docker Compose Container Network (5 Services)</span>
                    </div>
                    <div className="text-zinc-400 space-y-1">
                      <div>[User Browser / SSL 443] ➔ [localcart-nginx (Reverse Proxy)]</div>
                      <div className="pl-4">├── SSR Traffic ➔ [localcart-frontend (Next.js)]</div>
                      <div className="pl-4">└── API Requests ➔ [localcart-api (Java 17 Spring Boot)]</div>
                      <div className="pl-12">├── Relational Data ➔ [localcart-postgres (PostgreSQL 15)]</div>
                      <div className="pl-12">└── Cached Catalog ➔ [localcart-redis (Redis 7)]</div>
                      <div>[containrrr/watchtower] ➔ Polling registry for rolling container rebuilds (0-downtime)</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
