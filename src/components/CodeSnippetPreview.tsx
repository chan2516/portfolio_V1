import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  ShieldAlert, 
  Layers
} from 'lucide-react';
import { sampleCodeSnippets } from '../data/portfolioData';

interface CodeSnippetPreviewProps {
  isDarkMode: boolean;
}

export const CodeSnippetPreview: React.FC<CodeSnippetPreviewProps> = ({ isDarkMode }) => {
  const [activeSnippetId, setActiveSnippetId] = useState<string>('banking-service');
  const [copied, setCopied] = useState(false);

  const currentSnippet =
    sampleCodeSnippets.find((s) => s.id === activeSnippetId) || sampleCodeSnippets[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = currentSnippet.code.split('\n');

  return (
    <section id="code" className="py-20 border-t border-zinc-200 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-left max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>SOURCE ARCHITECTURE PREVIEW</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
            Enterprise Code Samples & Configurations
          </h2>
          <p className={`mt-3 text-base sm:text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Exemplifying Java 17 design patterns, Spring Security 6 stateless filter chains, and Docker orchestration topologies.
          </p>
        </div>

        {/* Code Viewer Container */}
        <div className={`rounded-2xl border transition-all overflow-hidden shadow-2xl ${
          isDarkMode
            ? 'bg-zinc-950 border-zinc-800 shadow-black/50'
            : 'bg-zinc-950 border-zinc-800 shadow-xl'
        }`}>
          {/* Top Bar with Tab Buttons & Copy Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
            {/* File Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {sampleCodeSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => {
                    setActiveSnippetId(snippet.id);
                    setCopied(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    activeSnippetId === snippet.id
                      ? 'bg-zinc-800 text-indigo-400 font-semibold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{snippet.filename}</span>
                </button>
              ))}
            </div>

            {/* Actions: Copy */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase hidden sm:inline">
                {currentSnippet.language}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Snippet Context Bar */}
          <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-300">
            <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-white">{currentSnippet.title}:</strong> {currentSnippet.description}
            </span>
          </div>

          {/* Code Editor Window */}
          <div className="p-4 sm:p-6 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-200">
              <code>
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell pr-5 select-none text-right text-zinc-600 text-xs w-8">
                      {index + 1}
                    </span>
                    <span className="table-cell whitespace-pre">
                      {/* Simple syntax highlighting colors */}
                      {highlightLine(line)}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
};

// Helper for lightweight syntax styling in the code viewer
function highlightLine(line: string) {
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }
  if (line.trim().startsWith('@')) {
    return <span className="text-amber-400 font-semibold">{line}</span>;
  }
  if (line.includes('public') || line.includes('private') || line.includes('class') || line.includes('return') || line.includes('final') || line.includes('throw') || line.includes('if')) {
    return (
      <span>
        {line.split(/(\b(?:public|private|class|return|final|throw|if|new|import|package|service|version|services)\b)/).map((part, i) => {
          if (['public', 'private', 'class', 'return', 'final', 'throw', 'if', 'new', 'import', 'package', 'version', 'services'].includes(part)) {
            return <span key={i} className="text-purple-400 font-medium">{part}</span>;
          }
          return part;
        })}
      </span>
    );
  }
  return line;
}
