/**
 * Tests für Face Mesh & Hands Features
 */

import { evaluateBehavior } from '../src/services/evaluationService.js';

describe('Face Mesh Feature Evaluation', () => {
  
  test('sollte exzellenten Augenkontakt erkennen', () => {
    const features = {
      eye_contact_quality: 0.85,
      blink_rate: 20,
      facial_expression: 'smiling'
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.eyeContactQuality).toBeDefined();
    expect(evaluation.metrics.eyeContactQuality.status).toBe('excellent');
    expect(evaluation.metrics.eyeContactQuality.score).toBeGreaterThan(0.9);
  });
  
  test('sollte schwachen Augenkontakt erkennen und Flag setzen', () => {
    const features = {
      eye_contact_quality: 0.3,
      blink_rate: 15
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.eyeContactQuality.status).toBe('poor');
    expect(evaluation.flags).toContainEqual(
      expect.objectContaining({
        type: 'eye_contact',
        severity: 'high'
      })
    );
  });
  
  test('sollte erhöhte Blinzelrate erkennen', () => {
    const features = {
      blink_rate: 45
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.blinkRate.status).toBe('high');
    expect(evaluation.flags.some(f => f.type === 'blink_rate')).toBe(true);
  });
  
  test('sollte Gesichtsausdrücke korrekt bewerten', () => {
    const features = {
      facial_expression: 'smiling'
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.facialExpression).toBeDefined();
    expect(evaluation.metrics.facialExpression.value).toBe('smiling');
    expect(evaluation.metrics.facialExpression.score).toBe(1.0);
  });
  
  test('sollte Kopfhaltung evaluieren', () => {
    const features = {
      head_pose: { pitch: 5, yaw: 3, roll: 2 }
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.headPose).toBeDefined();
    expect(evaluation.metrics.headPose.status).toBe('good');
  });
  
  test('sollte geneigte Kopfhaltung erkennen', () => {
    const features = {
      head_pose: { pitch: 5, yaw: 3, roll: 25 }
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.headPose.status).toBe('tilted');
    expect(evaluation.flags.some(f => f.type === 'head_pose')).toBe(true);
  });
});

describe('Hands Feature Evaluation', () => {
  
  test('sollte erkannte Hände registrieren', () => {
    const features = {
      hands_detected: ['left', 'right']
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.handsDetected).toBeDefined();
    expect(evaluation.metrics.handsDetected.value).toBe(2);
  });
  
  test('sollte ruhige Handbewegungen positiv bewerten', () => {
    const features = {
      hand_movement_speed: 0.08
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.handMovementSpeed.status).toBe('calm');
    expect(evaluation.metrics.handMovementSpeed.score).toBe(1.0);
  });
  
  test('sollte sehr aktive Handbewegungen erkennen und Flag setzen', () => {
    const features = {
      hand_movement_speed: 1.2
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.handMovementSpeed.status).toBe('very_active');
    expect(evaluation.flags.some(f => f.type === 'hand_movement')).toBe(true);
  });
  
  test('sollte Handgesten erkennen', () => {
    const features = {
      left_hand_gesture: 'open',
      right_hand_gesture: 'pointing'
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics.handGestures).toBeDefined();
    expect(evaluation.metrics.handGestures.value).toHaveLength(2);
  });
});

describe('Combined Features Evaluation', () => {
  
  test('sollte alle Features kombiniert evaluieren', () => {
    const features = {
      // Face Mesh
      eye_contact_quality: 0.75,
      blink_rate: 18,
      facial_expression: 'neutral',
      head_pose: { pitch: 3, yaw: -2, roll: 1 },
      
      // Hands
      hands_detected: ['left', 'right'],
      hand_movement_speed: 0.25,
      left_hand_gesture: 'open',
      right_hand_gesture: 'open',
      
      // Pose
      posture_angle: 5,
      hand_movement_freq: 0.3
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.metrics).toBeDefined();
    expect(evaluation.confidence).toBeGreaterThan(0);
    expect(evaluation.confidence).toBeLessThanOrEqual(1);
    
    // Sollte mehrere Metriken haben
    expect(Object.keys(evaluation.metrics).length).toBeGreaterThan(5);
  });
  
  test('sollte hohe Confidence bei guten Werten liefern', () => {
    const features = {
      eye_contact_quality: 0.85,
      blink_rate: 20,
      facial_expression: 'smiling',
      head_pose: { pitch: 2, yaw: 1, roll: 0 },
      hands_detected: ['left', 'right'],
      hand_movement_speed: 0.15,
      posture_angle: 3
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.confidence).toBeGreaterThan(0.8);
    expect(evaluation.flags).toHaveLength(0);
  });
  
  test('sollte niedrige Confidence bei schlechten Werten liefern', () => {
    const features = {
      eye_contact_quality: 0.2,
      blink_rate: 50,
      head_pose: { pitch: 30, yaw: 35, roll: 20 },
      hand_movement_speed: 1.5,
      posture_angle: 35
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation.confidence).toBeLessThan(0.6);
    expect(evaluation.flags.length).toBeGreaterThan(2);
  });
});

describe('Backward Compatibility', () => {
  
  test('sollte alte Features ohne Face Mesh/Hands noch funktionieren', () => {
    const features = {
      hand_movement_freq: 0.3,
      posture_angle: 10
    };
    
    const evaluation = evaluateBehavior(features);
    
    expect(evaluation).toBeDefined();
    expect(evaluation.metrics.gestureFrequency).toBeDefined();
    expect(evaluation.metrics.posture).toBeDefined();
  });
});

