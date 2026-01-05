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

/**
 * POST /api/analyze/save
 * Speichere komplette Analyse-Session mit aggregierten Daten
 * 
 * Wird am Ende einer Live-Session aufgerufen
 */
router.post('/save',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { summary, rawData } = req.body;
    const userId = req.user.id;

    if (!summary) {
      return sendError(res, 400, ERROR_CODES.VALIDATION_ERROR, 'Summary ist erforderlich');
    }

    logger.info(`Speichere Analyse-Session für User ${userId}`);

    try {
      // Session in DB erstellen/updaten
      const session = await createSession(userId, {
        duration: summary.stats?.duration || 0,
        totalFrames: summary.stats?.totalFrames || 0,
        averageConfidence: summary.scores?.overall / 100 || 0,
        metadata: JSON.stringify({
          scores: summary.scores,
          stats: summary.stats,
          insights: summary.insights
        })
      });

      // Optional: Generiere detailliertes AI-Feedback mit OpenAI
      let aiFeedback = null;
      if (process.env.OPENAI_API_KEY) {
        try {
          const aiContext = {
            metrics: {
              eyeContact: summary.scores.eyeContact / 100,
              facialExpression: summary.scores.facialExpression / 100,
              gestures: summary.scores.gestures / 100,
              posture: summary.scores.posture / 100
            },
            stats: summary.stats,
            insights: summary.insights,
            duration: summary.stats.duration
          };

          aiFeedback = await generateInterpretation(aiContext);
          
          // Speichere AI-Feedback in Session
          await updateSession(session.id, {
            metadata: JSON.stringify({
              ...JSON.parse(session.metadata || '{}'),
              aiFeedback
            })
          });
        } catch (aiError) {
          logger.error('Fehler bei AI-Feedback-Generierung:', aiError);
          // Fortfahren ohne AI-Feedback
        }
      }

      // Log activity
      await logUserActivity(userId, 'analysis_completed', { 
        sessionId: session.id,
        duration: summary.stats?.duration,
        overallScore: summary.scores?.overall
      }, req);

      logger.info(`Analyse-Session ${session.id} erfolgreich gespeichert`);

      return sendSuccess(res, {
        sessionId: session.id,
        summary,
        aiFeedback,
        message: 'Analyse erfolgreich gespeichert'
      });

    } catch (error) {
      logger.error('Fehler beim Speichern der Analyse-Session:', error);
      await logError(userId, 'analysis_save_error', error, req);
      
      return sendError(res, 500, ERROR_CODES.INTERNAL_ERROR, 
        'Fehler beim Speichern der Analyse-Session');
    }
  })
);

export default router;

