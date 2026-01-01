/**
 * Stripe Service - Payment und Subscription Management
 */

import Stripe from 'stripe';
import { findUserById, updateStripeCustomerId, updateSubscription } from '../models/User.js';
import { getDatabase } from '../database/dbKnex.js';
import logger from '../utils/logger.js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  logger.warn('STRIPE_SECRET_KEY nicht gesetzt - Stripe-Funktionen deaktiviert');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
}) : null;

/**
 * Erstelle Checkout Session für Subscription
 */
export async function createCheckoutSession({ userId, userEmail, priceId, successUrl, cancelUrl }) {
  if (!stripe) {
    throw new Error('Stripe ist nicht konfiguriert');
  }
  
  try {
    const user = await findUserById(userId); // Fixed: added await
    
    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }
    
    // Session-Parameter
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId.toString(),
      customer_email: userEmail,
      metadata: {
        userId: userId.toString()
      }
    };
    
    // Wenn bereits Stripe Customer ID existiert, verwende diese
    if (user.stripe_customer_id) {
      sessionParams.customer = user.stripe_customer_id;
      delete sessionParams.customer_email;
    }
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    logger.info(`Stripe Checkout Session erstellt: ${session.id} für User ${userId}`);
    
    return session;
    
  } catch (error) {
    logger.error('Fehler beim Erstellen der Checkout Session:', error);
    throw error;
  }
}

/**
 * Webhook Event mit Signatur-Validierung konstruieren
 */
export function constructWebhookEvent(payload, signature) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe Webhook nicht konfiguriert');
  }
  
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error('Webhook-Signatur-Validierung fehlgeschlagen:', error);
    throw error;
  }
}

/**
 * Verarbeite Stripe Webhook Events
 */
export async function handleWebhookEvent(event) {
  logger.info(`Verarbeite Webhook Event: ${event.type}`);
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object);
        break;
        
      default:
        logger.debug(`Unbehandelter Event-Typ: ${event.type}`);
    }
  } catch (error) {
    logger.error(`Fehler beim Verarbeiten von Event ${event.type}:`, error);
    throw error;
  }
}

/**
 * Handle: Checkout Session abgeschlossen
 */
async function handleCheckoutCompleted(session) {
  const userId = parseInt(session.client_reference_id || session.metadata?.userId);
  
  // #region agent log - Hypothesis C: async/await
  fetch('http://127.0.0.1:7243/ingest/b9390f91-59df-4f45-bae6-4a81acbfe8e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripeService.js:140',message:'handleCheckoutCompleted entry',data:{userId,hasCustomerId:!!session.customer,hasSubscription:!!session.subscription},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  if (!userId) {
    logger.warn('Keine User ID in Checkout Session gefunden');
    return;
  }
  
  const customerId = session.customer;
  
  // Speichere Stripe Customer ID
  if (customerId) {
    await updateStripeCustomerId(userId, customerId);
    logger.info(`Stripe Customer ID gespeichert für User ${userId}: ${customerId}`);
  }
  
  // Subscription-Details abrufen wenn vorhanden
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await handleSubscriptionUpdate(subscription);
  }
}

/**
 * Handle: Subscription erstellt/aktualisiert
 */
async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  
  // #region agent log - Hypothesis E: getDatabase import
  fetch('http://127.0.0.1:7243/ingest/b9390f91-59df-4f45-bae6-4a81acbfe8e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'stripeService.js:170',message:'handleSubscriptionUpdate db access',data:{customerId,hasGetDatabase:typeof getDatabase},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  // Finde User über Customer ID (Knex + PostgreSQL)
  const db = getDatabase();
  const user = await db('users').where('stripe_customer_id', customerId).first();
  
  if (!user) {
    logger.warn(`Kein User gefunden für Customer ${customerId}`);
    return;
  }
  
  const status = subscription.status;
  const plan = subscription.items.data[0]?.price?.id || 'unknown';
  const periodEnd = subscription.current_period_end * 1000; // Unix timestamp -> JS timestamp
  
  // ROLE-MAPPING basierend auf Stripe Price ID und subscription status
  let role = 'free';
  if (status === 'active' || status === 'trialing') {
    // Prüfe Price ID gegen ENV-Variablen
    if (plan === process.env.STRIPE_ENTERPRISE_PRICE_ID || plan.includes('enterprise')) {
      role = 'enterprise';
    } else if (plan === process.env.STRIPE_PRO_PRICE_ID || plan.includes('pro')) {
      role = 'pro';
    }
  }
  
  // Update Subscription & Role
  await db('users')
    .where('id', user.id)
    .update({
      subscription_status: status,
      subscription_plan: plan,
      subscription_current_period_end: periodEnd,
      role: role,
      updated_at: Date.now()
    });
  
  logger.info(`Subscription & role updated for user ${user.id}: ${status}, ${role}`);
}

/**
 * Handle: Subscription gelöscht
 */
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  const db = getDatabase();
  const user = await db('users').where('stripe_customer_id', customerId).first();
  
  if (!user) {
    logger.warn(`Kein User gefunden für Customer ${customerId}`);
    return;
  }
  
  // Subscription gelöscht -> zurück zu free
  await db('users')
    .where('id', user.id)
    .update({
      subscription_status: 'canceled',
      subscription_plan: null,
      subscription_current_period_end: null,
      role: 'free',
      updated_at: Date.now()
    });
  
  logger.info(`Subscription deleted, role set to free for user ${user.id}`);
}

/**
 * Handle: Zahlung erfolgreich
 */
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  
  logger.info(`Zahlung erfolgreich für Customer ${customerId}: ${invoice.amount_paid / 100} ${invoice.currency}`);
  
  // Optional: Benachrichtigungen, Logging, etc.
}

/**
 * Handle: Zahlung fehlgeschlagen
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  logger.warn(`Zahlung fehlgeschlagen für Customer ${customerId}`);
  
  // Finde User (Knex + PostgreSQL)
  const db = getDatabase();
  const user = await db('users').where('stripe_customer_id', customerId).first();
  
  if (user) {
    // Setze Subscription-Status auf 'past_due' wenn Zahlung fehlschlägt (behalte role)
    await db('users')
      .where('id', user.id)
      .update({
        subscription_status: 'past_due',
        updated_at: Date.now()
      });
    logger.info(`Subscription-Status auf 'past_due' gesetzt für User ${user.id}`);
  }
  
  // Optional: E-Mail-Benachrichtigung an User
  // TODO: Implementiere E-Mail-Service
}

/**
 * Handle: Customer gelöscht
 */
async function handleCustomerDeleted(customer) {
  const customerId = customer.id;
  
  logger.info(`Customer gelöscht: ${customerId}`);
  
  // Finde User (Knex + PostgreSQL)
  const db = getDatabase();
  const user = await db('users').where('stripe_customer_id', customerId).first();
  
  if (user) {
    // Entferne Stripe-Daten vom User
    await db('users')
      .where('id', user.id)
      .update({
        stripe_customer_id: null,
        subscription_status: 'canceled',
        subscription_plan: null,
        subscription_current_period_end: null,
        updated_at: Date.now()
      });
    
    logger.info(`Stripe-Daten entfernt für User ${user.id} nach Customer-Löschung`);
  }
  
  // Optional: User-Account deaktivieren oder benachrichtigen
}

/**
 * Prüfe ob Stripe konfiguriert ist
 */
export function isStripeConfigured() {
  return stripe !== null;
}

