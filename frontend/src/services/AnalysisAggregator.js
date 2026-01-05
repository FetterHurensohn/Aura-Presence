/**
 * Analysis Aggregator Service
 * Aggregiert MediaPipe-Daten für ChatGPT-Analyse
 */

export class AnalysisAggregator {
  constructor() {
    this.dataBuffer = [];
    this.startTime = null;
    this.metrics = {
      eyeContact: [],
      facialExpressions: [],
      blinkRate: [],
      handGestures: [],
      handMovement: [],
      posture: [],
      headPose: []
    };
  }

  /**
   * Starte neue Aggregation
   */
  start() {
    this.startTime = Date.now();
    this.dataBuffer = [];
    this.metrics = {
      eyeContact: [],
      facialExpressions: [],
      blinkRate: [],
      handGestures: [],
      handMovement: [],
      posture: [],
      headPose: []
    };
  }

  /**
   * Füge neue Features hinzu
   */
  addFeatures(features) {
    if (!features || !this.startTime) return;

    const timestamp = Date.now() - this.startTime;
    
    // Speichere Rohdaten
    this.dataBuffer.push({
      timestamp,
      ...features
    });

    // Aggregiere Metriken für Auswertung
    if (features.eye_contact_quality !== undefined) {
      this.metrics.eyeContact.push(features.eye_contact_quality);
    }

    if (features.facial_expression) {
      this.metrics.facialExpressions.push(features.facial_expression);
    }

    if (features.blink_rate !== undefined) {
      this.metrics.blinkRate.push(features.blink_rate);
    }

    if (features.left_hand_gesture || features.right_hand_gesture) {
      const gestures = [];
      if (features.left_hand_gesture) gestures.push(`left:${features.left_hand_gesture}`);
      if (features.right_hand_gesture) gestures.push(`right:${features.right_hand_gesture}`);
      this.metrics.handGestures.push(gestures.join(','));
    }

    if (features.hand_movement_freq !== undefined || features.hand_movement_speed !== undefined) {
      const movement = features.hand_movement_freq || features.hand_movement_speed || 0;
      this.metrics.handMovement.push(movement);
    }

    if (features.posture_angle !== undefined) {
      this.metrics.posture.push(features.posture_angle);
    }

    if (features.head_pose) {
      this.metrics.headPose.push(features.head_pose);
    }
  }

  /**
   * Berechne durchschnittliche Scores
   */
  calculateScores() {
    const scores = {
      eyeContact: 0,
      facialExpression: 0,
      gestures: 0,
      posture: 0,
      overall: 0
    };

    // Augenkontakt Score (0-100)
    if (this.metrics.eyeContact.length > 0) {
      const avgEyeContact = this.metrics.eyeContact.reduce((a, b) => a + b, 0) / this.metrics.eyeContact.length;
      scores.eyeContact = Math.round(avgEyeContact * 100);
    }

    // Mimik Score (basierend auf Expression-Variabilität)
    if (this.metrics.facialExpressions.length > 0) {
      const uniqueExpressions = new Set(this.metrics.facialExpressions).size;
      const expressionScore = Math.min(1, uniqueExpressions / 3); // 3 verschiedene = 100%
      
      // Bonus für Lächeln
      const smilingCount = this.metrics.facialExpressions.filter(e => e === 'smiling').length;
      const smilingRatio = smilingCount / this.metrics.facialExpressions.length;
      
      scores.facialExpression = Math.round((expressionScore * 0.7 + smilingRatio * 0.3) * 100);
    }

    // Gestik Score (basierend auf Bewegung und Varietät)
    if (this.metrics.handGestures.length > 0 || this.metrics.handMovement.length > 0) {
      const uniqueGestures = new Set(this.metrics.handGestures).size;
      const gestureVariety = Math.min(1, uniqueGestures / 4); // 4 verschiedene = 100%
      
      const avgMovement = this.metrics.handMovement.length > 0
        ? this.metrics.handMovement.reduce((a, b) => a + b, 0) / this.metrics.handMovement.length
        : 0;
      const movementScore = Math.min(1, avgMovement * 10); // Normalisiere
      
      scores.gestures = Math.round((gestureVariety * 0.6 + movementScore * 0.4) * 100);
    }

    // Körperhaltung Score (basierend auf Aufrichtung)
    if (this.metrics.posture.length > 0) {
      const avgPosture = this.metrics.posture.reduce((a, b) => a + b, 0) / this.metrics.posture.length;
      // Idealwinkel ist 0° (aufrecht), Abweichung reduziert Score
      const postureScore = Math.max(0, 1 - Math.abs(avgPosture) / 30);
      scores.posture = Math.round(postureScore * 100);
    }

    // Overall Score
    const validScores = Object.values(scores).filter(s => s > 0);
    if (validScores.length > 0) {
      scores.overall = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    }

    return scores;
  }

