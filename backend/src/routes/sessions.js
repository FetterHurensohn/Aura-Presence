/**
 * Sessions Routes - Analysis Session Management
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserSessions } from '../models/AnalysisSession.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/sessions
 * Hole alle Sessions des aktuellen Users
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    
    const sessions = await getUserSessions(userId, limit);
    
    res.json({
      success: true,
      sessions,
      count: sessions.length
    });
    
  } catch (error) {
    logger.error('Error fetching sessions:', error);
    res.status(500).json({
      error: 'Fehler beim Abrufen der Sessions',
      message: 'Die Sessions konnten nicht geladen werden.',
      code: 'SESSIONS_FETCH_ERROR'
    });
  }
});

/**
 * GET /api/sessions/stats
 * Hole Session-Statistiken des Users
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await getUserSessions(userId, 1000); // Alle für Stats
    
    const stats = {
      totalSessions: sessions.length,
      totalFrames: sessions.reduce((sum, s) => sum + (s.totalFrames || 0), 0),
      averageConfidence: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.averageConfidence || 0), 0) / sessions.length
        : 0,
      totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      lastSession: sessions[0] || null
    };
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    logger.error('Error fetching session stats:', error);
    res.status(500).json({
      error: 'Fehler beim Abrufen der Statistiken',
      message: 'Die Statistiken konnten nicht geladen werden.',
      code: 'STATS_FETCH_ERROR'
    });
  }
});

export default router;

