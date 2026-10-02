import React, { useEffect, useRef, useState } from 'react';
import { Upload, Image, FileText, Search, Check, Trash2 } from 'lucide-react';

type Media = { id: string; url: string; filename: string; type: string; size: number };
export function MediaBrowser({ onSelect, imagesOnly = false, selected, allowDelete = false }: { onSelect?: (url: string) => void; imagesOnly?: boolean; selected?: string; allowDelete?: boolean }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Loading saved media…');
  const [pendingDelete, setPendingDelete] = useState<Media | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const load = async () => { try { const r = await fetch('/api/media'); if (!r.ok) throw Error(); setMedia(await r.json()); setMessage(''); } catch { setMessage('Cannot load media. Check that the backend is running.'); } };
  useEffect(() => { load(); }, []);
  const upload = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setMessage('Maximum file size is 10 MB.'); return; }
    setBusy(true); setMessage('Uploading file…');
    try { const form = new FormData(); form.append('file', file); const r = await fetch('/api/media/upload', { method: 'POST', body: form }); const item = await r.json(); if (!r.ok) throw Error(item.message || 'Upload failed'); setMedia(items => [item, ...items]); setMessage(onSelect ? 'Upload saved. Choose it below to attach it.' : 'New file uploaded successfully.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  const remove = async () => {
    if (!pendingDelete) return;
    setBusy(true); setMessage('Deleting file…');
    try {
      const r = await fetch('/api/media/' + encodeURIComponent(pendingDelete.id), { method: 'DELETE' });
      const result = await r.json(); if (!r.ok) throw Error(result.message || 'Delete failed.');
      setMedia(items => items.filter(item => item.id !== pendingDelete.id)); setPendingDelete(null); setMessage('File deleted.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Delete failed.'); } finally { setBusy(false); }
  };
  const visible = media.filter(item => (!imagesOnly || item.type.startsWith('image/')) && item.filename.toLowerCase().includes(search.toLowerCase()));
  return <div className="media-browser"><div className="media-browser-toolbar"><label className="media-search"><Search size={15} /><input aria-label="Search saved media" placeholder="Search saved media…" value={search} onChange={e => setSearch(e.target.value)} /></label><label className={'media-upload-button ' + (busy ? 'disabled' : '')}><Upload size={15} />{busy ? 'Working…' : 'Upload new file'}<input ref={input} aria-label="Upload media file" type="file" disabled={busy} accept={imagesOnly ? 'image/png,image/jpeg,image/webp,image/gif,image/avif' : 'image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf'} onChange={e => upload(e.target.files?.[0])} /></label></div><p className="media-help">Images {imagesOnly ? '' : 'and PDF documents '}· Up to 10 MB per file</p>{message && <p role="status" className="media-message">{message}</p>}{pendingDelete && <div className="media-delete-confirm" role="group" aria-label="Confirm media deletion"><strong>Delete {pendingDelete.filename}?</strong><p>This permanently removes the uploaded file. Remove it from any unpublished drafts before deleting.</p><button disabled={busy} onClick={remove}>Delete file</button><button disabled={busy} onClick={() => setPendingDelete(null)}>Cancel</button></div>}<div className="media-grid">{visible.map(item => <div key={item.id} className="media-card"><button className={'media-tile ' + (selected === item.url ? 'selected' : '')} onClick={() => onSelect ? onSelect(item.url) : window.open(item.url, '_blank', 'noopener,noreferrer')}><div className="media-thumb">{item.type.startsWith('image/') ? <img src={item.url} alt={item.filename} loading="lazy" /> : <FileText size={36} />}{selected === item.url && <span className="media-selected"><Check size={13} /></span>}</div><strong>{item.filename}</strong><span>{(item.size / 1024).toFixed(0)} KB · {onSelect ? 'Use this image' : 'Open file'}</span></button>{allowDelete && <button className="media-delete-button" disabled={busy} onClick={() => setPendingDelete(item)} aria-label={'Delete ' + item.filename}><Trash2 size={14} /> Delete</button>}</div>)}</div>{!visible.length && !busy && <div className="media-empty"><Image size={30} /><p>{search ? 'No files match your search.' : 'No saved media here yet. Upload a file to get started.'}</p></div>}</div>;
}
