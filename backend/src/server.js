/**
 * Aura Presence Backend Server
 * Hauptserver mit Express, Socket.IO für WebRTC-Signaling,
 * Auth, Analyse und Stripe-Integration
 */

// WICHTIG: dotenv MUSS VOR allen anderen Imports geladen werden!
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env aus dem backend-Verzeichnis
const envPath = join(__dirname, '..', '.env');
console.log('🔍 Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('❌ Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
  console.log('🔑 JWT_SECRET present:', !!process.env.JWT_SECRET);
  console.log('🔑 JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
}

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initializeDatabase } from './database/dbKnex.js';
import logger from './utils/logger.js';

// Sentry Error-Tracking (MUSS vor allen anderen Importen sein!)
import { 
  initSentry,
  registerSentryErrorHandler,
  captureException
} from './utils/sentry.js';

// Middleware
import { requestLoggerMiddleware } from './middleware/requestLogger.js';

// Routes
import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';
import subscriptionRoutes from './routes/subscription.js';
import gdprRoutes from './routes/gdpr.js';
import sessionsRoutes from './routes/sessions.js';
import avatarRoutes from './routes/avatar.js';

// Socket.IO Services & Middleware
import signalingService from './services/signalingService.js';
import socketAuthMiddleware from './middleware/socketAuth.js';

// Initialisiere Sentry DIREKT nach dotenv.config() und VOR Express App
const app = express();
initSentry(app); // ← Sentry Init mit Express App

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
// WICHTIG: Sentry Request/Tracing Handler werden automatisch in initSentry() registriert

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting für alle Routen
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 Minuten
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Zu viele Anfragen von dieser IP, bitte später erneut versuchen.'
});
app.use(limiter);

// Audit Logging Middleware (logs to database)
app.use(requestLoggerMiddleware);

// Request Logging (logs to console/file)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/gdpr', gdprRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/avatar', avatarRoutes);

// WebRTC Signaling mit Socket.IO
// Auth-Middleware für Socket-Connections
io.use(socketAuthMiddleware);

// Initialisiere Signaling-Service
signalingService.initialize(io);

// Optional: Signaling-Stats-Endpoint (für Monitoring)
app.get('/api/signaling/stats', (req, res) => {
  const stats = signalingService.getStats();
  res.json(stats);
});

// TEST ROUTE für Sentry (nur für Development/Testing)
app.get('/test/sentry', (req, res) => {
  throw new Error('TEST: Sentry Error Capture funktioniert!');
});

// Sentry Error Handler MUSS nach allen Routes registriert werden
registerSentryErrorHandler(app);

// Global Error Handler (mit standardisiertem Format + Sentry Capture)
app.use((err, req, res, next) => {
  // Capture Exception in Sentry (falls aktiviert)
  captureException(err, {
    path: req.path,
    method: req.method,
    query: req.query,
    userId: req.user?.id
  });

  logger.error('Unbehandelter Fehler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Standardisiertes Error-Format: { error, message?, code? }
  const statusCode = err.statusCode || err.status || 500;
  const errorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'Ein interner Fehler ist aufgetreten' 
      : err.message || 'Interner Server-Fehler',
    message: err.userMessage || undefined, // Optional: Nutzerfreundliche Message
    code: err.code || undefined, // Optional: Error-Code (z.B. "EMAIL_EXISTS")
  };

  // Stack-Trace nur in Development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// 404 Handler (mit standardisiertem Format)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route nicht gefunden',
    message: `Die angefragte Route ${req.path} existiert nicht.`,
    code: 'NOT_FOUND'
  });
});

// Datenbank initialisieren und Server starten
async function startServer() {
  try {
    await initializeDatabase();
    logger.info('Datenbank erfolgreich initialisiert');

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server läuft auf Port ${PORT}`);
      logger.info(`📱 Frontend-URL: ${process.env.FRONTEND_URL}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔐 JWT-Auth: ${process.env.JWT_SECRET ? '✓' : '✗'}`);
      logger.info(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? '✓ (aktiv)' : '✗ (Mock-Modus)'}`);
      logger.info(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'}`);
    });
  } catch (error) {
    logger.error('Fehler beim Server-Start:', error);
    process.exit(1);
  }
}

startServer();

export { app, io };


