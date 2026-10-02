import React, { useState, useEffect } from 'react';

export function ThemeEditor() {
  const [theme, setTheme] = useState({
    primaryColor: '#6366f1',
    backgroundColor: '#fafafa',
    textColor: '#18181b',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '0.5rem',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch('/api/theme');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setTheme({
          primaryColor: data.primaryColor || '#6366f1',
          backgroundColor: data.backgroundColor || '#fafafa',
          textColor: data.textColor || '#18181b',
          fontFamily: data.fontFamily || 'Inter, sans-serif',
          borderRadius: data.borderRadius || '0.5rem',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load theme. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTheme(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Instantly preview changes
    document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme)
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save theme. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      <span className="ml-3 text-zinc-500">Connecting to database...</span>
    </div>
  );

  return (
    <div className="max-w-2xl bg-white dark:bg-zinc-950 p-8 rounded-xl shadow border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6">Theme Editor</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Primary Color</label>
          <input 
            type="color" 
            name="primaryColor" 
            value={theme.primaryColor} 
            onChange={handleChange}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input 
            type="color" 
            name="backgroundColor" 
            value={theme.backgroundColor} 
            onChange={handleChange}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input 
            type="color" 
            name="textColor" 
            value={theme.textColor} 
            onChange={handleChange}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Family</label>
          <select 
            name="fontFamily" 
            value={theme.fontFamily} 
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Border Radius</label>
          <input 
            type="text" 
            name="borderRadius" 
            value={theme.borderRadius} 
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
          
          {success && <span className="text-sm text-green-600 font-medium">✨ Theme saved successfully!</span>}
          {error && <span className="text-sm text-red-600 font-medium">{error}</span>}
        </div>
      </div>
    </div>
  );
}
