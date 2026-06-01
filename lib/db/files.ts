import { db } from './index';

export interface File {
  id: number;
  session_id: string;
  filename: string;
  url: string;
  size: number;
  uploaded_by: string;
  created_at: number;
}

export function addFile(
  sessionId: string, 
  filename: string, 
  url: string, 
  size: number, 
  uploadedBy: string
) {
  const stmt = db.prepare(`
    INSERT INTO files (session_id, filename, url, size, uploaded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const now = Date.now();
  const info = stmt.run(sessionId, filename, url, size, uploadedBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, filename, url, size, uploaded_by: uploadedBy, created_at: now };
}

export function getFiles(sessionId: string): File[] {
  const stmt = db.prepare(`
    SELECT id, session_id, filename, url, size, uploaded_by, created_at 
    FROM files 
    WHERE session_id = ? 
    ORDER BY created_at DESC
  `);
  
  return stmt.all(sessionId) as File[];
}

export function deleteFile(id: number, sessionId: string) {
  const stmt = db.prepare(`DELETE FROM files WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}
