import React, { useEffect, useRef, useState } from 'react';
import { defaultConfig, normalizeConfig, SiteConfig, siteEndpoint, TextSelection } from '../siteConfig';
import { projectsData as projectDefaults, experienceData as experienceDefaults } from '../data/portfolioData';
import { describeText, textFormatCss } from '../textFormatting';
import { useTextOverrides } from '../useTextOverrides';
import { globalTypographyCss } from '../typography';

export function ResumeDocument({ config: supplied, onSelectText }: { config?: SiteConfig; onSelectText?: (value: TextSelection) => void }) {
  const [published, setPublished] = useState(defaultConfig);
  const config = supplied || published;
  const root = useRef<HTMLDivElement>(null);
  useTextOverrides(root, config);
  useEffect(() => {
    if (supplied) return;
    Promise.all([fetch(siteEndpoint).then(r => r.ok ? r.json() : defaultConfig), fetch('/api/projects').then(r => r.ok ? r.json() : projectDefaults), fetch('/api/experience').then(r => r.ok ? r.json() : experienceDefaults)]).then(([saved, projects, experience]) => {
      const v = normalizeConfig(saved); setPublished({ ...v, content: { ...v.content, projectsData: v.content.projectsData ?? projects, experienceData: v.content.experienceData ?? experience } });
    }).catch(() => {});
  }, [supplied]);
  const { candidateInfo: profile, contactData: contact, educationData, skillGroups, certificationsData } = config.content;
  const experiences = config.content.experienceData ?? experienceDefaults;
  const projects = config.content.projectsData ?? projectDefaults;
  const select = onSelectText ? (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!root.current) return;
    const selection = describeText(e.target as HTMLElement, root.current);
    if (selection) { root.current.querySelector('[data-editor-selected]')?.removeAttribute('data-editor-selected'); root.current.querySelector(selection.selector)?.setAttribute('data-editor-selected', 'true'); onSelectText(selection); }
  } : undefined;
  const sections = [
    <header data-editor-block="resume-header"><h1>{profile.name}</h1><p>{profile.title}</p><p>{contact.email} · {contact.phone} · {contact.location}</p><p>{contact.github} · {contact.linkedin}</p></header>,
    <section data-editor-block="resume-summary"><h2>Professional summary</h2><p>{profile.summary}</p></section>,
    <section data-editor-block="resume-experience"><h2>Professional experience</h2>{experiences.map((job, i) => <article key={job.id || i}><h3>{job.role}</h3><p className="resume-meta"><strong>{job.company}</strong><span>{job.period}</span></p><p>{job.location}</p><p>{job.description}</p><ul>{(job.bullets || []).map((line: string, n: number) => <li key={n}>{line}</li>)}</ul></article>)}</section>,
    <section data-editor-block="resume-projects"><h2>Selected projects</h2>{projects.map((project, i) => <article key={project.id || i}><h3>{project.title}</h3><p>{project.subtitle}</p><p>{project.summary}</p><p>{(project.techStack || []).join(' · ')}</p></article>)}</section>,
    <section data-editor-block="resume-skills"><h2>Technical skills</h2>{skillGroups.map(group => <p key={group.id}><strong>{group.category}: </strong><span>{group.skills.join(', ')}</span></p>)}</section>,
    <section data-editor-block="resume-education"><h2>Education</h2>{educationData.map(item => <article key={item.id}><h3>{item.degree}</h3><p>{item.institution}</p><p>{item.period} · {item.location}</p></article>)}</section>,
    <section data-editor-block="resume-certifications"><h2>Certifications</h2>{certificationsData.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.issuer} · {item.year}</p></article>)}</section>
  ];
  return <div className="resume-document-wrap"><style>{globalTypographyCss(config.theme) + textFormatCss(config.textFormats)}</style><div ref={root} className="portfolio-canvas resume-document" onClickCapture={select}>{config.resumeSections.map(id => { const section = sections.find(node => node.props['data-editor-block'] === id); return section ? React.cloneElement(section, { key: id }) : null; })}</div></div>;
}
