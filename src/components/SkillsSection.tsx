import React, { useState, useMemo } from 'react';
import { 
  Code, 
  Search, 
  CheckCircle, 
  Sparkles, 
  Server, 
  Database, 
  Terminal, 
  Layers, 
  Check, 
  X,
  Cpu,
  ShieldCheck,
  TestTube
} from 'lucide-react';
import { skillGroups } from '../data/portfolioData';

interface SkillsSectionProps {
  isDarkMode: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filterCategories = [
    { id: 'all', label: 'All Skills' },
    { id: 'backend', label: 'Backend & Java' },
    { id: 'devops', label: 'DevOps & Cloud' },
    { id: 'databases', label: 'Databases & APIs' },
    { id: 'frontend', label: 'Frontend & UI' },
    { id: 'testing', label: 'Testing & QA' },
  ];

  const filteredGroups = useMemo(() => {
    return skillGroups.filter((group) => {
      // Category filter match
      if (activeCategory === 'backend') {
        if (!['languages', 'core-java', 'backend'].includes(group.id)) return false;
      } else if (activeCategory === 'devops') {
        if (group.id !== 'devops') return false;
      } else if (activeCategory === 'databases') {
        if (!['databases', 'architecture'].includes(group.id)) return false;
      } else if (activeCategory === 'frontend') {
        if (group.id !== 'frontend') return false;
      } else if (activeCategory === 'testing') {
        if (group.id !== 'testing') return false;
      }

      // Search query match
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const groupMatch = group.category.toLowerCase().includes(q) || group.description.toLowerCase().includes(q);
      const skillMatch = group.skills.some((skill) => skill.toLowerCase().includes(q));

      return groupMatch || skillMatch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="skills" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>TECHNICAL MATRIX</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
              Skills & Proficiencies
            </h2>
            <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Strong specialization in Java 17, Spring ecosystem microservices, containerization, and full-stack integration.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (e.g., Docker, Spring, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isDarkMode
                  ? 'bg-zinc-900/70 border-zinc-800/90 hover:border-zinc-700 shadow-lg shadow-black/20'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {group.category}
                  </h3>
                  {group.featured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                      Core Domain
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-4 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {group.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
                {group.skills.map((skill) => {
                  const isHighlighted = searchQuery && skill.toLowerCase().includes(searchQuery.toLowerCase());
                  return (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                        isHighlighted
                          ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-400'
                          : isDarkMode
                          ? 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/60'
                          : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-500">
              No skills found matching "<span className="font-semibold">{searchQuery}</span>". Try another search term like Java, Docker, or Spring.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
