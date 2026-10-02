import React from 'react';
import { ProjectsSection } from '../components/ProjectsSection';

export function ProjectsManager() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="bg-zinc-100 dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
         <h1 className="text-xl font-bold">Visual Projects Editor</h1>
         <p className="text-sm text-zinc-500">Click on any text, bullet, or tag to edit it directly on the page.</p>
      </div>
      
      {/* 
        We pass isEditable=true so the component enters "Visual Edit Mode".
        This replaces standard text elements with content-editable inputs that auto-save on blur.
      */}
      <ProjectsSection isDarkMode={true} isEditable={true} />
    </div>
  );
}
