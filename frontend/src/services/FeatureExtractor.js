/**
 * Feature Extractor - Extraktion strukturierter Features aus MediaPipe-Ergebnissen
 * 
 * Unterstützt Pose, Face Mesh und Hands
 */

/**
 * Pose Feature-Extraktion
 */
export class PoseFeatureExtractor {
  constructor() {
    this.previousLandmarks = null;
    this.handMovementHistory = [];
    this.frameCount = 0;
  }

  /**
   * Extrahiere strukturierte Features aus Pose-Landmarks
   */
  extract(results) {
    if (!results.poseLandmarks) {
      return null;
    }

    const landmarks = results.poseLandmarks;
    this.frameCount++;

    const handMovement = this.calculateHandMovement(landmarks);
    const postureAngle = this.calculatePostureAngle(landmarks);

    const features = {
      hand_movement_freq: handMovement,
      posture_angle: postureAngle,
      pose_confidence: results.poseLandmarks ? 1.0 : 0.0
    };

    this.previousLandmarks = landmarks;

    return features;
  }

  /**
   * Berechne Handbewegungsfrequenz (über Wrist-Position)
   */
  calculateHandMovement(landmarks) {
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (!leftWrist || !rightWrist || !this.previousLandmarks) {
      return 0;
    }

    const prevLeftWrist = this.previousLandmarks[15];
    const prevRightWrist = this.previousLandmarks[16];

    const leftMovement = this.distance3D(leftWrist, prevLeftWrist);
    const rightMovement = this.distance3D(rightWrist, prevRightWrist);

    const totalMovement = leftMovement + rightMovement;

    this.handMovementHistory.push(totalMovement);
    if (this.handMovementHistory.length > 30) {
      this.handMovementHistory.shift();
    }

    const avgMovement = this.handMovementHistory.reduce((a, b) => a + b, 0) / 
                        this.handMovementHistory.length;

    return Math.round(avgMovement * 100) / 100;
  }

  /**
   * Berechne Körperhaltungswinkel (Grad)
   */
  calculatePostureAngle(landmarks) {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return 0;
    }

    const shoulderMid = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };

    const hipMid = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const dx = hipMid.x - shoulderMid.x;
    const dy = hipMid.y - shoulderMid.y;

    const angle = Math.atan2(dx, dy) * (180 / Math.PI);

    return Math.round(angle);
  }

  /**
   * 3D Distanz zwischen zwei Landmarks
   */
  distance3D(p1, p2) {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2)
    );
  }

  /**
   * Reset Historie
   */
  reset() {
    this.previousLandmarks = null;
    this.handMovementHistory = [];
    this.frameCount = 0;
  }
}

/**
 * Face Mesh Feature-Extraktion
 */
export class FaceMeshFeatureExtractor {
  constructor() {
    this.blinkHistory = [];
    this.frameCount = 0;
    this.previousEyeAspectRatio = { left: 1.0, right: 1.0 };
  }

  /**
   * Extrahiere strukturierte Features aus Face Mesh Landmarks
   */
  extract(results) {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      return null;
    }

    const landmarks = results.multiFaceLandmarks[0]; // Erste erkannte Person
    this.frameCount++;

    const eyeContactQuality = this.estimateEyeContact(landmarks);
    const blinkRate = this.estimateBlinkRate(landmarks);
    const facialExpression = this.detectFacialExpression(landmarks);
    const headPose = this.calculateHeadPose(landmarks);

    const features = {
      eye_contact_quality: eyeContactQuality,
      blink_rate: blinkRate,
      facial_expression: facialExpression,
      head_pose: headPose,
      face_confidence: 1.0
    };

