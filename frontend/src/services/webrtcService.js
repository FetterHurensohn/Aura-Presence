/**
 * WebRTC Service - Für zukünftige Peer-to-Peer Video-Streaming
 * 
 * Aktuell verwendet die App die lokale Kamera.
 * Dieser Service ist vorbereitet für WebRTC-basiertes Streaming
 * (z.B. für Remote-Coaching-Szenarien)
 */

import { io } from 'socket.io-client';

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.roomId = null;
    
    // STUN/TURN Server Konfiguration
    // Development: Nur STUN
    // Production: STUN + TURN (Metered.ca)
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;
    
    const iceServers = [
      {
        urls: 'stun:stun.l.google.com:19302' // Public STUN-Server
      }
    ];
    
    // Add TURN servers if credentials are available (Production)
    if (turnUsername && turnCredential) {
      iceServers.push(
        {
          urls: 'turn:a.relay.metered.ca:80',
          username: turnUsername,
          credential: turnCredential
        },
        {
          urls: 'turn:a.relay.metered.ca:80?transport=tcp',
          username: turnUsername,
          credential: turnCredential
        },
        {
          urls: 'turn:a.relay.metered.ca:443',
          username: turnUsername,
          credential: turnCredential
        },
        {
          urls: 'turns:a.relay.metered.ca:443?transport=tcp',
          username: turnUsername,
          credential: turnCredential
        }
      );
    }
    
    this.iceServers = { iceServers };
  }

  /**
   * Socket.IO Verbindung herstellen
   */
  connect() {
    if (this.socket?.connected) {
      console.log('Socket bereits verbunden');
      return;
    }

    // Remove trailing slash if present
    const backendUrl = import.meta.env.VITE_BACKEND_URL 
      || (import.meta.env.PROD 
          ? 'https://aura-presence-backend-production.up.railway.app'
          : 'http://localhost:3001');
    
    const serverUrl = backendUrl.replace(/\/$/, '');
    
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupSocketListeners();

    console.log('✓ Socket.IO Verbindung wird hergestellt...');
  }

  /**
   * Socket Event Listener einrichten
   */
  setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('✓ Socket verbunden:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Socket getrennt');
    });

    this.socket.on('user-joined', (userId) => {
      console.log('Benutzer beigetreten:', userId);
      // Bei Bedarf: Offer erstellen und senden
    });

    this.socket.on('offer', async (data) => {
      console.log('Offer erhalten von:', data.from);
      await this.handleOffer(data.offer, data.from);
    });

    this.socket.on('answer', async (data) => {
      console.log('Answer erhalten von:', data.from);
      await this.handleAnswer(data.answer);
    });

    this.socket.on('ice-candidate', async (data) => {
      console.log('ICE Candidate erhalten');
      await this.handleIceCandidate(data.candidate);
    });
  }

  /**
   * Raum beitreten
   */
  joinRoom(roomId) {
    if (!this.socket) {
      throw new Error('Socket nicht verbunden');
    }

    this.roomId = roomId;
    this.socket.emit('join-room', roomId);
    console.log(`✓ Raum ${roomId} beigetreten`);
  }

  /**
   * WebRTC Peer Connection initialisieren
   */
  async initializePeerConnection(localStream) {
    this.localStream = localStream;

    this.peerConnection = new RTCPeerConnection(this.iceServers);

    // Lokale Tracks hinzufügen
    localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, localStream);
    });

    // ICE Candidate Handler
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.emit('ice-candidate', {
          to: this.roomId,
          candidate: event.candidate
        });
      }
    };

    // Remote Track Handler
    this.peerConnection.ontrack = (event) => {
      console.log('Remote Track erhalten');
      this.remoteStream = event.streams[0];
      
      // Event für UI-Update auslösen
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // Connection State Monitoring
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection State:', this.peerConnection.connectionState);
    };

    console.log('✓ Peer Connection initialisiert');
  }

  /**
   * Offer erstellen und senden
   */
  async createOffer(targetUserId) {
    if (!this.peerConnection) {
      throw new Error('Peer Connection nicht initialisiert');
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('offer', {
      to: targetUserId,
      offer: offer
    });

    console.log('✓ Offer gesendet');
  }

  /**
   * Offer empfangen und Answer senden
   */
  async handleOffer(offer, fromUserId) {
    if (!this.peerConnection) {
      throw new Error('Peer Connection nicht initialisiert');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.socket.emit('answer', {
      to: fromUserId,
      answer: answer
    });

    console.log('✓ Answer gesendet');
  }

  /**
   * Answer empfangen
   */
  async handleAnswer(answer) {
    if (!this.peerConnection) {
      throw new Error('Peer Connection nicht initialisiert');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('✓ Answer verarbeitet');
  }

  /**
   * ICE Candidate empfangen
   */
  async handleIceCandidate(candidate) {
    if (!this.peerConnection) {
      console.warn('Peer Connection nicht bereit für ICE Candidate');
      return;
    }

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  /**
   * Remote Stream Callback setzen
   */
  setRemoteStreamCallback(callback) {
    this.onRemoteStream = callback;
  }

  /**
   * Verbindung trennen und aufräumen
   */
  disconnect() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.remoteStream = null;
    this.roomId = null;

    console.log('✓ WebRTC Service disconnected');
  }
}

// Singleton Export
const webrtcService = new WebRTCService();

export default webrtcService;

/**
 * TODO für Production:
 * 
 * 1. TURN Server einrichten (z.B. coturn, twilio)
 * 2. Signaling-Server absichern (Auth-Token für Socket.IO)
 * 3. Bandwidth-Management (adaptives Bitrate)
 * 4. Reconnection-Logic verbessern
 * 5. Error Handling und User Notifications
 * 6. Network Quality Monitoring
 */

