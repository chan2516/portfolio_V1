import React from 'react';
import { ResumeDocument } from './ResumeDocument';
import { SiteContext } from '../siteConfig';
import { Download, ExternalLink, FileText, X } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const resumeUrl = '/Chandan_Vishwakarma_Resume.pdf';

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const config = React.useContext(SiteContext);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Chandan Vishwakarma resume">
      <div className={`w-full max-w-5xl h-[94vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0"><FileText className="w-4.5 h-4.5" /></div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white truncate">Chandan Vishwakarma - Resume</h2>
              <p className="text-xs text-zinc-500">Live resume · edited in Portfolio Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/resume" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <ExternalLink className="w-3.5 h-3.5" /> Open / Print
            </a>
            <a href={resumeUrl} download="Chandan_Vishwakarma_Resume.pdf" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white">
              <Download className="w-3.5 h-3.5" /> Original PDF
            </a>
            <button onClick={onClose} aria-label="Close resume" className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-zinc-200 dark:bg-zinc-900">
          <div className="h-full overflow-auto"><ResumeDocument config={config} /></div>
        </div>
      </div>
    </div>
  );
};
