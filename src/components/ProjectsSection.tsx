import { PortfolioImage } from './PortfolioImage';
import { usePortfolioData } from '../siteConfig';
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, ExternalLink, FolderGit2, Github, Layers3, Monitor, Radio, Plus, Trash2 } from 'lucide-react';

interface ProjectsSectionProps { isDarkMode: boolean; isEditable?: boolean; }
type ViewMode = 'preview' | 'details' | 'architecture';

// Inline Editor Component
const EditableField = ({ value, isEditable, onSave, multiline = false, className = '', placeholder = '' }: any) => {
  const [text, setText] = useState(value || '');
  useEffect(() => setText(value || ''), [value]);

  if (!isEditable) {
    if (!value) return null;
    return <span className={className}>{value}</span>;
  }

  const handleBlur = () => {
    if (text !== value) onSave(text);
  };

  if (multiline) {
    return (
      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)} 
        onBlur={handleBlur} 
        placeholder={placeholder}
        className={`bg-indigo-50 dark:bg-indigo-900/20 outline-none border border-indigo-300 dark:border-indigo-700 border-dashed rounded w-full p-1 focus:border-solid focus:bg-white dark:focus:bg-zinc-900 ${className}`} 
        rows={4}
      />
    );
  }

  return (
    <input 
      type="text" 
      value={text} 
      onChange={e => setText(e.target.value)} 
      onBlur={handleBlur} 
      placeholder={placeholder}
      className={`bg-indigo-50 dark:bg-indigo-900/20 outline-none border border-indigo-300 dark:border-indigo-700 border-dashed rounded w-full p-1 focus:border-solid focus:bg-white dark:focus:bg-zinc-900 ${className}`} 
    />
  );
};


