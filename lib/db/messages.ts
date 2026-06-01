import { db } from './index';

export interface Message {
  id: number;
  session_id: string;
  content: string;
  sender: string;
  created_at: number;
}

export function addMessage(sessionId: string, content: string, sender: string) {
  const stmt = db.prepare(`
    INSERT INTO messages (session_id, content, sender, created_at)
    VALUES (?, ?, ?, ?)
  `);
  
  const now = Date.now();
  const info = stmt.run(sessionId, content, sender, now);
  return { id: info.lastInsertRowid, session_id: sessionId, content, sender, created_at: now };
}

export function getMessages(sessionId: string): Message[] {
  const stmt = db.prepare(`
    SELECT id, session_id, content, sender, created_at 
    FROM messages 
    WHERE session_id = ? 
    ORDER BY created_at ASC
  `);
  
  return stmt.all(sessionId) as Message[];
}

export function deleteMessage(id: number, sessionId: string) {
  const stmt = db.prepare(`DELETE FROM messages WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}
