/**
 * Tests für evaluationService
 */

import { describe, test, expect } from '@jest/globals';
import { evaluateBehavior, THRESHOLDS } from '../src/services/evaluationService.js';

describe('evaluationService', () => {
  describe('evaluateBehavior', () => {
    test('sollte gute Metriken korrekt bewerten', () => {
      const features = {
        eye_contact_estimate: 0.8,  // Gut
        blink_rate_estimate: 20,    // Normal
        mouth_open: false,
        hand_movement_freq: 0.3,    // Normal
        posture_angle: 5,           // Gut
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('flags');
      expect(result).toHaveProperty('confidence');
      
      expect(result.metrics.eyeContact.status).toBe('good');
      expect(result.metrics.blinkRate.status).toBe('normal');
      expect(result.metrics.posture.status).toBe('good');
      
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.flags.length).toBe(0);
    });
    
    test('sollte schlechte Metriken korrekt identifizieren', () => {
      const features = {
        eye_contact_estimate: 0.2,  // Schlecht
        blink_rate_estimate: 50,    // Hoch
        mouth_open: true,
        hand_movement_freq: 1.5,    // Sehr hoch
        posture_angle: 40,          // Schlecht
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result.metrics.eyeContact.status).toBe('reduced');
      expect(result.metrics.blinkRate.status).toBe('high');
      expect(result.metrics.gestureFrequency.status).toBe('high');
      expect(result.metrics.posture.status).toBe('poor');
      
      expect(result.confidence).toBeLessThan(0.7);
      expect(result.flags.length).toBeGreaterThan(0);
    });
    
    test('sollte Flags für auffälliges Verhalten setzen', () => {
      const features = {
        eye_contact_estimate: 0.3,
        blink_rate_estimate: 25,
        mouth_open: false,
        hand_movement_freq: 0.4,
        posture_angle: 10,
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      const eyeContactFlag = result.flags.find(f => f.type === 'eye_contact');
      expect(eyeContactFlag).toBeDefined();
      expect(eyeContactFlag.severity).toBe('medium');
    });
    
    test('sollte Confidence-Score korrekt berechnen', () => {
      const features = {
        eye_contact_estimate: 0.5,  // Akzeptabel (0.7)
        blink_rate_estimate: 20,    // Normal (1.0)
        mouth_open: false,
        hand_movement_freq: 0.5,    // Elevated (0.7)
        posture_angle: 10,          // Gut (1.0)
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      // Erwarteter Durchschnitt: (0.7 + 1.0 + 0.7 + 1.0) / 4 = 0.85
      expect(result.confidence).toBeCloseTo(0.85, 1);
    });
  });
});





