/**
 * Voice Analyzer Service - Echtzeit-Sprachanalyse
 * 
 * Verwendet:
 * 1. Web Audio API + Meyda.js für Audio-Features (Lautstärke, Energie, Klarheit)
 * 2. Web Speech API für Speech-to-Text (Füllwörter, WPM, Pausen)
 * 
 * Features:
 * - Lautstärke (RMS)
 * - Pausen-Detektion
 * - Füllwörter-Erkennung
 * - Worte pro Minute (WPM)
 * - Sprechgeschwindigkeit
 * - Stimmklarheit
 * - Redefluss-Score
 */

import Meyda from 'meyda';

class VoiceAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyzer = null;
    this.recognition = null;
    this.isRunning = false;
    this.startTime = null;
    
    // Feature Storage
    this.features = {
      volume: [],            // RMS-Werte über Zeit
      energy: [],            // Energie-Werte
      clarity: [],           // Zero Crossing Rate
      pauses: [],            // Timestamps von Pausen
      words: [],             // Gesprochene Worte
      fillerWords: [],       // Füllwörter mit Timestamp
      transcripts: []        // Vollständige Transkripte
    };
    
    // Thresholds
    this.pauseThreshold = 0.01;  // RMS < 0.01 = Pause
    this.minPauseLength = 0.5;   // Min. 0.5 Sekunden für Pause
    
    // Aktuelle Pause
    this.currentPauseStart = null;
    
    // Füllwörter-Liste (Deutsch)
    this.fillerWordList = [
      'ähm', 'ehm', 'öhm',
      'also', 'halt', 'quasi',
      'sozusagen', 'irgendwie',
      'gewissermaßen', 'im prinzip',
      'praktisch', 'theoretisch',
      'einfach', 'genau', 'eben'
    ];
  }

  /**
   * Voice Analyzer initialisieren
   */
  async initialize(stream, language = 'de-DE') {
    if (this.isRunning) {
      console.warn('⚠️ VoiceAnalyzer already running');
      return;
    }

    try {
      console.log('🎤 Initializing Voice Analyzer...');
      
      this.startTime = Date.now();
      
      // 1. Web Audio API + Meyda Setup
      await this.initAudioAnalysis(stream);
      
      // 2. Web Speech API Setup
      await this.initSpeechRecognition(language);
      
      this.isRunning = true;
      console.log('✅ Voice Analyzer initialized');
      
    } catch (error) {
      console.error('❌ Voice Analyzer initialization failed:', error);
      throw error;
    }
  }

  /**
   * Audio Analysis mit Meyda initialisieren
   */
  async initAudioAnalysis(stream) {
    // Audio Context erstellen
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // MediaStream als Audio Source
    const source = this.audioContext.createMediaStreamSource(stream);
    
    // Meyda Analyzer erstellen
    this.analyzer = Meyda.createMeydaAnalyzer({
      audioContext: this.audioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: ['rms', 'energy', 'zcr', 'spectralCentroid'],
      callback: (features) => this.handleAudioFeatures(features)
    });
    
    // Start Analysis
    this.analyzer.start();
    console.log('✅ Audio Analysis started');
  }

  /**
   * Speech Recognition initialisieren
   */
  async initSpeechRecognition(language) {
    // Check Browser Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('⚠️ Speech Recognition not supported in this browser');
      return;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.lang = language;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    
    // Event Handlers
    this.recognition.onresult = (event) => this.handleSpeechResult(event);
    this.recognition.onerror = (event) => this.handleSpeechError(event);
    this.recognition.onend = () => {
      // Auto-restart wenn noch läuft
      if (this.isRunning) {
        this.recognition.start();
      }
    };
    
    // Start Recognition
    this.recognition.start();
    console.log('✅ Speech Recognition started');
  }

  /**
   * Audio Features verarbeiten (Meyda Callback)
   */
  handleAudioFeatures(features) {
    if (!this.isRunning) return;
    
    const now = Date.now();
    
    // 1. Lautstärke speichern
    this.features.volume.push({
      timestamp: now,
      value: features.rms || 0
    });
    
    // 2. Energie speichern
    this.features.energy.push({
      timestamp: now,
      value: features.energy || 0
    });
    
    // 3. Klarheit speichern (Zero Crossing Rate)
    this.features.clarity.push({
      timestamp: now,
      value: features.zcr || 0
    });
    
    // 4. Pausen-Detektion
    if (features.rms < this.pauseThreshold) {
      // Stille erkannt
      if (!this.currentPauseStart) {
        this.currentPauseStart = now;
      }
    } else {
      // Sprechen erkannt
      if (this.currentPauseStart) {
        const pauseLength = (now - this.currentPauseStart) / 1000;
        
        // Nur Pausen > minPauseLength speichern
        if (pauseLength >= this.minPauseLength) {
          this.features.pauses.push({
            start: this.currentPauseStart,
            end: now,
            length: pauseLength
          });
        }
        
        this.currentPauseStart = null;
      }
    }
    
    // Debug-Log (alle 2 Sekunden)
    if (Math.random() < 0.01) {
      console.log('🎤 Audio Features:', {
        rms: features.rms?.toFixed(3),
        energy: features.energy?.toFixed(3),
        zcr: features.zcr?.toFixed(3),
        pauses: this.features.pauses.length
      });
    }
  }

  /**
   * Speech Recognition Result verarbeiten
   */
  handleSpeechResult(event) {
    if (!this.isRunning) return;
    
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    const confidence = result[0].confidence;
    const isFinal = result.isFinal;
    
    // Nur finale Ergebnisse speichern
    if (isFinal) {
      const now = Date.now();
      
      // 1. Transkript speichern
      this.features.transcripts.push({
        timestamp: now,
        text: transcript,
        confidence: confidence
      });
      
      // 2. Worte extrahieren
      const words = transcript.trim().split(/\s+/);
      words.forEach(word => {
        this.features.words.push({
          timestamp: now,
          word: word.toLowerCase()
        });
      });
      
      // 3. Füllwörter erkennen
      this.fillerWordList.forEach(filler => {
        if (transcript.toLowerCase().includes(filler)) {
          this.features.fillerWords.push({
            timestamp: now,
            word: filler,
            context: transcript
          });
        }
      });
      
      // Debug-Log
      console.log('🗣️ Speech:', {
        transcript: transcript,
        confidence: (confidence * 100).toFixed(0) + '%',
        fillerWords: this.features.fillerWords.length,
        totalWords: this.features.words.length
      });
    }
  }

  /**
   * Speech Recognition Error Handler
   */
  handleSpeechError(event) {
    console.error('❌ Speech Recognition error:', event.error);
    
    // Bei "no-speech" einfach weitermachen
    if (event.error === 'no-speech') {
      return;
    }
    
    // Bei anderen Fehlern: Restart
    if (this.isRunning) {
      setTimeout(() => {
        try {
          this.recognition.start();
        } catch (err) {
          console.error('Failed to restart recognition:', err);
        }
      }, 1000);
    }
  }

  /**
   * Analyse-Daten abrufen (für UI-Updates)
   */
  getRealtimeAnalysis() {
    const now = Date.now();
    const elapsedMinutes = (now - this.startTime) / 60000;
    
    // Durchschnittliche Lautstärke
    const avgVolume = this.calculateAverage(this.features.volume);
    
    // Durchschnittliche Energie
    const avgEnergy = this.calculateAverage(this.features.energy);
    
    // Durchschnittliche Klarheit
    const avgClarity = this.calculateAverage(this.features.clarity);
    
    // Worte pro Minute
    const wordsPerMinute = elapsedMinutes > 0 
      ? this.features.words.length / elapsedMinutes 
      : 0;
    
    // Füllwörter-Rate (pro Minute)
    const fillerWordsPerMinute = elapsedMinutes > 0
      ? this.features.fillerWords.length / elapsedMinutes
      : 0;
    
    // Pausen-Statistik
    const pauseStats = this.calculatePauseStats();
    
    // Speech Flow Score berechnen
    const speechFlowScore = this.calculateSpeechFlowScore(
      wordsPerMinute,
      fillerWordsPerMinute,
      pauseStats
    );
    
    return {
      volume: {
        current: this.features.volume.length > 0 
          ? this.features.volume[this.features.volume.length - 1].value 
          : 0,
        average: avgVolume,
        score: this.calculateVolumeScore(avgVolume)
      },
      energy: {
        average: avgEnergy,
        score: this.calculateEnergyScore(avgEnergy)
      },
      clarity: {
        average: avgClarity,
        score: this.calculateClarityScore(avgClarity)
      },
      speech: {
        wordsPerMinute: Math.round(wordsPerMinute),
        fillerWordsPerMinute: fillerWordsPerMinute.toFixed(1),
        fillerWordCount: this.features.fillerWords.length,
        totalWords: this.features.words.length,
        score: this.calculateSpeechScore(wordsPerMinute, fillerWordsPerMinute)
      },
      pauses: pauseStats,
      overall: speechFlowScore
    };
  }

  /**
   * Finale Analyse-Daten für Backend/ChatGPT
   */
  exportForBackend() {
    const analysis = this.getRealtimeAnalysis();
    
    return {
      voice: {
        volume: analysis.volume,
        energy: analysis.energy,
        clarity: analysis.clarity,
        speech: analysis.speech,
        pauses: analysis.pauses,
        overall: analysis.overall,
        flags: this.generateFlags(analysis)
      },
      raw: {
        transcripts: this.features.transcripts,
        fillerWords: this.features.fillerWords
      }
    };
  }

  /**
   * Durchschnitt berechnen
   */
  calculateAverage(dataArray) {
    if (dataArray.length === 0) return 0;
    
    const sum = dataArray.reduce((acc, item) => acc + item.value, 0);
    return sum / dataArray.length;
  }

  /**
   * Pausen-Statistik berechnen
   */
  calculatePauseStats() {
    if (this.features.pauses.length === 0) {
      return {
        count: 0,
        averageLength: 0,
        longestPause: 0,
        score: 100
      };
    }
    
    const lengths = this.features.pauses.map(p => p.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const longestPause = Math.max(...lengths);
    
    // Score: Ideal sind 1-2 Sekunden Pausen
    let score = 100;
    if (avgLength < 0.5) score -= 10;  // Zu kurze Pausen
    if (avgLength > 3) score -= 20;    // Zu lange Pausen
    if (longestPause > 5) score -= 15; // Sehr lange Pause
    
    return {
      count: this.features.pauses.length,
      averageLength: avgLength.toFixed(1),
      longestPause: longestPause.toFixed(1),
      score: Math.max(0, score)
    };
  }

  /**
   * Speech Flow Score berechnen (0-100)
   */
  calculateSpeechFlowScore(wpm, fwpm, pauseStats) {
    let score = 100;
    
    // WPM: Optimal 120-160
    if (wpm < 100) score -= 15;       // Zu langsam
    if (wpm > 180) score -= 20;       // Zu schnell
    if (wpm < 80) score -= 25;        // Sehr langsam
    if (wpm > 200) score -= 30;       // Sehr schnell
    
    // Füllwörter: < 3 pro Minute ist gut
    if (fwpm > 3) score -= 10;
    if (fwpm > 5) score -= 20;
    if (fwpm > 8) score -= 30;
    
    // Pausen-Score einbeziehen
    score = (score + pauseStats.score) / 2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Lautstärke-Score berechnen (0-100)
   */
  calculateVolumeScore(avgVolume) {
    // Optimal: 0.3 - 0.6
    let score = 100;
    
    if (avgVolume < 0.2) score = 60;   // Zu leise
    if (avgVolume < 0.1) score = 40;   // Sehr leise
    if (avgVolume > 0.7) score = 70;   // Zu laut
    if (avgVolume > 0.8) score = 50;   // Sehr laut
    
    return score;
  }

  /**
   * Energie-Score berechnen (0-100)
   */
  calculateEnergyScore(avgEnergy) {
    // Höhere Energie = besser (bis 0.8)
    if (avgEnergy < 0.2) return 50;
    if (avgEnergy < 0.4) return 70;
    if (avgEnergy < 0.8) return 90;
    return 100;
  }

  /**
   * Klarheits-Score berechnen (0-100)
   */
  calculateClarityScore(avgClarity) {
    // Höherer ZCR = klarer
    if (avgClarity < 0.3) return 60;
    if (avgClarity < 0.5) return 80;
    return 100;
  }

  /**
   * Speech-Score berechnen (0-100)
   */
  calculateSpeechScore(wpm, fwpm) {
    let score = 100;
    
    // WPM
    if (wpm < 100 || wpm > 180) score -= 15;
    if (wpm < 80 || wpm > 200) score -= 30;
    
    // Füllwörter
    if (fwpm > 3) score -= 15;
    if (fwpm > 5) score -= 30;
    
    return Math.max(0, score);
  }

  /**
   * Flags für auffällige Features generieren
   */
  generateFlags(analysis) {
    const flags = [];
    
    if (analysis.volume.score < 60) flags.push('ZU_LEISE');
    if (analysis.volume.score < 60 && analysis.volume.average > 0.7) flags.push('ZU_LAUT');
    if (analysis.speech.wordsPerMinute < 100) flags.push('ZU_LANGSAM');
    if (analysis.speech.wordsPerMinute > 180) flags.push('ZU_SCHNELL');
    if (analysis.speech.fillerWordsPerMinute > 5) flags.push('VIELE_FUELLWOERTER');
    if (analysis.pauses.averageLength > 3) flags.push('LANGE_PAUSEN');
    if (analysis.pauses.count < 5 && this.features.words.length > 100) flags.push('WENIGE_PAUSEN');
    
    return flags;
  }

  /**
   * Analyzer stoppen
   */
  stop() {
    console.log('🛑 Stopping Voice Analyzer...');
    
    this.isRunning = false;
    
    // Meyda stoppen
    if (this.analyzer) {
      this.analyzer.stop();
      this.analyzer = null;
    }
    
    // Audio Context schließen
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Speech Recognition stoppen
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    
    console.log('✅ Voice Analyzer stopped');
  }

  /**
   * Reset (für neue Session)
   */
  reset() {
    this.stop();
    
    this.features = {
      volume: [],
      energy: [],
      clarity: [],
      pauses: [],
      words: [],
      fillerWords: [],
      transcripts: []
    };
    
    this.currentPauseStart = null;
    this.startTime = null;
  }
}

// Singleton Export
export default new VoiceAnalyzer();