  /**
   * Generiere strukturierte Zusammenfassung für ChatGPT
   */
  generateSummaryForChatGPT() {
    const duration = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
    const scores = this.calculateScores();

    // Berechne Statistiken
    const stats = {
      duration: Math.round(duration),
      totalFrames: this.dataBuffer.length,
      
      eyeContact: {
        average: scores.eyeContact,
        samples: this.metrics.eyeContact.length,
        min: this.metrics.eyeContact.length > 0 ? Math.min(...this.metrics.eyeContact) : 0,
        max: this.metrics.eyeContact.length > 0 ? Math.max(...this.metrics.eyeContact) : 0
      },
      
      blinking: {
        averageBlinksPerMinute: this.metrics.blinkRate.length > 0
          ? Math.round(this.metrics.blinkRate.reduce((a, b) => a + b, 0) / this.metrics.blinkRate.length)
          : 0,
        samples: this.metrics.blinkRate.length
      },
      
      facialExpressions: {
        distribution: this.getExpressionDistribution(),
        variety: new Set(this.metrics.facialExpressions).size,
        samples: this.metrics.facialExpressions.length
      },
      
      handGestures: {
        detected: this.metrics.handGestures.length,
        variety: new Set(this.metrics.handGestures).size,
        averageMovement: this.metrics.handMovement.length > 0
          ? (this.metrics.handMovement.reduce((a, b) => a + b, 0) / this.metrics.handMovement.length).toFixed(3)
          : 0
      },
      
      posture: {
        averageAngle: this.metrics.posture.length > 0
          ? Math.round(this.metrics.posture.reduce((a, b) => a + b, 0) / this.metrics.posture.length)
          : 0,
        stability: this.calculatePostureStability(),
        samples: this.metrics.posture.length
      },
      
      headMovement: {
        variety: this.metrics.headPose.length,
        samples: this.metrics.headPose.length
      }
    };

    // Generiere natürlichsprachige Beschreibung
    const summary = {
      scores,
      stats,
      insights: this.generateInsights(scores, stats),
      timestamp: new Date().toISOString()
    };

    return summary;
  }

  /**
   * Berechne Expression Distribution
   */
  getExpressionDistribution() {
    const distribution = {};
    this.metrics.facialExpressions.forEach(expr => {
      distribution[expr] = (distribution[expr] || 0) + 1;
    });
    
    // In Prozent umwandeln
    const total = this.metrics.facialExpressions.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = Math.round((distribution[key] / total) * 100);
    });
    
    return distribution;
  }

  /**
   * Berechne Körperhaltungs-Stabilität
   */
  calculatePostureStability() {
    if (this.metrics.posture.length < 2) return 100;
    
    // Berechne Standardabweichung
    const mean = this.metrics.posture.reduce((a, b) => a + b, 0) / this.metrics.posture.length;
    const variance = this.metrics.posture.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / this.metrics.posture.length;
    const stdDev = Math.sqrt(variance);
    
    // Je niedriger die Standardabweichung, desto stabiler
    const stability = Math.max(0, 100 - stdDev * 5);
    return Math.round(stability);
  }

  /**
   * Generiere Insights basierend auf Daten
   */
  generateInsights(scores, stats) {
    const insights = [];

    // Augenkontakt
    if (scores.eyeContact < 50) {
      insights.push({
        category: 'eyeContact',
        severity: 'warning',
        message: 'Augenkontakt könnte verbessert werden. Schaue öfter direkt in die Kamera.'
      });
    } else if (scores.eyeContact > 80) {
      insights.push({
        category: 'eyeContact',
        severity: 'success',
        message: 'Hervorragender Augenkontakt! Du hältst gut Blickkontakt.'
      });
    }

    // Blinzelrate
    if (stats.blinking.averageBlinksPerMinute < 10) {
      insights.push({
        category: 'blinking',
        severity: 'info',
        message: 'Du blinzelst sehr wenig. Das kann auf Anspannung hindeuten.'
      });
    } else if (stats.blinking.averageBlinksPerMinute > 30) {
      insights.push({
        category: 'blinking',
        severity: 'info',
        message: 'Erhöhte Blinzelrate. Versuche etwas ruhiger zu wirken.'
      });
    }

    // Mimik
    if (stats.facialExpressions.variety < 2) {
      insights.push({
        category: 'facialExpression',
        severity: 'warning',
        message: 'Deine Mimik ist sehr gleichförmig. Versuche mehr Emotionen zu zeigen.'
      });
    }

    const smilingPercentage = stats.facialExpressions.distribution.smiling || 0;
    if (smilingPercentage > 30) {
      insights.push({
        category: 'facialExpression',
        severity: 'success',
        message: 'Toll! Du lächelst oft und wirkst dadurch sehr sympathisch.'
      });
    }

    // Gestik
    if (stats.handGestures.variety < 2) {
      insights.push({
        category: 'gestures',
        severity: 'info',
        message: 'Versuche deine Hände variabler einzusetzen, um deine Aussagen zu unterstreichen.'
      });
    }

    // Körperhaltung
    if (Math.abs(stats.posture.averageAngle) > 15) {
      insights.push({
        category: 'posture',
        severity: 'warning',
        message: 'Achte auf eine aufrechte Körperhaltung. Du neigst dich etwas.'
      });
    }

    if (stats.posture.stability < 70) {
      insights.push({
        category: 'posture',
        severity: 'info',
        message: 'Deine Körperhaltung schwankt etwas. Versuche ruhiger zu stehen.'
      });
    }

    return insights;
  }

  /**
   * Reset Aggregator
   */
  reset() {
    this.dataBuffer = [];
    this.startTime = null;
    this.metrics = {
      eyeContact: [],
      facialExpressions: [],
      blinkRate: [],
      handGestures: [],
      handMovement: [],
      posture: [],
      headPose: []
    };
  }

  /**
   * Exportiere Daten für Backend
   */
  exportForBackend() {
    return {
      summary: this.generateSummaryForChatGPT(),
      rawData: this.dataBuffer.slice(-100) // Nur letzte 100 Frames
    };
  }
}

// Singleton exportieren
const analysisAggregator = new AnalysisAggregator();
export default analysisAggregator;

