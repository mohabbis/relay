'use client';

import { useState } from 'react';
import { Link } from '@/lib/db/links';

interface LinksPanelProps {
  links: Link[];
  onAddLink: (url: string, title: string | null) => void;
  currentName: string;
}

export default function LinksPanel({ links, onAddLink, currentName }: LinksPanelProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const title = url.startsWith('http') ? null : url;
      onAddLink(url, title);
      setUrl('');
    }
  };

  const formatUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a link..."
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={!url.trim()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '500',
            border: 'none',
            cursor: !url.trim() ? 'not-allowed' : 'pointer',
            opacity: !url.trim() ? 0.5 : 1,
          }}
        >
          Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <div key={link.id} style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'underline' }}>
              {link.title || formatUrl(link.url)}
            </a>
            {link.title && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatUrl(link.url)}</div>}
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              added by {link.created_by}
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>No links yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}