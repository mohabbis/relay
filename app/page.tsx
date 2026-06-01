'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const startSession = async () => {
    const response = await fetch('/api/sessions', { method: 'POST' });
    const session = await response.json();
    router.push(`/session/${session.id}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Relay</h1>
        <p style={{ color: '#4b5563', marginBottom: '2rem' }}>Temporary collaboration sessions</p>
        <button
          onClick={startSession}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Start a Session
        </button>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>Share a link. Collect everything. Close it cleanly.</p>
      </div>
    </div>
  );
}