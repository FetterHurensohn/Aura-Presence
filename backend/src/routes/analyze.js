/**
 * Analysis Routes - Verhaltensanalyse
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { checkAnalysisLimit } from '../middleware/usageLimits.js';
import { validate, analysisSchema } from '../middleware/validation.js';
import { evaluateBehavior } from '../services/evaluationService.js';
import { generateInterpretation } from '../services/aiService.js';
import { createSession, updateSession } from '../models/AnalysisSession.js';
import { logUserActivity, logError } from '../utils/auditLogger.js';
import logger from '../utils/logger.js';
import { sendSuccess, sendError, asyncHandler } from '../utils/responseHelpers.js';
import { ERROR_CODES } from '../schemas/apiSchemas.js';

const router = express.Router();

// Rate Limiting speziell für Analyse-Route (höhere Frequenz erlaubt)
import rateLimit from 'express-rate-limit';
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 60, // 60 Anfragen pro Minute (1 pro Sekunde)
  message: 'Zu viele Analyse-Anfragen, bitte langsamer.'
});

/**
 * POST /api/analyze
 * Analysiere extrahierte Merkmale und gebe KI-gestütztes Feedback
 * 
 * WICHTIG: Es werden KEINE Rohbilder oder Videos an externe APIs gesendet!
 * Nur strukturierte, numerische Merkmale werden verarbeitet.
 */
router.post('/', 
  authenticateToken, 
  checkAnalysisLimit(), // Check usage limits for free users
  analyzeLimiter,
  validate(analysisSchema),
  asyncHandler(async (req, res) => {
    const { features, sessionId, metadata } = req.body;
    const userId = req.user.id;
    
    logger.debug(`Analyse-Anfrage von User ${userId}:`, {
      sessionId,
      timestamp: features.frame_timestamp
    });
    
    // Session-Tracking: Erstelle oder update Session
    let dbSessionId = metadata?.dbSessionId;
    if (!dbSessionId) {
      const session = await createSession(userId, { clientSessionId: sessionId });
      dbSessionId = session.id;
      
      // Log user activity (analysis started)
      await logUserActivity(userId, 'analysis_start', { sessionId: dbSessionId }, req);
    }
    
    // Schritt 1: Regelbasierte Evaluation
    const evaluation = evaluateBehavior(features);
    
    // Schritt 2: KI-Context aufbauen (NUR strukturierte Daten)
    const aiContext = {
      metrics: {
        eyeContact: evaluation.metrics.eyeContact,
        blinkRate: evaluation.metrics.blinkRate,
        gestureFrequency: evaluation.metrics.gestureFrequency,
        posture: evaluation.metrics.posture
      },
      flags: evaluation.flags,
      confidence: evaluation.confidence,
      timestamp: features.frame_timestamp
    };
    
    // Schritt 3: KI-Interpretation generieren
    // (OpenAI API wird NIEMALS Rohdaten erhalten, nur diese strukturierten Metriken)
    const interpretation = await generateInterpretation(aiContext);
    
    // Schritt 4: Content-Filter anwenden (Sicherheit)
    const filteredInterpretation = applyContentFilter(interpretation);
    
    // Schritt 5: Session updaten mit Frame-Daten
    await updateSession(dbSessionId, {
      confidence: evaluation.confidence
    });
    
    logger.info(`Analyse abgeschlossen für User ${userId}, Confidence: ${evaluation.confidence}`);
    
    // Response zusammenstellen
    return sendSuccess(res, {
      success: true,
      timestamp: Date.now(),
      sessionId,
      dbSessionId, // Für Frontend-Tracking
      evaluation: {
        metrics: evaluation.metrics,
        flags: evaluation.flags,
        confidence: evaluation.confidence
      },
      interpretation: filteredInterpretation,
      metadata: {
        processingTime: Date.now() - features.frame_timestamp,
        userId
      }
    });
  })
);

/**
 * Content-Filter: Entfernt unzulässige/schädliche Inhalte aus KI-Antworten
 */
function applyContentFilter(interpretation) {
  const blacklist = [
    'selbstmord',
    'töten',
    'gewalt',
    'illegal',
    // Weitere Keywords hinzufügen
  ];
  
  let filtered = { ...interpretation };
  
  // Text-Filter auf alle String-Felder anwenden
  Object.keys(filtered).forEach(key => {
    if (typeof filtered[key] === 'string') {
      const lowerText = filtered[key].toLowerCase();
      
      for (const word of blacklist) {
        if (lowerText.includes(word)) {
          logger.warn(`Content-Filter ausgelöst: "${word}" gefunden in ${key}`);
          filtered[key] = '[Inhalt gefiltert - Verstoß gegen Richtlinien]';
          break;
        }
      }
    }
  });
  
  return filtered;
}

export default router;

