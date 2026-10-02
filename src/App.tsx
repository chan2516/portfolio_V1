import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './Portfolio';
import { AdminGuard, AdminLogin } from './admin/AdminAuth';
import { AccountSettings } from './admin/AccountSettings';
import { UsersManager } from './admin/UsersManager';
import { AdminLayout } from './admin/AdminLayout';
import { ResumeDocument } from './components/ResumeDocument';
import { MediaLibrary } from './admin/MediaLibrary';
import { VisualEditor, PortfolioPreview } from './admin/VisualEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/resume" element={<><div className="resume-print-toolbar no-print"><a href="/">Back to portfolio</a><button onClick={() => window.print()}>Print / Save as PDF</button></div><ResumeDocument /></>} />
        <Route path="/preview" element={<PortfolioPreview />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<VisualEditor />} />
          <Route path="theme" element={<VisualEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="projects" element={<Navigate to="/admin" replace />} />
          <Route path="experience" element={<Navigate to="/admin" replace />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
