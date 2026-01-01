/**
 * Request Logger Middleware
 * Logged alle API-Requests automatisch für Analytics und Monitoring
 */

import { logApiRequest } from '../utils/auditLogger.js';

/**
 * Express Middleware für Request Logging
 * Tracked Method, Endpoint, Status Code, Response Time und User ID
 */
export function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Hook into response finish event
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Log async (non-blocking) - Silent fail to not block response
    logApiRequest(req, res, responseTime).catch(() => {
      // Silent fail - don't block response or log recursively
    });
  });
  
  next();
}



