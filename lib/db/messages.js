const { db } = require('./index');

function addMessage(sessionId, content, sender) {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO messages (session_id, content, sender, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const info = stmt.run(sessionId, content, sender, now);
  return { id: info.lastInsertRowid, session_id: sessionId, content, sender, created_at: now };
}

function getMessages(sessionId) {
  const stmt = db.prepare(`
    SELECT id, session_id, content, sender, created_at
    FROM messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `);

  return stmt.all(sessionId);
}

function deleteMessage(id, sessionId) {
  const stmt = db.prepare(`DELETE FROM messages WHERE id = ? AND session_id = ?`);
  stmt.run(id, sessionId);
}

module.exports = { addMessage, getMessages, deleteMessage };
