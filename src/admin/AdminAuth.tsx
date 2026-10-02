import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export function AdminGuard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const load = async () => {
    setError('');
    try { const r = await fetch('/api/auth/session'); if (!r.ok) throw Error(); const result = await r.json(); if (typeof result.authenticated !== 'boolean') throw Error(); setAuthenticated(result.authenticated); }
    catch { setError('The backend is temporarily unavailable. Retry when it is running.'); }
  };
  useEffect(() => { load(); }, []);
  return authenticated === null ? <div className="admin-users"><p role="status">{error || 'Checking admin session…'}</p>{error && <button onClick={load}>Retry session check</button>}</div> : authenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [ready, setReady] = useState(false);
  const load = async () => {
    setReady(false); setError('');
    try {
      const r = await fetch('/api/auth/session');
      if (!r.ok) throw Error('Cannot reach the admin API. Start or restart the backend and try again.');
      const result = await r.json();
      if (result.authenticated) { navigate('/admin', { replace: true }); return; }
      setNeedsSetup(Boolean(result.needsSetup)); setReady(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Cannot connect to the server.'); }
  };
  useEffect(() => { load(); }, [navigate]);
  return <main className="admin-login"><form onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError('');
    const data = new FormData(e.currentTarget);
    if (needsSetup && data.get('password') !== data.get('confirmPassword')) { setError('Passwords do not match.'); setBusy(false); return; }
    try {
      const r = await fetch(needsSetup ? '/api/auth/setup' : '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: data.get('username'), password: data.get('password') }) });
      const result = await r.json();
      if (!r.ok) {
        if (r.status === 409 && needsSetup) setNeedsSetup(false);
        throw Error(result.message || 'Sign in failed.');
      }
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();
      if (!session.authenticated) throw Error('The login cookie was not saved. Use HTTPS in production and enable cookies, then try again.');
      navigate('/admin', { replace: true });
    } catch (err) { setError(err instanceof Error ? err.message : 'Cannot connect to the server.'); } finally { setBusy(false); }
  }}><span className="studio-kicker">PORTFOLIO STUDIO</span><h1>{needsSetup ? 'Create owner account' : 'Admin sign in'}</h1><p>{needsSetup ? 'Create the first account to manage your portfolio. Your login is saved in the database.' : 'Sign in to manage your website, resume, and media.'}</p><fieldset disabled={!ready || busy}><label className="studio-field">Username<input name="username" autoComplete="username" required minLength={needsSetup ? 3 : undefined} maxLength={64} pattern={needsSetup ? '[a-zA-Z0-9][a-zA-Z0-9._\\-]{2,63}' : undefined} /></label><label className="studio-field">Password<input name="password" type="password" autoComplete={needsSetup ? 'new-password' : 'current-password'} required minLength={needsSetup ? 12 : undefined} maxLength={1024} /></label>{needsSetup && <><small>Use at least 12 characters for your password.</small><label className="studio-field">Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={1024} /></label></>}<button className="studio-primary" disabled={!ready || busy}>{busy ? 'Please wait…' : needsSetup ? 'Create owner account' : 'Sign in'}</button></fieldset>{error && <p role="alert">{error}</p>}{!ready && <button type="button" onClick={load}>Retry connection</button>}<a href="/">Back to portfolio</a></form></main>;
}
