import { db } from './index';

export interface Link {
  id: number;
  session_id: string;
  url: string;
  title: string | null;
  created_by: string;
  created_at: number;
}

export function addLink(sessionId: string, url: string, title: string | null, createdBy: string) {
  const stmt = db.prepare(`
    INSERT INTO links (session_id, url, title, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const now = Date.now();
  const info = stmt.run(sessionId, url, title, createdBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, url, title, created_by: createdBy, created_at: now };
}

export function getLinks(sessionId: string): Link[] {
  const stmt = db.prepare(`
    SELECT id, session_id, url, title, created_by, created_at 
    FROM links 
    WHERE session_id = ? 
    ORDER BY created_at DESC
  `);
  
  return stmt.all(sessionId) as Link[];
}

export function deleteLink(id: number, sessionId: string) {
  const stmt = db.prepare(`DELETE FROM links WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}
