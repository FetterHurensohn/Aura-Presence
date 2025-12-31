/**
 * AI Response Schema - Joi Validation
 * Validiert OpenAI-Responses gegen definiertes Schema
 */

import Joi from 'joi';

/**
 * Schema für AI-Response-Objekte
 */
export const aiResponseSchema = Joi.object({
  feedback: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.base': 'Feedback muss ein String sein',
      'string.min': 'Feedback muss mindestens 10 Zeichen lang sein',
      'string.max': 'Feedback darf maximal 1000 Zeichen lang sein',
      'any.required': 'Feedback ist erforderlich'
    }),
  
  tone: Joi.string()
    .valid('constructive', 'neutral', 'encouraging', 'critical')
    .default('constructive')
    .messages({
      'any.only': 'Tone muss einer von: constructive, neutral, encouraging, critical sein'
    }),
  
  source: Joi.string()
    .valid('openai', 'mock')
    .required()
    .messages({
      'any.only': 'Source muss entweder "openai" oder "mock" sein',
      'any.required': 'Source ist erforderlich'
    }),
  
  // Optional: Mock-spezifische Daten
  mockData: Joi.object().optional()
}).unknown(false); // Keine unbekannten Felder erlauben

/**
 * Validiere AI-Response
 * @throws {Error} Bei Validierungsfehler
 */
export function validateAIResponse(response) {
  const { error, value } = aiResponseSchema.validate(response, {
    abortEarly: false, // Alle Fehler sammeln
    stripUnknown: true // Unbekannte Felder entfernen
  });
  
  if (error) {
    const errorMessages = error.details.map(d => d.message).join(', ');
    throw new Error(`AI Response Validation Error: ${errorMessages}`);
  }
  
  return value;
}

/**
 * Prüfe ob Response valid ist (ohne Exception)
 */
export function isValidAIResponse(response) {
  const { error } = aiResponseSchema.validate(response);
  return !error;
}

