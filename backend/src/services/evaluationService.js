/**
 * Evaluation Service - Regelbasierte Verhaltensanalyse
 * 
 * Dieser Service analysiert die von MediaPipe extrahierten Merkmale
 * und erstellt eine strukturierte Bewertung ohne externe KI.
 */

import logger from '../utils/logger.js';

/**
 * Schwellenwerte für verschiedene Metriken (konfigurierbar)
 */
const THRESHOLDS = {
  // Face Mesh Metriken
  EYE_CONTACT_QUALITY: {
    EXCELLENT: 0.8,   // > 80% als exzellent
    GOOD: 0.6,        // 60-80% als gut
    ACCEPTABLE: 0.4   // 40-60% als akzeptabel
  },
  BLINK_RATE: {
    NORMAL_MIN: 10,   // Blinks pro Minute
    NORMAL_MAX: 30,
    HIGH: 40,
    VERY_HIGH: 50
  },
  HEAD_POSE: {
    PITCH_GOOD: 15,   // Grad
    YAW_GOOD: 20,
    ROLL_GOOD: 10
  },
  
  // Hands Metriken
  HAND_MOVEMENT_SPEED: {
    CALM: 0.1,
    MODERATE: 0.3,
    ACTIVE: 0.6,
    VERY_ACTIVE: 1.0
  },
  
  // Pose Metriken (Legacy)
  GESTURE_FREQUENCY: {
    LOW: 0.2,
    MODERATE: 0.5,
    HIGH: 1.0
  },
  POSTURE_ANGLE: {
    GOOD_MIN: -15,    // Grad
    GOOD_MAX: 15,
    WARNING: 30
  }
};

/**
 * Hauptfunktion: Bewerte extrahierte Verhaltensmerkmale
 * 
 * @param {Object} features - Extrahierte Merkmale vom Frontend
 * @returns {Object} Strukturierte Evaluation mit Metriken und Flags
 */
export function evaluateBehavior(features) {
  // Extrahiere alle verfügbaren Features
  const {
    // Face Mesh Features
    eye_contact_quality,
    blink_rate,
    facial_expression,
    head_pose,
    
    // Hands Features
    hands_detected,
    left_hand_gesture,
    right_hand_gesture,
    hand_movement_speed,
    
    // Pose Features (Legacy)
    hand_movement_freq,
    posture_angle,
    
    frame_timestamp
  } = features;
  
  const metrics = {};
  const flags = [];
  const evaluations = [];
  
  // === Face Mesh Evaluations ===
  if (eye_contact_quality !== undefined) {
    const eyeContactEval = evaluateEyeContactQuality(eye_contact_quality);
    metrics.eyeContactQuality = eyeContactEval;
    evaluations.push(eyeContactEval);
    
    if (eyeContactEval.status === 'poor') {
      flags.push({
        type: 'eye_contact',
        severity: 'high',
        message: 'Schwacher Augenkontakt - versuche direkt in die Kamera zu schauen'
      });
    } else if (eyeContactEval.status === 'acceptable') {
      flags.push({
        type: 'eye_contact',
        severity: 'low',
        message: 'Augenkontakt könnte verbessert werden'
      });
    }
  }
  
  if (blink_rate !== undefined) {
    const blinkRateEval = evaluateBlinkRate(blink_rate);
    metrics.blinkRate = blinkRateEval;
    evaluations.push(blinkRateEval);
    
    if (blinkRateEval.status === 'high' || blinkRateEval.status === 'very_high') {
      flags.push({
        type: 'blink_rate',
        severity: 'medium',
        message: 'Erhöhte Blinzelfrequenz - möglicherweise Stress oder Bildschirmermüdung'
      });
    }
  }
  
  if (facial_expression) {
    const expressionEval = evaluateFacialExpression(facial_expression);
    metrics.facialExpression = expressionEval;
    
    if (facial_expression === 'frowning') {
      flags.push({
        type: 'expression',
        severity: 'low',
        message: 'Stirnrunzeln erkannt - wirkt möglicherweise angespannt'
      });
    }
  }
  
  if (head_pose) {
    const headPoseEval = evaluateHeadPose(head_pose);
    metrics.headPose = headPoseEval;
    evaluations.push(headPoseEval);
    
    if (headPoseEval.status === 'tilted') {
      flags.push({
        type: 'head_pose',
        severity: 'low',
        message: 'Kopfneigung erkannt - aufrechte Position wirkt professioneller'
      });
    }
  }
  
  // === Hands Evaluations ===
  if (hands_detected) {
    metrics.handsDetected = {
      value: hands_detected.length,
      description: `${hands_detected.length} Hand${hands_detected.length !== 1 ? 'e' : ''} erkannt`,
      status: 'info'
    };
  }
  
  if (hand_movement_speed !== undefined) {
    const handMovementEval = evaluateHandMovementSpeed(hand_movement_speed);
    metrics.handMovementSpeed = handMovementEval;
    evaluations.push(handMovementEval);
    
    if (handMovementEval.status === 'very_active') {
      flags.push({
        type: 'hand_movement',
        severity: 'medium',
        message: 'Sehr aktive Handbewegungen - könnte als nervös wahrgenommen werden'
      });
    }
  }
  
  if (left_hand_gesture || right_hand_gesture) {
    const gesturesEval = evaluateHandGestures(left_hand_gesture, right_hand_gesture);
    metrics.handGestures = gesturesEval;
  }
  
  // === Pose Evaluations (Legacy) ===
  if (hand_movement_freq !== undefined) {
    const gestureEval = evaluateGestures(hand_movement_freq);
    metrics.gestureFrequency = gestureEval;
    evaluations.push(gestureEval);
  }
  
  if (posture_angle !== undefined) {
    const postureEval = evaluatePosture(posture_angle);
    metrics.posture = postureEval;
    evaluations.push(postureEval);
    
    if (postureEval.status === 'poor') {
      flags.push({
        type: 'posture',
        severity: 'high',
        message: 'Schlechte Körperhaltung - aufrechter sitzen wirkt selbstbewusster'
      });
    }
  }
  
  // Gesamtbewertung: Confidence-Score (0-1)
  const confidence = calculateOverallConfidence(evaluations);
  
  const evaluation = {
    timestamp: Date.now(),
    metrics,
    flags,
    confidence,
    rawFeatures: features // Für Debugging
  };
  
  logger.debug('Erweiterte Evaluation abgeschlossen:', {
    confidence,
    flagCount: flags.length,
    metricsCount: Object.keys(metrics).length
  });
  
  return evaluation;
}

