import React, { useContext } from 'react';
import { emptyImage, SiteContext } from '../siteConfig';

export function PortfolioImage({ imageKey, fallback = '', className = '' }: { imageKey: string; fallback?: string; className?: string }) {
  const config = useContext(SiteContext).images[imageKey] || { ...emptyImage, src: fallback };
  if (!config.src || !/^(\/[^/]|https?:\/\/)/i.test(config.src)) return null;
  return <img data-media-key={imageKey} src={config.src} alt={config.alt} loading="lazy" decoding="async" className={className} style={{ display: 'block', width: config.width || '100%', maxWidth: '100%', height: config.height || 'auto', objectFit: config.fit, objectPosition: config.position, borderRadius: config.radius, marginLeft: config.align === 'left' ? 0 : 'auto', marginRight: config.align === 'right' ? 0 : 'auto' }} />;
}
