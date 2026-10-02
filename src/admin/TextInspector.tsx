import React from 'react';
import { TextFormat, TextSelection } from '../siteConfig';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, RotateCcw, Type, Trash2 } from 'lucide-react';

export function TextInspector({ selection, format, onChange, onReset, disabled, linkControl }: { selection: TextSelection | null; format: TextFormat; onChange: (patch: TextFormat) => void; onReset: () => void; disabled: boolean; linkControl?: React.ReactNode }) {
  const rgb = selection?.computed.color?.match(/\d+/g);
  const originalColor = rgb && rgb.length >= 3 ? '#' + rgb.slice(0, 3).map(v => Number(v).toString(16).padStart(2, '0')).join('') : '#ffffff';
  const current = { ...selection?.computed, ...format };
  return <div className="text-inspector">
    <div className="inspector-title"><Type size={18} /><div><h2>Text & typography</h2><p>{selection ? `${selection.blockId} / ${selection.label}` : 'Select text on the canvas'}</p></div></div>
    {!selection ? <div className="inspector-empty"><Type size={32} /><h3>Make every word yours</h3><p>Click a heading, sentence, label, or button in the preview. Its formatting controls appear here.</p><span>Changes apply to the selected text element.</span></div> : <fieldset disabled={disabled}>
      {linkControl}
      <label className="studio-field">Text content<textarea rows={5} value={format.text ?? selection.text} disabled={!selection.editable} onChange={e => onChange({ text: e.target.value })} /></label>
      {!selection.editable && <p className="studio-hint">This element contains styled child text. Click a specific word group to edit its wording, or use Content.</p>}
      <label className="studio-field">Font family<select value={current.fontFamily || ''} onChange={e => onChange({ fontFamily: e.target.value })}><option value={selection.computed.fontFamily}>Original font</option>{['Arial, sans-serif', 'Georgia, serif', 'Plus Jakarta Sans, sans-serif', 'Verdana, sans-serif', 'Trebuchet MS, sans-serif', 'monospace'].map(f => <option key={f}>{f}</option>)}</select></label>
      <div className="inspector-grid"><label className="studio-field">Size (px)<input type="number" min="8" max="160" value={Math.round(current.fontSize || 16)} onChange={e => onChange({ fontSize: Math.max(8, Math.min(160, +e.target.value)) })} /></label><label className="studio-field">Line height<input type="number" min="0.8" max="4" step="0.1" value={+(current.lineHeight || 1.5).toFixed(2)} onChange={e => onChange({ lineHeight: Math.max(.8, Math.min(4, +e.target.value)) })} /></label></div>
      <div className="format-button-row">{[
        { icon: Bold, label: 'Bold', active: Number(current.fontWeight) >= 600 || current.fontWeight === 'bold', patch: { fontWeight: Number(current.fontWeight) >= 600 || current.fontWeight === 'bold' ? '400' : '700' } },
        { icon: Italic, label: 'Italic', active: current.fontStyle === 'italic', patch: { fontStyle: current.fontStyle === 'italic' ? 'normal' : 'italic' } },
        { icon: Underline, label: 'Underline', active: current.textDecoration === 'underline', patch: { textDecoration: current.textDecoration === 'underline' ? 'none' : 'underline' } },
      ].map(({ icon: Icon, label, active, patch }) => <button key={label} title={label} aria-label={label} aria-pressed={active} className={active ? 'active' : ''} onClick={() => onChange(patch)}><Icon size={17} /></button>)}<span className="format-divider" />{[{ value: 'left', icon: AlignLeft }, { value: 'center', icon: AlignCenter }, { value: 'right', icon: AlignRight }].map(({ value, icon: Icon }) => <button title={`Align ${value}`} aria-label={`Align ${value}`} aria-pressed={current.textAlign === value} className={current.textAlign === value ? 'active' : ''} key={value} onClick={() => onChange({ textAlign: value })}><Icon size={17} /></button>)}</div>
      <div className="inspector-grid"><label className="studio-field">Text color<input aria-label="Selected text color" type="color" value={format.color || originalColor} onChange={e => onChange({ color: e.target.value })} /><input aria-label="Text color hex" type="text" placeholder="#ffffff" defaultValue={format.color || originalColor} key={selection.selector + (format.color || '')} maxLength={7} onBlur={e => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange({ color: e.target.value }); }} /></label><label className="studio-field">Highlight<input aria-label="Text highlight color" type="color" value={format.backgroundColor || '#6366f1'} onChange={e => onChange({ backgroundColor: e.target.value })} /></label></div>
      <label className="studio-field">Letter spacing (px)<input type="number" min="-5" max="20" step="0.5" value={current.letterSpacing || 0} onChange={e => onChange({ letterSpacing: Math.max(-5, Math.min(20, +e.target.value)) })} /></label>
      <h2>Position & spacing</h2>
      <div className="inspector-grid">{[{ key: 'offsetX', label: 'Move horizontally', min: -600, max: 600 }, { key: 'offsetY', label: 'Move vertically', min: -600, max: 600 }, { key: 'marginTop', label: 'Space above', min: -120, max: 240 }, { key: 'marginBottom', label: 'Space below', min: -120, max: 240 }].map(({ key, label, min, max }) => <label className="studio-field" key={key}>{label} (px)<input type="number" min={min} max={max} value={format[key] || 0} onChange={e => onChange({ [key]: Math.max(min, Math.min(max, +e.target.value)) })} /></label>)}</div>
      <p className="studio-hint">Movement offsets the element from its normal position. Check all device previews for overlap.</p>
      <button className="inspector-remove" onClick={() => onChange({ hidden: !format.hidden, text: format.text ?? selection.text })}><Trash2 size={14} /> {format.hidden ? 'Restore text element' : 'Remove text element'}</button>
      <button className="inspector-reset" onClick={onReset}><RotateCcw size={14} /> Reset text and formatting</button>
      <p className="studio-hint">Formatting is saved with your design when you publish. Text overrides apply to this element; Content edits update the underlying profile data.</p>
    </fieldset>}
  </div>;
}