    return features;
  }

  /**
   * Schätze Augenkontakt-Qualität (0-1)
   * Basiert auf Iris-Landmarks (468-478 für linkes Auge, 473-478 für rechtes)
   */
  estimateEyeContact(landmarks) {
    // Verwende die Nose Tip (4) und beide Augen-Center-Landmarks
    const noseTip = landmarks[4];
    const leftEyeCenter = landmarks[468]; // Left iris center
    const rightEyeCenter = landmarks[473]; // Right iris center

    if (!noseTip || !leftEyeCenter || !rightEyeCenter) {
      // Fallback auf normale Eye Landmarks
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      
      if (!leftEye || !rightEye) return 0.5;

      // Z-Koordinate prüfen (frontal = höherer Score)
      const eyeZ = (leftEye.z + rightEye.z) / 2;
      const noseZ = noseTip.z;
      const zDiff = Math.abs(noseZ - eyeZ);
      
      return Math.max(0, Math.min(1, 1 - zDiff * 10));
    }

    // Berechne Pupillen-Position relativ zum Auge
    // Wenn Pupillen zentriert sind = guter Augenkontakt
    const leftIrisX = leftEyeCenter.x;
    const rightIrisX = rightEyeCenter.x;
    
    const leftOuterCorner = landmarks[33];
    const leftInnerCorner = landmarks[133];
    const rightOuterCorner = landmarks[263];
    const rightInnerCorner = landmarks[362];

    if (!leftOuterCorner || !leftInnerCorner || !rightOuterCorner || !rightInnerCorner) {
      return 0.5;
    }

    // Berechne wie zentral die Iris ist (0 = perfekt zentriert)
    const leftEyeWidth = Math.abs(leftOuterCorner.x - leftInnerCorner.x);
    const leftEyeCenterX = (leftOuterCorner.x + leftInnerCorner.x) / 2;
    const leftDeviation = Math.abs(leftIrisX - leftEyeCenterX) / leftEyeWidth;

    const rightEyeWidth = Math.abs(rightOuterCorner.x - rightInnerCorner.x);
    const rightEyeCenterX = (rightOuterCorner.x + rightInnerCorner.x) / 2;
    const rightDeviation = Math.abs(rightIrisX - rightEyeCenterX) / rightEyeWidth;

    const avgDeviation = (leftDeviation + rightDeviation) / 2;

    // Je geringer die Abweichung, desto besser der Augenkontakt
    const eyeContactScore = Math.max(0, Math.min(1, 1 - avgDeviation * 2));

    return Math.round(eyeContactScore * 100) / 100;
  }

  /**
   * Schätze Blinzelrate (pro Minute) - Eye Aspect Ratio Method
   */
  estimateBlinkRate(landmarks) {
    const leftEAR = this.calculateEyeAspectRatio(
      landmarks[33],  // left eye outer
      landmarks[133], // left eye inner
      landmarks[159], // left eye top
      landmarks[145]  // left eye bottom
    );

    const rightEAR = this.calculateEyeAspectRatio(
      landmarks[263], // right eye outer
      landmarks[362], // right eye inner
      landmarks[386], // right eye top
      landmarks[374]  // right eye bottom
    );

    const avgEAR = (leftEAR + rightEAR) / 2;

    // Blink erkannt wenn EAR unter Threshold (z.B. 0.2)
    const BLINK_THRESHOLD = 0.2;
    if (avgEAR < BLINK_THRESHOLD && 
        this.previousEyeAspectRatio.left > BLINK_THRESHOLD &&
        this.previousEyeAspectRatio.right > BLINK_THRESHOLD) {
      this.blinkHistory.push(this.frameCount);
    }

    this.previousEyeAspectRatio = { left: leftEAR, right: rightEAR };

    // Berechne Blinks in letzten 60 Frames (ca. 4 Sekunden bei 15 FPS)
    const recentBlinks = this.blinkHistory.filter(
      frame => this.frameCount - frame < 60
    );
    this.blinkHistory = recentBlinks;

    // Hochrechnen auf 1 Minute
    const blinksPerMinute = (recentBlinks.length / 4) * 60;

    return Math.round(blinksPerMinute);
  }

  /**
   * Berechne Eye Aspect Ratio (EAR)
   */
  calculateEyeAspectRatio(outer, inner, top, bottom) {
    if (!outer || !inner || !top || !bottom) return 1.0;

    const horizontal = Math.sqrt(
      Math.pow(outer.x - inner.x, 2) +
      Math.pow(outer.y - inner.y, 2)
    );

    const vertical = Math.sqrt(
      Math.pow(top.x - bottom.x, 2) +
      Math.pow(top.y - bottom.y, 2)
    );

    const ear = vertical / (2.0 * horizontal);
    return ear;
  }

  /**
   * Erkenne Gesichtsausdruck
   */
  detectFacialExpression(landmarks) {
    // Einfache Erkennung basierend auf Mundöffnung und Augenbrauen
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const leftEyebrow = landmarks[70];
    const rightEyebrow = landmarks[300];
    const noseTip = landmarks[4];

    if (!upperLip || !lowerLip) return 'neutral';

    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);

    // Lächeln: Mundwinkel oben
    const leftMouthCorner = landmarks[61];
    const rightMouthCorner = landmarks[291];
    
    if (!leftMouthCorner || !rightMouthCorner) return 'neutral';

    const mouthCornersY = (leftMouthCorner.y + rightMouthCorner.y) / 2;
    const mouthCenterY = (upperLip.y + lowerLip.y) / 2;

    if (mouthCornersY < mouthCenterY - 0.01) {
      return 'smiling';
    }

    // Mund weit offen: sprechen oder überrascht
    if (mouthHeight > 0.03) {
      return 'speaking';
    }

    // Stirnrunzeln: Augenbrauen unten
    if (leftEyebrow && rightEyebrow && noseTip) {
      const eyebrowsY = (leftEyebrow.y + rightEyebrow.y) / 2;
      if (eyebrowsY > noseTip.y - 0.15) {
        return 'frowning';
      }
    }

    return 'neutral';
  }

  /**
   * Berechne Kopfhaltung (Pitch, Yaw, Roll in Grad)
   */
  calculateHeadPose(landmarks) {
    // Verwende Nase, Kinn, und Stirn-Landmarks
    const noseTip = landmarks[4];
    const chin = landmarks[152];
    const forehead = landmarks[10];
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];

    if (!noseTip || !chin || !forehead || !leftEar || !rightEar) {
      return { pitch: 0, yaw: 0, roll: 0 };
    }

    // Pitch (Nicken): Vertikal - Nase vs Kinn
    const pitchAngle = Math.atan2(
      noseTip.y - chin.y,
      noseTip.z - chin.z
    ) * (180 / Math.PI);

    // Yaw (Kopfschütteln): Horizontal - Nase vs Ohren
    const earMidX = (leftEar.x + rightEar.x) / 2;
    const yawAngle = (noseTip.x - earMidX) * 50; // Simplified yaw estimation

    // Roll (Neigung): Ohren-Asymmetrie
    const rollAngle = Math.atan2(
      leftEar.y - rightEar.y,
      leftEar.x - rightEar.x
    ) * (180 / Math.PI);

    return {
      pitch: Math.round(pitchAngle),
      yaw: Math.round(yawAngle),
      roll: Math.round(rollAngle)
    };
  }

  /**
   * Reset Historie
   */
  reset() {
    this.blinkHistory = [];
    this.frameCount = 0;
    this.previousEyeAspectRatio = { left: 1.0, right: 1.0 };
  }
}

