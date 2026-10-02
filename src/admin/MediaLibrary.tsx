import React from 'react';
import { MediaBrowser } from './MediaBrowser';
export function MediaLibrary() {
  return <div className="media-library-page"><h1>Media library</h1><p>Upload images and PDFs, open saved files, or delete files you no longer use. Published website files are protected from deletion.</p><MediaBrowser allowDelete /></div>;
}
