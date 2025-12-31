/**
 * Subscription Routes - Stripe-Integration
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCheckoutSession, constructWebhookEvent, handleWebhookEvent } from '../services/stripeService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/subscription/create-checkout
 * Erstelle Stripe Checkout Session
 */
router.post('/create-checkout', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    const { priceId, successUrl, cancelUrl } = req.body;
    
    if (!priceId) {
      return res.status(400).json({
        error: 'priceId ist erforderlich',
        message: 'Bitte wähle einen Plan aus.',
        code: 'PRICE_ID_REQUIRED'
      });
    }
    
    const session = await createCheckoutSession({
      userId,
      userEmail,
      priceId: priceId || process.env.STRIPE_PRICE_ID,
      successUrl: successUrl || `${process.env.FRONTEND_URL}/success`,
      cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/canceled`
    });
    
    logger.info(`Checkout Session erstellt für User ${userId}: ${session.id}`);
    
    res.json({
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    logger.error('Fehler beim Erstellen der Checkout Session:', error);
    res.status(500).json({
      error: 'Fehler beim Erstellen der Checkout Session',
      message: 'Die Zahlungssitzung konnte nicht erstellt werden. Bitte versuche es später erneut.',
      code: 'CHECKOUT_ERROR'
    });
  }
});

/**
 * POST /api/subscription/webhook
 * Stripe Webhook Handler mit Idempotenz-Check
 * WICHTIG: Diese Route muss RAW Body verwenden (express.raw)
 */
router.post('/webhook', 
  express.raw({ type: 'application/json' }), 
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      logger.warn('Webhook ohne Stripe-Signatur erhalten');
      return res.status(400).json({
        error: 'Fehlende Stripe-Signatur',
        message: 'Die Webhook-Anfrage enthält keine gültige Signatur.',
        code: 'NO_SIGNATURE'
      });
    }
    
    try {
      // Event mit Signatur-Validierung konstruieren
      const event = constructWebhookEvent(req.body, signature);
      
      logger.info(`Stripe Webhook erhalten: ${event.type} (ID: ${event.id})`);
      
      // Idempotenz-Check: Prüfe ob Event bereits verarbeitet wurde
      const db = (await import('../database/db.js')).default();
      const existingEvent = db.prepare('SELECT * FROM webhook_events WHERE event_id = ?').get(event.id);
      
      if (existingEvent) {
        logger.info(`Webhook ${event.id} wurde bereits verarbeitet (Idempotenz) - überspringe`);
        return res.json({ received: true, already_processed: true });
      }
      
      // Event verarbeiten
      await handleWebhookEvent(event);
      
      // Event als verarbeitet markieren (mit Payload für Debugging)
      const insertStmt = db.prepare(`
        INSERT INTO webhook_events (event_id, event_type, processed_at, payload)
        VALUES (?, ?, ?, ?)
      `);
      
      insertStmt.run(
        event.id,
        event.type,
        Date.now(),
        JSON.stringify(event)
      );
      
      logger.info(`Webhook ${event.id} erfolgreich verarbeitet und gespeichert`);
      
      // Stripe bestätigen
      res.json({ received: true });
      
    } catch (error) {
      logger.error('Webhook-Fehler:', error);
      // Bei Fehler: 500 zurückgeben damit Stripe retried
      return res.status(500).json({
        error: 'Webhook-Fehler',
        message: 'Die Webhook-Anfrage konnte nicht verarbeitet werden.',
        code: 'WEBHOOK_ERROR'
      });
    }
  }
);

/**
 * GET /api/subscription/status
 * Aktuellen Subscription-Status abrufen
 */
router.get('/status', authenticateToken, (req, res) => {
  const { subscription_status, subscription_plan, subscription_current_period_end } = req.user;
  
  res.json({
    status: subscription_status || 'none',
    plan: subscription_plan,
    currentPeriodEnd: subscription_current_period_end
      ? new Date(subscription_current_period_end).toISOString()
      : null
  });
});

export default router;

