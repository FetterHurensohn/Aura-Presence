/**
 * Usage Limits Middleware
 * Prüft ob User sein monatliches Limit erreicht hat (für Free-Plan)
 */

import { getDatabase } from '../database/dbKnex.js';
import { getLimit } from '../config/featureGates.js';
import { sendAuthRequired, sendUsageLimitExceeded } from '../utils/responseHelpers.js';

/**
 * Check Analysis Limit
 * Prüft ob User noch Analysen übrig hat in diesem Monat
 */
export function checkAnalysisLimit() {
  return async (req, res, next) => {
    if (!req.user) {
      return sendAuthRequired(res);
    }
    
    const userRole = req.user.role || 'free';
    const monthlyLimit = getLimit(userRole, 'analysisPerMonth');
    
    // Unlimited for pro/enterprise
    if (monthlyLimit === -1) {
      return next();
    }
    
    // Check usage this month
    const db = getDatabase();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const usageCount = await db('analysis_sessions')
      .where('user_id', req.user.id)
      .where('started_at', '>=', Math.floor(startOfMonth.getTime() / 1000))
      .count('id as count')
      .first();
    
    const currentUsage = parseInt(usageCount.count) || 0;
    
    if (currentUsage >= monthlyLimit) {
      return sendUsageLimitExceeded(res, monthlyLimit, currentUsage, `Free Plan erlaubt ${monthlyLimit} Analysen pro Monat. Upgrade auf Pro für unbegrenzte Analysen.`);
    }
    
    next();
  };
}

