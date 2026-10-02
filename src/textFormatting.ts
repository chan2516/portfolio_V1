import { TextFormat, TextSelection } from './siteConfig';

export function describeText(target: HTMLElement, root: HTMLElement): TextSelection | null {
  // Ignore layout containers: a click on card padding must not select every word
  // in the card. Text accompanied by an SVG icon is still editable.
  let element = target.closest<HTMLElement>('h1,h2,h3,h4,p,span,a,button,li,label,strong,em,small');
  if (target.tagName === 'DIV' && editableText(target).trim() && !target.hasAttribute('data-editor-block')) element = target;
  const block = element?.closest<HTMLElement>('[data-editor-block]');
  if (!element || !block || !root.contains(element) || (!element.textContent?.trim() && !element.matches('a[data-link-field]'))) return null;
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== block) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) return null;
    parts.unshift(`${current.tagName.toLowerCase()}:nth-child(${Array.from(parent.children).indexOf(current) + 1})`);
    current = parent;
  }
  const style = getComputedStyle(element);
  const link = element.closest<HTMLAnchorElement>('a[data-link-field]');
  return { selector: `[data-editor-block="${CSS.escape(block.dataset.editorBlock!)}"] > ${parts.join(' > ')}`, blockId: block.dataset.editorBlock!, label: element.tagName.toLowerCase(), text: canEditText(element) ? editableText(element) : element.textContent, editable: canEditText(element), linkField: link?.dataset.linkField, computed: { color: style.color, fontFamily: style.fontFamily, fontSize: parseFloat(style.fontSize), fontWeight: style.fontWeight, fontStyle: style.fontStyle, textDecoration: style.textDecorationLine, textAlign: style.textAlign, lineHeight: parseFloat(style.lineHeight) / parseFloat(style.fontSize) || 1.5, letterSpacing: parseFloat(style.letterSpacing) || 0 } };
}

export function canEditText(element: HTMLElement) {
  return Boolean(editableText(element).trim()) || Array.from(element.children).every(child => ['svg', 'br'].includes(child.tagName.toLowerCase()));
}

export function editableText(element: HTMLElement) {
  return Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.nodeValue || '').join('');
}

// Apply validated, plain-text overrides without accepting HTML or arbitrary CSS.
export function applyTextFormats(root: HTMLElement, formats: Record<string, TextFormat>) {
  for (const [selector, format] of Object.entries(formats)) {
    let element: HTMLElement | null;
    try { element = root.querySelector<HTMLElement>(selector); } catch { continue; }
    if (!element) continue;
    if (format.text !== undefined && canEditText(element) && editableText(element) !== format.text) {
      const nodes = Array.from(element.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      if (nodes.length) { nodes[0].nodeValue = format.text; for (const node of nodes.slice(1)) node.nodeValue = ''; }
      else element.appendChild(document.createTextNode(format.text));
    }
  }
}

export function textFormatCss(formats: Record<string, TextFormat>) {
  const properties: Record<string, string> = { color: 'color', backgroundColor: 'background-color', fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight', fontStyle: 'font-style', textDecoration: 'text-decoration', textAlign: 'text-align', lineHeight: 'line-height', letterSpacing: 'letter-spacing', marginTop: 'margin-top', marginBottom: 'margin-bottom' };
  return Object.entries(formats).filter(([selector]) => /^\[data-editor-block="[\w-]+"\] > (?:[a-z][a-z0-9]*:nth-child\(\d+\)(?: > )?)+$/.test(selector)).map(([selector, format]) => {
    const declarations = Object.entries(format).filter(([key, value]) => properties[key] && /^[\w\s#.,()%"'-]+$/.test(String(value))).map(([key, value]) => `${properties[key]}:${value}${['fontSize', 'letterSpacing', 'marginTop', 'marginBottom'].includes(key) ? 'px' : ''} !important;`).join('');
    const position = Number.isFinite(format.offsetX) || Number.isFinite(format.offsetY) ? `position:relative!important;left:${Number(format.offsetX) || 0}px!important;top:${Number(format.offsetY) || 0}px!important;` : '';
    // Gradients and clipped text should honor the chosen foreground color too.
    return `.portfolio-canvas ${selector}{${declarations}${position}${format.textAlign ? 'display:block!important;' : ''}${format.hidden ? 'display:none!important;' : ''}${format.color ? 'background-image:none!important;-webkit-text-fill-color:currentColor!important;' : ''}}`;
  }).join('\n');
}
