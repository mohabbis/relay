'use client';

import { useSocket } from '@/hooks/useSocket';
import { useState, useEffect, use } from 'react';
import ChatPanel from './chat-panel';
import FilesPanel from './files-panel';
import LinksPanel from './links-panel';
import NotesPanel from './notes-panel';
import ActivityFeed from './activity-feed';

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  
  const [displayName, setDisplayName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'links' | 'notes' | 'activity'>('chat');

  const { messages, notes, links, files, participants, sendMessage, addNote, addLink, notifyFileUpload, pinNote } = useSocket(
    sessionId,
    displayName
  );

  useEffect(() => {
    const stored = localStorage.getItem('relay-display-name');
    if (stored) {
      setDisplayName(stored);
      setShowNamePrompt(false);
    }
  }, []);

  const handleSetName = () => {
    if (displayName.trim()) {
      localStorage.setItem('relay-display-name', displayName);
      setShowNamePrompt(false);
    }
  };

  if (showNamePrompt) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Join Session</h2>
          <input
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
            style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginBottom: '1rem', outline: 'none' }}
            autoFocus
          />
          <br />
          <button
            onClick={handleSetName}
            disabled={!displayName.trim()}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '500',
              border: 'none',
              cursor: !displayName.trim() ? 'not-allowed' : 'pointer',
              opacity: !displayName.trim() ? 0.5 : 1,
            }}
          >
            Join Session
          </button>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    const url = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Session: {sessionId}</h1>
          <button
            onClick={copyLink}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Copy Link
          </button>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          <span style={{ marginRight: '0.5rem' }}>👥</span>
          {participants.length > 0 ? (
            <span>{participants.map((p: any) => p.name).join(', ')}</span>
          ) : (
            <span>You</span>
          )}
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <main style={{ flex: 1, padding: '1rem' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
              {(['chat', 'files', 'links', 'notes', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontWeight: '500',
                    borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
                    color: activeTab === tab ? '#2563eb' : '#4b5563',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'chat' && (
              <ChatPanel messages={messages} onSendMessage={sendMessage} currentName={displayName} />
            )}
            {activeTab === 'files' && <FilesPanel files={files} sessionId={sessionId} onUpload={notifyFileUpload} />}
            {activeTab === 'links' && <LinksPanel links={links} onAddLink={addLink} currentName={displayName} />}
            {activeTab === 'notes' && <NotesPanel notes={notes} onAddNote={addNote} onPinNote={pinNote} currentName={displayName} />}
            {activeTab === 'activity' && <ActivityFeed messages={messages} notes={notes} links={links} files={files} />}
          </div>
        </main>
      </div>
    </div>
  );
}