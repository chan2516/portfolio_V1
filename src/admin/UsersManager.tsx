import React, { useEffect, useState } from 'react';

interface AdminUser { id: string; username: string; role: string; active: boolean }
export function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState('Loading accounts…');
  const [busy, setBusy] = useState(false);
  const [owner, setOwner] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  async function api(url: string, method = 'GET', body?: object) {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const result = await r.json();
    if (!r.ok) throw Error(result.message || 'Request failed.');
    return result;
  }
  useEffect(() => {
    api('/api/auth/session').then(async session => {
      if (session.user?.role !== 'owner') { setStatus('Only the owner can manage admin accounts.'); return; }
      setOwner(true); setUsers(await api('/api/auth/users')); setStatus('');
    }).catch(e => setStatus(e.message));
  }, []);
  async function update(id: string, body: object) {
    setBusy(true); setStatus('');
    try { const user = await api('/api/auth/users/' + id, 'PATCH', body); setUsers(list => list.map(item => item.id === id ? user : item)); setResetId(null); setStatus('Account updated. Previous sessions have been signed out.'); }
    catch (e) { setStatus(e instanceof Error ? e.message : 'Update failed.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-users"><header><span className="studio-kicker">WORKSPACE / ACCESS</span><h1>Admin accounts</h1><p>Give trusted people their own login to edit and publish the same website.</p></header><p role="status">{status}</p>{owner && <>
    <section className="admin-users-card"><h2>Add a user</h2><form onSubmit={async e => {
      e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); setBusy(true); setStatus('');
      try { const user = await api('/api/auth/users', 'POST', Object.fromEntries(data)); setUsers(list => [...list, user]); form.reset(); setStatus('Admin created. They can now sign in at /admin/login.'); }
      catch (e) { setStatus(e instanceof Error ? e.message : 'Could not create admin.'); } finally { setBusy(false); }
    }}><fieldset disabled={busy}><label className="studio-field">Username<input name="username" required minLength={3} maxLength={64} pattern={"[a-zA-Z0-9][a-zA-Z0-9._\\-]{2,63}"} autoComplete="off" /><small>3–64 letters, numbers, dots, underscores or hyphens.</small></label><label className="studio-field">Password<input name="password" type="password" required minLength={12} maxLength={1024} autoComplete="new-password" /><small>At least 12 characters. Share the login with the person securely.</small></label><button className="studio-primary" type="submit">Create user</button></fieldset></form></section>
    <section className="admin-users-card"><h2>People with access</h2><p>Admins can edit and publish the website, resume, and media. Only you can manage accounts.</p>{users.map(user => <div key={user.id} className="admin-user-row"><div><strong>{user.username}</strong><p>{user.role === 'owner' ? 'Owner' : 'Admin'} · {user.active ? 'Active' : 'Disabled'}</p></div>{user.role !== 'owner' && <div><button disabled={busy} onClick={() => update(user.id, { active: !user.active })}>{user.active ? 'Disable access' : 'Enable access'}</button><button disabled={busy} onClick={() => setResetId(resetId === user.id ? null : user.id)}>Edit login</button></div>}{resetId === user.id && <form onSubmit={e => { e.preventDefault(); const values = new FormData(e.currentTarget); const password = String(values.get('password') || ''); update(user.id, { username: values.get('username'), ...(password ? { password } : {}) }); }}><label className="studio-field">Username<input name="username" defaultValue={user.username} required minLength={3} maxLength={64} autoComplete="off" /></label><label className="studio-field">New password for {user.username}<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={1024} /><small>Leave blank to keep the current password.</small></label><button disabled={busy}>Save login</button><button type="button" onClick={() => setResetId(null)}>Cancel</button></form>}</div>)}</section>
  </>}</div>;
}
