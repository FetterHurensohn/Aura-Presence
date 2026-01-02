/**
 * API Schema Definitions
 * Zentrale Schema-Definitionen für alle API-Requests und Responses
 * JSDoc-kompatibel für IDE-Support
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - Email address
 * @property {'free'|'pro'|'enterprise'} role - User role
 * @property {'none'|'active'|'trialing'|'canceled'|'past_due'} subscription_status - Subscription status
 * @property {string|null} subscription_plan - Stripe plan ID
 * @property {number|null} subscription_current_period_end - Unix timestamp
 * @property {number} created_at - Unix timestamp
 * @property {number} updated_at - Unix timestamp
 */

/**
 * @typedef {Object} Metric
 * @property {any} value - Metric value
 * @property {string} status - Status (good, warning, poor, etc.)
 * @property {number} [score] - Score 0-1
 * @property {string} description - Human-readable description
 */

/**
 * @typedef {Object} Session
 * @property {number} id - Session ID
 * @property {number} user_id - User ID
 * @property {number} started_at - Unix timestamp
 * @property {number|null} ended_at - Unix timestamp
 * @property {number} total_frames - Total frames analyzed
 * @property {number|null} average_confidence - Average confidence 0-1
 * @property {object|null} metadata - Additional metadata
 */

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

/**
 * @typedef {Object} AuthRegisterRequest
 * @property {string} email - Email address (format: email)
 * @property {string} password - Password (min 8 chars)
 */

/**
 * @typedef {Object} AuthRegisterResponse
 * @property {string} message - Success message
 * @property {Omit<User, 'password_hash'>} user - User object without password
 * @property {string} token - JWT access token (expires 15m)
 */

/**
 * @typedef {Object} AuthLoginRequest
 * @property {string} email - Email address
 * @property {string} password - Password
 */

/**
 * @typedef {Object} AuthLoginResponse
 * @property {string} message - Success message
 * @property {Omit<User, 'password_hash'>} user - User object without password
 * @property {string} token - JWT access token (expires 15m)
 * @property {string} refreshToken - Refresh token (expires 7d)
 */

/**
 * @typedef {Object} AuthRefreshRequest
 * @property {string} refreshToken - Refresh token
 */

/**
 * @typedef {Object} AuthRefreshResponse
 * @property {string} token - New JWT access token
 * @property {string} refreshToken - New refresh token
 */

/**
 * @typedef {Object} AuthLogoutRequest
 * @property {string} refreshToken - Refresh token to revoke
 */

/**
 * @typedef {Object} AuthLogoutResponse
 * @property {string} message - Success message
 */

// ============================================================================
// ANALYZE SCHEMAS
// ============================================================================

/**
 * @typedef {Object} AnalyzeFeatures
 * @property {number} [eye_contact_quality] - Eye contact quality 0-1
 * @property {number} [blink_rate] - Blink rate per minute
 * @property {string} [facial_expression] - Facial expression enum
 * @property {Object} [head_pose] - Head pose angles
 * @property {number} [head_pose.pitch] - Pitch angle -90 to 90
 * @property {number} [head_pose.yaw] - Yaw angle -90 to 90
 * @property {number} [head_pose.roll] - Roll angle -45 to 45
 * @property {string[]} [hands_detected] - Detected hands ['left', 'right']
 * @property {string} [left_hand_gesture] - Left hand gesture enum
 * @property {string} [right_hand_gesture] - Right hand gesture enum
 * @property {number} [hand_movement_speed] - Hand movement speed 0-2+
 * @property {number} [posture_angle] - Posture angle -45 to 45
 * @property {number} frame_timestamp - Frame timestamp (Unix ms)
 * @property {number} [confidence] - Overall confidence 0-1
 */

/**
 * @typedef {Object} AnalyzeRequest
 * @property {AnalyzeFeatures} features - Analysis features
 * @property {string} [sessionId] - Client session ID
 * @property {Object} [metadata] - Additional metadata
 * @property {number} [metadata.dbSessionId] - Database session ID
 */

/**
 * @typedef {Object} AnalyzeEvaluation
 * @property {Object} metrics - Evaluation metrics
 * @property {Metric} metrics.eyeContactQuality
 * @property {Metric} metrics.blinkRate
 * @property {Metric} metrics.facialExpression
 * @property {Metric} metrics.headPose
 * @property {Metric} metrics.handsDetected
 * @property {Metric} metrics.handMovementSpeed
 * @property {Metric} metrics.handGestures
 * @property {Metric} metrics.posture
 * @property {string[]} flags - Warning flags
 * @property {number} confidence - Overall confidence 0-1
 */