/**
 * Hands Feature-Extraktion
 */
export class HandsFeatureExtractor {
  constructor() {
    this.previousHands = null;
    this.movementHistory = [];
    this.frameCount = 0;
  }

  /**
   * Extrahiere strukturierte Features aus Hands Landmarks
   */
  extract(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    this.frameCount++;

    const handsDetected = [];
    const gestures = {};
    let totalMovementSpeed = 0;

    // Verarbeite alle erkannten Hände
    results.multiHandLandmarks.forEach((handLandmarks, index) => {
      const handedness = results.multiHandedness?.[index]?.label || 'Unknown';
      const handLabel = handedness === 'Left' ? 'left' : 'right';

      handsDetected.push(handLabel);

      // Erkenne Geste
      const gesture = this.recognizeGesture(handLandmarks);
      gestures[`${handLabel}_hand_gesture`] = gesture;

      // Berechne Bewegungsgeschwindigkeit
      if (this.previousHands && this.previousHands[handLabel]) {
        const movement = this.calculateHandMovementSpeed(
          handLandmarks,
          this.previousHands[handLabel]
        );
        totalMovementSpeed += movement;
      }
    });

    // Historie aktualisieren
    if (!this.previousHands) {
      this.previousHands = {};
    }

    results.multiHandLandmarks.forEach((handLandmarks, index) => {
      const handedness = results.multiHandedness?.[index]?.label || 'Unknown';
      const handLabel = handedness === 'Left' ? 'left' : 'right';
      this.previousHands[handLabel] = handLandmarks;
    });

    const avgMovementSpeed = handsDetected.length > 0 
      ? totalMovementSpeed / handsDetected.length 
      : 0;

    const features = {
      hands_detected: handsDetected,
      ...gestures,
      hand_movement_speed: Math.round(avgMovementSpeed * 100) / 100,
      hands_confidence: 1.0
    };

    return features;
  }

