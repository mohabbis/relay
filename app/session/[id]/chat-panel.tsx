'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/db/messages';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentName: string;
}

export default function ChatPanel({ messages, onSendMessage, currentName }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>{msg.sender}:</span>
            <span style={{ color: '#111827' }}>{msg.content}</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 'auto' }}>{formatTime(msg.created_at)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '500',
            border: 'none',
            cursor: !message.trim() ? 'not-allowed' : 'pointer',
            opacity: !message.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}