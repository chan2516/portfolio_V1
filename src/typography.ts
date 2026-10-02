import { SiteConfig } from './siteConfig';

export const fontChoices = ['Plus Jakarta Sans, sans-serif', 'Arial, sans-serif', 'Georgia, serif', 'Verdana, sans-serif', 'Trebuchet MS, sans-serif', 'monospace'];
export function globalTypographyCss(theme: SiteConfig['theme']) {
  const safeFont = (font: string) => /^[\w\s,"'-]{1,100}$/.test(font) ? font : 'Arial, sans-serif';
  return `
    .portfolio-canvas :where(p,span,a,button,li,label,strong,em,small,input,textarea,select){font-family:${safeFont(theme.font)};}
    .portfolio-canvas :where(h1,h2,h3,h4,h5,h6,h1 *,h2 *,h3 *,h4 *,h5 *,h6 *){font-family:${safeFont(theme.headingFont || theme.font)};}
    .portfolio-canvas :where(pre,code,pre *,code *){font-family:'Fira Code',monospace;}
    ${theme.bodySize >= 10 && theme.bodySize <= 32 ? `.portfolio-canvas :where(p,li){font-size:${theme.bodySize}px;}` : ''}
    ${theme.lineHeight >= .8 && theme.lineHeight <= 3 ? `.portfolio-canvas :where(p,li){line-height:${theme.lineHeight};}` : ''}
  `;
}
