import { db } from './index';

export interface Note {
  id: number;
  session_id: string;
  content: string;
  created_by: string;
  created_at: number;
  pinned: number;
}

export function addNote(sessionId: string, content: string, createdBy: string) {
  const stmt = db.prepare(`
    INSERT INTO notes (session_id, content, created_by, created_at)
    VALUES (?, ?, ?, ?)
  `);
  
  const now = Date.now();
  const info = stmt.run(sessionId, content, createdBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, content, created_by: createdBy, created_at: now };
}

export function getNotes(sessionId: string): Note[] {
  const stmt = db.prepare(`
    SELECT id, session_id, content, created_by, created_at 
    FROM notes 
    WHERE session_id = ? 
    ORDER BY created_at DESC
  `);
  
  return stmt.all(sessionId) as Note[];
}

export function deleteNote(id: number, sessionId: string) {
  const stmt = db.prepare(`DELETE FROM notes WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}

export function pinNote(id: number, sessionId: string, pinned: boolean) {
  const stmt = db.prepare(`UPDATE notes SET pinned = ? WHERE id = ? AND session_id = ?`);
  stmt.run(pinned ? 1 : 0, id, sessionId);
}