/**
 * Bewerte Augenkontakt-Qualität (Face Mesh)
 */
function evaluateEyeContactQuality(quality) {
  if (quality >= THRESHOLDS.EYE_CONTACT_QUALITY.EXCELLENT) {
    return {
      value: quality,
      status: 'excellent',
      score: 1.0,
      description: 'Exzellenter Augenkontakt'
    };
  } else if (quality >= THRESHOLDS.EYE_CONTACT_QUALITY.GOOD) {
    return {
      value: quality,
      status: 'good',
      score: 0.8,
      description: 'Guter Augenkontakt'
    };
  } else if (quality >= THRESHOLDS.EYE_CONTACT_QUALITY.ACCEPTABLE) {
    return {
      value: quality,
      status: 'acceptable',
      score: 0.6,
      description: 'Akzeptabler Augenkontakt'
    };
  } else {
    return {
      value: quality,
      status: 'poor',
      score: 0.3,
      description: 'Schwacher Augenkontakt'
    };
  }
}

/**
 * Bewerte Blinzelrate
 */
function evaluateBlinkRate(rate) {
  if (rate >= THRESHOLDS.BLINK_RATE.NORMAL_MIN && 
      rate <= THRESHOLDS.BLINK_RATE.NORMAL_MAX) {
    return {
      value: rate,
      status: 'normal',
      score: 1.0,
      description: 'Normale Blinzelrate'
    };
  } else if (rate > THRESHOLDS.BLINK_RATE.VERY_HIGH) {
    return {
      value: rate,
      status: 'very_high',
      score: 0.4,
      description: 'Sehr hohe Blinzelrate'
    };
  } else if (rate > THRESHOLDS.BLINK_RATE.HIGH) {
    return {
      value: rate,
      status: 'high',
      score: 0.6,
      description: 'Erhöhte Blinzelrate'
    };
  } else {
    return {
      value: rate,
      status: 'low',
      score: 0.8,
      description: 'Niedrige Blinzelrate'
    };
  }
}

/**
 * Bewerte Gesichtsausdruck
 */
function evaluateFacialExpression(expression) {
  const expressionScores = {
    'smiling': { score: 1.0, description: 'Freundliches Lächeln' },
    'neutral': { score: 0.9, description: 'Neutraler Ausdruck' },
    'speaking': { score: 0.95, description: 'Spricht aktiv' },
    'frowning': { score: 0.5, description: 'Stirnrunzeln' }
  };
  
  const eval = expressionScores[expression] || expressionScores['neutral'];
  
  return {
    value: expression,
    status: expression,
    score: eval.score,
    description: eval.description
  };
}

