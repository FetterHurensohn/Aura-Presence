/**
 * Input-Validierung mit Joi
 */

import Joi from 'joi';

/**
 * Validierungs-Middleware-Factory
 */
export function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validierungsfehler',
        message: 'Die übermittelten Daten sind ungültig. Bitte überprüfe deine Eingaben.',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    // Validierte Daten zurück an Request
    req[property] = value;
    next();
  };
}

// Schema-Definitionen

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Ungültige E-Mail-Adresse',
      'any.required': 'E-Mail ist erforderlich'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Passwort muss mindestens 8 Zeichen lang sein',
      'string.pattern.base': 'Passwort muss Groß-, Kleinbuchstaben und Zahl enthalten',
      'any.required': 'Passwort ist erforderlich'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
});

export const analysisSchema = Joi.object({
  features: Joi.object({
    eye_contact_estimate: Joi.number().min(0).max(1).required(),
    blink_rate_estimate: Joi.number().min(0).required(),
    mouth_open: Joi.boolean().required(),
    hand_movement_freq: Joi.number().min(0).required(),
    posture_angle: Joi.number().required(),
    frame_timestamp: Joi.number().required()
  }).required(),
  sessionId: Joi.string().optional(),
  metadata: Joi.object().optional()
});