/**
 * @typedef {Object} AnalyzeInterpretation
 * @property {string} feedback - AI-generated feedback
 * @property {string} tone - Feedback tone (constructive, encouraging, etc.)
 * @property {string} source - Source of interpretation (openai, mock)
 */

/**
 * @typedef {Object} AnalyzeResponse
 * @property {boolean} success - Success status
 * @property {number} timestamp - Response timestamp (Unix ms)
 * @property {string} sessionId - Client session ID
 * @property {number} dbSessionId - Database session ID
 * @property {AnalyzeEvaluation} evaluation - Evaluation results
 * @property {AnalyzeInterpretation} interpretation - AI interpretation
 * @property {Object} metadata - Response metadata
 * @property {number} metadata.processingTime - Processing time in ms
 * @property {number} metadata.userId - User ID
 */

// ============================================================================
// SUBSCRIPTION SCHEMAS
// ============================================================================

/**
 * @typedef {Object} SubscriptionCreateCheckoutRequest
 * @property {string} priceId - Stripe price ID
 * @property {string} [successUrl] - Success redirect URL
 * @property {string} [cancelUrl] - Cancel redirect URL
 */

/**
 * @typedef {Object} SubscriptionCreateCheckoutResponse
 * @property {string} sessionId - Stripe session ID
 * @property {string} url - Stripe checkout URL
 */

/**
 * @typedef {Object} SubscriptionStatusResponse
 * @property {'none'|'active'|'trialing'|'canceled'|'past_due'} status - Subscription status
 * @property {string|null} plan - Stripe plan ID
 * @property {'free'|'pro'|'enterprise'} role - User role
 * @property {string|null} currentPeriodEnd - Period end (ISO 8601)
 * @property {Object} limits - Usage limits
 * @property {number} limits.analysisPerMonth - Monthly analysis limit (-1 = unlimited)
 * @property {number} limits.sessionDurationMinutes - Session duration limit (-1 = unlimited)
 * @property {number} limits.storageRetentionDays - Storage retention days
 * @property {Object} usage - Current usage
 * @property {number} usage.analysisThisMonth - Analysis count this month
 */

// ============================================================================
// SESSIONS SCHEMAS
// ============================================================================

/**
 * @typedef {Object} SessionsHistoryRequest
 * @property {number} [limit] - Max results (default 50, max 100)
 * @property {number} [offset] - Offset for pagination (default 0)
 * @property {number} [from] - Filter from timestamp (Unix ms)
 * @property {number} [to] - Filter to timestamp (Unix ms)
 */

/**
 * @typedef {Object} SessionsHistoryResponse
 * @property {boolean} success - Success status
 * @property {Session[]} sessions - Array of sessions
 * @property {number} count - Number of sessions returned
 * @property {boolean} hasMore - More sessions available
 */

/**
 * @typedef {Object} SessionsStatsResponse
 * @property {number} totalSessions - Total session count
 * @property {number} totalFrames - Total frames analyzed
 * @property {number} averageConfidence - Average confidence 0-1
 * @property {number} averageSessionDuration - Average duration in ms
 */

// ============================================================================
// GDPR SCHEMAS
// ============================================================================

/**
 * @typedef {Object} GDPRExportResponse
 * @property {string} exportDate - Export date (ISO 8601)
 * @property {string} exportVersion - Export format version
 * @property {Object} user - User data
 * @property {number} user.id - User ID
 * @property {string} user.email - Email
 * @property {string} user.createdAt - Created date (ISO 8601)
 * @property {string} user.updatedAt - Updated date (ISO 8601)
 * @property {Object} subscription - Subscription data
 * @property {string} subscription.status - Status
 * @property {string|null} subscription.plan - Plan ID
 * @property {string|null} subscription.currentPeriodEnd - Period end (ISO 8601)
 * @property {string|null} subscription.stripeCustomerId - Stripe customer ID
 * @property {Array} analysisSessions - Analysis sessions
 * @property {Array} webhookEvents - Webhook events
 * @property {Object} gdprInfo - GDPR information
 * @property {string} gdprInfo.dataController - Data controller
 * @property {string} gdprInfo.contactEmail - Contact email
 * @property {string} gdprInfo.rightsInfo - Rights information
 */

/**
 * @typedef {Object} GDPRDeleteResponse
 * @property {number} deletionDate - Deletion date (Unix timestamp)
 * @property {number} gracePeriodDays - Grace period in days
 * @property {boolean} alreadyScheduled - Already scheduled flag
 */

