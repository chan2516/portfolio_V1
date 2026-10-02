import React from 'react';
import { ExperienceSection } from '../components/ExperienceSection';

export function ExperienceManager() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="bg-zinc-100 dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
         <h1 className="text-xl font-bold">Visual Experience Editor</h1>
         <p className="text-sm text-zinc-500">Click on any role, company, metric, or bullet to edit it directly.</p>
      </div>
      
      <ExperienceSection isDarkMode={true} isEditable={true} />
    </div>
  );
}
