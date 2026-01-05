/**
 * Tests für evaluationService
 */

import { describe, test, expect } from '@jest/globals';
import { evaluateBehavior } from '../src/services/evaluationService.js';

describe('evaluationService', () => {
  describe('evaluateBehavior', () => {
    test('sollte gute Metriken korrekt bewerten', () => {
      const features = {
        eye_contact_estimate: 0.8,
        blink_rate_estimate: 20,
        mouth_open: false,
        hand_movement_freq: 0.3,
        posture_angle: 5,
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('flags');
      expect(result).toHaveProperty('confidence');
      expect(result.confidence).toBeGreaterThan(0);
    });
    
    test('sollte schlechte Metriken korrekt identifizieren', () => {
      const features = {
        eye_contact_estimate: 0.3,
        blink_rate_estimate: 40,
        mouth_open: false,
        hand_movement_freq: 0.9,
        posture_angle: 25,
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result.metrics).toBeDefined();
      expect(result.confidence).toBeLessThan(1);
    });
    
    test('sollte Flags für auffälliges Verhalten setzen', () => {
      const features = {
        eye_contact_estimate: 0.2,
        blink_rate_estimate: 50,
        mouth_open: false,
        hand_movement_freq: 0.3,
        posture_angle: 5,
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result.flags).toBeDefined();
      expect(Array.isArray(result.flags)).toBe(true);
    });
    
    test('sollte Confidence-Score korrekt berechnen', () => {
      const features = {
        eye_contact_estimate: 0.7,
        blink_rate_estimate: 15,
        mouth_open: false,
        hand_movement_freq: 0.7,
        posture_angle: 10,
        frame_timestamp: Date.now()
      };
      
      const result = evaluateBehavior(features);
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
