"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSession = getSession;
exports.isSessionValid = isSessionValid;
exports.cleanupExpiredSessions = cleanupExpiredSessions;
const index_1 = require("./index");
const nanoid_1 = require("nanoid");
const SESSION_DURATION_HOURS = 24;
function createSession() {
    const id = (0, nanoid_1.nanoid)(8);
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_HOURS * 60 * 60 * 1000;
    const stmt = index_1.db.prepare(`
    INSERT INTO sessions (id, created_at, expires_at)
    VALUES (?, ?, ?)
  `);
    stmt.run(id, now, expiresAt);
    return { id, expiresAt };
}
function getSession(id) {
    const stmt = index_1.db.prepare(`
    SELECT id, created_at, expires_at FROM sessions WHERE id = ?
  `);
    return stmt.get(id);
}
function isSessionValid(id) {
    const session = getSession(id);
    if (!session)
        return false;
    return session.expires_at > Date.now();
}
function cleanupExpiredSessions() {
    const stmt = index_1.db.prepare(`DELETE FROM sessions WHERE expires_at < ?`);
    stmt.run(Date.now());
}
