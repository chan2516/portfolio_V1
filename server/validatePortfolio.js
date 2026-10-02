import { iconNames } from './iconNames.js';
export function validatePortfolio(value) {
  const types = ['navbar', 'hero', 'experience', 'projects', 'code', 'skills', 'education', 'contact', 'footer', 'custom', 'blog'];
  if (!value || value.version !== 1 || !value.theme || !Array.isArray(value.sections) || value.sections.length > 100 || !value.content) return false;
  if (value.navigation !== undefined) {
    if (!Array.isArray(value.navigation) || value.navigation.length > 100 || new Set(value.navigation.map(n => n?.id)).size !== value.navigation.length) return false;
    for (const n of value.navigation) {
      if (!n || typeof n.id !== 'string' || !/^[\w-]{1,100}$/.test(n.id) || typeof n.label !== 'string' || !n.label.trim() || n.label.length > 100 || typeof n.href !== 'string' || n.href.length > 2000) return false;
      if (n.href.startsWith('#')) { if (!value.sections.some(b => b?.id === n.href.slice(1))) return false; }
      else { try { const url = new URL(n.href); if (!['http:','https:'].includes(url.protocol) || url.username || url.password) return false; } catch { return false; } }
    }
  }
  if (value.icons !== undefined) {
    const i = value.icons;
    if (!i || typeof i.color !== 'string' || (i.color && !/^#[0-9a-f]{6}$/i.test(i.color)) || !Number.isFinite(i.size) || i.size < 50 || i.size > 150 || !Number.isFinite(i.strokeWidth) || i.strokeWidth < 1 || i.strokeWidth > 3) return false;
  }
  if (value.iconOverrides !== undefined) {
    if (!value.iconOverrides || typeof value.iconOverrides !== 'object' || Array.isArray(value.iconOverrides) || Object.keys(value.iconOverrides).length > 2000) return false;
    for (const [key,i] of Object.entries(value.iconOverrides)) {
      if (!/^[\w:-]{1,200}$/.test(key) || !i || !iconNames.includes(i.name) || typeof i.color !== 'string' || (i.color && !/^#[0-9a-f]{6}$/i.test(i.color)) || !Number.isFinite(i.size) || i.size < 50 || i.size > 150 || !Number.isFinite(i.strokeWidth) || i.strokeWidth < 1 || i.strokeWidth > 3) return false;
    }
  }
  if (value.content.skillGroups?.some(g => !g || ['featured','visible','showCheckmarks'].some(k => g[k] !== undefined && typeof g[k] !== 'boolean'))) return false;
  const t = value.theme;
  if (![t.accent, t.background, t.text].every(c => /^#[0-9a-f]{6}$/i.test(c))) return false;
  if (typeof t.dark !== 'boolean' || typeof t.font !== 'string' || t.font.length > 100 || !Number.isFinite(t.radius) || t.radius < 0 || t.radius > 40 || !Number.isFinite(t.width) || t.width < 800 || t.width > 1600) return false;
  if (!/^[\w\s,"'-]{1,100}$/.test(t.font)) return false;
  if (t.headingFont !== undefined && (typeof t.headingFont !== 'string' || (t.headingFont && !/^[\w\s,"'-]{1,100}$/.test(t.headingFont)))) return false;
  if (t.bodySize !== undefined && (!Number.isFinite(t.bodySize) || (t.bodySize !== 0 && (t.bodySize < 10 || t.bodySize > 32)))) return false;
  if (t.lineHeight !== undefined && (!Number.isFinite(t.lineHeight) || (t.lineHeight !== 0 && (t.lineHeight < .8 || t.lineHeight > 3)))) return false;
  if (value.textFormats !== undefined) {
    if (!value.textFormats || typeof value.textFormats !== 'object' || Array.isArray(value.textFormats) || Object.keys(value.textFormats).length > 2000) return false;
    const strings = { color: /^#[0-9a-f]{6}$/i, backgroundColor: /^#[0-9a-f]{6}$/i, fontFamily: /^[\w\s,"'-]{1,100}$/, fontWeight: /^(normal|bold|[1-9]00)$/, fontStyle: /^(normal|italic)$/, textDecoration: /^(none|underline)$/, textAlign: /^(left|center|right)$/ };
    const numbers = { fontSize: [8, 160], lineHeight: [.8, 4], letterSpacing: [-5, 20], offsetX: [-600, 600], offsetY: [-600, 600], marginTop: [-120, 240], marginBottom: [-120, 240] };
    for (const [selector, format] of Object.entries(value.textFormats)) {
      if (!/^\[data-editor-block="[\w-]+"\] > (?:[a-z][a-z0-9]*:nth-child\(\d+\)(?: > )?)+$/.test(selector) || selector.length > 2000 || !format || typeof format !== 'object' || Array.isArray(format)) return false;
      for (const [key, v] of Object.entries(format)) {
        if (key === 'text') { if (typeof v !== 'string' || v.length > 20000) return false; }
        else if (key === 'hidden') { if (typeof v !== 'boolean') return false; }
        else if (strings[key]) { if (typeof v !== 'string' || !strings[key].test(v)) return false; }
        else if (numbers[key]) { if (!Number.isFinite(v) || v < numbers[key][0] || v > numbers[key][1]) return false; }
        else return false;
      }
    }
  }
  if (['projectsData', 'experienceData'].some(k => value.content[k] !== undefined && !Array.isArray(value.content[k]))) return false;
  if (value.resumeSections !== undefined && (!Array.isArray(value.resumeSections) || new Set(value.resumeSections).size !== value.resumeSections.length || value.resumeSections.some(id => !['resume-header', 'resume-summary', 'resume-experience', 'resume-projects', 'resume-skills', 'resume-education', 'resume-certifications'].includes(id)))) return false;
  if (value.images !== undefined) {
    if (!value.images || typeof value.images !== 'object' || Array.isArray(value.images) || Object.keys(value.images).length > 1000) return false;
    for (const [key, image] of Object.entries(value.images)) {
      if (!/^[\w:-]{1,200}$/.test(key) || !image || typeof image !== 'object' || typeof image.src !== 'string' || (image.src && !/^(\/[^/]|https?:\/\/)/i.test(image.src)) || image.src.length > 2000 || typeof image.alt !== 'string' || image.alt.length > 2000) return false;
      if (!['cover', 'contain', 'fill'].includes(image.fit) || !['center', 'top', 'bottom', 'left', 'right'].includes(image.position) || !['left', 'center', 'right'].includes(image.align)) return false;
      if (['width', 'height', 'radius'].some(k => !Number.isFinite(image[k]) || image[k] < 0 || image[k] > (k === 'radius' ? 200 : 2000))) return false;
    }
  }
  const ids = new Set();
  return value.sections.every(b => {
    if (!b || typeof b.id !== 'string' || !b.id || ids.has(b.id) || !types.includes(b.type)) return false;
    ids.add(b.id);
    if (b.tags !== undefined && (!Array.isArray(b.tags) || b.tags.length > 200 || b.tags.some(t => typeof t !== 'string' || t.length > 200))) return false;
    if (b.posts !== undefined && (!Array.isArray(b.posts) || b.posts.length > 200 || new Set(b.posts.map(p => p?.id)).size !== b.posts.length || b.posts.some(p => !p || !/^[\w-]{1,100}$/.test(p.id) || ['title','body','date','link'].some(k => typeof p[k] !== 'string' || p[k].length > (k === 'body' ? 50000 : 2000))))) return false;
    return ['label', 'title', 'body', 'image', 'link', 'background'].every(k => typeof b[k] === 'string') && typeof b.visible === 'boolean' && ['left', 'center'].includes(b.align) && Number.isFinite(b.padding) && b.padding >= 0 && b.padding <= 120 && (!b.background || /^#[0-9a-f]{6}$/i.test(b.background));
  }) && ['candidateInfo', 'contactData'].every(k => value.content[k] && typeof value.content[k] === 'object' && !Array.isArray(value.content[k])) && ['candidateStats', 'skillGroups', 'educationData', 'certificationsData', 'sampleCodeSnippets'].every(k => Array.isArray(value.content[k]));
}