  /**
   * Erkenne Handgeste
   */
  recognizeGesture(landmarks) {
    // Fingerspitzen und Knöchel
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const thumbMCP = landmarks[2];
    const indexMCP = landmarks[5];
    const middleMCP = landmarks[9];
    const ringMCP = landmarks[13];
    const pinkyMCP = landmarks[17];

    const wrist = landmarks[0];

    // Prüfe welche Finger ausgestreckt sind
    const thumbExtended = thumbTip.y < thumbMCP.y;
    const indexExtended = indexTip.y < indexMCP.y;
    const middleExtended = middleTip.y < middleMCP.y;
    const ringExtended = ringTip.y < ringMCP.y;
    const pinkyExtended = pinkyTip.y < pinkyMCP.y;

    const extendedCount = [
      thumbExtended,
      indexExtended,
      middleExtended,
      ringExtended,
      pinkyExtended
    ].filter(Boolean).length;

    // Offene Hand: Alle Finger ausgestreckt
    if (extendedCount >= 4) {
      return 'open';
    }

    // Faust: Alle Finger eingezogen
    if (extendedCount <= 1) {
      return 'closed';
    }

    // Zeigefinger: Nur Index ausgestreckt
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return 'pointing';
    }

    // Victory/Peace: Index und Mittelfinger ausgestreckt
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return 'peace';
    }

    // OK-Zeichen: Daumen und Zeigefinger berühren sich
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    if (thumbIndexDistance < 0.05 && middleExtended && ringExtended && pinkyExtended) {
      return 'ok';
    }

    return 'other';
  }

  /**
   * Berechne Handbewegungsgeschwindigkeit
   */
  calculateHandMovementSpeed(currentLandmarks, previousLandmarks) {
    // Verwende Wrist (0) als Referenzpunkt
    const currentWrist = currentLandmarks[0];
    const previousWrist = previousLandmarks[0];

    const distance = Math.sqrt(
      Math.pow(currentWrist.x - previousWrist.x, 2) +
      Math.pow(currentWrist.y - previousWrist.y, 2) +
      Math.pow(currentWrist.z - previousWrist.z, 2)
    );

    return distance;
  }

  /**
   * Reset Historie
   */
  reset() {
    this.previousHands = null;
    this.movementHistory = [];
    this.frameCount = 0;
  }
}

/**
 * Unified Feature Extractor - Kombiniert alle MediaPipe-Lösungen
 */
export class UnifiedFeatureExtractor {
  constructor() {
    this.poseExtractor = new PoseFeatureExtractor();
    this.faceExtractor = new FaceMeshFeatureExtractor();
    this.handsExtractor = new HandsFeatureExtractor();
  }

  /**
   * Extrahiere Features aus allen verfügbaren MediaPipe-Ergebnissen
   */
  extractUnified(poseResults, faceMeshResults, handsResults) {
    const features = {
      frame_timestamp: Date.now()
    };

    // Pose Features
    if (poseResults) {
      const poseFeatures = this.poseExtractor.extract(poseResults);
      if (poseFeatures) {
        Object.assign(features, poseFeatures);
      }
    }

    // Face Mesh Features
    if (faceMeshResults) {
      const faceFeatures = this.faceExtractor.extract(faceMeshResults);
      if (faceFeatures) {
        Object.assign(features, faceFeatures);
      }
    }

    // Hands Features
    if (handsResults) {
      const handsFeatures = this.handsExtractor.extract(handsResults);
      if (handsFeatures) {
        Object.assign(features, handsFeatures);
      }
    }

    // Berechne Gesamt-Confidence
    const confidences = [];
    if (features.pose_confidence !== undefined) confidences.push(features.pose_confidence);
    if (features.face_confidence !== undefined) confidences.push(features.face_confidence);
    if (features.hands_confidence !== undefined) confidences.push(features.hands_confidence);

    features.confidence = confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0.0;

    return features;
  }

  /**
   * Reset alle Extractors
   */
  reset() {
    this.poseExtractor.reset();
    this.faceExtractor.reset();
    this.handsExtractor.reset();
  }
}

