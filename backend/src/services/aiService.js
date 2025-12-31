/**
 * AI Service - OpenAI Integration für interpretative Texte
 * 
 * WICHTIG: Dieser Service erhält NIEMALS Rohbilder oder Videos!
 * Nur strukturierte, numerische Metriken werden verarbeitet.
 */

import OpenAI from 'openai';
import logger from '../utils/logger.js';
import { validateAIResponse } from '../schemas/aiResponseSchema.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK = !OPENAI_API_KEY || process.env.NODE_ENV === 'test';

let openai = null;

if (!USE_MOCK) {
  try {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    logger.info('OpenAI Client initialisiert (echte API)');
  } catch (error) {
    logger.error('Fehler beim Initialisieren des OpenAI Clients:', error);
    logger.warn('Fallback auf Mock-Modus');
  }
}

/**
 * Generiere KI-gestützte Interpretation der Verhaltensmetriken
 * 
 * @param {Object} context - Strukturierter Context mit Metriken und Flags
 * @returns {Object} Interpretierte Antwort
 */
export async function generateInterpretation(context) {
  if (USE_MOCK || !openai) {
    return generateMockInterpretation(context);
  }
  
  try {
    const prompt = buildPrompt(context);
    
    logger.debug('Sende Anfrage an OpenAI', {
      contextSize: JSON.stringify(context).length
    });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Kostengünstiges Modell
      messages: [
        {
          role: 'system',
          content: `Du bist ein einfühlsamer Kommunikationscoach. Du erhältst strukturierte Verhaltensmetriken 
                    aus einer Video-Analyse und gibst konstruktives, motivierendes Feedback.
                    
                    WICHTIG: Du erhältst KEINE Bilder oder Videos, nur numerische Metriken.
                    Sei präzise, freundlich und ermutigend. Fokussiere auf konkrete Verbesserungsvorschläge.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });
    
    try {
      const interpretation = parseAIResponse(completion.choices[0].message.content);
      
      logger.info('OpenAI Interpretation generiert', {
        tokensUsed: completion.usage.total_tokens
      });
      
      return interpretation;
    } catch (validationError) {
      // Validation-Error: Fallback auf Mock
      logger.warn('OpenAI response validation failed, falling back to mock');
      return generateMockInterpretation(context);
    }
    
  } catch (error) {
    logger.error('OpenAI API Fehler:', error);
    
    // Rate-Limit-Handling (429)
    if (error.status === 429) {
      logger.warn('OpenAI Rate Limit erreicht, Retry mit Exponential Backoff empfohlen');
      // TODO: Implementiere Exponential Backoff Retry-Logic
    }
    
    // Fallback auf Mock bei API-Fehler
    logger.warn('Fallback auf Mock-Interpretation');
    return generateMockInterpretation(context);
  }
}

/**
 * Baue Prompt für OpenAI auf Basis der Metriken
 */
function buildPrompt(context) {
  const { metrics, flags, confidence } = context;
  
  let prompt = `Analysiere folgende Verhaltensmetriken aus einer Video-Präsenzanalyse und gib konstruktives Feedback:\n\n`;
  
  // Face Mesh Metriken
  if (metrics.eyeContactQuality) {
    prompt += `👁️ Augenkontakt: ${metrics.eyeContactQuality.description} (${(metrics.eyeContactQuality.value * 100).toFixed(0)}%)\n`;
  }
  if (metrics.blinkRate) {
    prompt += `👀 Blinzelrate: ${metrics.blinkRate.description} (${metrics.blinkRate.value}/min)\n`;
  }
  if (metrics.facialExpression) {
    prompt += `😊 Gesichtsausdruck: ${metrics.facialExpression.description}\n`;
  }
  if (metrics.headPose) {
    const hp = metrics.headPose.value;
    prompt += `🧑 Kopfhaltung: ${metrics.headPose.description} (Pitch: ${hp.pitch}°, Yaw: ${hp.yaw}°, Roll: ${hp.roll}°)\n`;
  }
  
  // Hands Metriken
  if (metrics.handsDetected) {
    prompt += `👋 Hände erkannt: ${metrics.handsDetected.description}\n`;
  }
  if (metrics.handMovementSpeed) {
    prompt += `✋ Handbewegung: ${metrics.handMovementSpeed.description} (${metrics.handMovementSpeed.value.toFixed(2)})\n`;
  }
  if (metrics.handGestures) {
    prompt += `🤲 Gesten: ${metrics.handGestures.description}\n`;
  }
  
  // Pose Metriken
  if (metrics.posture) {
    prompt += `🧍 Körperhaltung: ${metrics.posture.description} (${metrics.posture.value}°)\n`;
  }
  if (metrics.gestureFrequency) {
    prompt += `🤲 Gestikfrequenz: ${metrics.gestureFrequency.description}\n`;
  }
  
  prompt += `\n📊 Gesamtbewertung: ${(confidence * 100).toFixed(0)}%\n`;
  
  // Flags hinzufügen
  if (flags.length > 0) {
    prompt += `\n⚠️ Auffälligkeiten:\n`;
    flags.forEach(flag => {
      prompt += `- ${flag.message}\n`;
    });
  }
  
  prompt += `\nGib eine kurze, motivierende Rückmeldung in 3-4 Sätzen auf Deutsch. 
             Beginne mit positiven Aspekten, erwähne dann Verbesserungspotenzial, 
             und schließe mit einer konkreten, umsetzbaren Empfehlung ab.`;
  
  return prompt;
}

/**
 * Parse und strukturiere OpenAI-Antwort mit Validation
 */
function parseAIResponse(content) {
  const response = {
    feedback: content.trim(),
    tone: 'constructive',
    source: 'openai'
  };
  
  try {
    // Validiere Response gegen Schema
    const validatedResponse = validateAIResponse(response);
    return validatedResponse;
  } catch (validationError) {
    logger.error('AI Response Validation Failed:', validationError);
    
    // Bei Validation-Error: Fallback auf Mock
    logger.warn('Falling back to mock interpretation due to validation error');
    throw validationError; // Wird von generateInterpretation gefangen
  }
}

/**
 * Mock-Interpretation für Entwicklung/Tests oder wenn OpenAI nicht verfügbar
 */
function generateMockInterpretation(context) {
  const { metrics, flags, confidence } = context;
  
  let feedback = '';
  
  // Positive Aspekte sammeln
  const positiveAspects = [];
  
  // Face Mesh positives
  if (metrics.eyeContactQuality?.score >= 0.8) positiveAspects.push('exzellenter Augenkontakt');
  else if (metrics.eyeContactQuality?.score >= 0.6) positiveAspects.push('guter Augenkontakt');
  
  if (metrics.facialExpression?.value === 'smiling') positiveAspects.push('freundliches Lächeln');
  if (metrics.headPose?.score >= 0.9) positiveAspects.push('aufrechte Kopfhaltung');
  
  // Hands positives
  if (metrics.handMovementSpeed?.status === 'calm' || metrics.handMovementSpeed?.status === 'moderate') {
    positiveAspects.push('ausgeglichene Gestik');
  }
  
  // Pose positives
  if (metrics.posture?.score >= 0.7) positiveAspects.push('aufrechte Körperhaltung');
  
  // Positives Feedback
  if (positiveAspects.length > 0) {
    feedback += `Sehr gut! Dein${positiveAspects.length > 1 ? 'e' : ''} ${positiveAspects.slice(0, 2).join(' und ')} ${positiveAspects.length > 1 ? 'wirken' : 'wirkt'} professionell und überzeugend. `;
  } else {
    feedback += `Danke für deine Teilnahme an der Analyse. `;
  }
  
  // Verbesserungspotenzial basierend auf Flags
  if (flags.length > 0) {
    const mainIssue = flags[0];
    
    switch (mainIssue.type) {
      case 'eye_contact':
        feedback += `Versuche, noch häufiger direkt in die Kamera zu schauen - das stärkt deine Präsenz und Verbindung zum Publikum. `;
        break;
      case 'blink_rate':
        feedback += `Deine Blinzelfrequenz ist etwas erhöht. Mach kurze Pausen und atme tief durch - das hilft gegen Bildschirmermüdung. `;
        break;
      case 'hand_movement':
        feedback += `Deine Handbewegungen sind sehr lebhaft. Bewusste, ruhigere Gesten können deine Ausstrahlung verstärken. `;
        break;
      case 'head_pose':
        feedback += `Achte auf eine zentralere Kopfposition zur Kamera - das wirkt aufmerksamer und präsenter. `;
        break;
      case 'posture':
        feedback += `Eine aufrechtere Sitzhaltung wirkt selbstbewusster und professioneller. `;
        break;
      case 'expression':
        feedback += `Ein entspannterer Gesichtsausdruck kann freundlicher und zugänglicher wirken. `;
        break;
      default:
        feedback += `Achte auf die Details in deiner Präsenz - kleine Änderungen können große Wirkung haben. `;
    }
  } else {
    feedback += `Deine Präsenz ist insgesamt stark und überzeugend - alle Metriken sind im optimalen Bereich. `;
  }
  
  // Konkrete Empfehlung basierend auf Confidence
  if (confidence < 0.5) {
    feedback += `Tipp: Übe regelmäßig vor der Kamera, um dein Bewusstsein für Mimik, Gestik und Körpersprache zu schärfen.`;
  } else if (confidence < 0.7) {
    feedback += `Tipp: Konzentriere dich auf einen Aspekt nach dem anderen - ${flags[0]?.type === 'eye_contact' ? 'starte mit bewusstem Blickkontakt' : 'beginne mit deiner Körperhaltung'}.`;
  } else if (confidence < 0.85) {
    feedback += `Tipp: Du bist auf einem sehr guten Weg. Feinabstimmung bei ${flags.length > 0 ? flags[0].type.replace('_', ' ') : 'Details'} bringt dich zur Perfektion.`;
  } else {
    feedback += `Ausgezeichnet! Deine Präsenz ist professionell und authentisch - weiter so!`;
  }
  
  return {
    feedback: feedback.trim(),
    tone: 'constructive',
    source: 'mock',
    mockData: {
      confidence,
      flagCount: flags.length,
      metricsAnalyzed: Object.keys(metrics).length
    }
  };
}

/**
 * Hilfsfunktion: Prüfe ob OpenAI verfügbar ist
 */
export function isOpenAIAvailable() {
  return !USE_MOCK && openai !== null;
}





