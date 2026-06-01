'use client';

import { Message } from '@/lib/db/messages';
import { Note } from '@/lib/db/notes';
import { Link } from '@/lib/db/links';
import { File } from '@/lib/db/files';

interface ActivityFeedProps {
  messages: Message[];
  notes: Note[];
  links: Link[];
  files: File[];
}

interface ActivityItem {
  id: string;
  type: 'message' | 'note' | 'link' | 'file';
  content: string;
  user: string;
  timestamp: number;
}

export default function ActivityFeed({ messages, notes, links, files }: ActivityFeedProps) {
  const activities: ActivityItem[] = [
    ...messages.map((m) => ({
      id: `msg-${m.id}`,
      type: 'message' as const,
      content: m.content,
      user: m.sender,
      timestamp: m.created_at,
    })),
    ...notes.map((n) => ({
      id: `note-${n.id}`,
      type: 'note' as const,
      content: n.content,
      user: n.created_by,
      timestamp: n.created_at,
    })),
    ...links.map((l) => ({
      id: `link-${l.id}`,
      type: 'link' as const,
      content: l.title || l.url,
      user: l.created_by,
      timestamp: l.created_at,
    })),
    ...files.map((f) => ({
      id: `file-${f.id}`,
      type: 'file' as const,
      content: f.filename,
      user: f.uploaded_by,
      timestamp: f.created_at,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'note': return '📝';
      case 'link': return '🔗';
      case 'file': return '📎';
      default: return '•';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}>
            <span style={{ marginRight: '0.5rem' }}>{getIcon(activity.type)}</span>
            <span style={{ fontWeight: '500', color: '#374151' }}>{activity.user}</span>
            <span style={{ color: '#6b7280' }}> added a {activity.type}</span>
            <div style={{ color: '#111827', marginTop: '0.25rem' }}>{activity.content}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{formatTime(activity.timestamp)}</div>
          </div>
        ))}
        {activities.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>No activity yet. Start collaborating!</p>
        )}
      </div>
    </div>
  );
}