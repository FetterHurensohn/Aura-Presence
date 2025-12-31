/**
 * Analysis Session Model
 * Verwaltet Analyse-Sessions in der Datenbank
 */

import logger from '../utils/logger.js';

/**
 * Erstelle neue Analysis Session
 */
export async function createSession(userId, metadata = {}) {
  try {
    const db = (await import('../database/db.js')).default();
    
    const stmt = db.prepare(`
      INSERT INTO analysis_sessions (user_id, started_at, metadata)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(
      userId,
      Date.now(),
      JSON.stringify(metadata)
    );
    
    logger.info(`Analysis session created: ${result.lastInsertRowid} for user ${userId}`);
    
    return {
      id: result.lastInsertRowid,
      userId,
      startedAt: Date.now(),
      metadata
    };
    
  } catch (error) {
    logger.error('Error creating analysis session:', error);
    throw error;
  }
}

/**
 * Update Session mit Frame-Daten
 */
export async function updateSession(sessionId, frameData) {
  try {
    const db = (await import('../database/db.js')).default();
    
    // Hole aktuelle Session
    const session = db.prepare('SELECT * FROM analysis_sessions WHERE id = ?').get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    const newTotalFrames = (session.total_frames || 0) + 1;
    const currentAvgConfidence = session.average_confidence || 0;
    const newAvgConfidence = (currentAvgConfidence * (newTotalFrames - 1) + frameData.confidence) / newTotalFrames;
    
    const stmt = db.prepare(`
      UPDATE analysis_sessions
      SET total_frames = ?,
          average_confidence = ?
      WHERE id = ?
    `);
    
    stmt.run(newTotalFrames, newAvgConfidence, sessionId);
    
    return {
      totalFrames: newTotalFrames,
      averageConfidence: newAvgConfidence
    };
    
  } catch (error) {
    logger.error('Error updating analysis session:', error);
    throw error;
  }
}

/**
 * Beende Session
 */
export async function endSession(sessionId) {
  try {
    const db = (await import('../database/db.js')).default();
    
    const stmt = db.prepare(`
      UPDATE analysis_sessions
      SET ended_at = ?
      WHERE id = ?
    `);
    
    stmt.run(Date.now(), sessionId);
    
    logger.info(`Analysis session ended: ${sessionId}`);
    
  } catch (error) {
    logger.error('Error ending analysis session:', error);
    throw error;
  }
}

/**
 * Hole alle Sessions eines Users
 */
export async function getUserSessions(userId, limit = 50) {
  try {
    const db = (await import('../database/db.js')).default();
    
    const stmt = db.prepare(`
      SELECT id, started_at, ended_at, total_frames, average_confidence, metadata
      FROM analysis_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC
      LIMIT ?
    `);
    
    const sessions = stmt.all(userId, limit);
    
    return sessions.map(s => ({
      id: s.id,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      totalFrames: s.total_frames,
      averageConfidence: s.average_confidence,
      metadata: s.metadata ? JSON.parse(s.metadata) : null,
      duration: s.ended_at ? s.ended_at - s.started_at : null
    }));
    
  } catch (error) {
    logger.error('Error getting user sessions:', error);
    throw error;
  }
}

/**
 * Lösche alte Sessions (Retention-Policy)
 */
export async function cleanupOldSessions() {
  try {
    const db = (await import('../database/db.js')).default();
    
    const retentionDays = parseInt(process.env.SESSION_RETENTION_DAYS || '90');
    const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    const stmt = db.prepare(`
      DELETE FROM analysis_sessions
      WHERE started_at < ?
    `);
    
    const result = stmt.run(cutoffDate);
    
    logger.info(`Cleaned up ${result.changes} old analysis sessions (older than ${retentionDays} days)`);
    
    return { deletedCount: result.changes };
    
  } catch (error) {
    logger.error('Error cleaning up old sessions:', error);
    throw error;
  }
}

