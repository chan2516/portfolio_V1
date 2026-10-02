import React, { useState, useEffect, useRef } from 'react';
import { IconScope } from './portfolioIcons';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CodeSnippetPreview } from './components/CodeSnippetPreview';
import { SkillsSection } from './components/SkillsSection';
import { EducationCertifications } from './components/EducationCertifications';
import { ContactSection } from './components/ContactSection';
import { ResumeModal } from './components/ResumeModal';
import { PortfolioImage } from './components/PortfolioImage';
import { Footer } from './components/Footer';
import { defaultConfig, normalizeConfig, SiteContext, SiteConfig, siteEndpoint, TextSelection } from './siteConfig';

import { describeText, textFormatCss } from './textFormatting';

import { useTextOverrides } from './useTextOverrides';
import { globalTypographyCss } from './typography';

export default function Portfolio({ config: supplied, onSelect, onSelectText, onSelectImage, onSelectIcon }: { config?: SiteConfig; onSelect?: (id: string) => void; onSelectText?: (selection: TextSelection) => void; onSelectImage?: (key: string) => void; onSelectIcon?: (key:string,name:string) => void }) {
  const canvas = useRef<HTMLDivElement>(null);

  const [published, setPublished] = useState(defaultConfig);
  const config = supplied || published;
  useEffect(() => {
    if (supplied) return;
    const load = () => fetch(siteEndpoint).then(r => r.ok ? r.json() : null).then(v => { if (v) setPublished(normalizeConfig(v)); }).catch(() => {});
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [supplied]);
  const [isDarkMode, setIsDarkMode] = useState(config.theme.dark);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  useEffect(() => { setIsDarkMode(config.theme.dark); }, [config.theme.dark]);
  useEffect(() => { if (!supplied) document.documentElement.classList.toggle('dark', isDarkMode); }, [isDarkMode, supplied]);
  const toggleDarkMode = () => setIsDarkMode(v => !v);
  useTextOverrides(canvas, config);
  const renderBlock = (type: string) => {
    switch(type) {
      case 'navbar': return <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onOpenResume={() => setIsResumeOpen(true)} />;
      case 'hero': return <Hero isDarkMode={isDarkMode} onOpenResume={() => setIsResumeOpen(true)} />;
      case 'experience': return <ExperienceSection isDarkMode={isDarkMode} />;
      case 'projects': return <ProjectsSection isDarkMode={isDarkMode} />;
      case 'code': return <CodeSnippetPreview isDarkMode={isDarkMode} />;
      case 'skills': return <SkillsSection isDarkMode={isDarkMode} />;
      case 'education': return <EducationCertifications isDarkMode={isDarkMode} />;
      case 'contact': return <ContactSection isDarkMode={isDarkMode} />;
      case 'footer': return <Footer isDarkMode={isDarkMode} />;
    }
  };
  return <SiteContext.Provider value={config}>
    <style>{globalTypographyCss(config.theme) + textFormatCss(config.textFormats)}</style>
    <div ref={canvas} className={'portfolio-canvas min-h-screen ' + (isDarkMode ? 'dark' : '')} style={{
      '--site-accent': config.theme.accent, '--site-bg': config.theme.background,
      '--site-text': config.theme.text, '--site-radius': config.theme.radius + 'px',
      '--site-width': config.theme.width + 'px', fontFamily: config.theme.font,
      background: config.theme.background, color: config.theme.text,
    } as React.CSSProperties}>
      {config.sections.filter(b => b.visible).map(block => <div key={block.id}
        data-editor-block={block.id} className={onSelect ? 'editor-selectable' : ''}
        onClickCapture={onSelect ? e => { e.preventDefault(); e.stopPropagation(); onSelect(block.id); const icon = (e.target as HTMLElement).closest<HTMLElement>('[data-icon-key]'); if (icon && onSelectIcon) { onSelectIcon(icon.dataset.iconKey!,icon.dataset.iconName!); return; } const image = (e.target as HTMLElement).closest<HTMLElement>('[data-media-key]'); if (image && onSelectImage) { onSelectImage(image.dataset.mediaKey!); return; } if (onSelectText && canvas.current) { const selection = describeText(e.target as HTMLElement, canvas.current); if (selection) { canvas.current.querySelector('[data-editor-selected]')?.removeAttribute('data-editor-selected'); canvas.current.querySelector(selection.selector)?.setAttribute('data-editor-selected', 'true'); onSelectText(selection); } } } : undefined}
        style={{ background: block.background || undefined, padding: block.padding ? block.padding + 'px 0' : undefined, textAlign: block.align }}>
        <IconScope.Provider value={block.id}>{['custom','blog'].includes(block.type) ? <section id={block.id} className="max-w-7xl mx-auto px-6 py-16">
          <PortfolioImage imageKey={'section:' + block.id} fallback={block.image} className="mb-6" />
          <h2 className="text-4xl font-bold mb-4">{block.title}</h2>
          <p className="whitespace-pre-wrap text-lg opacity-80">{block.body}</p>
          {block.type === 'blog' && <div className="grid md:grid-cols-2 gap-6 mt-8">{(block.posts || []).map(post => <article key={post.id} data-editor-block={'post-'+post.id} className="p-6 rounded-xl border border-current/20 text-left"><time>{post.date}</time><h3 className="text-2xl font-bold my-3">{post.title}</h3><p className="whitespace-pre-wrap">{post.body}</p>{/^https?:\/\//i.test(post.link) && <a href={post.link} className="inline-block mt-4 underline" target="_blank" rel="noreferrer">Read more</a>}</article>)}</div>}
          {block.link && /^(https?:|mailto:|\/|#)/.test(block.link) && <a href={block.link} className="inline-block mt-6 px-5 py-3 rounded-lg bg-indigo-600 text-white">Learn more</a>}
        </section> : renderBlock(block.type)}</IconScope.Provider>{!!block.tags?.length && <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-wrap gap-2">{block.tags.map((tag,i)=><span key={i} className="px-3 py-1 rounded-md border border-current/20 text-sm">{tag}</span>)}</div>}
      </div>)}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} isDarkMode={isDarkMode} />
    </div>
  </SiteContext.Provider>;
}
