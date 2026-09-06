import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github,
  CheckCircle2
} from 'lucide-react';
import { candidateInfo, contactData, experienceData, projectsData, skillGroups, educationData, certificationsData } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const plainText = `
${candidateInfo.name}
${candidateInfo.title}
${contactData.phone} | ${contactData.email} | ${contactData.location}
LinkedIn: ${contactData.linkedinUrl} | GitHub: ${contactData.githubUrl}

PROFESSIONAL SUMMARY:
${candidateInfo.summary}

TECHNICAL SKILLS:
- Languages: Java 8 & 17, JavaScript, HTML5, CSS3, SQL
- Core Java: OOP, Collections Framework, Multithreading, Streams & Lambdas
- Backend: Spring Boot, Spring MVC, Spring Security, Spring Data JPA, Hibernate, JSP/Servlets
- Frontend: React.js, Axios, Bootstrap 5, Thymeleaf, Next.js
- Architecture & APIs: Microservices, RESTful API Design, JWT Authentication, MVC
- Databases: MySQL, PostgreSQL, JDBC
- DevOps & Tools: Docker, Git, GitHub, Maven, CI/CD Pipelines, Postman, Swagger/OpenAPI, Apache Tomcat, Ubuntu Linux
- Testing: JUnit 5, Mockito, Spring Boot Test, Postman API Testing

PROFESSIONAL EXPERIENCE:
Java Developer | Strategic ERP Solutions | September 2025 – Present
${experienceData[0].bullets.map(b => `• ${b}`).join('\n')}

PROJECTS:
${projectsData.map(p => `${p.title} — ${p.subtitle} | ${p.techStack.join(', ')}\n${p.bullets.map(b => `• ${b}`).join('\n')}`).join('\n\n')}

EDUCATION:
Bachelor of Science in Information Technology — SIES College of Arts, Science and Commerce, Mumbai | 2022–2025 | CGPA: 8.6/10

CERTIFICATIONS:
- Full Stack Java Development Training — QUASTECH (2025)
- Docker for Developers — Udemy (2026)
    `.trim();

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Modal Toolbar (No-Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">Curriculum Vitae</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ATS-Optimized
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
              title="Copy plain-text resume"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Sheet */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0 print:m-0 print:text-black">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {candidateInfo.name}
            </h1>
            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
              {candidateInfo.title}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              <span>{contactData.phone}</span>
              <span>•</span>
              <a href={`mailto:${contactData.email}`} className="hover:underline text-indigo-600 dark:text-indigo-400">
                {contactData.email}
              </a>
              <span>•</span>
              <span>{contactData.location}</span>
              <span>•</span>
              <a href={contactData.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline">
                {contactData.linkedin}
              </a>
              <span>•</span>
              <a href={contactData.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
                {contactData.github}
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {candidateInfo.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
              TECHNICAL SKILLS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
              <div>
                <strong className="text-zinc-900 dark:text-white">Languages:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">Java 8 & 17, JavaScript, HTML5, CSS3, SQL</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Core Java:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">OOP, Collections Framework, Multithreading, Streams & Lambdas</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Backend:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">Spring Boot, Spring MVC, Spring Security, Spring Data JPA, Hibernate, JSP/Servlets</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Frontend:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">React.js, Next.js, Axios, Bootstrap 5, Thymeleaf</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Architecture & APIs:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">Microservices, RESTful API Design, JWT Authentication, MVC</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Databases:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">MySQL, PostgreSQL, JDBC, Redis</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">DevOps & Tools:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">Docker, Git, GitHub, Maven, CI/CD Pipelines, Postman, Swagger/OpenAPI, Apache Tomcat, Ubuntu Linux</span>
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-white">Testing:</strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">JUnit 5, Mockito, Spring Boot Test, Postman API Testing</span>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
              PROFESSIONAL EXPERIENCE
            </h2>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-zinc-900 dark:text-white">
                  Java Developer | Strategic ERP Solutions
                </span>
                <span className="text-zinc-500 font-mono">
                  September 2025 – Present
                </span>
              </div>

              <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 list-disc list-outside pl-4">
                {experienceData[0].bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
              PROJECTS
            </h2>

            {projectsData.map((project) => (
              <div key={project.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {project.title} — {project.subtitle}
                  </span>
                </div>
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  {project.techStack.join(' • ')}
                </div>
                <ul className="mt-1.5 space-y-1 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 list-disc list-outside pl-4">
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                EDUCATION
              </h2>
              <div className="text-xs sm:text-sm">
                <div className="font-bold text-zinc-900 dark:text-white">
                  Bachelor of Science in Information Technology
                </div>
                <div className="text-zinc-600 dark:text-zinc-400">
                  SIES College of Arts, Science and Commerce, Mumbai
                </div>
                <div className="text-xs font-mono text-zinc-500 mt-0.5">
                  2022 – 2025 | CGPA: <strong className="text-emerald-600 dark:text-emerald-400">8.6 / 10</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                CERTIFICATIONS
              </h2>
              <div className="text-xs sm:text-sm space-y-1.5">
                <div>
                  <div className="font-bold text-zinc-900 dark:text-white">
                    Full Stack Java Development Training
                  </div>
                  <div className="text-zinc-500 font-mono text-xs">
                    QUASTECH (2025)
                  </div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-white">
                    Docker for Developers
                  </div>
                  <div className="text-zinc-500 font-mono text-xs">
                    Udemy (2026)
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
