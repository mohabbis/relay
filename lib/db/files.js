const { db } = require('./index');

function addFile(sessionId, filename, url, size, uploadedBy) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO files (session_id, filename, url, size, uploaded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(sessionId, filename, url, size, uploadedBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, filename, url, size, uploaded_by: uploadedBy, created_at: now };
}

function getFiles(sessionId) {
  const stmt = db.prepare(`
    SELECT id, session_id, filename, url, size, uploaded_by, created_at
    FROM files
    WHERE session_id = ?
    ORDER BY created_at DESC
  `);

  return stmt.all(sessionId);
}

function deleteFile(id, sessionId) {
  const stmt = db.prepare(`DELETE FROM files WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}

module.exports = { addFile, getFiles, deleteFile };
