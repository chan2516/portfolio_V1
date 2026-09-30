import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ExternalLink, FolderGit2, Github, Layers3, Monitor, Radio } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

interface ProjectsSectionProps { isDarkMode: boolean; }
type ViewMode = 'preview' | 'details' | 'architecture';

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isDarkMode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('localcart');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const project = projectsData.find((item) => item.id === selectedProjectId) ?? projectsData[0];
  const hasLivePreview = Boolean(project.liveUrl?.startsWith('http') && !project.liveUrl.includes('github.com'));

  const selectProject = (id: string) => {
    setSelectedProjectId(id);
    const next = projectsData.find((item) => item.id === id);
    setViewMode(next?.liveUrl && !next.liveUrl.includes('github.com') ? 'preview' : 'details');
  };

  return (
    <section id="projects" className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
            <FolderGit2 className="w-3.5 h-3.5" /> FEATURED WORK
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Projects you can inspect</h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">Explore the deployed product, review its engineering decisions, or open the source repository.</p>
        </div>

        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
          <aside className="space-y-3">
            {projectsData.map((item) => (
              <button key={item.id} onClick={() => selectProject(item.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedProjectId === item.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400'}`}>
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${selectedProjectId === item.id ? 'text-indigo-100' : 'text-zinc-500'}`}>{item.category}</span>
                <span className="block mt-1 text-lg font-bold">{item.title}</span>
                <span className={`block mt-1 text-xs leading-relaxed ${selectedProjectId === item.id ? 'text-indigo-100' : 'text-zinc-500'}`}>{item.subtitle}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold">View case study <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </button>
            ))}
          </aside>

          <div className="min-w-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl shadow-zinc-200/40 dark:shadow-black/30">
            <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500"><Radio className={`w-3.5 h-3.5 ${hasLivePreview ? 'text-emerald-500' : 'text-zinc-400'}`} />{hasLivePreview ? 'Live deployment available' : 'Source project'}</div>
                <h3 className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">{project.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {hasLivePreview && <button onClick={() => setViewMode('preview')} className={`project-view-button ${viewMode === 'preview' ? 'project-view-button-active' : ''}`}><Monitor className="w-3.5 h-3.5" /> Live Preview</button>}
                <button onClick={() => setViewMode('details')} className={`project-view-button ${viewMode === 'details' ? 'project-view-button-active' : ''}`}><CheckCircle2 className="w-3.5 h-3.5" /> Case Study</button>
                <button onClick={() => setViewMode('architecture')} className={`project-view-button ${viewMode === 'architecture' ? 'project-view-button-active' : ''}`}><Layers3 className="w-3.5 h-3.5" /> Architecture</button>
              </div>
            </div>

            {viewMode === 'preview' && hasLivePreview && (
              <div className="p-4 sm:p-6">
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950">
                  <div className="h-11 px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 min-w-0"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span className="ml-2 text-xs font-mono text-zinc-500 truncate">{project.liveUrl}</span></div>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Open site <ExternalLink className="w-3.5 h-3.5" /></a>
                  </div>
                  <iframe src={project.liveUrl} title={`${project.title} live application`} loading="lazy" className="w-full h-[420px] sm:h-[560px] bg-white" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" />
                </div>
                <p className="mt-3 text-xs text-zinc-500">Interactive preview. If the application blocks embedded views, use “Open site” to launch it directly.</p>
              </div>
            )}

            {viewMode === 'details' && (
              <div className="p-5 sm:p-8 grid xl:grid-cols-[minmax(0,1fr)_280px] gap-8">
                <div>
                  <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{project.summary}</p>
                  <div className="mt-6 space-y-3">
                    {project.bullets.map((bullet) => <div key={bullet} className="flex gap-3"><CheckCircle2 className="w-4 h-4 mt-1 text-emerald-500 shrink-0" /><p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{bullet}</p></div>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Technology</h4>
                  <div className="mt-3 flex flex-wrap gap-2">{project.techStack.map((tech) => <span key={tech} className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono">{tech}</span>)}</div>
                </div>
              </div>
            )}

            {viewMode === 'architecture' && (
              <div className="p-5 sm:p-8 space-y-3">
                {project.architectureDetails.map((step, index) => <div key={step.title} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex gap-4"><span className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-mono font-bold text-xs shrink-0">{index + 1}</span><div><h4 className="font-bold text-sm">{step.title}</h4><p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{step.desc}</p><span className="inline-block mt-2 text-xs font-mono text-indigo-600 dark:text-indigo-400">{step.badge}</span></div></div>)}
              </div>
            )}

            <div className="px-5 sm:px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-zinc-50 dark:bg-zinc-950/50">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold"><Github className="w-4 h-4" /> View source</a>
              {hasLivePreview && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-semibold">Launch application <ExternalLink className="w-4 h-4" /></a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
