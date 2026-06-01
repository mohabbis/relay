"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFile = addFile;
exports.getFiles = getFiles;
exports.deleteFile = deleteFile;
const index_1 = require("./index");
function addFile(sessionId, filename, url, size, uploadedBy) {
    const stmt = index_1.db.prepare(`
    INSERT INTO files (session_id, filename, url, size, uploaded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    const now = Date.now();
    const info = stmt.run(sessionId, filename, url, size, uploadedBy, now);
    return { id: info.lastInsertRowid, session_id: sessionId, filename, url, size, uploaded_by: uploadedBy, created_at: now };
}
function getFiles(sessionId) {
    const stmt = index_1.db.prepare(`
    SELECT id, session_id, filename, url, size, uploaded_by, created_at 
    FROM files 
    WHERE session_id = ? 
    ORDER BY created_at DESC
  `);
    return stmt.all(sessionId);
}
function deleteFile(id, sessionId) {
    const stmt = index_1.db.prepare(`DELETE FROM files WHERE id = ? AND session_id = ?`);
    stmt.run(id, sessionId);
}
