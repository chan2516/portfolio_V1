import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  FileCode2, 
  Server, 
  Cpu,
  ChevronRight
} from 'lucide-react';
import { experienceData } from '../data/portfolioData';

interface ExperienceProps {
  isDarkMode: boolean;
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture'>('overview');
  const exp = experienceData[0]; // Strategic ERP Solutions

  return (
    <section id="experience" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
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

        {/* Main Experience Card */}
        <div className={`rounded-2xl border transition-all overflow-hidden ${
          isDarkMode
            ? 'bg-zinc-900/70 border-zinc-800 shadow-xl shadow-black/30'
            : 'bg-white border-zinc-200/90 shadow-md shadow-zinc-200/50'
        }`}>
          {/* Card Top Header */}
          <div className={`p-6 sm:p-8 border-b ${
            isDarkMode ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-100 bg-zinc-50/70'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Current Position
                  </span>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                    Enterprise ERP Platform
                  </span>
                </div>

                <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {exp.role}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{exp.company}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{exp.period}</span>
                  </span>
                </div>
              </div>

              {/* View toggle tabs */}
              <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Key Contributions
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'architecture'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Banking Integration Architecture
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {exp.description}
                </p>

                {/* Key Metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {exp.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className={`p-4 rounded-xl border ${
                        isDarkMode
                          ? 'bg-zinc-950/50 border-zinc-800/80'
                          : 'bg-zinc-50 border-zinc-200/80'
                      }`}
                    >
                      <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {metric.value}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resume bullet points */}
                <div className="space-y-3.5 pt-2">
                  <h4 className={`text-sm font-semibold tracking-wide uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Core Responsibilities & Technical Impact
                  </h4>
                  <div className="space-y-3">
                    {exp.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2.5">
                    Technologies & Environments Used:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 rounded-lg text-xs font-medium font-mono border ${
                          isDarkMode
                            ? 'bg-zinc-800/70 text-zinc-200 border-zinc-700/80'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Architecture Tab */
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    Enterprise Banking API Gateway & Auto-Reconciliation Flow
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    Architected to integrate 3+ banking APIs into the live ERP platform, ensuring zero-loss financial data transfer, cryptographic webhook validation, and automated reconciliation across client ledgers.
                  </p>
                </div>

                {/* Step by step interactive pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-mono font-bold text-sm mb-3">
                      01
                    </div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                      Banking API Ingress & Security
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Stateless REST endpoints receive encrypted banking transaction payloads. Validated using HMAC-SHA256 signatures and Spring Security token filters.
                    </p>
                  </div>

                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center font-mono font-bold text-sm mb-3">
                      02
                    </div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                      Idempotency & Auto-Reconciliation
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Transactions are deduplicated using idempotency keys. JPA repositories execute atomic updates against the ERP ledger tables under ACID transaction isolation.
                    </p>
                  </div>

                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-mono font-bold text-sm mb-3">
                      03
                    </div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                      Real-Time Financial Reporting
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Optimized Spring MVC & JSP modules render refreshed ledger balance and settlement status with Swagger-documented REST interfaces for auditing.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-indigo-950/20 border-indigo-900/50 text-indigo-300' : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                }`}>
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>
                      <strong>Compliance & Security:</strong> Enforced custom Spring Security configurations and session management to meet enterprise client banking standards.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
