import React, { createContext, useContext } from 'react';
import * as data from './data/portfolioData';

export const contentDefaults = {
  candidateInfo: data.candidateInfo, contactData: { websiteUrl: '', ...data.contactData }, candidateStats: data.candidateStats,
  skillGroups: data.skillGroups, educationData: data.educationData,
  certificationsData: data.certificationsData, sampleCodeSnippets: data.sampleCodeSnippets,
  projectsData: undefined as any[] | undefined,
  experienceData: undefined as any[] | undefined,
};
export type Block = { id: string; type: string; label: string; visible: boolean; title: string; body: string; image: string; link: string; background: string; padding: number; align: 'left' | 'center'; posts?: { id: string; title: string; body: string; date: string; link: string }[] };
export type TextFormat = { text?: string; color?: string; backgroundColor?: string; fontFamily?: string; fontSize?: number; fontWeight?: string; fontStyle?: string; textDecoration?: string; textAlign?: string; lineHeight?: number; letterSpacing?: number; hidden?: boolean; offsetX?: number; offsetY?: number; marginTop?: number; marginBottom?: number };
export type TextSelection = { selector: string; blockId: string; label: string; text: string; editable: boolean; linkField?: string; computed: TextFormat };
export type ImageConfig = { src: string; alt: string; width: number; height: number; fit: 'cover' | 'contain' | 'fill'; position: 'center' | 'top' | 'bottom' | 'left' | 'right'; align: 'left' | 'center' | 'right'; radius: number };
export const emptyImage: ImageConfig = { src: '', alt: '', width: 0, height: 320, fit: 'cover', position: 'center', align: 'center', radius: 16 };
export const defaultConfig = {
  version: 1,
  navigation: ['experience','projects','code','skills','education','contact'].map(id => ({id, label: ({code:'Architecture & Code',education:'Education & Certs'} as Record<string,string>)[id] || id[0].toUpperCase()+id.slice(1), href:'#'+id})),
  icons: { color: '', strokeWidth: 2, size: 100 },
  theme: { accent: '#6366f1', background: '#09090b', text: '#f4f4f5', font: 'Plus Jakarta Sans, sans-serif', headingFont: '', bodySize: 0, lineHeight: 0, radius: 16, width: 1280, dark: true },
  sections: ['navbar', 'hero', 'experience', 'projects', 'code', 'skills', 'education', 'contact', 'footer'].map(type => ({ id: type, type, label: type[0].toUpperCase() + type.slice(1), visible: true, title: '', body: '', image: '', link: '', background: '', padding: 0, align: 'left' as const })),
  content: contentDefaults,
  textFormats: {} as Record<string, TextFormat>,
  resumeSections: ['resume-header', 'resume-summary', 'resume-experience', 'resume-projects', 'resume-skills', 'resume-education', 'resume-certifications'],
  images: { profile: { ...emptyImage, src: '/profile-professional.png', alt: 'Professional portrait', height: 0 } } as Record<string, ImageConfig>,
};
export type SiteConfig = typeof defaultConfig;
export const SiteContext = createContext<SiteConfig>(defaultConfig);
export const usePortfolioData = () => useContext(SiteContext).content;
export function normalizeConfig(value: Partial<SiteConfig>): SiteConfig {
  return { ...defaultConfig, ...value, icons: { ...defaultConfig.icons, ...value.icons }, navigation: Array.isArray(value.navigation) ? value.navigation : defaultConfig.navigation, images: { ...defaultConfig.images, ...value.images }, textFormats: value.textFormats || {}, theme: { ...defaultConfig.theme, ...value.theme }, content: { ...contentDefaults, ...value.content, contactData: { ...contentDefaults.contactData, ...value.content?.contactData } }, sections: Array.isArray(value.sections) ? value.sections : defaultConfig.sections };
}
export const siteEndpoint = '/api/settings/portfolio';
