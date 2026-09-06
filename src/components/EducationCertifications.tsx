import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  BadgeCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { educationData, certificationsData } from '../data/portfolioData';

interface EducationCertificationsProps {
  isDarkMode: boolean;
}

export const EducationCertifications: React.FC<EducationCertificationsProps> = ({ isDarkMode }) => {
  return (
    <section id="education" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC & CREDENTIALS</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
            Education & Certifications
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Strong IT foundation backed by top academic honors and industry-recognized development credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Education Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Higher Education</span>
            </h3>

            {educationData.map((edu) => (
              <div
                key={edu.id}
                className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900/70 border-zinc-800 shadow-xl shadow-black/20'
                    : 'bg-white border-zinc-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      CGPA: {edu.cgpa}
                    </span>
                    <h4 className={`text-xl font-bold tracking-tight mt-2 ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
                      {edu.degree}
                    </h4>
                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                      {edu.institution}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs text-zinc-500 font-mono gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{edu.period}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.location}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
                  {edu.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span className={`${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} leading-relaxed`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Professional Certifications</span>
            </h3>

            <div className="space-y-4">
              {certificationsData.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDarkMode
                      ? 'bg-zinc-900/70 border-zinc-800 shadow-md shadow-black/20'
                      : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-mono text-zinc-500">
                          {cert.issuer} • {cert.year}
                        </span>
                      </div>
                      <h4 className={`text-base font-bold tracking-tight mt-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                        {cert.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      Verified
                    </span>
                  </div>

                  {/* Skills Covered in Certification */}
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500 block mb-2">
                      Competencies Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                            isDarkMode
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                              : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
