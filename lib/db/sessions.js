const { db } = require('./index');
const { randomBytes } = require('crypto');

const SESSION_DURATION_HOURS = 24;

function createSession() {
  const id = randomBytes(6).toString('base64url');
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_HOURS * 60 * 60 * 1000;

  const stmt = db.prepare(`
    INSERT INTO sessions (id, created_at, expires_at)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, now, expiresAt);
  return { id, expiresAt };
}

function getSession(id) {
  const stmt = db.prepare(`
    SELECT id, created_at, expires_at FROM sessions WHERE id = ?
  `);

  return stmt.get(id);
}

function isSessionValid(id) {
  const session = getSession(id);
  if (!session) return false;

  return session.expires_at > Date.now();
}

function cleanupExpiredSessions() {
  const stmt = db.prepare(`DELETE FROM sessions WHERE expires_at < ?`);
  stmt.run(Date.now());
}

function deleteSession(id) {
  const stmt = db.prepare(`DELETE FROM sessions WHERE id = ?`);
  stmt.run(id);

  const deleteNotes = db.prepare(`DELETE FROM notes WHERE session_id = ?`);
  deleteNotes.run(id);

  const deleteMessages = db.prepare(`DELETE FROM messages WHERE session_id = ?`);
  deleteMessages.run(id);

  const deleteLinks = db.prepare(`DELETE FROM links WHERE session_id = ?`);
  deleteLinks.run(id);

  const deleteFiles = db.prepare(`DELETE FROM files WHERE session_id = ?`);
  deleteFiles.run(id);
}

module.exports = {
  createSession,
  getSession,
  isSessionValid,
  cleanupExpiredSessions,
  deleteSession,
};