/**
 * @typedef {Object} GDPRCancelDeletionResponse
 * @property {boolean} wasPending - Was deletion pending
 */

// ============================================================================
// USER SCHEMAS
// ============================================================================

/**
 * @typedef {Object} UserLimitsResponse
 * @property {'free'|'pro'|'enterprise'} role - User role
 * @property {Object} limits - Usage limits
 * @property {number} limits.analysisPerMonth - Monthly analysis limit
 * @property {number} limits.sessionDurationMinutes - Session duration limit
 * @property {number} limits.storageRetentionDays - Storage retention days
 * @property {Object} usage - Current usage
 * @property {number} usage.analysisThisMonth - Analysis count this month
 * @property {Object} features - Available features
 */

/**
 * @typedef {Object} UserProfileResponse
 * @property {number} id - User ID
 * @property {string} email - Email address
 * @property {'free'|'pro'|'enterprise'} role - User role
 * @property {string} subscription_status - Subscription status
 * @property {number} created_at - Created timestamp
 * @property {number} updated_at - Updated timestamp
 */

// ============================================================================
// ERROR SCHEMAS
// ============================================================================

/**
 * @typedef {Object} ErrorResponse
 * @property {string} error - Short error title
 * @property {string} message - User-friendly message (German)
 * @property {string} code - ERROR_CODE in UPPER_SNAKE_CASE
 * @property {any} [details] - Optional additional context
 * @property {string[]} [requiredRoles] - Required roles (for 403 errors)
 * @property {number} [limit] - Usage limit (for 429 errors)
 * @property {number} [current] - Current usage (for 429 errors)
 */

// ============================================================================
// EXPORTS
// ============================================================================

export const schemas = {
  // Auth
  AuthRegisterRequest: 'See JSDoc',
  AuthRegisterResponse: 'See JSDoc',
  AuthLoginRequest: 'See JSDoc',
  AuthLoginResponse: 'See JSDoc',
  AuthRefreshRequest: 'See JSDoc',
  AuthRefreshResponse: 'See JSDoc',
  AuthLogoutRequest: 'See JSDoc',
  AuthLogoutResponse: 'See JSDoc',
  
  // Analyze
  AnalyzeRequest: 'See JSDoc',
  AnalyzeResponse: 'See JSDoc',
  
  // Subscription
  SubscriptionCreateCheckoutRequest: 'See JSDoc',
  SubscriptionCreateCheckoutResponse: 'See JSDoc',
  SubscriptionStatusResponse: 'See JSDoc',
  
  // Sessions
  SessionsHistoryRequest: 'See JSDoc',
  SessionsHistoryResponse: 'See JSDoc',
  SessionsStatsResponse: 'See JSDoc',
  
  // GDPR
  GDPRExportResponse: 'See JSDoc',
  GDPRDeleteResponse: 'See JSDoc',
  GDPRCancelDeletionResponse: 'See JSDoc',
  
  // User
  UserLimitsResponse: 'See JSDoc',
  UserProfileResponse: 'See JSDoc',
  
  // Error
  ErrorResponse: 'See JSDoc',
};

/**
 * Standard Error Codes
 */
export const ERROR_CODES = {
  // 400 Bad Request
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PRICE_ID_REQUIRED: 'PRICE_ID_REQUIRED',
  
  // 401 Unauthorized
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NO_REFRESH_TOKEN: 'NO_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  
  // 403 Forbidden
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  
  // 404 Not Found
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  
  // 409 Conflict
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  
  // 429 Too Many Requests
  USAGE_LIMIT_EXCEEDED: 'USAGE_LIMIT_EXCEEDED',
  
  // 500 Internal Server Error
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  REGISTRATION_ERROR: 'REGISTRATION_ERROR',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REFRESH_ERROR: 'REFRESH_ERROR',
  ANALYSIS_ERROR: 'ANALYSIS_ERROR',
  SESSIONS_FETCH_ERROR: 'SESSIONS_FETCH_ERROR',
  CHECKOUT_ERROR: 'CHECKOUT_ERROR',
  WEBHOOK_ERROR: 'WEBHOOK_ERROR',
  EXPORT_ERROR: 'EXPORT_ERROR',
  DELETION_SCHEDULE_ERROR: 'DELETION_SCHEDULE_ERROR',
  DELETION_CANCEL_ERROR: 'DELETION_CANCEL_ERROR',
};

export default schemas;



