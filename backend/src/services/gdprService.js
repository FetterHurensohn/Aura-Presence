/**
 * GDPR Service - Datenportabilität & Löschung
 * Implementiert DSGVO Art. 17 (Recht auf Löschung) und Art. 20 (Datenportabilität)
 */

import { findUserById } from '../models/User.js';
import logger from '../utils/logger.js';

const GDPR_DELETION_DELAY_DAYS = parseInt(process.env.GDPR_DELETION_DELAY_DAYS || '30');

/**
 * Exportiere alle User-Daten (DSGVO Art. 20)
 */
export async function exportUserData(userId) {
  try {
    const user = findUserById(userId);
    
    if (!user) {
      throw new Error('User nicht gefunden');
    }
    
    // Lade verknüpfte Daten
    const db = (await import('../database/db.js')).default();
    
    // Analysis Sessions
    const sessions = db.prepare(`
      SELECT id, started_at, ended_at, total_frames, average_confidence, metadata
      FROM analysis_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC
    `).all(userId);
    
    // Webhook Events (nur User-relevante)
    const webhookEvents = db.prepare(`
      SELECT event_id, event_type, processed_at
      FROM webhook_events
      WHERE user_id = ?
      ORDER BY processed_at DESC
    `).all(userId);
    
    // Zusammenstellen (OHNE sensible Daten)
    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      user: {
        id: user.id,
        email: user.email,
        // KEIN password_hash!
        createdAt: new Date(user.created_at).toISOString(),
        updatedAt: new Date(user.updated_at).toISOString()
      },
      subscription: {
        status: user.subscription_status,
        plan: user.subscription_plan,
        currentPeriodEnd: user.subscription_current_period_end 
          ? new Date(user.subscription_current_period_end).toISOString()
          : null,
        stripeCustomerId: user.stripe_customer_id || null
      },
      analysisSessions: sessions.map(s => ({
        id: s.id,
        startedAt: new Date(s.started_at).toISOString(),
        endedAt: s.ended_at ? new Date(s.ended_at).toISOString() : null,
        totalFrames: s.total_frames,
        averageConfidence: s.average_confidence,
        metadata: s.metadata ? JSON.parse(s.metadata) : null
      })),
      webhookEvents: webhookEvents.map(e => ({
        eventId: e.event_id,
        eventType: e.event_type,
        processedAt: new Date(e.processed_at).toISOString()
      })),
      gdprInfo: {
        dataController: 'Aura Presence',
        contactEmail: 'datenschutz@aurapresence.com', // TODO: Anpassen
        rightsInfo: 'Du hast das Recht auf Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten gemäß DSGVO.'
      }
    };
    
    return exportData;
    
  } catch (error) {
    logger.error('Error exporting user data:', error);
    throw error;
  }
}

/**
 * Plane Account-Löschung mit Grace-Period (DSGVO Art. 17)
 */
export async function scheduleAccountDeletion(userId) {
  try {
    const user = findUserById(userId);
    
    if (!user) {
      throw new Error('User nicht gefunden');
    }
    
    // Prüfe ob bereits geplant
    if (user.deletion_scheduled_at) {
      logger.warn(`User ${userId} hat bereits geplante Löschung: ${user.deletion_scheduled_at}`);
      return {
        deletionDate: user.deletion_scheduled_at,
        gracePeriodDays: GDPR_DELETION_DELAY_DAYS,
        alreadyScheduled: true
      };
    }
    
    // Berechne Löschungsdatum (jetzt + Grace-Period)
    const deletionDate = Date.now() + (GDPR_DELETION_DELAY_DAYS * 24 * 60 * 60 * 1000);
    
    // Speichere in DB
    const db = (await import('../database/db.js')).default();
    const stmt = db.prepare(`
      UPDATE users 
      SET deletion_scheduled_at = ?,
          updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(deletionDate, Date.now(), userId);
    
    logger.info(`Account deletion scheduled for User ${userId}, deletion date: ${new Date(deletionDate).toISOString()}`);
    
    // TODO: E-Mail-Benachrichtigung senden
    // await sendDeletionScheduledEmail(user.email, deletionDate);
    
    return {
      deletionDate,
      gracePeriodDays: GDPR_DELETION_DELAY_DAYS,
      alreadyScheduled: false
    };
    
  } catch (error) {
    logger.error('Error scheduling account deletion:', error);
    throw error;
  }
}

/**
 * Breche geplante Account-Löschung ab
 */
export async function cancelAccountDeletion(userId) {
  try {
    const user = findUserById(userId);
    
    if (!user) {
      throw new Error('User nicht gefunden');
    }
    
    const wasPending = user.deletion_scheduled_at !== null && user.deletion_scheduled_at !== undefined;
    
    if (!wasPending) {
      return { wasPending: false };
    }
    
    // Entferne Löschungs-Datum
    const db = (await import('../database/db.js')).default();
    const stmt = db.prepare(`
      UPDATE users 
      SET deletion_scheduled_at = NULL,
          updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(Date.now(), userId);
    
    logger.info(`Account deletion cancelled for User ${userId}`);
    
    // TODO: E-Mail-Benachrichtigung senden
    // await sendDeletionCancelledEmail(user.email);
    
    return { wasPending: true };
    
  } catch (error) {
    logger.error('Error cancelling account deletion:', error);
    throw error;
  }
}

/**
 * Führe geplante Löschungen aus (wird von Cron-Job aufgerufen)
 * Löscht alle Accounts deren deletion_scheduled_at <= jetzt ist
 */
export async function executeScheduledDeletions() {
  try {
    const db = (await import('../database/db.js')).default();
    
    const now = Date.now();
    
    // Finde alle zu löschenden Accounts
    const usersToDelete = db.prepare(`
      SELECT id, email, deletion_scheduled_at
      FROM users
      WHERE deletion_scheduled_at IS NOT NULL
        AND deletion_scheduled_at <= ?
    `).all(now);
    
    if (usersToDelete.length === 0) {
      logger.info('No accounts scheduled for deletion');
      return { deletedCount: 0 };
    }
    
    logger.info(`Found ${usersToDelete.length} accounts to delete`);
    
    let deletedCount = 0;
    
    for (const user of usersToDelete) {
      try {
        // Lösche User (CASCADE löscht verknüpfte Daten)
        const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?');
        deleteStmt.run(user.id);
        
        logger.info(`Deleted user ${user.id} (${user.email}) - scheduled for ${new Date(user.deletion_scheduled_at).toISOString()}`);
        
        deletedCount++;
        
        // TODO: E-Mail-Benachrichtigung (optional, da Account weg ist)
        // await sendDeletionCompletedEmail(user.email);
        
      } catch (error) {
        logger.error(`Error deleting user ${user.id}:`, error);
        // Weiter mit nächstem User
      }
    }
    
    logger.info(`GDPR Scheduled Deletions completed: ${deletedCount} accounts deleted`);
    
    return { deletedCount };
    
  } catch (error) {
    logger.error('Error executing scheduled deletions:', error);
    throw error;
  }
}

