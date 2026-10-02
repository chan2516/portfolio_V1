import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PanelsTopLeft, FolderOpen, BriefcaseBusiness, Image, ArrowUpRight, Layers, Users } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { const load = () => { fetch('/api/auth/session').then(r => r.json()).then(result => setUser(result.user)).catch(() => {}); }; load(); window.addEventListener('admin-account-updated', load); return () => window.removeEventListener('admin-account-updated', load); }, []);
  return <div className="admin-shell">
    <aside className="admin-rail">
      <NavLink to="/admin" className="admin-brand" title="Portfolio Studio"><Layers size={22} /><span>folio<span className="brand-dot">.</span></span></NavLink>
      <span className="admin-rail-label">WORKSPACE</span>
      <nav>{[
        { to: '/admin', label: 'Website editor', icon: PanelsTopLeft, end: true },
        { to: '/admin/media', label: 'Media library', icon: Image },
        { to: '/admin/account', label: 'My account', icon: Users },
        ...(user?.role === 'owner' ? [{ to: '/admin/users', label: 'Admin accounts', icon: Users }] : []),
      ].map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} title={label} aria-label={label} className={({ isActive }) => 'admin-nav-link ' + (isActive ? 'is-active' : '')}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="admin-rail-bottom"><button onClick={async () => { try { const r = await fetch("/api/auth/logout", { method: "POST" }); if (!r.ok) throw Error(); navigate("/admin/login", { replace: true }); } catch { setError("Sign out failed. Try again."); } }}>Sign out</button><a href="/" target="_blank" rel="noreferrer"><ArrowUpRight size={18} /><span>View website</span></a><div className="admin-avatar">{user?.username.slice(0, 2).toUpperCase() || "AD"}<span>{user?.username || "Portfolio admin"}<small>{user?.role === "owner" ? "Owner" : "Admin"}</small></span></div>{error && <p role="alert">{error}</p>}</div>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}
