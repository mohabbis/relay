'use client';

import { useState } from 'react';
import { File } from '@/lib/db/files';

interface FilesPanelProps {
  files: File[];
  sessionId: string;
  onUpload: (file: { filename: string; url: string; size: number; uploadedBy: string }) => void;
}

export default function FilesPanel({ files, sessionId, onUpload }: FilesPanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      onUpload({
        filename: data.filename,
        url: data.url,
        size: data.size,
        uploadedBy: 'You',
      });

      // Reset input
      e.target.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '500',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          opacity: isUploading ? 0.5 : 1,
        }}>
          {isUploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            onChange={handleUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {files.map((file) => (
          <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <svg style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.828a2 2 0 00-.586-1.414l-5.828-5.828A2 2 0 0012.172 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div style={{ flex: 1 }}>
              <a href={file.url} download style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'underline' }}>
                {file.filename}
              </a>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {formatSize(file.size)} • uploaded by {file.uploaded_by}
              </div>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>No files yet. Upload one to get started!</p>
        )}
      </div>
    </div>
  );
}