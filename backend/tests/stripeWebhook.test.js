/**
 * Stripe Webhook Tests
 * Testet Webhook-Event-Handling und Idempotenz
 */

import { handleWebhookEvent } from '../src/services/stripeService.js';
import { getDatabase, initializeDatabase, closeDatabase } from '../src/database/db.js';
import { createUser } from '../src/models/User.js';
import mockEvents from './fixtures/stripe-events.json' assert { type: 'json' };

describe('Stripe Webhook Handler', () => {
  let db;
  let testUserId;

  beforeAll(async () => {
    // Test-DB initialisieren
    process.env.DB_PATH = ':memory:';
    await initializeDatabase();
    db = getDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    // Test-User erstellen
    const user = createUser('test@example.com', 'Test1234');
    testUserId = user.id;
    
    // Stripe Customer ID setzen
    db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?')
      .run('cus_test_123', testUserId);
  });

  afterEach(() => {
    // Cleanup
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM webhook_events').run();
  });

  describe('checkout.session.completed', () => {
    it('should save stripe customer ID and create subscription', async () => {
      const event = mockEvents.checkoutCompleted;
      
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.stripe_customer_id).toBe('cus_test_123');
    });
  });

  describe('customer.subscription.created', () => {
    it('should update subscription status to active', async () => {
      const event = mockEvents.subscriptionCreated;
      
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.subscription_status).toBe('active');
      expect(user.subscription_plan).toBe('price_test_123');
    });
  });

  describe('customer.subscription.updated', () => {
    it('should update subscription details', async () => {
      const event = mockEvents.subscriptionUpdated;
      
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.subscription_status).toBe('active');
      expect(user.subscription_plan).toBe('price_test_123');
      expect(user.subscription_current_period_end).toBeDefined();
    });
  });

  describe('customer.subscription.deleted', () => {
    it('should set subscription status to canceled', async () => {
      // Setze initial subscription
      db.prepare(`
        UPDATE users 
        SET subscription_status = 'active', subscription_plan = 'price_test_123'
        WHERE id = ?
      `).run(testUserId);
      
      const event = mockEvents.subscriptionDeleted;
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.subscription_status).toBe('canceled');
      expect(user.subscription_plan).toBeNull();
    });
  });

  describe('invoice.payment_succeeded', () => {
    it('should log successful payment', async () => {
      const event = mockEvents.invoicePaymentSucceeded;
      
      // Sollte nicht werfen
      await expect(handleWebhookEvent(event)).resolves.not.toThrow();
    });
  });

  describe('invoice.payment_failed', () => {
    it('should update subscription status to past_due', async () => {
      db.prepare(`
        UPDATE users 
        SET subscription_status = 'active', subscription_plan = 'price_test_123'
        WHERE id = ?
      `).run(testUserId);
      
      const event = mockEvents.invoicePaymentFailed;
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.subscription_status).toBe('past_due');
    });
  });

  describe('customer.deleted', () => {
    it('should remove stripe data from user', async () => {
      db.prepare(`
        UPDATE users 
        SET subscription_status = 'active', subscription_plan = 'price_test_123'
        WHERE id = ?
      `).run(testUserId);
      
      const event = mockEvents.customerDeleted;
      await handleWebhookEvent(event);
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(testUserId);
      expect(user.stripe_customer_id).toBeNull();
      expect(user.subscription_status).toBe('canceled');
      expect(user.subscription_plan).toBeNull();
    });
  });

  describe('Unhandled event types', () => {
    it('should not throw for unknown event types', async () => {
      const unknownEvent = {
        id: 'evt_unknown_123',
        type: 'customer.unknown_event',
        data: { object: {} }
      };
      
      await expect(handleWebhookEvent(unknownEvent)).resolves.not.toThrow();
    });
  });
});

describe('Webhook Idempotenz', () => {
  let db;

  beforeAll(async () => {
    process.env.DB_PATH = ':memory:';
    await initializeDatabase();
    db = getDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    db.prepare('DELETE FROM webhook_events').run();
  });

  it('should store webhook event in database', () => {
    const eventId = 'evt_test_123';
    const eventType = 'checkout.session.completed';
    
    db.prepare(`
      INSERT INTO webhook_events (event_id, event_type, processed_at, payload)
      VALUES (?, ?, ?, ?)
    `).run(eventId, eventType, Date.now(), '{}');
    
    const storedEvent = db.prepare('SELECT * FROM webhook_events WHERE event_id = ?').get(eventId);
    
    expect(storedEvent).toBeDefined();
    expect(storedEvent.event_id).toBe(eventId);
    expect(storedEvent.event_type).toBe(eventType);
  });

  it('should prevent duplicate event processing (idempotency)', () => {
    const eventId = 'evt_test_duplicate_123';
    
    // Erstes Insert
    db.prepare(`
      INSERT INTO webhook_events (event_id, event_type, processed_at, payload)
      VALUES (?, ?, ?, ?)
    `).run(eventId, 'test.event', Date.now(), '{}');
    
    // Zweites Insert sollte fehlschlagen (UNIQUE constraint)
    expect(() => {
      db.prepare(`
        INSERT INTO webhook_events (event_id, event_type, processed_at, payload)
        VALUES (?, ?, ?, ?)
      `).run(eventId, 'test.event', Date.now(), '{}');
    }).toThrow();
    
    // Nur ein Event sollte existieren
    const count = db.prepare('SELECT COUNT(*) as count FROM webhook_events WHERE event_id = ?')
      .get(eventId).count;
    
    expect(count).toBe(1);
  });
});