/**
 * Bewerte Kopfhaltung
 */
function evaluateHeadPose(headPose) {
  const { pitch, yaw, roll } = headPose;
  
  const pitchGood = Math.abs(pitch) <= THRESHOLDS.HEAD_POSE.PITCH_GOOD;
  const yawGood = Math.abs(yaw) <= THRESHOLDS.HEAD_POSE.YAW_GOOD;
  const rollGood = Math.abs(roll) <= THRESHOLDS.HEAD_POSE.ROLL_GOOD;
  
  if (pitchGood && yawGood && rollGood) {
    return {
      value: headPose,
      status: 'good',
      score: 1.0,
      description: 'Kopfhaltung frontal und aufrecht'
    };
  } else if (!rollGood) {
    return {
      value: headPose,
      status: 'tilted',
      score: 0.6,
      description: 'Kopf ist geneigt'
    };
  } else if (!yawGood) {
    return {
      value: headPose,
      status: 'turned',
      score: 0.7,
      description: 'Kopf ist zur Seite gedreht'
    };
  } else {
    return {
      value: headPose,
      status: 'acceptable',
      score: 0.8,
      description: 'Leicht geneigte Kopfhaltung'
    };
  }
}

/**
 * Bewerte Handbewegungsgeschwindigkeit
 */
function evaluateHandMovementSpeed(speed) {
  if (speed <= THRESHOLDS.HAND_MOVEMENT_SPEED.CALM) {
    return {
      value: speed,
      status: 'calm',
      score: 1.0,
      description: 'Ruhige Handbewegungen'
    };
  } else if (speed <= THRESHOLDS.HAND_MOVEMENT_SPEED.MODERATE) {
    return {
      value: speed,
      status: 'moderate',
      score: 0.9,
      description: 'Moderate Handbewegungen'
    };
  } else if (speed <= THRESHOLDS.HAND_MOVEMENT_SPEED.ACTIVE) {
    return {
      value: speed,
      status: 'active',
      score: 0.7,
      description: 'Aktive Handbewegungen'
    };
  } else {
    return {
      value: speed,
      status: 'very_active',
      score: 0.5,
      description: 'Sehr aktive Handbewegungen'
    };
  }
}

/**
 * Bewerte Handgesten
 */
function evaluateHandGestures(leftGesture, rightGesture) {
  const gestures = [];
  
  if (leftGesture) {
    gestures.push({ hand: 'left', gesture: leftGesture });
  }
  if (rightGesture) {
    gestures.push({ hand: 'right', gesture: rightGesture });
  }
  
  return {
    value: gestures,
    status: 'detected',
    score: 0.9,
    description: gestures.map(g => `${g.hand}: ${g.gesture}`).join(', ')
  };
}

/**
 * Bewerte Gestik/Handbewegungen
 */
function evaluateGestures(frequency) {
  if (frequency <= THRESHOLDS.GESTURE_FREQUENCY.MODERATE) {
    return {
      value: frequency,
      status: 'normal',
      score: 1.0,
      description: 'Ausgeglichene Gestik'
    };
  } else if (frequency <= THRESHOLDS.GESTURE_FREQUENCY.HIGH) {
    return {
      value: frequency,
      status: 'elevated',
      score: 0.7,
      description: 'Erhöhte Gestikfrequenz'
    };
  } else {
    return {
      value: frequency,
      status: 'high',
      score: 0.5,
      description: 'Sehr häufige Gestik'
    };
  }
}

/**
 * Bewerte Körperhaltung
 */
function evaluatePosture(angle) {
  const absAngle = Math.abs(angle);
  
  if (absAngle <= THRESHOLDS.POSTURE_ANGLE.GOOD_MAX) {
    return {
      value: angle,
      status: 'good',
      score: 1.0,
      description: 'Aufrechte Haltung'
    };
  } else if (absAngle <= THRESHOLDS.POSTURE_ANGLE.WARNING) {
    return {
      value: angle,
      status: 'acceptable',
      score: 0.7,
      description: 'Leicht geneigte Haltung'
    };
  } else {
    return {
      value: angle,
      status: 'poor',
      score: 0.4,
      description: 'Stark geneigte Haltung'
    };
  }
}

/**
 * Berechne Gesamt-Confidence Score
 */
function calculateOverallConfidence(evaluations) {
  const scores = evaluations.map(ev => ev.score);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  return Math.round(average * 100) / 100; // Runde auf 2 Dezimalstellen
}

/**
 * Exportiere Schwellenwerte für Tests
 */
export { THRESHOLDS };





