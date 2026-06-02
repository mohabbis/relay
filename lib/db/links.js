const { db } = require('./index');

function addLink(sessionId, url, title, createdBy) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO links (session_id, url, title, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(sessionId, url, title, createdBy, now);
  return { id: info.lastInsertRowid, session_id: sessionId, url, title, created_by: createdBy, created_at: now };
}

function getLinks(sessionId) {
  const stmt = db.prepare(`
    SELECT id, session_id, url, title, created_by, created_at
    FROM links
    WHERE session_id = ?
    ORDER BY created_at DESC
  `);

  return stmt.all(sessionId);
}

function deleteLink(id, sessionId) {
  const stmt = db.prepare(`DELETE FROM links WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}

module.exports = { addLink, getLinks, deleteLink };
