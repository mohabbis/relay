'use client';

import { useState } from 'react';
import { Note } from '@/lib/db/notes';

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string) => void;
  onPinNote: (id: number, pinned: boolean) => void;
  currentName: string;
}

export default function NotesPanel({ notes, onAddNote, onPinNote, currentName }: NotesPanelProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddNote(content);
      setContent('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
        />
        <button
          type="submit"
          disabled={!content.trim()}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '500',
            border: 'none',
            cursor: !content.trim() ? 'not-allowed' : 'pointer',
            opacity: !content.trim() ? 0.5 : 1,
          }}
        >
          Add Note
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notes.map((note) => (
          <div key={note.id} style={{ padding: '0.75rem', backgroundColor: note.pinned ? '#fefce8' : 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.875rem', color: '#111827', whiteSpace: 'pre-wrap' }}>{note.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              <span>by {note.created_by}</span>
              <button
                onClick={() => onPinNote(note.id, !note.pinned)}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                {note.pinned ? 'Unpin' : 'Pin'}
              </button>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>No notes yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}