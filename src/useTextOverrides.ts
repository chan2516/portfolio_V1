import { RefObject, useEffect } from 'react';
import { SiteConfig } from './siteConfig';
import { applyTextFormats, canEditText, editableText } from './textFormatting';

export function useTextOverrides(canvas: RefObject<HTMLDivElement>, config: SiteConfig) {
  const formatKey = JSON.stringify(config.textFormats);
  useEffect(() => {
    const root = canvas.current;
    if (!root) return;
    const originals = new Map<HTMLElement, [Node, string][] >();
    const apply = () => {
      for (const selector of Object.keys(config.textFormats)) {
        try { const el = root.querySelector<HTMLElement>(selector); if (el && config.textFormats[selector].text !== undefined && canEditText(el) && (!originals.has(el) || (config.textFormats[selector].text !== undefined && editableText(el) !== config.textFormats[selector].text))) originals.set(el, Array.from(el.childNodes as NodeListOf<ChildNode>).filter(node => node.nodeType === Node.TEXT_NODE).map(node => [node, node.nodeValue || ''] as [Node, string])); } catch {}
      }
      applyTextFormats(root, config.textFormats);
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => { observer.disconnect(); for (const [el, nodes] of originals) if (root.contains(el)) for (const [node, value] of nodes) if (node.parentNode === el) node.nodeValue = value; };
  }, [formatKey]);
}
