/**
 * Environment Configuration Tests
 * Validiert dass alle erforderlichen ENV-Variablen korrekt gesetzt sind
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env für Tests
dotenv.config({ path: join(__dirname, '../.env') });

describe('Environment Configuration', () => {
  describe('REQUIRED Variables', () => {
    test('JWT_SECRET muss gesetzt sein', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.JWT_SECRET).not.toBe('');
    });

    test('JWT_SECRET muss mindestens 32 Zeichen haben', () => {
      const secret = process.env.JWT_SECRET || '';
      expect(secret.length).toBeGreaterThanOrEqual(32);
    });

    test('JWT_SECRET sollte nicht der Default-Wert sein (in Production)', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(process.env.JWT_SECRET).not.toContain('your-super-secret');
        expect(process.env.JWT_SECRET).not.toContain('CHANGE-THIS');
      }
    });

    test('DATABASE_URL muss gesetzt sein', () => {
      expect(process.env.DATABASE_URL).toBeDefined();
      expect(process.env.DATABASE_URL).not.toBe('');
    });

    test('DATABASE_URL muss gültiges Format haben', () => {
      const dbUrl = process.env.DATABASE_URL || '';
      const validFormats = ['sqlite://', 'postgresql://', 'postgres://'];
      const hasValidFormat = validFormats.some(format => dbUrl.startsWith(format));
      expect(hasValidFormat).toBe(true);
    });

    test('PORT muss gültige Zahl sein', () => {
      const port = parseInt(process.env.PORT || '3001');
      expect(port).toBeGreaterThan(1000);
      expect(port).toBeLessThan(65536);
    });

    test('NODE_ENV sollte gesetzt sein', () => {
      const validEnvs = ['development', 'production', 'test'];
      const nodeEnv = process.env.NODE_ENV || 'development';
      expect(validEnvs).toContain(nodeEnv);
    });
  });

  describe('OPTIONAL Variables (mit Defaults)', () => {
    test('FRONTEND_URL hat gültiges Format wenn gesetzt', () => {
      if (process.env.FRONTEND_URL) {
        const url = process.env.FRONTEND_URL;
        expect(url).toMatch(/^https?:\/\//);
      }
    });

    test('RATE_LIMIT_WINDOW_MS ist gültige Zahl wenn gesetzt', () => {
      if (process.env.RATE_LIMIT_WINDOW_MS) {
        const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS);
        expect(windowMs).toBeGreaterThan(0);
        expect(isNaN(windowMs)).toBe(false);
      }
    });

    test('RATE_LIMIT_MAX_REQUESTS ist gültige Zahl wenn gesetzt', () => {
      if (process.env.RATE_LIMIT_MAX_REQUESTS) {
        const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);
        expect(maxRequests).toBeGreaterThan(0);
        expect(isNaN(maxRequests)).toBe(false);
      }
    });

    test('JWT_EXPIRES_IN hat gültiges Format wenn gesetzt', () => {
      if (process.env.JWT_EXPIRES_IN) {
        const expiresIn = process.env.JWT_EXPIRES_IN;
        // Gültige Formate: "60", "2 days", "10h", "7d"
        const validFormat = /^\d+(ms|s|m|h|d|w|y)?$|^\d+\s+(millisecond|second|minute|hour|day|week|year)s?$/i;
        expect(expiresIn).toMatch(validFormat);
      }
    });

    test('LOG_LEVEL ist gültiger Wert wenn gesetzt', () => {
      if (process.env.LOG_LEVEL) {
        const validLevels = ['error', 'warn', 'info', 'debug'];
        expect(validLevels).toContain(process.env.LOG_LEVEL);
      }
    });
  });

  describe('DRITTANBIETER-APIs', () => {
    test('OPENAI_API_KEY Format wenn gesetzt', () => {
      if (process.env.OPENAI_API_KEY) {
        const key = process.env.OPENAI_API_KEY;
        expect(key).toMatch(/^sk-/);
        expect(key.length).toBeGreaterThan(10);
      }
    });

    test('STRIPE_SECRET_KEY Format wenn gesetzt', () => {
      if (process.env.STRIPE_SECRET_KEY) {
        const key = process.env.STRIPE_SECRET_KEY;
        expect(key).toMatch(/^sk_(test|live)_/);
      }
    });

    test('STRIPE_WEBHOOK_SECRET Format wenn gesetzt', () => {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        expect(secret).toMatch(/^whsec_/);
      }
    });

    test('STRIPE_PRICE_ID Format wenn gesetzt', () => {
      if (process.env.STRIPE_PRICE_ID) {
        const priceId = process.env.STRIPE_PRICE_ID;
        expect(priceId).toMatch(/^price_(test_)?/);
      }
    });
  });

  describe('Production-Spezifische Checks', () => {
    if (process.env.NODE_ENV === 'production') {
      test('Production sollte PostgreSQL verwenden', () => {
        const dbUrl = process.env.DATABASE_URL || '';
        expect(dbUrl).toMatch(/^postgres(ql)?:\/\//);
      });

      test('Production sollte FRONTEND_URL mit HTTPS haben', () => {
        const frontendUrl = process.env.FRONTEND_URL || '';
        expect(frontendUrl).toMatch(/^https:\/\//);
      });

      test('Production sollte ALLOW_ANONYMOUS_SOCKETS deaktiviert haben', () => {
        expect(process.env.ALLOW_ANONYMOUS_SOCKETS).not.toBe('true');
      });

      test('Production sollte niedrigeren LOG_LEVEL haben', () => {
        const logLevel = process.env.LOG_LEVEL || 'info';
        expect(['error', 'warn']).toContain(logLevel);
      });

      test('Production benötigt alle Stripe-Credentials', () => {
        expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
        expect(process.env.STRIPE_WEBHOOK_SECRET).toBeDefined();
        expect(process.env.STRIPE_PRICE_ID).toBeDefined();
      });
    }
  });

  describe('PostgreSQL Connection Pool', () => {
    test('DB_POOL_MIN ist gültige Zahl wenn gesetzt', () => {
      if (process.env.DB_POOL_MIN) {
        const poolMin = parseInt(process.env.DB_POOL_MIN);
        expect(poolMin).toBeGreaterThanOrEqual(0);
        expect(isNaN(poolMin)).toBe(false);
      }
    });

    test('DB_POOL_MAX ist gültige Zahl wenn gesetzt', () => {
      if (process.env.DB_POOL_MAX) {
        const poolMax = parseInt(process.env.DB_POOL_MAX);
        expect(poolMax).toBeGreaterThan(0);
        expect(isNaN(poolMax)).toBe(false);
      }
    });

    test('DB_POOL_MAX sollte größer als DB_POOL_MIN sein', () => {
      if (process.env.DB_POOL_MIN && process.env.DB_POOL_MAX) {
        const poolMin = parseInt(process.env.DB_POOL_MIN);
        const poolMax = parseInt(process.env.DB_POOL_MAX);
        expect(poolMax).toBeGreaterThan(poolMin);
      }
    });
  });

  describe('Sicherheits-Checks', () => {
    test('Keine Secrets sollten Beispiel-Werte enthalten', () => {
      const jwtSecret = process.env.JWT_SECRET || '';
      expect(jwtSecret).not.toContain('example');
      expect(jwtSecret).not.toContain('test123');
    });

    test('JWT_SECRET sollte ausreichend komplex sein', () => {
      const secret = process.env.JWT_SECRET || '';
      // Mindestens ein paar unterschiedliche Zeichen (nicht nur "aaaaaaa...")
      const uniqueChars = new Set(secret.split('')).size;
      expect(uniqueChars).toBeGreaterThan(10);
    });
  });
});

