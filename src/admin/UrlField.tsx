import React from 'react';
export function UrlField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  let valid = !value;
  try { const url = new URL(value); valid = value.length <= 2000 && ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && !/\s/.test(value); } catch {}
  return <label className="studio-field">{label}<input type="url" maxLength={2000} value={value} placeholder="https://…" aria-invalid={!valid} onChange={e => onChange(e.target.value.trim())} /><small>{valid ? 'Optional. Leave blank to hide the link.' : 'Enter a complete HTTP or HTTPS URL, without spaces or embedded credentials.'}</small></label>;
}
