/**
 * Subscription Routes - Stripe-Integration
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCheckoutSession, constructWebhookEvent, handleWebhookEvent } from '../services/stripeService.js';
import logger from '../utils/logger.js';
import { sendSuccess, sendError, asyncHandler, formatTimestampISO } from '../utils/responseHelpers.js';
import { ERROR_CODES } from '../schemas/apiSchemas.js';
import { getLimit } from '../config/featureGates.js';

const router = express.Router();

/**
 * POST /api/subscription/create-checkout
 * Erstelle Stripe Checkout Session
 */
router.post('/create-checkout', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  
  const { priceId, successUrl, cancelUrl } = req.body;
  
  if (!priceId) {
    return sendError(res, 400, ERROR_CODES.PRICE_ID_REQUIRED, 'Bitte wähle einen Plan aus.');
  }
  
  const session = await createCheckoutSession({
    userId,
    userEmail,
    priceId: priceId || process.env.STRIPE_PRICE_ID,
    successUrl: successUrl || `${process.env.FRONTEND_URL}/success`,
    cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/canceled`
  });
  
  logger.info(`Checkout Session erstellt für User ${userId}: ${session.id}`);
  
  return sendSuccess(res, {
    sessionId: session.id,
    url: session.url
  });
}));

/**
 * POST /api/subscription/webhook
 * Stripe Webhook Handler mit Idempotenz-Check
 * WICHTIG: Diese Route muss RAW Body verwenden (express.raw)
 */
router.post('/webhook', 
  express.raw({ type: 'application/json' }), 
  asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      logger.warn('Webhook ohne Stripe-Signatur erhalten');
      return sendError(res, 400, 'NO_SIGNATURE', 'Die Webhook-Anfrage enthält keine gültige Signatur.');
    }
    
    // Event mit Signatur-Validierung konstruieren
    const event = constructWebhookEvent(req.body, signature);
    
    logger.info(`Stripe Webhook erhalten: ${event.type} (ID: ${event.id})`);
    
    // Idempotenz-Check: Prüfe ob Event bereits verarbeitet wurde (Knex + PostgreSQL)
    const { getDatabase } = await import('../database/dbKnex.js');
    const db = getDatabase();
    const existingEvent = await db('webhook_events').where('event_id', event.id).first();
    
    if (existingEvent) {
      logger.info(`Webhook ${event.id} wurde bereits verarbeitet (Idempotenz) - überspringe`);
      return sendSuccess(res, { received: true, already_processed: true });
    }
    
    // Event verarbeiten
    await handleWebhookEvent(event);
    
    // Event als verarbeitet markieren (mit Payload für Debugging)
    await db('webhook_events').insert({
      event_id: event.id,
      event_type: event.type,
      processed_at: Date.now(),
      payload: JSON.stringify(event)
    });
    
    logger.info(`Webhook ${event.id} erfolgreich verarbeitet und gespeichert`);
    
    // Stripe bestätigen
    return sendSuccess(res, { received: true });
  })
);

/**
 * GET /api/subscription/status
 * Aktuellen Subscription-Status abrufen
 */
router.get('/status', authenticateToken, (req, res) => {
  const { subscription_status, subscription_plan, subscription_current_period_end, role } = req.user;
  
  // Get limits for user role
  const limits = {
    analysisPerMonth: getLimit(role, 'analysisPerMonth'),
    sessionDurationMinutes: getLimit(role, 'sessionDurationMinutes'),
    storageRetentionDays: getLimit(role, 'storageRetentionDays'),
  };
  
  // TODO: Get actual usage from database
  const usage = {
    analysisThisMonth: 0, // Placeholder - should query from analysis_sessions
  };
  
  return sendSuccess(res, {
    status: subscription_status || 'none',
    plan: subscription_plan,
    role: role || 'free',
    currentPeriodEnd: subscription_current_period_end
      ? formatTimestampISO(subscription_current_period_end)
      : null,
    limits,
    usage,
  });
});

export default router;