export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isDarkMode, isEditable = false }) => {
  const managedContent = usePortfolioData().projectsData;
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjectsData(data);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
          setViewMode(data[0].liveUrl && !data[0].liveUrl.includes('github.com') ? 'preview' : 'details');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load projects", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (managedContent !== undefined) { setProjectsData(managedContent); setLoading(false); return; }
    fetchProjects();
  }, [managedContent]);

  const project = projectsData.find((item) => item.id === selectedProjectId) ?? projectsData[0];
  const hasLivePreview = Boolean(project?.liveUrl?.startsWith('http') && !project.liveUrl.includes('github.com'));

  const selectProject = (id: string) => {
    setSelectedProjectId(id);
    const next = projectsData.find((item) => item.id === id);
    setViewMode(next?.liveUrl && !next.liveUrl.includes('github.com') ? 'preview' : 'details');
  };

  const handleUpdate = async (field: string, newValue: any) => {
    if (!project) return;
    
    // Optimistic UI update
    const updatedProject = { ...project, [field]: newValue };
    setProjectsData(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    
    // Save to DB
    await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: newValue })
    });
  };

  const handleAddNewProject = async () => {
    const id = `project-${Date.now()}`;
    const newProj = {
      id,
      title: 'New Project',
      subtitle: 'Subtitle goes here',
      category: 'Category',
      summary: 'Summary of the project.',
      githubUrl: '',
      liveUrl: '',
      techStack: [],
      bullets: [],
      features: [],
      architectureDetails: []
    };
    
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj)
    });
    
    fetchProjects();
    setSelectedProjectId(id);
  };

  if (loading) return (
    <section id="projects" className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 text-xl font-medium text-zinc-500">
        Loading Projects from Database...
      </div>
    </section>
  );

  return (
    <section id="projects" className="py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      {isEditable && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg animate-pulse flex items-center gap-2">
           <Radio className="w-4 h-4" /> Visual Edit Mode Active
        </div>
      )}

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
              </button>
            ))}
            
            {isEditable && (
              <button onClick={handleAddNewProject} className="w-full mt-4 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-indigo-500 hover:border-indigo-500 transition-colors font-medium">
                <Plus className="w-4 h-4" /> Add New Project
              </button>
            )}
          </aside>

          {project && (
            <div data-editor-block={`project-${project.id}`} className="min-w-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl shadow-zinc-200/40 dark:shadow-black/30">
              <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="w-full">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                    <Radio className={`w-3.5 h-3.5 ${hasLivePreview ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    {hasLivePreview ? 'Live deployment available' : 'Source project'}
                  </div>
                  
                  <div className="text-2xl font-bold text-zinc-950 dark:text-white w-full">
                    <EditableField 
                      value={project.title} 
                      isEditable={isEditable} 
                      onSave={(val: string) => handleUpdate('title', val)} 
                      className="block w-full text-2xl font-bold"
                    />
                  </div>
                  
                  <div className="mt-2 w-full">
                    <EditableField 
                      value={project.subtitle} 
                      isEditable={isEditable} 
                      onSave={(val: string) => handleUpdate('subtitle', val)} 
                      className="block w-full text-sm text-zinc-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button onClick={() => setViewMode('preview')} className={`project-view-button ${viewMode === 'preview' ? 'project-view-button-active' : ''}`}><Monitor className="w-3.5 h-3.5" /> Preview</button>
                  <button onClick={() => setViewMode('details')} className={`project-view-button ${viewMode === 'details' ? 'project-view-button-active' : ''}`}><CheckCircle2 className="w-3.5 h-3.5" /> Details</button>
                </div>
              </div>

              {viewMode === 'preview' && (
                <div className="p-4 sm:p-6">
                  {isEditable ? (
                     <div className="mb-4">
                        <label className="text-xs font-bold text-indigo-500 uppercase">Live URL</label>
                        <EditableField 
                          value={project.liveUrl} 
                          isEditable={isEditable} 
                          onSave={(val: string) => handleUpdate('liveUrl', val)} 
                          placeholder="https://your-app.com"
                        />
                     </div>
                  ) : null}

                  {hasLivePreview && (
                    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 mt-4">
                      <div className="h-11 px-3 sm:px-4 flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <div className="flex items-center gap-2 min-w-0"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span className="ml-2 text-xs font-mono text-zinc-500 truncate">{project.liveUrl}</span></div>
                        <a data-link-field={`projectsData:${project.id}:liveUrl`} href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Open site <ExternalLink className="w-3.5 h-3.5" /></a>
                      </div>
                      <iframe src={project.liveUrl} title={`${project.title} live application`} loading="lazy" className="w-full h-[420px] sm:h-[560px] bg-white" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" />
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'details' && (
                <div className="p-5 sm:p-8 grid xl:grid-cols-[minmax(0,1fr)_280px] gap-8">
                  <div>
                    <EditableField 
                      value={project.summary} 
                      isEditable={isEditable} 
                      multiline={true}
                      onSave={(val: string) => handleUpdate('summary', val)} 
                      className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 w-full"
                    />

                    <div className="mt-6 space-y-3">
                      {project.bullets?.map((bullet: string, i: number) => (
                        <div key={i} className="flex gap-3 relative group">
                          <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-500 shrink-0" />
                          <EditableField 
                            value={bullet} 
                            isEditable={isEditable}
                            multiline={true}
                            onSave={(val: string) => {
                              const newBullets = [...project.bullets];
                              newBullets[i] = val;
                              handleUpdate('bullets', newBullets);
                            }} 
                            className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
                          />
                          {isEditable && (
                            <button onClick={() => {
                              const newBullets = project.bullets.filter((_: any, idx: number) => idx !== i);
                              handleUpdate('bullets', newBullets);
                            }} className="absolute -left-6 top-1 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))}
                      {isEditable && (
                        <button onClick={() => {
                          const newBullets = [...(project.bullets || []), 'New bullet point'];
                          handleUpdate('bullets', newBullets);
                        }} className="text-xs text-indigo-500 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Bullet</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Technology</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack?.map((tech: string, i: number) => (
                        <div key={i} className="relative group">
                           {isEditable ? (
                              <EditableField 
                                value={tech} 
                                isEditable={isEditable}
                                onSave={(val: string) => {
                                  const newStack = [...project.techStack];
                                  newStack[i] = val;
                                  handleUpdate('techStack', newStack);
                                }} 
                                className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono"
                              />
                           ) : (
                              <span className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono block">{tech}</span>
                           )}
                           {isEditable && (
                              <button onClick={() => {
                                const newStack = project.techStack.filter((_: any, idx: number) => idx !== i);
                                handleUpdate('techStack', newStack);
                              }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                            )}
                        </div>
                      ))}
                      {isEditable && (
                        <button onClick={() => {
                          const newStack = [...(project.techStack || []), 'New Tech'];
                          handleUpdate('techStack', newStack);
                        }} className="px-2 py-1 rounded-md border border-dashed border-indigo-400 text-indigo-500 text-xs font-mono flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isEditable && (
                 <div className="px-5 py-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-t border-indigo-100 dark:border-indigo-900/30 flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-indigo-500 uppercase block mb-1">GitHub URL</label>
                      <EditableField 
                        value={project.githubUrl} 
                        isEditable={isEditable} 
                        onSave={(val: string) => handleUpdate('githubUrl', val)} 
                        placeholder="https://github.com/your/repo"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-red-500 uppercase block mb-1">Delete Project</label>
                      <button onClick={async () => {
                        if(confirm('Delete project?')) {
                          await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
                          fetchProjects();
                          setSelectedProjectId('');
                        }
                      }} className="px-4 py-2 bg-red-500 text-white rounded text-sm font-bold w-full h-8 flex items-center justify-center">Delete Permanently</button>
                    </div>
                 </div>
              )}

              {!isEditable && (
                <div className="px-5 sm:px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-zinc-50 dark:bg-zinc-950/50">
                  {project.githubUrl && /^https?:\/\//i.test(project.githubUrl) && <a data-link-field={`projectsData:${project.id}:githubUrl`} href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold"><Github className="w-4 h-4" /> View source</a>}
                  {hasLivePreview && <a data-link-field={`projectsData:${project.id}:liveUrl`} href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-semibold">Launch application <ExternalLink className="w-4 h-4" /></a>}
                </div>
              )}
              <div className="px-5 sm:px-8"><PortfolioImage imageKey={'project:' + project.id} /></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
