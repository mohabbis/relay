import { db } from './index';
import { nanoid } from 'nanoid';

const SESSION_DURATION_HOURS = 24;

export function createSession() {
  const id = nanoid(8);
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_HOURS * 60 * 60 * 1000;

  const stmt = db.prepare(`
    INSERT INTO sessions (id, created_at, expires_at)
    VALUES (?, ?, ?)
  `);
  
  stmt.run(id, now, expiresAt);
  return { id, expiresAt };
}

export function getSession(id: string) {
  const stmt = db.prepare(`
    SELECT id, created_at, expires_at FROM sessions WHERE id = ?
  `);
  
  return stmt.get(id);
}

export function isSessionValid(id: string): boolean {
  const session = getSession(id);
  if (!session) return false;
  
  return session.expires_at > Date.now();
}

export function cleanupExpiredSessions() {
  const stmt = db.prepare(`DELETE FROM sessions WHERE expires_at < ?`);
  stmt.run(Date.now());
}
