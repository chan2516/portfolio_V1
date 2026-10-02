import React, { useEffect, useState } from 'react';

export function AccountSettings() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('Loading account…');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { fetch('/api/auth/session').then(r => r.json()).then(result => {
    if (!result.authenticated) throw Error('Sign in again to edit your account.');
    setUsername(result.user.username); setReady(true); setStatus('');
  }).catch(e => setStatus(e.message)); }, []);
  return <div className="admin-users"><header><span className="studio-kicker">WORKSPACE / YOUR ACCOUNT</span><h1>Account settings</h1><p>Change your username or password here.</p></header><p role="status">{status}</p><section className="admin-users-card"><form onSubmit={async e => {
    e.preventDefault(); const form = e.currentTarget; const values = new FormData(form);
    const password = String(values.get('password') || '');
    if (password !== values.get('confirmPassword')) { setStatus('New passwords do not match.'); return; }
    setBusy(true); setStatus('');
    try {
      const r = await fetch('/api/auth/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, currentPassword: values.get('currentPassword'), ...(password ? { password } : {}) }) });
      const result = await r.json(); if (!r.ok) throw Error(result.message || 'Could not save account.');
      setUsername(result.user.username); form.reset(); setStatus('Account saved. Other sessions have been signed out.');
      window.dispatchEvent(new Event('admin-account-updated'));
    } catch (e) { setStatus(e instanceof Error ? e.message : 'Could not save account.'); } finally { setBusy(false); }
  }}><fieldset disabled={!ready || busy}><label className="studio-field">Username<input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required minLength={3} maxLength={64} pattern={"[a-zA-Z0-9][a-zA-Z0-9._\\-]{2,63}"} /></label><label className="studio-field">Current password<input name="currentPassword" type="password" autoComplete="current-password" required /></label><label className="studio-field">New password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={1024} /><small>Leave blank to keep your current password.</small></label><label className="studio-field">Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" /></label><button className="studio-primary">Save account</button></fieldset></form></section></div>;
}
