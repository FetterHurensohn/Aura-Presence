/**
 * Audit Logger Utilities
 * Umfassende Tracking-Funktionen für User Activity, API Requests, Feature Usage, Errors und Performance
 */

import { getDatabase } from '../database/dbKnex.js';
import logger from './logger.js';

/**
 * Log User Activity
 * @param {number} userId - User ID
 * @param {string} action - Action name (login, logout, analysis_start, etc.)
 * @param {Object} metadata - Additional context
 * @param {Object} req - Express request object (optional)
 */
export async function logUserActivity(userId, action, metadata = {}, req = null) {
  try {
    const db = getDatabase();
    // #region agent log - Hypothesis B: JSONB serialization
    const metadataValue = metadata;
    fetch('http://127.0.0.1:7243/ingest/b9390f91-59df-4f45-bae6-4a81acbfe8e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auditLogger.js:28',message:'metadata before insert',data:{metadataType:typeof metadataValue,isObject:typeof metadataValue==='object',metadataValue},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    await db('user_activity_log').insert({
      user_id: userId,
      action,
      ip_address: req?.ip || null,
      user_agent: req?.headers['user-agent'] || null,
      metadata: metadataValue, // Changed: direct object instead of JSON.stringify
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to log user activity:', error);
  }
}

/**
 * Log API Request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} responseTime - Response time in milliseconds
 */
export async function logApiRequest(req, res, responseTime) {
  try {
    const db = getDatabase();
    await db('api_requests').insert({
      user_id: req.user?.id || null,
      method: req.method,
      endpoint: req.path,
      status_code: res.statusCode,
      response_time_ms: responseTime,
      ip_address: req.ip,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to log API request:', error);
  }
}

/**
 * Log Feature Usage
 * @param {number} userId - User ID
 * @param {string} featureName - Feature name (AI_FEEDBACK, EXPORT_DATA, etc.)
 */
export async function logFeatureUsage(userId, featureName) {
  try {
    const db = getDatabase();
    await db('feature_usage').insert({
      user_id: userId,
      feature_name: featureName,
      usage_count: 1,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to log feature usage:', error);
  }
}

/**
 * Log Error
 * @param {Error} error - Error object
 * @param {Object} req - Express request object (optional)
 * @param {number} userId - User ID (optional)
 */
export async function logError(error, req = null, userId = null) {
  try {
    const db = getDatabase();
    const contextValue = {
      method: req?.method,
      body: req?.body,
      query: req?.query,
    };
    await db('error_logs').insert({
      user_id: userId || req?.user?.id || null,
      error_type: error.name || 'UnknownError',
      error_message: error.message,
      stack_trace: error.stack,
      endpoint: req?.path || null,
      context: contextValue, // Changed: direct object instead of JSON.stringify
      timestamp: Date.now()
    });
  } catch (logError) {
    logger.error('Failed to log error:', logError);
  }
}

/**
 * Track Performance Metric
 * @param {string} metricName - Metric name (api_latency, db_query_time, etc.)
 * @param {number} value - Metric value
 * @param {string} unit - Unit (ms, seconds, count, etc.)
 * @param {Object} metadata - Additional context
 */
export async function trackPerformance(metricName, value, unit = 'ms', metadata = {}) {
  try {
    const db = getDatabase();
    await db('performance_metrics').insert({
      metric_name: metricName,
      value,
      unit,
      metadata: metadata, // Changed: direct object instead of JSON.stringify
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to track performance:', error);
  }
}

