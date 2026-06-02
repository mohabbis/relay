const { db } = require('./index');

function addNote(sessionId, content, createdBy) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO notes (session_id, content, created_by, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const info = stmt.run(sessionId, content, createdBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, content, created_by: createdBy, created_at: now, pinned: 0 };
}

function getNotes(sessionId) {
  const stmt = db.prepare(`
    SELECT id, session_id, content, created_by, created_at, pinned
    FROM notes
    WHERE session_id = ?
    ORDER BY pinned DESC, created_at DESC
  `);

  return stmt.all(sessionId);
}

function pinNote(id, sessionId, pinned) {
  const stmt = db.prepare(`UPDATE notes SET pinned = ? WHERE id = ? AND session_id = ?`);
  stmt.run(pinned ? 1 : 0, id, sessionId);
}

function deleteNote(id, sessionId) {
  const stmt = db.prepare(`DELETE FROM notes WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}

module.exports = { addNote, getNotes, pinNote, deleteNote };
