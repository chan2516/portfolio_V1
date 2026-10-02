import { usePortfolioData } from '../siteConfig';
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, MapPin, CheckCircle2, ShieldCheck, Plus, Trash2, Radio
} from 'lucide-react';

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
        rows={3}
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

interface ExperienceProps {
  isDarkMode: boolean;
  isEditable?: boolean;
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ isDarkMode, isEditable = false }) => {
  const managedContent = usePortfolioData().experienceData;
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture'>('overview');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperience = () => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (managedContent !== undefined) { setExperiences(managedContent); setLoading(false); return; }
    fetchExperience();
  }, [managedContent]);

  const handleUpdate = async (id: string, field: string, newValue: any) => {
    // Optimistic update
    setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, [field]: newValue } : exp));
    
    // Save to backend
    await fetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: newValue })
    });
  };

  const handleAddNewExperience = async () => {
    const id = `exp-${Date.now()}`;
    const newExp = {
      id,
      role: 'New Role',
      company: 'New Company',
      location: 'Location',
      period: 'Date - Date',
      current: false,
      description: 'Describe your responsibilities here.',
      bullets: [],
      techStack: [],
      metrics: []
    };
    
    await fetch('/api/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExp)
    });
    
    fetchExperience();
  };

  if (loading) return <div className="text-center py-20">Loading Experience...</div>;

  const exp = experiences[0];
  if (!exp && !isEditable) return null;

  return (
    <section id="experience" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      {isEditable && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg animate-pulse flex items-center gap-2">
           <Radio className="w-4 h-4" /> Visual Edit Mode Active
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREER TIMELINE</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
            Professional Experience
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Building enterprise-scale financial modules, banking gateway microservices, and secure transaction workflows.
          </p>
        </div>

        {isEditable && (
          <button onClick={handleAddNewExperience} className="mb-8 w-full max-w-7xl mx-auto flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-indigo-500 hover:border-indigo-500 transition-colors font-medium">
            <Plus className="w-4 h-4" /> Add New Experience
          </button>
        )}

        <div className="space-y-8">
        {experiences.map(exp => (
          <div key={exp.id} data-editor-block={`experience-${exp.id}`} className={`rounded-2xl border transition-all overflow-hidden ${
            isDarkMode ? 'bg-zinc-900/70 border-zinc-800 shadow-xl shadow-black/30' : 'bg-white border-zinc-200/90 shadow-md shadow-zinc-200/50'
          }`}>
            <div className={`p-6 sm:p-8 border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-100 bg-zinc-50/70'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full relative">
                  {isEditable && (
                    <button 
                      onClick={async () => {
                        await fetch(`/api/experience/${exp.id}`, { method: 'DELETE' });
                        fetchExperience();
                      }}
                      className="absolute top-0 right-0 p-2 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <EditableField 
                        value={exp.current ? 'Current Position' : 'Past Position'} 
                        isEditable={false} // Assuming we just toggle a boolean elsewhere or leave as is
                        onSave={() => {}} 
                      />
                    </span>
                  </div>

                  <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'} w-full max-w-md`}>
                    <EditableField 
                      value={exp.role} 
                      isEditable={isEditable} 
                      onSave={(v: string) => handleUpdate(exp.id, 'role', v)} 
                      className="block w-full text-2xl sm:text-3xl font-bold"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <EditableField 
                      value={exp.company} 
                      isEditable={isEditable} 
                      onSave={(v: string) => handleUpdate(exp.id, 'company', v)} 
                      className="text-indigo-600 dark:text-indigo-400 font-semibold"
                    />
                    <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <EditableField 
                        value={exp.location} 
                        isEditable={isEditable} 
                        onSave={(v: string) => handleUpdate(exp.id, 'location', v)} 
                      />
                    </span>
                    <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <EditableField 
                        value={exp.period} 
                        isEditable={isEditable} 
                        onSave={(v: string) => handleUpdate(exp.id, 'period', v)} 
                      />
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 self-start md:self-auto shrink-0">
                  <button onClick={() => setActiveTab('overview')} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>Key Contributions</button>
                  <button onClick={() => setActiveTab('architecture')} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>Banking Integration Architecture</button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  <EditableField 
                    value={exp.description} 
                    isEditable={isEditable} 
                    multiline={true}
                    onSave={(v: string) => handleUpdate(exp.id, 'description', v)} 
                    className={`text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} w-full`}
                  />

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {exp.metrics?.map((metric: any, i: number) => (
                      <div key={i} className={`p-4 rounded-xl border relative group ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200/80'}`}>
                        <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          <EditableField value={metric.value} isEditable={isEditable} onSave={(v: string) => {
                            const newMetrics = [...exp.metrics];
                            newMetrics[i].value = v;
                            handleUpdate(exp.id, 'metrics', newMetrics);
                          }} />
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                          <EditableField value={metric.label} isEditable={isEditable} onSave={(v: string) => {
                            const newMetrics = [...exp.metrics];
                            newMetrics[i].label = v;
                            handleUpdate(exp.id, 'metrics', newMetrics);
                          }} />
                        </div>
                        {isEditable && (
                           <button onClick={() => {
                              const newMetrics = exp.metrics.filter((_: any, idx: number) => idx !== i);
                              handleUpdate(exp.id, 'metrics', newMetrics);
                           }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                    {isEditable && (
                      <button onClick={() => {
                        const newMetrics = [...(exp.metrics || []), { label: 'New Metric', value: '0' }];
                        handleUpdate(exp.id, 'metrics', newMetrics);
                      }} className={`p-4 rounded-xl border border-dashed flex items-center justify-center text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 ${isDarkMode ? 'border-zinc-800/80' : 'border-zinc-300'}`}>
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-3.5 pt-2">
                    <h4 className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Core Responsibilities & Technical Impact</h4>
                    <div className="space-y-3">
                      {exp.bullets?.map((bullet: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 relative group">
                          <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                          <EditableField 
                            value={bullet} 
                            isEditable={isEditable} 
                            multiline={true}
                            onSave={(v: string) => {
                              const newBullets = [...exp.bullets];
                              newBullets[idx] = v;
                              handleUpdate(exp.id, 'bullets', newBullets);
                            }} 
                            className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} w-full`}
                          />
                          {isEditable && (
                            <button onClick={() => {
                              const newBullets = exp.bullets.filter((_: any, i: number) => i !== idx);
                              handleUpdate(exp.id, 'bullets', newBullets);
                            }} className="absolute -left-6 top-1 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))}
                      {isEditable && (
                        <button onClick={() => {
                          const newBullets = [...(exp.bullets || []), 'New responsibility'];
                          handleUpdate(exp.id, 'bullets', newBullets);
                        }} className="text-xs text-indigo-500 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Responsibility</button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {exp.companyUrl && /^https?:\/\//i.test(exp.companyUrl) && <a data-link-field={`experienceData:${exp.id}:companyUrl`} href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-500">Company website ↗</a>}
                    {exp.workUrl && /^https?:\/\//i.test(exp.workUrl) && <a data-link-field={`experienceData:${exp.id}:workUrl`} href={exp.workUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-500">View public work ↗</a>}
                  </div>
                  {/* Tech Stack */}
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2.5">Technologies Used:</span>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack?.map((tech: string, i: number) => (
                        <div key={i} className="relative group">
                          {isEditable ? (
                            <EditableField value={tech} isEditable={isEditable} onSave={(v: string) => {
                              const newStack = [...exp.techStack];
                              newStack[i] = v;
                              handleUpdate(exp.id, 'techStack', newStack);
                            }} className={`px-3 py-1 rounded-lg text-xs font-medium font-mono border ${isDarkMode ? 'bg-zinc-800/70 text-zinc-200 border-zinc-700/80' : 'bg-zinc-100 text-zinc-800 border-zinc-200'}`} />
                          ) : (
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium font-mono border ${isDarkMode ? 'bg-zinc-800/70 text-zinc-200 border-zinc-700/80' : 'bg-zinc-100 text-zinc-800 border-zinc-200'}`}>{tech}</span>
                          )}
                          {isEditable && (
                            <button onClick={() => {
                              const newStack = exp.techStack.filter((_: any, idx: number) => idx !== i);
                              handleUpdate(exp.id, 'techStack', newStack);
                            }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                          )}
                        </div>
                      ))}
                      {isEditable && (
                        <button onClick={() => {
                          const newStack = [...(exp.techStack || []), 'New Tech'];
                          handleUpdate(exp.id, 'techStack', newStack);
                        }} className="px-2 py-1 rounded-md border border-dashed border-indigo-400 text-indigo-500 text-xs font-mono flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Kept static for brevity, but can easily be made editable like the rest */}
                  <div className="space-y-2">
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Enterprise Architecture Module</h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>Architectural details mapped here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};
