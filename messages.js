"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = addMessage;
exports.getMessages = getMessages;
exports.deleteMessage = deleteMessage;
const index_1 = require("./index");
function addMessage(sessionId, content, sender) {
    const stmt = index_1.db.prepare(`
    INSERT INTO messages (session_id, content, sender, created_at)
    VALUES (?, ?, ?, ?)
  `);
    const now = Date.now();
    const info = stmt.run(sessionId, content, sender, now);
    return { id: info.lastInsertRowid, session_id: sessionId, content, sender, created_at: now };
}
function getMessages(sessionId) {
    const stmt = index_1.db.prepare(`
    SELECT id, session_id, content, sender, created_at 
    FROM messages 
    WHERE session_id = ? 
    ORDER BY created_at ASC
  `);
    return stmt.all(sessionId);
}
function deleteMessage(id, sessionId) {
    const stmt = index_1.db.prepare(`DELETE FROM messages WHERE id = ? AND session_id = ?`);
    stmt.run(id, sessionId);
}
