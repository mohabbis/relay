"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNote = addNote;
exports.getNotes = getNotes;
exports.deleteNote = deleteNote;
const index_1 = require("./index");
function addNote(sessionId, content, createdBy) {
    const stmt = index_1.db.prepare(`
    INSERT INTO notes (session_id, content, created_by, created_at)
    VALUES (?, ?, ?, ?)
  `);
    const now = Date.now();
    const info = stmt.run(sessionId, content, createdBy, now);
    return { id: info.lastInsertRowid, session_id: sessionId, content, created_by: createdBy, created_at: now };
}
function getNotes(sessionId) {
    const stmt = index_1.db.prepare(`
    SELECT id, session_id, content, created_by, created_at 
    FROM notes 
    WHERE session_id = ? 
    ORDER BY created_at DESC
  `);
    return stmt.all(sessionId);
}
function deleteNote(id, sessionId) {
    const stmt = index_1.db.prepare(`DELETE FROM notes WHERE id = ? AND session_id = ?`);
    stmt.run(id, sessionId);
}
