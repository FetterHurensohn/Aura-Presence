/**
 * Sessions Routes - Analysis Session Management
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserSessions } from '../models/AnalysisSession.js';
import logger from '../utils/logger.js';
import { sendSuccess, asyncHandler } from '../utils/responseHelpers.js';

const router = express.Router();

/**
 * GET /api/sessions
 * Hole alle Sessions des aktuellen Users
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 50;
  const maxLimit = 100;
  const validLimit = Math.min(limit, maxLimit);
  
  const sessions = await getUserSessions(userId, validLimit);
  
  return sendSuccess(res, {
    success: true,
    sessions,
    count: sessions.length,
    hasMore: sessions.length === validLimit,
  });
}));

/**
 * GET /api/sessions/stats
 * Hole Session-Statistiken des Users
 */
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const sessions = await getUserSessions(userId, 1000); // Alle für Stats
  
  const totalFrames = sessions.reduce((sum, s) => sum + (s.total_frames || 0), 0);
  const avgConfidence = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (s.average_confidence || 0), 0) / sessions.length
    : 0;
  
  // Calculate average session duration
  const durationsMs = sessions
    .filter(s => s.ended_at && s.started_at)
    .map(s => (s.ended_at - s.started_at) * 1000); // Convert seconds to ms
  const avgSessionDuration = durationsMs.length > 0
    ? durationsMs.reduce((sum, d) => sum + d, 0) / durationsMs.length
    : 0;
  
  return sendSuccess(res, {
    totalSessions: sessions.length,
    totalFrames,
    averageConfidence: avgConfidence,
    averageSessionDuration: Math.round(avgSessionDuration),
  });
}));

export default router;

