/**
 * GDPR Routes - Datenportabilität & Löschung (DSGVO Art. 17/20)
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { exportUserData, scheduleAccountDeletion, cancelAccountDeletion } from '../services/gdprService.js';
import logger from '../utils/logger.js';
import { sendSuccess, sendError, asyncHandler } from '../utils/responseHelpers.js';
import { ERROR_CODES } from '../schemas/apiSchemas.js';

const router = express.Router();

/**
 * POST /api/gdpr/export
 * Exportiere alle User-Daten (DSGVO Art. 20 - Datenportabilität)
 */
router.post('/export', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  logger.info(`GDPR Data Export requested by User ${userId}`);
  
  const userData = await exportUserData(userId);
  
  logger.info(`GDPR Data Export completed for User ${userId}`);
  
  return sendSuccess(res, userData);
}));

/**
 * POST /api/gdpr/delete
 * Plane Account-Löschung mit Grace-Period (DSGVO Art. 17 - Recht auf Löschung)
 */
router.post('/delete', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  
  logger.warn(`GDPR Account Deletion requested by User ${userId} (${userEmail})`);
  
  const result = await scheduleAccountDeletion(userId);
  
  logger.info(`GDPR Account Deletion scheduled for User ${userId}, deletion date: ${result.deletionDate}`);
  
  return sendSuccess(res, {
    deletionDate: result.deletionDate,
    gracePeriodDays: result.gracePeriodDays,
    alreadyScheduled: result.alreadyScheduled || false,
  });
}));

/**
 * POST /api/gdpr/cancel-deletion
 * Breche geplante Account-Löschung ab
 */
router.post('/cancel-deletion', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  logger.info(`GDPR Deletion Cancellation requested by User ${userId}`);
  
  const result = await cancelAccountDeletion(userId);
  
  logger.info(`GDPR Deletion cancelled for User ${userId}`);
  
  return sendSuccess(res, {
    wasPending: result.wasPending,
  });
}));

/**
 * GET /api/gdpr/deletion-status
 * Prüfe ob Account-Löschung geplant ist
 */
router.get('/deletion-status', authenticateToken, asyncHandler(async (req, res) => {
  const user = req.user;
  
  const isPending = user.deletion_scheduled_at !== null && user.deletion_scheduled_at !== undefined;
  
  return sendSuccess(res, {
    isPending,
    scheduledFor: isPending ? new Date(user.deletion_scheduled_at).toISOString() : null,
    daysRemaining: isPending 
      ? Math.ceil((user.deletion_scheduled_at - Date.now()) / (1000 * 60 * 60 * 24))
      : null
  });
}));

export default router;

