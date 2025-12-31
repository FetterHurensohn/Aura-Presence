/**
 * GDPR Routes - Datenportabilität & Löschung (DSGVO Art. 17/20)
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { exportUserData, scheduleAccountDeletion, cancelAccountDeletion } from '../services/gdprService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/gdpr/export
 * Exportiere alle User-Daten (DSGVO Art. 20 - Datenportabilität)
 */
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info(`GDPR Data Export requested by User ${userId}`);
    
    const userData = await exportUserData(userId);
    
    // Als JSON mit Download-Header
    res.setHeader('Content-Disposition', `attachment; filename="aura-presence-data-${userId}-${Date.now()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    
    res.json(userData);
    
    logger.info(`GDPR Data Export completed for User ${userId}`);
    
  } catch (error) {
    logger.error('GDPR Export Error:', error);
    res.status(500).json({
      error: 'Fehler beim Exportieren der Daten',
      message: 'Deine Daten konnten nicht exportiert werden. Bitte versuche es später erneut.',
      code: 'EXPORT_ERROR'
    });
  }
});

/**
 * DELETE /api/gdpr/delete-account
 * Plane Account-Löschung mit Grace-Period (DSGVO Art. 17 - Recht auf Löschung)
 */
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    logger.warn(`GDPR Account Deletion requested by User ${userId} (${userEmail})`);
    
    const result = await scheduleAccountDeletion(userId);
    
    res.json({
      success: true,
      message: 'Dein Account wird in 30 Tagen gelöscht. Du kannst die Löschung bis dahin abbrechen.',
      scheduledFor: new Date(result.deletionDate).toISOString(),
      deletionDate: result.deletionDate,
      gracePeriodDays: result.gracePeriodDays
    });
    
    logger.info(`GDPR Account Deletion scheduled for User ${userId}, deletion date: ${result.deletionDate}`);
    
  } catch (error) {
    logger.error('GDPR Deletion Scheduling Error:', error);
    res.status(500).json({
      error: 'Fehler beim Planen der Löschung',
      message: 'Die Account-Löschung konnte nicht geplant werden. Bitte versuche es später erneut.',
      code: 'DELETION_SCHEDULE_ERROR'
    });
  }
});

/**
 * POST /api/gdpr/cancel-deletion
 * Breche geplante Account-Löschung ab
 */
router.post('/cancel-deletion', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info(`GDPR Deletion Cancellation requested by User ${userId}`);
    
    const result = await cancelAccountDeletion(userId);
    
    if (!result.wasPending) {
      return res.status(400).json({
        error: 'Keine Löschung geplant',
        message: 'Es ist keine Account-Löschung für deinen Account geplant.',
        code: 'NO_DELETION_PENDING'
      });
    }
    
    res.json({
      success: true,
      message: 'Die geplante Account-Löschung wurde erfolgreich abgebrochen.'
    });
    
    logger.info(`GDPR Deletion cancelled for User ${userId}`);
    
  } catch (error) {
    logger.error('GDPR Deletion Cancellation Error:', error);
    res.status(500).json({
      error: 'Fehler beim Abbrechen der Löschung',
      message: 'Die Löschung konnte nicht abgebrochen werden. Bitte versuche es später erneut.',
      code: 'CANCELLATION_ERROR'
    });
  }
});

/**
 * GET /api/gdpr/deletion-status
 * Prüfe ob Account-Löschung geplant ist
 */
router.get('/deletion-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    
    const isPending = user.deletion_scheduled_at !== null && user.deletion_scheduled_at !== undefined;
    
    res.json({
      isPending,
      scheduledFor: isPending ? new Date(user.deletion_scheduled_at).toISOString() : null,
      daysRemaining: isPending 
        ? Math.ceil((user.deletion_scheduled_at - Date.now()) / (1000 * 60 * 60 * 24))
        : null
    });
    
  } catch (error) {
    logger.error('GDPR Deletion Status Error:', error);
    res.status(500).json({
      error: 'Fehler beim Abrufen des Status',
      message: 'Der Löschungs-Status konnte nicht abgerufen werden.',
      code: 'STATUS_ERROR'
    });
  }
});

export default router;

